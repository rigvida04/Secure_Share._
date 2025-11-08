# Cookie Policy for Secure_Share

## Overview
This document outlines the cookie policy for Secure_Share, a privacy-preserving keyword search website. We are committed to protecting user privacy and have implemented strict 3rd party cookie protection measures.

## Cookie Usage

### First-Party Cookies Only
Secure_Share uses **only first-party cookies** necessary for the functioning of the website. We do **NOT** use or allow third-party cookies.

### Types of Cookies We Use

1. **Session Cookies**
   - Purpose: Maintain user session and authentication state
   - Duration: Deleted when browser is closed
   - Security: Secure, HttpOnly, SameSite=Strict

2. **Preference Cookies**
   - Purpose: Remember user preferences and settings
   - Duration: 1 year
   - Security: Secure, HttpOnly, SameSite=Strict

3. **Security Cookies**
   - Purpose: Protect against CSRF and other security threats
   - Duration: Session-based
   - Security: Secure, HttpOnly, SameSite=Strict

## Third-Party Cookie Protection

### Technical Measures
We have implemented the following technical measures to block third-party cookies:

1. **SameSite Cookie Attribute**
   - All cookies use `SameSite=Strict` to prevent cross-site request inclusion
   - This ensures cookies are never sent to third-party domains

2. **Content Security Policy (CSP)**
   - Strict CSP headers that only allow resources from our own domain
   - Blocks embedded third-party content that could set cookies

3. **Secure Cookie Attributes**
   - `Secure`: Cookies only transmitted over HTTPS
   - `HttpOnly`: Cookies inaccessible to JavaScript (prevents XSS-based theft)
   - `Path=/`: Cookies scoped to the entire application
   - Explicit expiration times to prevent indefinite storage

4. **Permissions Policy**
   - Restricts third-party iframes from accessing browser features
   - Prevents embedded content from requesting permissions

### Browser Recommendations
For enhanced privacy protection, we recommend users:
- Enable "Block third-party cookies" in browser settings
- Use privacy-focused browser extensions
- Regularly clear cookies and browsing data
- Enable "Do Not Track" in browser settings

## Cookie Management

### User Control
Users can:
- View active cookies through browser developer tools
- Delete cookies at any time through browser settings
- Use private/incognito browsing mode to prevent cookie persistence

### No Tracking
- We do not use cookies for tracking across websites
- We do not share cookie data with third parties
- We do not use advertising cookies
- We do not use analytics cookies from third-party services

## Compliance

This cookie policy is designed to comply with:
- **GDPR** (General Data Protection Regulation)
- **ePrivacy Directive** (Cookie Law)
- **CCPA** (California Consumer Privacy Act)
- Modern web security best practices

## Implementation Details

### Cookie Configuration Example
```javascript
// Example of secure cookie implementation
document.cookie = "sessionId=value; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600";
```

### Server-Side Configuration
All cookies must be set with the following attributes:
- `Secure` flag enabled (requires HTTPS)
- `HttpOnly` flag enabled
- `SameSite=Strict` attribute
- Appropriate expiration time
- Domain limited to our domain only

## Data Protection

### Encryption
- All cookie data is transmitted over encrypted HTTPS connections
- Sensitive data in cookies is encrypted at rest
- Session tokens use cryptographically secure random generation

### Storage
- Cookies are stored securely in the browser's cookie storage
- No sensitive personal information is stored in cookies
- Session data is stored server-side with only session ID in cookie

## Updates to This Policy

This cookie policy may be updated to reflect:
- Changes in legal requirements
- Improvements to security measures
- New features or functionality
- User feedback and privacy concerns

Last updated: 2025-11-08

## Contact

For questions about our cookie policy or privacy practices, please refer to our SECURITY.md file for reporting security concerns.
