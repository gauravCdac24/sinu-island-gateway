import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma.ts";
import fs from "fs";
import path from "path";
import readXlsxFile from "read-excel-file/node";
import { policyFileMeta, programmeAsJson, programmesAsJson, unitAsJson } from "../utils/prismaApiShapes.ts";
import {
  programmeFromExcelRow,
  unitFromExcelRow,
  type ProgrammeImportRow,
  type UnitImportRow,
} from "../utils/excelProgrammeUnit.ts";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

const multerSingleFile = (req: Request, res: Response, next: NextFunction) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return upload.single("file")(req, res, next);
  }
  next();
};

const normalize = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ");

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Avoid ILIKE metacharacters in user input for Prisma `contains`. */
function sanitizeIlikeFragment(s: string): string {
  return s.replace(/[%_\\]/g, " ").trim();
}

router.post("/policy_files/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No PDF uploaded" });

    const file = await prisma.policyFile.create({
      data: {
        filename: req.file.originalname,
        data: Buffer.from(req.file.buffer) as unknown as Uint8Array<ArrayBuffer>,
        mimetype: req.file.mimetype,
      },
    });

    res.json({ msg: "PDF stored in PostgreSQL", file: policyFileMeta(file) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/policy_files/upload-from-path", async (req, res) => {
  try {
    const filePath = req.body.path;
    if (!filePath) return res.status(400).json({ msg: "File path required" });

    const fileBuffer = fs.readFileSync(filePath);

    const file = await prisma.policyFile.create({
      data: {
        filename: filePath.split("/").pop() || "upload.pdf",
        data: Buffer.from(fileBuffer) as unknown as Uint8Array<ArrayBuffer>,
        mimetype: "application/pdf",
      },
    });

    res.json({ msg: "PDF uploaded from filesystem", file: policyFileMeta(file) });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload" });
  }
});

const POLICY_SEED_ROOT = "/seed/policies";

function isPathUnderPolicySeedRoot(resolvedDir: string): boolean {
  const root = path.resolve(POLICY_SEED_ROOT);
  const dir = path.resolve(resolvedDir);
  return dir === root || dir.startsWith(root + path.sep);
}

router.post("/policy_files/seed-from-directory", async (req, res) => {
  try {
    const requested =
      typeof req.body?.directory === "string" ? req.body.directory : POLICY_SEED_ROOT;
    const dir = path.resolve(requested);
    if (!isPathUnderPolicySeedRoot(dir)) {
      return res.status(400).json({
        error: `directory must be under ${POLICY_SEED_ROOT}`,
      });
    }
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      return res.status(400).json({ error: "Not a directory or does not exist" });
    }

    const names = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));

    const existing = await prisma.policyFile.findMany({
      where: { filename: { in: names } },
      select: { filename: true },
    });
    const existingSet = new Set(existing.map((e) => e.filename));

    let inserted = 0;
    let skippedExisting = 0;
    const errors: string[] = [];

    for (const name of names) {
      const full = path.join(dir, name);
      try {
        if (existingSet.has(name)) {
          skippedExisting++;
          continue;
        }
        const fileBuffer = fs.readFileSync(full);
        await prisma.policyFile.create({
          data: {
            filename: name,
            data: Buffer.from(fileBuffer) as unknown as Uint8Array<ArrayBuffer>,
            mimetype: "application/pdf",
          },
        });
        inserted++;
      } catch (e) {
        errors.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    res.json({
      ok: true,
      directory: dir,
      files: names.length,
      inserted,
      skippedExisting,
      errors: errors.length ? errors : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seed failed" });
  }
});

router.get("/policy_files/all", async (_req, res) => {
  try {
    const files = await prisma.policyFile.findMany({
      select: { id: true, filename: true, mimetype: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(files.map(policyFileMeta));
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

router.get("/policy_files/search/:name", async (req, res) => {
  try {
    const keyword = req.params.name;
    const safe = sanitizeIlikeFragment(keyword || "");
    const files = await prisma.policyFile.findMany({
      where: safe ? { filename: { contains: safe, mode: "insensitive" } } : {},
      select: { id: true, filename: true, mimetype: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(files.map(policyFileMeta));
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/policy_files/file/:id", async (req, res) => {
  const file = await prisma.policyFile.findUnique({ where: { id: req.params.id } });
  if (!file) return res.status(404).send("File not found");

  res.contentType(file.mimetype);
  res.send(Buffer.from(file.data));
});

async function runProgrammeUpserts(rows: ProgrammeImportRow[]): Promise<{ inserted: number; updated: number }> {
  if (!rows.length) return { inserted: 0, updated: 0 };
  const codes = [...new Set(rows.map((r) => r.programmeCode))];
  const existing = await prisma.programme.findMany({
    where: { programmeCode: { in: codes } },
    select: { programmeCode: true },
  });
  const existingSet = new Set(existing.map((e) => e.programmeCode));
  let inserted = 0;
  let updated = 0;
  for (const r of rows) {
    if (existingSet.has(r.programmeCode)) updated++;
    else inserted++;
  }

  const chunkSize = 40;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((data) =>
        prisma.programme.upsert({
          where: { programmeCode: data.programmeCode },
          create: { ...data },
          update: {
            programmeName: data.programmeName,
            programmeDepartment: data.programmeDepartment ?? undefined,
            programmeFaculty: data.programmeFaculty ?? undefined,
            siqfLevel: data.siqfLevel ?? undefined,
            programmeEntryRequirement: data.programmeEntryRequirement ?? undefined,
            programmeCredits: data.programmeCredits ?? undefined,
            programmeYear: data.programmeYear ?? undefined,
            programmeStudyType: data.programmeStudyType,
            programmeDescription: data.programmeDescription ?? undefined,
            programmeLocation: data.programmeLocation,
            programmeStudyPeriod: data.programmeStudyPeriod ?? undefined,
            programmeEnglishRequirement: data.programmeEnglishRequirement ?? undefined,
            programmeLevel: data.programmeLevel ?? undefined,
            programmeUnits: data.programmeUnits ?? undefined,
          },
        })
      )
    );
  }
  return { inserted, updated };
}

router.post("/programme_catalogue/upload_programmes", multerSingleFile, async (req, res) => {
  try {
    let rows;
    if (req.file?.buffer) {
      rows = await readXlsxFile(req.file.buffer);
    } else if (typeof req.body?.path === "string" && req.body.path.trim()) {
      rows = await readXlsxFile(req.body.path.trim());
    } else {
      return res.status(400).json({
        error:
          'Upload an .xlsx as multipart field "file", or send JSON { "path": "<path on API server>" }',
      });
    }

    if (!rows.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const byCode = new Map<string, ProgrammeImportRow>();

    for (const row of dataRows) {
      if (row.length === 0 || row.every((v) => v === null || v === "")) {
        continue;
      }

      const record: Record<string, unknown> = {};
      row.forEach((value, idx) => {
        const key = String(header[idx]);
        if (!key) return;
        if (key === "programme_study_type" && typeof value === "string") {
          record[key] = value.split(",").map((v) => v.trim());
        } else if (key === "programme_credits") {
          record[key] = Number(value);
        } else {
          record[key] = value;
        }
      });

      if (!record.programme_code) continue;
      const data = programmeFromExcelRow(record);
      byCode.set(data.programmeCode, data);
    }

    const list = [...byCode.values()];
    const { inserted, updated } = await runProgrammeUpserts(list);

    return res.json({
      success: true,
      message: "Upload processed successfully",
      inserted,
      updated,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: String(error) });
  }
});

router.get("/programme_catalogue/search", async (req, res) => {
  try {
    const { programme_name, programme_level, programme_faculty } = req.query;

    const where: {
      programmeName?: { contains: string; mode: "insensitive" };
      programmeLevel?: string;
      programmeFaculty?: { contains: string; mode: "insensitive" };
    } = {};

    if (programme_name && programme_name !== "all") {
      const frag = sanitizeIlikeFragment(
        normalize(decodeURIComponent(String(programme_name)))
      );
      if (frag) {
        where.programmeName = { contains: frag, mode: "insensitive" };
      }
    }

    if (programme_level && programme_level !== "all") {
      where.programmeLevel = String(programme_level);
    }

    if (programme_faculty && programme_faculty !== "all") {
      const normalizedFaculty = normalize(decodeURIComponent(String(programme_faculty)));
      const escapedFaculty = escapeRegex(normalizedFaculty);
      where.programmeFaculty = { contains: escapedFaculty, mode: "insensitive" };
    }

    const programmes = await prisma.programme.findMany({
      where,
      orderBy: { programmeName: "asc" },
    });

    res.json({
      count: programmes.length,
      data: programmesAsJson(programmes),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch programmes" });
  }
});

router.get("/programme_catalogue/undergraduate_search", async (req, res) => {
  try {
    const { programme_name } = req.query;

    if (!programme_name || typeof programme_name !== "string") {
      return res.status(400).json({ error: "Name parameter is required and must be a string" });
    }

    const frag = sanitizeIlikeFragment(programme_name.trim());
    const programmes = await prisma.programme.findMany({
      where: {
        programmeLevel: "Undergraduate",
        ...(frag ? { programmeName: { contains: frag, mode: "insensitive" as const } } : {}),
      },
      orderBy: { programmeName: "asc" },
    });

    res.json({
      count: programmes.length,
      data: programmesAsJson(programmes),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch programmes" });
  }
});

router.get("/programme_catalogue/postgraduate_search", async (req, res) => {
  try {
    const { programme_name } = req.query;

    if (!programme_name || typeof programme_name !== "string") {
      return res.status(400).json({ error: "Name parameter is required and must be a string" });
    }

    const frag = sanitizeIlikeFragment(programme_name.trim());
    const programmes = await prisma.programme.findMany({
      where: {
        programmeLevel: "Postgraduate",
        ...(frag ? { programmeName: { contains: frag, mode: "insensitive" as const } } : {}),
      },
      orderBy: { programmeName: "asc" },
    });

    res.json({
      count: programmes.length,
      data: programmesAsJson(programmes),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch programmes" });
  }
});

router.get("/programme_catalogue/tafe_search", async (req, res) => {
  try {
    const { programme_name } = req.query;

    if (!programme_name || typeof programme_name !== "string") {
      return res.status(400).json({ error: "Name parameter is required and must be a string" });
    }

    const frag = sanitizeIlikeFragment(programme_name.trim());
    const programmes = await prisma.programme.findMany({
      where: {
        programmeFaculty: { contains: "TAFE", mode: "insensitive" },
        ...(frag ? { programmeName: { contains: frag, mode: "insensitive" as const } } : {}),
      },
      orderBy: { programmeName: "asc" },
    });

    res.json({
      count: programmes.length,
      data: programmesAsJson(programmes),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch programmes" });
  }
});

router.get("/programme_catalogue/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const programme = await prisma.programme.findUnique({
      where: { programmeCode: code },
    });

    if (!programme) {
      return res.status(404).json({ error: "Programme not found" });
    }

    res.json(programmeAsJson(programme));
  } catch (error) {
    console.error("Code search error:", error);
    res.status(500).json({ error: "Failed to fetch programme" });
  }
});

async function runUnitUpserts(rows: UnitImportRow[]): Promise<{ inserted: number; updated: number }> {
  if (!rows.length) return { inserted: 0, updated: 0 };
  const keys = [...new Set(rows.map((r) => r.programmeUnits))];
  const existing = await prisma.unit.findMany({
    where: { programmeUnits: { in: keys } },
    select: { programmeUnits: true },
  });
  const existingSet = new Set(existing.map((e) => e.programmeUnits));
  let inserted = 0;
  let updated = 0;
  for (const r of rows) {
    if (existingSet.has(r.programmeUnits)) updated++;
    else inserted++;
  }

  const chunkSize = 40;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((data) =>
        prisma.unit.upsert({
          where: { programmeUnits: data.programmeUnits },
          create: data,
          update: {
            unitTitle: data.unitTitle,
            unitPrerequisite: data.unitPrerequisite,
            unitStudyType: data.unitStudyType,
            unitDescription: data.unitDescription,
            unitStudyPeriod: data.unitStudyPeriod,
            unitCredits: data.unitCredits,
          },
        })
      )
    );
  }
  return { inserted, updated };
}

router.post("/unit_catalogues/upload_units", multerSingleFile, async (req, res) => {
  try {
    let rows;
    if (req.file?.buffer) {
      rows = await readXlsxFile(req.file.buffer);
    } else if (typeof req.body?.path === "string" && req.body.path.trim()) {
      rows = await readXlsxFile(req.body.path.trim());
    } else {
      return res.status(400).json({
        error:
          'Upload an .xlsx as multipart field "file", or send JSON { "path": "<path on API server>" }',
      });
    }

    if (!rows.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const byKey = new Map<string, UnitImportRow>();

    for (const row of dataRows) {
      if (row.length === 0 || row.every((v) => v === null || v === "")) {
        continue;
      }

      const record: Record<string, unknown> = {};
      row.forEach((value, idx) => {
        const key = String(header[idx]);
        if (!key) return;
        if (key === "unit_study_type" && typeof value === "string") {
          record[key] = value.split(",").map((v) => v.trim());
        } else if (key === "unit_credits") {
          record[key] = Number(value);
        } else {
          record[key] = value;
        }
      });

      if (!record.programme_units) continue;
      const data = unitFromExcelRow(record);
      byKey.set(data.programmeUnits, data);
    }

    const list = [...byKey.values()];
    const { inserted, updated } = await runUnitUpserts(list);

    return res.json({
      success: true,
      message: "Upload processed successfully",
      inserted,
      updated,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: String(error) });
  }
});

router.get("/unit_catalogues/code", async (req, res) => {
  try {
    const raw = req.query.programme_units;
    const code = (Array.isArray(raw) ? String(raw[0] ?? "") : String(raw ?? "")).trim();
    if (!code) {
      return res.status(400).json({ error: "programme_units query parameter is required" });
    }

    const programme = await prisma.unit.findUnique({
      where: { programmeUnits: code },
    });

    if (!programme) {
      return res.status(404).json({ error: "Programme not found" });
    }

    res.json(unitAsJson(programme));
  } catch (error) {
    console.error("Code search error:", error);
    res.status(500).json({ error: "Failed to fetch programme" });
  }
});

export default router;
