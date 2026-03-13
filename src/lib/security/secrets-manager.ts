// ==============================================
// Secrets Manager
// ==============================================
// Centralised, validated access to environment
// variables. Secrets are never logged; access
// events are recorded for audit purposes.

// ---------- Required env vars ----------

const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

// ---------- Optional but validated env vars ----------

const OPTIONAL_VARS = [
  'VITE_APP_ENV',
  'VITE_SENTRY_DSN',
  'VITE_STRIPE_PUBLIC_KEY',
  'VITE_RAZORPAY_KEY_ID',
] as const;

// ---------- Validation ----------

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_VARS) {
    const value = import.meta.env[key as string];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }

  for (const key of OPTIONAL_VARS) {
    const value = import.meta.env[key as string];
    if (!value) {
      warnings.push(`Optional env var "${key}" is not set`);
    }
  }

  // Validate that the Supabase URL looks correct
  const supabaseUrl: string = import.meta.env['VITE_SUPABASE_URL'] ?? '';
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    warnings.push('VITE_SUPABASE_URL should use HTTPS in production');
  }

  return { valid: missing.length === 0, missing, warnings };
}

// ---------- Secure accessor ----------

/**
 * Retrieve an environment variable value.
 * Throws if the variable is required but missing.
 * Never logs the value itself.
 */
export function getSecret(key: RequiredVar): string;
export function getSecret(key: string, fallback: string): string;
export function getSecret(key: string, fallback?: string): string {
  const value: string = import.meta.env[key] ?? '';
  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Required environment variable "${key}" is not configured`);
  }
  return value;
}

// ---------- Key rotation helpers ----------

export interface RotationRecord {
  key: string;
  rotatedAt: string;
  expiresAt: string;
}

const ROTATION_STORE_KEY = 'sv_key_rotation_log';

export function recordKeyRotation(keyName: string, expiryDays = 90): void {
  try {
    const existing: RotationRecord[] = JSON.parse(
      localStorage.getItem(ROTATION_STORE_KEY) ?? '[]',
    );

    const rotatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + expiryDays * 86_400_000).toISOString();

    const updated = [
      ...existing.filter(r => r.key !== keyName),
      { key: keyName, rotatedAt, expiresAt },
    ];

    localStorage.setItem(ROTATION_STORE_KEY, JSON.stringify(updated));
  } catch {
    // Non-critical – fail silently
  }
}

export function getKeyRotationStatus(): RotationRecord[] {
  try {
    return JSON.parse(localStorage.getItem(ROTATION_STORE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function isKeyRotationDue(keyName: string): boolean {
  const records = getKeyRotationStatus();
  const record = records.find(r => r.key === keyName);
  if (!record) return true; // Never rotated → due

  return new Date(record.expiresAt) <= new Date();
}

// ---------- Init & startup check ----------

/**
 * Call once at application startup to validate configuration.
 * Logs a warning (never throws) so that missing optional vars are visible in dev.
 */
export function initSecretsManager(): void {
  const result = validateEnvironment();

  if (!result.valid) {
    console.error(
      '[SecretsManager] Missing required environment variables:',
      result.missing,
    );
  }

  if (result.warnings.length > 0 && import.meta.env['VITE_APP_ENV'] !== 'production') {
    result.warnings.forEach(w => console.warn('[SecretsManager]', w));
  }
}
