import PyPDF2
import logging
from typing import List

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Extract and chunk PDF documents"""
    
    def __init__(self, chunk_size: int = 500, overlap: int = 100):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def extract_text(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page_num in range(len(reader.pages)):
                    page = reader.pages[page_num]
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting PDF text: {str(e)}")
            raise
    
    def chunk_text(self, text: str) -> List[dict]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        chunk_num = 0
        
        for i in range(0, len(words), self.chunk_size - self.overlap):
            chunk_words = words[i:i + self.chunk_size]
            chunk_text = ' '.join(chunk_words)
            
            if len(chunk_text.strip()) > 10:  # Skip empty chunks
                chunks.append({
                    'chunk_number': chunk_num,
                    'content': chunk_text,
                    'word_count': len(chunk_words)
                })
                chunk_num += 1
        
        logger.info(f"Created {len(chunks)} chunks from text")
        return chunks
    
    def process_pdf(self, pdf_path: str) -> List[dict]:
        """Full pipeline: extract text and create chunks"""
        text = self.extract_text(pdf_path)
        chunks = self.chunk_text(text)
        return chunks
