from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from firebase_admin import firestore
from app.services.pdf_queue import PDFQueue
from app.auth import get_current_user, require_project_owner
import logging
import secrets

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)
pdf_queue = PDFQueue()


@router.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    """Public project metadata. No secrets are returned."""
    try:
        doc = db.collection("projects").document(project_id).get()
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
async def generate_api_key(project_id: str, user=Depends(get_current_user)):
    """Generate a new API key (owner only)"""
    require_project_owner(project_id, user)

    api_key = f"sk_{secrets.token_urlsafe(32)}"
    db.collection("projects").document(project_id).update({
        "apiKey": api_key,
        "apiKeyGeneratedAt": firestore.SERVER_TIMESTAMP,
    })

    return {"apiKey": api_key, "projectId": project_id}


@router.post("/api/projects/{project_id}/trigger-processing")
async def trigger_pdf_processing(
    project_id: str,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user),
):
    """Re-run PDF processing for a project (owner only)"""
    project_data = require_project_owner(project_id, user)

    pdf_url = project_data.get("pdfUrl")
    if not pdf_url:
        raise HTTPException(status_code=400, detail="No PDF URL found")

    background_tasks.add_task(pdf_queue.process_pdf_from_url, project_id, pdf_url)
    return {"projectId": project_id, "status": "processing_queued"}
