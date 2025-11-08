import os
import hashlib
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Generate or load encryption key
KEY_FILE = 'secret.key'
if os.path.exists(KEY_FILE):
    with open(KEY_FILE, 'rb') as f:
        key = f.read()
else:
    key = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as f:
        f.write(key)

cipher_suite = Fernet(key)

def encrypt_data(data):
    """Encrypt data using Fernet encryption"""
    if isinstance(data, str):
        data = data.encode()
    return cipher_suite.encrypt(data)

def decrypt_data(encrypted_data):
    """Decrypt data using Fernet encryption"""
    return cipher_suite.decrypt(encrypted_data)

def generate_secure_filename(original_filename):
    """Generate a secure filename with timestamp"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    # Create hash of original filename
    hash_digest = hashlib.md5(original_filename.encode()).hexdigest()[:8]
    return f"{timestamp}_{hash_digest}.enc"

@app.route('/')
def index():
    """Main upload page"""
    return render_template('index.html')

@app.route('/upload_file', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        flash('No file selected', 'error')
        return redirect(url_for('index'))
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No file selected', 'error')
        return redirect(url_for('index'))
    
    if file:
        # Read file content
        file_content = file.read()
        
        # Encrypt the file content
        encrypted_content = encrypt_data(file_content)
        
        # Generate secure filename
        secure_name = generate_secure_filename(file.filename)
        
        # Save encrypted file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
        with open(filepath, 'wb') as f:
            f.write(encrypted_content)
        
        # Store original filename mapping
        mapping_file = filepath + '.meta'
        with open(mapping_file, 'w') as f:
            f.write(file.filename)
        
        flash(f'File "{file.filename}" uploaded and encrypted successfully!', 'success')
        return redirect(url_for('index'))

@app.route('/upload_text', methods=['POST'])
def upload_text():
    """Handle text upload"""
    text_content = request.form.get('text_content', '')
    text_filename = request.form.get('text_filename', '')
    
    if not text_content:
        flash('No text content provided', 'error')
        return redirect(url_for('index'))
    
    if not text_filename:
        text_filename = f"text_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    
    # Add .txt extension if not present
    if not text_filename.endswith('.txt'):
        text_filename += '.txt'
    
    # Encrypt the text content
    encrypted_content = encrypt_data(text_content)
    
    # Generate secure filename
    secure_name = generate_secure_filename(text_filename)
    
    # Save encrypted text
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
    with open(filepath, 'wb') as f:
        f.write(encrypted_content)
    
    # Store original filename mapping
    mapping_file = filepath + '.meta'
    with open(mapping_file, 'w') as f:
        f.write(text_filename)
    
    flash(f'Text saved as "{text_filename}" and encrypted successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/files')
def list_files():
    """List all uploaded files"""
    files = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.endswith('.enc'):
            # Get original filename from meta file
            meta_file = os.path.join(app.config['UPLOAD_FOLDER'], filename + '.meta')
            if os.path.exists(meta_file):
                with open(meta_file, 'r') as f:
                    original_name = f.read()
                files.append({
                    'encrypted_name': filename,
                    'original_name': original_name,
                    'upload_time': datetime.fromtimestamp(
                        os.path.getmtime(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    ).strftime('%Y-%m-%d %H:%M:%S')
                })
    
    return render_template('files.html', files=files)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
