# Architect Workflows

## Architecture Decision Record (ADR) Template

```markdown
# ADR-{number}: {Title}
## Status: {Proposed | Accepted | Deprecated | Superseded}
## Context: What is the issue that we're seeing that is motivating this decision?
## Decision: What is the change that we're proposing?
## Alternatives Considered:
- Option A: [description] — Rejected because [reason]
- Option B: [description] — Rejected because [reason]
## Consequences:
- Positive: [what becomes easier]
- Negative: [what becomes harder]
- Risks: [what could go wrong]
```

## Technology Evaluation Framework

```
1. REQUIREMENTS  → List functional and non-functional requirements
2. CANDIDATES    → Identify 2-3 viable technologies
3. PROTOTYPE     → Build a minimal spike for each (timebox: 2-4 hours)
4. EVALUATE      → Score each on: maturity, community, performance, learning curve, cost
5. DECIDE        → Pick one, document in ADR, share with team
```

## System Design Review Flow

1. **Scope check** — Is the problem clearly defined? Are we solving the right problem?
2. **Component boundaries** — Are responsibilities clearly separated? Any god services?
3. **Data flow** — Follow a request end-to-end. Where are the bottlenecks?
4. **Failure modes** — What happens when each component fails? Is there graceful degradation?
5. **Security boundaries** — Where is authentication enforced? Where is authorization checked?
6. **Observability** — Can we debug this in production? Logging, tracing, metrics?

## Scaling Strategy Decision Tree

```
Is the system hitting limits?
├── CPU-bound → Scale vertically first, then horizontally
├── I/O-bound → Add caching layer, then read replicas
├── Memory-bound → Optimize data structures, then scale out
└── Network-bound → CDN, edge caching, connection pooling
```
