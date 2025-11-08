# Third-Party Cookie Protection Implementation Guide

This guide provides step-by-step instructions for implementing third-party cookie protection in Secure_Share.

## Overview

Third-party cookies are cookies set by domains other than the one you are visiting. They are commonly used for tracking, advertising, and analytics. This implementation blocks all third-party cookies to protect user privacy.

## Quick Start

### 1. Choose Your Server Platform

Select the appropriate configuration file for your web server:

- **Nginx**: Use `nginx-cookie-protection.conf`
- **Apache**: Use `.htaccess`
- **Node.js/Express**: Use `secure_cookie_nodejs.js`
- **Python/Flask/Django**: Use `secure_cookie_python.py`

### 2. Server Configuration

#### Nginx

Add to your nginx configuration:

```nginx
# Include in your server block
include /path/to/nginx-cookie-protection.conf;
```

Or manually add the headers from `security-headers.conf`.

#### Apache

Copy `.htaccess` to your web root directory:

```bash
cp .htaccess /var/www/html/.htaccess
```

Ensure `mod_headers` and `mod_rewrite` are enabled:

```bash
sudo a2enmod headers
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 3. Application-Level Implementation

#### Node.js/Express

```javascript
const express = require('express');
const session = require('express-session');
const { configureExpressApp, securityHeadersMiddleware } = require('./secure_cookie_nodejs');

const app = express();

// Add security headers
app.use(securityHeadersMiddleware);

// Configure session with secure cookies
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000
  }
}));

// Your routes here...

// Start HTTPS server (required)
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

https.createServer(options, app).listen(443);
```

#### Python/Flask

```python
from flask import Flask
from secure_cookie_python import configure_flask_app

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# Configure secure cookies
app = configure_flask_app(app)

# Your routes here...

if __name__ == '__main__':
    # Run with HTTPS (required for secure cookies)
    app.run(ssl_context='adhoc')
```

#### Python/Django

Add to your `settings.py`:

```python
# Session cookie settings
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = 3600

# CSRF cookie settings
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# Security middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'path.to.SecurityHeadersMiddleware',  # Add custom middleware
    # ... other middleware
]
```

## Testing Cookie Protection

### 1. Verify Security Headers

Use curl to check headers:

```bash
curl -I https://yourdomain.com
```

Expected headers:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`
- `Permissions-Policy`

### 2. Test Cookie Attributes

In browser developer tools (F12):
1. Go to Application/Storage tab
2. Check Cookies section
3. Verify each cookie has:
   - ✅ Secure flag
   - ✅ HttpOnly flag
   - ✅ SameSite = Strict

### 3. Third-Party Cookie Test

1. Open browser developer tools
2. Navigate to your site
3. Check Network tab
4. Verify no cookies are sent to third-party domains
5. Use browser privacy tools to confirm third-party cookies are blocked

### 4. Security Scanner

Use online security scanners:
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## Browser Compatibility

| Browser | SameSite Support | Secure Cookie Support |
|---------|-----------------|---------------------|
| Chrome 80+ | ✅ Full | ✅ Full |
| Firefox 69+ | ✅ Full | ✅ Full |
| Safari 13+ | ✅ Full | ✅ Full |
| Edge 80+ | ✅ Full | ✅ Full |

## Requirements

### HTTPS is Required

Secure cookies with the `Secure` flag require HTTPS. To enable HTTPS:

1. **Development**: Use self-signed certificates
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

2. **Production**: Use Let's Encrypt
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Environment Variables

Set required environment variables:

```bash
# Session secret (change this!)
export SESSION_SECRET="your-cryptographically-random-secret-key"

# Force HTTPS
export FORCE_HTTPS=true
```

## Configuration Reference

### Cookie Attributes Explained

- **Secure**: Cookie only sent over HTTPS
- **HttpOnly**: Cookie not accessible via JavaScript (prevents XSS)
- **SameSite=Strict**: Cookie never sent in cross-site requests (blocks third-party usage)
- **SameSite=Lax**: Cookie sent in top-level navigation (some cross-site allowed)
- **SameSite=None**: Cookie sent in all contexts (requires Secure flag)

### Recommended Settings

For maximum privacy (third-party cookie blocking):
```
Secure=true
HttpOnly=true
SameSite=Strict
```

For sites needing OAuth/single sign-on:
```
Secure=true
HttpOnly=true
SameSite=Lax
```

## Troubleshooting

### Issue: Cookies not being set

**Solution**: Ensure you're using HTTPS. Secure cookies won't work over HTTP.

### Issue: Third-party authentication not working

**Solution**: If using OAuth or external authentication, you may need `SameSite=Lax` instead of `Strict` for authentication cookies only.

### Issue: Safari not accepting cookies

**Solution**: Ensure your domain has a valid SSL certificate. Safari is strict about certificate validation.

### Issue: Security headers not appearing

**Solution**: 
- Check if headers module is enabled (nginx: `ngx_http_headers_module`, Apache: `mod_headers`)
- Verify configuration file is included/loaded
- Check server error logs

## Compliance

This implementation helps comply with:

- **GDPR** (General Data Protection Regulation)
- **ePrivacy Directive** (Cookie Law)
- **CCPA** (California Consumer Privacy Act)
- **OWASP** Security Best Practices

## Additional Resources

- [MDN Web Docs - SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Content Security Policy Reference](https://content-security-policy.com/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Cookie Policy documentation
3. Refer to SECURITY.md for reporting vulnerabilities

## License

See LICENSE file in the repository root.
