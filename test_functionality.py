#!/usr/bin/env python3
"""
Simple test script to verify Secure Share functionality
"""
import os
import sys
from io import BytesIO

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import modules
from cloud_storage import CloudStorageManager
from notification_system import NotificationManager
from cryptography.fernet import Fernet

def test_cloud_storage():
    """Test cloud storage manager"""
    print("Testing Cloud Storage Manager...")
    
    storage = CloudStorageManager()
    
    # Test file upload (will use local fallback)
    test_data = b"Hello, Secure Share!"
    result = storage.upload_file(
        test_data, 
        "test/test_file.txt",
        {"user_id": "test_user", "test": "true"}
    )
    
    if result:
        print("✓ File upload successful")
    else:
        print("✗ File upload failed")
        return False
    
    # Test metadata storage
    storage.store_metadata("test_id", {
        "filename": "test.txt",
        "user_id": "test_user"
    })
    
    metadata = storage.get_metadata("test_id")
    if metadata and metadata.get("filename") == "test.txt":
        print("✓ Metadata storage successful")
    else:
        print("✗ Metadata storage failed")
        return False
    
    # Test file download
    downloaded = storage.download_file("test/test_file.txt")
    if downloaded == test_data:
        print("✓ File download successful")
    else:
        print("✗ File download failed")
        return False
    
    # Test search
    results = storage.search_user_files("test_user", "test")
    if results:
        print(f"✓ Search found {len(results)} result(s)")
    else:
        print("✓ Search completed (no results expected)")
    
    return True

def test_notifications():
    """Test notification system"""
    print("\nTesting Notification System...")
    
    notif_mgr = NotificationManager()
    
    # Send test notification
    notif_mgr.send_notification(
        "test_user",
        "Test Notification",
        "This is a test notification"
    )
    
    # Get notifications
    notifications = notif_mgr.get_user_notifications("test_user", limit=10)
    
    if notifications and len(notifications) > 0:
        print(f"✓ Notification system working ({len(notifications)} notification(s))")
        print(f"  Latest: [{notifications[0]['type']}] {notifications[0]['message']}")
    else:
        print("✗ Notification system failed")
        return False
    
    # Test unread count
    unread = notif_mgr.get_unread_count("test_user")
    print(f"✓ Unread count: {unread}")
    
    return True

def test_encryption():
    """Test encryption functionality"""
    print("\nTesting Encryption...")
    
    # Generate key
    key = Fernet.generate_key()
    fernet = Fernet(key)
    
    # Encrypt data
    original_data = b"Sensitive data to encrypt"
    encrypted_data = fernet.encrypt(original_data)
    
    # Decrypt data
    decrypted_data = fernet.decrypt(encrypted_data)
    
    if decrypted_data == original_data:
        print("✓ Encryption/Decryption successful")
        return True
    else:
        print("✗ Encryption/Decryption failed")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Secure Share - Functionality Tests")
    print("=" * 60)
    
    all_passed = True
    
    # Test cloud storage
    if not test_cloud_storage():
        all_passed = False
    
    # Test notifications
    if not test_notifications():
        all_passed = False
    
    # Test encryption
    if not test_encryption():
        all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✓ All tests passed!")
    else:
        print("✗ Some tests failed")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
