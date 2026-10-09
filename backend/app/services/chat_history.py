from firebase_admin import firestore
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
db = firestore.client()

class ChatHistory:
    """Manage chat message history"""
    
    @staticmethod
    async def save_message(project_id: str, user_message: str, assistant_response: str, confidence: float, grounded: bool):
        """Save a chat message pair to Firestore"""
        try:
            messages_ref = db.collection('projects').document(project_id).collection('messages')
            
            message_doc = {
                'userMessage': user_message,
                'assistantResponse': assistant_response,
                'confidence': confidence,
                'grounded': grounded,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'userIp': None,  # Will be added by route
            }
            
            doc_ref = messages_ref.add(message_doc)
            logger.info(f"Saved message for project {project_id}")
            
            return doc_ref
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")
            raise
    
    @staticmethod
    async def get_chat_history(project_id: str, limit: int = 50):
        """Get chat history for a project"""
        try:
            messages_ref = db.collection('projects').document(project_id).collection('messages')
            
            query = messages_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.stream()
            
            messages = []
            for doc in docs:
                msg_data = doc.to_dict()
                msg_data['id'] = doc.id
                messages.append(msg_data)
            
            # Reverse to get chronological order
            return list(reversed(messages))
        except Exception as e:
            logger.error(f"Error fetching chat history: {str(e)}")
            return []
    
    @staticmethod
    async def clear_chat_history(project_id: str):
        """Clear all messages for a project"""
        try:
            messages_ref = db.collection('projects').document(project_id).collection('messages')
            docs = messages_ref.stream()
            
            for doc in docs:
                doc.reference.delete()
            
            logger.info(f"Cleared chat history for project {project_id}")
            return True
        except Exception as e:
            logger.error(f"Error clearing history: {str(e)}")
            return False
