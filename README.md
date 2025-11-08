# Secure Share 🔒

A Privacy-Preserving File Sharing website with encryption and Google Cloud Storage integration.

## Features

✨ **Secure File Sharing**: Upload and share files with end-to-end encryption  
☁️ **Google Cloud Storage**: Files are stored securely in Google Cloud Storage  
📊 **Data History**: Complete history of all file uploads stored in the cloud  
🔔 **User Notifications**: Real-time notifications for all user activities  
🔍 **Keyword Search**: Privacy-preserving search across your uploaded files  
🔐 **Encryption**: All files are encrypted before uploading to cloud storage  

## Technology Stack

- **Backend**: Flask (Python)
- **Cloud Storage**: Google Cloud Storage
- **Encryption**: Fernet (symmetric encryption)
- **Frontend**: HTML, CSS, JavaScript
- **Notifications**: Built-in notification system

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Google Cloud Platform account (for cloud storage)
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rigvida04/Secure_Share._.git
   cd Secure_Share._
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Google Cloud Storage**

   a. Create a Google Cloud Project:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   
   b. Enable Cloud Storage API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Storage API" and enable it
   
   c. Create a Storage Bucket:
   - Go to "Cloud Storage" > "Buckets"
   - Click "Create Bucket"
   - Choose a unique bucket name and appropriate settings
   
   d. Create Service Account credentials:
   - Go to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Grant "Storage Admin" role
   - Create and download JSON key file
   - Save it as `credentials.json` in the project root

4. **Configure Environment Variables**

   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your values:
   ```
   GCS_BUCKET_NAME=your-bucket-name
   GCS_PROJECT_ID=your-project-id
   FLASK_SECRET_KEY=your-secret-key-change-this
   FLASK_ENV=development
   ENABLE_NOTIFICATIONS=true
   UPLOAD_FOLDER=uploads
   ```

5. **Set Google Cloud credentials path**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="credentials.json"
   ```

### Running the Application

1. **Start the Flask server**
   ```bash
   python app.py
   ```

2. **Access the application**
   - Open your browser and navigate to: `http://localhost:5000`

## Usage

### Upload Files

1. Click on the upload area or drag and drop files
2. Files are automatically encrypted and uploaded to Google Cloud Storage
3. You'll receive a notification confirming the upload

### View History

- The File History section shows all your uploaded files from cloud storage
- Each file entry displays the filename and upload timestamp
- Click "Download" to retrieve and decrypt files

### Search Files

- Use the search box to find files by keyword
- Search works across all your uploaded file names
- Results are displayed instantly

### Notifications

- The Notifications panel shows all your recent activities:
  - Website access
  - File uploads
  - File downloads
  - Search operations
  - History access

## Features in Detail

### Google Cloud Storage Integration

All files are stored in Google Cloud Storage with the following benefits:
- **Scalability**: Handle unlimited file storage
- **Reliability**: 99.999999999% durability
- **Security**: Files are encrypted before upload
- **History**: Complete audit trail of all uploads

### Notification System

Users receive notifications for:
- **Website Access**: Every time you visit the site
- **File Upload**: When files are successfully uploaded
- **File Download**: When files are downloaded
- **Search Activity**: When you search for files
- **History Access**: When you view your file history

### Security

- **Encryption**: All files are encrypted using Fernet (symmetric encryption)
- **Secure Keys**: Encryption keys are generated per file
- **Session Management**: User sessions are securely managed
- **Secure Filename**: Filenames are sanitized to prevent security issues

## Local Storage Fallback

If Google Cloud Storage is not configured, the application automatically falls back to local storage:
- Files are stored in the `uploads/` directory
- All features continue to work normally
- Notifications and history are maintained locally

## File Size Limits

- Maximum file size: 16MB
- Supported file types: txt, pdf, png, jpg, jpeg, gif, doc, docx, zip

## Development

### Project Structure

```
Secure_Share._/
├── app.py                      # Main Flask application
├── cloud_storage.py            # Google Cloud Storage manager
├── notification_system.py      # Notification system
├── templates/
│   └── index.html             # Frontend UI
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

### Environment Variables

- `GCS_BUCKET_NAME`: Your Google Cloud Storage bucket name
- `GCS_PROJECT_ID`: Your Google Cloud project ID
- `FLASK_SECRET_KEY`: Secret key for Flask sessions
- `FLASK_ENV`: Environment (development/production)
- `ENABLE_NOTIFICATIONS`: Enable/disable notifications
- `UPLOAD_FOLDER`: Local storage folder path
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to GCS credentials file

## Troubleshooting

### Google Cloud Storage not working

- Verify your `credentials.json` file is in the correct location
- Check that `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set
- Ensure the service account has "Storage Admin" role
- Verify the bucket name in `.env` matches your actual bucket

### Files not uploading

- Check file size (must be under 16MB)
- Verify file type is in the allowed list
- Check browser console for JavaScript errors

### Notifications not appearing

- Ensure `ENABLE_NOTIFICATIONS=true` in `.env`
- Check that the uploads folder is writable

## Security Considerations

⚠️ **Important Security Notes**:

1. **Never commit credentials**: The `.gitignore` file prevents credential files from being committed
2. **Change secret keys**: Always use unique, strong secret keys in production
3. **HTTPS in production**: Always use HTTPS in production environments
4. **Access Control**: Implement proper user authentication for production use
5. **Key Management**: Consider using Google Cloud KMS for encryption key management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the [LICENSE](LICENSE) file for details.
