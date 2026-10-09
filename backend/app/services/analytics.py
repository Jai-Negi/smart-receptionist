from firebase_admin import firestore
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)
db = firestore.client()

class Analytics:
    """Track usage and engagement metrics"""
    
    @staticmethod
    async def track_message(project_id: str, confidence: float, grounded: bool, response_time: float = 0):
        """Track a message interaction"""
        try:
            analytics_ref = db.collection('projects').document(project_id).collection('analytics')
            
            analytics_doc = {
                'timestamp': firestore.SERVER_TIMESTAMP,
                'type': 'message',
                'confidence': confidence,
                'grounded': grounded,
                'responseTime': response_time,
            }
            
            analytics_ref.add(analytics_doc)
            logger.info(f"Tracked message for project {project_id}")
        except Exception as e:
            logger.error(f"Error tracking message: {str(e)}")
    
    @staticmethod
    async def get_project_stats(project_id: str, days: int = 30):
        """Get analytics stats for a project"""
        try:
            messages_ref = db.collection('projects').document(project_id).collection('messages')
            
            # Get all messages
            docs = messages_ref.stream()
            messages = [doc.to_dict() for doc in docs]
            
            if not messages:
                return {
                    'totalMessages': 0,
                    'averageConfidence': 0,
                    'groundedCount': 0,
                    'messagesByDay': {}
                }
            
            # Calculate stats
            total_messages = len(messages)
            avg_confidence = sum([m.get('confidence', 0) for m in messages]) / total_messages if total_messages > 0 else 0
            grounded_count = sum([1 for m in messages if m.get('grounded', False)])
            
            # Messages by day
            messages_by_day = {}
            for msg in messages:
                timestamp = msg.get('timestamp')
                if timestamp:
                    if hasattr(timestamp, 'date'):
                        day = timestamp.date().isoformat()
                    else:
                        day = timestamp.isoformat() if isinstance(timestamp, str) else 'unknown'
                    messages_by_day[day] = messages_by_day.get(day, 0) + 1
            
            return {
                'totalMessages': total_messages,
                'averageConfidence': round(avg_confidence, 2),
                'groundedCount': grounded_count,
                'groundedPercentage': round((grounded_count / total_messages * 100), 1) if total_messages > 0 else 0,
                'messagesByDay': messages_by_day
            }
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            return {}
    
    @staticmethod
    async def get_all_projects_stats():
        """Get stats for all projects"""
        try:
            projects_ref = db.collection('projects')
            docs = projects_ref.stream()
            
            projects_stats = {}
            for doc in docs:
                project_data = doc.to_dict()
                project_id = doc.id
                stats = await Analytics.get_project_stats(project_id)
                projects_stats[project_id] = {
                    'name': project_data.get('name'),
                    'stats': stats
                }
            
            return projects_stats
        except Exception as e:
            logger.error(f"Error getting all stats: {str(e)}")
            return {}
