"""
Layer 4: LLM Generation + Redaction
- Creates prompt with context from retrieved documents
- Sends to LLM (Groq API)
- Redacts sensitive information
- Returns clean response
"""

import re
import os
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel
from layer3_retrieval import Document

load_dotenv('.env.local')
load_dotenv()

class GenerationResult(BaseModel):
    """Result of LLM generation"""
    success: bool
    response: str = None
    original_response: str = None
    redacted_info: List[str] = []
    error: str = None

class LLMGenerator:
    """Generates responses using LLM with context from documents"""
    
    # Sensitive patterns to redact
    SENSITIVE_PATTERNS = {
        'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
        'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
        'credit_card': r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
    }
    
    def __init__(self):
        print("Initializing LLM Generator...")
        print("✓ Ready to generate responses with Groq")
    
    def generate(self, query: str, documents: List[Document]) -> GenerationResult:
        """
        Generate response based on query and retrieved documents
        
        Args:
            query: User's question
            documents: Retrieved relevant documents
            
        Returns:
            GenerationResult with generated response
        """
        try:
            # Build prompt
            prompt = self._build_prompt(query, documents)
            
            # Call LLM
            response = self._call_llm(prompt)
            
            if not response:
                return GenerationResult(
                    success=False,
                    error="LLM returned empty response"
                )
            
            # Redact sensitive information
            redacted_response, redacted_items = self._redact_sensitive_info(response)
            
            return GenerationResult(
                success=True,
                response=redacted_response,
                original_response=response,
                redacted_info=redacted_items
            )
        
        except Exception as e:
            return GenerationResult(
                success=False,
                error=f"Generation error: {str(e)}"
            )
    
    @staticmethod
    def _build_prompt(query: str, documents: List[Document]) -> str:
        """Build prompt with context from documents"""
        
        # System instruction
        system = """You are a helpful company receptionist. Answer questions based ONLY on the provided company documents.
If you cannot find the answer in the documents, say "I don't have that information in our company documents."
Be concise and helpful."""
        
        # Context from documents
        context = "Company Documents:\n"
        for i, doc in enumerate(documents, 1):
            context += f"\n[Document {i}]\n{doc.content}\n"
        
        # User question
        user_question = f"\nQuestion: {query}\n\nAnswer:"
        
        full_prompt = f"{system}\n\n{context}{user_question}"
        return full_prompt
    
    @staticmethod
    def _call_llm(prompt: str) -> str:
        """Call Groq LLM with prompt"""
        from langchain_groq import ChatGroq
        
        try:
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                return "Error: GROQ_API_KEY not set in environment"
            
            # Initialize Groq LLM
            # NOTE: llama-3.1-8b-instant / llama-3.3-70b-versatile returned 404
            # model_not_found for this account even though they appear in the
            # Groq console — client.models.list() confirmed they aren't in this
            # key's active model set. openai/gpt-oss-20b is currently available.
            llm = ChatGroq(
                temperature=0.7,
                model_name="openai/gpt-oss-20b",
                api_key=api_key
            )
            
            # Call LLM
            response = llm.invoke(prompt)
            return response.content
        
        except Exception as e:
            return f"Error calling Groq: {str(e)}"
    
    @staticmethod
    def _redact_sensitive_info(text: str) -> tuple:
        """
        Redact sensitive information from response
        
        Returns:
            Tuple of (redacted_text, list_of_redacted_items)
        """
        redacted_items = []
        redacted_text = text
        
        for pattern_name, pattern in LLMGenerator.SENSITIVE_PATTERNS.items():
            matches = re.findall(pattern, redacted_text)
            if matches:
                redacted_items.extend(matches)
                # Replace with redaction marker
                redacted_text = re.sub(pattern, f"[REDACTED {pattern_name.upper()}]", redacted_text)
        
        return redacted_text, redacted_items


if __name__ == "__main__":
    generator = LLMGenerator()
    
    # Different documents for different queries
    vacation_doc = Document(
        id="doc_1",
        content="Vacation Policy: All employees receive 20 days of paid vacation per year. Email HR at hr@company.com for requests.",
        source="handbook.md",
        metadata={"section": "time_off"}
    )
    
    remote_doc = Document(
        id="doc_2",
        content="Remote Work Policy: Full-time employees can work remotely up to 2 days per week. Remote work must be pre-approved by manager.",
        source="handbook.md",
        metadata={"section": "work_arrangements"}
    )
    
    test_cases = [
        ("What is the vacation policy?", [vacation_doc]),
        ("Can I work from home?", [remote_doc]),
    ]
    
    print("\n" + "="*80)
    for query, docs in test_cases:
        result = generator.generate(query, docs)
        print(f"\nQuery: '{query}'")
        if result.success:
            print(f"Response: {result.response}")
        else:
            print(f"Error: {result.error}")
