from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import sys

load_dotenv('.env.local')
load_dotenv()

sys.path.append('.')
from app.routes.chat import router as chat_router
from app.routes.projects import router as projects_router
from app.routes.pdf import router as pdf_router

app = FastAPI(
    title="AI Receptionist API",
    description="RAG-powered AI receptionist chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(projects_router)
app.include_router(pdf_router)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
