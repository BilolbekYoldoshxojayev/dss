import { NextResponse } from "next/server";
import { db } from "@/db";
import { UserRole, SuggestionStatus } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, status, officialResponse, role } = body;

    if (!id || !status || !role) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    if (role !== "director" && role !== "manager") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const updated = await db.updateAnonymousSuggestionStatus(
      id,
      status as SuggestionStatus,
      officialResponse,
      role as UserRole
    );

    return NextResponse.json({ suggestion: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update suggestion" }, { status: 500 });
  }
}
