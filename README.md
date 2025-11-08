# 🔐 Secure Share

A Privacy-Preserving File Sharing Website with Port Encryption and Anti-Duplication Features

## Features

### 🛡️ Port Encryption
- **TLS/SSL Encryption**: All data transmitted over encrypted HTTPS connections
- **Secure Port Communication**: Prevents man-in-the-middle attacks and data interception
- **End-to-End Security**: Data encrypted in transit using industry-standard protocols

### 🔒 File Encryption
- **AES-256 Encryption**: Files encrypted at rest using Fernet (symmetric encryption)
- **Session-Specific Keys**: Each upload generates unique encryption keys tied to the user session
- **Key Derivation**: PBKDF2 with SHA-256 for secure key generation

### 🚫 Anti-Duplication Measures
- **Session Isolation**: Files can only be accessed by the session that uploaded them
- **One-Time Download**: Files marked as accessed after first download, preventing re-downloads
- **Unique Encryption Keys**: Session and file-specific keys prevent unauthorized copying
- **Automatic Cleanup**: Temporary decrypted files removed immediately after download

### 🔐 Additional Security Features
- File integrity verification using SHA-256 hashing
- Secure filename handling to prevent path traversal attacks
- Session expiration and timeout mechanisms
- Maximum file size limits (50MB)

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/rigvida04/Secure_Share._
   cd Secure_Share._
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate SSL certificates (for port encryption)**
   
   For development/testing:
   ```bash
   openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
   ```
   
   For production, use certificates from a trusted Certificate Authority (CA).

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the website**
   - With SSL: `https://localhost:5000`
   - Without SSL: `http://localhost:5000` (not recommended for production)

## Usage

### Uploading Files
1. Navigate to the website
2. Click "Select File" or drag and drop a file into the upload area
3. File is automatically encrypted and stored securely
4. You'll receive a confirmation message

### Downloading Files
1. Your uploaded files appear in the "Your Encrypted Files" section
2. Click the "Download" button to decrypt and download a file
3. Each file can only be downloaded once for security reasons
4. File is automatically decrypted during download

## Security Architecture

### Port Encryption Implementation
```
Client <--[TLS/SSL]--> Server
  ↓                      ↓
HTTPS Port 5000    Encrypted Storage
  ↓                      ↓
Encrypted Data    Session-Specific Keys
```

### Encryption Flow
1. **Upload**: File → Session Key Generation → AES-256 Encryption → Encrypted Storage
2. **Download**: Encrypted File → Session Verification → Decryption → Secure Transfer → Cleanup

### Anti-Duplication Mechanism
- Each file is encrypted with a unique key derived from:
  - User session ID
  - File ID
  - Application secret key
- Files are tied to specific sessions and cannot be accessed by other sessions
- One-time download policy prevents multiple retrievals
- Encrypted files are stored without original content exposure

## Configuration

### Environment Variables
- `SECRET_KEY`: Set a strong secret key for production
  ```bash
  export SECRET_KEY="your-strong-secret-key-here"
  ```

### Application Settings (in `app.py`)
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 50MB)
- `UPLOAD_FOLDER`: Directory for encrypted file storage (default: 'uploads')
- `PERMANENT_SESSION_LIFETIME`: Session duration (default: 1 hour)

## Security Best Practices

1. **Always use HTTPS in production** - Generate proper SSL certificates
2. **Set a strong SECRET_KEY** - Use environment variables, never hardcode
3. **Regular updates** - Keep dependencies updated for security patches
4. **Secure deployment** - Use a production WSGI server (e.g., Gunicorn, uWSGI)
5. **Firewall configuration** - Limit access to necessary ports only
6. **Regular backups** - Implement backup strategies for encrypted files
7. **Monitor access logs** - Track usage patterns and detect anomalies

## Production Deployment

For production deployment, use a WSGI server with SSL/TLS:

```bash
# Install Gunicorn
pip install gunicorn

# Run with SSL
gunicorn --certfile=cert.pem --keyfile=key.pem --bind 0.0.0.0:5000 app:app
```

## Limitations

- Files are stored on the server (consider cloud storage integration for scalability)
- Session-based security requires active sessions
- One-time download policy may need adjustment based on use case
- File size limited to 50MB (configurable)

## Future Enhancements

- Cloud storage integration (AWS S3, Google Cloud Storage)
- Multi-factor authentication
- File expiration and auto-deletion
- Advanced keyword search capabilities
- Share links with time-limited access
- Audit logging and compliance features

## License

See [LICENSE](LICENSE) file for details.

## Security Policy

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.

## Contributing

Contributions are welcome! Please ensure all security features are maintained and enhanced.

## Disclaimer

This application demonstrates secure file sharing with encryption. Always conduct security audits and penetration testing before production use.
