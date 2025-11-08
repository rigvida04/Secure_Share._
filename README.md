# Secure_Share._
A Privacy-Preserving Keyword Search website made with encryption and cloud storage

## 🚀 Features

- **🔐 Secure Login System** - User authentication with session management
- **🍪 Third-Party Cookie Support** - Cookies configured with SameSite=None; Secure for cross-site compatibility
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🔒 End-to-End Encryption** - Files encrypted before leaving your device
- **🔍 Privacy-Preserving Search** - Search encrypted files without exposing content
- **☁️ Cloud Storage** - Securely store files in the cloud

## 📖 Getting Started

### Running Locally

1. Clone the repository
2. Start a local web server in the project directory:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`
4. Click "Login" to access the login page
5. Enter any credentials to test the login flow (demo mode)

### Pages

- **index.html** - Landing page with feature overview
- **login.html** - User login with third-party cookie support
- **register.html** - New user registration
- **dashboard.html** - User dashboard (protected, requires login)
- **forgot-password.html** - Password reset request

## 🍪 Third-Party Cookie Configuration

This application uses cookies with **SameSite=None; Secure** attributes to enable third-party cookie support for cross-site functionality.

### Cookies Used

- `session_token` - Authentication session (1 day expiry)
- `user_info` - User profile information
- `remembered_user` - "Remember Me" functionality (30 days expiry)
- `user_preferences` - User settings and preferences (7 days expiry)

### Requirements

- **HTTPS Required**: The `SameSite=None; Secure` configuration requires HTTPS in production environments
- Modern browser with cookie support enabled

## 📚 Documentation

See [LOGIN_IMPLEMENTATION.md](LOGIN_IMPLEMENTATION.md) for detailed documentation about the login system and cookie implementation.

## 🔒 Security

Please review our [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities.

## 📄 License

See [LICENSE](LICENSE) for license information.
