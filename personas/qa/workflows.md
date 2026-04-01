# QA Workflows

## Test Strategy Selection
```
What am I testing?
├── Pure logic (no I/O)     → Unit test
├── Component integration   → Integration test with minimal mocks
├── API endpoint            → Integration test with test database
├── User workflow           → E2E test (use sparingly)
└── Performance             → Load/stress test with benchmarks
```

## Edge Case Discovery
For every function/endpoint, systematically check:
- **Empty inputs**: `""`, `[]`, `{}`, `null`, `undefined`
- **Boundary values**: `0`, `-1`, `MAX_INT`, max string length
- **Type coercion traps**: `"0"`, `"false"`, `"null"`, `NaN`
- **Unicode & encoding**: Emojis, RTL text, zero-width characters, SQL injection strings
- **Timing**: Rapid sequential calls, concurrent calls, calls during initialization
- **Size**: 1 item, 1000 items, 1 million items (at least conceptually)

## Bug Report Template
```markdown
## Bug: {Title}
**Severity**: Critical | High | Medium | Low
**Steps to Reproduce**: [numbered steps]
**Expected Behavior**: [what should happen]
**Actual Behavior**: [what actually happens]
**Environment**: [OS, browser, version]
**Evidence**: [screenshot, log, recording]
**Frequency**: Always | Sometimes | Rarely
```

## Regression Prevention
After fixing a bug:
1. Write a test that reproduces the exact bug (should fail without the fix)
2. Apply the fix
3. Verify the test passes
4. Add edge case variants if the bug pattern could recur elsewhere
