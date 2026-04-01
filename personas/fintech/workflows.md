# Fintech Workflows

## Transaction Processing Flow
```
1. VALIDATE   → Input validation, authorization, fraud check
2. IDEMPOTENCY → Check if this request has been processed before
3. RESERVE    → Place a hold/lock on the funds (don't debit yet)
4. EXECUTE    → Perform the transaction within a DB transaction
5. RECORD     → Write audit log entry with full context
6. NOTIFY     → Send confirmation to all parties
7. RECONCILE  → Verify internal records match external systems
```

## Compliance Review Process
1. **Data classification** — Identify PII, financial data, cardholder data
2. **Access control audit** — Who can access what? Is it least-privilege?
3. **Encryption review** — Data at rest and in transit. Key management.
4. **Audit trail review** — Are all state changes logged? Is the trail immutable?
5. **Retention policy check** — Data retention meets regulatory requirements
6. **Incident response readiness** — Breach notification procedures documented

## Currency Handling Standards
- Store amounts as integers in the smallest unit (cents for USD, satoshi for BTC)
- Store currency code alongside every amount (ISO 4217)
- Use a currency library for formatting (not manual string concatenation)
- Handle rounding rules per currency/jurisdiction
- Support multi-currency if expansion is foreseeable

## Reconciliation Design
- Run reconciliation on a regular schedule (hourly for real-time, daily for batch)
- Compare internal ledger with external sources (bank, payment processor)
- Flag discrepancies for manual review
- Maintain a discrepancy resolution log
- Never auto-correct without human approval
