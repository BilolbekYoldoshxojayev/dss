import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const policies = await db.getPolicies(category);
    return NextResponse.json({ policies }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }
}
