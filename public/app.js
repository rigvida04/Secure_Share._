// Main application logic

let selectedFile = null;
let allFiles = [];
let encryptionPasswords = {}; // Store passwords temporarily (in production, use secure storage)

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const keywordsInput = document.getElementById('keywords');
const encryptionKeyInput = document.getElementById('encryptionKey');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const searchInput = document.getElementById('searchInput');
const searchKey = document.getElementById('searchKey');
const searchBtn = document.getElementById('searchBtn');
const filesList = document.getElementById('filesList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadFiles();
});

function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => fileInput.click());

    // File selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            updateUploadArea();
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            selectedFile = e.dataTransfer.files[0];
            fileInput.files = e.dataTransfer.files;
            updateUploadArea();
        }
    });

    // Upload button
    uploadBtn.addEventListener('click', handleUpload);

    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleSearch);
}

function updateUploadArea() {
    if (selectedFile) {
        uploadArea.innerHTML = `
            <div class="upload-icon">✓</div>
            <p><strong>${selectedFile.name}</strong></p>
            <p style="color: #666; font-size: 0.9em;">${formatFileSize(selectedFile.size)}</p>
        `;
        uploadBtn.disabled = false;
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function handleUpload() {
    if (!selectedFile) {
        showStatus('Please select a file', 'error');
        return;
    }

    const password = encryptionKeyInput.value;
    if (!password) {
        showStatus('Please enter an encryption password', 'error');
        return;
    }

    const keywords = keywordsInput.value;

    uploadBtn.disabled = true;
    showStatus('Encrypting and uploading...', 'success');

    try {
        // Encrypt the file
        const encryptedFile = await window.cryptoHelper.encryptFile(selectedFile, password);

        // Encrypt keywords
        const encryptedKeywords = keywords ? 
            await window.cryptoHelper.encryptText(keywords, password) : '';

        // Create form data
        const formData = new FormData();
        formData.append('file', encryptedFile, selectedFile.name + '.enc');
        formData.append('originalName', selectedFile.name);
        formData.append('keywords', encryptedKeywords);

        // Upload to server
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Store password for this file (in memory)
            encryptionPasswords[result.fileId] = password;
            
            showStatus('File encrypted and uploaded successfully!', 'success');
            
            // Reset form
            selectedFile = null;
            fileInput.value = '';
            keywordsInput.value = '';
            encryptionKeyInput.value = '';
            uploadArea.innerHTML = `
                <div class="upload-icon">📁</div>
                <p>Drag & drop your file here or click to browse</p>
            `;
            uploadBtn.disabled = true;

            // Reload files
            await loadFiles();
        } else {
            showStatus('Upload failed: ' + result.error, 'error');
        }
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
    } finally {
        uploadBtn.disabled = false;
    }
}

async function loadFiles() {
    try {
        const response = await fetch('/api/files');
        allFiles = await response.json();
        displayFiles(allFiles);
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

async function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const password = searchKey.value;

    if (!searchTerm) {
        displayFiles(allFiles);
        return;
    }

    if (!password) {
        showStatus('Please enter decryption password to search', 'error');
        return;
    }

    // Filter files by searching encrypted keywords
    const matchedFiles = [];
    
    for (const file of allFiles) {
        if (file.encryptedKeywords) {
            try {
                const decryptedKeywords = await window.cryptoHelper.decryptText(
                    file.encryptedKeywords, 
                    password
                );
                
                if (decryptedKeywords.toLowerCase().includes(searchTerm)) {
                    matchedFiles.push(file);
                }
            } catch (error) {
                // Wrong password or decryption failed, skip this file
                console.log('Could not decrypt keywords for file:', file.originalName);
            }
        }
    }

    displayFiles(matchedFiles);
    
    if (matchedFiles.length === 0 && searchTerm) {
        showStatus('No files found matching your search', 'error');
    }
}

function displayFiles(files) {
    if (files.length === 0) {
        filesList.innerHTML = '<p class="empty-state">No files uploaded yet. Upload your first file above!</p>';
        return;
    }

    filesList.innerHTML = files.map(file => `
        <div class="file-item" data-file-id="${file.id}">
            <div class="file-info">
                <div class="file-name">🔒 ${file.originalName}</div>
                <div class="file-meta">
                    Uploaded: ${new Date(file.uploadDate).toLocaleString()} | 
                    Size: ${formatFileSize(file.size)}
                </div>
            </div>
            <div class="file-actions">
                <button class="btn btn-download" onclick="downloadFile('${file.id}', '${file.filename}', '${file.originalName}')">
                    <span class="btn-icon">⬇️</span> Download
                </button>
                <button class="btn btn-danger" onclick="deleteFile('${file.id}')">
                    <span class="btn-icon">🗑️</span> Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function downloadFile(fileId, filename, originalName) {
    const password = encryptionPasswords[fileId] || prompt('Enter decryption password:');
    
    if (!password) {
        showStatus('Password required to decrypt file', 'error');
        return;
    }

    try {
        showStatus('Downloading and decrypting...', 'success');

        // Download encrypted file
        const response = await fetch(`/api/download/${filename}`);
        const encryptedBlob = await response.blob();

        // Decrypt file
        const decryptedBlob = await window.cryptoHelper.decryptFile(encryptedBlob, password);

        // Download decrypted file
        const url = URL.createObjectURL(decryptedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus('File decrypted and downloaded successfully!', 'success');
        
        // Store password for future use
        encryptionPasswords[fileId] = password;
    } catch (error) {
        showStatus('Decryption failed. Wrong password?', 'error');
    }
}

async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }

    try {
        const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showStatus('File deleted successfully', 'success');
            delete encryptionPasswords[fileId];
            await loadFiles();
        } else {
            showStatus('Delete failed: ' + result.error, 'error');
        }
    } catch (error) {
        showStatus('Error deleting file: ' + error.message, 'error');
    }
}

function showStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message ${type}`;
    
    setTimeout(() => {
        uploadStatus.className = 'status-message';
    }, 5000);
}
