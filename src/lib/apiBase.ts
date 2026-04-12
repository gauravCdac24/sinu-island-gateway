/**
 * Base URL for the Express API (programme catalogue, policy files, etc.).
 * Never use VITE_API_URL_3000 here — that name historically pointed at the Vite dev server and returns HTML.
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
