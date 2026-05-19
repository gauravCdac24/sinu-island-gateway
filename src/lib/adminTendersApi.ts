import { getApiUrl } from "@/lib/apiBase";
import { authHeaders, getAdminToken } from "@/lib/authStorage";

export type AdminTenderRow = {
  id: string;
  referenceNo: string | null;
  title: string;
  department: string;
  type: "tender" | "eoi";
  closingDate: string;
  closingDateFormatted: string;
  status: string;
  isClosed: boolean;
  documentCount: number;
};

export type AdminTenderDetail = {
  id: string;
  referenceNo: string;
  title: string;
  description: string;
  department: string;
  type: "tender" | "eoi";
  closingDate: string;
  status: string;
  documents: { id: string; slot: number; label: string | null; filename: string }[];
};

export async function adminTendersFetch(path: string, init?: RequestInit) {
  const res = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      ...authHeaders(getAdminToken()),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data;
}

export async function saveTenderFormData(
  id: string | undefined,
  form: FormData
): Promise<{ id: string }> {
  const path = id ? `/admin/tenders-eoi/${id}` : "/admin/tenders-eoi";
  const method = id ? "PATCH" : "POST";
  const res = await fetch(getApiUrl(path), {
    method,
    headers: authHeaders(getAdminToken()),
    body: form,
  });
  const data = (await res.json()) as { id?: string; item?: { id: string }; error?: string };
  if (!res.ok) throw new Error(data.error || "Save failed");
  return { id: data.id || data.item?.id || id || "" };
}
