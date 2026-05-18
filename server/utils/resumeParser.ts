import mammoth from "mammoth";

// pdf-parse v1 default export (compatible with Node 18 + ts-node)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (
  buffer: Buffer
) => Promise<{ text: string }>;

export type ResumeExtracted = {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  yearsExperience?: string;
  lastEmployer?: string;
  lastPosition?: string;
  skills?: string[];
  education?: string[];
  rawTextPreview?: string;
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{2,4})?/;
const DATE_RE =
  /\b(?:\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b/i;

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\t/g, " ").replace(/ +/g, " ").trim();
}

function lineValue(text: string, labels: string[]): string | undefined {
  const lines = text.split("\n");
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const label of labels) {
      if (lower.startsWith(label.toLowerCase())) {
        const val = line.slice(line.indexOf(":") + 1).trim();
        if (val) return val;
      }
    }
  }
  return undefined;
}

function guessName(text: string): string | undefined {
  const labeled =
    lineValue(text, ["full name", "name", "applicant name"]) ||
    lineValue(text, ["Name"]);
  if (labeled && labeled.length > 2 && labeled.length < 80) return labeled;

  const firstLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && l.length < 60);
  for (const line of firstLines.slice(0, 8)) {
    if (EMAIL_RE.test(line) || PHONE_RE.test(line)) continue;
    if (/^(curriculum vitae|resume|cv)$/i.test(line)) continue;
    if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z'.-]+){1,4}$/.test(line)) return line;
  }
  return undefined;
}

function guessLastEmployer(text: string): string | undefined {
  const experienceBlock = text.match(
    /(?:experience|employment|work history)[\s\S]{0,1200}/i
  )?.[0];
  const block = experienceBlock || text;
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/employer|company|organization|organisation/i.test(line)) {
      const after = line.split(/[:|]/).slice(1).join(":").trim();
      if (after) return after;
      const next = lines[i + 1];
      if (next && next.length < 80) return next;
    }
  }

  for (const line of lines) {
    if (
      /\b(ltd|limited|inc|corp|university|college|ministry|department|pty)\b/i.test(
        line
      ) &&
      line.length < 100
    ) {
      return line;
    }
  }
  return undefined;
}

function guessYearsExperience(text: string): string | undefined {
  const m = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (m) return m[1];
  const range = text.match(/(\d{4})\s*[-–]\s*(?:present|current|\d{4})/gi);
  if (range && range.length > 0) {
    const years = range
      .map((r) => parseInt(r.slice(0, 4), 10))
      .filter((y) => y > 1970 && y <= new Date().getFullYear());
    if (years.length > 0) {
      const earliest = Math.min(...years);
      return String(new Date().getFullYear() - earliest);
    }
  }
  return undefined;
}

function guessDateOfBirth(text: string): string | undefined {
  const labeled = lineValue(text, [
    "date of birth",
    "dob",
    "birth date",
    "born",
  ]);
  if (labeled) {
    const d = labeled.match(DATE_RE);
    if (d) return d[0];
  }
  const born = text.match(/(?:born|dob|date of birth)[:\s]+([^\n]{4,30})/i);
  if (born) {
    const d = born[1].match(DATE_RE);
    if (d) return d[0];
  }
  return undefined;
}

export function extractFromResumeText(raw: string): ResumeExtracted {
  const text = normalizeText(raw);
  const email = text.match(EMAIL_RE)?.[0];
  const phone =
    lineValue(text, ["phone", "mobile", "cell", "telephone", "tel"]) ||
    text.match(PHONE_RE)?.[0];

  const skillsBlock = text.match(/(?:skills|competencies)[:\s]*([\s\S]{0,400})/i)?.[1];
  const skills = skillsBlock
    ? skillsBlock
        .split(/[,•|;\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 60)
        .slice(0, 12)
    : undefined;

  const educationMatches = text.match(
    /(?:bachelor|master|phd|diploma|certificate|b\.?sc|m\.?sc)[^\n]{0,120}/gi
  );

  return {
    fullName: guessName(text),
    email,
    phone: phone?.replace(/\s{2,}/g, " ").trim(),
    dateOfBirth: guessDateOfBirth(text),
    address: lineValue(text, ["address", "residential address", "location"]),
    yearsExperience: guessYearsExperience(text),
    lastEmployer: guessLastEmployer(text),
    lastPosition: lineValue(text, [
      "position",
      "job title",
      "role",
      "designation",
    ]),
    skills,
    education: educationMatches?.slice(0, 6),
    rawTextPreview: text.slice(0, 500),
  };
}

export async function extractTextFromResumeBuffer(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const ext = originalName.toLowerCase().split(".").pop() || "";
  if (ext === "pdf") {
    const data = await pdfParse(buffer);
    return data.text || "";
  }
  if (ext === "docx" || ext === "doc") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }
  if (ext === "txt") {
    return buffer.toString("utf-8");
  }
  throw new Error("Unsupported resume format. Upload PDF, DOCX, or TXT.");
}

export async function parseResumeFile(
  buffer: Buffer,
  originalName: string
): Promise<ResumeExtracted> {
  const text = await extractTextFromResumeBuffer(buffer, originalName);
  if (!text.trim()) {
    return { rawTextPreview: "" };
  }
  return extractFromResumeText(text);
}
