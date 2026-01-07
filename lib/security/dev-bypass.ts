/**
 * Security Utility: Centralized DEV_BYPASS check
 *
 * Ensures that development bypasses are strictly limited to non-production environments.
 * Prevents accidental exposure of test backdoors in production.
 */
export function isDevBypass(value: string | undefined | null): boolean {
  // ⛔️ STRICT SECURITY GATE: Never allow bypass in production
  // We explicitly check for 'development' or 'test'.
  // Any other environment (production, staging, etc.) will return false immediately.
  const isSafeEnv = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (!isSafeEnv) {
    return false;
  }

  if (!value) {
    return false;
  }

  // Allow standard bypass strings used in tests
  const allowedBypassValues = [
    'DEV_BYPASS',
    'DEV_BYPASS@example.com'
  ];

  return allowedBypassValues.includes(value);
}
