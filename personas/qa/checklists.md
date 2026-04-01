# QA Quality Gates & Checklists

## Test Coverage Gates
- [ ] All public functions/methods have at least one test
- [ ] Happy path is tested
- [ ] At least 2 error/edge cases are tested per function
- [ ] Integration tests cover the main user workflows
- [ ] No test relies on execution order or shared mutable state

## Input Validation Checklist
- [ ] All user inputs are validated at the boundary (API layer)
- [ ] String inputs have max length enforced
- [ ] Numeric inputs have min/max range enforced
- [ ] Email/URL/phone formats are validated with appropriate parsers (not just regex)
- [ ] File uploads validate type, size, and content (not just extension)
- [ ] Query parameters are typed and validated (not raw strings)

## Error Handling Checklist
- [ ] All async operations have error handling (try/catch or .catch())
- [ ] Errors include enough context to debug (what operation, what input)
- [ ] User-facing errors are friendly; internal errors are detailed in logs
- [ ] Error responses use consistent format and status codes
- [ ] Timeouts are configured for all external calls (API, DB, file I/O)

## Release Readiness
- [ ] All automated tests pass
- [ ] No critical or high-severity open bugs
- [ ] Performance benchmarks are within acceptable thresholds
- [ ] Accessibility testing has been performed (if UI)
- [ ] Cross-browser/cross-device testing completed (if UI)
