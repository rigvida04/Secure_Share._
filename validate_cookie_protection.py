#!/usr/bin/env python3
"""
Cookie Protection Validation Script
This script validates that third-party cookie protection is properly implemented
"""

import sys
import json
from typing import Dict, List, Tuple


class CookieProtectionValidator:
    """Validates cookie protection implementation"""
    
    REQUIRED_COOKIE_ATTRIBUTES = {
        'secure': True,
        'httpOnly': True,
        'sameSite': 'Strict',
    }
    
    REQUIRED_HEADERS = [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Strict-Transport-Security',
        'Referrer-Policy',
        'Permissions-Policy',
    ]
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed = []
    
    def validate_cookie_attributes(self, cookie_config: Dict) -> bool:
        """Validate cookie attributes configuration"""
        print("\n🔍 Validating Cookie Attributes...")
        
        for attr, expected_value in self.REQUIRED_COOKIE_ATTRIBUTES.items():
            if attr not in cookie_config:
                self.errors.append(f"Missing required cookie attribute: {attr}")
            elif cookie_config[attr] != expected_value:
                self.errors.append(
                    f"Cookie attribute '{attr}' should be {expected_value}, "
                    f"got {cookie_config[attr]}"
                )
            else:
                self.passed.append(f"✓ Cookie attribute '{attr}' is correct")
        
        # Check for SameSite=Strict specifically
        if cookie_config.get('sameSite') == 'Lax':
            self.warnings.append(
                "Cookie uses SameSite=Lax instead of Strict. "
                "This allows some cross-site requests."
            )
        
        return len(self.errors) == 0
    
    def validate_security_headers(self, headers: Dict) -> bool:
        """Validate security headers are present"""
        print("\n🔍 Validating Security Headers...")
        
        # Check for CSP
        if 'contentSecurityPolicy' in headers:
            csp = headers['contentSecurityPolicy']
            if csp.get('defaultSrc') == ["'self'"]:
                self.passed.append("✓ Content Security Policy restricts to same-origin")
            else:
                self.warnings.append("CSP default-src should be ['self']")
        else:
            self.errors.append("Missing Content Security Policy configuration")
        
        # Check for HSTS
        if 'strictTransportSecurity' in headers:
            hsts = headers['strictTransportSecurity']
            if hsts.get('maxAge', 0) >= 31536000:
                self.passed.append("✓ Strict-Transport-Security configured (1 year+)")
            else:
                self.warnings.append("HSTS maxAge should be at least 1 year")
        else:
            self.errors.append("Missing Strict-Transport-Security configuration")
        
        # Check for other security headers
        if headers.get('xContentTypeOptions') == 'nosniff':
            self.passed.append("✓ X-Content-Type-Options: nosniff")
        else:
            self.errors.append("Missing or incorrect X-Content-Type-Options")
        
        if headers.get('xFrameOptions') == 'DENY':
            self.passed.append("✓ X-Frame-Options: DENY")
        else:
            self.errors.append("Missing or incorrect X-Frame-Options")
        
        if headers.get('xXssProtection'):
            self.passed.append("✓ X-XSS-Protection configured")
        else:
            self.warnings.append("X-XSS-Protection not configured")
        
        if headers.get('referrerPolicy'):
            self.passed.append("✓ Referrer-Policy configured")
        else:
            self.warnings.append("Referrer-Policy not configured")
        
        if 'permissionsPolicy' in headers:
            self.passed.append("✓ Permissions-Policy configured")
        else:
            self.warnings.append("Permissions-Policy not configured")
        
        return len(self.errors) == 0
    
    def validate_third_party_blocking(self, config: Dict) -> bool:
        """Validate third-party blocking configuration"""
        print("\n🔍 Validating Third-Party Blocking...")
        
        # Check if third-party cookies are explicitly blocked
        if config.get('security', {}).get('cookies', {}).get('blockedThirdParty'):
            self.passed.append("✓ Third-party cookies explicitly blocked")
        else:
            self.warnings.append(
                "Third-party cookie blocking not explicitly configured"
            )
        
        # Check allowed domains
        allowed_domains = config.get('security', {}).get('cookies', {}).get('allowedDomains', [])
        if allowed_domains == ['self']:
            self.passed.append("✓ Only same-origin cookies allowed")
        else:
            self.errors.append(
                f"Allowed domains should be ['self'], got {allowed_domains}"
            )
        
        return len(self.errors) == 0
    
    def print_results(self):
        """Print validation results"""
        print("\n" + "=" * 60)
        print("VALIDATION RESULTS")
        print("=" * 60)
        
        if self.passed:
            print(f"\n✅ PASSED ({len(self.passed)} checks):")
            for msg in self.passed:
                print(f"  {msg}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for msg in self.warnings:
                print(f"  {msg}")
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for msg in self.errors:
                print(f"  {msg}")
        
        print("\n" + "=" * 60)
        
        if not self.errors:
            print("✅ All validations PASSED!")
            if self.warnings:
                print("⚠️  Some warnings present - review recommended")
            return True
        else:
            print("❌ Validation FAILED - fix errors above")
            return False


def load_config(config_path: str = 'cookie-protection-config.json') -> Dict:
    """Load cookie protection configuration"""
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Configuration file '{config_path}' not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{config_path}': {e}")
        sys.exit(1)


def main():
    """Main validation function"""
    print("=" * 60)
    print("Third-Party Cookie Protection Validator")
    print("=" * 60)
    
    # Load configuration
    config = load_config()
    
    # Create validator
    validator = CookieProtectionValidator()
    
    # Extract configurations
    cookie_config = config.get('security', {}).get('cookies', {}).get('defaultAttributes', {})
    headers = config.get('security', {}).get('headers', {})
    
    # Run validations
    validator.validate_cookie_attributes(cookie_config)
    validator.validate_security_headers(headers)
    validator.validate_third_party_blocking(config)
    
    # Print results
    success = validator.print_results()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
