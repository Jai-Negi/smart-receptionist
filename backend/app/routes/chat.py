from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from app.services.chat_service import ChatService
from app.services.chat_history import ChatHistory
from app.services.analytics import Analytics
from app.auth import get_current_user, require_project_owner
from firebase_admin import firestore
import logging
from datetime import datetime
from collections import defaultdict
import time

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)

# Simple in-memory rate limiting (per project + IP)
rate_limit_store = defaultdict(list)
RATE_LIMIT = 30   # messages
RATE_WINDOW = 60  # seconds


class ChatMessage(BaseModel):
    message: str
    chat_history: list = []


class ChatResponse(BaseModel):
    response: str
    confidence: float
    grounded: bool


def check_rate_limit(project_id: str, ip: str) -> bool:
    key = f"{project_id}:{ip}"
    now = datetime.now()
    rate_limit_store[key] = [
        ts for ts in rate_limit_store[key]
        if (now - ts).total_seconds() < RATE_WINDOW
    ]
    if len(rate_limit_store[key]) >= RATE_LIMIT:
        return False
    rate_limit_store[key].append(now)
    return True


@router.post("/api/chat/{project_id}")
async def chat_with_project(project_id: str, request: Request, message: ChatMessage):
    """Public chat endpoint for a project's AI receptionist"""
    start_time = time.time()

    try:
        project_doc = db.collection("projects").document(project_id).get()
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = project_doc.to_dict()
        if project_data.get("status") != "ready":
            raise HTTPException(status_code=400, detail="Project is still processing")

        client_ip = request.client.host if request.client else "unknown"
        if not check_rate_limit(project_id, client_ip):
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Max 30 messages per minute."
            )

        chat_service = ChatService()
        response = await chat_service.process_message(
            message.message,
            message.chat_history
        )

        await ChatHistory.save_message(
            project_id,
            message.message,
            response["response"],
            response["confidence"],
            response["grounded"]
        )

        await Analytics.track_message(
            project_id,
            response["confidence"],
            response["grounded"],
            time.time() - start_time
        )

        return ChatResponse(
            response=response["response"],
            confidence=response["confidence"],
            grounded=response["grounded"]
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/chat")
async def chat_legacy(request: Request, message: ChatMessage):
    """Legacy endpoint (demo mock docs). TODO: remove once frontend no longer uses it"""
    chat_service = ChatService()
    response = await chat_service.process_message(
        message.message,
        message.chat_history
    )
    return ChatResponse(
        response=response["response"],
        confidence=response["confidence"],
        grounded=response["grounded"]
    )


@router.get("/api/projects/{project_id}/history")
async def get_chat_history(project_id: str, limit: int = 50, user=Depends(get_current_user)):
    """Get chat history for a project (owner only)"""
    require_project_owner(project_id, user)
    history = await ChatHistory.get_chat_history(project_id, min(limit, 200))
    return {
        "projectId": project_id,
        "messages": history,
        "count": len(history)
    }


@router.delete("/api/projects/{project_id}/history")
async def clear_chat_history(project_id: str, user=Depends(get_current_user)):
    """Clear chat history for a project (owner only)"""
    require_project_owner(project_id, user)
    await ChatHistory.clear_chat_history(project_id)
    return {"projectId": project_id, "status": "cleared"}
