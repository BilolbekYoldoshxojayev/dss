# NamPS OS — Data Model & Schema

## 1. Relational Entities
- **Users**: `id` (UUID), `email`, `password_hash`, `full_name`, `role`, `grade_level`, `section`, `is_active`, `created_at`.
- **GuardiansStudents**: `id`, `guardian_id` (FK -> users), `student_id` (FK -> users), `relationship_type`, `is_verified`.
- **AcademicYears & Terms**: `id`, `name`, `term_number`, `start_date`, `end_date`, `is_current`.
- **Classes**: `id`, `grade_level` (5–11), `section` (A, B, C), `academic_year_id`.
- **Subjects & Courses**: `id`, `code`, `name_uz`, `name_en`, `teacher_id`, `class_id`.
- **TimetableSlots**: `id`, `course_id`, `day_of_week` (1-5), `start_time`, `end_time`, `room`.
- **Assignments**: `id`, `course_id`, `teacher_id`, `title`, `instructions`, `due_date`, `estimated_minutes`, `status`.
- **Submissions**: `id`, `assignment_id`, `student_id`, `content`, `submitted_at`, `grade`, `max_score`, `feedback`, `status`.
- **AttendanceRecords**: `id`, `slot_id`, `student_id`, `date`, `status` (present, absent, late, excused), `notes`, `marked_by`.
- **AnonymousSuggestions**: `id`, `receipt_code` (Unique), `secret_hash`, `category`, `title`, `content`, `status`, `official_response`, `responded_at`, `created_at`, `updated_at`.
  *(Crucial property: Contains ZERO foreign keys or user identifiers).*
- **Announcements**: `id`, `author_id`, `title`, `content`, `target_audience`, `priority`, `created_at`.
- **SupportTickets**: `id`, `reporter_id`, `category` (smartboard, it, facilities), `title`, `description`, `priority`, `status`, `assigned_to`, `created_at`.
