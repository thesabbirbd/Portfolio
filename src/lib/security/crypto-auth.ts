import { createHmac, createHash, randomBytes } from "node:crypto";

const DEFAULT_SECRET = process.env.AUTH_SECRET || "sabbir-os-enterprise-secret-key-2026";

/**
 * Hash password or PIN using SHA-256 with optional salt.
 */
export function hashPassword(password: string, salt: string = "the-sabbir-os-salt"): string {
  return createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");
}

/**
 * Verify plaintext password/PIN against hashed string.
 */
export function verifyPassword(password: string, hash: string, salt: string = "the-sabbir-os-salt"): boolean {
  const calculated = hashPassword(password, salt);
  return calculated === hash;
}

/**
 * Generate a URL-safe random alphanumeric token (e.g. 10 characters for 24h shares).
 */
export function generateEphemeralToken(length: number = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // Base32-like (unambiguous, no 0/O, 1/l)
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * Sign payload into an HMAC-SHA256 authenticated token string.
 */
export function signHmacToken(payload: Record<string, unknown>, secret: string = DEFAULT_SECRET): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verify and parse HMAC-SHA256 authenticated token.
 */
export function verifyHmacToken<T = Record<string, unknown>>(token: string, secret: string = DEFAULT_SECRET): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSignature = createHmac("sha256", secret).update(data).digest("base64url");
    if (signature !== expectedSignature) return null;

    const jsonStr = Buffer.from(data, "base64url").toString("utf8");
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

/**
 * Hash an IP address for privacy in threat logging (OWASP/GDPR compliant).
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`ip-salt:${ip}`).digest("hex").slice(0, 16);
}
