"""
Layer 3: Document Retrieval
"""

from typing import List, Set
from pydantic import BaseModel

class Document(BaseModel):
    id: str
    content: str
    source: str
    metadata: dict = {}

class RetrievalResult(BaseModel):
    found: bool
    chunks: List[Document] = []
    similarities: List[float] = []
    error: str = None

class DocumentRetriever:
    
    SIMILARITY_THRESHOLD = 0.1
    MAX_CHUNKS = 10
    
    MOCK_DOCUMENTS = [
        Document(
            id="doc_1",
            content="Vacation Policy: All employees receive 20 days of paid vacation per year. Vacation days are accrued monthly at 1.67 days per month.",
            source="handbook.md",
            metadata={"section": "time_off"}
        ),
        Document(
            id="doc_2",
            content="Sick Leave: Employees are entitled to 10 days of paid sick leave per year.",
            source="handbook.md",
            metadata={"section": "time_off"}
        ),
        Document(
            id="doc_3",
            content="Remote Work Policy: Full-time employees can work remotely up to 2 days per week. Remote work must be pre-approved by manager.",
            source="handbook.md",
            metadata={"section": "work_arrangements"}
        ),
        Document(
            id="doc_4",
            content="Health Insurance: Company provides comprehensive health insurance coverage including medical, dental, and vision.",
            source="handbook.md",
            metadata={"section": "benefits"}
        ),
    ]
    
    def __init__(self):
        print("Initializing Document Retriever...")
        print(f"✓ Loaded {len(self.MOCK_DOCUMENTS)} mock documents")
    
    def retrieve(self, query: str, threshold: float = SIMILARITY_THRESHOLD) -> RetrievalResult:
        """Retrieve relevant documents"""
        try:
            query_lower = query.lower()
            
            similarities = []
            for doc in self.MOCK_DOCUMENTS:
                doc_lower = doc.content.lower()
                # Count how many query words appear in document
                query_words = query_lower.split()
                matches = sum(1 for word in query_words if word in doc_lower)
                similarity = matches / len(query_words) if query_words else 0.0
                similarities.append((doc, similarity))
            
            # Filter by threshold
            filtered = [(doc, sim) for doc, sim in similarities if sim >= threshold]
            filtered.sort(key=lambda x: x[1], reverse=True)
            
            if not filtered:
                return RetrievalResult(
                    found=False,
                    error=f"No documents found with similarity >= {threshold}"
                )
            
            chunks = [doc for doc, _ in filtered[:self.MAX_CHUNKS]]
            sims = [float(sim) for _, sim in filtered[:self.MAX_CHUNKS]]
            
            return RetrievalResult(
                found=True,
                chunks=chunks,
                similarities=sims
            )
        
        except Exception as e:
            return RetrievalResult(
                found=False,
                error=f"Retrieval error: {str(e)}"
            )


if __name__ == "__main__":
    retriever = DocumentRetriever()
    
    test_queries = [
        "What is the vacation policy?",
        "Can I work from home?",
        "What about health insurance?",
    ]
    
    print("\n" + "="*80)
    for query in test_queries:
        result = retriever.retrieve(query)
        print(f"\nQuery: '{query}'")
        if result.found:
            print(f"Found {len(result.chunks)} chunks:")
            for i, (chunk, sim) in enumerate(zip(result.chunks, result.similarities)):
                print(f"  [{i+1}] Similarity: {sim:.3f} | {chunk.source}")
                print(f"      {chunk.content[:70]}...")
        else:
            print(f"  Error: {result.error}")