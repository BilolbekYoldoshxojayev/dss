import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { receiptCode, secretToken } = body;

    if (!receiptCode || !secretToken) {
      return NextResponse.json(
        { error: "Both receiptCode and secretToken are required." },
        { status: 400 }
      );
    }

    const suggestion = await db.getAnonymousSuggestionByReceipt(receiptCode, secretToken);

    if (!suggestion) {
      return NextResponse.json(
        { error: "Invalid receipt code or secret token. Access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ suggestion }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify suggestion receipt." },
      { status: 500 }
    );
  }
}
