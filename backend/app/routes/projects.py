from fastapi import APIRouter, HTTPException, BackgroundTasks
from firebase_admin import firestore
from app.services.pdf_queue import PDFQueue
import logging
import uuid

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)
pdf_queue = PDFQueue()

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
        project_ref = db.collection('projects').document(project_id)
        project_doc = project_ref.get()
        
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project_doc.to_dict()
        
        if user_id and project_data.get('userId') != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        api_key = f"sk_{uuid.uuid4().hex}"
        
        project_ref.update({
            'apiKey': api_key,
            'apiKeyGeneratedAt': firestore.SERVER_TIMESTAMP,
        })
        
        return {
            "apiKey": api_key,
            "projectId": project_id,
            "shareUrl": f"https://your-domain.com/chat/{project_id}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating key: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/projects/{project_id}/trigger-processing")
async def trigger_pdf_processing(project_id: str, background_tasks: BackgroundTasks):
    """Manually trigger PDF processing for a project"""
    try:
        project_doc = db.collection('projects').document(project_id).get()
        
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project_doc.to_dict()
        pdf_url = project_data.get('pdfUrl')
        
        if not pdf_url:
            raise HTTPException(status_code=400, detail="No PDF URL found")
        
        # Queue processing
        background_tasks.add_task(
            pdf_queue.process_pdf_from_url,
            project_id,
            pdf_url
        )
        
        return {
            "projectId": project_id,
            "status": "processing_queued"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
