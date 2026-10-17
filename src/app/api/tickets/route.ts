import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const tickets = await db.getSupportTickets();
    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = await db.createSupportTicket(body);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const ticket = await db.updateSupportTicketStatus(id, status);
    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update ticket" }, { status: 500 });
  }
}
