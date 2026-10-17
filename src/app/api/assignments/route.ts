import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeLevel = searchParams.get("gradeLevel");
    const section = searchParams.get("section");
    const teacherId = searchParams.get("teacherId");

    const assignments = await db.getAssignments(
      gradeLevel ? parseInt(gradeLevel) : undefined,
      section || undefined,
      teacherId || undefined
    );

    return NextResponse.json({ assignments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const assignment = await db.createAssignment(body);
    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
