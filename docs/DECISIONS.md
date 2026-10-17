# NamPS OS — Architecture Decision Records (ADRs)

Detailed records of engineering choices, alternatives evaluated, trade-offs, and decisions are documented in [`.ai/DECISIONS.md`](../.ai/DECISIONS.md).

### Summary of Core Architectural Decisions
- **ADR-001 (Modular Monolith)**: Selected Next.js 15+ App Router for single-repo simplicity, fullstack TypeScript safety, and zero deployment friction.
- **ADR-002 (PostgreSQL + Drizzle ORM)**: Standard SQL schema, portable to any Linux server or free cloud database (Neon/Supabase) with zero vendor lock-in.
- **ADR-003 (Truly Anonymous Dual-Token Privacy)**: Cryptographic high-entropy tokens with SHA-256 verifier storage and timing-safe verification, mathematically eliminating student identities from database records.
- **ADR-004 (Fictional Data Segregation)**: Realistic Grades 5–11 fictional data for interactive demo exploration with safe state reset and zero production impact.
- **ADR-005 (Bilingual Built-In i18n)**: Native React Context dictionary layer for Uzbek (Latin script, primary) and English with zero external API dependencies.
