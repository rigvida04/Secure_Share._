"""
Secure Cookie Implementation for Python (Flask/Django)
This module provides utilities for setting secure cookies with 3rd party protection
"""

from datetime import datetime, timedelta
from typing import Optional


class SecureCookieConfig:
    """Configuration for secure cookies with third-party protection"""
    
    # Default security attributes
    SECURE = True  # Only send over HTTPS
    HTTPONLY = True  # Not accessible via JavaScript
    SAMESITE = 'Strict'  # Block third-party cookie usage
    MAX_AGE = 3600  # 1 hour default
    PATH = '/'
    
    # Security headers
    SECURITY_HEADERS = {
        'Content-Security-Policy': (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        ),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Permissions-Policy': (
            'geolocation=(), microphone=(), camera=(), '
            'payment=(), usb=(), magnetometer=(), '
            'gyroscope=(), accelerometer=()'
        ),
    }


# Flask Implementation
def set_secure_cookie_flask(response, key: str, value: str, 
                           max_age: Optional[int] = None):
    """
    Set a secure cookie in Flask with third-party protection
    
    Args:
        response: Flask response object
        key: Cookie name
        value: Cookie value
        max_age: Cookie expiration in seconds (default: 1 hour)
    """
    response.set_cookie(
        key,
        value,
        max_age=max_age or SecureCookieConfig.MAX_AGE,
        secure=SecureCookieConfig.SECURE,
        httponly=SecureCookieConfig.HTTPONLY,
        samesite=SecureCookieConfig.SAMESITE,
        path=SecureCookieConfig.PATH
    )
    return response


def add_security_headers_flask(response):
    """Add security headers to Flask response"""
    for header, value in SecureCookieConfig.SECURITY_HEADERS.items():
        response.headers[header] = value
    return response


# Flask app configuration example
def configure_flask_app(app):
    """Configure Flask app with secure cookie settings"""
    
    # Session cookie configuration
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Strict',
        SESSION_COOKIE_NAME='session',
        PERMANENT_SESSION_LIFETIME=timedelta(hours=1)
    )
    
    # Add security headers to all responses
    @app.after_request
    def apply_security_headers(response):
        return add_security_headers_flask(response)
    
    return app


# Django settings.py configuration
DJANGO_COOKIE_SETTINGS = """
# Django Cookie Security Settings
# Add these to your settings.py file

# Session cookie settings
SESSION_COOKIE_SECURE = True  # Only send over HTTPS
SESSION_COOKIE_HTTPONLY = True  # Not accessible via JavaScript
SESSION_COOKIE_SAMESITE = 'Strict'  # Block third-party usage
SESSION_COOKIE_AGE = 3600  # 1 hour

# CSRF cookie settings
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# Security middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Content Security Policy (requires django-csp)
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'", "'unsafe-eval'")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")
CSP_IMG_SRC = ("'self'", "data:", "https:")
CSP_FONT_SRC = ("'self'", "data:")
CSP_CONNECT_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)
CSP_BASE_URI = ("'self'",)
CSP_FORM_ACTION = ("'self'",)
"""


# Django middleware example
class SecurityHeadersMiddleware:
    """Django middleware to add security headers"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Add security headers
        for header, value in SecureCookieConfig.SECURITY_HEADERS.items():
            response[header] = value
        
        return response


if __name__ == '__main__':
    print("Secure Cookie Configuration")
    print("=" * 50)
    print("\nFlask Session Configuration:")
    print("- SESSION_COOKIE_SECURE = True")
    print("- SESSION_COOKIE_HTTPONLY = True")
    print("- SESSION_COOKIE_SAMESITE = 'Strict'")
    print("\nDjango Configuration:")
    print(DJANGO_COOKIE_SETTINGS)
