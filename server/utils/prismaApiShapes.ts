import type { PolicyFile, Programme, StudentApplication, Unit } from "@prisma/client";
import { Prisma } from "@prisma/client";

export function policyFileMeta(file: Pick<PolicyFile, "id" | "filename" | "mimetype" | "createdAt" | "updatedAt">) {
  return {
    _id: file.id,
    filename: file.filename,
    mimetype: file.mimetype,
    createdAt: file.createdAt?.toISOString(),
    updatedAt: file.updatedAt?.toISOString(),
  };
}

function programmeToApiShape(p: Programme) {
  return {
    _id: p.id,
    programme_code: p.programmeCode,
    programme_name: p.programmeName,
    programme_department: p.programmeDepartment ?? undefined,
    programme_faculty: p.programmeFaculty ?? undefined,
    SIQF_level: p.siqfLevel ?? undefined,
    programme_entry_requirement: p.programmeEntryRequirement ?? undefined,
    programme_credits: p.programmeCredits ?? undefined,
    programme_year: p.programmeYear ?? undefined,
    programme_study_type: p.programmeStudyType ?? [],
    programme_description: p.programmeDescription ?? undefined,
    programme_location: p.programmeLocation,
    programme_study_period: p.programmeStudyPeriod ?? undefined,
    programme_english_requirement: p.programmeEnglishRequirement ?? undefined,
    programme_level: p.programmeLevel ?? undefined,
    programme_units: p.programmeUnits ?? undefined,
  };
}

export function programmeAsJson(p: Programme) {
  return programmeToApiShape(p);
}

export function programmesAsJson(rows: Programme[]) {
  return rows.map(programmeToApiShape);
}

function unitToApiShape(u: Unit) {
  return {
    _id: u.id,
    programme_units: u.programmeUnits,
    unit_title: u.unitTitle ?? undefined,
    unit_prerequisite: u.unitPrerequisite ?? undefined,
    unit_study_type: u.unitStudyType ?? [],
    unit_description: u.unitDescription ?? undefined,
    unit_study_period: u.unitStudyPeriod ?? [],
    unit_credits: u.unitCredits ?? undefined,
  };
}

export function unitAsJson(u: Unit) {
  return unitToApiShape(u);
}

export function unitsAsJson(rows: Unit[]) {
  return rows.map(unitToApiShape);
}

/** API shape aligned with former Mongoose JSON (camelCase fields + `_id`).
 *  Sensitive fields (passwordHash, OTP) are never included in the response.
 */
export function studentApplicationAsApiJson(
  app: Omit<StudentApplication, "passwordHash" | "otpCode" | "otpExpiresAt" | "otpAttempts">
) {
  const { id, ...rest } = app;
  return {
    _id: id,
    ...rest,
  };
}

export function studentApplicationListItem(app: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  programmes: Prisma.JsonValue;
}) {
  return {
    _id: app.id,
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    status: app.status,
    createdAt: app.createdAt,
    programmes: app.programmes,
  };
}
