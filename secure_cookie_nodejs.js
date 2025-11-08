/**
 * Secure Cookie Implementation for Node.js/Express
 * This module provides utilities for setting secure cookies with 3rd party protection
 */

// Security configuration
const SECURITY_CONFIG = {
  cookies: {
    secure: true,        // Only send over HTTPS
    httpOnly: true,      // Not accessible via JavaScript
    sameSite: 'strict',  // Block third-party cookie usage
    maxAge: 3600000,     // 1 hour (in milliseconds)
    path: '/',
  },
  headers: {
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 
      'geolocation=(), microphone=(), camera=(), ' +
      'payment=(), usb=(), magnetometer=(), ' +
      'gyroscope=(), accelerometer=()',
  }
};

/**
 * Express middleware to add security headers
 */
function securityHeadersMiddleware(req, res, next) {
  // Add all security headers
  Object.entries(SECURITY_CONFIG.headers).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
}

/**
 * Set a secure cookie with third-party protection
 * @param {Object} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional cookie options
 */
function setSecureCookie(res, name, value, options = {}) {
  const cookieOptions = {
    ...SECURITY_CONFIG.cookies,
    ...options
  };
  
  res.cookie(name, value, cookieOptions);
}

/**
 * Configure Express app with secure cookie settings
 * @param {Object} app - Express app instance
 * @param {Object} session - express-session module
 */
function configureExpressApp(app, session) {
  // Trust proxy (if behind reverse proxy like nginx)
  app.set('trust proxy', 1);
  
  // Add security headers middleware
  app.use(securityHeadersMiddleware);
  
  // Configure session with secure cookies
  app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-to-a-secure-random-string',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        // Only send over HTTPS
      httpOnly: true,      // Not accessible via JavaScript
      sameSite: 'strict',  // Block third-party cookie usage
      maxAge: 3600000,     // 1 hour
      path: '/',
    },
    name: 'sessionId',     // Custom session cookie name
  }));
  
  return app;
}

/**
 * Helmet.js configuration (recommended security middleware)
 * Install with: npm install helmet
 */
function getHelmetConfig() {
  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  };
}

// Example usage with Express
const exampleUsage = `
// Example Express app with secure cookies

const express = require('express');
const session = require('express-session');
const helmet = require('helmet'); // npm install helmet

const app = express();

// Method 1: Using helmet (recommended)
app.use(helmet(getHelmetConfig()));

// Configure session with secure cookies
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000,
  }
}));

// Method 2: Using custom middleware
// app.use(securityHeadersMiddleware);

// Set a custom secure cookie
app.get('/login', (req, res) => {
  // After authentication
  setSecureCookie(res, 'userId', 'user123', { maxAge: 86400000 });
  res.send('Logged in');
});

// HTTPS server (required for secure cookies)
const https = require('https');
const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
`;

// Export modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SECURITY_CONFIG,
    securityHeadersMiddleware,
    setSecureCookie,
    configureExpressApp,
    getHelmetConfig,
    exampleUsage,
  };
}
