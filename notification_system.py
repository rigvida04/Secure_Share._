"""
Notification System for Secure Share
Sends notifications to users whenever they use the website
"""
import os
import json
from datetime import datetime
from typing import List, Dict, Any


class NotificationManager:
    """Manages user notifications for website usage"""
    
    def __init__(self):
        """Initialize notification manager"""
        self.enabled = os.getenv('ENABLE_NOTIFICATIONS', 'true').lower() == 'true'
        self.notifications_file = os.path.join(
            os.getenv('UPLOAD_FOLDER', 'uploads'),
            'notifications.json'
        )
        
        # Load existing notifications
        self._load_notifications()
    
    def _load_notifications(self):
        """Load notifications from file"""
        if os.path.exists(self.notifications_file):
            try:
                with open(self.notifications_file, 'r') as f:
                    self.notifications = json.load(f)
            except:
                self.notifications = {}
        else:
            self.notifications = {}
    
    def _save_notifications(self):
        """Save notifications to file"""
        try:
            os.makedirs(os.path.dirname(self.notifications_file), exist_ok=True)
            with open(self.notifications_file, 'w') as f:
                json.dump(self.notifications, f, indent=2)
        except Exception as e:
            print(f"Failed to save notifications: {e}")
    
    def send_notification(self, user_id: str, notification_type: str, message: str):
        """
        Send a notification to a user
        
        Args:
            user_id: User identifier
            notification_type: Type of notification (e.g., 'Website Access', 'File Upload')
            message: Notification message
        """
        if not self.enabled:
            return
        
        try:
            # Initialize user notifications if not exists
            if user_id not in self.notifications:
                self.notifications[user_id] = []
            
            # Create notification
            notification = {
                'id': len(self.notifications[user_id]) + 1,
                'type': notification_type,
                'message': message,
                'timestamp': datetime.now().isoformat(),
                'read': False
            }
            
            # Add to user's notifications
            self.notifications[user_id].append(notification)
            
            # Keep only last 100 notifications per user
            if len(self.notifications[user_id]) > 100:
                self.notifications[user_id] = self.notifications[user_id][-100:]
            
            # Save to file
            self._save_notifications()
            
            print(f"Notification sent to {user_id}: [{notification_type}] {message}")
            
        except Exception as e:
            print(f"Failed to send notification: {e}")
    
    def get_user_notifications(self, user_id: str, limit: int = 10, unread_only: bool = False) -> List[Dict[str, Any]]:
        """
        Get user's notifications
        
        Args:
            user_id: User identifier
            limit: Maximum number of notifications to return
            unread_only: Only return unread notifications
            
        Returns:
            List of notifications
        """
        if user_id not in self.notifications:
            return []
        
        notifications = self.notifications[user_id]
        
        if unread_only:
            notifications = [n for n in notifications if not n.get('read', False)]
        
        # Return most recent notifications (reverse order)
        return list(reversed(notifications[-limit:]))
    
    def mark_as_read(self, user_id: str, notification_id: int):
        """
        Mark a notification as read
        
        Args:
            user_id: User identifier
            notification_id: Notification ID
        """
        if user_id not in self.notifications:
            return
        
        for notification in self.notifications[user_id]:
            if notification.get('id') == notification_id:
                notification['read'] = True
                self._save_notifications()
                break
    
    def mark_all_as_read(self, user_id: str):
        """
        Mark all notifications as read for a user
        
        Args:
            user_id: User identifier
        """
        if user_id not in self.notifications:
            return
        
        for notification in self.notifications[user_id]:
            notification['read'] = True
        
        self._save_notifications()
    
    def get_unread_count(self, user_id: str) -> int:
        """
        Get count of unread notifications
        
        Args:
            user_id: User identifier
            
        Returns:
            Number of unread notifications
        """
        if user_id not in self.notifications:
            return 0
        
        return sum(1 for n in self.notifications[user_id] if not n.get('read', False))
    
    def clear_old_notifications(self, user_id: str, days: int = 30):
        """
        Clear notifications older than specified days
        
        Args:
            user_id: User identifier
            days: Number of days to keep
        """
        if user_id not in self.notifications:
            return
        
        from datetime import timedelta
        cutoff_date = datetime.now() - timedelta(days=days)
        
        self.notifications[user_id] = [
            n for n in self.notifications[user_id]
            if datetime.fromisoformat(n['timestamp']) > cutoff_date
        ]
        
        self._save_notifications()
