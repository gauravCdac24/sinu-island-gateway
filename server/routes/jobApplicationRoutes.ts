import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";
import { getJobUploadDir } from "../utils/uploadPaths.ts";
import { parseResumeFile } from "../utils/resumeParser.ts";
import { sendSmtpMail } from "../utils/smtpMailer.ts";
import {
  archiveExpiredVacancies,
  vacancyToPublicRow,
} from "../utils/jobVacancyLifecycle.ts";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 25 },
});

function sanitizeNameForFile(name: string): string {
  return (
    name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 60) || "applicant"
  );
}

router.get("/job_vacancies", async (_req, res) => {
  try {
    await archiveExpiredVacancies();
    const rows = await prisma.jobVacancy.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
    return res.json({
      ok: true,
      vacancies: rows.map((v) => ({ ...vacancyToPublicRow(v), status: "open" as const })),
    });
  } catch (e) {
    console.error("job_vacancies:", e);
    return res.status(500).json({ error: "Failed to load vacancies." });
  }
});

router.get("/job_vacancies/archived", async (_req, res) => {
  try {
    await archiveExpiredVacancies();
    const rows = await prisma.jobVacancy.findMany({
      where: { status: "archived" },
      orderBy: { archivedAt: "desc" },
    });
    return res.json({
      ok: true,
      vacancies: rows.map((v) => ({
        ...vacancyToPublicRow(v),
        status: "archived" as const,
        archivedAt: v.archivedAt?.toISOString() ?? null,
      })),
    });
  } catch (e) {
    console.error("job_vacancies/archived:", e);
    return res.status(500).json({ error: "Failed to load archived vacancies." });
  }
});

router.get("/job_vacancies/:vacancyNo", async (req, res) => {
  try {
    await archiveExpiredVacancies();
    const vacancyNo = String(req.params.vacancyNo).trim();
    const v = await prisma.jobVacancy.findUnique({ where: { vacancyNo } });
    if (!v) return res.status(404).json({ error: "Vacancy not found." });
    if (v.status === "archived") {
      return res.json({
        ok: true,
        vacancy: {
          ...vacancyToPublicRow(v),
          status: "archived",
          summaryOfDuties: v.summaryOfDuties,
          mainDuties: v.mainDuties,
          qualificationsRequired: v.qualificationsRequired,
          experienceRequired: v.experienceRequired,
          salaryRange: v.salaryRange,
        },
        canApply: false,
      });
    }
    if (v.status !== "published") {
      return res.status(404).json({ error: "Vacancy not available." });
    }
    return res.json({
      ok: true,
      vacancy: {
        ...vacancyToPublicRow(v),
        status: "open",
        summaryOfDuties: v.summaryOfDuties,
        mainDuties: v.mainDuties,
        minimumQualificationExperience: v.minimumQualificationExperience,
        qualificationsRequired: v.qualificationsRequired,
        experienceRequired: v.experienceRequired,
        salaryRange: v.salaryRange,
        employmentType: v.employmentType,
        locationCampus: v.locationCampus,
        bandGrade: v.bandGrade,
      },
      canApply: true,
    });
  } catch (e) {
    console.error("job_vacancy detail:", e);
    return res.status(500).json({ error: "Failed to load vacancy." });
  }
});

router.post("/job_applications/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Resume file is required." });
    }
    const extracted = await parseResumeFile(file.buffer, file.originalname);
    return res.json({ ok: true, extracted });
  } catch (e) {
    console.error("parse-resume:", e);
    const msg = e instanceof Error ? e.message : "Could not parse resume.";
    return res.status(400).json({ error: msg });
  }
});

type DocCategory =
  | "resume"
  | "cover_letter"
  | "certified_copies"
  | "reference_letter";

router.post(
  "/job_applications",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "cover_letter", maxCount: 3 },
    { name: "certified_copies", maxCount: 15 },
    { name: "reference_letter", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const vacancyNo = String(req.body.vacancyNo || "").trim();
      const email = String(req.body.email || "").trim().toLowerCase();
      const fullName = String(req.body.fullName || "").trim();

      await archiveExpiredVacancies();
      const vacancy = await prisma.jobVacancy.findUnique({ where: { vacancyNo } });
      if (!vacancy || vacancy.status !== "published") {
        return res.status(400).json({ error: "Invalid or closed vacancy." });
      }

      if (!fullName || !email) {
        return res.status(400).json({ error: "Full name and email are required." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email address." });
      }

      let formData: Record<string, unknown> = {};
      try {
        formData = JSON.parse(String(req.body.formData || "{}"));
      } catch {
        return res.status(400).json({ error: "Invalid form data." });
      }

      let resumeExtracted: Record<string, unknown> | null = null;
      if (req.body.resumeExtracted) {
        try {
          resumeExtracted = JSON.parse(String(req.body.resumeExtracted));
        } catch {
          resumeExtracted = null;
        }
      }

      const files = req.files as {
        resume?: Express.Multer.File[];
        cover_letter?: Express.Multer.File[];
        certified_copies?: Express.Multer.File[];
        reference_letter?: Express.Multer.File[];
      };

      if (!files?.resume?.length) {
        return res.status(400).json({ error: "Resume (CV) is required." });
      }
      if (!files?.cover_letter?.length) {
        return res.status(400).json({ error: "Cover letter is required." });
      }
      if (!files?.certified_copies?.length) {
        return res.status(400).json({
          error: "Certified copies of certificates and transcripts are required.",
        });
      }

      const dir = getJobUploadDir();
      fs.mkdirSync(dir, { recursive: true });
      const safeBase = sanitizeNameForFile(fullName);
      const timeSeconds = Math.floor(Date.now() / 1000);

      const documentRefs: {
        category: DocCategory;
        storedFileName: string;
        originalName: string;
      }[] = [];

      const groups: { field: keyof typeof files; category: DocCategory; min: number }[] = [
        { field: "resume", category: "resume", min: 1 },
        { field: "cover_letter", category: "cover_letter", min: 1 },
        { field: "certified_copies", category: "certified_copies", min: 1 },
        { field: "reference_letter", category: "reference_letter", min: 0 },
      ];

      for (const group of groups) {
        const arr = files[group.field] || [];
        if (arr.length < group.min) {
          return res.status(400).json({
            error: `Missing required upload: ${group.category.replace(/_/g, " ")}.`,
          });
        }
        for (let i = 0; i < arr.length; i++) {
          const f = arr[i];
          const ext = path.extname(f.originalname) || "";
          const storedFileName = `${safeBase}-${timeSeconds}-${group.category}-${i + 1}${ext}`;
          fs.writeFileSync(path.join(dir, storedFileName), f.buffer);
          documentRefs.push({
            category: group.category,
            storedFileName,
            originalName: f.originalname,
          });
        }
      }

      const doc = await prisma.jobApplication.create({
        data: {
          vacancyNo: vacancy.vacancyNo,
          positionTitle: vacancy.title,
          facultyDepartment: vacancy.divisionDepartment,
          email,
          fullName,
          formData: formData as Prisma.InputJsonValue,
          documents: documentRefs as Prisma.InputJsonValue,
          resumeExtracted: resumeExtracted
            ? (resumeExtracted as Prisma.InputJsonValue)
            : undefined,
          status: "pending",
        },
      });

      const emailSent = await sendSmtpMail({
        to: email,
        subject: `SINU — Job application received (${vacancy.vacancyNo})`,
        text: `Dear ${fullName},

Thank you for applying for the position of ${vacancy.title} (${vacancy.vacancyNo}) at the Solomon Islands National University.

Your application has been received and is currently under review. You will only be contacted if your application is successful for the next stage of selection.

Kind regards,
Human Resources Department
Solomon Islands National University
`,
      });

      return res.status(201).json({
        ok: true,
        id: doc.id,
        emailSent,
        message: emailSent
          ? "Application submitted successfully. A confirmation email has been sent."
          : "Application submitted successfully.",
      });
    } catch (err) {
      console.error("job_applications error:", err);
      return res.status(500).json({ error: "Could not submit application." });
    }
  }
);

export default router;
