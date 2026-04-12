const ADMIN_KEY = "sinu_admin_token";
const STUDENT_KEY = "sinu_student_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_KEY);
}

export function getStudentToken(): string | null {
  return localStorage.getItem(STUDENT_KEY);
}

export function setStudentToken(token: string): void {
  localStorage.setItem(STUDENT_KEY, token);
}

export function clearStudentToken(): void {
  localStorage.removeItem(STUDENT_KEY);
}

export function authHeaders(token: string | null): HeadersInit {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
