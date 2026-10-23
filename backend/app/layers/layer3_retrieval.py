import logging
from dataclasses import dataclass, field
from typing import List, Optional

from firebase_admin import firestore
from app.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)
db = firestore.client()

_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """Load the embedding model once and reuse it"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service


@dataclass
class RetrievalResult:
    found: bool
    chunks: List[str] = field(default_factory=list)
    similarities: List[float] = field(default_factory=list)
    error: Optional[str] = None


class DocumentRetriever:
    """Layer 3: Semantic retrieval over a project's uploaded PDF chunks"""

    TOP_K = 4
    MIN_SIMILARITY = 0.25  # tune after testing with real documents

    def __init__(self):
        self.embedding_service = get_embedding_service()

    def retrieve(self, query: str, project_id: Optional[str] = None) -> RetrievalResult:
        if not query or len(query.strip()) < 3:
            return RetrievalResult(found=False, error="Question is too short")

        if not project_id:
            return RetrievalResult(found=False, error="No project selected")

        chunks = self._get_project_chunks(project_id)
        if not chunks:
            return RetrievalResult(
                found=False,
                error="This project has no processed documents yet"
            )

        ranked = self.embedding_service.similarity_search(query, chunks, top_k=self.TOP_K)
        ranked = [r for r in ranked if r["similarity"] >= self.MIN_SIMILARITY]

        if not ranked:
            return RetrievalResult(found=False, error="No passages matched the question")

        return RetrievalResult(
            found=True,
            chunks=[r["chunk"]["content"] for r in ranked],
            similarities=[r["similarity"] for r in ranked],
        )

    def _get_project_chunks(self, project_id: str) -> list:
        try:
            docs = db.collection("projects").document(project_id).collection("chunks").stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.error(f"Error fetching chunks: {str(e)}")
            return []
