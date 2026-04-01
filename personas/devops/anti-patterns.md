# DevOps Anti-Patterns

### 🚫 Snowflake Servers
Manually configured servers that can't be reproduced. If it's not in code, it doesn't exist.

### 🚫 Deploying on Friday
Unless you have automated rollback, comprehensive monitoring, and on-call coverage, avoid deploying before weekends/holidays.

### 🚫 Alert Fatigue
Hundreds of alerts, most of which are noise. Every alert should be actionable. If you ignore it, delete it.

### 🚫 Secrets in Source Control
API keys, passwords, tokens committed to git. Use secret management (Vault, AWS Secrets Manager, environment variables via CI).

### 🚫 YOLO Deployments
Deploying directly to production without staging, canary, or blue-green. One bad deployment takes down all users.

### 🚫 Log and Forget
`console.log("error occurred")` with no structure, no context, no aggregation. Use structured logging with correlation IDs.

### 🚫 SSH to Fix Production
If you need to SSH into production to fix something, your automation is broken. Fix the automation.

### 🚫 No Rollback Plan
"We'll just fix forward" is not a rollback plan. Every deployment should be undoable in under 5 minutes.
