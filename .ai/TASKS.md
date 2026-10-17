# NamPS OS — Master Task Graph & Implementation Plan

## Milestone 1: Project Foundation & Core Shell
- [ ] **TASK-101**: Initialize Next.js 15+ TypeScript application with Tailwind CSS, Lucide icons, and bilingual dictionary infrastructure (`src/i18n/`).
  - *Agent*: `architect` / `frontend`
  - *Verification*: `pnpm build` succeeds, landing page renders with language toggle (Uzbek/English) and theme switcher (Light/Dark).
- [ ] **TASK-102**: Configure Drizzle ORM schema for PostgreSQL, connection client with connection pooling, and migration runner.
  - *Agent*: `backend`
  - *Verification*: Migrations compile cleanly and generate SQL schemas.
- [ ] **TASK-103**: Implement Auth & Session layer (JWT/cookies, bcrypt password hashing, role verification middleware).
  - *Agent*: `backend` / `security`
  - *Verification*: Protected routes redirect unauthenticated users; role check denies invalid access.
- [ ] **TASK-104**: Design App Shell (responsive collapsible sidebar, header with role switcher, user profile, notifications drawer).
  - *Agent*: `frontend`
  - *Verification*: Shell renders cleanly on mobile and desktop without overflow.

## Milestone 2: Academic Workflows & Classroom Modules
- [ ] **TASK-201**: Implement Timetable & Scheduling system (`Asia/Tashkent` timezone, conflict detection, daily/weekly views).
  - *Agent*: `frontend` / `backend`
  - *Verification*: Student sees personal schedule; teacher sees teaching periods; double booking triggers conflict warning.
- [ ] **TASK-202**: Implement Class & Subject Management (Grades 5-11, sections, courses, teacher assignments, student rosters).
  - *Agent*: `backend` / `frontend`
  - *Verification*: Roster views accurately display enrolled students per class section.
- [ ] **TASK-203**: Implement Assignments, Submissions & Rubric-based Grading Queue.
  - *Agent*: `frontend` / `backend`
  - *Verification*: Teacher can publish assignment; student submits link/text; teacher grades and enters feedback; student views published grade.
- [ ] **TASK-204**: Implement Workload Coordination Calendar & Overload Detection.
  - *Agent*: `frontend` / `backend`
  - *Verification*: Aggregates estimated homework times; flags conflicting deadlines for a student cohort.
- [ ] **TASK-205**: Implement Attendance Tracking (Present, Absent, Late, Excused) linked to timetable sessions.
  - *Agent*: `frontend` / `backend`
  - *Verification*: Teacher marks attendance; records persist to DB; student/parent view displays summary.
- [ ] **TASK-206**: Implement School Rules & Knowledge Base with versioning and full-text search.
  - *Agent*: `frontend` / `backend`
  - *Verification*: Documents render properly, search filters by category and keyword.

## Milestone 3: Leadership, Administration & Anonymous Suggestions
- [ ] **TASK-301**: Implement **Truly Anonymous Student Suggestion Subsystem**.
  - *Agent*: `security` / `backend` / `frontend`
  - *Sub-tasks*:
    - Unauthenticated submission API (`/api/suggestions/submit`) with zero identity fields or user cookies.
    - Public receipt code + cryptographic secret token generator with SHA-256 verifier storage.
    - Secret-protected status check page (`/anonymous/status`).
    - Director and Manager review interface (status updates: `Received`, `Under Review`, `Approved`, `Denied`, `In Progress`, `Implemented`, `Closed` + official response field).
  - *Verification*: Automated privacy tests prove no user ID or IP is logged/stored; status verification works with secret token and rejects incorrect token.
- [ ] **TASK-302**: Implement Director Dashboard (executive oversight, academic summaries, policy approval, anonymous suggestion disposition, leadership action items).
  - *Agent*: `frontend` / `backend`
  - *Verification*: Director view renders high-level summaries without leaking student identities.
- [ ] **TASK-303**: Implement Manager Dashboard (user provisioning, class/subject configuration, bulk CSV import/export).
  - *Agent*: `frontend` / `backend`
  - *Verification*: CSV import previews rows, validates schemas, and inserts records transactionally.
- [ ] **TASK-304**: Implement School Announcements & Notification System (audience filters: all, staff, class, students).
  - *Agent*: `frontend` / `backend`
  - *Verification*: Announcements filter by target audience and priority.

## Milestone 4: Guardian Portal & Extracurricular Services
- [ ] **TASK-401**: Implement Parent / Guardian Portal with verified guardian-student relationship checks.
  - *Agent*: `frontend` / `backend`
  - *Verification*: Guardian only accesses data for linked child; unrelated students return 403 Forbidden.
- [ ] **TASK-402**: Implement Events, Clubs & Extracurriculars (registrations, capacity limits, waitlists).
  - *Agent*: `frontend`
  - *Verification*: Registration respects capacity limits and allows join/leave actions.
- [ ] **TASK-403**: Implement Student Projects, Mentorship & Showcase.
  - *Agent*: `frontend`
  - *Verification*: Project proposals track milestones and public showcase display.
- [ ] **TASK-404**: Implement Library Catalog & Facilities/IT Support Ticketing (smartboard repair reports).
  - *Agent*: `frontend` / `backend`
  - *Verification*: Students report maintenance issue; ticket updates status; library tracks book loans.

## Milestone 5: Interactive Demo, Fictional Data (Grades 5-11) & Reset
- [ ] **TASK-501**: Build comprehensive fictional seed dataset (Grades 5-11, realistic Uzbek names, subjects, timetables, assignments, grades, events).
  - *Agent*: `backend`
  - *Verification*: Database populates smoothly with zero missing foreign key relations.
- [ ] **TASK-502**: Implement Interactive Demo Bar & Quick Role Switcher (Director, Manager, Teacher, Student, Parent).
  - *Agent*: `frontend`
  - *Verification*: Instant 1-click role switching with visible `DEMO` badge.
- [ ] **TASK-503**: Implement Safe Demo Reset mechanism.
  - *Agent*: `backend`
  - *Verification*: Re-seeds fictional database state safely.

## Milestone 6: Automated Testing & Hardening
- [ ] **TASK-601**: Automated Unit & Integration Tests (RBAC, Anonymity security, Timetable conflicts, Gradebook calculations, CSV validation).
  - *Agent*: `tester`
  - *Verification*: 100% passing test suite.
- [ ] **TASK-602**: End-to-End Workflow Verification (Student submit assignment -> Teacher grades; Anonymous submit -> Director reviews -> Student checks status).
  - *Agent*: `tester` / `debugger`
  - *Verification*: Automated E2E verification completes successfully.
- [ ] **TASK-603**: Accessibility (WCAG 2.2 AA) & Responsive Testing (Mobile 375px, Tablet 768px, Desktop 1440px).
  - *Agent*: `frontend` / `tester`
  - *Verification*: No layout overflow, full keyboard navigation, screen reader labels.

## Milestone 7: Free-Tier Deployment ($0 Spend)
- [ ] **TASK-701**: Configure production build, environment variables, and zero-cost cloud deployment (Vercel + Neon Postgres / Supabase Free Tier).
  - *Agent*: `architect` / `backend`
  - *Verification*: Public URL live, SSL active, seed data populated, test workflows verified on public URL.

## Milestone 8: School Server Portability & Handover
- [ ] **TASK-801**: Create multi-stage `Dockerfile`, `docker-compose.yml`, backup/restore scripts (`scripts/backup.sh`, `scripts/restore.sh`).
  - *Agent*: `architect`
  - *Verification*: Clean docker compose build and standalone execution.
- [ ] **TASK-802**: Author comprehensive documentation:
  - `README.md`
  - `docs/PRODUCT_SPEC.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATA_MODEL.md`
  - `docs/PERMISSIONS.md`
  - `docs/ANONYMITY_AND_PRIVACY.md`
  - `docs/SECURITY.md`
  - `docs/DESIGN_SYSTEM.md`
  - `docs/IMPLEMENTATION_PLAN.md`
  - `docs/DECISIONS.md`
  - `docs/DEPLOYMENT.md`
  - `docs/SCHOOL_SERVER_MIGRATION.md`
  - `docs/PILOT_GUIDE.md`
  - *Agent*: `architect` / `team-lead`
  - *Verification*: All docs accurately describe the running codebase with zero discrepancies.
