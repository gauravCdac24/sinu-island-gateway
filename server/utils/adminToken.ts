import crypto from "crypto";

const secret = () => process.env.ADMIN_JWT_SECRET || "sinu-admin-dev-secret-change-in-production";

export type AuthRole = "admin" | "hr";

export function signRoleToken(role: AuthRole): string {
  const exp = Date.now() + 8 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ role, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function signAdminToken(): string {
  return signRoleToken("admin");
}

export function signHrToken(): string {
  return signRoleToken("hr");
}

function verifyRoleToken(token: string | undefined, expectedRole: AuthRole): boolean {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (sig !== expected) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp: number;
      role: string;
    };
    return data.role === expectedRole && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyAdminToken(token: string | undefined): boolean {
  return verifyRoleToken(token, "admin");
}

export function verifyHrToken(token: string | undefined): boolean {
  return verifyRoleToken(token, "hr");
}

export function signStudentToken(applicationId: string, email: string): string {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(
    JSON.stringify({ role: "student", applicationId, email, exp })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyStudentToken(token: string | undefined): {
  ok: boolean;
  applicationId?: string;
  email?: string;
} {
  if (!token || !token.includes(".")) return { ok: false };
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { ok: false };
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (sig !== expected) return { ok: false };
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp: number;
      role: string;
      applicationId: string;
      email: string;
    };
    if (data.role !== "student" || data.exp <= Date.now()) return { ok: false };
    return { ok: true, applicationId: data.applicationId, email: data.email };
  } catch {
    return { ok: false };
  }
}
