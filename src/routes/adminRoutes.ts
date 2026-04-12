import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
// import nodemailer from "nodemailer"; // TESTING: SMTP disabled — uncomment for production email
import mongoose from "mongoose";
import StudentApplication from "../models/StudentApplication.ts";
import { getStudentUploadDir } from "../utils/uploadPaths.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import {
  signAdminToken,
  verifyAdminToken,
  signStudentToken,
} from "../utils/adminToken.ts";

const router = Router();

/** Express may type params as `string | string[]`; normalize for Mongoose and path helpers. */
function paramString(p: string | string[] | undefined): string {
  if (p == null) return "";
  return Array.isArray(p) ? (p[0] ?? "") : p;
}

/** `req.query` values can be `string | string[]` (or parsed objects); always take a single string. */
function queryParamString(q: unknown): string {
  if (q == null) return "";
  if (Array.isArray(q)) return String(q[0] ?? "");
  if (typeof q === "string") return q;
  return "";
}

/** Hardcoded admin portal credentials (as requested). Change via env in production if needed. */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "sinu_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SINU_Admin2026!";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* TESTING: SMTP disabled — restore getMailer + nodemailer import for production
function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost";
  if (!host || !user || !pass) return null;
  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user, pass },
    }),
    from,
  };
}
*/

router.post("/admin/login", (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  const token = signAdminToken();
  return res.json({ ok: true, token });
});

router.get("/admin/me", adminAuth, (_req, res) => {
  res.json({ ok: true, role: "admin" });
});

router.get("/admin/stats", adminAuth, async (_req, res) => {
  try {
    const apps = await StudentApplication.find().lean();
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    const programmeMap = new Map<string, { programme_code: string; programme_name: string; count: number }>();

    for (const a of apps) {
      const s = a.status || "pending";
      if (s === "approved") approved++;
      else if (s === "rejected") rejected++;
      else pending++;

      const first = a.programmes?.[0];
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

    const byProgramme = Array.from(programmeMap.values()).sort((x, y) => y.count - x.count);

    res.json({
      counts: {
        pending,
        approved,
        rejected,
        total: apps.length,
        registered: apps.length,
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
    let query: Record<string, unknown> = {};
    if (status === "pending") {
      // Anything not explicitly approved/rejected (includes missing status on legacy docs)
      query = { status: { $nin: ["approved", "rejected"] } };
    } else if (status === "approved") {
      query = { status: "approved" };
    } else if (status === "rejected") {
      query = { status: "rejected" };
    }

    const list = await StudentApplication.find(query)
      .sort({ createdAt: -1 })
      // Do not mix `programmes` with `programmes.*` — MongoDB rejects that projection (path collision).
      .select("fullName email phone status createdAt programmes")
      .lean();

    res.json({ data: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list applications" });
  }
});

router.get("/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const doc = await StudentApplication.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    const safe = { ...doc, passwordHash: undefined };
    res.json(safe);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load application" });
  }
});

router.patch("/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const action = String(req.body?.action || "").toLowerCase();
    const remarks = String(req.body?.remarks || "").trim();

    const doc = await StudentApplication.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (action === "approve") {
      // TESTING: fixed password — restore generateRandomPassword(14) for production
      const plainPassword = "12345";
      const passwordHash = await hashPassword(plainPassword);
      doc.status = "approved";
      doc.adminRemarks = remarks || undefined;
      doc.reviewedAt = new Date();
      doc.passwordHash = passwordHash;
      doc.mustResetPassword = false; // TESTING: set true when using random passwords + email again
      await doc.save();

      /* TESTING: SMTP disabled — restore getMailer() + mail/to before this block for production
      const mail = getMailer();
      const to = doc.email;
      if (mail) {
        const text = `Dear ${doc.fullName},

Congratulations! Your application to the Solomon Islands National University (SINU) has been approved.

Your student portal account has been created:
  Email: ${to}
  Temporary password: ${plainPassword}

Please sign in at the student login page, then change your password when prompted.

Student portal: ${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/student-login

We look forward to welcoming you.

Kind regards,
SINU Admissions`;

        try {
          await mail.transporter.sendMail({
            from: mail.from,
            to,
            subject: "SINU — Application approved & portal access",
            text,
          });
        } catch (err) {
          console.error("Approve email failed:", err);
        }
      } else {
        console.warn("SMTP not configured; skipping approval email.");
      }
      */

      return res.json({
        ok: true,
        status: "approved",
        message: "Applicant approved (TESTING: password is 12345; SMTP off).",
      });
    }

    if (action === "reject") {
      doc.status = "rejected";
      doc.adminRemarks = remarks || undefined;
      doc.reviewedAt = new Date();
      await doc.save();

      /* TESTING: SMTP disabled — restore getMailer() + mail/to above this block for production
      const mail = getMailer();
      const to = doc.email;
      if (mail) {
        const text = `Dear ${doc.fullName},

We regret to inform you that your online application to SINU was not successful at this stage.

${remarks ? `Remarks: ${remarks}\n\n` : ""}You have one week to review this notice. If you wish to pursue admission, you may submit a physical application and supporting documents at the SINU Student Academic Services (SAS) office.

For questions, contact SAS during office hours.

Kind regards,
SINU Admissions`;

        try {
          await mail.transporter.sendMail({
            from: mail.from,
            to,
            subject: "SINU — Application outcome",
            text,
          });
        } catch (err) {
          console.error("Reject email failed:", err);
        }
      }
      */

      return res.json({
        ok: true,
        status: "rejected",
        message: "Applicant rejected (TESTING: SMTP off).",
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
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).send("Invalid id");
    }
    const decoded = decodeURIComponent(storedFileName);
    if (decoded.includes("..") || path.isAbsolute(decoded)) {
      return res.status(400).send("Invalid file name");
    }
    const app = await StudentApplication.findById(applicationId).lean();
    if (!app) return res.status(404).send("Not found");
    const allowed = app.documents?.some((d) => d.storedFileName === decoded);
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
