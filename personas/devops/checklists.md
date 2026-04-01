# DevOps Quality Gates & Checklists

## Pre-Deploy Checklist
- [ ] All CI pipeline stages pass
- [ ] No critical/high CVEs in dependency scan
- [ ] Database migrations tested and reversible
- [ ] Environment variables configured in target environment
- [ ] Health check endpoints respond correctly
- [ ] Rollback procedure tested
- [ ] On-call engineer is aware of the deployment

## Container Security Checklist
- [ ] Base image is from a trusted registry and pinned to a specific version
- [ ] Application runs as non-root user
- [ ] No secrets baked into the image
- [ ] Resource limits (CPU, memory) are set
- [ ] Read-only filesystem where possible
- [ ] Security scanning has been performed on the image

## Infrastructure Checklist
- [ ] All infrastructure changes are in version control
- [ ] Plan/preview before apply (terraform plan, pulumi preview)
- [ ] Backup strategy is configured and tested
- [ ] Auto-scaling policies are defined
- [ ] Network security groups / firewall rules are minimal
- [ ] Encryption at rest and in transit is enabled
- [ ] Monitoring and alerting are configured
