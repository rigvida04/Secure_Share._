#!/usr/bin/env python3
"""
Test script for Secure Share application
Tests encryption, file handling, and security features
"""

import os
import sys
import tempfile
import secrets
from io import BytesIO

# Add the parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, generate_encryption_key, encrypt_file, decrypt_file, calculate_file_hash


def test_encryption_key_generation():
    """Test that encryption keys are unique per session and file"""
    print("Testing encryption key generation...")
    
    session_id1 = "session1"
    session_id2 = "session2"
    file_id = "file1"
    
    key1 = generate_encryption_key(session_id1, file_id)
    key2 = generate_encryption_key(session_id1, file_id)
    key3 = generate_encryption_key(session_id2, file_id)
    
    # Same session and file should produce same key
    assert key1 == key2, "Keys should be identical for same session and file"
    
    # Different session should produce different key
    assert key1 != key3, "Keys should differ for different sessions"
    
    print("✓ Encryption key generation works correctly")


def test_file_encryption_decryption():
    """Test file encryption and decryption"""
    print("\nTesting file encryption and decryption...")
    
    # Create a temporary test file
    test_data = b"This is a test file with sensitive data that should be encrypted!"
    
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(test_data)
        temp_file_path = temp_file.name
    
    try:
        # Generate encryption key
        session_id = secrets.token_hex(16)
        file_id = secrets.token_hex(16)
        key = generate_encryption_key(session_id, file_id)
        
        # Encrypt the file
        encrypted_path = encrypt_file(temp_file_path, key)
        
        # Verify original file is deleted
        assert not os.path.exists(temp_file_path), "Original file should be deleted after encryption"
        assert os.path.exists(encrypted_path), "Encrypted file should exist"
        
        # Read encrypted file to verify it's different from original
        with open(encrypted_path, 'rb') as f:
            encrypted_data = f.read()
        assert encrypted_data != test_data, "Encrypted data should differ from original"
        
        # Decrypt the file
        decrypted_data = decrypt_file(encrypted_path, key)
        
        # Verify decrypted data matches original
        assert decrypted_data == test_data, "Decrypted data should match original"
        
        print("✓ File encryption and decryption works correctly")
        
        # Clean up
        os.remove(encrypted_path)
        
    except Exception as e:
        # Clean up on error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise e


def test_file_hash_integrity():
    """Test file hash calculation for integrity verification"""
    print("\nTesting file hash integrity...")
    
    test_data1 = b"Test data for hashing"
    test_data2 = b"Test data for hashing"
    test_data3 = b"Different test data"
    
    hash1 = calculate_file_hash(test_data1)
    hash2 = calculate_file_hash(test_data2)
    hash3 = calculate_file_hash(test_data3)
    
    # Same data should produce same hash
    assert hash1 == hash2, "Same data should produce identical hashes"
    
    # Different data should produce different hash
    assert hash1 != hash3, "Different data should produce different hashes"
    
    # Hash should be 64 characters (SHA-256 hex)
    assert len(hash1) == 64, "SHA-256 hash should be 64 characters"
    
    print("✓ File hash integrity verification works correctly")


def test_flask_app_config():
    """Test Flask application configuration"""
    print("\nTesting Flask application configuration...")
    
    # Test app is configured
    assert app.secret_key is not None, "Secret key should be set"
    assert app.config['MAX_CONTENT_LENGTH'] == 50 * 1024 * 1024, "Max file size should be 50MB"
    assert app.config['UPLOAD_FOLDER'] == 'uploads', "Upload folder should be 'uploads'"
    
    print("✓ Flask application configuration is correct")


def test_routes_exist():
    """Test that all required routes are defined"""
    print("\nTesting route definitions...")
    
    with app.test_client() as client:
        # Test index route
        response = client.get('/')
        assert response.status_code == 200, "Index route should return 200"
        
        # Test health check
        response = client.get('/health')
        assert response.status_code == 200, "Health check should return 200"
        data = response.get_json()
        assert data['status'] == 'healthy', "Health check should return healthy status"
        assert data['encryption'] == 'enabled', "Encryption should be enabled"
        
        # Test files list endpoint
        response = client.get('/files')
        assert response.status_code == 200, "Files endpoint should return 200"
        
    print("✓ All required routes are defined and accessible")


def test_session_isolation():
    """Test that encryption keys differ between sessions"""
    print("\nTesting session isolation...")
    
    file_id = "test_file"
    session1 = secrets.token_hex(16)
    session2 = secrets.token_hex(16)
    
    key1 = generate_encryption_key(session1, file_id)
    key2 = generate_encryption_key(session2, file_id)
    
    assert key1 != key2, "Different sessions should produce different encryption keys"
    
    print("✓ Session isolation works correctly")


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("Running Secure Share Test Suite")
    print("=" * 60)
    
    try:
        test_encryption_key_generation()
        test_file_encryption_decryption()
        test_file_hash_integrity()
        test_flask_app_config()
        test_routes_exist()
        test_session_isolation()
        
        print("\n" + "=" * 60)
        print("✓ ALL TESTS PASSED!")
        print("=" * 60)
        return 0
        
    except AssertionError as e:
        print(f"\n✗ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(run_all_tests())
