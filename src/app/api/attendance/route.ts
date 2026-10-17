import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const slotId = searchParams.get("slotId");
    const date = searchParams.get("date");

    if (studentId) {
      const records = await db.getAttendanceForStudent(studentId);
      return NextResponse.json({ records }, { status: 200 });
    }

    if (slotId && date) {
      const records = await db.getAttendanceForSlotAndDate(slotId, date);
      return NextResponse.json({ records }, { status: 200 });
    }

    return NextResponse.json({ records: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { records } = body;

    if (!Array.isArray(records)) {
      return NextResponse.json({ error: "Records array required" }, { status: 400 });
    }

    await db.markAttendance(records);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}
