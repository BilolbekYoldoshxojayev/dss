# NamPS OS — Architecture & Engineering Design

## 1. Architectural Style
NamPS OS is structured as a **Modular Monolith** built on **Next.js 15+ (App Router)**, **TypeScript**, and **PostgreSQL 16**.
- **Unified Codebase**: Frontend, API endpoints, server actions, and persistence layer are co-located in a single repository for simplified maintenance, $0 cost hosting, and fast execution.
- **Portability**: Standard SQL data layer managed via Drizzle ORM schemas, compatible with both local/self-hosted Docker PostgreSQL 16 and free-tier cloud PostgreSQL (Neon, Supabase).
- **Security Boundaries**: Server-enforced Role-Based Access Control (RBAC). Client role contexts are purely representational.

## 2. Layered Structure
- **Presentation Layer (`src/components/`, `src/app/`)**: Responsive UI components built with Tailwind CSS, Lucide icons, and WCAG 2.2 AA compliant markup.
- **Internationalization (`src/i18n/`)**: Fully localized dictionaries for Uzbek (Latin script, primary) and English with Asia/Tashkent timezone handling.
- **Authentication & Security (`src/lib/`)**: JWT session management, bcrypt password hashing, cryptographic token generation with SHA-256 verifiers.
- **Domain Modules (`src/components/modules/`)**: Self-contained operational features (Timetable, Assignments, Attendance, Workload, Anonymous Suggestions, etc.).
- **Data Access Layer (`src/db/`)**: Type-safe schemas (`schema.ts`), seed dataset (`seed/fictional-data.ts`), and repository client (`index.ts`).
