import { getApiUrl } from "@/lib/apiBase";
import { authHeaders, getHrToken } from "@/lib/authStorage";

export type HrVacancyPayload = {
  vacancyNo: string;
  title: string;
  divisionDepartment: string;
  locationCampus: string;
  bandGrade?: string;
  staffCategory?: string;
  reportsTo?: string;
  summaryOfDuties?: string;
  mainDuties?: string;
  dimensions?: string;
  generalResponsibilities?: string;
  qualificationsRequired?: string;
  experienceRequired?: string;
  minimumQualificationExperience?: string;
  salaryRange?: string;
  employmentType?: string;
  termsAndConditions?: string;
  keySelectionCriteria: string[];
  closingDate?: string;
};

export async function hrFetch(path: string, init?: RequestInit) {
  const res = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      ...authHeaders(getHrToken()),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data;
}
