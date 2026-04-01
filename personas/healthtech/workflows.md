# Healthtech Workflows

## HIPAA Compliance Flow
```
1. CLASSIFY   → Identify all data elements. Tag PHI vs non-PHI.
2. PROTECT    → Encrypt PHI at rest (AES-256) and in transit (TLS 1.2+).
3. CONTROL    → Role-based access. Minimum necessary principle.
4. AUDIT      → Log every PHI access: who, what, when, where, why.
5. CONSENT    → Verify patient consent before collection/sharing.
6. RETAIN     → Retention policy per regulation. Destroy when expired.
7. BREACH     → Incident response plan. 60-day notification requirement.
```

## Data Classification Matrix
| Data Type | Classification | Protection Level |
|-----------|---------------|-----------------|
| Patient name, DOB, SSN | PHI | Full encryption + access control + audit |
| Diagnosis, medications | PHI | Full encryption + access control + audit |
| Aggregated statistics | De-identified | Standard security |
| System logs (no PHI) | Internal | Standard security |
| Billing/insurance | PHI + Financial | Full encryption + PCI if card data |

## PHI Access Audit Requirements
Every PHI access event must record:
- **Who**: User ID, role, department
- **What**: Which patient record, which fields accessed
- **When**: Timestamp with timezone
- **Where**: IP address, device, application
- **Why**: Clinical justification or business reason
- **Action**: View, create, update, delete, export

## Third-Party Service Evaluation
Before using any external service with PHI:
1. Does the vendor offer a Business Associate Agreement (BAA)?
2. Where is data stored geographically?
3. Is data encrypted at rest and in transit?
4. What access does the vendor have to the data?
5. What happens to data if the contract ends?
