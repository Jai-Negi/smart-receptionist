from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"
    GROQ_API_KEY: Optional[str] = None
    SIMILARITY_THRESHOLD: float = 0.75
    MAX_CONTEXT_CHUNKS: int = 10
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    
    class Config:
        env_file = ".env.local"

settings = Settings()
