# Secure Share - User Guide

## Quick Start

1. **Install and Run**
   ```bash
   npm install
   npm start
   ```

2. **Open the Website**
   - Navigate to `http://localhost:3000` in your browser

## How to Use

### Uploading Files

1. **Select a File**
   - Click the upload area or drag & drop a file

2. **Add Keywords** (Optional)
   - Enter comma-separated keywords (e.g., "invoice, 2024, important")
   - These will be encrypted and used for searching later

3. **Set Encryption Password**
   - Choose a strong password
   - **Remember this password** - you'll need it to decrypt the file

4. **Upload**
   - Click "Encrypt & Upload"
   - File is encrypted in your browser before being sent to the server

### Searching Files

1. **Enter a Keyword**
   - Type any keyword you used when uploading

2. **Enter Decryption Password**
   - Use the same password you used to encrypt the file

3. **Search**
   - Only files you can decrypt with that password will appear

### Downloading Files

1. **Click Download**
   - Click the download button on any file

2. **Enter Password** (if needed)
   - If you haven't already, enter the decryption password

3. **File is Decrypted**
   - File is automatically decrypted in your browser before downloading

### Deleting Files

- Click the "Delete" button to permanently remove a file

## Security Notes

- ✅ **All encryption happens in your browser** - the server never sees your unencrypted data
- ✅ **Your password never leaves your device** - only encrypted data is transmitted
- ✅ **AES-256-GCM encryption** - military-grade security
- ✅ **PBKDF2 key derivation** - with 100,000 iterations for strong password-based keys
- ⚠️ **Remember your passwords** - lost passwords mean lost files (by design for security)

## Technology

- **Frontend**: Pure JavaScript with Web Crypto API
- **Backend**: Node.js + Express
- **Encryption**: AES-256-GCM with PBKDF2 key derivation
- **Storage**: Local filesystem (easily adaptable to cloud storage)

## Tips

1. Use strong, unique passwords for sensitive files
2. Add descriptive keywords to make files easier to find later
3. Keep track of your passwords (use a password manager)
4. For production use, consider adding:
   - Database for metadata storage
   - Cloud storage integration (AWS S3, Google Cloud Storage)
   - User authentication
   - Rate limiting
   - HTTPS/TLS

## Troubleshooting

**File won't decrypt?**
- Make sure you're using the correct password
- Passwords are case-sensitive

**Search not finding files?**
- Verify you're using the correct decryption password
- Check if the keywords match what you entered during upload

**Upload failed?**
- Check file size (large files may take longer)
- Ensure the server is running
- Check browser console for errors

## Privacy Guarantee

This application implements a **zero-knowledge** architecture:
- Server cannot read your files
- Server cannot read your keywords
- Server cannot decrypt anything without your password
- Only you hold the encryption keys
