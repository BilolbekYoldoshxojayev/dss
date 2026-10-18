import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";
import { HttpError } from "@/lib/authz";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// extension -> content type served on download. Anything else is rejected.
const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  txt: "text/plain; charset=utf-8",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};
export const ALLOWED_EXTENSIONS = Object.keys(TYPES);

function supabaseStorageConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (url && key) {
    return {
      url: url.replace(/\/$/, ""),
      key,
      bucket: process.env.SUPABASE_STORAGE_BUCKET || "homework-attachments",
    };
  }
  return null;
}

export function uploadDir(): string {
  if (process.env.UPLOAD_DIR) return path.resolve(process.env.UPLOAD_DIR);
  if (process.env.VERCEL) return path.join(os.tmpdir(), "namps-uploads");
  return path.resolve(path.join(process.cwd(), ".data", "uploads"));
}

function extensionOf(name: string): string {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

/** Does the content really look like the type its extension claims? */
function matchesMagic(ext: string, b: Buffer): boolean {
  const starts = (...bytes: number[]) => bytes.every((v, i) => b[i] === v);
  switch (ext) {
    case "pdf": return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
    case "png": return starts(0x89, 0x50, 0x4e, 0x47);
    case "jpg":
    case "jpeg": return starts(0xff, 0xd8, 0xff);
    case "docx":
    case "xlsx":
    case "pptx": return starts(0x50, 0x4b, 0x03, 0x04);
    case "txt": return !b.includes(0);
    default: return false;
  }
}

function safeDisplayName(name: string): string {
  return name.replace(/[^\w.\- ]+/g, "_").slice(-120) || "file";
}

export async function saveUpload(file: File): Promise<{ stored: string; displayName: string }> {
  if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, "File is larger than 5 MB");
  const ext = extensionOf(file.name);
  if (!TYPES[ext]) throw new HttpError(400, `File type not allowed (allowed: ${ALLOWED_EXTENSIONS.join(", ")})`);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES || !matchesMagic(ext, bytes)) {
    throw new HttpError(400, "File content does not match its type");
  }

  const stored = `${crypto.randomUUID()}.${ext}`;
  const cfg = supabaseStorageConfig();

  if (cfg) {
    const uploadUrl = `${cfg.url}/storage/v1/object/${cfg.bucket}/${stored}`;
    let res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "x-upsert": "true",
      },
      body: bytes,
    });

    // If bucket doesn't exist, auto-create private bucket and retry once
    if (res.status === 404 || res.status === 400) {
      await fetch(`${cfg.url}/storage/v1/bucket`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: cfg.bucket, name: cfg.bucket, public: false }),
      });
      res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.key}`,
          "Content-Type": TYPES[ext] || "application/octet-stream",
          "x-upsert": "true",
        },
        body: bytes,
      });
    }

    if (!res.ok) {
      throw new HttpError(500, `Failed to upload to Supabase Storage: ${res.statusText}`);
    }
  } else {
    await fs.mkdir(uploadDir(), { recursive: true });
    await fs.writeFile(path.join(uploadDir(), stored), bytes, { flag: "wx" });
  }

  return { stored, displayName: safeDisplayName(file.name) };
}

/** Only ever resolves names we generated (uuid.ext), so a stored value can't escape UPLOAD_DIR. */
function resolveStored(stored: string): string {
  if (!/^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/.test(stored)) throw new HttpError(404, "File not found");
  return path.join(uploadDir(), stored);
}

export async function readUpload(stored: string): Promise<{ bytes: Buffer; contentType: string }> {
  const cfg = supabaseStorageConfig();
  if (cfg) {
    try {
      const res = await fetch(`${cfg.url}/storage/v1/object/authenticated/${cfg.bucket}/${stored}`, {
        headers: { Authorization: `Bearer ${cfg.key}` },
      });
      if (!res.ok) throw new HttpError(404, "File not found");
      const bytes = Buffer.from(await res.arrayBuffer());
      return { bytes, contentType: TYPES[extensionOf(stored)] ?? "application/octet-stream" };
    } catch (e) {
      if (e instanceof HttpError) throw e;
      throw new HttpError(404, "File not found");
    }
  }

  try {
    return { bytes: await fs.readFile(resolveStored(stored)), contentType: TYPES[extensionOf(stored)] ?? "application/octet-stream" };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(404, "File not found");
  }
}

export async function deleteUpload(stored: string | null | undefined): Promise<void> {
  if (!stored) return;
  const cfg = supabaseStorageConfig();
  if (cfg) {
    await fetch(`${cfg.url}/storage/v1/object/${cfg.bucket}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [stored] }),
    });
    return;
  }
  await fs.rm(resolveStored(stored), { force: true });
}

