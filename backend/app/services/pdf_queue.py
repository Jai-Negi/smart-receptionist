import asyncio
import logging
from app.services.pdf_processor import PDFProcessor
from app.services.embedding_service import EmbeddingService
from firebase_admin import firestore
import requests
import tempfile
import os

logger = logging.getLogger(__name__)
db = firestore.client()

class PDFQueue:
    """Handle async PDF processing"""
    
    def __init__(self):
        self.pdf_processor = PDFProcessor()
        self.embedding_service = EmbeddingService()
    
    async def process_pdf_from_url(self, project_id: str, pdf_url: str):
        """Download PDF from URL and process it"""
        temp_path = None
        try:
            logger.info(f"Starting PDF processing for project {project_id}")
            
            # Update status
            db.collection('projects').document(project_id).update({
                'status': 'processing',
                'processingStartedAt': firestore.SERVER_TIMESTAMP
            })
            
            # Download PDF
            temp_path = await self._download_pdf(pdf_url)
            
            # Extract and chunk
            chunks = self.pdf_processor.process_pdf(temp_path)
            
            if not chunks:
                raise Exception("No text extracted from PDF")
            
            logger.info(f"Created {len(chunks)} chunks")
            
            # Add embeddings
            chunks_with_embeddings = self.embedding_service.embed_chunks(chunks)
            
            # Store in Firestore
            await self._store_chunks(project_id, chunks_with_embeddings)
            
            # Update status to ready
            db.collection('projects').document(project_id).update({
                'status': 'ready',
                'chunksCount': len(chunks_with_embeddings),
                'processingCompletedAt': firestore.SERVER_TIMESTAMP
            })
            
            logger.info(f"PDF processing completed for project {project_id}")
            
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            db.collection('projects').document(project_id).update({
                'status': 'error',
                'error': str(e),
                'processingFailedAt': firestore.SERVER_TIMESTAMP
            })
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
    
    async def _download_pdf(self, pdf_url: str) -> str:
        """Download PDF from URL and save temporarily"""
        try:
            response = requests.get(pdf_url, timeout=30)
            response.raise_for_status()
            
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                tmp.write(response.content)
                return tmp.name
        except Exception as e:
            logger.error(f"Error downloading PDF: {str(e)}")
            raise
    
    async def _store_chunks(self, project_id: str, chunks: list):
        """Store chunks in Firestore"""
        try:
            chunks_ref = db.collection('projects').document(project_id).collection('chunks')
            
            for chunk in chunks:
                chunks_ref.add(chunk)
            
            logger.info(f"Stored {len(chunks)} chunks in Firestore")
        except Exception as e:
            logger.error(f"Error storing chunks: {str(e)}")
            raise
