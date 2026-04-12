/** Digits only — used to compare phone numbers across formatting differences. */
export function normalizePhoneDigits(s: string): string {
  return String(s || "").replace(/\D/g, "");
}
