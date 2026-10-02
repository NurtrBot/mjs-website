import { createHmac, timingSafeEqual } from "crypto";

// Password reset links are signed tokens: <customerId>.<expiresAt>.<signature>
// The signature covers the customer's date_modified, so a token stops working
// as soon as the password (or anything else on the record) changes — single use
// without needing a database.

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function secret(): string {
  return process.env.PASSWORD_RESET_SECRET || process.env.BIGCOMMERCE_CLIENT_SECRET || process.env.BIGCOMMERCE_ACCESS_TOKEN || "";
}

function sign(customerId: number, expiresAt: number, dateModified: string): string {
  return createHmac("sha256", secret()).update(`pw-reset:${customerId}:${expiresAt}:${dateModified}`).digest("hex");
}

export function createResetToken(customerId: number, dateModified: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  return `${customerId}.${expiresAt}.${sign(customerId, expiresAt, dateModified)}`;
}

export function parseResetToken(token: string): { customerId: number; expiresAt: number; sig: string } | null {
  const parts = (token || "").split(".");
  if (parts.length !== 3) return null;
  const customerId = Number(parts[0]);
  const expiresAt = Number(parts[1]);
  if (!customerId || !expiresAt || !/^[0-9a-f]{64}$/.test(parts[2])) return null;
  return { customerId, expiresAt, sig: parts[2] };
}

export function verifyResetToken(token: string, dateModified: string): { ok: true; customerId: number } | { ok: false; reason: "invalid" | "expired" } {
  const parsed = parseResetToken(token);
  if (!parsed) return { ok: false, reason: "invalid" };
  if (Date.now() > parsed.expiresAt) return { ok: false, reason: "expired" };
  const expected = Buffer.from(sign(parsed.customerId, parsed.expiresAt, dateModified));
  const given = Buffer.from(parsed.sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  return { ok: true, customerId: parsed.customerId };
}
