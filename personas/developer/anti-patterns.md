# Developer Anti-Patterns

## Code Smells to Catch

### 🚫 God Functions
Functions longer than 40 lines or with more than 3 levels of nesting. Split into smaller, focused helpers.

### 🚫 Stringly Typed Code
Using strings where enums, unions, or typed constants should be used. `status: string` → `status: 'active' | 'inactive' | 'pending'`.

### 🚫 Boolean Trap
Functions with multiple boolean parameters: `createUser(true, false, true)`. Use an options object instead.

### 🚫 Shotgun Surgery
A single change requires edits in 5+ files. Sign of poor encapsulation — consider consolidating related logic.

### 🚫 Silent Failures
`catch (e) {}` or `catch (e) { return null }` without logging or context. Every caught error should be intentional.

### 🚫 Premature Abstraction
Creating interfaces, base classes, or factories for something that has exactly one implementation. Wait for the second use case.

### 🚫 Copy-Paste Inheritance
Duplicating a function and changing 2 lines. Extract the common logic and parameterize the differences.

### 🚫 Magic Numbers/Strings
`if (retries > 3)` → `if (retries > MAX_RETRIES)`. Named constants make intent clear.

### 🚫 Callback Hell / Promise Chains
Deeply nested `.then().then().catch()` chains. Use `async/await` with proper try/catch.

### 🚫 Leaky Abstractions
Database query syntax in a controller. HTTP status codes in a service layer. Each layer should speak its own language.

## Testing Anti-Patterns

### 🚫 Testing Implementation Details
Tests that break when you refactor internals without changing behavior. Test *what*, not *how*.

### 🚫 The "Ice Cream Cone"
More E2E tests than unit tests. The testing pyramid should be wide at the bottom (unit), narrower in the middle (integration), thin at the top (E2E).

### 🚫 Tests That Never Fail
Tests with no assertions, or assertions that are always true. If a test can't fail, it provides no value.

### 🚫 Shared Mutable State Between Tests
Tests that depend on execution order or modify shared state. Each test should set up and tear down its own world.

### 🚫 Testing Framework Code
Writing tests for library functions, framework behavior, or language features. Test YOUR code.
