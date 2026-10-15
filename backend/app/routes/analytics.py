from fastapi import APIRouter, Depends
from app.services.analytics import Analytics
from app.auth import get_current_user, require_project_owner

router = APIRouter()


@router.get("/api/projects/{project_id}/stats")
async def get_project_stats(project_id: str, days: int = 30, user=Depends(get_current_user)):
    """Get analytics stats for a project (owner only)"""
    require_project_owner(project_id, user)
    stats = await Analytics.get_project_stats(project_id, days)
    return {"projectId": project_id, "stats": stats}
