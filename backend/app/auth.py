from fastapi import Header, HTTPException
from firebase_admin import auth as firebase_auth, firestore


def get_current_user(authorization: str = Header(None)) -> dict:
    """Verify the Firebase ID token sent as 'Authorization: Bearer <token>'"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        return firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_project_owner(project_id: str, user: dict) -> dict:
    """Return the project if the signed-in user owns it, otherwise raise"""
    db = firestore.client()
    doc = db.collection("projects").document(project_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    data = doc.to_dict()
    if data.get("userId") != user.get("uid"):
        raise HTTPException(status_code=403, detail="Not your project")

    return data
