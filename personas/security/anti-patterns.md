# Security Anti-Patterns

### 🚫 Security by Obscurity
Relying on hidden URLs, obfuscated code, or non-standard ports for security. Assume attackers will discover everything.

### 🚫 Rolling Your Own Crypto
Implementing custom encryption, hashing, or token generation. Use established libraries (bcrypt, libsodium, JWT libraries).

### 🚫 Client-Side Security
Validating permissions in the browser/client only. All security checks must be enforced server-side.

### 🚫 Logging Sensitive Data
`logger.info("User login", { email, password })`. Passwords, tokens, PII, and financial data must never appear in logs.

### 🚫 Overly Permissive CORS
`Access-Control-Allow-Origin: *` on APIs that handle authenticated requests. Specify exact allowed origins.

### 🚫 SQL String Concatenation
`"SELECT * FROM users WHERE id = " + userId`. Always use parameterized queries or an ORM.

### 🚫 Trusting Content-Type
Accepting a file upload and trusting the Content-Type header or file extension. Validate file contents (magic bytes).

### 🚫 Hardcoded Credentials
`const API_KEY = "sk-live-abc123"` in source code. Use environment variables or secret managers.
