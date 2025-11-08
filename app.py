"""
Secure Share - Privacy-Preserving File Sharing with Cloud Storage
"""
import os
import secrets
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, send_file, flash, redirect, url_for
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import json

from cloud_storage import CloudStorageManager
from notification_system import NotificationManager

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(32))

# Configuration
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'zip'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Initialize managers
cloud_storage = CloudStorageManager()
notification_manager = NotificationManager()

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_session_user():
    """Get current session user ID"""
    if 'user_id' not in session:
        session['user_id'] = secrets.token_hex(8)
    return session['user_id']


@app.route('/')
def index():
    """Main page"""
    user_id = get_session_user()
    
    # Send notification for website visit
    notification_manager.send_notification(
        user_id,
        'Website Access',
        f'You are accessing Secure Share at {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
    )
    
    # Get user's notifications
    notifications = notification_manager.get_user_notifications(user_id, limit=5)
    
    return render_template('index.html', notifications=notifications)


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    user_id = get_session_user()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        filename = secure_filename(file.filename)
        file_data = file.read()
        
        # Check file size
        if len(file_data) > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large (max 16MB)'}), 400
        
        # Encrypt file data
        encryption_key = Fernet.generate_key()
        fernet = Fernet(encryption_key)
        encrypted_data = fernet.encrypt(file_data)
        
        # Generate file ID
        file_id = secrets.token_urlsafe(16)
        
        # Upload to Google Cloud Storage
        cloud_path = f"user_{user_id}/{file_id}_{filename}"
        success = cloud_storage.upload_file(encrypted_data, cloud_path, {
            'user_id': user_id,
            'original_filename': filename,
            'upload_time': datetime.now().isoformat(),
            'encrypted': 'true'
        })
        
        if success:
            # Store encryption key (in production, use secure key management)
            cloud_storage.store_metadata(file_id, {
                'encryption_key': encryption_key.decode(),
                'filename': filename,
                'user_id': user_id,
                'cloud_path': cloud_path,
                'upload_time': datetime.now().isoformat()
            })
            
            # Send notification
            notification_manager.send_notification(
                user_id,
                'File Upload',
                f'File "{filename}" uploaded successfully to cloud storage'
            )
            
            return jsonify({
                'success': True,
                'file_id': file_id,
                'filename': filename,
                'message': 'File uploaded to Google Cloud Storage successfully'
            })
        else:
            return jsonify({'error': 'Failed to upload to cloud storage'}), 500
            
    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Upload failed'}), 500


@app.route('/download/<file_id>')
def download_file(file_id):
    """Download and decrypt file"""
    user_id = get_session_user()
    
    try:
        # Get file metadata
        metadata = cloud_storage.get_metadata(file_id)
        
        if not metadata:
            return jsonify({'error': 'File not found'}), 404
        
        # Verify user has access (in production, implement proper access control)
        if metadata.get('user_id') != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Download from cloud
        encrypted_data = cloud_storage.download_file(metadata['cloud_path'])
        
        if not encrypted_data:
            return jsonify({'error': 'Failed to download from cloud'}), 500
        
        # Decrypt file
        encryption_key = metadata['encryption_key'].encode()
        fernet = Fernet(encryption_key)
        decrypted_data = fernet.decrypt(encrypted_data)
        
        # Save to temp file
        temp_path = os.path.join(UPLOAD_FOLDER, f"temp_{file_id}")
        with open(temp_path, 'wb') as f:
            f.write(decrypted_data)
        
        # Send notification
        notification_manager.send_notification(
            user_id,
            'File Download',
            f'File "{metadata["filename"]}" downloaded from cloud storage'
        )
        
        return send_file(
            temp_path,
            as_attachment=True,
            download_name=metadata['filename']
        )
        
    except Exception as e:
        app.logger.error(f"Download error: {str(e)}")
        return jsonify({'error': 'Download failed'}), 500


@app.route('/history')
def get_history():
    """Get user's file history from cloud storage"""
    user_id = get_session_user()
    
    try:
        history = cloud_storage.get_user_history(user_id)
        
        # Send notification
        notification_manager.send_notification(
            user_id,
            'History Access',
            'You accessed your file history'
        )
        
        return jsonify({
            'success': True,
            'history': history
        })
        
    except Exception as e:
        app.logger.error(f"History error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve history'}), 500


@app.route('/notifications')
def get_notifications():
    """Get user notifications"""
    user_id = get_session_user()
    
    try:
        limit = request.args.get('limit', 10, type=int)
        notifications = notification_manager.get_user_notifications(user_id, limit=limit)
        
        return jsonify({
            'success': True,
            'notifications': notifications
        })
        
    except Exception as e:
        app.logger.error(f"Notification error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve notifications'}), 500


@app.route('/search', methods=['POST'])
def search_files():
    """Search files using keyword search"""
    user_id = get_session_user()
    
    try:
        keyword = request.json.get('keyword', '')
        
        if not keyword:
            return jsonify({'error': 'No keyword provided'}), 400
        
        # Search in user's files
        results = cloud_storage.search_user_files(user_id, keyword)
        
        # Send notification
        notification_manager.send_notification(
            user_id,
            'File Search',
            f'You searched for "{keyword}"'
        )
        
        return jsonify({
            'success': True,
            'results': results,
            'keyword': keyword
        })
        
    except Exception as e:
        app.logger.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500


if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development', host='0.0.0.0', port=5000)
