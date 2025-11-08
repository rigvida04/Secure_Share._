// Secure Share - Privacy-Preserving Keyword Search
// All encryption and processing happens client-side

class SecureShare {
    constructor() {
        this.storageKey = 'secureShare_files';
        this.init();
    }

    init() {
        // Event Listeners
        document.getElementById('fileInput').addEventListener('change', this.handleFileSelect.bind(this));
        document.getElementById('uploadBtn').addEventListener('click', this.uploadFile.bind(this));
        document.getElementById('searchBtn').addEventListener('click', this.searchFiles.bind(this));
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchFiles();
        });

        // Load and display existing files
        this.displayFiles();
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = `Selected: ${file.name}`;
        }
    }

    async uploadFile() {
        const fileInput = document.getElementById('fileInput');
        const keywordsInput = document.getElementById('fileKeywords');
        const statusDiv = document.getElementById('uploadStatus');

        // Validate inputs
        if (!fileInput.files[0]) {
            this.showStatus(statusDiv, 'Please select a file', 'error');
            return;
        }

        if (!keywordsInput.value.trim()) {
            this.showStatus(statusDiv, 'Please enter at least one keyword', 'error');
            return;
        }

        try {
            const file = fileInput.files[0];
            const keywords = keywordsInput.value.split(',').map(k => k.trim().toLowerCase());

            // Read file as base64
            const fileContent = await this.readFileAsBase64(file);

            // Encrypt file content
            const encryptedContent = await this.encrypt(fileContent);

            // Hash keywords for privacy-preserving search
            const hashedKeywords = keywords.map(k => this.hashKeyword(k));

            // Create file object
            const fileObject = {
                id: this.generateId(),
                name: file.name,
                size: file.size,
                type: file.type,
                encryptedContent: encryptedContent,
                hashedKeywords: hashedKeywords,
                keywords: keywords, // Store original for display
                uploadDate: new Date().toISOString()
            };

            // Store file
            this.saveFile(fileObject);

            // Clear inputs
            fileInput.value = '';
            keywordsInput.value = '';
            document.getElementById('fileName').textContent = '';

            // Show success
            this.showStatus(statusDiv, `File "${file.name}" encrypted and stored successfully!`, 'success');

            // Refresh file list
            this.displayFiles();

        } catch (error) {
            console.error('Upload error:', error);
            this.showStatus(statusDiv, 'Error uploading file. Please try again.', 'error');
        }
    }

    searchFiles() {
        const searchInput = document.getElementById('searchInput');
        const resultsDiv = document.getElementById('searchResults');
        const keyword = searchInput.value.trim().toLowerCase();

        if (!keyword) {
            resultsDiv.innerHTML = '<p class="empty-state">Please enter a keyword to search</p>';
            return;
        }

        // Hash the search keyword
        const hashedKeyword = this.hashKeyword(keyword);

        // Get all files
        const files = this.getFiles();

        // Search for matching files
        const results = files.filter(file => 
            file.hashedKeywords.includes(hashedKeyword)
        );

        // Display results
        if (results.length === 0) {
            resultsDiv.innerHTML = `<p class="empty-state">No files found for keyword: "${this.escapeHtml(keyword)}"</p>`;
        } else {
            resultsDiv.innerHTML = `
                <p style="margin-bottom: 15px; font-weight: 600;">Found ${results.length} file(s) matching "${this.escapeHtml(keyword)}":</p>
                ${results.map(file => `
                    <div class="result-item">
                        <h4>📄 ${this.escapeHtml(file.name)}</h4>
                        <p>Size: ${this.formatBytes(file.size)} | Uploaded: ${this.formatDate(file.uploadDate)}</p>
                        <p>Keywords: ${file.keywords.map(k => this.escapeHtml(k)).join(', ')}</p>
                        <div style="margin-top: 10px;">
                            <button class="btn btn-download" onclick="secureShare.downloadFile('${this.escapeHtml(file.id)}')">Download</button>
                            <button class="btn btn-danger" onclick="secureShare.deleteFile('${this.escapeHtml(file.id)}')">Delete</button>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    displayFiles() {
        const filesListDiv = document.getElementById('filesList');
        const files = this.getFiles();

        if (files.length === 0) {
            filesListDiv.innerHTML = '<p class="empty-state">No files stored yet. Upload a file to get started!</p>';
            return;
        }

        filesListDiv.innerHTML = files.map(file => `
            <div class="file-item">
                <div class="file-info">
                    <h4>📄 ${this.escapeHtml(file.name)}</h4>
                    <p>Size: ${this.formatBytes(file.size)} | Uploaded: ${this.formatDate(file.uploadDate)}</p>
                    <p>Keywords: ${file.keywords.map(k => this.escapeHtml(k)).join(', ')}</p>
                </div>
                <div class="file-actions">
                    <button class="btn btn-download" onclick="secureShare.downloadFile('${this.escapeHtml(file.id)}')">Download</button>
                    <button class="btn btn-danger" onclick="secureShare.deleteFile('${this.escapeHtml(file.id)}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async downloadFile(fileId) {
        const files = this.getFiles();
        const file = files.find(f => f.id === fileId);

        if (!file) {
            alert('File not found');
            return;
        }

        try {
            // Decrypt file content
            const decryptedContent = await this.decrypt(file.encryptedContent);

            // Convert base64 to blob
            const blob = this.base64ToBlob(decryptedContent, file.type);

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading file. Please try again.');
        }
    }

    deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) {
            return;
        }

        const files = this.getFiles();
        const updatedFiles = files.filter(f => f.id !== fileId);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedFiles));

        this.displayFiles();
        
        // Clear search results if they exist
        const resultsDiv = document.getElementById('searchResults');
        if (resultsDiv.innerHTML) {
            resultsDiv.innerHTML = '';
        }
    }

    // Encryption/Decryption (Simple XOR-based for demo - in production use Web Crypto API)
    async encrypt(data) {
        // Simple encryption for demo purposes
        // In production, use Web Crypto API with proper AES-GCM encryption
        const key = this.getEncryptionKey();
        return btoa(this.xorEncrypt(data, key));
    }

    async decrypt(encryptedData) {
        const key = this.getEncryptionKey();
        return this.xorEncrypt(atob(encryptedData), key);
    }

    xorEncrypt(data, key) {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    getEncryptionKey() {
        // In production, this should be user-provided or derived from user password
        // For demo, using a static key
        let key = localStorage.getItem('secureShare_key');
        if (!key) {
            key = this.generateRandomKey();
            localStorage.setItem('secureShare_key', key);
        }
        return key;
    }

    generateRandomKey() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Simple hash function for keywords
    hashKeyword(keyword) {
        let hash = 0;
        for (let i = 0; i < keyword.length; i++) {
            const char = keyword.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    // Utility functions
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    base64ToBlob(base64, type) {
        const parts = base64.split(',');
        const contentType = type || parts[0].match(/:(.*?);/)[1];
        const raw = atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getFiles() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveFile(file) {
        const files = this.getFiles();
        files.push(file);
        localStorage.setItem(this.storageKey, JSON.stringify(files));
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showStatus(element, message, type) {
        element.textContent = message;
        element.className = `status ${type}`;
        setTimeout(() => {
            element.className = 'status';
        }, 5000);
    }
}

// Initialize the app
const secureShare = new SecureShare();
