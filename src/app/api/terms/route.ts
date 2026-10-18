import { NextResponse } from "next/server";
import { readJson, withAuth } from "@/lib/authz";
import { createTerm } from "@/db/admin";
import { db } from "@/db";

export const GET = withAuth(async () => NextResponse.json({ terms: await db.getTerms() }));

export const POST = withAuth(
  async (req, user) => {
    const b = await readJson(req);
    const term = await createTerm({ name: String(b.name ?? ""), startDate: String(b.startDate ?? ""), endDate: String(b.endDate ?? "") }, user.id);
    return NextResponse.json({ term }, { status: 201 });
  },
  { roles: ["admin"] }
);
