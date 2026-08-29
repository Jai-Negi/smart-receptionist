"""
Layer 1: Input Validation & Normalization
- Validates user input
- Normalizes text
- Checks length and content
"""

import re
from typing import Tuple
from pydantic import BaseModel, Field

class ValidationResult(BaseModel):
    """Result of validation"""
    is_valid: bool
    error_message: str = None
    normalized_text: str = None

class InputValidator:
    """Validates and normalizes user input"""
    
    # Configuration
    MIN_LENGTH = 3
    MAX_LENGTH = 500
    
    @staticmethod
    def validate(user_input: str) -> ValidationResult:
        """
        Validate and normalize user input
        
        Args:
            user_input: Raw user message
            
        Returns:
            ValidationResult with normalized text or error
        """
        
        # Check if input is empty
        if not user_input or not user_input.strip():
            return ValidationResult(
                is_valid=False,
                error_message="Input cannot be empty"
            )
        
        # Check length
        if len(user_input) < InputValidator.MIN_LENGTH:
            return ValidationResult(
                is_valid=False,
                error_message=f"Input too short. Minimum {InputValidator.MIN_LENGTH} characters"
            )
        
        if len(user_input) > InputValidator.MAX_LENGTH:
            return ValidationResult(
                is_valid=False,
                error_message=f"Input too long. Maximum {InputValidator.MAX_LENGTH} characters"
            )
        
        # Normalize text
        normalized = InputValidator._normalize(user_input)
        
        # Check if normalized text is still valid
        if not normalized.strip():
            return ValidationResult(
                is_valid=False,
                error_message="Input contains only special characters"
            )
        
        return ValidationResult(
            is_valid=True,
            normalized_text=normalized
        )
    
    @staticmethod
    def _normalize(text: str) -> str:
        """
        Normalize text:
        - Strip whitespace
        - Remove extra spaces
        - Convert to lowercase (optional)
        """
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Remove control characters
        text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\t')
        
        return text


# Test it
if __name__ == "__main__":
    validator = InputValidator()
    
    # Test cases
    test_cases = [
        "",
        "hi",
        "What is the vacation policy?",
        "   spaces   everywhere   ",
        "a" * 1000,
    ]
    
    for test in test_cases:
        result = validator.validate(test)
        print(f"Input: '{test[:50]}...' | Valid: {result.is_valid} | Error: {result.error_message}")
