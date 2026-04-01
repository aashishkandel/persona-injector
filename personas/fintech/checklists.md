# Fintech Quality Gates & Checklists

## Payment Endpoint Checklist
- [ ] Idempotency key is required and validated
- [ ] Amount is validated (positive, within limits, correct precision)
- [ ] Currency code is validated (ISO 4217)
- [ ] Authorization is verified before processing
- [ ] Transaction is atomic (all-or-nothing via DB transaction)
- [ ] Audit log entry is written for every state change
- [ ] Response does not leak internal account details
- [ ] Rate limiting is configured per user/account

## PCI-DSS Compliance (if handling card data)
- [ ] Card numbers are never stored in plain text
- [ ] Card data is never logged (not even masked)
- [ ] TLS 1.2 or higher for all card data transmission
- [ ] Access to card data systems is restricted and logged
- [ ] Regular vulnerability scans are performed

## Financial Calculation Review
- [ ] No floating-point arithmetic for monetary values
- [ ] All calculations use integer arithmetic or Decimal library
- [ ] Rounding rules are explicit and documented
- [ ] Currency-specific precision is respected
- [ ] Division operations handle remainders (penny allocation problem)
