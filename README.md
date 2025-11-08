# Secure Share 🔒

A Privacy-Preserving File & Text Upload website with encryption and secure storage.

## Features

- **File Upload**: Upload files securely with automatic encryption
- **Text Upload**: Enter text directly and save it as an encrypted file
- **AES-128 Encryption**: All uploads are encrypted using Fernet (symmetric encryption)
- **Secure Storage**: Files stored with randomized, secure filenames
- **User-Friendly Interface**: Modern, responsive web interface with tabbed upload options

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rigvida04/Secure_Share._.git
cd Secure_Share._
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

For development with debug mode enabled:
```bash
FLASK_DEBUG=true python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage

### Upload a File
1. Click on the "Upload File" tab
2. Select a file from your computer
3. Click "Encrypt & Upload File"
4. Your file will be encrypted and stored securely

### Upload Text
1. Click on the "Upload Text" tab
2. (Optional) Enter a filename for your text
3. Type or paste your text content
4. Click "Encrypt & Upload Text"
5. Your text will be saved as an encrypted file

### View Uploaded Files
- Click "View All Files" to see a list of all encrypted uploads
- View original filenames, encrypted filenames, and upload timestamps

## Security

- All data is encrypted using the Fernet encryption scheme (AES-128 in CBC mode)
- Encryption key is automatically generated and stored in `secret.key`
- Files are stored with secure, randomized names to prevent filename enumeration
- Maximum upload size: 16MB

## Requirements

- Python 3.7+
- Flask 3.0.0
- cryptography 41.0.7
- Werkzeug 3.0.1

## License

See LICENSE file for details.
