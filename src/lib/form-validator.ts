export type ValidationErrorType =
  | { type: "too-long-text"; maxLength: number }
  | { type: "invalid-email" }
  | { type: "invalid-url" }
  | { type: "bad-array-length"; minLength: number; maxLength: number };

const EMAIL_REGEXP =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

const URL_REGEXP = /^https?:\/\//;

export function maxLengthValidator(
  v: string,
  n: number
): ValidationErrorType | null {
  return v && v.length > n ? { type: "too-long-text", maxLength: n } : null;
}

export function emaiValidator(v: string): ValidationErrorType | null {
  return v && !EMAIL_REGEXP.test(v) ? { type: "invalid-email" } : null;
}

export function urlValidator(v: string): ValidationErrorType | null {
  return v && !URL_REGEXP.test(v) ? { type: "invalid-url" } : null;
}
