import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST() {
  try {
    db.resetDemoData();
    return NextResponse.json({ success: true, message: "Demo data reset successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset demo data" }, { status: 500 });
  }
}
