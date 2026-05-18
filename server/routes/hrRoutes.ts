import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.ts";
import { signHrToken, verifyHrToken } from "../utils/adminToken.ts";
import {
  archiveExpiredVacancies,
  formatDueDate,
  vacancyToPublicRow,
} from "../utils/jobVacancyLifecycle.ts";

const router = Router();

const HR_USERNAME = (process.env.HR_ADMIN_USERNAME || "sinu_hr_admin").trim();
const HR_EMAIL = (process.env.HR_ADMIN_EMAIL || "hr@sinu.edu.sb").trim().toLowerCase();
const HR_PASSWORD = process.env.HR_ADMIN_PASSWORD || "SINU_HR_Admin2026!";

function hrAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!verifyHrToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function parseClosingDate(raw: unknown): Date | null {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseKsc(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      return raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    }
  }
  return [];
}

type VacancyBody = {
  vacancyNo?: string;
  title?: string;
  divisionDepartment?: string;
  locationCampus?: string;
  bandGrade?: string;
  staffCategory?: string;
  reportsTo?: string;
  summaryOfDuties?: string;
  mainDuties?: string;
  dimensions?: string;
  generalResponsibilities?: string;
  qualificationsRequired?: string;
  experienceRequired?: string;
  minimumQualificationExperience?: string;
  salaryRange?: string;
  employmentType?: string;
  termsAndConditions?: string;
  keySelectionCriteria?: unknown;
  closingDate?: unknown;
};

function vacancyDataFromBody(body: VacancyBody) {
  return {
    vacancyNo: String(body.vacancyNo || "").trim(),
    title: String(body.title || "").trim(),
    divisionDepartment: String(body.divisionDepartment || "").trim(),
    locationCampus: String(body.locationCampus || "").trim(),
    bandGrade: String(body.bandGrade || "").trim() || null,
    staffCategory: String(body.staffCategory || "").trim() || null,
    reportsTo: String(body.reportsTo || "").trim() || null,
    summaryOfDuties: String(body.summaryOfDuties || "").trim() || null,
    mainDuties: String(body.mainDuties || "").trim() || null,
    dimensions: String(body.dimensions || "").trim() || null,
    generalResponsibilities: String(body.generalResponsibilities || "").trim() || null,
    qualificationsRequired: String(body.qualificationsRequired || "").trim() || null,
    experienceRequired: String(body.experienceRequired || "").trim() || null,
    minimumQualificationExperience:
      String(body.minimumQualificationExperience || "").trim() || null,
    salaryRange: String(body.salaryRange || "").trim() || null,
    employmentType: String(body.employmentType || "").trim() || null,
    termsAndConditions: String(body.termsAndConditions || "").trim() || null,
    keySelectionCriteria: parseKsc(body.keySelectionCriteria),
    closingDate: parseClosingDate(body.closingDate),
  };
}

router.post("/hr/login", (req, res) => {
  const raw = String(req.body?.identifier || req.body?.username || req.body?.email || "").trim();
  const password = String(req.body?.password || "");
  if (!raw || !password) {
    return res.status(400).json({ error: "Username (or email) and password are required." });
  }
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  const identifierOk = isEmail ? raw.toLowerCase() === HR_EMAIL : raw === HR_USERNAME;
  if (!identifierOk || password !== HR_PASSWORD) {
    return res.status(401).json({ error: "Invalid username/email or password." });
  }
  return res.json({ ok: true, token: signHrToken(), role: "hr" });
});

router.get("/hr/me", hrAuth, (_req, res) => {
  res.json({ ok: true, role: "hr" });
});

router.get("/hr/stats", hrAuth, async (_req, res) => {
  try {
    await archiveExpiredVacancies();

    const [published, draft, archived, applications, vacancies] = await Promise.all([
      prisma.jobVacancy.count({ where: { status: "published" } }),
      prisma.jobVacancy.count({ where: { status: "draft" } }),
      prisma.jobVacancy.count({ where: { status: "archived" } }),
      prisma.jobApplication.findMany({
        select: { status: true, vacancyNo: true, positionTitle: true },
      }),
      prisma.jobVacancy.findMany({
        where: { status: "published" },
        select: { vacancyNo: true, title: true },
      }),
    ]);

    let pendingApps = 0;
    let reviewedApps = 0;
    const byVacancy = new Map<string, { vacancyNo: string; title: string; count: number }>();

    for (const a of applications) {
      if (a.status === "pending") pendingApps++;
      else reviewedApps++;
      const cur = byVacancy.get(a.vacancyNo) || {
        vacancyNo: a.vacancyNo,
        title: a.positionTitle,
        count: 0,
      };
      cur.count += 1;
      byVacancy.set(a.vacancyNo, cur);
    }

    for (const v of vacancies) {
      if (!byVacancy.has(v.vacancyNo)) {
        byVacancy.set(v.vacancyNo, { vacancyNo: v.vacancyNo, title: v.title, count: 0 });
      }
    }

    return res.json({
      counts: {
        published,
        draft,
        archived,
        pendingJobs: draft,
        totalApplications: applications.length,
        pendingApplications: pendingApps,
        reviewedApplications: reviewedApps,
      },
      applicationsByVacancy: Array.from(byVacancy.values()).sort((a, b) => b.count - a.count),
      jobStatusPie: [
        { name: "Published", value: published },
        { name: "Draft", value: draft },
        { name: "Archived", value: archived },
      ],
    });
  } catch (e) {
    console.error("hr/stats:", e);
    return res.status(500).json({ error: "Failed to load stats." });
  }
});

router.get("/hr/vacancies", hrAuth, async (req, res) => {
  try {
    await archiveExpiredVacancies();
    const status = String(req.query.status || "").trim();
    const where = status ? { status } : {};
    const rows = await prisma.jobVacancy.findMany({
      where,
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    });
    const appCounts = await prisma.jobApplication.groupBy({
      by: ["vacancyNo"],
      _count: { id: true },
    });
    const countMap = new Map(appCounts.map((c) => [c.vacancyNo, c._count.id]));
    return res.json({
      ok: true,
      vacancies: rows.map((v) => ({
        id: v.id,
        ...vacancyToPublicRow(v),
        status: v.status,
        closingDate: v.closingDate?.toISOString() ?? null,
        dueDate: formatDueDate(v.closingDate),
        applicationCount: countMap.get(v.vacancyNo) ?? 0,
        publishedAt: v.publishedAt?.toISOString() ?? null,
        archivedAt: v.archivedAt?.toISOString() ?? null,
        staffCategory: v.staffCategory,
        reportsTo: v.reportsTo,
        salaryRange: v.salaryRange,
        employmentType: v.employmentType,
      })),
    });
  } catch (e) {
    console.error("hr/vacancies:", e);
    return res.status(500).json({ error: "Failed to list vacancies." });
  }
});

router.get("/hr/vacancies/:id", hrAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const v = await prisma.jobVacancy.findUnique({ where: { id } });
    if (!v) return res.status(404).json({ error: "Vacancy not found." });
    const applicationCount = await prisma.jobApplication.count({
      where: { vacancyNo: v.vacancyNo },
    });
    return res.json({
      ok: true,
      vacancy: {
        ...v,
        closingDate: v.closingDate?.toISOString().slice(0, 10) ?? "",
        dueDate: formatDueDate(v.closingDate),
        applicationCount,
      },
    });
  } catch (e) {
    console.error("hr/vacancy:", e);
    return res.status(500).json({ error: "Failed to load vacancy." });
  }
});

router.post("/hr/vacancies", hrAuth, async (req, res) => {
  try {
    const data = vacancyDataFromBody(req.body as VacancyBody);
    if (!data.vacancyNo || !data.title || !data.divisionDepartment || !data.locationCampus) {
      return res.status(400).json({
        error: "Vacancy number, title, division/department, and location/campus are required.",
      });
    }
    const existing = await prisma.jobVacancy.findUnique({
      where: { vacancyNo: data.vacancyNo },
    });
    if (existing) {
      return res.status(400).json({ error: "Vacancy number already exists." });
    }
    const created = await prisma.jobVacancy.create({
      data: { ...data, status: "draft" },
    });
    return res.status(201).json({ ok: true, id: created.id, vacancy: created });
  } catch (e) {
    console.error("hr create vacancy:", e);
    return res.status(500).json({ error: "Could not create vacancy." });
  }
});

router.patch("/hr/vacancies/:id", hrAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.jobVacancy.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Vacancy not found." });
    if (existing.status === "archived") {
      return res.status(400).json({ error: "Archived vacancies cannot be edited." });
    }

    const data = vacancyDataFromBody(req.body as VacancyBody);
    const updated = await prisma.jobVacancy.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.divisionDepartment && { divisionDepartment: data.divisionDepartment }),
        ...(data.locationCampus && { locationCampus: data.locationCampus }),
        bandGrade: data.bandGrade,
        staffCategory: data.staffCategory,
        reportsTo: data.reportsTo,
        summaryOfDuties: data.summaryOfDuties,
        mainDuties: data.mainDuties,
        dimensions: data.dimensions,
        generalResponsibilities: data.generalResponsibilities,
        qualificationsRequired: data.qualificationsRequired,
        experienceRequired: data.experienceRequired,
        minimumQualificationExperience: data.minimumQualificationExperience,
        salaryRange: data.salaryRange,
        employmentType: data.employmentType,
        termsAndConditions: data.termsAndConditions,
        keySelectionCriteria: data.keySelectionCriteria,
        closingDate: data.closingDate,
      },
    });
    return res.json({ ok: true, vacancy: updated });
  } catch (e) {
    console.error("hr patch vacancy:", e);
    return res.status(500).json({ error: "Could not update vacancy." });
  }
});

router.post("/hr/vacancies/:id/publish", hrAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const v = await prisma.jobVacancy.findUnique({ where: { id } });
    if (!v) return res.status(404).json({ error: "Vacancy not found." });
    if (v.status === "archived") {
      return res.status(400).json({ error: "Cannot publish an archived vacancy." });
    }
    const updated = await prisma.jobVacancy.update({
      where: { id },
      data: { status: "published", publishedAt: new Date(), archivedAt: null },
    });
    return res.json({ ok: true, vacancy: updated });
  } catch (e) {
    console.error("hr publish:", e);
    return res.status(500).json({ error: "Could not publish vacancy." });
  }
});

router.post("/hr/vacancies/:id/close", hrAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const v = await prisma.jobVacancy.findUnique({ where: { id } });
    if (!v) return res.status(404).json({ error: "Vacancy not found." });
    if (v.status !== "published") {
      return res.status(400).json({ error: "Only published vacancies can be closed." });
    }
    const updated = await prisma.jobVacancy.update({
      where: { id },
      data: { status: "archived", archivedAt: new Date() },
    });
    return res.json({ ok: true, vacancy: updated });
  } catch (e) {
    console.error("hr close:", e);
    return res.status(500).json({ error: "Could not close vacancy." });
  }
});

router.get("/hr/applications", hrAuth, async (req, res) => {
  try {
    const vacancyNo = String(req.query.vacancyNo || "").trim();
    const where = vacancyNo ? { vacancyNo } : {};
    const apps = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return res.json({
      ok: true,
      applications: apps.map((a) => ({
        id: a.id,
        vacancyNo: a.vacancyNo,
        positionTitle: a.positionTitle,
        fullName: a.fullName,
        email: a.email,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("hr applications:", e);
    return res.status(500).json({ error: "Failed to list applications." });
  }
});

router.get("/hr/applications/:id", hrAuth, async (req, res) => {
  try {
    const app = await prisma.jobApplication.findUnique({
      where: { id: String(req.params.id) },
    });
    if (!app) return res.status(404).json({ error: "Application not found." });
    return res.json({ ok: true, application: app });
  } catch (e) {
    console.error("hr application detail:", e);
    return res.status(500).json({ error: "Failed to load application." });
  }
});

export default router;
