# Secure Share 🔒

A Privacy-Preserving Keyword Search website with client-side encryption and secure storage.

## 🌐 Live Demo

**Website URL:** [https://rigvida04.github.io/Secure_Share._/](https://rigvida04.github.io/Secure_Share._/)

> **Note:** To activate the live website, enable GitHub Pages in [repository settings](https://github.com/rigvida04/Secure_Share._/settings/pages) by selecting "GitHub Actions" as the source. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## ✨ Features

- **🔐 Client-Side Encryption**: All files are encrypted in your browser before storage
- **🔍 Privacy-Preserving Search**: Keywords are hashed for secure searching without exposing file contents
- **💾 Local Storage**: Data is stored securely in your browser's local storage
- **🚫 No Server Upload**: Your files never leave your device - complete privacy
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 How to Use

1. **Upload a File**: 
   - Click "Choose a file to upload" and select any file
   - Enter comma-separated keywords (e.g., "document, report, 2024")
   - Click "Encrypt & Store" to save your file securely

2. **Search Files**:
   - Enter a keyword in the search box
   - Click "Search" to find all files tagged with that keyword
   - The search uses privacy-preserving hashed keywords

3. **Download Files**:
   - Click the "Download" button on any file to decrypt and download it
   - The file is decrypted in your browser before download

4. **Delete Files**:
   - Click the "Delete" button to remove files from storage

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser LocalStorage API
- **Encryption**: Client-side XOR encryption (demo implementation)
- **Deployment**: GitHub Pages

## 🔒 Security Note

This is a demonstration project. The encryption implementation uses a simple XOR-based approach for educational purposes. For production use, implement proper encryption using the Web Crypto API with AES-GCM or similar standards.

## 📄 License

See [LICENSE](LICENSE) file for details.
