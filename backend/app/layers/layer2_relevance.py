"""
Layer 2: Query Relevance Check
- Quick check if question is about company topics
- Uses keyword matching (cheap, no ML model)
"""

from typing import Tuple
from pydantic import BaseModel

class RelevanceResult(BaseModel):
    """Result of relevance check"""
    is_relevant: bool
    confidence: float
    reason: str

class RelevanceChecker:
    """Checks if query is relevant to company topics"""
    
    # Keywords indicating relevant queries
    RELEVANT_KEYWORDS = {
        # Policies
        'policy', 'policies', 'leave', 'vacation', 'time off', 'pto',
        'holiday', 'sick', 'benefits', 'insurance', 'health',
        
        # HR & Work
        'work', 'working', 'hours', 'schedule', 'attendance', 'dress code',
        'remote', 'office', 'salary', 'payment', 'bonus', 'promotion',
        
        # Company Info
        'company', 'office', 'location', 'team', 'department', 'rule',
        'process', 'procedure', 'handbook', 'manual', 'guide',
        
        # Expenses & Reimbursement
        'expense', 'reimbursement', 'travel', 'budget', 'cost',
        
        # Training & Development
        'training', 'course', 'certification', 'development', 'learning',
    }
    
    # Keywords indicating irrelevant queries
    IRRELEVANT_KEYWORDS = {
        'weather', 'sports', 'music', 'movie', 'recipe', 'joke',
        'funny', 'game', 'political', 'religion', 'news',
    }
    
    @staticmethod
    def check(normalized_text: str) -> RelevanceResult:
        """
        Check if query is relevant to company topics
        
        Args:
            normalized_text: Normalized user input from Layer 1
            
        Returns:
            RelevanceResult with relevance score
        """
        
        text_lower = normalized_text.lower()
        
        # Count relevant keywords
        relevant_count = sum(1 for keyword in RelevanceChecker.RELEVANT_KEYWORDS 
                            if keyword in text_lower)
        
        # Check for irrelevant keywords
        irrelevant_count = sum(1 for keyword in RelevanceChecker.IRRELEVANT_KEYWORDS 
                              if keyword in text_lower)
        
        # If irrelevant keywords found, block it
        if irrelevant_count > 0:
            return RelevanceResult(
                is_relevant=False,
                confidence=0.0,
                reason=f"Query appears to be about non-company topics"
            )
        
        # If relevant keywords found, accept
        if relevant_count > 0:
            confidence = min(relevant_count / 3, 1.0)  # Scale to 0-1
            return RelevanceResult(
                is_relevant=True,
                confidence=confidence,
                reason=f"Query matches {relevant_count} company-related keywords"
            )
        
        # Neutral - might be relevant, let later layers decide
        return RelevanceResult(
            is_relevant=True,
            confidence=0.5,
            reason="Query is neutral, will proceed to document retrieval"
        )


# Test it
if __name__ == "__main__":
    checker = RelevanceChecker()
    
    test_cases = [
        "What is the vacation policy?",
        "How many days off do I get?",
        "What's the weather today?",
        "Tell me a joke",
        "How do I request time off?",
        "Can I work remotely?",
        "What sports team do you support?",
    ]
    
    for test in test_cases:
        result = checker.check(test)
        print(f"Query: '{test}' | Relevant: {result.is_relevant} | Confidence: {result.confidence:.2f} | Reason: {result.reason}")
