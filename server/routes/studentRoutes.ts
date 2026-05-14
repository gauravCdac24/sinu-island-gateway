import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma.ts";
import { verifyPassword } from "../utils/password.ts";
import { signStudentToken, verifyStudentToken } from "../utils/adminToken.ts";
import { generateResetToken, hashResetToken } from "../utils/resetPasswordToken.ts";
import { hashPassword } from "../utils/password.ts";
import { sendSmtpMail } from "../utils/smtpMailer.ts";
import { studentApplicationAsApiJson } from "../utils/prismaApiShapes.ts";

const router = Router();

const RESET_WINDOW_MS = 15 * 60 * 1000;
const MIN_PASSWORD_LEN = 8;
const OTP_WINDOW_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ACCESS_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function frontendBaseUrl(): string {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

function generateOtp(): string {
  // 6-digit numeric OTP
  return String(crypto.randomInt(100000, 999999));
}

function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

// ─── Step 1: Verify email + password, issue OTP ─────────────────────────────
router.post("/student/login", async (req, res) => {
  try {
    // Accept `identifier` (preferred) or the legacy `email` field
    const email = String(req.body?.identifier || req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const app = await prisma.studentApplication.findUnique({ where: { email } });
    if (!app || !app.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const ok = await verifyPassword(password, app.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate and store OTP
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_WINDOW_MS);

    await prisma.studentApplication.update({
      where: { id: app.id },
      data: { otpCode, otpExpiresAt, otpAttempts: 0 },
    });

    // Send OTP — primary channel is email; SMS can be wired via SMTP_* or a
    // dedicated SMS env var when a gateway is available.
    const otpText = `Dear ${app.fullName},

Your SINU Student Portal one-time passcode (OTP) is:

  ${otpCode}

This code is valid for 10 minutes. Do not share it with anyone.

If you did not attempt to log in, please contact the SINU IT Help-Desk immediately.

Kind regards,
SINU Student Portal
`;

    const sent = await sendSmtpMail({
      to: app.email,
      subject: "SINU — Your One-Time Passcode",
      text: otpText,
    });

    if (!sent) {
      // Clear OTP so we don't leave a dangling record
      await prisma.studentApplication.update({
        where: { id: app.id },
        data: { otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
      });
      console.warn(`[student/login] SMTP not configured — OTP not sent for ${email}`);
      return res.status(503).json({
        error: "Could not send OTP. Check server email settings or contact admissions.",
      });
    }

    // Return masked destination so the UI can show "OTP sent to j***@..."
    const maskedEmail = email.replace(/(?<=.{2}).(?=[^@]*@)/, "*");
    return res.json({
      ok: true,
      otpRequired: true,
      maskedDestination: maskedEmail,
      message: `A one-time passcode has been sent to ${maskedEmail}.`,
    });
  } catch (e) {
    console.error("[student/login]", e);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── Step 2: Verify OTP, create session + tokens ─────────────────────────────
router.post("/student/verify-otp", async (req, res) => {
  try {
    // Accept `identifier` (preferred) or the legacy `email` field
    const email = String(req.body?.identifier || req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    const app = await prisma.studentApplication.findUnique({ where: { email } });
    if (!app || !app.otpCode || !app.otpExpiresAt) {
      return res.status(400).json({ error: "No pending OTP. Please sign in again." });
    }

    if (app.otpAttempts >= OTP_MAX_ATTEMPTS) {
      await prisma.studentApplication.update({
        where: { id: app.id },
        data: { otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
      });
      return res.status(429).json({
        error: "Too many incorrect attempts. Please sign in again to receive a new OTP.",
      });
    }

    if (new Date() > app.otpExpiresAt) {
      await prisma.studentApplication.update({
        where: { id: app.id },
        data: { otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
      });
      return res.status(400).json({ error: "OTP has expired. Please sign in again." });
    }

    if (otp !== app.otpCode) {
      await prisma.studentApplication.update({
        where: { id: app.id },
        data: { otpAttempts: { increment: 1 } },
      });
      const remaining = OTP_MAX_ATTEMPTS - (app.otpAttempts + 1);
      return res.status(400).json({
        error: `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "No attempts remaining — please sign in again."}`,
      });
    }

    // OTP verified — clear it and create session
    const refreshToken = generateRefreshToken();
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await prisma.$transaction([
      prisma.studentApplication.update({
        where: { id: app.id },
        data: { otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
      }),
      prisma.studentSession.create({
        data: {
          applicationId: app.id,
          refreshToken,
          expiresAt: refreshExpiresAt,
        },
      }),
    ]);

    const accessToken = signStudentToken(app.id, app.email);

    return res.json({
      ok: true,
      accessToken,
      refreshToken,
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      status: app.status,
      mustResetPassword: Boolean(app.mustResetPassword),
    });
  } catch (e) {
    console.error("[student/verify-otp]", e);
    return res.status(500).json({ error: "OTP verification failed. Please try again." });
  }
});

// ─── Refresh access token ────────────────────────────────────────────────────
router.post("/student/refresh", async (req, res) => {
  try {
    const token = String(req.body?.refreshToken || "").trim();
    if (!token) {
      return res.status(400).json({ error: "Refresh token is required." });
    }

    const session = await prisma.studentSession.findUnique({
      where: { refreshToken: token },
      include: { application: { select: { id: true, email: true, status: true } } },
    });

    if (!session || new Date() > session.expiresAt) {
      if (session) {
        await prisma.studentSession.delete({ where: { id: session.id } });
      }
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    const accessToken = signStudentToken(
      session.application.id,
      session.application.email
    );

    return res.json({ ok: true, accessToken });
  } catch (e) {
    console.error("[student/refresh]", e);
    return res.status(500).json({ error: "Token refresh failed." });
  }
});

// ─── Sign out (revoke session) ───────────────────────────────────────────────
router.post("/student/logout", async (req, res) => {
  try {
    const token = String(req.body?.refreshToken || "").trim();
    if (token) {
      await prisma.studentSession.deleteMany({ where: { refreshToken: token } });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("[student/logout]", e);
    return res.status(500).json({ error: "Logout failed." });
  }
});

// ─── Forgot password ─────────────────────────────────────────────────────────
router.post("/student/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const app = await prisma.studentApplication.findFirst({
      where: {
        email,
        passwordHash: { not: null },
      },
    });

    const generic =
      "If that email is registered, we sent a password reset link.";

    if (!app) {
      return res.json({ ok: true, message: generic });
    }

    const rawToken = generateResetToken();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_WINDOW_MS);

    await prisma.studentApplication.update({
      where: { id: app.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    const resetUrl = `${frontendBaseUrl()}/student-reset-password?token=${encodeURIComponent(rawToken)}`;
    const text = `Dear ${app.fullName},

You requested a password reset for the SINU Student Portal.

Open this link within 15 minutes to choose a new password:
${resetUrl}

If you did not request this, you can ignore this email.

Kind regards,
SINU Student Portal
`;

    const sent = await sendSmtpMail({
      to: app.email,
      subject: "SINU — Reset Your Student Portal Password",
      text,
    });

    if (!sent) {
      await prisma.studentApplication.update({
        where: { id: app.id },
        data: {
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      });
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
    console.error("[student/forgot-password]", e);
    return res.status(500).json({ error: "Request failed." });
  }
});

// ─── Reset password token status ─────────────────────────────────────────────
router.get("/student/reset-password/status", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) {
      return res.status(404).send("Not found");
    }

    const tokenHash = hashResetToken(token);
    const app = await prisma.studentApplication.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!app) {
      return res.status(404).send("Not found");
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("[student/reset-password/status]", e);
    return res.status(500).json({ error: "Failed." });
  }
});

// ─── Reset password ───────────────────────────────────────────────────────────
router.post("/student/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");
    if (!token) {
      return res.status(404).json({ error: "Not found." });
    }
    if (newPassword.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LEN} characters.`,
      });
    }

    const tokenHash = hashResetToken(token);
    const app = await prisma.studentApplication.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!app) {
      return res.status(404).json({ error: "Not found." });
    }

    await prisma.studentApplication.update({
      where: { id: app.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        mustResetPassword: false,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return res.json({ ok: true, message: "Your password has been updated." });
  } catch (e) {
    console.error("[student/reset-password]", e);
    return res.status(500).json({ error: "Failed to reset password." });
  }
});

// ─── Get current student profile ─────────────────────────────────────────────
router.get("/student/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    const v = verifyStudentToken(token);
    if (!v.ok || !v.applicationId) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const app = await prisma.studentApplication.findUnique({
      where: { id: v.applicationId },
    });
    if (!app) return res.status(404).json({ error: "Not found." });
    const { passwordHash: _p, otpCode: _o, otpExpiresAt: _oe, otpAttempts: _oa, ...rest } = app;
    return res.json({ ok: true, application: studentApplicationAsApiJson(rest) });
  } catch (e) {
    console.error("[student/me]", e);
    return res.status(500).json({ error: "Failed." });
  }
});

export default router;
