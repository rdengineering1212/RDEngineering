import { prisma } from "./prisma";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

interface JWTPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export function createToken(payload: Omit<JWTPayload, "exp">): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url"
  );
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function validateCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return false;
    
    // Check if stored password has salt:hash format
    if (admin.password.includes(":")) {
      const [salt, storedHash] = admin.password.split(":");
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      return storedHash === hash;
    }
    
    // Fallback for legacy unsalted hashes if any
    const hash = crypto
      .pbkdf2Sync(password, admin.password.slice(0, 29), 10000, 64, "sha512")
      .toString("hex");
    return admin.password === hash;
  } catch {
    // Fallback for when admin not seeded yet - use env vars
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD_HASH;
    if (username === adminUser && password === adminPass) return true;
    return false;
  }
}

export async function getAdminFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true, email: true, role: true },
    });
    return admin;
  } catch {
    return { id: payload.id, username: payload.username, role: payload.role };
  }
}
