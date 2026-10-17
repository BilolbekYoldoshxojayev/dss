# NamPS OS — Project Overview

## 1. Executive Summary
**NamPS OS** is a unified, fully functioning digital school platform engineered specifically for **Namangan Presidential School (NamPS)** in Uzbekistan. It delivers an integrated operating system for academic administration, teaching, student learning, parental oversight, student voice, and extracurricular coordination at **$0 cost** using verified free-tier services, while ensuring 100% portability to a self-hosted school server.

## 2. Core Purpose
- Replace fragmented school spreadsheets, paper notices, and disjointed tools with a unified, role-based platform.
- Guarantee strict privacy and mathematical anonymity for student suggestions and feedback.
- Deliver tailored, role-specific experiences for Director, Manager, Teachers, Students, and Parents/Guardians.
- Ensure zero budget impact ($0 spend) during prototype, demo, and deployment phases.
- Facilitate effortless future migration to a physical or cloud school server via Docker and PostgreSQL.

## 3. Technology Stack
- **Frontend & Fullstack Framework**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS, CSS Variables for theming (Light/Dark mode), Lucide Icons, Accessible Headless Components (Radix UI / Shadcn patterns)
- **Database & Persistence**: PostgreSQL 16 (Drizzle ORM for type-safe queries and zero-overhead standard SQL migrations)
- **Authentication & Security**: Custom session-based JWT authentication with bcrypt password hashing; cryptographic SHA-256 tokens for anonymous suggestion receipts; granular RBAC (Role-Based Access Control)
- **Internationalization (i18n)**: Native bilingual support for Uzbek (Latin script, primary) and English with Asia/Tashkent timezone handling
- **Containerization & DevOps**: Multi-stage Dockerfile, Docker Compose (Web + PostgreSQL 16 + Health checks + Persistent volumes), automated backup and restore scripts
- **Free-Tier Deployment**: Vercel / Render / Koyeb for web application; Neon Serverless Postgres / Supabase (free tier, zero credit card) for cloud database

## 4. Target Platforms & Environment
- **Web**: Modern desktop and mobile browsers (Chrome, Safari, Firefox, Edge) with WCAG 2.2 AA accessibility
- **Host Server**: Docker / Docker Compose on Ubuntu / Debian Linux host
- **Timezone**: `Asia/Tashkent` (UTC+5)
- **Languages**: Uzbek (O'zbekcha) and English

## 5. User Personas
1. **Director**: School-wide oversight, policy approval, executive dashboards, anonymous suggestion review and official disposition, meeting agendas/action items.
2. **Manager**: Operational administration, user provisioning, academic calendar/terms, class/subject configurations, timetable conflict management, bulk CSV import/export.
3. **Teacher**: Subject and class rosters, attendance recording, assignment authoring/grading, rubric-based feedback, workload coordination, course resources.
4. **Student**: Daily/weekly timetable, assignment submission, workload calendar, published grade review, clubs/events, project mentorship, anonymous suggestion submission and private receipt tracking.
5. **Parent/Guardian**: Verified guardian-child linkages, attendance tracking, published grades, upcoming assignment deadlines, official announcements.
6. **Auxiliary Staff**: Librarian (catalog, loans), IT/Facilities Staff (equipment and smartboard maintenance tickets), Club/Event Leaders.
