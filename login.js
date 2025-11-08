// Cookie utility functions with SameSite=None and Secure attributes for 3rd party cookie support

/**
 * Set a cookie with 3rd party cookie support
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    
    // Enable 3rd party cookies with SameSite=None and Secure attributes
    // Note: SameSite=None requires Secure flag (HTTPS)
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=None; Secure";
    
    console.log(`Cookie set: ${name} with 3rd party support (SameSite=None; Secure)`);
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure';
    console.log(`Cookie deleted: ${name}`);
}

/**
 * Check if cookies are enabled
 * @returns {boolean} True if cookies are enabled
 */
function checkCookiesEnabled() {
    setCookie('test_cookie', 'test', 1);
    const enabled = getCookie('test_cookie') === 'test';
    deleteCookie('test_cookie');
    return enabled;
}

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const googleLoginBtn = document.getElementById('googleLogin');
    const githubLoginBtn = document.getElementById('githubLogin');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Check if cookies are enabled
    if (!checkCookiesEnabled()) {
        showMessage('error', 'Cookies are disabled in your browser. Please enable cookies to use this site.');
        return;
    }
    
    // Check for existing session
    const existingSession = getCookie('session_token');
    if (existingSession) {
        console.log('Existing session found:', existingSession);
    }
    
    // Load remembered username if exists
    const rememberedUser = getCookie('remembered_user');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        rememberMeCheckbox.checked = true;
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = rememberMeCheckbox.checked;
            
            // Basic validation
            if (!username || !password) {
                showMessage('error', 'Please enter both username and password.');
                return;
            }
            
            // Simulate login process (in production, this would be an API call)
            loginUser(username, password, rememberMe);
        });
    }
    
    // Google login handler
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            showMessage('error', 'Google login integration is not yet implemented. This would redirect to Google OAuth.');
            // In production: window.location.href = '/auth/google';
        });
    }
    
    // GitHub login handler
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', function() {
            showMessage('error', 'GitHub login integration is not yet implemented. This would redirect to GitHub OAuth.');
            // In production: window.location.href = '/auth/github';
        });
    }
});

/**
 * Simulate user login
 * @param {string} username - Username or email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember the user
 */
function loginUser(username, password, rememberMe) {
    const loginMessage = document.getElementById('loginMessage');
    
    // Show loading state
    showMessage('success', 'Logging in...');
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real application, this would be an API call to authenticate
        // For demonstration, we'll accept any non-empty credentials
        
        if (username && password) {
            // Generate a mock session token
            const sessionToken = generateSessionToken();
            
            // Set session cookie with 3rd party support (expires in 1 day)
            setCookie('session_token', sessionToken, 1);
            
            // Set user info cookie
            setCookie('user_info', JSON.stringify({ username: username }), 1);
            
            // Handle "Remember Me" functionality
            if (rememberMe) {
                setCookie('remembered_user', username, 30); // Remember for 30 days
                console.log('User will be remembered for 30 days');
            } else {
                deleteCookie('remembered_user');
            }
            
            // Set additional cookies for demonstration of 3rd party cookie support
            setCookie('user_preferences', JSON.stringify({ theme: 'light', lang: 'en' }), 7);
            
            showMessage('success', `Login successful! Welcome, ${username}. Redirecting to dashboard...`);
            
            // Log cookie information
            console.log('Session established with 3rd party cookie support enabled');
            console.log('Cookies set:', document.cookie);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showMessage('error', 'Invalid credentials. Please try again.');
        }
    }, 1000);
}

/**
 * Generate a random session token
 * @returns {string} Session token
 */
function generateSessionToken() {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Display a message to the user
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} text - Message text
 */
function showMessage(type, text) {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
        loginMessage.className = 'message ' + type;
        loginMessage.textContent = text;
    }
}

// Log that 3rd party cookies are configured
console.log('Login page loaded with 3rd party cookie support enabled (SameSite=None; Secure)');
console.log('Note: SameSite=None requires HTTPS in production environments');
