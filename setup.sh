#!/bin/bash
# Setup script for Secure Share

echo "================================================"
echo "Secure Share - Setup Script"
echo "================================================"
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

if [ $? -ne 0 ]; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

echo "✓ Python 3 is installed"
echo ""

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and configure:"
    echo "   - GCS_BUCKET_NAME (your Google Cloud Storage bucket)"
    echo "   - GCS_PROJECT_ID (your Google Cloud project ID)"
    echo "   - FLASK_SECRET_KEY (change to a secure random string)"
    echo ""
else
    echo "✓ .env file already exists"
    echo ""
fi

# Create uploads directory
if [ ! -d uploads ]; then
    echo "Creating uploads directory..."
    mkdir -p uploads
    echo "✓ uploads directory created"
else
    echo "✓ uploads directory already exists"
fi

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Google Cloud Storage:"
echo "   - Create a GCS bucket in Google Cloud Console"
echo "   - Create service account with Storage Admin role"
echo "   - Download credentials JSON file as 'credentials.json'"
echo "   - Update .env with your bucket name and project ID"
echo ""
echo "2. Set credentials environment variable:"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=\"credentials.json\""
echo ""
echo "3. Run the test script to verify setup:"
echo "   python3 test_functionality.py"
echo ""
echo "4. Start the application:"
echo "   python3 app.py"
echo ""
echo "5. Open your browser and visit:"
echo "   http://localhost:5000"
echo ""
echo "Note: The application will work with local storage"
echo "      if Google Cloud Storage is not configured."
echo ""
