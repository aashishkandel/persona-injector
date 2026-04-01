# DevOps Workflows

## CI/CD Pipeline Review
```
1. LINT & FORMAT  → Catch style issues before review
2. TYPE CHECK     → Catch type errors at compile time
3. UNIT TESTS     → Fast feedback on logic correctness
4. BUILD          → Verify the artifact can be produced
5. INTEGRATION    → Test against real dependencies (DB, APIs)
6. SECURITY SCAN  → Dependency vulnerabilities, secret scanning
7. DEPLOY STAGING → Deploy to staging automatically on main
8. SMOKE TESTS    → Verify staging is healthy
9. DEPLOY PROD    → Manual approval or automated canary
10. HEALTH CHECK  → Post-deploy verification
```

## Incident Response Flow
```
1. DETECT   → Alert fires or user reports issue
2. TRIAGE   → Severity assessment (P0-P3), assign owner
3. MITIGATE → Restore service first (rollback, scale, redirect)
4. DIAGNOSE → Root cause analysis after mitigation
5. FIX      → Implement and deploy permanent fix
6. REVIEW   → Blameless post-mortem within 48 hours
7. PREVENT  → Update monitoring, add tests, improve runbooks
```

## Container Optimization
- Use multi-stage builds to minimize image size
- Pin base image versions (not `:latest`)
- Run as non-root user
- Use `.dockerignore` to exclude unnecessary files
- Set proper health checks
- Configure resource limits and requests

## Monitoring Setup
For every service, ensure:
- **RED metrics**: Rate, Errors, Duration for each endpoint
- **USE metrics**: Utilization, Saturation, Errors for each resource
- **Business metrics**: Key transactions, conversion rates, user journeys
- **Alerting**: Symptom-based (user impact), not cause-based (CPU high)
