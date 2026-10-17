# NamPS School Platform — Version 1 Plan

Replaces the task graph in `.ai/TASKS.md` and `.ai/STATE.md`, which say "awaiting approval" even though code already exists.
Source of truth for scope: the team's *School Platform: Project Guide*.

---

## 1. Where the repository is today

The repo (`namps-os`, Next.js 15 + TypeScript + Tailwind + Drizzle) is a **clickable front-end prototype**. It is not yet a working v1 backend.

| Area | Status | Evidence |
|---|---|---|
| UI shell, mobile layout, Uzbek/English i18n | Good start, keep | `src/components/`, `src/i18n/uz.ts`, `en.ts` |
| Database | **In-memory only.** The Postgres/Drizzle schema exists but nothing imports it. Data resets on every restart. | `src/db/index.ts` (`DataRepository` over `fictional-data.ts`) |
| Migrations / seed scripts | Broken: they point at files that don't exist | `package.json` → `src/db/migrate.ts`, `src/db/seed/index.ts` |
| Login | **None.** A client-side role switcher with hard-coded demo accounts | `src/lib/auth-context.tsx` |
| Server-side permission checks | **None on any API route.** No middleware. | `grep verifySessionToken src/app/api` → no hits |
| JWT | Hard-coded fallback secret; 7-day stateless token, so logout can't end a session | `src/lib/auth.ts` |
| Marks / assessments | Missing. Only assignment submissions carry a grade. | `src/db/schema.ts` |
| Transcripts / PDF | Missing | — |
| Audit log | Table defined, never written | `auditLogs` in schema |
| Attendance | UI + API exist; no backdate window, no auth | `src/app/api/attendance/route.ts` |
| Out-of-scope modules | Present: anonymous suggestions, guardian portal, clubs/events, projects, facilities, knowledge base, workload | `src/components/modules/` |
| Repo hygiene | `tsconfig.tsbuildinfo` is committed despite `.gitignore` | `git ls-files` |
| Build / tests | Green on 2026-10-17: typecheck, 13/13 vitest, `next build`. Tests only cover the in-memory store. | `tests/` |

**What this means today:** anyone on the network can call `POST /api/assignments/grade`, read `GET /api/attendance?studentId=<anyone>`, run a CSV import, or call `/api/demo/reset`. The guide's most important test ("a student cannot see another student's marks") fails by design. Fixing this is Milestone 1.

## 2. Decisions (defaults; change them as a team if you disagree)

1. **Stack:** keep Next.js + TypeScript + Drizzle + PostgreSQL. It's already chosen and fits the guide's options. Use Docker Compose for Postgres in development so all 4 machines match.
2. **Roles:** map the repo's roles onto the guide's:
   - `student` → Student
   - `teacher` → Teacher
   - Class teacher = a `teacher` whose id is `classes.class_teacher_id`. This is a relationship, not a separate role.
   - `admin` → Administrator. Merge the current `manager` and `director` into this role. A director with read-only access can be added later.
   - `parent` → version 2.
3. **Login:** school-issued **username** + password, hashed with argon2id (or bcrypt cost 12).
4. **Sessions:** server-side `sessions` table with a random opaque token in an httpOnly, Secure, SameSite=Lax cookie. Idle expiry around 8 hours. Logout deletes the row. No JWT. This makes "logout actually ends the session" true.
5. **Authorization:** one server helper used by every route, e.g. `requireUser()`, `requireRole()`, `canSeeStudent(user, studentId)`, `teachesClassSubject(user, class, subject)`. Every query is scoped by the current user. Client-side role checks are only for display.
6. **Out-of-scope modules:** hide them behind a `FEATURES` flag (off by default). Don't delete them; the team can revisit for v2.
7. **Demo mode:** `/api/demo/reset` and the role switcher only work when `DEMO_MODE=true`, which is never set in production.
8. **Fail closed:** the app refuses to start if `SESSION_SECRET` or `DATABASE_URL` is missing.

## 3. Data model (v1)

Follows the guide's draft, adapted to what's already in `schema.ts`:

- `users` (id, username **unique**, full_name, role, password_hash, active, created_at)
- `sessions` (id/token_hash, user_id, expires_at, created_at)
- `academic_years`, `terms` (id, year_id, name, start_date, end_date, **closed**)
- `classes` (id, name e.g. "10-A", grade_level, year_id, class_teacher_id)
- `students` (user_id, class_id) · `subjects` (id, name)
- `teacher_assignments` (teacher_id, class_id, subject_id)
- `assessments` (id, class_id, subject_id, term_id, type: quiz|test|homework_check|exam, date, max_score, teacher_id)
- `marks` (id, assessment_id, student_id, score, comment, updated_by, updated_at), unique per (assessment, student)
- `homework` (id, class_id, subject_id, description, due_date, attachment_path, posted_by)
- `attendance` (id, lesson_date, class_id, subject_id, period, student_id, status: present|absent|late|excused, recorded_by), unique per (lesson, student)
- `attendance_backdate_approvals` (admin approval for edits older than the window)
- `audit_log` (id, user_id, action, entity, entity_id, old_value jsonb, new_value jsonb, created_at). Written in the **same transaction** as the change.
- `grading_scale` setting (5-point / 100-point). Configurable until the school confirms which one it uses.

## 4. Milestones

Each milestone ends with: tests green, a PR reviewed by at least one teammate, merged to `main`, and the guide's week targets checked.

### M1 — Foundation and permissions (Weeks 1–2) · Person A leads
- Docker Compose Postgres, Drizzle migrations, a real seed (fictional data, Uzbek names).
- Replace the in-memory `DataRepository` with Drizzle queries.
- Username login, server sessions, logout, password change. Admin resets passwords.
- `requireUser`/`requireRole`/ownership helpers, applied to **every** existing API route.
- Feature-flag the out-of-scope modules. Gate demo endpoints behind `DEMO_MODE`.
- Fix `package.json` scripts and untrack `tsconfig.tsbuildinfo`.
- CI (GitHub Actions): typecheck, lint, test, build on every PR.
- **Permission test suite first** (integration tests against a test Postgres):
  - A student cannot read another student's marks, attendance, or transcript (403).
  - A teacher cannot write marks or attendance for a class/subject they don't teach.
  - Unauthenticated requests to every route get 401.
  - After logout, the old cookie gets 401.

### M2 — Marks and grades (Weeks 3–4) · Person B
- Teachers create assessments and enter marks in a fast class grid (aim: under 1 minute per class).
- Students see marks by subject and by term, with term averages.
- Every mark edit writes `audit_log` (old → new, who, when). Marks in a **closed term** can only be changed by an admin.

### M3 — Attendance and homework (Weeks 5–6) · Person C
- One-tap attendance grid per lesson (present by default, tap to change).
- Edits older than 7 days are rejected unless an admin has approved them.
- Class teacher sees a whole-class summary. Students see their own history.
- Homework: post with optional attachment (local disk volume, size and type limits). Students see today's homework first, then upcoming. "Mark as done" if time allows.

### M4 — Transcripts and PDF (Week 7) · Person B
- Term and full-year transcript: subjects, term averages, final grade, teacher names.
- PDF via a headless-browser step (Playwright/Chromium) rendering an HTML template, so it matches the school's paper layout. **Needs the school's paper sample first.**

### M5 — Admin, export, backups, pilot (Week 8) · Person A + D
- Admin pages: users (create/deactivate, assign role and class), classes, subjects, terms.
- CSV/Excel export of grades and attendance per class or term. Reuse the existing CSV import for class lists.
- Daily `pg_dump` backup and a **restore that has actually been tested** (`scripts/backup.sh` and `restore.sh` exist; verify them).
- Deploy to a school server or VPS with Docker Compose and HTTPS.
- Pilot: one real week with one or two classes, then fix bugs.

**Throughout (Person D):** mobile-first screens, all text in `src/i18n/` (add `ru.ts` as an empty shell), and 2-second load checks for today's homework and marks.

## 5. How to use the $100 of Claude credits

Track the actual spend at every milestone with `/claude-code-cost:report` instead of guessing. Rough plan:

| Use | Model | Share of budget |
|---|---|---|
| Planning, schema and permission design, security review of each milestone's PR | Opus | ~25% |
| Implementing M1–M5 (routes, queries, UI wiring, tests) | Sonnet (switch the session model for bulk coding) | ~60% |
| Docs, translations, CSV/export, CI YAML | Haiku/Sonnet | ~10% |
| Reserve for pilot bug fixes | any | ~5–10% |

Tips that save credits:
- One milestone per session; `/clear` between them.
- Keep this file and a short `PROGRESS.md` up to date so a new session can resume without re-reading the whole repo.
- Have Claude write the tests first. Cheap reruns catch problems before expensive debugging.
- **M1 is the most valuable thing to spend credits on.** M2–M5 are more routine, and the team can do more of that work by hand.

## 6. Open questions for the school (do not block M1)

- Who signs off on requirements and the transcript format? Get a **paper transcript sample**.
- Grading scale: 5-point, 100-point, or both?
- Existing student IDs, class lists, timetable to import?
- Who may change a mark after a term closes?
- How long must marks and attendance be kept?
- One school only, or several later? (Design for one; keep `school_id` out for now.)
- Hosting: school server or VPS? Who owns the domain/HTTPS?

## 7. Definition of done (v1)

As in the guide §11, plus: the permission test suite runs in CI and blocks merges, and a backup restore has been performed and timed.
