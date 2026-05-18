import { prisma } from "../lib/prisma.ts";

/** Archive published vacancies whose closing date has passed. */
export async function archiveExpiredVacancies(): Promise<number> {
  const now = new Date();
  const result = await prisma.jobVacancy.updateMany({
    where: {
      status: "published",
      closingDate: { not: null, lt: now },
    },
    data: {
      status: "archived",
      archivedAt: now,
    },
  });
  return result.count;
}

export function formatDueDate(d: Date | null | undefined): string {
  if (!d) return "Open until filled";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function vacancyToPublicRow(v: {
  vacancyNo: string;
  title: string;
  divisionDepartment: string;
  bandGrade: string | null;
  closingDate: Date | null;
  keySelectionCriteria: string[];
}) {
  return {
    vacancyNo: v.vacancyNo,
    position: v.title,
    facultyDepartment: v.divisionDepartment,
    bandGrade: v.bandGrade ?? undefined,
    dueDate: formatDueDate(v.closingDate),
    keySelectionCriteria: v.keySelectionCriteria,
  };
}
