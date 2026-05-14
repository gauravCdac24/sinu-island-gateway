export interface ProgrammeImportRow {
  programmeCode: string;
  programmeName: string;
  programmeLocation: string;
  programmeDepartment?: string | null;
  programmeFaculty?: string | null;
  siqfLevel?: string | null;
  programmeEntryRequirement?: string | null;
  programmeCredits?: number | null;
  programmeYear?: string | null;
  programmeStudyType: string[];
  programmeDescription?: string | null;
  programmeStudyPeriod?: string | null;
  programmeEnglishRequirement?: string | null;
  programmeLevel?: string | null;
  programmeUnits?: string | null;
}

export interface UnitImportRow {
  programmeUnits: string;
  unitTitle?: string | null;
  unitPrerequisite?: string | null;
  unitStudyType: string[];
  unitDescription?: string | null;
  unitStudyPeriod: string[];
  unitCredits?: number | null;
}

export function programmeFromExcelRow(record: Record<string, unknown>): ProgrammeImportRow {
  const str = (k: string) => {
    const v = record[k];
    if (v === null || v === undefined || v === "") return undefined;
    return String(v);
  };

  const code = String(record.programme_code ?? "").trim();
  const studyType =
    record.programme_study_type == null
      ? []
      : Array.isArray(record.programme_study_type)
        ? (record.programme_study_type as unknown[]).map(String)
        : typeof record.programme_study_type === "string"
          ? String(record.programme_study_type)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

  const creditsRaw = record.programme_credits;
  const creditsNum =
    creditsRaw === null || creditsRaw === undefined || creditsRaw === ""
      ? undefined
      : Number(creditsRaw);

  return {
    programmeCode: code,
    programmeName: str("programme_name") ?? "",
    programmeLocation: str("programme_location") ?? "",
    programmeDepartment: str("programme_department"),
    programmeFaculty: str("programme_faculty"),
    siqfLevel: str("SIQF_level"),
    programmeEntryRequirement: str("programme_entry_requirement"),
    programmeCredits: Number.isFinite(creditsNum) ? creditsNum : undefined,
    programmeYear: str("programme_year"),
    programmeStudyType: studyType,
    programmeDescription: str("programme_description"),
    programmeStudyPeriod: str("programme_study_period"),
    programmeEnglishRequirement: str("programme_english_requirement"),
    programmeLevel: str("programme_level"),
    programmeUnits: str("programme_units"),
  };
}

export function unitFromExcelRow(record: Record<string, unknown>): UnitImportRow {
  const str = (k: string) => {
    const v = record[k];
    if (v === null || v === undefined || v === "") return undefined;
    return String(v);
  };

  const code = String(record.programme_units ?? "").trim();
  const studyType =
    record.unit_study_type == null
      ? []
      : Array.isArray(record.unit_study_type)
        ? (record.unit_study_type as unknown[]).map(String)
        : typeof record.unit_study_type === "string"
          ? String(record.unit_study_type)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

  const period =
    record.unit_study_period == null
      ? []
      : Array.isArray(record.unit_study_period)
        ? (record.unit_study_period as unknown[]).map(String)
        : typeof record.unit_study_period === "string"
          ? String(record.unit_study_period)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

  const creditsRaw = record.unit_credits;
  const creditsNum =
    creditsRaw === null || creditsRaw === undefined || creditsRaw === ""
      ? undefined
      : Number(creditsRaw);

  return {
    programmeUnits: code,
    unitTitle: str("unit_title"),
    unitPrerequisite: str("unit_prerequisite"),
    unitStudyType: studyType,
    unitDescription: str("unit_description"),
    unitStudyPeriod: period,
    unitCredits: Number.isFinite(creditsNum) ? creditsNum : undefined,
  };
}
