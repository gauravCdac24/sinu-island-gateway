import { getApiUrl } from "@/lib/apiBase";

export type PublicVacancy = {
  vacancyNo: string;
  position: string;
  facultyDepartment: string;
  bandGrade?: string;
  dueDate: string;
  status?: "open" | "archived";
  keySelectionCriteria?: string[];
  archivedAt?: string | null;
};

export async function fetchOpenVacancies(): Promise<PublicVacancy[]> {
  const res = await fetch(getApiUrl("/job_vacancies"));
  const data = (await res.json()) as { vacancies?: PublicVacancy[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load vacancies");
  return data.vacancies ?? [];
}

export async function fetchArchivedVacancies(): Promise<PublicVacancy[]> {
  const res = await fetch(getApiUrl("/job_vacancies/archived"));
  const data = (await res.json()) as { vacancies?: PublicVacancy[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load archived vacancies");
  return data.vacancies ?? [];
}

export async function fetchVacancyDetail(vacancyNo: string) {
  const res = await fetch(getApiUrl(`/job_vacancies/${encodeURIComponent(vacancyNo)}`));
  const data = (await res.json()) as {
    vacancy?: PublicVacancy & Record<string, unknown>;
    canApply?: boolean;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || "Vacancy not found");
  return data;
}
