import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import PolicyFileModel from "../models/Policy_File.ts";
import fs from "fs";
import path from "path";
import CoursesFiles from "../models/Courses_File.ts";
import readXlsxFile from "read-excel-file/node";
import UnitFile from "../models/Unit_File.ts";


const router = Router();



// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

/** Only parse multipart when needed so JSON { path } still works for server-side paths. */
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
    .replace(/\s+/g, " "); // collapse multiple spaces

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Upload a PDF from client request
router.post("/policy_files/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No PDF uploaded" });

    const file = await PolicyFileModel.create({
      filename: req.file.originalname,
      data: req.file.buffer,
      mimetype: req.file.mimetype,
    });

    res.json({ msg: "PDF stored in MongoDB", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Upload a PDF from filesystem (server-side)
router.post("/policy_files/upload-from-path", async (req, res) => {
  try {
    const filePath = req.body.path; // e.g., "D:/docs/myfile.pdf"
    if (!filePath) return res.status(400).json({ msg: "File path required" });

    const fileBuffer = fs.readFileSync(filePath);

    const file = await PolicyFileModel.create({
      filename: filePath.split("/").pop(),
      data: fileBuffer,
      mimetype: "application/pdf",
    });

    res.json({ msg: "PDF uploaded from filesystem", file });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload" });
  }
});

/** Only paths under this root (in the API container) are allowed. */
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

    let inserted = 0;
    let skippedExisting = 0;
    const errors: string[] = [];

    for (const name of names) {
      const full = path.join(dir, name);
      try {
        const existing = await PolicyFileModel.findOne({ filename: name });
        if (existing) {
          skippedExisting++;
          continue;
        }
        const fileBuffer = fs.readFileSync(full);
        await PolicyFileModel.create({
          filename: name,
          data: fileBuffer,
          mimetype: "application/pdf",
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

// search all PDFs and return metadata
router.get("/policy_files/all", async (req, res) => {
  try {
    console.log("Test route hit!");

    const files = await PolicyFileModel.find()
      .select("_id filename mimetype createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Search PDFs by filename
router.get("/policy_files/search/:name", async (req, res) => {
  try {
    const keyword = req.params.name;
    console.log("Searching for:", keyword);
    const files = await PolicyFileModel.find({
      filename: keyword ? { $regex: keyword, $options: "i" } : {},
    })
      .select("_id filename mimetype createdAt updatedAt")
      .sort({ createdAt: -1 });
    console.log("Found files:", files.length);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Download file
router.get("/policy_files/file/:id", async (req, res) => {
  const file = await PolicyFileModel.findById(req.params.id);
  if (!file) return res.status(404).send("File not found");

  res.contentType(file.mimetype);
  res.send(file.data);
});

router.post(
  "/programme_catalogue/upload_programmes",
  multerSingleFile,
  async (req, res) => {
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

      console.log("Excel rows:", rows.length);

      if (!rows.length) {
        return res.status(400).json({ error: "Excel file is empty" });
      }

      const header = rows[0]; // First row → column names
      const dataRows = rows.slice(1); // Following rows → data
      console.log("Header:", header);
      console.log("datarows:", dataRows.length);

      let inserted = 0;
      let updated = 0;

      for (const row of dataRows) {
        if (row.length === 0 || row.every((v) => v === null || v === "")) {
          continue; // skip empty rows
        }

        const record: any = {};

        // Map Excel columns → object
        row.forEach((value, idx) => {
          const key = String(header[idx]);

          if (!key) return;

          // Convert study type string → array
          if (key === "programme_study_type" && typeof value === "string") {
            record[key] = value.split(",").map((v) => v.trim());
          }
          // Convert credits to number
          else if (key === "programme_credits") {
            record[key] = Number(value);
          } else {
            record[key] = value;
          }
        });

        // Ensure required primary field exists
        if (!record.programme_code) continue;

        // Find existing record
        const existing = await CoursesFiles.findOne({
          programme_code: record.programme_code,
        });

        if (existing) {
          await CoursesFiles.updateOne(
            { programme_code: record.programme_code },
            { $set: record }
          );
          updated++;
        } else {
          await CoursesFiles.create(record);
          inserted++;
        }
      }

      return res.json({
        success: true,
        message: "Upload processed successfully",
        inserted,
        updated,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: error });
    }
  }
);

router.get("/programme_catalogue/search", async (req, res) => {
  try {
    const { programme_name, programme_level, programme_faculty } = req.query;

    const query: any = {};

    // Search by programme name (optional)
    if (programme_name && programme_name !== "all") {
      query.programme_name = { $regex: programme_name, $options: "i" };
    }

    // Filter by study level (SIQF / level)
    if (programme_level && programme_level !== "all") {
      query.programme_level = programme_level;
    }

    // Filter by faculty / school
    if (programme_faculty && programme_faculty !== "all") {
      if (programme_faculty && programme_faculty !== "all") {
        const normalizedFaculty = normalize(decodeURIComponent(String(programme_faculty)));
        const escapedFaculty = escapeRegex(normalizedFaculty);

        query.programme_faculty = {
          $regex: escapedFaculty,
          $options: "i",
        };
      }
    }
    console.log("Search query:", query);
    const programmes = await CoursesFiles.find(query)
      .sort({ programme_name: 1 });

    res.json({
      count: programmes.length,
      data: programmes,
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

    const query = {
      programme_level: "Undergraduate",
      programme_name: { $regex: programme_name.trim(), $options: "i" },
    };
    console.log("Undergraduate search query:", query);
    const programmes = await CoursesFiles.find(query)
      .sort({ programme_name: 1 });

    res.json({
      count: programmes.length,
      data: programmes,
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

    const query = {
      programme_level: "Postgraduate",
      programme_name: { $regex: programme_name.trim(), $options: "i" },
    };
    console.log("Postgraduate search query:", query);
    const programmes = await CoursesFiles.find(query)
      .sort({ programme_name: 1 });

    res.json({
      count: programmes.length,
      data: programmes,
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

    const query = {
      programme_level: "Postgraduate",
      programme_name: { $regex: programme_name.trim(), $options: "i" },
    };
    console.log("Postgraduate search query:", query);
    const programmes = await CoursesFiles.find(query)
      .sort({ programme_name: 1 });

    res.json({
      count: programmes.length,
      data: programmes,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch programmes" });
  }
});




router.get("/programme_catalogue/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // ONLY search by programme_code
    const programme = await CoursesFiles.findOne({
      programme_code: code,
    });

    if (!programme) {
      return res.status(404).json({ error: "Programme not found" });
    }

    res.json(programme);
  } catch (error) {
    console.error("Code search error:", error);
    res.status(500).json({ error: "Failed to fetch programme" });
  }
});

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

    console.log("Excel rows:", rows.length);

    if (!rows.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const header = rows[0]; // First row → column names
    const dataRows = rows.slice(1); // Following rows → data
    console.log("Header:", header);
    console.log("datarows:", dataRows.length);

    let inserted = 0;
    let updated = 0;

    for (const row of dataRows) {
      if (row.length === 0 || row.every((v) => v === null || v === "")) {
        continue; // skip empty rows
      }

      const record: any = {};

      // Map Excel columns → object
      row.forEach((value, idx) => {
        const key = String(header[idx]);

        if (!key) return;

        // Convert study type string → array
        if (key === "unit_study_type" && typeof value === "string") {
          record[key] = value.split(",").map((v) => v.trim());
        }
        // Convert credits to number
        else if (key === "unit_credits") {
          record[key] = Number(value);
        } else {
          record[key] = value;
        }
      });

      // Ensure required primary field exists
      if (!record.programme_units) continue;

      // Find existing record
      const existing = await UnitFile.findOne({
        programme_units: record.programme_units,
      });

      if (existing) {
        await UnitFile.updateOne(
          { programme_units: record.programme_units },
          { $set: record }
        );
        updated++;
      } else {
        await UnitFile.create(record);
        inserted++;
      }
    }

    return res.json({
      success: true,
      message: "Upload processed successfully",
      inserted,
      updated,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error });
  }
});

router.get("/unit_catalogues/code", async (req, res) => {
  try {
    const { programme_units } = req.query;

    // ONLY search by programme_units
    const programme = await UnitFile.findOne({
      programme_units: programme_units,
    });

    if (!programme) {
      return res.status(404).json({ error: "Programme not found" });
    }

    res.json(programme);
  } catch (error) {
    console.error("Code search error:", error);
    res.status(500).json({ error: "Failed to fetch programme" });
  }
});

export default router;
