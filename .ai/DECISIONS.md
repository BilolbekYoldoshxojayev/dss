# NamPS OS — Architectural Decision Records (ADRs)

## ADR-001: Technology Stack Selection
- **Status**: Accepted
- **Context**: Need a modern, robust, $0 cost, highly portable stack that supports responsive UI, fast SSR, API endpoints, server actions, and relational data persistence.
- **Options Considered**:
  1. Next.js 15 App Router + TypeScript + Tailwind CSS
  2. Vite + React SPA + Express.js backend
  3. Python Django / FastAPI + React SPA
- **Decision**: Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Rationale**: Next.js provides a unified fullstack monolith in a single repository. It runs natively in standard Node.js Docker containers and deploys seamlessly on free hosting platforms (Vercel, Render, Koyeb) without multi-service coordination overhead.

## ADR-002: Relational Database & ORM
- **Status**: Accepted
- **Context**: The application manages highly relational educational data (courses, timetables, submissions, grades, attendance). It must be 100% portable between free cloud Postgres (Neon/Supabase) and self-hosted PostgreSQL 16 via Docker Compose.
- **Options Considered**:
  1. Drizzle ORM + PostgreSQL
  2. Prisma ORM + PostgreSQL
  3. Raw SQL + pg-node
- **Decision**: Drizzle ORM with PostgreSQL.
- **Rationale**: Drizzle ORM produces standard SQL schema migrations, has zero runtime overhead, avoids Prisma's heavy engine binary issues in edge/serverless environments, and provides end-to-end type safety directly mapped to SQL tables.

## ADR-003: Truly Anonymous Student Suggestion Architecture
- **Status**: Accepted
- **Context**: Students must be able to submit school improvement suggestions without fear of identification. The school leadership (Director/Manager) must be able to review and respond to them without knowing the author.
- **Options Considered**:
  1. Authenticated submission with a boolean "is_anonymous" flag masking the user ID in the UI.
  2. Tor-like public onion service.
  3. Completely unauthenticated submission flow generating a dual receipt credential (Public Receipt Code + Cryptographic Secret Token) with zero user foreign key or IP logging.
- **Decision**: Option 3 (Dual Receipt Credential with Zero Identity Linkage).
- **Rationale**: Option 1 is pseudo-anonymity and vulnerable to database inspection or accidental leaks. Option 2 introduces external operational complexity. Option 3 mathematically eliminates the author's identity from the database while allowing the submitter to retrieve status and responses using their private secret token.

## ADR-004: Interactive Demo Mode & Data Segregation
- **Status**: Accepted
- **Context**: The public deployment must provide a rich interactive demo with fictional grades 5-11 data across all roles, with role switching and safe reset capabilities, without compromising production data safety.
- **Options Considered**:
  1. Mock in-memory state for all demo visitors.
  2. Database-backed fictional seed data with session/cookie-based role switching and an authorized demo reset API.
- **Decision**: Option 2.
- **Rationale**: Real database persistence is a non-negotiable requirement ("no fake toast messages"). A well-structured seed script with consistent fictional accounts and a safe reset endpoint provides genuine database operations.

## ADR-005: Internationalization (i18n) Strategy
- **Status**: Accepted
- **Context**: The platform must support Uzbek (Latin script) as the primary language and English as an alternate interface language across all pages, forms, errors, and navigation.
- **Options Considered**:
  1. External third-party i18n SaaS API.
  2. Lightweight built-in React Context dictionary system with type-safe key validation.
- **Decision**: Option 2.
- **Rationale**: Zero external network dependency, $0 cost, instant switching, and guaranteed complete translations across all user interfaces.
