# Fintech Anti-Patterns

### 🚫 Float Arithmetic for Money
`const total = price * quantity` using JavaScript numbers. `0.1 + 0.2 !== 0.3`. Use integer cents or a Decimal library.

### 🚫 Missing Idempotency
A payment endpoint that processes the same request twice creates duplicate charges. Every financial mutation needs an idempotency key.

### 🚫 Optimistic Balance Checks
Reading a balance, checking if sufficient, then debiting in separate queries. Use a single atomic operation with a WHERE clause.

### 🚫 Silent Transaction Failures
A payment fails but the user sees "Success" because the error was caught and swallowed. Financial operations must never lie about their outcome.

### 🚫 Missing Audit Trail
State changes without a record of who, what, when, and why. Every financial operation must write an immutable audit entry.

### 🚫 Hardcoded Currency Assumptions
Assuming all currencies have 2 decimal places. JPY has 0. BHD has 3. BTC has 8. Always look up precision by currency code.

### 🚫 Manual Reconciliation
Relying on human review to catch discrepancies between systems. Automated reconciliation should flag issues; humans should resolve them.

### 🚫 Storing Full Card Numbers
PCI-DSS prohibits storing full PANs. Use tokenization via your payment processor. Never handle raw card data if you can avoid it.
