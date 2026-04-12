import { Router } from "express";
import StudentApplication from "../models/StudentApplication.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { signStudentToken, verifyStudentToken } from "../utils/adminToken.ts";
import { generateResetToken, hashResetToken } from "../utils/resetPasswordToken.ts";
import { sendSmtpMail } from "../utils/smtpMailer.ts";

const router = Router();

const RESET_WINDOW_MS = 15 * 60 * 1000;
const MIN_PASSWORD_LEN = 8;

function frontendBaseUrl(): string {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

router.post("/student/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const app = await StudentApplication.findOne({ email }).exec();
    if (!app || app.status !== "approved" || !app.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await verifyPassword(password, app.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signStudentToken(String(app._id), app.email);
    return res.json({
      ok: true,
      token,
      mustResetPassword: Boolean(app.mustResetPassword),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Login failed" });
  }
});

/** Request reset link (only for approved students with a portal password). */
router.post("/student/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const app = await StudentApplication.findOne({
      email,
      status: "approved",
      passwordHash: { $exists: true, $ne: null },
    }).exec();

    const generic =
      "If that email is registered for the student portal, we sent a password reset link.";

    if (!app) {
      return res.json({ ok: true, message: generic });
    }

    const rawToken = generateResetToken();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_WINDOW_MS);

    app.passwordResetTokenHash = tokenHash;
    app.passwordResetExpiresAt = expiresAt;
    await app.save();

    const resetUrl = `${frontendBaseUrl()}/student-reset-password?token=${encodeURIComponent(rawToken)}`;
    const text = `Dear ${app.fullName},

You requested a password reset for the SINU student portal.

Open this link within 15 minutes to choose a new password:
${resetUrl}

If you did not request this, you can ignore this email.

Kind regards,
SINU`;

    const sent = await sendSmtpMail({
      to: app.email,
      subject: "SINU — Reset your student portal password",
      text,
    });

    if (!sent) {
      app.passwordResetTokenHash = undefined;
      app.passwordResetExpiresAt = undefined;
      await app.save();
      console.warn(
        `[student/forgot-password] SMTP failed; reset link not emailed. Dev URL: ${resetUrl}`
      );
      return res.status(503).json({
        error:
          "Email could not be sent. Check server mail settings or try again later.",
      });
    }

    return res.json({ ok: true, message: generic });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Request failed" });
  }
});

/** Returns 404 if token is missing, invalid, or expired (treat as “page not found”). */
router.get("/student/reset-password/status", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) {
      return res.status(404).send("Not found");
    }

    const tokenHash = hashResetToken(token);
    const app = await StudentApplication.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).exec();

    if (!app) {
      return res.status(404).send("Not found");
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
});

/** Apply new password using a valid reset token. */
router.post("/student/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");
    if (!token) {
      return res.status(404).json({ error: "Not found" });
    }
    if (newPassword.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LEN} characters`,
      });
    }

    const tokenHash = hashResetToken(token);
    const app = await StudentApplication.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).exec();

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    app.passwordHash = await hashPassword(newPassword);
    app.mustResetPassword = false;
    app.passwordResetTokenHash = undefined;
    app.passwordResetExpiresAt = undefined;
    await app.save();

    return res.json({ ok: true, message: "Your password has been updated." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

router.get("/student/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    const v = verifyStudentToken(token);
    if (!v.ok || !v.applicationId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const app = await StudentApplication.findById(v.applicationId)
      .select("-passwordHash")
      .lean();
    if (!app) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true, application: app });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
