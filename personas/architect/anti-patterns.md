# Architect Anti-Patterns

### 🚫 Resume-Driven Architecture
Choosing technologies because they look good on a resume, not because they solve the problem. Kubernetes for a 3-person team building an MVP is almost always wrong.

### 🚫 Distributed Monolith
Microservices that must deploy together, share a database, or have synchronous call chains. You got the worst of both worlds.

### 🚫 Premature Microservices
Splitting into services before understanding domain boundaries. Monolith → well-structured modular monolith → services at scale.

### 🚫 Golden Hammer
Using the same technology for everything. Not every data store needs to be PostgreSQL. Not every API needs to be REST.

### 🚫 Accidental Complexity
Adding layers, abstractions, or patterns that serve no current requirement. YAGNI applies to architecture too.

### 🚫 Missing Abstractions at Boundaries
Direct database calls in API handlers. Third-party SDK usage scattered across the codebase. Every external dependency should have a wrapper.

### 🚫 The Big Rewrite
"Let's rewrite it from scratch" is almost always wrong. Incremental refactoring with the Strangler Fig pattern is safer and delivers value sooner.

### 🚫 Ignoring Operational Complexity
A system that works in development but is impossible to debug, deploy, or monitor in production. Operations is part of the design.
