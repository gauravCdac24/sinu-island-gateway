import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// import nodemailer from "nodemailer"; // TESTING: SMTP disabled — uncomment for production
import StudentApplication from "../models/StudentApplication.ts";
import type { DocumentCategory } from "../models/StudentApplication.ts";
import CoursesFiles from "../models/Courses_File.ts";
import { getStudentUploadDir } from "../utils/uploadPaths.ts";
import { normalizePhoneDigits } from "../utils/phoneNormalize.ts";

const router = Router();

/** Pre-check before multi-step form continues (email + phone vs existing applications). */
router.post("/student_applications/check-duplicate", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const phone = String(req.body?.phone || "").trim();
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const emailTaken = Boolean(await StudentApplication.findOne({ email }).lean());

    const phoneDigits = normalizePhoneDigits(phone);
    let phoneTaken = false;
    if (phoneDigits.length >= 5) {
      const apps = await StudentApplication.find({}, { phone: 1 }).lean();
      phoneTaken = apps.some(
        (a) => normalizePhoneDigits(String(a.phone || "")) === phoneDigits
      );
    }

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

async function sendConfirmationEmail(
  _to: string,
  _fullName: string,
  _programmes: { priority: number; programme_code: string; programme_name: string }[],
  _byCategory: Record<DocumentCategory, number>
): Promise<boolean> {
  /* TESTING: SMTP disabled — restore nodemailer import + body below for production
  const to = _to;
  const fullName = _fullName;
  const programmes = _programmes;
  const byCategory = _byCategory;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "noreply@localhost";

  if (!host || !user || !pass) {
    console.warn(
      "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS); skipping confirmation email."
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });

  const programmeLines = programmes
    .sort((a, b) => a.priority - b.priority)
    .map(
      (p) =>
        `  Priority ${p.priority}: ${p.programme_name} (${p.programme_code})`
    )
    .join("\n");

  const totalFiles = Object.values(byCategory).reduce((a, b) => a + b, 0);
  const catLines = [
    `  Profile photo: ${byCategory.profile_image}`,
    `  Study documents: ${byCategory.study_documents}`,
    `  Certificates: ${byCategory.certificates}`,
    `  Statement of purpose (SOP): ${byCategory.sop}`,
    `  English requirement: ${byCategory.english_requirement}`,
  ].join("\n");

  const text = `Dear ${fullName},

Thank you for submitting your application to the Solomon Islands National University (SINU).

We have received your details and ${totalFiles} file(s) in total.

Uploads by category:
${catLines}

Programme choices:
${programmeLines}

We will contact you using this email address if further information is required.

Kind regards,
SINU Admissions`;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "SINU — Application received",
      text,
    });
    return true;
  } catch (e) {
    console.error("Failed to send confirmation email:", e);
    return false;
  }
  */
  return false;
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
        const exists = await CoursesFiles.findOne({
          programme_code: p.programme_code.trim(),
        }).lean();
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

      const existingByEmail = await StudentApplication.findOne({ email }).lean();
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
      const phoneRows = await StudentApplication.find({}, { phone: 1 }).lean();
      const phoneTaken = phoneRows.some(
        (a) => normalizePhoneDigits(String(a.phone || "")) === phoneDigits
      );
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

      const doc = await StudentApplication.create({
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        nationality,
        residentialAddress,
        programmes: programmesParsed.map((p) => ({
          priority: p.priority,
          programme_code: p.programme_code.trim(),
          programme_name: p.programme_name.trim(),
        })),
        documents: documentRefs,
        status: "pending",
      });

      const emailSent = await sendConfirmationEmail(
        email,
        fullName,
        programmesParsed,
        byCategory
      );

      return res.status(201).json({
        ok: true,
        id: doc._id,
        emailSent,
        message: emailSent
          ? "Application submitted. Check your email for confirmation."
          : "Application submitted. If you do not receive email, contact admissions.",
      });
    } catch (err) {
      console.error("student_applications error:", err);
      return res.status(500).json({ error: "Could not submit application." });
    }
  }
);

export default router;
