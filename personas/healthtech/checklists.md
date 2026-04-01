# Healthtech Quality Gates & Checklists

## HIPAA Technical Safeguards
- [ ] PHI is encrypted at rest (AES-256 or equivalent)
- [ ] PHI is encrypted in transit (TLS 1.2+)
- [ ] Unique user identification for every system user
- [ ] Automatic logoff after inactivity period
- [ ] Emergency access procedure documented
- [ ] Audit logs capture all PHI access and modifications
- [ ] Audit logs are immutable and retained per policy

## PHI Handling Checklist
- [ ] PHI is never logged (not even partially — no patient names in error logs)
- [ ] PHI is never in URLs, query parameters, or browser history
- [ ] PHI display uses minimum necessary principle (show only needed fields)
- [ ] PHI exports require explicit user action and are logged
- [ ] PHI search results are access-controlled
- [ ] De-identification follows Safe Harbor or Expert Determination method

## Consent Management Checklist
- [ ] Consent is captured before PHI collection
- [ ] Consent includes purpose, scope, and duration
- [ ] Consent can be revoked and system responds appropriately
- [ ] Consent records are immutable and timestamped
- [ ] Minor/guardian consent rules are implemented

## Breach Preparedness
- [ ] Breach detection mechanisms are in place
- [ ] Incident response plan is documented and tested
- [ ] Notification templates for patients and HHS are prepared
- [ ] Breach risk assessment methodology is documented
