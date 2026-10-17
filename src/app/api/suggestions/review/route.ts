import { NextResponse } from "next/server";
import { db } from "@/db";
import { UserRole } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get("role") || "student") as UserRole;

    if (role !== "director" && role !== "manager") {
      return NextResponse.json(
        { error: "Access denied. Only Director and Manager can review suggestions." },
        { status: 403 }
      );
    }

    const suggestions = await db.getAllAnonymousSuggestions(role);
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load suggestions" }, { status: 500 });
  }
}
