# persona-injector

> Inject domain-specific AI personas into your repo for GitHub Copilot, Claude Code & more.

**Zero-overhead, workflow-embedded context systems** with checklists, anti-patterns, decision trees, and file-scoped rules — so your AI assistant thinks like a Senior Developer, Architect, QA Engineer, Security Expert, or domain specialist.

```bash
npx persona-injector install developer architect security
```

---

## Why?

Generic AI coding assistants (Copilot, Cursor, Windsurf, Claude Code) lack domain-specific context. They write code that "works" but misses:
- **Code review criteria** specific to your team's standards
- **Security checklists** like OWASP Top 10 validation
- **Compliance requirements** like HIPAA or PCI-DSS
- **Performance budgets** for real-time or financial systems
- **Anti-patterns** that experienced engineers catch immediately

**persona-injector** solves this by installing deeply-structured persona files that your AI reads natively — no orchestrator, no custom commands, no overhead.

---

## Quick Start

```bash
# Install specific personas
npx persona-injector install developer architect qa

# Install all personas
npx persona-injector install --all

# See what's available
npx persona-injector list

# Preview a persona before installing
npx persona-injector info security

# Check what's installed
npx persona-injector status

# Remove a specific persona
npx persona-injector remove developer

# Remove all
npx persona-injector remove --all
```

---

## Available Personas

### Core Roles

| Persona | Description |
|---------|-------------|
| `developer` | Senior full-stack developer — SOLID, clean code, testing, performance |
| `architect` | System architect — scalability, design patterns, ADRs, trade-off analysis |
| `qa` | QA engineer — test strategies, edge case discovery, validation, reliability |
| `designer` | UI/UX-aware developer — accessibility (WCAG), responsive design, component APIs |
| `devops` | DevOps/SRE — CI/CD, infrastructure-as-code, monitoring, incident response |
| `security` | Security engineer — OWASP Top 10, auth, input validation, dependency auditing |

### Domain Verticals

| Persona | Description |
|---------|-------------|
| `fintech` | Financial technology — precision arithmetic, audit trails, PCI-DSS, AML/KYC |
| `healthtech` | Healthcare technology — HIPAA compliance, PHI protection, consent management |
| `gamedev` | Game development — ECS patterns, frame budgets, object pooling, asset pipelines |

---

## What Gets Installed

Each persona is more than a simple markdown file. It's a **structured context package** containing:

| Section | Purpose |
|---------|---------|
| **Persona** | Identity, core principles, decision framework, code review lens |
| **Workflows** | Decision trees, process flows, templates (e.g., ADR template, bug fix protocol) |
| **Checklists** | Quality gates for pre-commit, pre-PR, pre-deploy |
| **Anti-Patterns** | Common mistakes this persona specifically catches |

### Where Files Go

| Target | Location | Format |
|--------|----------|--------|
| **GitHub Copilot** | `.github/copilot-instructions.md` | Single file with marker-based sections |
| **Claude Code** | `.claude/rules/persona-*.md` | Individual rule files with `paths:` scoping |
| **Universal** | `AI_PERSONA.md` | Combined file for any AI tool |

---

## Multi-Persona Stacking

Install multiple personas and they're **simultaneously active** — your AI thinks from all perspectives at once:

```bash
npx persona-injector install developer security fintech
```

This makes the AI:
- Write clean, well-tested code (developer)
- Check for OWASP vulnerabilities (security)
- Use integer arithmetic for money and enforce audit trails (fintech)

### Composition Intelligence

The CLI automatically detects when personas have overlapping concerns and warns you:

```
ℹ Composition Note:
  developer + architect both define code review criteria —
  both perspectives will be active for comprehensive reviews.
```

---

## Claude Code File Scoping

For Claude Code, persona-injector uses native `paths:` frontmatter to **activate personas only for relevant files**:

```markdown
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
---
# Developer Persona
[...]
```

This means the developer persona activates when editing code files, but not when editing docs or config.

---

## Idempotent & Surgical

- **Idempotent installs** — Running `install` twice doesn't create duplicates
- **Surgical removal** — `remove developer` strips only the developer persona, leaving others intact
- **Marker-based** — Uses HTML comments (`<!-- PERSONA-INJECTOR:name:START -->`) to track sections
- **Non-destructive** — Existing content in target files is preserved



## Commands

### `install [personas...] [options]`

| Option | Description |
|--------|-------------|
| `-a, --all` | Install all available personas |
| `-f, --force` | Overwrite existing files instead of merging |
| `-t, --targets <targets>` | Comma-separated targets: `copilot,claude,universal` |
| `--dry-run` | Preview without writing files |

### `list [options]`

| Option | Description |
|--------|-------------|
| `-j, --json` | Output as JSON |
| `-v, --verbose` | Show tags and details |

### `remove [personas...] [options]`

| Option | Description |
|--------|-------------|
| `-a, --all` | Remove all installed personas |

### `info <persona>`

Preview a persona's full content before installing.

### `status`

Show currently installed personas and target files.

---

## Requirements

- **Node.js** 18+ (uses native `fetch` and ESM)
- **npm** 7+ (for `npx` support)

---

## License

MIT — [Aashish Kandel](https://github.com/aashishkandel)
