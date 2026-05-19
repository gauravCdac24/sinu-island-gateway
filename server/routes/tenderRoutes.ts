import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma.ts";
import { verifyAdminToken } from "../utils/adminToken.ts";
import {
  archiveExpiredTenders,
  formatClosingDate,
  isPastClosing,
  tenderToPublicRow,
} from "../utils/tenderEoiLifecycle.ts";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

const tenderUpload = upload.fields([
  { name: "document1", maxCount: 1 },
  { name: "document2", maxCount: 1 },
  { name: "document3", maxCount: 1 },
]);

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
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

function parseType(raw: unknown): "tender" | "eoi" | null {
  const t = String(raw || "").trim().toLowerCase();
  if (t === "tender" || t === "eoi") return t;
  return null;
}

type TenderBody = {
  referenceNo?: string;
  title?: string;
  description?: string;
  department?: string;
  type?: string;
  closingDate?: unknown;
  documentLabel1?: string;
  documentLabel2?: string;
  documentLabel3?: string;
};

function tenderDataFromBody(body: TenderBody) {
  return {
    referenceNo: String(body.referenceNo || "").trim() || null,
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    department: String(body.department || "").trim(),
    type: parseType(body.type),
    closingDate: parseClosingDate(body.closingDate),
    labels: [
      String(body.documentLabel1 || "").trim() || null,
      String(body.documentLabel2 || "").trim() || null,
      String(body.documentLabel3 || "").trim() || null,
    ] as (string | null)[],
  };
}

function multerBufferToPrismaBytes(buffer: Buffer): Uint8Array<ArrayBuffer> {
  return Buffer.from(buffer) as unknown as Uint8Array<ArrayBuffer>;
}

async function upsertDocuments(
  tenderId: string,
  files: Express.Multer.File[] | undefined,
  labels: (string | null)[]
) {
  if (!files?.length) return;
  for (let slot = 1; slot <= 3; slot++) {
    const file = files.find((f) => f.fieldname === `document${slot}`);
    if (!file) continue;
    const label = labels[slot - 1];
    const pdfData = multerBufferToPrismaBytes(file.buffer);
    await prisma.tenderEoiDocument.upsert({
      where: { tenderId_slot: { tenderId, slot } },
      create: {
        tenderId,
        slot,
        label,
        filename: file.originalname,
        data: pdfData,
        mimetype: file.mimetype || "application/pdf",
      },
      update: {
        label,
        filename: file.originalname,
        data: pdfData,
        mimetype: file.mimetype || "application/pdf",
      },
    });
  }
}

async function loadTenderWithDocs(id: string) {
  return prisma.tenderEoi.findUnique({
    where: { id },
    include: { documents: { orderBy: { slot: "asc" } } },
  });
}

// ——— Public ———

router.get("/tenders-eoi", async (req, res) => {
  try {
    await archiveExpiredTenders();
    const typeFilter = String(req.query.type || "").trim().toLowerCase();
    const sort = String(req.query.sort || "closing_asc").trim();
    const includeClosed = req.query.includeClosed === "true";

    const where: {
      status: string;
      type?: string;
    } = { status: "published" };
    if (typeFilter === "tender" || typeFilter === "eoi") {
      where.type = typeFilter;
    }

    const rows = await prisma.tenderEoi.findMany({
      where,
      include: { documents: true },
      orderBy: { closingDate: sort === "closing_desc" ? "desc" : "asc" },
    });

    let items = rows.map(tenderToPublicRow);
    if (!includeClosed) {
      items = items.filter((r) => !r.isClosed);
    }

    return res.json({ ok: true, items });
  } catch (e) {
    console.error("tenders-eoi list:", e);
    return res.status(500).json({ error: "Failed to load tenders and EOI." });
  }
});

router.get("/tenders-eoi/documents/:id", async (req, res) => {
  try {
    const doc = await prisma.tenderEoiDocument.findUnique({
      where: { id: String(req.params.id) },
      include: { tender: { select: { status: true } } },
    });
    if (!doc) return res.status(404).send("Document not found");
    if (doc.tender.status !== "published" && doc.tender.status !== "archived") {
      return res.status(404).send("Document not found");
    }
    res.contentType(doc.mimetype);
    res.setHeader("Content-Disposition", `inline; filename="${doc.filename}"`);
    return res.send(Buffer.from(doc.data));
  } catch (e) {
    console.error("tender document:", e);
    return res.status(500).send("Failed to load document");
  }
});

// ——— Admin ———

router.get("/admin/tenders-eoi", adminAuth, async (req, res) => {
  try {
    await archiveExpiredTenders();
    const status = String(req.query.status || "").trim();
    const where = status ? { status } : {};
    const rows = await prisma.tenderEoi.findMany({
      where,
      include: { documents: true },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({
      ok: true,
      items: rows.map((t) => ({
        id: t.id,
        referenceNo: t.referenceNo,
        title: t.title,
        department: t.department,
        type: t.type,
        closingDate: t.closingDate.toISOString().slice(0, 10),
        closingDateFormatted: formatClosingDate(t.closingDate),
        status: t.status,
        isClosed: isPastClosing(t.closingDate),
        documentCount: t.documents.length,
        publishedAt: t.publishedAt?.toISOString() ?? null,
      })),
    });
  } catch (e) {
    console.error("admin tenders list:", e);
    return res.status(500).json({ error: "Failed to list tenders." });
  }
});

router.get("/admin/tenders-eoi/:id", adminAuth, async (req, res) => {
  try {
    const t = await loadTenderWithDocs(String(req.params.id));
    if (!t) return res.status(404).json({ error: "Not found." });
    return res.json({
      ok: true,
      item: {
        id: t.id,
        referenceNo: t.referenceNo || "",
        title: t.title,
        description: t.description,
        department: t.department,
        type: t.type,
        closingDate: t.closingDate.toISOString().slice(0, 10),
        status: t.status,
        documents: t.documents.map((d) => ({
          id: d.id,
          slot: d.slot,
          label: d.label,
          filename: d.filename,
        })),
      },
    });
  } catch (e) {
    console.error("admin tender detail:", e);
    return res.status(500).json({ error: "Failed to load tender." });
  }
});

router.post("/admin/tenders-eoi", adminAuth, (req, res) => {
  tenderUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed." });
    }
    try {
      const data = tenderDataFromBody(req.body as TenderBody);
      if (!data.title || !data.description || !data.department || !data.type || !data.closingDate) {
        return res.status(400).json({
          error: "Title, description, department, type, and closing date are required.",
        });
      }

      const created = await prisma.tenderEoi.create({
        data: {
          referenceNo: data.referenceNo,
          title: data.title,
          description: data.description,
          department: data.department,
          type: data.type!,
          closingDate: data.closingDate!,
          status: "draft",
        },
      });

      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const flat: Express.Multer.File[] = [];
      if (files) {
        for (const key of ["document1", "document2", "document3"]) {
          const f = files[key]?.[0];
          if (f) {
            f.fieldname = key;
            flat.push(f);
          }
        }
      }
      await upsertDocuments(created.id, flat, data.labels);

      const full = await loadTenderWithDocs(created.id);
      return res.status(201).json({ ok: true, id: created.id, item: full });
    } catch (e) {
      console.error("admin create tender:", e);
      return res.status(500).json({ error: "Could not create tender/EOI." });
    }
  });
});

router.patch("/admin/tenders-eoi/:id", adminAuth, (req, res) => {
  tenderUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed." });
    }
    try {
      const id = String(req.params.id);
      const existing = await prisma.tenderEoi.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Not found." });
      if (existing.status === "archived") {
        return res.status(400).json({ error: "Archived items cannot be edited." });
      }

      const data = tenderDataFromBody(req.body as TenderBody);
      await prisma.tenderEoi.update({
        where: { id },
        data: {
          ...(data.referenceNo !== undefined && { referenceNo: data.referenceNo }),
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.department && { department: data.department }),
          ...(data.type && { type: data.type }),
          ...(data.closingDate && { closingDate: data.closingDate }),
        },
      });

      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const flat: Express.Multer.File[] = [];
      if (files) {
        for (const key of ["document1", "document2", "document3"]) {
          const f = files[key]?.[0];
          if (f) {
            f.fieldname = key;
            flat.push(f);
          }
        }
      }
      await upsertDocuments(id, flat, data.labels);

      const full = await loadTenderWithDocs(id);
      return res.json({ ok: true, item: full });
    } catch (e) {
      console.error("admin patch tender:", e);
      return res.status(500).json({ error: "Could not update tender/EOI." });
    }
  });
});

router.post("/admin/tenders-eoi/:id/publish", adminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const t = await prisma.tenderEoi.findUnique({
      where: { id },
      include: { documents: true },
    });
    if (!t) return res.status(404).json({ error: "Not found." });
    if (t.status === "archived") {
      return res.status(400).json({ error: "Cannot publish an archived item." });
    }
    if (!t.title || !t.description || !t.department) {
      return res.status(400).json({ error: "Complete all required fields before publishing." });
    }

    const updated = await prisma.tenderEoi.update({
      where: { id },
      data: { status: "published", publishedAt: new Date(), archivedAt: null },
      include: { documents: true },
    });
    return res.json({ ok: true, item: tenderToPublicRow(updated) });
  } catch (e) {
    console.error("admin publish tender:", e);
    return res.status(500).json({ error: "Could not publish." });
  }
});

router.post("/admin/tenders-eoi/:id/archive", adminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const t = await prisma.tenderEoi.findUnique({ where: { id } });
    if (!t) return res.status(404).json({ error: "Not found." });
    const updated = await prisma.tenderEoi.update({
      where: { id },
      data: { status: "archived", archivedAt: new Date() },
    });
    return res.json({ ok: true, item: updated });
  } catch (e) {
    console.error("admin archive tender:", e);
    return res.status(500).json({ error: "Could not archive." });
  }
});

export default router;
