import { getInitialFictionalData, SeedData } from "./seed/fictional-data";
import { generateReceiptCode, generateSecretToken, hashSecretToken, verifySecretToken } from "@/lib/crypto";
import { SuggestionStatus, UserRole } from "@/types";

// Persistent Data Repository for NamPS OS
class DataRepository {
  private data: SeedData;

  constructor() {
    this.data = getInitialFictionalData();
  }

  // Reset demo data back to initial state
  public resetDemoData(): void {
    this.data = getInitialFictionalData();
  }

  // --- Users & Auth ---
  public async getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  public async getUserById(id: string) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public async getUserByEmail(email: string) {
    const user = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  public async getChildrenForGuardian(guardianId: string) {
    const guardian = this.data.users.find((u) => u.id === guardianId && u.role === "parent");
    if (!guardian || !guardian.childrenIds) return [];
    return this.data.users
      .filter((u) => guardian.childrenIds?.includes(u.id))
      .map(({ passwordHash, ...user }) => user);
  }

  // --- Timetable ---
  public async getTimetableForStudent(gradeLevel: number, section: string) {
    return this.data.timetable.filter(
      (slot) => slot.gradeLevel === gradeLevel && slot.section.toUpperCase() === section.toUpperCase()
    );
  }

  public async getTimetableForTeacher(teacherName: string) {
    return this.data.timetable.filter((slot) => slot.teacherName.toLowerCase().includes(teacherName.toLowerCase()));
  }

  public async getAllTimetableSlots() {
    return this.data.timetable;
  }

  // --- Assignments & Submissions ---
  public async getAssignments(gradeLevel?: number, section?: string, teacherId?: string) {
    let result = this.data.assignments;
    if (gradeLevel && section) {
      result = result.filter((a) => a.gradeLevel === gradeLevel && a.section.toUpperCase() === section.toUpperCase());
    } else if (teacherId) {
      result = result.filter((a) => a.teacherId === teacherId);
    }
    return result;
  }

  public async getAssignmentById(id: string) {
    return this.data.assignments.find((a) => a.id === id) || null;
  }

  public async createAssignment(assignmentData: {
    courseId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
    title: string;
    instructions: string;
    dueDate: string;
    estimatedMinutes: number;
    gradeLevel: number;
    section: string;
  }) {
    const newAssignment = {
      id: `asg-${Date.now()}`,
      ...assignmentData,
      status: "published" as const,
    };
    this.data.assignments.unshift(newAssignment);
    return newAssignment;
  }

  public async getSubmissionsForAssignment(assignmentId: string) {
    return this.data.submissions.filter((s) => s.assignmentId === assignmentId);
  }

  public async getStudentSubmission(assignmentId: string, studentId: string) {
    return this.data.submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId) || null;
  }

  public async submitAssignment(assignmentId: string, studentId: string, studentName: string, content: string) {
    const existingIndex = this.data.submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );
    const submission = {
      id: existingIndex >= 0 ? this.data.submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName,
      content,
      submittedAt: new Date().toISOString(),
      maxScore: 100,
      status: "submitted" as const,
    };

    if (existingIndex >= 0) {
      this.data.submissions[existingIndex] = { ...this.data.submissions[existingIndex], ...submission };
    } else {
      this.data.submissions.unshift(submission);
    }
    return submission;
  }

  public async gradeSubmission(submissionId: string, grade: number, feedback: string) {
    const sub = this.data.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error("Submission not found");
    sub.grade = grade;
    sub.feedback = feedback;
    sub.status = "graded";
    return sub;
  }

  // --- Attendance ---
  public async getAttendanceForStudent(studentId: string) {
    return this.data.attendance.filter((a) => a.studentId === studentId);
  }

  public async getAttendanceForSlotAndDate(slotId: string, date: string) {
    return this.data.attendance.filter((a) => a.slotId === slotId && a.date === date);
  }

  public async markAttendance(records: Array<{
    slotId: string;
    studentId: string;
    studentName: string;
    date: string;
    status: "present" | "absent" | "late" | "excused";
    notes?: string;
  }>) {
    for (const record of records) {
      const idx = this.data.attendance.findIndex(
        (a) => a.slotId === record.slotId && a.studentId === record.studentId && a.date === record.date
      );
      if (idx >= 0) {
        this.data.attendance[idx] = { ...this.data.attendance[idx], ...record };
      } else {
        this.data.attendance.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          ...record,
        });
      }
    }
    return true;
  }

  // --- Truly Anonymous Suggestions Subsystem ---
  public async submitAnonymousSuggestion(
    category: "academic" | "facilities" | "catering" | "events" | "general",
    title: string,
    content: string
  ) {
    const receiptCode = generateReceiptCode();
    const secretToken = generateSecretToken();
    const secretHash = hashSecretToken(secretToken);

    const record = {
      id: `sug-${Date.now()}`,
      receiptCode,
      secretHash,
      category,
      title,
      content,
      status: "received" as SuggestionStatus,
      officialResponse: null,
      respondedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // MATHEMATICAL ZERO IDENTITY: no user_id, no student_id, no author_ip
    };

    this.data.anonymousSuggestions.unshift(record);

    return {
      receiptCode,
      secretToken, // Returned ONLY ONCE to submitter
      createdAt: record.createdAt,
    };
  }

  public async getAnonymousSuggestionByReceipt(receiptCode: string, secretToken: string) {
    const cleanCode = receiptCode.trim().toUpperCase();
    const cleanToken = secretToken.trim();

    const record = this.data.anonymousSuggestions.find((s) => s.receiptCode === cleanCode);
    if (!record) return null;

    const isValid = verifySecretToken(cleanToken, record.secretHash);
    if (!isValid) return null;

    // Never return the secretHash to the client
    const { secretHash, ...publicRecord } = record;
    return publicRecord;
  }

  public async getAllAnonymousSuggestions(callerRole: UserRole) {
    if (callerRole !== "director" && callerRole !== "manager") {
      throw new Error("Unauthorized to access anonymous suggestions review");
    }
    // Zero user fields exist in the record, ensuring complete author anonymity
    return this.data.anonymousSuggestions.map(({ secretHash, ...s }) => s);
  }

  public async updateAnonymousSuggestionStatus(
    id: string,
    status: SuggestionStatus,
    officialResponse: string | undefined,
    callerRole: UserRole
  ) {
    if (callerRole !== "director" && callerRole !== "manager") {
      throw new Error("Unauthorized to update suggestion status");
    }

    const item = this.data.anonymousSuggestions.find((s) => s.id === id);
    if (!item) throw new Error("Suggestion not found");

    item.status = status;
    if (officialResponse !== undefined) {
      item.officialResponse = officialResponse;
      item.respondedAt = new Date().toISOString();
    }
    item.updatedAt = new Date().toISOString();

    const { secretHash, ...updated } = item;
    return updated;
  }

  // --- Announcements ---
  public async getAnnouncements(audience?: "all" | "staff" | "class" | "students") {
    if (!audience || audience === "all") {
      return this.data.announcements;
    }
    return this.data.announcements.filter((a) => a.targetAudience === "all" || a.targetAudience === audience);
  }

  public async createAnnouncement(data: {
    title: string;
    content: string;
    authorName: string;
    targetAudience: "all" | "staff" | "class" | "students";
    priority: "urgent" | "normal" | "info";
  }) {
    const ann = {
      id: `ann-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.data.announcements.unshift(ann);
    return ann;
  }

  // --- Policies & Rules ---
  public async getPolicies(category?: string) {
    if (category) {
      return this.data.policies.filter((p) => p.category === category);
    }
    return this.data.policies;
  }

  // --- Events & Clubs ---
  public async getEvents() {
    return this.data.events;
  }

  public async registerForEvent(eventId: string) {
    const event = this.data.events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");
    if (event.registeredCount >= event.capacity) {
      throw new Error("Event capacity full");
    }
    event.registeredCount += 1;
    return event;
  }

  public async getClubs() {
    return this.data.clubs;
  }

  // --- Projects ---
  public async getProjects() {
    return this.data.projects;
  }

  // --- Support Tickets ---
  public async getSupportTickets() {
    return this.data.supportTickets;
  }

  public async createSupportTicket(data: {
    reporterName: string;
    category: "it" | "facilities" | "smartboard";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }) {
    const ticket = {
      id: `tkt-${Date.now()}`,
      ...data,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
    this.data.supportTickets.unshift(ticket);
    return ticket;
  }

  public async updateSupportTicketStatus(id: string, status: "open" | "in_progress" | "resolved") {
    const ticket = this.data.supportTickets.find((t) => t.id === id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.status = status;
    return ticket;
  }
}

// Global Singleton Instance
export const db = new DataRepository();
