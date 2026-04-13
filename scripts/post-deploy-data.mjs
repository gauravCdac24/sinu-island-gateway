/**
 * Post-deploy data import (runs on the host where Excel/PDFs live).
 * Edit scripts/post-deploy-data.config.json — all paths are on the host machine.
 *
 * Routes:
 *   POST /policy_files/upload                    multipart field "pdf"
 *   POST /programme_catalogue/upload_programmes  multipart field "file"
 *   POST /unit_catalogues/upload_units           multipart field "file"
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const XLSX_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const configPath =
  process.env.POST_DEPLOY_CONFIG ||
  path.join(REPO_ROOT, "scripts", "post-deploy-data.config.json");

function loadConfig() {
  if (!existsSync(configPath)) {
    console.error(`Missing config: ${configPath}`);
    console.error("Copy scripts/post-deploy-data.config.example.json and edit paths.");
    process.exit(1);
  }
  const raw = readFileSync(configPath, "utf8");
  return JSON.parse(raw);
}

function resolveHostPath(p) {
  if (!p || typeof p !== "string") return null;
  const trimmed = p.trim();
  if (!trimmed) return null;
  return path.isAbsolute(trimmed) ? trimmed : path.resolve(REPO_ROOT, trimmed);
}

async function fetchOk(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${url} → ${res.status}: ${text.slice(0, 500)}`);
  }
  return data;
}

async function postMultipart(apiBase, route, fieldName, hostFilePath, mime) {
  const abs = resolveHostPath(hostFilePath);
  if (!abs || !existsSync(abs)) {
    throw new Error(`File not found: ${hostFilePath}`);
  }
  const buf = readFileSync(abs);
  const name = path.basename(abs);
  const form = new FormData();
  form.append(fieldName, new Blob([buf], { type: mime }), name);
  const url = `${apiBase.replace(/\/$/, "")}/api${route}`;
  return fetchOk(url, { method: "POST", body: form });
}

async function getJson(apiBase, route) {
  const url = `${apiBase.replace(/\/$/, "")}/api${route}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} → ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

async function main() {
  const cfg = loadConfig();
  const apiBase =
    process.env.POST_DEPLOY_BASE_URL || cfg.apiBase || "http://127.0.0.1:3000";
  const p = cfg.paths || {};
  const skipExisting = Boolean(cfg.skipExistingPolicyFilenames);

  console.log(`API base: ${apiBase}${process.env.POST_DEPLOY_BASE_URL ? " (from POST_DEPLOY_BASE_URL)" : ""}`);
  console.log(`Config: ${configPath}\n`);

  let existingNames = new Set();
  if (skipExisting) {
    try {
      const list = await getJson(apiBase, "/policy_files/all");
      existingNames = new Set(
        (Array.isArray(list) ? list : []).map((f) => f.filename).filter(Boolean)
      );
      console.log(`Existing policy filenames in DB: ${existingNames.size}`);
    } catch (e) {
      console.warn("Could not load policy_files/all for skip check:", e.message);
    }
  }

  const hostPolicyDir = p.policyPdfsHostDir
    ? resolveHostPath(p.policyPdfsHostDir)
    : null;

  if (hostPolicyDir && existsSync(hostPolicyDir)) {
    const pdfs = readdirSync(hostPolicyDir).filter((f) =>
      f.toLowerCase().endsWith(".pdf")
    );
    console.log(`Policy PDFs (${hostPolicyDir}): ${pdfs.length} file(s)`);
    for (const name of pdfs) {
      if (skipExisting && existingNames.has(name)) {
        console.log(`  skip (exists): ${name}`);
        continue;
      }
      const abs = path.join(hostPolicyDir, name);
      console.log(`  POST policy_files/upload: ${abs}`);
      const out = await postMultipart(
        apiBase,
        "/policy_files/upload",
        "pdf",
        abs,
        "application/pdf"
      );
      console.log(`    →`, out.msg || out.file?._id || JSON.stringify(out).slice(0, 120));
    }
  } else if (p.policyPdfsHostDir) {
    console.warn(`Policy host directory missing (skip policies): ${hostPolicyDir}`);
  }

  const progHost = (p.programmesExcelHostPath || "").trim();
  if (progHost) {
    console.log(`\nPOST programme_catalogue/upload_programmes (file): ${resolveHostPath(progHost)}`);
    const out = await postMultipart(
      apiBase,
      "/programme_catalogue/upload_programmes",
      "file",
      progHost,
      XLSX_TYPE
    );
    console.log("→", out);
  } else {
    console.log("\n(programmes Excel skipped — set paths.programmesExcelHostPath)");
  }

  const unitsHost = (p.unitsExcelHostPath || "").trim();
  if (unitsHost) {
    console.log(`\nPOST unit_catalogues/upload_units (file): ${resolveHostPath(unitsHost)}`);
    const out = await postMultipart(
      apiBase,
      "/unit_catalogues/upload_units",
      "file",
      unitsHost,
      XLSX_TYPE
    );
    console.log("→", out);
  } else {
    console.log("\n(units Excel skipped — set paths.unitsExcelHostPath)");
  }

  console.log("\npost-deploy-data finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
