import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, title, content } = body;

    if (!category || !title || !content) {
      return NextResponse.json(
        { error: "Category, title, and content are required." },
        { status: 400 }
      );
    }

    if (title.trim().length < 3 || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters and content at least 10 characters." },
        { status: 400 }
      );
    }

    // Submit anonymously: ZERO user identity, zero IP address, zero cookie linkage
    const result = await db.submitAnonymousSuggestion(category, title.trim(), content.trim());

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit anonymous suggestion." },
      { status: 500 }
    );
  }
}
