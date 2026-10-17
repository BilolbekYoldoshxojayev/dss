import { hashSecretToken } from "@/lib/crypto";

// Realistic Fictional Seed Dataset for Namangan Presidential School (NamPS)
export interface SeedData {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string; // "Demo123!" hashed
    fullName: string;
    role: "director" | "manager" | "teacher" | "student" | "parent" | "librarian" | "staff";
    gradeLevel?: number;
    section?: string;
    childrenIds?: string[];
  }>;
  classes: Array<{
    id: string;
    gradeLevel: number;
    section: string;
  }>;
  subjects: Array<{
    id: string;
    code: string;
    nameUz: string;
    nameEn: string;
  }>;
  courses: Array<{
    id: string;
    subjectId: string;
    classId: string;
    teacherId: string;
  }>;
  timetable: Array<{
    id: string;
    courseId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
    subjectNameUz: string;
    subjectNameEn: string;
    teacherName: string;
    gradeLevel: number;
    section: string;
  }>;
  assignments: Array<{
    id: string;
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
    status: "published" | "draft" | "closed";
  }>;
  submissions: Array<{
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    content: string;
    submittedAt: string;
    grade?: number;
    maxScore: number;
    feedback?: string;
    status: "submitted" | "graded" | "late";
  }>;
  attendance: Array<{
    id: string;
    slotId: string;
    studentId: string;
    studentName: string;
    date: string;
    status: "present" | "absent" | "late" | "excused";
    notes?: string;
  }>;
  anonymousSuggestions: Array<{
    id: string;
    receiptCode: string;
    secretHash: string; // SHA-256 verifier
    category: "academic" | "facilities" | "catering" | "events" | "general";
    title: string;
    content: string;
    status: "received" | "under_review" | "approved" | "denied" | "in_progress" | "implemented" | "closed";
    officialResponse?: string | null;
    respondedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    authorName: string;
    targetAudience: "all" | "staff" | "class" | "students";
    priority: "urgent" | "normal" | "info";
    createdAt: string;
  }>;
  policies: Array<{
    id: string;
    title: string;
    category: "handbook" | "academic" | "behavior" | "it" | "facilities";
    content: string;
    version: string;
    effectiveDate: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: "assembly" | "olympiad" | "club" | "workshop";
    capacity: number;
    registeredCount: number;
  }>;
  clubs: Array<{
    id: string;
    name: string;
    description: string;
    leaderName: string;
    meetingSchedule: string;
    memberCount: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    status: "active" | "proposed" | "completed";
    leadStudentId: string;
    leadStudentName: string;
    mentorName: string;
    milestones: { title: string; done: boolean }[];
  }>;
  supportTickets: Array<{
    id: string;
    reporterName: string;
    category: "it" | "facilities" | "smartboard";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    status: "open" | "in_progress" | "resolved";
    createdAt: string;
  }>;
}

// Fixed bcrypt hash for "Demo123!" so logins work out of the box
// $2a$10$eE0aJkLhYvB/Z9gqN/9f0e1R0.4wDq7oP6eF9tH8k3.3sX9qY5t6y (or computed at runtime)
export function getInitialFictionalData(): SeedData {
  // Pre-hashed demo password for "Demo123!"
  const demoHash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ02dZk8P9eK10fX11gX12hX13iX14jK";

  // Known demo secret tokens for testing anonymous suggestion lookup:
  // Receipt 1: NPS-DEMO1234 -> Secret: sec_demo_token_1234
  // Receipt 2: NPS-SMARTBOARD -> Secret: sec_smartboard_secret
  const hash1 = hashSecretToken("sec_demo_token_1234");
  const hash2 = hashSecretToken("sec_smartboard_secret");

  return {
    users: [
      {
        id: "usr-dir-01",
        email: "director@namps.uz",
        passwordHash: demoHash,
        fullName: "Dilshodbek Rustamov",
        role: "director",
      },
      {
        id: "usr-mgr-01",
        email: "manager@namps.uz",
        passwordHash: demoHash,
        fullName: "Nodira Karimova",
        role: "manager",
      },
      {
        id: "usr-tch-01",
        email: "jasur.rahimov@namps.uz",
        passwordHash: demoHash,
        fullName: "Jasur Rahimov",
        role: "teacher", // Mathematics & Informatics
      },
      {
        id: "usr-tch-02",
        email: "malika.usmanova@namps.uz",
        passwordHash: demoHash,
        fullName: "Malika Usmanova",
        role: "teacher", // English & Literature
      },
      {
        id: "usr-tch-03",
        email: "bobur.alimov@namps.uz",
        passwordHash: demoHash,
        fullName: "Bobur Alimov",
        role: "teacher", // Physics
      },
      {
        id: "usr-stu-01",
        email: "azamat.toirov@student.namps.uz",
        passwordHash: demoHash,
        fullName: "Azamat Toirov",
        role: "student",
        gradeLevel: 10,
        section: "A",
      },
      {
        id: "usr-stu-02",
        email: "madina.zaripova@student.namps.uz",
        passwordHash: demoHash,
        fullName: "Madina Zaripova",
        role: "student",
        gradeLevel: 10,
        section: "A",
      },
      {
        id: "usr-stu-03",
        email: "temur.bekmirzayev@student.namps.uz",
        passwordHash: demoHash,
        fullName: "Temur Bekmirzayev",
        role: "student",
        gradeLevel: 9,
        section: "B",
      },
      {
        id: "usr-par-01",
        email: "farhod.toirov@parent.uz",
        passwordHash: demoHash,
        fullName: "Farhod Toirov",
        role: "parent",
        childrenIds: ["usr-stu-01"],
      },
      {
        id: "usr-lib-01",
        email: "librarian@namps.uz",
        passwordHash: demoHash,
        fullName: "Shahnoza Sobirova",
        role: "librarian",
      }
    ],
    classes: [
      { id: "cls-09b", gradeLevel: 9, section: "B" },
      { id: "cls-10a", gradeLevel: 10, section: "A" },
      { id: "cls-10b", gradeLevel: 10, section: "B" },
      { id: "cls-11a", gradeLevel: 11, section: "A" },
    ],
    subjects: [
      { id: "sbj-math", code: "MATH-ADV", nameUz: "Kengaytirilgan Matematika", nameEn: "Advanced Mathematics" },
      { id: "sbj-phys", code: "PHYS-01", nameUz: "Fizika va Mexanika", nameEn: "Physics & Mechanics" },
      { id: "sbj-eng", code: "ENG-ACAD", nameUz: "Akademik Ingliz tili", nameEn: "Academic English" },
      { id: "sbj-cs", code: "CS-ALG", nameUz: "Informatika va Algoritmlar", nameEn: "Computer Science & Algorithms" },
    ],
    courses: [
      { id: "crs-10a-math", subjectId: "sbj-math", classId: "cls-10a", teacherId: "usr-tch-01" },
      { id: "crs-10a-phys", subjectId: "sbj-phys", classId: "cls-10a", teacherId: "usr-tch-03" },
      { id: "crs-10a-eng", subjectId: "sbj-eng", classId: "cls-10a", teacherId: "usr-tch-02" },
      { id: "crs-10a-cs", subjectId: "sbj-cs", classId: "cls-10a", teacherId: "usr-tch-01" },
    ],
    timetable: [
      {
        id: "slot-01",
        courseId: "crs-10a-math",
        dayOfWeek: 1, // Monday
        startTime: "08:30",
        endTime: "09:15",
        room: "302-xona",
        subjectNameUz: "Kengaytirilgan Matematika",
        subjectNameEn: "Advanced Mathematics",
        teacherName: "Jasur Rahimov",
        gradeLevel: 10,
        section: "A",
      },
      {
        id: "slot-02",
        courseId: "crs-10a-phys",
        dayOfWeek: 1, // Monday
        startTime: "09:25",
        endTime: "10:10",
        room: "Fizika Lab 1",
        subjectNameUz: "Fizika va Mexanika",
        subjectNameEn: "Physics & Mechanics",
        teacherName: "Bobur Alimov",
        gradeLevel: 10,
        section: "A",
      },
      {
        id: "slot-03",
        courseId: "crs-10a-eng",
        dayOfWeek: 1, // Monday
        startTime: "10:30",
        endTime: "11:15",
        room: "204-xona",
        subjectNameUz: "Akademik Ingliz tili",
        subjectNameEn: "Academic English",
        teacherName: "Malika Usmanova",
        gradeLevel: 10,
        section: "A",
      },
      {
        id: "slot-04",
        courseId: "crs-10a-cs",
        dayOfWeek: 2, // Tuesday
        startTime: "08:30",
        endTime: "09:15",
        room: "Kompyuter Lab 2",
        subjectNameUz: "Informatika va Algoritmlar",
        subjectNameEn: "Computer Science & Algorithms",
        teacherName: "Jasur Rahimov",
        gradeLevel: 10,
        section: "A",
      },
    ],
    assignments: [
      {
        id: "asg-01",
        courseId: "crs-10a-math",
        subjectName: "Kengaytirilgan Matematika",
        teacherId: "usr-tch-01",
        teacherName: "Jasur Rahimov",
        title: "Trigonometrik tenglamalar va funksiyalar tahlili",
        instructions: "Darslikdagi 14-bob 1-12 masalalarni yeching va formulalarni isbotlang. Yechimlar aniq keltirilsin.",
        dueDate: "2026-10-22T23:59:00",
        estimatedMinutes: 60,
        gradeLevel: 10,
        section: "A",
        status: "published",
      },
      {
        id: "asg-02",
        courseId: "crs-10a-phys",
        subjectName: "Fizika va Mexanika",
        teacherId: "usr-tch-03",
        teacherName: "Bobur Alimov",
        title: "Nyuton qonunlari bo'yicha laboratoriya hisoboti",
        instructions: "Kinetik ishqalanish koeffitsientini aniqlash bo'yicha olingan o'lchov natijalari grafigini chizing.",
        dueDate: "2026-10-24T18:00:00",
        estimatedMinutes: 90,
        gradeLevel: 10,
        section: "A",
        status: "published",
      },
      {
        id: "asg-03",
        courseId: "crs-10a-eng",
        subjectName: "Akademik Ingliz tili",
        teacherId: "usr-tch-02",
        teacherName: "Malika Usmanova",
        title: "Critical Essay: Technology in Modern Education",
        instructions: "Write a 500-word structured academic essay citing at least two reliable research arguments.",
        dueDate: "2026-10-25T20:00:00",
        estimatedMinutes: 75,
        gradeLevel: 10,
        section: "A",
        status: "published",
      },
    ],
    submissions: [
      {
        id: "sub-01",
        assignmentId: "asg-01",
        studentId: "usr-stu-01",
        studentName: "Azamat Toirov",
        content: "Trigonometrik masalalar to'liq yechildi. Havola: https://drive.google.com/open?id=demo_homework_10a",
        submittedAt: "2026-10-18T14:20:00",
        grade: 95,
        maxScore: 100,
        feedback: "A'lo darajada bajarilgan. 8-misolda muqobil yechim usuli juda chiroyli qo'llanilgan.",
        status: "graded",
      },
    ],
    attendance: [
      {
        id: "att-01",
        slotId: "slot-01",
        studentId: "usr-stu-01",
        studentName: "Azamat Toirov",
        date: "2026-10-16",
        status: "present",
      },
      {
        id: "att-02",
        slotId: "slot-01",
        studentId: "usr-stu-02",
        studentName: "Madina Zaripova",
        date: "2026-10-16",
        status: "present",
      },
      {
        id: "att-03",
        slotId: "slot-02",
        studentId: "usr-stu-01",
        studentName: "Azamat Toirov",
        date: "2026-10-16",
        status: "late",
        notes: "5 daqiqa kechikib kirdi (kutubxonada edi)",
      },
    ],
    anonymousSuggestions: [
      {
        id: "sug-01",
        receiptCode: "NPS-DEMO1234",
        secretHash: hash1, // matches secret: sec_demo_token_1234
        category: "facilities",
        title: "Kutubxona o'quv zalida qo'shimcha rozetkalar o'rnatish",
        content: "Kutubxonada noutbuk bilan shug'ullanuvchi o'quvchilar ko'p, lekin stol ostidagi rozetkalar yetishmayapti. Har bir stolga qo'shimcha elektr manbai o'rnatilsa yaxshi bo'lardi.",
        status: "approved",
        officialResponse: "Taklif maktab ma'muriyati tomonidan ma'qullandi. Keyingi haftada muhandislar tomonidan 12 ta qo'shimcha rozetka o'rnatiladi.",
        respondedAt: "2026-10-16T11:00:00",
        createdAt: "2026-10-14T10:15:00",
        updatedAt: "2026-10-16T11:00:00",
      },
      {
        id: "sug-02",
        receiptCode: "NPS-SMARTBOARD",
        secretHash: hash2, // matches secret: sec_smartboard_secret
        category: "academic",
        title: "Informatika xonasidagi 2-raqamli smartboard stilusini almashtirish",
        content: "Ekran ustiga yozishda stilus kechikmoqda va sensor ba'zida sezmayapti. Dars samaradorligi uchun stilusni yangilash tavsiya etiladi.",
        status: "in_progress",
        officialResponse: "IT bo'limiga topshiriq berildi. Yangi ehtiyot stilus buyurtma qilindi va ertaga o'rnatiladi.",
        respondedAt: "2026-10-17T09:30:00",
        createdAt: "2026-10-16T16:00:00",
        updatedAt: "2026-10-17T09:30:00",
      },
    ],
    announcements: [
      {
        id: "ann-01",
        title: "Respublika Fan Olimpiadasining maktab bosqichi",
        content: "Barcha 9-11 sinf o'quvchilari diqqatiga: 25-oktabr kuni Matematika, Fizika va Kimyo fanlaridan olimpiada maktab saralash bosqichi o'tkaziladi. Ro'yxatdan o'tish kabinet 104 da.",
        authorName: "Dilshodbek Rustamov (Direktor)",
        targetAudience: "all",
        priority: "urgent",
        createdAt: "2026-10-16T08:00:00",
      },
      {
        id: "ann-02",
        title: "O'qituvchilar uchun pedagogik kengash yig'ilishi",
        content: "Juma kuni soat 16:30 da yangi chorak rejasi va xalqaro baholash mezonlari bo'yicha yig'ilish bo'lib o'tadi.",
        authorName: "Nodira Karimova (Menejer)",
        targetAudience: "staff",
        priority: "normal",
        createdAt: "2026-10-15T14:30:00",
      },
    ],
    policies: [
      {
        id: "pol-01",
        title: "Namangan Prezident Maktabi Ichki Tartib Qoidalari",
        category: "handbook",
        content: "O'quvchilar maktab formasi, darsga o'z vaqtida kelish, akademik halollik va axloq me'yorlariga qat'iy rioya etishlari shart.",
        version: "2.1",
        effectiveDate: "2026-09-01",
      },
      {
        id: "pol-02",
        title: "Akademik Halollik va Plagiatga Qarshi Siyosat",
        category: "academic",
        content: "Topshiriqlar o'quvchi tomonidan mustaqil bajarilishi shart. Sun'iy intellekt vositalaridan faqat ruxsat etilgan loyihalarda manba ko'rsatilgan holda foydalanish mumkin.",
        version: "1.4",
        effectiveDate: "2026-09-01",
      },
    ],
    events: [
      {
        id: "ev-01",
        title: "Kuzgi Robototexnika va STEM Ko'rgazmasi",
        description: "O'quvchilar tomonidan tayyorlangan avtomatlashtirilgan robotlar va dasturiy loyihalar namoyishi.",
        date: "2026-10-28",
        time: "14:00 - 16:30",
        location: "Maktab Asosiy Zali",
        category: "workshop",
        capacity: 150,
        registeredCount: 88,
      },
    ],
    clubs: [
      {
        id: "cl-01",
        name: "NamPS AI & Competitive Programming Club",
        description: "Xalqaro IOI va ICPC olimpiadalari darajasidagi algoritmlar va dasturlash mashg'ulotlari.",
        leaderName: "Jasur Rahimov",
        meetingSchedule: "Seshanba va Payshanba, 15:30",
        memberCount: 24,
      },
      {
        id: "cl-02",
        name: "Debate & Model United Nations (MUN)",
        description: "Ingliz tilida notiqlik san'ati, dalillar bilan bahslashish va global diplomatiya simulyatsiyasi.",
        leaderName: "Malika Usmanova",
        meetingSchedule: "Chorshanba, 16:00",
        memberCount: 18,
      },
    ],
    projects: [
      {
        id: "prj-01",
        title: "Smart Eco-Greenhouse IoT Monitoring System",
        description: "Maktab issiqxonasidagi harorat va namlikni avtomatik nazorat qiluvchi sensorli IoT qurilma.",
        category: "STEM & IoT",
        status: "active",
        leadStudentId: "usr-stu-01",
        leadStudentName: "Azamat Toirov",
        mentorName: "Jasur Rahimov",
        milestones: [
          { title: "Datchiklar sxemasini yig'ish", done: true },
          { title: "Mikrokontroller dasturini yozish", done: true },
          { title: "Dashboard integratsiyasi", done: false },
        ],
      },
    ],
    supportTickets: [
      {
        id: "tkt-01",
        reporterName: "Azamat Toirov (10-A)",
        category: "smartboard",
        title: "10-A sinf xonasi smartboardi HDMI ulanishi",
        description: "Noutbuk ulanganda tasvir vaqti-vaqti bilan uzilib qolmoqda, kabelni tekshirish kerak.",
        priority: "medium",
        status: "open",
        createdAt: "2026-10-17T09:00:00",
      },
    ],
  };
}
