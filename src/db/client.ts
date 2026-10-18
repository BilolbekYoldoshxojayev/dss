import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite, PgliteDatabase } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "@/lib/env";

export type Db = PgliteDatabase<typeof schema>;

const g = globalThis as unknown as { __nampsDb?: { url: string; db: Db; kind: "pglite" | "pg" } };

const migrationsFolder = path.join(process.cwd(), "drizzle");

/**
 * DATABASE_URL:
 *   postgres://...        -> node-postgres (production)
 *   memory://             -> in-memory PGlite (tests)
 *   pglite:<directory>    -> file-backed PGlite (local dev, no Docker needed)
 * Lazy singleton: nothing connects at import time.
 */
export function getDb(): Db {
  const url = env.databaseUrl();
  if (g.__nampsDb && g.__nampsDb.url === url) return g.__nampsDb.db;

  let db: Db;
  let kind: "pglite" | "pg";
  if (/^postgres(ql)?:\/\//.test(url)) {
    const isSsl =
      url.includes("sslmode=") ||
      url.includes("supabase.co") ||
      url.includes("supabase.com") ||
      url.includes("neon.tech");
    // Strip sslmode query param so pg doesn't force rejectUnauthorized: true
    const cleanUrl = url.replace(/([?&])sslmode=[^&]+(&|$)/, (_, p1, p2) => (p2 ? p1 : "")).replace(/\?$/, "");
    const pool = new Pool({
      connectionString: cleanUrl,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      max: process.env.VERCEL ? 1 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    db = drizzlePg(pool, { schema }) as unknown as Db;
    kind = "pg";
  } else if (url === "memory://") {
    db = drizzlePglite(new PGlite(), { schema });
    kind = "pglite";
  } else if (url.startsWith("pglite:")) {
    db = drizzlePglite(new PGlite(url.slice("pglite:".length)), { schema });
    kind = "pglite";
  } else {
    throw new Error("DATABASE_URL must start with postgres://, pglite: or be memory://");
  }
  g.__nampsDb = { url, db, kind };
  return db;
}

export async function runMigrations(): Promise<void> {
  const db = getDb();
  if (g.__nampsDb!.kind === "pg") {
    await migratePg(db as never, { migrationsFolder });
  } else {
    await migratePglite(db, { migrationsFolder });
  }
}
