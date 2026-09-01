"""
Layer 5: Verification
- Verifies answer is grounded in retrieved documents
- Checks for hallucinations
- Ensures no made-up information
- Returns confidence score
"""

from typing import List, Tuple
from pydantic import BaseModel
from layer3_retrieval import Document

class VerificationResult(BaseModel):
    """Result of verification"""
    is_verified: bool
    confidence: float  # 0.0 to 1.0
    grounded: bool    # Is answer grounded in docs?
    hallucination_risk: str  # "low", "medium", "high"
    issues: List[str] = []
    explanation: str = None

class ResponseVerifier:
    """Verifies generated responses against source documents"""
    
    def __init__(self):
        print("Initializing Response Verifier...")
        print("✓ Ready to verify responses")
    
    def verify(self, 
               query: str, 
               documents: List[Document], 
               response: str) -> VerificationResult:
        """
        Verify if response is grounded in documents
        
        Args:
            query: Original user question
            documents: Retrieved documents used for generation
            response: Generated response from LLM
            
        Returns:
            VerificationResult with verification details
        """
        
        try:
            issues = []
            
            # Check 1: Is response related to query?
            query_match = self._check_query_alignment(query, response)
            if not query_match:
                issues.append("Response doesn't directly address the query")
            
            # Check 2: Is response grounded in documents?
            grounded_score, grounded_items = self._check_grounding(documents, response)
            
            if grounded_score < 0.3:
                issues.append("Response may not be grounded in provided documents")
                hallucination_risk = "high"
            elif grounded_score < 0.6:
                issues.append("Only partially grounded in documents")
                hallucination_risk = "medium"
            else:
                hallucination_risk = "low"
            
            # Check 3: Response length sanity
            if len(response) < 20:
                issues.append("Response is very short, may be incomplete")
            
            if len(response) > 2000:
                issues.append("Response is very long, may contain unnecessary information")
            
            # Calculate overall confidence
            confidence = grounded_score
            if not issues:
                confidence = min(confidence + 0.1, 1.0)
            
            # Determine if response is verified
            is_verified = (
                confidence >= 0.5 and 
                hallucination_risk != "high" and 
                grounded_score >= 0.4
            )
            
            explanation = self._generate_explanation(
                is_verified, 
                confidence, 
                hallucination_risk,
                grounded_items
            )
            
            return VerificationResult(
                is_verified=is_verified,
                confidence=confidence,
                grounded=grounded_score >= 0.5,
                hallucination_risk=hallucination_risk,
                issues=issues,
                explanation=explanation
            )
        
        except Exception as e:
            return VerificationResult(
                is_verified=False,
                confidence=0.0,
                grounded=False,
                hallucination_risk="high",
                issues=[f"Verification error: {str(e)}"],
                explanation="Error during verification"
            )
    
    @staticmethod
    def _check_query_alignment(query: str, response: str) -> bool:
        """Check if response addresses the query"""
        query_keywords = set(query.lower().split())
        response_keywords = set(response.lower().split())
        
        # Check overlap
        overlap = len(query_keywords & response_keywords)
        return overlap >= 2  # At least 2 words in common
    
    @staticmethod
    def _check_grounding(documents: List[Document], response: str) -> Tuple[float, List[str]]:
        """
        Check if response is grounded in documents
        Returns: (grounding_score, grounded_phrases)
        """
        response_lower = response.lower()
        documents_text = " ".join([doc.content.lower() for doc in documents])
        
        # Extract key phrases from response (3-5 words)
        response_words = response_lower.split()
        grounded_phrases = []
        total_phrases = 0
        
        # Check if major phrases from response appear in documents
        for i in range(len(response_words) - 2):
            phrase = " ".join(response_words[i:i+3])
            total_phrases += 1
            
            if phrase in documents_text:
                grounded_phrases.append(phrase)
        
        if total_phrases == 0:
            grounding_score = 0.5  # Default to neutral
        else:
            grounding_score = len(grounded_phrases) / total_phrases
        
        return grounding_score, grounded_phrases
    
    @staticmethod
    def _generate_explanation(
        is_verified: bool,
        confidence: float,
        hallucination_risk: str,
        grounded_items: List[str]
    ) -> str:
        """Generate explanation of verification result"""
        
        if is_verified:
            return f"✓ Response is verified and grounded in documents. Confidence: {confidence:.0%}. Hallucination risk: {hallucination_risk}."
        else:
            return f"⚠ Response may contain unverified information. Confidence: {confidence:.0%}. Hallucination risk: {hallucination_risk}. Review before sharing."


if __name__ == "__main__":
    verifier = ResponseVerifier()
    
    # Test documents
    vacation_doc = Document(
        id="doc_1",
        content="Vacation Policy: All employees receive 20 days of paid vacation per year. Vacation days are accrued monthly at 1.67 days per month. Employees must request vacation at least 2 weeks in advance.",
        source="handbook.md",
        metadata={"section": "time_off"}
    )
    
    remote_doc = Document(
        id="doc_2",
        content="Remote Work Policy: Full-time employees can work remotely up to 2 days per week. Remote work must be pre-approved by manager.",
        source="handbook.md",
        metadata={"section": "work_arrangements"}
    )
    
    # Test cases: (query, documents, response)
    test_cases = [
        (
            "What is the vacation policy?",
            [vacation_doc],
            "All employees receive 20 days of paid vacation per year. You accrue 1.67 days each month and must request at least 2 weeks in advance."
        ),
        (
            "Can I work from home?",
            [remote_doc],
            "You can work from home 3 days per week with manager approval."  # INCORRECT - should be 2 days
        ),
        (
            "What benefits do we have?",
            [vacation_doc],
            "We have unlimited vacation, free flights, and daily massages."  # HALLUCINATION
        ),
    ]
    
    print("\n" + "="*80)
    for query, docs, response in test_cases:
        result = verifier.verify(query, docs, response)
        print(f"\nQuery: '{query}'")
        print(f"Response: '{response}'")
        print(f"Verified: {result.is_verified}")
        print(f"Confidence: {result.confidence:.0%}")
        print(f"Hallucination Risk: {result.hallucination_risk}")
        if result.issues:
            print(f"Issues: {'; '.join(result.issues)}")
        print(f"Explanation: {result.explanation}")
