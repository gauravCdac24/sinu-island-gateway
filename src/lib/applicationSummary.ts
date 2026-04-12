export type ApplicationSnapshot = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residentialAddress: string;
  programmes: { priority: number; code: string; name: string }[];
  profileImageName: string;
  studyDocNames: string[];
  certificateNames: string[];
  sopNames: string[];
  englishNames: string[];
  submittedAtIso: string;
};

export function buildApplicationSummaryHtml(
  s: ApplicationSnapshot,
  applicationId: string
): string {
  const esc = (t: string) =>
    t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const progRows = s.programmes
    .sort((a, b) => a.priority - b.priority)
    .map(
      (p) =>
        `<tr><td>${p.priority}</td><td>${esc(p.code)}</td><td>${esc(p.name)}</td></tr>`
    )
    .join("");

  const list = (names: string[]) =>
    names.length
      ? `<ul>${names.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`
      : "<p>—</p>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>SINU application summary</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.5; color: #111; max-width: 720px; margin: 0 auto; padding: 24px; }
  h1 { color: #0b2c55; font-size: 1.5rem; margin-bottom: 0.25rem; }
  .meta { color: #555; font-size: 0.875rem; margin-bottom: 1.5rem; }
  h2 { color: #0b2c55; font-size: 1.1rem; margin-top: 1.25rem; margin-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th, td { text-align: left; padding: 6px 8px; border: 1px solid #e5e7eb; }
  th { background: #f9fafb; }
  ul { margin: 0.25rem 0; padding-left: 1.25rem; }
  @media print { body { padding: 12px; } }
</style>
</head>
<body>
  <h1>Solomon Islands National University</h1>
  <p class="meta"><strong>Application summary</strong><br/>
  Reference ID: ${esc(applicationId)}<br/>
  Generated: ${esc(new Date(s.submittedAtIso).toLocaleString())}</p>

  <h2>Applicant</h2>
  <p><strong>Full name:</strong> ${esc(s.fullName)}<br/>
  <strong>Email:</strong> ${esc(s.email)}<br/>
  <strong>Phone:</strong> ${esc(s.phone)}<br/>
  <strong>Date of birth:</strong> ${esc(s.dateOfBirth)}<br/>
  <strong>Gender:</strong> ${esc(s.gender)}<br/>
  <strong>Nationality:</strong> ${esc(s.nationality)}<br/>
  <strong>Residential address:</strong> ${esc(s.residentialAddress)}</p>

  <h2>Programme choices (priority)</h2>
  <table>
    <thead><tr><th>Priority</th><th>Code</th><th>Programme</th></tr></thead>
    <tbody>${progRows}</tbody>
  </table>

  <h2>Uploads (file names)</h2>
  <p><strong>Profile photo:</strong> ${esc(s.profileImageName || "—")}</p>
  <p><strong>Study documents:</strong></p>${list(s.studyDocNames)}
  <p><strong>Certificates:</strong></p>${list(s.certificateNames)}
  <p><strong>Statement of purpose (SOP):</strong></p>${list(s.sopNames)}
  <p><strong>English language requirement:</strong></p>${list(s.englishNames)}

  <p style="margin-top:2rem;font-size:0.8rem;color:#666;">This summary reflects your online submission. Keep a copy for your records.</p>
</body>
</html>`;
}
