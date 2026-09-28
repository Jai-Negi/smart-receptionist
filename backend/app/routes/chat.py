from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.services.chat_service import ChatService
from firebase_admin import firestore
import logging
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)

# Simple rate limiting (in-memory)
rate_limit_store = defaultdict(list)
RATE_LIMIT = 30  # messages per minute
RATE_WINDOW = 60  # seconds

class ChatMessage(BaseModel):
    message: str
    chat_history: list = []

class ChatResponse(BaseModel):
    response: str
    confidence: float
    grounded: bool

def check_rate_limit(project_id: str, ip: str) -> bool:
    """Check rate limit for project + IP"""
    key = f"{project_id}:{ip}"
    now = datetime.now()
    
    # Clean old timestamps
    rate_limit_store[key] = [
        ts for ts in rate_limit_store[key] 
        if (now - ts).total_seconds() < RATE_WINDOW
    ]
    
    # Check if exceeded
    if len(rate_limit_store[key]) >= RATE_LIMIT:
        return False
    
    # Add current request
    rate_limit_store[key].append(now)
    return True

@router.post("/api/chat/{project_id}")
async def chat_with_project(project_id: str, request: Request, message: ChatMessage):
    """Chat with a project's AI receptionist (public endpoint)"""
    
    try:
        # Verify project exists
        project_doc = db.collection('projects').document(project_id).get()
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project_doc.to_dict()
        if project_data.get("status") != "processing":
            raise HTTPException(status_code=400, detail="Project is still processing")
        
        # Rate limiting
        client_ip = request.client.host if request.client else "unknown"
        if not check_rate_limit(project_id, client_ip):
            raise HTTPException(
                status_code=429, 
                detail="Rate limit exceeded. Max 30 messages per minute."
            )
        
        # Process chat through layers
        chat_service = ChatService()
        response = await chat_service.process_message(
            message.message,
            message.chat_history
        )
        
        # Save to Firestore (async, don't wait)
        db.collection('projects').document(project_id).collection('messages').add({
            'userMessage': message.message,
            'assistantResponse': response['response'],
            'confidence': response['confidence'],
            'timestamp': firestore.SERVER_TIMESTAMP,
        })
        
        return ChatResponse(
            response=response['response'],
            confidence=response['confidence'],
            grounded=response['grounded']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/chat")
async def chat_legacy(request: Request, message: ChatMessage):
    """Legacy endpoint for backward compatibility"""
    chat_service = ChatService()
    response = await chat_service.process_message(
        message.message,
        message.chat_history
    )
    
    return ChatResponse(
        response=response['response'],
        confidence=response['confidence'],
        grounded=response['grounded']
    )
