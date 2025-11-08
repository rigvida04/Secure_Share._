"""
Google Cloud Storage Manager for Secure Share
Handles all interactions with Google Cloud Storage for file and history storage
"""
import os
import json
from datetime import datetime
from typing import Optional, List, Dict, Any

try:
    from google.cloud import storage
    from google.oauth2 import service_account
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False
    print("Warning: google-cloud-storage not installed. Using local storage fallback.")


class CloudStorageManager:
    """Manages file storage in Google Cloud Storage with local fallback"""
    
    def __init__(self):
        """Initialize cloud storage manager"""
        self.bucket_name = os.getenv('GCS_BUCKET_NAME')
        self.project_id = os.getenv('GCS_PROJECT_ID')
        self.use_cloud = GCS_AVAILABLE and self.bucket_name and self.project_id
        
        if self.use_cloud:
            try:
                # Try to initialize GCS client
                credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
                
                if credentials_path and os.path.exists(credentials_path):
                    credentials = service_account.Credentials.from_service_account_file(
                        credentials_path
                    )
                    self.client = storage.Client(
                        credentials=credentials,
                        project=self.project_id
                    )
                else:
                    # Use default credentials
                    self.client = storage.Client(project=self.project_id)
                
                self.bucket = self.client.bucket(self.bucket_name)
                print(f"Google Cloud Storage initialized: {self.bucket_name}")
                
            except Exception as e:
                print(f"Failed to initialize GCS: {e}. Using local storage.")
                self.use_cloud = False
        
        # Local storage fallback
        self.local_storage_path = os.getenv('UPLOAD_FOLDER', 'uploads')
        self.metadata_file = os.path.join(self.local_storage_path, 'metadata.json')
        os.makedirs(self.local_storage_path, exist_ok=True)
        
        # Load or initialize metadata
        self._load_metadata()
    
    def _load_metadata(self):
        """Load metadata from local file"""
        if os.path.exists(self.metadata_file):
            try:
                with open(self.metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            except:
                self.metadata = {}
        else:
            self.metadata = {}
    
    def _save_metadata(self):
        """Save metadata to local file"""
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        except Exception as e:
            print(f"Failed to save metadata: {e}")
    
    def upload_file(self, file_data: bytes, cloud_path: str, metadata: Dict[str, str]) -> bool:
        """
        Upload file to Google Cloud Storage or local storage
        
        Args:
            file_data: Binary file data
            cloud_path: Path in cloud storage
            metadata: File metadata
            
        Returns:
            bool: True if upload successful
        """
        try:
            if self.use_cloud:
                # Upload to Google Cloud Storage
                blob = self.bucket.blob(cloud_path)
                blob.metadata = metadata
                blob.upload_from_string(file_data)
                print(f"File uploaded to GCS: {cloud_path}")
                return True
            else:
                # Local storage fallback
                local_path = os.path.join(self.local_storage_path, cloud_path.replace('/', '_'))
                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                
                with open(local_path, 'wb') as f:
                    f.write(file_data)
                
                # Store metadata locally
                metadata['local_path'] = local_path
                metadata['cloud_path'] = cloud_path
                print(f"File saved locally: {local_path}")
                return True
                
        except Exception as e:
            print(f"Upload failed: {e}")
            return False
    
    def download_file(self, cloud_path: str) -> Optional[bytes]:
        """
        Download file from Google Cloud Storage or local storage
        
        Args:
            cloud_path: Path in cloud storage
            
        Returns:
            bytes: File data or None if failed
        """
        try:
            if self.use_cloud:
                # Download from Google Cloud Storage
                blob = self.bucket.blob(cloud_path)
                data = blob.download_as_bytes()
                print(f"File downloaded from GCS: {cloud_path}")
                return data
            else:
                # Local storage fallback
                local_path = os.path.join(self.local_storage_path, cloud_path.replace('/', '_'))
                
                if os.path.exists(local_path):
                    with open(local_path, 'rb') as f:
                        data = f.read()
                    print(f"File read from local storage: {local_path}")
                    return data
                else:
                    print(f"File not found locally: {local_path}")
                    return None
                    
        except Exception as e:
            print(f"Download failed: {e}")
            return None
    
    def store_metadata(self, file_id: str, metadata: Dict[str, Any]):
        """Store file metadata"""
        self.metadata[file_id] = metadata
        self._save_metadata()
    
    def get_metadata(self, file_id: str) -> Optional[Dict[str, Any]]:
        """Get file metadata"""
        return self.metadata.get(file_id)
    
    def get_user_history(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get user's file history from cloud storage
        
        Args:
            user_id: User identifier
            
        Returns:
            List of file history entries
        """
        history = []
        
        try:
            # Get all files for this user from metadata
            for file_id, meta in self.metadata.items():
                if meta.get('user_id') == user_id:
                    history.append({
                        'file_id': file_id,
                        'filename': meta.get('filename'),
                        'upload_time': meta.get('upload_time'),
                        'cloud_path': meta.get('cloud_path')
                    })
            
            # Sort by upload time (newest first)
            history.sort(key=lambda x: x.get('upload_time', ''), reverse=True)
            
            if self.use_cloud:
                # Also check GCS for files
                prefix = f"user_{user_id}/"
                blobs = self.bucket.list_blobs(prefix=prefix)
                
                for blob in blobs:
                    # Add to history if not already there
                    blob_meta = blob.metadata or {}
                    if not any(h.get('cloud_path') == blob.name for h in history):
                        history.append({
                            'filename': blob_meta.get('original_filename', blob.name.split('/')[-1]),
                            'upload_time': blob_meta.get('upload_time', blob.time_created.isoformat()),
                            'cloud_path': blob.name,
                            'size': blob.size
                        })
            
            return history
            
        except Exception as e:
            print(f"Failed to get history: {e}")
            return history
    
    def search_user_files(self, user_id: str, keyword: str) -> List[Dict[str, Any]]:
        """
        Search user's files by keyword
        
        Args:
            user_id: User identifier
            keyword: Search keyword
            
        Returns:
            List of matching files
        """
        results = []
        keyword_lower = keyword.lower()
        
        try:
            # Search in metadata
            for file_id, meta in self.metadata.items():
                if meta.get('user_id') == user_id:
                    filename = meta.get('filename', '').lower()
                    if keyword_lower in filename:
                        results.append({
                            'file_id': file_id,
                            'filename': meta.get('filename'),
                            'upload_time': meta.get('upload_time'),
                            'cloud_path': meta.get('cloud_path')
                        })
            
            return results
            
        except Exception as e:
            print(f"Search failed: {e}")
            return results
    
    def delete_file(self, cloud_path: str) -> bool:
        """
        Delete file from cloud storage
        
        Args:
            cloud_path: Path in cloud storage
            
        Returns:
            bool: True if deletion successful
        """
        try:
            if self.use_cloud:
                blob = self.bucket.blob(cloud_path)
                blob.delete()
                print(f"File deleted from GCS: {cloud_path}")
            else:
                local_path = os.path.join(self.local_storage_path, cloud_path.replace('/', '_'))
                if os.path.exists(local_path):
                    os.remove(local_path)
                    print(f"File deleted locally: {local_path}")
            
            return True
            
        except Exception as e:
            print(f"Delete failed: {e}")
            return False
