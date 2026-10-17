import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const events = await db.getEvents();
    const clubs = await db.getClubs();
    const projects = await db.getProjects();
    return NextResponse.json({ events, clubs, projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events and activities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId } = body;
    const event = await db.registerForEvent(eventId);
    return NextResponse.json({ event }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 400 });
  }
}
