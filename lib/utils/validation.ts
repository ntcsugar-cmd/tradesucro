/**
 * Validation utilities — shared by every auth and onboarding form so
 * validation rules live in exactly one place.
 */

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function isValidPincode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(value.trim());
}

/** 15-character GSTIN: 2-digit state code, PAN, entity code, Z, checksum. */
export function isValidGSTIN(value: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.trim().toUpperCase());
}

/** 10-character PAN: 5 letters, 4 digits, 1 letter. */
export function isValidPAN(value: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.trim().toUpperCase());
}

/** 21-character Corporate Identification Number. */
export function isValidCIN(value: string): boolean {
  return /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value.trim().toUpperCase());
}

/** 10-character Import Export Code (PAN-based). */
export function isValidIEC(value: string): boolean {
  return /^[A-Z0-9]{10}$/.test(value.trim().toUpperCase());
}

export type PasswordStrengthLabel = "Too weak" | "Weak" | "Fair" | "Strong" | "Very strong";

export interface PasswordStrength {
  /** 0–4 */
  score: number;
  label: PasswordStrengthLabel;
  /** Tailwind color token class, e.g. "bg-danger" */
  colorClass: string;
}

const STRENGTH_META: { label: PasswordStrengthLabel; colorClass: string }[] = [
  { label: "Too weak", colorClass: "bg-danger" },
  { label: "Weak", colorClass: "bg-warning" },
  { label: "Fair", colorClass: "bg-gold" },
  { label: "Strong", colorClass: "bg-success-400" },
  { label: "Very strong", colorClass: "bg-success" },
];

/**
 * getPasswordStrength — a simple, dependency-free heuristic scorer.
 * Not cryptographically rigorous (that's a backend/zxcvbn concern); good
 * enough to give the person real-time feedback while typing.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  const meta = STRENGTH_META[password.length === 0 ? 0 : clamped];
  return { score: password.length === 0 ? 0 : clamped, ...meta };
}

export function isStrongEnough(password: string): boolean {
  return getPasswordStrength(password).score >= 2 && password.length >= 8;
}

/** Generic "is this field filled in" check for required-field validation. */
export function isRequired(value: string | string[] | undefined | null): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}
