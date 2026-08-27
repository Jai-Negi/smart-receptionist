from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv()

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

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/chat")
def chat():
    return {"error": "Not implemented yet"}

@app.post("/api/upload")
def upload():
    return {"error": "Not implemented yet"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
