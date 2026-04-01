# Healthtech Anti-Patterns

### 🚫 PHI in Logs
`logger.error("Failed to process patient", { name: patient.name, ssn: patient.ssn })`. Use patient ID references only. Never log PHI.

### 🚫 Broad Data Fetching
`SELECT * FROM patients WHERE doctor_id = ?` when you only need the appointment time. Fetch only the fields needed for the current operation.

### 🚫 Missing Access Audit
Displaying patient records without logging who viewed them. Every PHI access must create an audit entry — even read access.

### 🚫 Shared Service Accounts
Multiple staff using the same login credentials. HIPAA requires unique user identification for accountability.

### 🚫 Consent as Boolean
`consented: true/false` without capturing what was consented to, when, or for how long. Consent is a rich document, not a checkbox.

### 🚫 PHI in Error Messages
"Patient John Smith (DOB: 01/15/1980) not found" displayed to support staff or in error reports. Use record IDs only.

### 🚫 Non-BAA Third-Party Services
Sending PHI to a cloud service without a Business Associate Agreement. This is a HIPAA violation.

### 🚫 Irreversible De-identification
Using a method that can be reversed to re-identify patients. True de-identification must remove 18 HIPAA identifiers or use expert determination.
