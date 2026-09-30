import numpy as np
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Generate embeddings for text chunks"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        try:
            self.model = SentenceTransformer(model_name)
            self.embedding_dim = self.model.get_sentence_embedding_dimension()
            logger.info(f"Loaded embedding model: {model_name}")
        except Exception as e:
            logger.error(f"Error loading embedding model: {str(e)}")
            raise
    
    def embed_text(self, text: str) -> list:
        """Create embedding for single text"""
        try:
            embedding = self.model.encode(text, convert_to_tensor=False)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error embedding text: {str(e)}")
            raise
    
    def embed_chunks(self, chunks: list) -> list:
        """Create embeddings for multiple chunks"""
        try:
            texts = [chunk['content'] for chunk in chunks]
            embeddings = self.model.encode(texts, convert_to_tensor=False)
            
            # Attach embeddings to chunks
            for i, chunk in enumerate(chunks):
                chunk['embedding'] = embeddings[i].tolist()
            
            logger.info(f"Created {len(chunks)} embeddings")
            return chunks
        except Exception as e:
            logger.error(f"Error embedding chunks: {str(e)}")
            raise
    
    def similarity_search(self, query: str, chunks: list, top_k: int = 4) -> list:
        """Find most similar chunks to query"""
        try:
            query_embedding = self.embed_text(query)
            query_vec = np.array(query_embedding)
            
            similarities = []
            for chunk in chunks:
                if 'embedding' in chunk:
                    chunk_vec = np.array(chunk['embedding'])
                    # Cosine similarity
                    similarity = np.dot(query_vec, chunk_vec) / (
                        np.linalg.norm(query_vec) * np.linalg.norm(chunk_vec) + 1e-10
                    )
                    similarities.append({
                        'chunk': chunk,
                        'similarity': float(similarity)
                    })
            
            # Sort by similarity and return top_k
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            return similarities[:top_k]
        except Exception as e:
            logger.error(f"Error in similarity search: {str(e)}")
            return []
