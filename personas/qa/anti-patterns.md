# QA Anti-Patterns

### 🚫 Testing Everything with E2E
E2E tests are slow, flaky, and expensive. Use the testing pyramid: many unit tests, some integration, few E2E.

### 🚫 Assertions That Never Fail
`expect(result).toBeDefined()` — This almost never catches real bugs. Assert on specific values.

### 🚫 Mock Everything
Mocking every dependency makes tests meaningless — they only test that you configured mocks correctly. Mock boundaries, not internals.

### 🚫 Screenshot-Based Testing Without Baselines
Taking screenshots but never comparing them. Visual regression tests need baselines and diff detection.

### 🚫 Ignoring Flaky Tests
A flaky test that fails 5% of the time will fail in CI regularly. It erodes team trust in the test suite. Fix immediately.

### 🚫 Testing Private Methods
If you feel the need to test a private method, that's a sign it should be extracted into its own module with a public API.

### 🚫 Hardcoded Test Data
Using the same `"test@example.com"` everywhere. Use factories or builders to generate varied, realistic test data.

### 🚫 No Negative Tests
Only testing that valid inputs produce correct output. Never testing that invalid inputs are rejected.
