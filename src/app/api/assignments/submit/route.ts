import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assignmentId, studentId, studentName, content } = body;

    if (!assignmentId || !studentId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = await db.submitAssignment(assignmentId, studentId, studentName || "Student", content);
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}
