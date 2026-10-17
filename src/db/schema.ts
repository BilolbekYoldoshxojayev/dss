import { pgTable, text, varchar, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

// 1. Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // director, manager, teacher, student, parent, librarian, staff
  avatarUrl: text("avatar_url"),
  gradeLevel: integer("grade_level"), // 5 - 11
  section: varchar("section", { length: 10 }), // A, B, C
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Guardian-Student Relationships
export const guardiansStudents = pgTable("guardians_students", {
  id: uuid("id").primaryKey().defaultRandom(),
  guardianId: uuid("guardian_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  relationshipType: varchar("relationship_type", { length: 50 }).default("parent").notNull(), // father, mother, legal_guardian
  isVerified: boolean("is_verified").default(true).notNull(),
});

// 3. Academic Years & Terms
export const academicYears = pgTable("academic_years", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "2026-2027"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isCurrent: boolean("is_current").default(true).notNull(),
});

export const terms = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  academicYearId: uuid("academic_year_id").references(() => academicYears.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(), // "Term 1"
  termNumber: integer("term_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

// 4. Classes (Sinflar)
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  gradeLevel: integer("grade_level").notNull(), // 5 - 11
  section: varchar("section", { length: 10 }).notNull(), // "A", "B", "C"
  academicYearId: uuid("academic_year_id").references(() => academicYears.id).notNull(),
});

// 5. Subjects & Courses
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 20 }).notNull().unique(), // e.g. "MATH-ADV"
  nameUz: varchar("name_uz", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  description: text("description"),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }).notNull(),
  teacherId: uuid("teacher_id").references(() => users.id).notNull(),
  academicYearId: uuid("academic_year_id").references(() => academicYears.id).notNull(),
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
});

// 6. Timetable Slots
export const timetableSlots = pgTable("timetable_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 1 = Mon, 5 = Fri
  startTime: varchar("start_time", { length: 10 }).notNull(), // "08:30"
  endTime: varchar("end_time", { length: 10 }).notNull(),     // "09:15"
  room: varchar("room", { length: 50 }).notNull(),
});

// 7. Assignments & Submissions
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  teacherId: uuid("teacher_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  instructions: text("instructions").notNull(),
  dueDate: timestamp("due_date").notNull(),
  estimatedMinutes: integer("estimated_minutes").default(45).notNull(),
  rubricJson: jsonb("rubric_json"),
  status: varchar("status", { length: 20 }).default("published").notNull(), // draft, published, closed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").references(() => assignments.id, { onDelete: "cascade" }).notNull(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  grade: integer("grade"), // e.g. 95 out of 100
  maxScore: integer("max_score").default(100).notNull(),
  feedback: text("feedback"),
  status: varchar("status", { length: 20 }).default("submitted").notNull(), // submitted, graded, late
});

// 8. Attendance
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  slotId: uuid("slot_id").references(() => timetableSlots.id).notNull(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  date: varchar("date", { length: 20 }).notNull(), // "YYYY-MM-DD"
  status: varchar("status", { length: 20 }).notNull(), // present, absent, late, excused
  notes: text("notes"),
  markedBy: uuid("marked_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Truly Anonymous Suggestions Subsystem (Zero User Mapping)
export const anonymousSuggestions = pgTable("anonymous_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  receiptCode: varchar("receipt_code", { length: 50 }).notNull().unique(), // e.g. "NPS-7K9W2B4X"
  secretHash: text("secret_hash").notNull(), // SHA-256 verifier
  category: varchar("category", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 30 }).default("received").notNull(), // received, under_review, approved, denied, in_progress, implemented, closed
  officialResponse: text("official_response"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // CRITICAL SECURITY PROPERTY: NO user_id, NO student_id, NO author_ip, NO email!
});

// 10. Announcements
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  targetAudience: varchar("target_audience", { length: 50 }).default("all").notNull(), // all, staff, class, students
  priority: varchar("priority", { length: 20 }).default("normal").notNull(), // urgent, normal, info
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. School Policies & Rules
export const policies = pgTable("policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // handbook, academic, behavior, it, facilities
  content: text("content").notNull(),
  version: varchar("version", { length: 20 }).default("1.0").notNull(),
  effectiveDate: varchar("effective_date", { length: 30 }).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});

// 12. Events & Registrations
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: varchar("date", { length: 30 }).notNull(),
  time: varchar("time", { length: 30 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  capacity: integer("capacity").default(100).notNull(),
  registeredCount: integer("registered_count").default(0).notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: varchar("status", { length: 20 }).default("registered").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Clubs
export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  leaderName: varchar("leader_name", { length: 255 }).notNull(),
  meetingSchedule: varchar("meeting_schedule", { length: 255 }).notNull(),
  memberCount: integer("member_count").default(0).notNull(),
});

// 14. Student Projects & Mentorship
export const studentProjects = pgTable("student_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  status: varchar("status", { length: 30 }).default("active").notNull(), // proposed, active, completed
  leadStudentId: uuid("lead_student_id").references(() => users.id).notNull(),
  mentorName: varchar("mentor_name", { length: 255 }).notNull(),
  milestonesJson: jsonb("milestones_json"),
});

// 15. Facilities & IT Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").references(() => users.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // it, facilities, smartboard
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(),
  status: varchar("status", { length: 30 }).default("open").notNull(), // open, in_progress, resolved, closed
  assignedTo: varchar("assigned_to", { length: 255 }),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 16. Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id"),
  actorRole: varchar("actor_role", { length: 50 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
