import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserSession, UserRole } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "namps-jwt-development-secret-key-32-chars-long";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(session: UserSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export function isAuthorized(currentRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (currentRole === "director") return true; // Director has school-wide oversight
  return allowedRoles.includes(currentRole);
}

export function canReviewAnonymousSuggestions(role: UserRole): boolean {
  return role === "director" || role === "manager";
}
