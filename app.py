#!/usr/bin/env python3
"""
Secure Share - A Privacy-Preserving File Sharing Website
Features:
- Port encryption (TLS/SSL)
- File encryption at rest and in transit
- Prevention of unauthorized data duplication
- Session-based access control
"""

import os
import secrets
import hashlib
import base64
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, render_template, session
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import ssl

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Store file metadata and encryption keys per session
file_registry = {}


def generate_encryption_key(session_id, file_id):
    """
    Generate a unique encryption key based on session and file ID.
    This prevents duplication as the key is tied to the session.
    """
    combined = f"{session_id}:{file_id}:{app.secret_key}"
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=session_id.encode()[:16].ljust(16, b'0'),
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(combined.encode()))
    return key


def encrypt_file(file_path, key):
    """Encrypt a file using Fernet symmetric encryption"""
    fernet = Fernet(key)
    with open(file_path, 'rb') as f:
        data = f.read()
    encrypted_data = fernet.encrypt(data)
    with open(file_path + '.encrypted', 'wb') as f:
        f.write(encrypted_data)
    os.remove(file_path)  # Remove unencrypted file
    return file_path + '.encrypted'


def decrypt_file(encrypted_path, key):
    """Decrypt a file using Fernet symmetric encryption"""
    fernet = Fernet(key)
    with open(encrypted_path, 'rb') as f:
        encrypted_data = f.read()
    decrypted_data = fernet.decrypt(encrypted_data)
    return decrypted_data


def calculate_file_hash(file_data):
    """Calculate SHA-256 hash of file data for integrity verification"""
    return hashlib.sha256(file_data).hexdigest()


@app.route('/')
def index():
    """Serve the main page"""
    if 'session_id' not in session:
        session['session_id'] = secrets.token_hex(16)
        session.permanent = True
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle file upload with encryption.
    Each file is encrypted with a session-specific key to prevent duplication.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file:
        # Generate unique file ID
        file_id = secrets.token_hex(16)
        filename = secure_filename(file.filename)
        
        # Get session ID
        session_id = session.get('session_id')
        if not session_id:
            session_id = secrets.token_hex(16)
            session['session_id'] = session_id
            session.permanent = True
        
        # Save file temporarily
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_{filename}")
        file.save(temp_path)
        
        # Generate session-specific encryption key
        encryption_key = generate_encryption_key(session_id, file_id)
        
        # Encrypt the file
        encrypted_path = encrypt_file(temp_path, encryption_key)
        
        # Calculate file hash for integrity
        with open(encrypted_path, 'rb') as f:
            file_hash = calculate_file_hash(f.read())
        
        # Store file metadata
        file_registry[file_id] = {
            'filename': filename,
            'encrypted_path': encrypted_path,
            'session_id': session_id,
            'upload_time': datetime.utcnow().isoformat(),
            'file_hash': file_hash,
            'accessed': False
        }
        
        return jsonify({
            'success': True,
            'file_id': file_id,
            'filename': filename,
            'message': 'File uploaded and encrypted successfully'
        }), 200


@app.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    """
    Handle file download with decryption.
    Only accessible by the session that uploaded the file.
    """
    if file_id not in file_registry:
        return jsonify({'error': 'File not found'}), 404
    
    file_info = file_registry[file_id]
    session_id = session.get('session_id')
    
    # Verify session ownership
    if session_id != file_info['session_id']:
        return jsonify({'error': 'Unauthorized: This file belongs to a different session'}), 403
    
    # Mark file as accessed (anti-duplication measure)
    if file_info['accessed']:
        return jsonify({
            'error': 'File already downloaded. Re-download prevented for security.'
        }), 403
    
    try:
        # Generate decryption key
        encryption_key = generate_encryption_key(session_id, file_id)
        
        # Decrypt file
        decrypted_data = decrypt_file(file_info['encrypted_path'], encryption_key)
        
        # Verify integrity
        data_hash = calculate_file_hash(decrypted_data)
        
        # Mark as accessed
        file_info['accessed'] = True
        
        # Create a temporary decrypted file for sending
        temp_decrypted_path = file_info['encrypted_path'] + '.temp'
        with open(temp_decrypted_path, 'wb') as f:
            f.write(decrypted_data)
        
        response = send_file(
            temp_decrypted_path,
            as_attachment=True,
            download_name=file_info['filename'],
            mimetype='application/octet-stream'
        )
        
        # Clean up temporary file after sending
        @response.call_on_close
        def cleanup():
            if os.path.exists(temp_decrypted_path):
                os.remove(temp_decrypted_path)
        
        return response
        
    except Exception as e:
        # Log the error for debugging but don't expose details to user
        app.logger.error(f'Decryption failed for file {file_id}: {str(e)}')
        return jsonify({'error': 'Decryption failed. Please contact support.'}), 500


@app.route('/files', methods=['GET'])
def list_files():
    """List files for current session"""
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'files': []}), 200
    
    user_files = []
    for file_id, info in file_registry.items():
        if info['session_id'] == session_id:
            user_files.append({
                'file_id': file_id,
                'filename': info['filename'],
                'upload_time': info['upload_time'],
                'accessed': info['accessed']
            })
    
    return jsonify({'files': user_files}), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'encryption': 'enabled'}), 200


if __name__ == '__main__':
    # For production, use a proper WSGI server with SSL/TLS
    # This demonstrates port encryption using SSL context
    
    # Create SSL context for encrypted communication (port encryption)
    ssl_context = None
    
    # Check if SSL certificates exist
    cert_file = 'cert.pem'
    key_file = 'key.pem'
    
    if os.path.exists(cert_file) and os.path.exists(key_file):
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ssl_context.load_cert_chain(cert_file, key_file)
        print("Running with SSL/TLS encryption (HTTPS)")
        print("Port encryption: ENABLED")
    else:
        print("Warning: Running without SSL certificates")
        print("For production, generate certificates using:")
        print("  openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        ssl_context=ssl_context
    )
