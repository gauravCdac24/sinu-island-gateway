import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma.ts";
import { getStudentUploadDir } from "../utils/uploadPaths.ts";
import { signAdminToken, verifyAdminToken } from "../utils/adminToken.ts";
import { isUuid } from "../utils/uuidValidation.ts";
import { studentApplicationAsApiJson, studentApplicationListItem } from "../utils/prismaApiShapes.ts";
import type { IDocumentRef } from "../types/studentApplication.ts";
import { sendSmtpMail } from "../utils/smtpMailer.ts";

const router = Router();

function paramString(p: string | string[] | undefined): string {
  if (p == null) return "";
  return Array.isArray(p) ? (p[0] ?? "") : p;
}

function queryParamString(q: unknown): string {
  if (q == null) return "";
  if (Array.isArray(q)) return String(q[0] ?? "");
  if (typeof q === "string") return q;
  return "";
}

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "sinu_admin").trim();
const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL    || "").trim().toLowerCase();
const ADMIN_PASSWORD =  process.env.ADMIN_PASSWORD || "SINU_Admin2026!";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/admin/login", (req, res) => {
  // Accept either a dedicated `username` field OR an `email` field as the identifier.
  // The frontend sends `identifier`; Postman can also send `username` or `email` directly.
  const raw      = String(req.body?.identifier || req.body?.username || req.body?.email || "").trim();
  const password = String(req.body?.password || "");

  if (!raw || !password) {
    return res.status(400).json({ error: "Username (or email) and password are required." });
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);

  // Match against the appropriate credential
  const identifierOk = isEmail
    ? raw.toLowerCase() === ADMIN_EMAIL
    : raw === ADMIN_USERNAME;

  if (!identifierOk || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid username/email or password." });
  }

  const token = signAdminToken();
  return res.json({ ok: true, token });
});

router.get("/admin/me", adminAuth, (_req, res) => {
  res.json({ ok: true, role: "admin" });
});

router.get("/admin/stats", adminAuth, async (_req, res) => {
  try {
    const apps = await prisma.studentApplication.findMany({
      select: { status: true, programmes: true },
    });

    let pending = 0;
    let approved = 0;
    let rejected = 0;
    const programmeMap = new Map<
      string,
      { programme_code: string; programme_name: string; count: number }
    >();

    for (const a of apps) {
      const s = a.status || "pending";
      if (s === "approved") approved++;
      else if (s === "rejected") rejected++;
      else pending++;

      const progs = a.programmes as { programme_code?: string; programme_name?: string }[] | null;
      const first = Array.isArray(progs) ? progs[0] : undefined;
      if (first?.programme_code) {
        const key = first.programme_code;
        const cur = programmeMap.get(key) || {
          programme_code: first.programme_code,
          programme_name: first.programme_name || key,
          count: 0,
        };
        cur.count += 1;
        programmeMap.set(key, cur);
      }
    }

    const total = apps.length;
    const byProgramme = Array.from(programmeMap.values()).sort((x, y) => y.count - x.count);

    res.json({
      counts: {
        pending,
        approved,
        rejected,
        total,
        registered: total,
      },
      byProgramme,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

router.get("/admin/applications", adminAuth, async (req, res) => {
  try {
    const status = (queryParamString(req.query.status) || "all").toLowerCase().trim();
    const where =
      status === "pending"
        ? { NOT: { status: { in: ["approved", "rejected"] as string[] } } }
        : status === "approved"
          ? { status: "approved" }
          : status === "rejected"
            ? { status: "rejected" }
            : {};

    const list = await prisma.studentApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        programmes: true,
      },
    });

    res.json({ data: list.map(studentApplicationListItem) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list applications" });
  }
});

router.get("/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const doc = await prisma.studentApplication.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ error: "Not found" });
    const { passwordHash: _p, otpCode: _o, otpExpiresAt: _oe, otpAttempts: _oa, ...safe } = doc;
    res.json(studentApplicationAsApiJson(safe));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load application" });
  }
});

router.patch("/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const action = String(req.body?.action || "").toLowerCase();
    const remarks = String(req.body?.remarks || "").trim();

    const doc = await prisma.studentApplication.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (action === "approve") {
      const updated = await prisma.studentApplication.update({
        where: { id },
        data: {
          status: "approved",
          adminRemarks: remarks || null,
          reviewedAt: new Date(),
          mustResetPassword: false,
        },
      });

      const programmes = (
        updated.programmes as { priority: number; programme_name: string; programme_code: string }[]
      )
        .sort((a, b) => a.priority - b.priority)
        .map((p, i) => `  ${i + 1}. ${p.programme_name} (${p.programme_code})`)
        .join("\n");

      const frontendUrl = (
        process.env.PUBLIC_SITE_URL ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173"
      ).replace(/\/$/, "");

      const emailText = `Dear ${updated.fullName},

Congratulations! Your application to the Solomon Islands National University (SINU) has been APPROVED.

━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTED FOR
━━━━━━━━━━━━━━━━━━━━━━━━
${programmes}

━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━
Log in to the Student Portal for enrolment instructions:
${frontendUrl}/student-login

Use the login credentials that were sent to you when you submitted your application.
${remarks ? `\nAdmissions note: ${remarks}\n` : ""}
If you have questions, please contact the SINU Admissions Office.

Kind regards,
Admissions Team
Solomon Islands National University
`;

      const emailSent = await sendSmtpMail({
        to: updated.email,
        subject: "SINU — Your Application Has Been Approved!",
        text: emailText,
      });

      return res.json({
        ok: true,
        status: "approved",
        emailSent,
        message: emailSent
          ? "Applicant approved and notified by email."
          : "Applicant approved. Email notification could not be sent — check SMTP settings.",
      });
    }

    if (action === "reject") {
      const updated = await prisma.studentApplication.update({
        where: { id },
        data: {
          status: "rejected",
          adminRemarks: remarks || null,
          reviewedAt: new Date(),
        },
      });

      const emailText = `Dear ${updated.fullName},

Thank you for your interest in the Solomon Islands National University (SINU).

After careful review, we regret to inform you that your application has not been successful at this time.
${remarks ? `\nAdmissions feedback: ${remarks}\n` : ""}
We encourage you to contact our Admissions Office for guidance on future applications.

Kind regards,
Admissions Team
Solomon Islands National University
`;

      const emailSent = await sendSmtpMail({
        to: updated.email,
        subject: "SINU — Application Status Update",
        text: emailText,
      });

      return res.json({
        ok: true,
        status: "rejected",
        emailSent,
        message: emailSent
          ? "Applicant rejected and notified by email."
          : "Applicant rejected. Email notification could not be sent — check SMTP settings.",
      });
    }

    return res.status(400).json({ error: "action must be approve or reject" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.get("/admin/files/:applicationId/:storedFileName", adminAuth, async (req, res) => {
  try {
    const applicationId = paramString(req.params.applicationId);
    const storedFileName = paramString(req.params.storedFileName);
    if (!isUuid(applicationId)) {
      return res.status(400).send("Invalid id");
    }
    const decoded = decodeURIComponent(storedFileName);
    if (decoded.includes("..") || path.isAbsolute(decoded)) {
      return res.status(400).send("Invalid file name");
    }
    const appRow = await prisma.studentApplication.findUnique({
      where: { id: applicationId },
      select: { documents: true },
    });
    if (!appRow) return res.status(404).send("Not found");
    const docs = appRow.documents as unknown;
    const list = Array.isArray(docs) ? (docs as IDocumentRef[]) : [];
    const allowed = list.some((d) => d.storedFileName === decoded);
    if (!allowed) return res.status(403).send("Forbidden");

    const full = path.join(getStudentUploadDir(), decoded);
    if (!fs.existsSync(full)) return res.status(404).send("File missing");
    res.sendFile(path.resolve(full));
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
});

export default router;
