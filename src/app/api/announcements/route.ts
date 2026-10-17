import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience") as any;
    const announcements = await db.getAnnouncements(audience);
    return NextResponse.json({ announcements }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ann = await db.createAnnouncement(body);
    return NextResponse.json({ announcement: ann }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
