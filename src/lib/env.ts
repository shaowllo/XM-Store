/**
 * Environment variable validation and access.
 *
 * Validates required environment variables at module load time and
 * provides typed access with sensible defaults.
 */

const requiredVars = [
  "ARAMEX_ACCOUNT_NUMBER",
  "ARAMEX_USERNAME",
  "ARAMEX_PASSWORD",
] as const;

const optionalVars = {
  ARAMEX_API_BASE: "https://api.aramex.com/shipping/v1",
} as const;

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(
      `[env] Missing ${key} — Aramex shipping features will fail at runtime. ` +
        `Set it in .env.local or your deployment environment.`
    );
    return "";
  }
  return value;
}

/** Aramex API base URL (defaults to production). */
export const ARAMEX_API_BASE = process.env.ARAMEX_API_BASE || optionalVars.ARAMEX_API_BASE;

/** Aramex account number — required for shipping operations. */
export const ARAMEX_ACCOUNT_NUMBER = getEnvVar("ARAMEX_ACCOUNT_NUMBER");

/** Aramex API username — required for shipping operations. */
export const ARAMEX_USERNAME = getEnvVar("ARAMEX_USERNAME");

/** Aramex API password — required for shipping operations. */
export const ARAMEX_PASSWORD = getEnvVar("ARAMEX_PASSWORD");

/**
 * Check if all required shipping env vars are configured.
 * Useful for conditionally enabling shipping features.
 */
export function isShippingConfigured(): boolean {
  return Boolean(ARAMEX_ACCOUNT_NUMBER && ARAMEX_USERNAME && ARAMEX_PASSWORD);
}
