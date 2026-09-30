from app.services.embedding_service import EmbeddingService
from firebase_admin import firestore
import logging

logger = logging.getLogger(__name__)
db = firestore.client()

class DocumentRetriever:
    """Layer 3: Retrieve relevant documents using semantic search"""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
    
    async def retrieve(self, query: str, project_id: str = None) -> list:
        """Retrieve relevant document chunks"""
        try:
            if not query or len(query.strip()) < 3:
                return []
            
            # Get chunks from Firestore if project_id provided
            if project_id:
                chunks = await self._get_project_chunks(project_id)
            else:
                # Fallback to mock documents
                chunks = self._get_mock_chunks()
            
            if not chunks:
                logger.warning(f"No chunks found for query: {query}")
                return []
            
            # Semantic search
            relevant_chunks = self.embedding_service.similarity_search(
                query, 
                chunks, 
                top_k=4
            )
            
            results = [
                {
                    'content': item['chunk']['content'],
                    'similarity': item['similarity'],
                    'chunk_number': item['chunk'].get('chunk_number', -1)
                }
                for item in relevant_chunks
            ]
            
            logger.info(f"Retrieved {len(results)} relevant chunks")
            return results
            
        except Exception as e:
            logger.error(f"Error in retrieval: {str(e)}")
            return []
    
    async def _get_project_chunks(self, project_id: str) -> list:
        """Fetch chunks from Firestore"""
        try:
            chunks_ref = db.collection('projects').document(project_id).collection('chunks')
            docs = chunks_ref.stream()
            
            chunks = []
            for doc in docs:
                chunks.append(doc.to_dict())
            
            return chunks
        except Exception as e:
            logger.error(f"Error fetching chunks: {str(e)}")
            return []
    
    def _get_mock_chunks(self) -> list:
        """Fallback mock chunks for testing"""
        mock_docs = [
            {
                'chunk_number': 0,
                'content': 'Vacation policy: Employees get 20 days of paid vacation per year',
                'embedding': [0.1] * 384
            },
            {
                'chunk_number': 1,
                'content': 'Sick leave policy: Employees get 10 days of paid sick leave per year',
                'embedding': [0.2] * 384
            },
            {
                'chunk_number': 2,
                'content': 'Remote work policy: Employees can work remotely up to 3 days per week',
                'embedding': [0.3] * 384
            },
            {
                'chunk_number': 3,
                'content': 'Health insurance: Company covers 80% of health insurance premiums',
                'embedding': [0.4] * 384
            }
        ]
        return mock_docs
