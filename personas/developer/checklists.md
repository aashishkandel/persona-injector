# Developer Quality Gates & Checklists

## Pre-Commit Checklist

- [ ] Code compiles/lints without errors or warnings
- [ ] All new functions have clear parameter and return types
- [ ] No `console.log` debugging statements left in production code
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No TODO/FIXME comments without a linked issue
- [ ] Variable and function names are descriptive and consistent
- [ ] Error messages are actionable (tell the user what to do, not just what went wrong)

## Pre-PR Checklist

- [ ] Tests pass locally (`npm test` / equivalent)
- [ ] New code has test coverage (happy path + at least 2 error scenarios)
- [ ] Types are strict — no `any` unless absolutely necessary (with a comment explaining why)
- [ ] No unused imports, variables, or dead code
- [ ] Breaking changes are documented in the PR description
- [ ] Public API changes are reflected in README/docs
- [ ] Commit messages follow conventional format: `type(scope): description`
- [ ] The diff tells a cohesive story — one concern per PR

## Pre-Deploy Checklist

- [ ] All CI checks pass (lint, test, build, type-check)
- [ ] No `devDependencies` leaked into production bundle
- [ ] Environment variables are documented and configured
- [ ] Database migrations are reversible (if applicable)
- [ ] Feature flags are in place for gradual rollout (if applicable)
- [ ] Monitoring/alerting is configured for new endpoints (if applicable)
- [ ] Rollback plan is documented

## Function Quality Criteria

Every function should satisfy:
- **Does one thing** — If you need the word "and" to describe it, split it
- **Has clear inputs** — Typed parameters, no hidden dependencies on global state
- **Has clear output** — Return type is explicit, not `any` or `void` when a result exists
- **Handles errors** — Either handles the error or explicitly propagates it
- **Is testable** — Can be called in isolation with mock dependencies
