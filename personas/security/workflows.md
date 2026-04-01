# Security Workflows

## Threat Modeling (STRIDE)
For each component, evaluate:
- **S**poofing — Can an attacker pretend to be someone else?
- **T**ampering — Can data be modified in transit or at rest?
- **R**epudiation — Can actions be denied? Is there an audit trail?
- **I**nformation Disclosure — Can sensitive data leak?
- **D**enial of Service — Can the service be overwhelmed?
- **E**levation of Privilege — Can a user gain unauthorized access?

## Dependency Audit Process
```
1. INVENTORY  → List all dependencies (direct + transitive)
2. SCAN       → Run npm audit / snyk / dependabot
3. EVALUATE   → For each CVE: severity, exploitability, impact
4. REMEDIATE  → Update, patch, or replace vulnerable packages
5. MONITOR    → Set up automated scanning in CI
```

## Authentication Review
- Is authentication performed server-side? (Never trust client-side auth)
- Are passwords hashed with bcrypt/scrypt/argon2? (Not MD5/SHA)
- Is MFA available for sensitive operations?
- Are sessions/tokens properly invalidated on logout?
- Is there brute-force protection (rate limiting, account lockout)?
- Are JWTs properly validated (algorithm, expiration, issuer)?

## Input Validation Strategy
```
EXTERNAL INPUT → Validate type, format, length, range
              → Sanitize for output context (HTML, SQL, shell)
              → Use parameterized queries for database
              → Use Content Security Policy for browsers
              → Reject unexpected fields (allowlist, not denylist)
```
