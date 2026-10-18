# NamPS OS — Change Requests & Refactor Log

## CR-001: Initial Platform Genesis
- **Date**: 2026-10-17
- **Requested By**: Master Engineering Prompt
- **Description**: Greenfield initialization of NamPS OS digital school platform for Namangan Presidential School.
- **Scope**: Full specification, architecture, all 23 core modules, truly anonymous suggestion subsystem, interactive demo mode, zero-cost cloud deployment, and self-hosted school server portability package.
- **Impact Assessment**: Comprehensive system setup. Must adhere to strict $0 spend and WCAG 2.2 AA standards.
- **Status**: Completed through PR #1 (Milestones M1–M5 merged).

## CR-002: Vercel Cloud Deployment & Serverless Alignment
- **Date**: 2026-10-18
- **Requested By**: User
- **Description**: Pull latest codebase from GitHub, review full architecture and test results, and formulate an end-to-end plan for deployment on Vercel.
- **Scope**: Codebase review across M1–M5, serverless compatibility audit (Postgres connection pooling, font asset tracing in serverless functions, upload storage strategy, build/migration scripts).
- **Impact Assessment**: Requires external serverless PostgreSQL (Neon / Supabase), Next.js asset tracing for PDF rendering, and build-time migration execution. Zero breaking changes to existing self-hosted Docker workflows.
- **Status**: Plan formulated, awaiting User Approval (Phase 5 Approval Gate).

