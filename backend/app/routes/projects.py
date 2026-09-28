from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
import logging

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)

@router.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    """Get project metadata (public endpoint)"""
    try:
        doc = db.collection('projects').document(project_id).get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        data = doc.to_dict()
        
        # Return only safe metadata (no userId, etc)
        return {
            "id": project_id,
            "name": data.get("name"),
            "description": data.get("description", ""),
            "status": data.get("status"),
            "createdAt": data.get("createdAt"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
