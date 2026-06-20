/**
 * Client-side password hashing using the Web Crypto API (SHA-256).
 *
 * IMPORTANT: This is a client-side hash for a demo/localStorage-only app.
 * In production, hashing should happen server-side with a proper KDF (bcrypt, argon2).
 */

const encoder = new TextEncoder();

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hex(hash);
}

/**
 * Generate a cryptographically random session token.
 * Used in the auth cookie instead of storing the full user object.
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return hex(bytes.buffer);
}
