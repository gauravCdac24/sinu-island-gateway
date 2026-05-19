import { prisma } from "../lib/prisma.ts";

export function formatClosingDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Pacific/Guadalcanal",
  });
}

export function isPastClosing(d: Date | null | undefined): boolean {
  if (!d) return false;
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < Date.now();
}

export async function archiveExpiredTenders(): Promise<number> {
  const now = new Date();
  const result = await prisma.tenderEoi.updateMany({
    where: {
      status: "published",
      closingDate: { lt: now },
    },
    data: {
      status: "archived",
      archivedAt: now,
    },
  });
  return result.count;
}

type TenderWithDocs = {
  id: string;
  referenceNo: string | null;
  title: string;
  description: string;
  department: string;
  type: string;
  closingDate: Date;
  status: string;
  publishedAt: Date | null;
  archivedAt: Date | null;
  documents: { id: string; slot: number; label: string | null; filename: string }[];
};

export function tenderToPublicRow(t: TenderWithDocs) {
  const closed = isPastClosing(t.closingDate);
  return {
    id: t.id,
    referenceNo: t.referenceNo,
    title: t.title,
    description: t.description,
    department: t.department,
    type: t.type as "tender" | "eoi",
    closingDate: t.closingDate.toISOString().slice(0, 10),
    closingDateFormatted: formatClosingDate(t.closingDate),
    isClosed: closed,
    documents: t.documents
      .sort((a, b) => a.slot - b.slot)
      .map((d) => ({
        id: d.id,
        slot: d.slot,
        label: d.label || d.filename,
        filename: d.filename,
        url: `/tenders-eoi/documents/${d.id}`,
      })),
  };
}
