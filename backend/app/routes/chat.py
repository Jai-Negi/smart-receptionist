"""
Chat endpoint - POST /api/chat
Handles chat requests using the 5-layer architecture
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import sys
sys.path.append('app')
from services.chat_service import ChatService, ChatRequest, ChatResponse

# Initialize router
router = APIRouter(prefix="/api", tags=["chat"])

# Initialize chat service (once at startup)
chat_service = ChatService()

class ChatRequestBody(BaseModel):
    """Request body for chat endpoint"""
    message: str
    chat_history: List[Dict] = []

@router.post("/chat")
async def chat(request: ChatRequestBody) -> ChatResponse:
    """
    Chat endpoint - process user message through RAG pipeline
    """
    try:
        chat_request = ChatRequest(
            message=request.message,
            chat_history=request.chat_history
        )
        
        response = chat_service.process_chat(chat_request)
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat error: {str(e)}"
        )


@router.post("/upload")
async def upload():
    """Upload endpoint (stub for now)"""
    return {"error": "Not implemented yet"}
