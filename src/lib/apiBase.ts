/**
 * Base URL for the Express API (programme catalogue, policy files, etc.).
 * Never use VITE_API_URL_3000 here — that name historically pointed at the Vite dev server and returns HTML.
 *
 * Priority: VITE_API_URL (e.g. "/api" behind nginx) → VITE_API_URL_7000 → VITE_API_HOST + VITE_API_PORT.
 * Use this for every fetch to programme_catalogue, unit_catalogues, policy_files, etc.
 */
export function getApiBaseUrl(): string {
  const generic = import.meta.env.VITE_API_URL;
  if (generic != null && String(generic).trim() !== '') {
    return String(generic).replace(/\/$/, '');
  }

  const legacy7000 = import.meta.env.VITE_API_URL_7000;
  if (legacy7000 != null && String(legacy7000).trim() !== '') {
    return String(legacy7000).replace(/\/$/, '');
  }

  const host = import.meta.env.VITE_API_HOST || 'localhost';
  const port = import.meta.env.VITE_API_PORT || '7000';
  return `http://${host}:${port}`;
}

/**
 * Full URL for an API route. Pass path starting with / (e.g. "/programme_catalogue/search?x=1").
 */
export function getApiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
