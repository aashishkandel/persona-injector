# Security Quality Gates & Checklists

## OWASP Top 10 Checklist
- [ ] A01: Broken Access Control — Authorization checked on every request
- [ ] A02: Cryptographic Failures — Sensitive data encrypted at rest and in transit
- [ ] A03: Injection — All queries parameterized, all output escaped
- [ ] A04: Insecure Design — Threat model exists, security requirements defined
- [ ] A05: Security Misconfiguration — Default credentials changed, unnecessary features disabled
- [ ] A06: Vulnerable Components — Dependencies scanned, no critical CVEs
- [ ] A07: Authentication Failures — Strong password policy, MFA available, session management secure
- [ ] A08: Data Integrity Failures — Updates verified, CI/CD pipeline secured
- [ ] A09: Logging Failures — Security events logged, logs don't contain sensitive data
- [ ] A10: SSRF — User-supplied URLs validated, internal network access restricted

## API Security Checklist
- [ ] Authentication required for all non-public endpoints
- [ ] Authorization checked at the resource level (not just route level)
- [ ] Rate limiting configured per user/IP
- [ ] Input validation on all parameters (type, length, format)
- [ ] Response does not leak internal implementation details
- [ ] CORS configured with specific origins (not `*`)
- [ ] HTTPS enforced (HSTS header set)
- [ ] Security headers set (CSP, X-Frame-Options, X-Content-Type-Options)

## Secret Management Checklist
- [ ] No secrets in source code, config files, or environment files
- [ ] Secrets stored in a dedicated secret manager
- [ ] Secrets rotated on a regular schedule
- [ ] Access to secrets is logged and auditable
- [ ] CI/CD secrets are scoped to the minimum needed
