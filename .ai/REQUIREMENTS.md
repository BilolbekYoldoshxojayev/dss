# NamPS OS — System Requirements & Acceptance Criteria

## 1. Non-Negotiable Constraints
- **C1: Zero Spending ($0)**: Absolute requirement. No paid APIs, no paid cloud subscriptions, no metered services that can bill, no credit card requirements. Core functionality runs with zero external paid AI dependency.
- **C2: Genuinely Working Application**: No mock placeholders or fake toast successes. Every form submits, persists to PostgreSQL, and enforces validation.
- **C3: Public Availability**: Publicly accessible web deployment with working demo environment, fictional grades 5-11 data, and isolated demo reset capability.
- **C4: School-Server Portability**: Ready for Docker and Docker Compose deployment on the school's private Linux server with documented migration, backup, and restore routines.
- **C5: Role-Based Access Control**: Server-enforced permissions for Director, Manager, Teacher, Student, and Parent. No client-side security trust.
- **C6: Truly Anonymous Student Suggestions**: Zero identity mapping, no user ID, no IP address storage in DB, no log of suggestion body text. Cryptographic receipt code and secret token with SHA-256 verifier storage.
- **C7: Bilingual Support**: Comprehensive Uzbek (Latin script, primary) and English localization across all modules, forms, errors, and status labels.

## 2. Functional Requirements by Module

### R1. Student Dashboard & Workload
- Displays today's timetable, upcoming lessons, active assignments, due dates, recent grades, announcements, and workload indicators.
- Workload calculation based on teacher-estimated completion times to identify conflicting major deadlines.

### R2. Timetable & Scheduling
- Daily and weekly timetable views for students and teachers in `Asia/Tashkent` timezone.
- Classrooms, teacher assignments, period slots, academic terms, and holiday markers.
- Conflict detection preventing double-booking of teachers or rooms.

### R3. Class & Subject Management
- Grades 5 through 11, sectional divisions (e.g., 9-A, 10-B).
- Subjects, course offerings, teacher assignments, and student enrollments.

### R4. Assignments, Submissions & Grading
- Teachers can create, draft, schedule, publish, edit, and close assignments with instructions, due dates, estimated time, and rubrics.
- Students can browse, filter, submit work (links/files), resubmit if permitted, and view feedback and grades.
- Teachers can review submissions in a dedicated grading queue, enter rubric scores and comments, and publish grades.

### R5. Workload Coordination
- Aggregated daily/weekly homework workload per class.
- Conflict warnings when multiple heavy assignments coincide on the same date.
- Propose deadline change workflows for teachers and administrators.

### R6. Grades & Assessments
- Configurable grading scales and assessment terms (Terms 1-4).
- Gradebook with draft vs. published states, missing indicators, and audit logging of grade corrections.

### R7. Attendance Tracking
- Timetable-linked session attendance (Present, Absent, Late, Excused).
- Real-time entry by teachers, read-only visibility for students and parents, administrative reports.

### R8. Announcements & Notifications
- School-wide, class-level, and staff-only announcements.
- Priority levels (Urgent, Normal, Informational), read-status tracking for critical alerts, and search.

### R9. School Rules & Knowledge Base
- Searchable policy documents, student handbook, IT rules, forms, and FAQs.
- Version history, publication dates, and archival status.

### R10. Truly Anonymous Student Suggestions (Privacy Subsystem)
- Unauthenticated submission flow requiring zero credentials or identifying fields.
- Immediate one-time presentation of public receipt code and private secret token.
- Secure SHA-256 verifier storage.
- Anonymous status lookup page protected by receipt code + secret token.
- Reviewer portal for Director and Manager to change status (`Received`, `Under Review`, `Approved`, `Denied`, `In Progress`, `Implemented`, `Closed`) and provide published responses.
- Explicit automated tests verifying zero identity leakage and access controls.

### R11. Student Voice, Initiatives & Leadership
- Identified feedback/polls for non-anonymous school consultations.
- Student council project proposals, milestones, meeting agendas, and action items.

### R12. Events & Extracurriculars
- School calendar, club listings, event registrations with capacity limits and waitlists.

### R13. Student Projects & Mentorship
- Project proposals, team rosters, milestone tracking, mentor requests, and public showcase.

### R14. Academic Support & Opportunities
- Peer tutoring directory, revision study materials, olympiad/competition listings, university prep resources.

### R15. Role Workspaces (Director, Manager, Teacher, Parent)
- **Director**: School-wide analytics, policy management, staff/student overview, anonymous suggestion review, action items.
- **Manager**: Operational administration, user provisioning, term setup, timetable editor, bulk data import/export.
- **Teacher**: Daily teaching schedule, rosters, attendance, grading queue, course materials.
- **Parent**: Guardian-child linkage, attendance summaries, published grades, deadlines.

### R16. Library & Facilities Support
- Book/resource catalog, loan and return tracking.
- Maintenance & IT support ticketing (e.g., smartboard repairs, equipment checks).

### R17. Bulk CSV Data Import & Export
- Validated CSV templates for Students, Teachers, Classes, Subjects, Enrollments, and Timetables.
- Parsing preview, duplicate detection, dry-run validation, and transaction-safe execution.

### R18. Interactive Demo Mode
- Prominent `DEMO` badge.
- Instant role switching between Director, Manager, Teacher, Student, and Parent.
- Fictional data for Grades 5-11.
- Safe demo reset mechanism preserving system integrity.

## 3. Non-Functional Requirements
- **Performance**: Page load < 1.5s, API response < 200ms.
- **Accessibility**: WCAG 2.2 AA compliant, visible focus states, full keyboard navigability.
- **Security**: OWASP Top 10 mitigation, CSRF protection, secure cookie handling, rate limiting on status lookups and login, zero secrets in client bundles.
- **Reliability**: Graceful handling of free-tier database sleep/pause states with user-friendly retry banners.
