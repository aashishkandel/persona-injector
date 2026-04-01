# Architect Quality Gates & Checklists

## API Design Checklist
- [ ] RESTful resource naming is consistent and plural
- [ ] Versioning strategy is defined (URL path, header, or query param)
- [ ] Pagination is implemented for all list endpoints
- [ ] Rate limiting is configured
- [ ] Error responses follow a consistent format with error codes
- [ ] Authentication and authorization are enforced at the gateway
- [ ] Request/response schemas are documented (OpenAPI/Swagger)

## Database Design Checklist
- [ ] Primary keys are defined and appropriate (UUID vs auto-increment)
- [ ] Indexes exist for all frequently queried columns
- [ ] Foreign key constraints are in place
- [ ] Soft delete vs hard delete strategy is decided
- [ ] Migration strategy supports rollback
- [ ] Data retention and archival policy is defined
- [ ] Connection pooling is configured

## Scalability Review
- [ ] No single points of failure (SPOF) in the critical path
- [ ] Stateless services where possible
- [ ] Session state is externalized (Redis, DB)
- [ ] Background jobs use a proper queue (not in-process)
- [ ] File storage uses object storage (S3, GCS), not local disk
- [ ] Database queries are bounded (no `SELECT * FROM large_table` without LIMIT)

## Pre-Launch Architecture Review
- [ ] ADRs exist for all major decisions
- [ ] System diagram is up-to-date
- [ ] Disaster recovery plan exists
- [ ] Backup strategy is tested
- [ ] Load testing has been performed
- [ ] Security review has been completed
