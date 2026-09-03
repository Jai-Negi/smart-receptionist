"""
Chat Service
Orchestrates all 5 layers to process user queries end-to-end
"""

from typing import List, Dict
from pydantic import BaseModel
import sys
sys.path.append('app/layers')

from layer1_validation import InputValidator, ValidationResult
from layer2_relevance import RelevanceChecker, RelevanceResult
from layer3_retrieval import DocumentRetriever, RetrievalResult
from layer4_generation import LLMGenerator, GenerationResult
from layer5_verification import ResponseVerifier, VerificationResult

class ChatRequest(BaseModel):
    """User chat request"""
    message: str
    chat_history: List[Dict] = []

class ChatResponse(BaseModel):
    """Chat response with full pipeline info"""
    success: bool
    response: str = None
    confidence: float = None
    verified: bool = None
    hallucination_risk: str = None
    layers_info: Dict = {}
    error: str = None

class ChatService:
    """Main service that orchestrates all 5 layers"""
    
    def __init__(self):
        print("Initializing Chat Service...")
        self.validator = InputValidator()
        self.relevance_checker = RelevanceChecker()
        self.retriever = DocumentRetriever()
        self.generator = LLMGenerator()
        self.verifier = ResponseVerifier()
        print("✓ All layers initialized")
    
    def process_chat(self, request: ChatRequest) -> ChatResponse:
        """
        Process user message through all 5 layers
        
        Args:
            request: ChatRequest with user message
            
        Returns:
            ChatResponse with final response and layer details
        """
        
        layers_info = {}
        
        # ============ LAYER 1: Input Validation ============
        print(f"\n[Layer 1] Validating input...")
        validation_result = self.validator.validate(request.message)
        
        layers_info['layer1_validation'] = {
            'valid': validation_result.is_valid,
            'error': validation_result.error_message,
            'normalized_text': validation_result.normalized_text
        }
        
        if not validation_result.is_valid:
            return ChatResponse(
                success=False,
                error=f"Validation failed: {validation_result.error_message}",
                layers_info=layers_info
            )
        
        normalized_text = validation_result.normalized_text
        print(f"✓ Input validated. Normalized: '{normalized_text}'")
        
        # ============ LAYER 2: Query Relevance ============
        print(f"\n[Layer 2] Checking relevance...")
        relevance_result = self.relevance_checker.check(normalized_text)
        
        layers_info['layer2_relevance'] = {
            'relevant': relevance_result.is_relevant,
            'confidence': relevance_result.confidence,
            'reason': relevance_result.reason
        }
        
        if not relevance_result.is_relevant:
            return ChatResponse(
                success=False,
                error=f"Query not relevant to company topics. {relevance_result.reason}",
                layers_info=layers_info
            )
        
        print(f"✓ Query is relevant. Confidence: {relevance_result.confidence:.0%}")
        
        # ============ LAYER 3: Document Retrieval ============
        print(f"\n[Layer 3] Retrieving documents...")
        retrieval_result = self.retriever.retrieve(normalized_text)
        
        layers_info['layer3_retrieval'] = {
            'found': retrieval_result.found,
            'chunks_count': len(retrieval_result.chunks),
            'similarities': retrieval_result.similarities,
            'error': retrieval_result.error
        }
        
        if not retrieval_result.found:
            return ChatResponse(
                success=False,
                error=f"No relevant documents found. {retrieval_result.error}",
                layers_info=layers_info
            )
        
        print(f"✓ Found {len(retrieval_result.chunks)} relevant documents")
        for i, sim in enumerate(retrieval_result.similarities, 1):
            print(f"  [{i}] Similarity: {sim:.3f}")
        
        # ============ LAYER 4: LLM Generation ============
        print(f"\n[Layer 4] Generating response...")
        generation_result = self.generator.generate(
            normalized_text,
            retrieval_result.chunks
        )
        
        layers_info['layer4_generation'] = {
            'success': generation_result.success,
            'error': generation_result.error,
            'redacted_items': generation_result.redacted_info
        }
        
        if not generation_result.success:
            return ChatResponse(
                success=False,
                error=f"Failed to generate response. {generation_result.error}",
                layers_info=layers_info
            )
        
        print(f"✓ Response generated")
        if generation_result.redacted_info:
            print(f"  Redacted: {len(generation_result.redacted_info)} sensitive items")
        
        # ============ LAYER 5: Verification ============
        print(f"\n[Layer 5] Verifying response...")
        verification_result = self.verifier.verify(
            normalized_text,
            retrieval_result.chunks,
            generation_result.response
        )
        
        layers_info['layer5_verification'] = {
            'verified': verification_result.is_verified,
            'confidence': verification_result.confidence,
            'grounded': verification_result.grounded,
            'hallucination_risk': verification_result.hallucination_risk,
            'issues': verification_result.issues
        }
        
        print(f"✓ Response verified")
        print(f"  Confidence: {verification_result.confidence:.0%}")
        print(f"  Hallucination risk: {verification_result.hallucination_risk}")
        
        # ============ FINAL RESPONSE ============
        return ChatResponse(
            success=True,
            response=generation_result.response,
            confidence=verification_result.confidence,
            verified=verification_result.is_verified,
            hallucination_risk=verification_result.hallucination_risk,
            layers_info=layers_info
        )


if __name__ == "__main__":
    service = ChatService()
    
    test_requests = [
        ChatRequest(message="What is the vacation policy?"),
        ChatRequest(message="Can I work from home?"),
        ChatRequest(message="Tell me a joke"),  # Should be blocked by Layer 2
        ChatRequest(message="What are the secret passwords?"),  # Should be blocked
    ]
    
    print("\n" + "="*80)
    print("TESTING CHAT SERVICE - END-TO-END")
    print("="*80)
    
    for i, request in enumerate(test_requests, 1):
        print(f"\n{'='*80}")
        print(f"TEST {i}: '{request.message}'")
        print(f"{'='*80}")
        
        response = service.process_chat(request)
        
        print(f"\n{'='*80}")
        print("FINAL RESPONSE")
        print(f"{'='*80}")
        print(f"Success: {response.success}")
        if response.success:
            print(f"Response: {response.response}")
            print(f"Confidence: {response.confidence:.0%}")
            print(f"Verified: {response.verified}")
            print(f"Hallucination Risk: {response.hallucination_risk}")
        else:
            print(f"Error: {response.error}")