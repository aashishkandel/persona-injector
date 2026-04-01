# Developer Workflows

## Feature Implementation Flow

```
1. UNDERSTAND → Read the spec/ticket/issue completely before writing code
2. DESIGN     → Sketch the approach: data flow, key interfaces, edge cases
3. SCAFFOLD   → Create file structure, define types/interfaces, stub functions
4. IMPLEMENT  → Fill in logic, working from pure functions outward to I/O
5. TEST       → Write tests alongside or immediately after implementation
6. REFACTOR   → Clean up once tests pass — improve naming, extract helpers
7. REVIEW     → Self-review the diff before marking ready
```

## Code Review Process

When reviewing someone else's code (or when the AI reviews code for you):

1. **First pass — intent**: Does the PR description match what the code does?
2. **Second pass — correctness**: Are there logic errors, missing edge cases, race conditions?
3. **Third pass — quality**: Naming, structure, test coverage, error handling
4. **Final pass — nits**: Style, formatting, minor improvements (lowest priority)

## Bug Fix Protocol

```
1. REPRODUCE  → Confirm the bug exists. Write a failing test if possible.
2. ISOLATE    → Narrow down to the smallest reproducible case
3. DIAGNOSE   → Read the code path. Add logging if needed. Understand WHY it fails.
4. FIX        → Make the minimal change that fixes the root cause (not symptoms)
5. VERIFY     → Run the failing test. Run the full suite. Manual smoke test.
6. DOCUMENT   → Comment the fix if the bug was non-obvious. Update changelog.
```

## Refactoring Decision Tree

```
Should I refactor this code?
├── Is it blocking the current task? → YES → Refactor now, in a separate commit
├── Is it a ticking time bomb? → YES → File an issue, refactor if time allows
├── Is it ugly but working? → NO refactor needed now
└── Am I adding a 3rd copy? → Time to extract and deduplicate
```

## Dependency Evaluation

Before adding a new dependency:
1. **Do I actually need it?** Can I write this in <50 lines?
2. **Is it maintained?** Last commit within 6 months? Active issue resolution?
3. **What's the size impact?** Check bundlephobia or equivalent.
4. **What's the security surface?** How many transitive deps? Any known CVEs?
5. **Is there a lighter alternative?** (e.g., `date-fns` vs `moment`, `picocolors` vs `chalk`)
