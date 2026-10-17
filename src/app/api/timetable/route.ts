import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeLevel = searchParams.get("gradeLevel");
    const section = searchParams.get("section");
    const teacherName = searchParams.get("teacherName");

    if (gradeLevel && section) {
      const slots = await db.getTimetableForStudent(parseInt(gradeLevel), section);
      return NextResponse.json({ slots }, { status: 200 });
    }

    if (teacherName) {
      const slots = await db.getTimetableForTeacher(teacherName);
      return NextResponse.json({ slots }, { status: 200 });
    }

    const slots = await db.getAllTimetableSlots();
    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}
