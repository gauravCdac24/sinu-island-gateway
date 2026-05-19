import { getApiUrl } from "@/lib/apiBase";

export type TenderDocument = {
  id: string;
  slot: number;
  label: string;
  filename: string;
  url: string;
};

export type PublicTender = {
  id: string;
  referenceNo: string | null;
  title: string;
  description: string;
  department: string;
  type: "tender" | "eoi";
  closingDate: string;
  closingDateFormatted: string;
  isClosed: boolean;
  documents: TenderDocument[];
};

export type TenderListParams = {
  type?: "tender" | "eoi" | "";
  sort?: "closing_asc" | "closing_desc";
  includeClosed?: boolean;
};

export async function fetchPublishedTenders(params: TenderListParams = {}): Promise<PublicTender[]> {
  const q = new URLSearchParams();
  if (params.type) q.set("type", params.type);
  if (params.sort) q.set("sort", params.sort);
  if (params.includeClosed) q.set("includeClosed", "true");
  const suffix = q.toString() ? `?${q.toString()}` : "";
  const res = await fetch(getApiUrl(`/tenders-eoi${suffix}`));
  const data = (await res.json()) as { items?: PublicTender[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load tenders");
  return data.items ?? [];
}

export function tenderDocumentUrl(docId: string): string {
  return getApiUrl(`/tenders-eoi/documents/${docId}`);
}
