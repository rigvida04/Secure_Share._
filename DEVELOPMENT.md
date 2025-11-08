# Development Guide

## Running the Application Locally

### Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run without SSL (development)
python app.py

# Access at http://localhost:5000
```

### Running with SSL (Recommended)
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365 \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Run with SSL
python app.py

# Access at https://localhost:5000
```

## Testing

### Run Test Suite
```bash
python test_app.py
```

### Manual Testing
```bash
# Start server
python app.py

# In another terminal:
# Test health check
curl http://localhost:5000/health

# Upload a file
curl -X POST -F "file=@test.txt" http://localhost:5000/upload --cookie-jar cookies.txt

# List files
curl http://localhost:5000/files --cookie cookies.txt

# Download file (use file_id from upload response)
curl http://localhost:5000/download/<file_id> --cookie cookies.txt -O
```

## Code Structure

```
Secure_Share._/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html         # Frontend UI
├── test_app.py           # Test suite
├── requirements.txt      # Python dependencies
├── README.md             # Documentation
├── SECURITY_SUMMARY.md   # Security analysis
└── .gitignore           # Git ignore rules
```

## Key Functions

### Encryption
- `generate_encryption_key()`: Creates session-specific encryption keys
- `encrypt_file()`: Encrypts files using Fernet
- `decrypt_file()`: Decrypts files for download

### Routes
- `/`: Main page
- `/upload`: File upload endpoint
- `/download/<id>`: File download endpoint
- `/files`: List user's files
- `/health`: Health check

## Environment Variables

```bash
export SECRET_KEY="your-secret-key-here"
```

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn

# Without SSL (use reverse proxy for SSL)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# With SSL
gunicorn -w 4 --certfile=cert.pem --keyfile=key.pem -b 0.0.0.0:5000 app:app
```

### Using Docker (Future Enhancement)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `python test_app.py`
5. Submit a pull request

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### SSL Certificate Errors
- Use a proper certificate from a trusted CA for production
- For development, you can ignore self-signed certificate warnings

### Upload Fails
- Check MAX_CONTENT_LENGTH setting (default 50MB)
- Ensure uploads/ directory is writable
- Verify sufficient disk space
