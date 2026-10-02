from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_processor import PDFProcessor
from app.services.embedding_service import EmbeddingService
from firebase_admin import firestore
import logging
import tempfile
import os

router = APIRouter()
db = firestore.client()
logger = logging.getLogger(__name__)

pdf_processor = PDFProcessor()
embedding_service = EmbeddingService()

@router.post("/api/projects/{project_id}/process-pdf")
async def process_pdf(project_id: str, file: UploadFile = File(...)):
    """Process uploaded PDF and create embeddings"""
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    temp_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            content = await file.read()
            tmp.write(content)
            temp_path = tmp.name
        
        # Extract text and create chunks
        chunks = pdf_processor.process_pdf(temp_path)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Create embeddings
        chunks_with_embeddings = embedding_service.embed_chunks(chunks)
        
        # Store chunks in Firestore
        chunks_ref = db.collection('projects').document(project_id).collection('chunks')
        
        for chunk in chunks_with_embeddings:
            chunks_ref.add(chunk)
        
        # Update project status
        db.collection('projects').document(project_id).update({
            'status': 'ready',
            'chunksCount': len(chunks_with_embeddings)
        })
        
        return {
            'projectId': project_id,
            'chunksCreated': len(chunks_with_embeddings),
            'status': 'ready'
        }
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
