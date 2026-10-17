import { NextResponse } from "next/server";
import { badRequest, forbidden, notFound, readJson, withAuth } from "@/lib/authz";
import { db } from "@/db";

export const POST = withAuth(
  async (req, user) => {
    const body = await readJson(req);
    const assignmentId = typeof body.assignmentId === "string" ? body.assignmentId : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!assignmentId || !content) throw badRequest("assignmentId and content are required");
    const assignment = await db.getAssignmentById(assignmentId);
    if (!assignment) throw notFound("Assignment not found");
    if (assignment.classId !== user.classId) throw forbidden();
    // The submitting student is always the logged-in student; a body studentId is ignored.
    const submission = await db.submitAssignment(assignmentId, user.id, content);
    return NextResponse.json({ submission }, { status: 201 });
  },
  { roles: ["student"] }
);
