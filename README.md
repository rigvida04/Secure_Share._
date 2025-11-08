# Secure_Share._ 🔒

A Privacy-Preserving Keyword Search website made with encryption and cloud storage.

## Features

- 🔐 **Client-Side Encryption**: All files are encrypted in your browser before upload using AES-256-GCM
- 🔍 **Encrypted Keyword Search**: Search through encrypted file metadata without exposing sensitive data
- 📁 **Secure File Sharing**: Upload, store, and download encrypted files
- 🛡️ **Privacy-First**: Your encryption keys never leave your device
- 🎨 **Modern UI**: Beautiful, responsive interface with drag-and-drop support

## How It Works

1. **Upload**: Select a file, add keywords, and set an encryption password
2. **Encryption**: File and keywords are encrypted client-side using Web Crypto API
3. **Storage**: Encrypted data is stored on the server (files remain unreadable)
4. **Search**: Search encrypted keywords using your decryption password
5. **Download**: Retrieve and decrypt files with the correct password

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rigvida04/Secure_Share._.git
cd Secure_Share._
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Uploading Files

1. Click or drag-and-drop a file into the upload area
2. Enter keywords (comma-separated) to help you find the file later
3. Set a strong encryption password
4. Click "Encrypt & Upload"

### Searching Files

1. Enter a keyword in the search box
2. Enter your decryption password
3. Only files with matching keywords (that can be decrypted with your password) will appear

### Downloading Files

1. Click the "Download" button on any file
2. Enter the decryption password (if not remembered)
3. The file will be decrypted and downloaded to your device

## Security Features

- **AES-256-GCM Encryption**: Industry-standard encryption algorithm
- **PBKDF2 Key Derivation**: 100,000 iterations for password-based keys
- **Client-Side Processing**: Encryption/decryption happens in your browser
- **Zero-Knowledge**: Server never sees your unencrypted data or passwords

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Web Crypto API)
- **Backend**: Node.js, Express
- **File Handling**: Multer
- **Encryption**: Web Crypto API (AES-256-GCM, PBKDF2)

## Development

To run in development mode:
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Rigvida Sharma

## Disclaimer

This is a demonstration project. For production use, consider:
- Using a proper database instead of in-memory storage
- Implementing user authentication
- Adding cloud storage integration (AWS S3, Google Cloud Storage, etc.)
- Implementing rate limiting and security headers
- Adding comprehensive error handling and logging
