import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { submissionId, grade, feedback } = body;

    if (!submissionId || grade === undefined) {
      return NextResponse.json({ error: "Missing submissionId or grade" }, { status: 400 });
    }

    const updated = await db.gradeSubmission(submissionId, parseInt(grade), feedback || "");
    return NextResponse.json({ submission: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to grade submission" }, { status: 500 });
  }
}
