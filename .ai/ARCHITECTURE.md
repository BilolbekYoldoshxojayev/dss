# NamPS OS — System Architecture & Design

## 1. Architectural Style: Modular Monolith
NamPS OS is built as a **clean TypeScript Modular Monolith** using Next.js 15+ App Router. This eliminates the deployment complexity, network latency, and operational cost of microservices, while guaranteeing strict boundary separation between modules.

```
                      +---------------------------------------+
                      |          Client / Browser             |
                      |   (Next.js App Router, React 19)      |
                      +-------------------+-------------------+
                                          | HTTPS / REST / Server Actions
                                          v
+-----------------------------------------------------------------------------+
|                               Next.js Server                                |
|                                                                             |
|  +--------------------+  +----------------------+  +---------------------+  |
|  | Presentation Layer |  |   Auth & Security    |  | i18n & Context      |  |
|  | (Layouts & Pages)  |  | (RBAC, JWT, Sessions)|  | (Uzbek/English)      |  |
|  +--------------------+  +----------------------+  +---------------------+  |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                          Domain Modules                               |  |
|  |  [Academic]     [Assignments]   [Workload]    [Attendance]  [Grades]  |  |
|  |  [Anonymous]    [KnowledgeBase] [Events]      [Leadership]  [Library] |  |
|  |  [IT/Facilities][Import/Export] [Auditing]    [Demo Engine]           |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                     Data Access Layer (Drizzle ORM)                   |  |
|  |             (Type-safe schemas, relations, transactions)              |  |
|  +-----------------------------------------------------------------------+  |
+-------------------------------------+---------------------------------------+
                                      | SQL
                                      v
                      +---------------------------------------+
                      |         PostgreSQL 16 Database        |
                      |    (Docker local / Cloud Free Tier)   |
                      +---------------------------------------+
```

## 2. Security Boundaries & Authorization
- **Client Boundary**: UI displays elements based on active role context, but NO access control decisions are trusted from the browser.
- **Server Action / API Boundary**: Every request verifies authentication status and executes server-side role check (`hasRole`, `hasPermission`).
- **Data Access Boundary**: Queries filter records by ownership or assigned entity scope:
  - Students access only their own enrollments, grades, submissions, and timetable.
  - Parents access only records belonging to verified linked children.
  - Teachers access only assigned classes and courses.
  - Anonymous suggestions operate in an isolated domain model with zero foreign keys to user accounts.

## 3. Truly Anonymous Suggestion Subsystem Architecture
```
[Unauthenticated Submitter]
          |
          | POST /api/suggestions/submit (Body: category, title, text)
          | (No cookies, no auth headers, IP address omitted from DB)
          v
[Crypto Token Generator]
  - Public Receipt Code: "NPS-" + 8-char nanoid (e.g., NPS-7K9W2B4X)
  - Private Secret Token: 32-byte cryptographically secure hex (e.g., sec_f49a...)
  - Secret Verifier: SHA-256(Secret Token + Salt)
          v
[Database: anonymous_suggestions]
  - id (UUID)
  - receipt_code (VARCHAR, UNIQUE, Indexed)
  - secret_hash (VARCHAR)
  - category (VARCHAR)
  - title (VARCHAR)
  - content (TEXT)
  - status (ENUM: received, under_review, approved, denied, in_progress, implemented, closed)
  - official_response (TEXT, NULLABLE)
  - responded_at (TIMESTAMP)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  (NO user_id, NO student_id, NO ip_address, NO email, NO metadata)
```

## 4. Database Schema Structure
The schema is managed via Drizzle ORM migrations (`src/db/schema/`):
- `users`: id, email, password_hash, full_name, role, avatar_url, is_active, created_at
- `guardians_students`: guardian_id, student_id, relationship_type, is_verified
- `academic_years`: id, name, start_date, end_date, is_current
- `terms`: id, academic_year_id, name, start_date, end_date
- `classes`: id, grade_level (5-11), section (A, B, C), academic_year_id
- `subjects`: id, code, name_uz, name_en, description
- `courses`: id, subject_id, class_id, teacher_id, academic_year_id
- `enrollments`: id, course_id, student_id
- `timetable_slots`: id, course_id, day_of_week, start_time, end_time, room_number
- `assignments`: id, course_id, title, instructions, due_date, estimated_minutes, rubric_json, status (draft, published, closed)
- `submissions`: id, assignment_id, student_id, content, attachment_url, submitted_at, status
- `grades`: id, submission_id, student_id, course_id, score, max_score, feedback, is_published, graded_by
- `attendance`: id, timetable_slot_id, student_id, date, status (present, absent, late, excused), notes
- `announcements`: id, author_id, title, content, target_audience (all, staff, class, students), priority, created_at
- `school_policies`: id, category, title, content, version, effective_date, is_archived
- `events`: id, title, description, start_time, end_time, location, capacity, is_public
- `event_registrations`: id, event_id, user_id, status (registered, waitlist, cancelled)
- `clubs`: id, name, description, leader_id, meeting_schedule
- `club_members`: id, club_id, user_id, joined_at
- `student_projects`: id, title, description, status, category, lead_student_id, mentor_id
- `project_milestones`: id, project_id, title, due_date, is_completed
- `library_items`: id, isbn, title, author, category, total_copies, available_copies
- `library_loans`: id, item_id, user_id, loan_date, due_date, return_date
- `support_tickets`: id, reporter_id, category (it, facility, smartboard), title, description, priority, status, assigned_to
- `student_initiatives`: id, proposer_id, title, description, status, council_notes
- `audit_logs`: id, actor_id, action, entity_type, entity_id, diff_json, created_at

## 5. Portability Strategy
- Standard PostgreSQL SQL compliant. No proprietary cloud features.
- Single unified `.env` contract for both cloud (Neon/Supabase) and local/self-hosted Docker:
  `DATABASE_URL=postgresql://namps_user:namps_password@localhost:5432/namps_os`
- Fully automated Docker Compose with database migrations applied on container launch.
