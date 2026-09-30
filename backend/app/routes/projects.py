from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import firestore
import logging
import uuid

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

@router.post("/api/projects/{project_id}/generate-key")
async def generate_api_key(project_id: str, user_id: str = None):
    """Generate a new API key for a project (owner only)"""
    try:
        # Get project
        project_ref = db.collection('projects').document(project_id)
        project_doc = project_ref.get()
        
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project_doc.to_dict()
        
        # Verify ownership (in production, use Firebase Auth token)
        if user_id and project_data.get('userId') != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # Generate new API key
        api_key = f"sk_{uuid.uuid4().hex}"
        
        # Update project with API key
        project_ref.update({
            'apiKey': api_key,
            'apiKeyGeneratedAt': firestore.SERVER_TIMESTAMP,
        })
        
        return {
            "apiKey": api_key,
            "projectId": project_id,
            "shareUrl": f"https://your-domain.com/chat/{project_id}"  # TODO: Update domain
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating key: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
