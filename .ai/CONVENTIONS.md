# NamPS OS — Coding Standards & Engineering Conventions

## 1. Directory Structure
```
c:\dev\Projects\dss\
├── .ai/                    # Persistent Project Memory
├── docs/                   # Architecture, Security, Migration Guides
├── public/                 # Static assets, branding, icons
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, route handlers)
│   │   ├── (auth)/         # Sign-in, sign-out, demo selector
│   │   ├── (dashboard)/    # Role-protected dashboard routes
│   │   │   ├── director/
│   │   │   ├── manager/
│   │   │   ├── teacher/
│   │   │   ├── student/
│   │   │   └── parent/
│   │   ├── anonymous/      # Suggestion submission and status lookup
│   │   └── api/            # API endpoints & server handlers
│   ├── components/         # Reusable UI & design system components
│   │   ├── ui/             # Core primitives (Button, Modal, Input, Badge, Table)
│   │   ├── layout/         # Header, Sidebar, RoleSwitcher, LanguageToggle
│   │   └── modules/        # Domain-specific components (GradesTable, TimetableGrid)
│   ├── db/                 # Database schema, migrations, connection client, seeders
│   │   ├── schema/         # Drizzle schema definitions
│   │   └── seed/           # Fictional demonstration dataset (Grades 5-11)
│   ├── lib/                # Utilities, auth, crypto, validation, timezone helpers
│   ├── i18n/               # Uzbek and English localization dictionaries
│   └── types/              # Global TypeScript interfaces
├── Dockerfile              # Multi-stage production container
├── docker-compose.yml      # Local and self-hosted orchestration
└── tests/                  # Automated unit, integration, and security test suites
```

## 2. Naming Conventions
- **Files & Folders**: `kebab-case` for general files (e.g., `date-utils.ts`, `role-switcher.tsx`); Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`).
- **React Components**: `PascalCase` (e.g., `TimetableGrid`, `AssignmentSubmissionForm`).
- **Database Tables & Columns**: `snake_case` (e.g., `timetable_slots`, `due_date`, `student_id`).
- **TypeScript Types & Interfaces**: `PascalCase` (e.g., `UserRecord`, `AnonymousSuggestion`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEZONE = 'Asia/Tashkent'`).

## 3. TypeScript & Code Quality
- Strict TypeScript (`"strict": true`, no implicit `any`).
- Server actions and API routes must validate incoming payloads using schemas (e.g., Zod).
- Error handling: Always return structured error responses `{ success: false, error: string }` rather than leaking internal stack traces.

## 4. UI & Design System Principles
- **No Clichés**: Restrained, elegant, professional educational design. Deep graphite/navy `#0f172a`, subtle surfaces `#f8fafc` / `#1e293b`, restrained cyan/blue accent `#0284c7`, semantic colors for alerts.
- **Accessibility**: Semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<button>`). Explicit ARIA attributes and focus rings (`focus-visible:ring-2`).
- **Theme Support**: Seamless light/dark mode toggling via Tailwind CSS `dark:` variant and CSS variables.

## 5. Testing & Security Patterns
- Never trust client-supplied user IDs or roles. Always extract user identity from the verified session.
- Anonymity tests: Explicitly assert that no user ID or IP is passed or stored in anonymous suggestion routines.
- Unit and integration tests must run via `pnpm test` (Vitest/Jest).
