const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store file metadata (in production, this would be in a database)
let fileMetadata = [];

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const metadata = {
        id: Date.now().toString(),
        filename: req.file.filename,
        originalName: req.body.originalName || req.file.originalname,
        encryptedKeywords: req.body.keywords || '',
        uploadDate: new Date().toISOString(),
        size: req.file.size
    };

    fileMetadata.push(metadata);
    res.json({ success: true, fileId: metadata.id, metadata });
});

app.get('/api/files', (req, res) => {
    res.json(fileMetadata);
});

app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

app.delete('/api/files/:id', (req, res) => {
    const fileId = req.params.id;
    const fileIndex = fileMetadata.findIndex(f => f.id === fileId);
    
    if (fileIndex !== -1) {
        const file = fileMetadata[fileIndex];
        const filepath = path.join(uploadsDir, file.filename);
        
        // Delete the file
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        
        // Remove from metadata
        fileMetadata.splice(fileIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Share server running on http://localhost:${PORT}`);
});
