import { NextResponse } from "next/server";
import { withAuth } from "@/lib/authz";
import { db } from "@/db";

export const GET = withAuth(async () => NextResponse.json({ terms: await db.getTerms() }));
