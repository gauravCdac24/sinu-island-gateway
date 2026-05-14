import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma.ts";
import type { DocumentCategory } from "../types/studentApplication.ts";
import { getStudentUploadDir } from "../utils/uploadPaths.ts";
import { normalizePhoneDigits } from "../utils/phoneNormalize.ts";
import { generateRandomPassword, hashPassword } from "../utils/password.ts";
import { sendSmtpMail } from "../utils/smtpMailer.ts";

const router = Router();

router.post("/student_applications/check-duplicate", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const phone = String(req.body?.phone || "").trim();
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const emailTaken = Boolean(await prisma.studentApplication.findUnique({ where: { email } }));

    const phoneDigits = normalizePhoneDigits(phone);
    const phoneTaken =
      phoneDigits.length >= 5
        ? Boolean(
            await prisma.studentApplication.findFirst({
              where: { phoneNormalized: phoneDigits },
            })
          )
        : false;

    return res.json({ ok: true, emailTaken, phoneTaken });
  } catch (e) {
    console.error("check-duplicate:", e);
    return res.status(500).json({ error: "Check failed." });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 45 },
});

function sanitizeStudentNameForFile(name: string): string {
  return (
    name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 80) || "student"
  );
}

type FileGroup = {
  field: keyof MulterFieldFiles;
  category: DocumentCategory;
  min: number;
  max: number;
};

type MulterFieldFiles = {
  profile_image?: Express.Multer.File[];
  study_documents?: Express.Multer.File[];
  certificates?: Express.Multer.File[];
  sop?: Express.Multer.File[];
  english_requirement?: Express.Multer.File[];
};

const FILE_GROUPS: FileGroup[] = [
  { field: "profile_image", category: "profile_image", min: 1, max: 1 },
  { field: "study_documents", category: "study_documents", min: 1, max: 12 },
  { field: "certificates", category: "certificates", min: 0, max: 12 },
  { field: "sop", category: "sop", min: 1, max: 5 },
  { field: "english_requirement", category: "english_requirement", min: 1, max: 10 },
];

function frontendBaseUrl(): string {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

async function sendConfirmationEmail(
  to: string,
  fullName: string,
  programmes: { priority: number; programme_code: string; programme_name: string }[],
  loginId: string,
  plainPassword: string
): Promise<boolean> {
  const courseList = programmes
    .sort((a, b) => a.priority - b.priority)
    .map(
      (p, i) =>
        `  ${i + 1}. ${p.programme_name} (${p.programme_code})`
    )
    .join("\n");

  const portalUrl = `${frontendBaseUrl()}/student-login`;

  const text = `Dear ${fullName},

Thank you for submitting your application to the Solomon Islands National University (SINU).

Your application has been received and is currently under review.

━━━━━━━━━━━━━━━━━━━━━━━━
PROGRAMMES APPLIED FOR
━━━━━━━━━━━━━━━━━━━━━━━━
${courseList}

━━━━━━━━━━━━━━━━━━━━━━━━
YOUR STUDENT PORTAL LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━
Login ID (Email): ${loginId}
Password        : ${plainPassword}

You can use these credentials to log in to the Student Portal and check the status of your application at any time:
${portalUrl}

For security reasons, you will be asked to verify a one-time passcode (OTP) during login.

━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━
• Log in to the portal to track your application status.
• You will be notified once a decision has been made.
• If selected, further enrolment instructions will be provided.

If you have any questions, please contact the SINU Admissions Office.

Kind regards,
Admissions Team
Solomon Islands National University
`;

  return sendSmtpMail({
    to,
    subject: "SINU — Application Received & Your Login Credentials",
    text,
  });
}

router.post(
  "/student_applications",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "study_documents", maxCount: 12 },
    { name: "certificates", maxCount: 12 },
    { name: "sop", maxCount: 5 },
    { name: "english_requirement", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const fullName = String(req.body.fullName || "").trim();
      const email = String(req.body.email || "").trim().toLowerCase();
      const phone = String(req.body.phone || "").trim();
      const dateOfBirth = String(req.body.dateOfBirth || "").trim();
      const gender = String(req.body.gender || "").trim();
      const nationality = String(req.body.nationality || "").trim();
      const residentialAddress = String(req.body.residentialAddress || "").trim();

      const files = req.files as MulterFieldFiles | undefined;

      let programmesParsed: {
        priority: number;
        programme_code: string;
        programme_name: string;
      }[] = [];
      try {
        const raw = req.body.programmes;
        if (!raw || typeof raw !== "string") {
          return res.status(400).json({ error: "Programme choices are required." });
        }
        programmesParsed = JSON.parse(raw) as typeof programmesParsed;
      } catch {
        return res.status(400).json({ error: "Invalid programme data." });
      }

      if (!Array.isArray(programmesParsed) || programmesParsed.length < 1) {
        return res.status(400).json({
          error: "Select at least one programme (priority 1).",
        });
      }
      if (programmesParsed.length > 3) {
        return res.status(400).json({ error: "You may select at most three programmes." });
      }

      const priorities = programmesParsed.map((p) => p.priority).sort((a, b) => a - b);
      const expected = programmesParsed.map((_, i) => i + 1).sort((a, b) => a - b);
      if (JSON.stringify(priorities) !== JSON.stringify(expected)) {
        return res.status(400).json({
          error: "Programme priorities must be consecutive starting from 1.",
        });
      }

      const codes = programmesParsed.map((p) => p.programme_code.trim());
      if (new Set(codes).size !== codes.length) {
        return res.status(400).json({
          error: "Each programme choice must be different.",
        });
      }

      for (const p of programmesParsed) {
        if (!p.programme_code?.trim() || !p.programme_name?.trim()) {
          return res.status(400).json({ error: "Each programme must have a code and name." });
        }
        const exists = await prisma.programme.findUnique({
          where: { programmeCode: p.programme_code.trim() },
        });
        if (!exists) {
          return res.status(400).json({
            error: `Invalid programme code: ${p.programme_code}`,
          });
        }
      }

      if (
        !fullName ||
        !email ||
        !phone ||
        !dateOfBirth ||
        !gender ||
        !nationality ||
        !residentialAddress
      ) {
        return res.status(400).json({
          error:
            "All fields are required: full name, email, phone, date of birth, gender, nationality, address.",
        });
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        return res.status(400).json({ error: "Invalid email address." });
      }

      const existingByEmail = await prisma.studentApplication.findUnique({ where: { email } });
      if (existingByEmail) {
        return res.status(400).json({
          error:
            "This email address is already used for an application. Use a different email or contact admissions.",
        });
      }

      const phoneDigits = normalizePhoneDigits(phone);
      if (phoneDigits.length < 5) {
        return res.status(400).json({ error: "Enter a valid phone number." });
      }
      const phoneTaken = await prisma.studentApplication.findFirst({
        where: { phoneNormalized: phoneDigits },
      });
      if (phoneTaken) {
        return res.status(400).json({
          error:
            "This phone number is already used for an application. Use a different number or contact admissions.",
        });
      }

      const dir = getStudentUploadDir();
      fs.mkdirSync(dir, { recursive: true });

      const safeBase = sanitizeStudentNameForFile(fullName);
      const timeSeconds = Math.floor(Date.now() / 1000);

      const documentRefs: {
        category: DocumentCategory;
        storedFileName: string;
        originalName: string;
      }[] = [];

      const byCategory: Record<DocumentCategory, number> = {
        profile_image: 0,
        study_documents: 0,
        certificates: 0,
        sop: 0,
        english_requirement: 0,
      };

      for (const group of FILE_GROUPS) {
        const arr = files?.[group.field] || [];
        if (arr.length < group.min) {
          const label =
            group.category === "profile_image"
              ? "Profile photo"
              : group.category === "study_documents"
                ? "Study documents"
                : group.category === "certificates"
                  ? "Certificates"
                  : group.category === "sop"
                    ? "Statement of purpose (SOP)"
                    : "English language requirement";
          return res.status(400).json({
            error:
              group.min === 1
                ? `${label}: upload at least one file where required.`
                : `${label}: invalid file count.`,
          });
        }
        if (arr.length > group.max) {
          return res.status(400).json({
            error: `Too many files for ${group.category}.`,
          });
        }

        for (let i = 0; i < arr.length; i++) {
          const f = arr[i];
          const ext = path.extname(f.originalname) || "";
          const storedFileName = `${safeBase}-${timeSeconds}-${group.category}-${i + 1}${ext}`;
          const dest = path.join(dir, storedFileName);
          fs.writeFileSync(dest, f.buffer);
          documentRefs.push({
            category: group.category,
            storedFileName,
            originalName: f.originalname,
          });
          byCategory[group.category] += 1;
        }
      }

      const programmesJson = programmesParsed.map((p) => ({
        priority: p.priority,
        programme_code: p.programme_code.trim(),
        programme_name: p.programme_name.trim(),
      }));

      const plainPassword = generateRandomPassword(12);
      const passwordHash = await hashPassword(plainPassword);

      const doc = await prisma.studentApplication.create({
        data: {
          fullName,
          email,
          phone,
          phoneNormalized: phoneDigits,
          dateOfBirth,
          gender,
          nationality,
          residentialAddress,
          programmes: programmesJson,
          documents: documentRefs,
          status: "pending",
          passwordHash,
          mustResetPassword: false,
        },
      });

      const emailSent = await sendConfirmationEmail(
        email,
        fullName,
        programmesParsed,
        email,
        plainPassword
      );

      return res.status(201).json({
        ok: true,
        id: doc.id,
        emailSent,
        message: emailSent
          ? "Application submitted! Your login credentials have been sent to your email."
          : "Application submitted. Your login credentials will be sent shortly. If you don't receive them, contact admissions.",
      });
    } catch (err) {
      console.error("student_applications error:", err);
      return res.status(500).json({ error: "Could not submit application." });
    }
  }
);

export default router;
