export type ResumeExtracted = {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  yearsExperience?: string;
  lastEmployer?: string;
  lastPosition?: string;
  skills?: string[];
  education?: string[];
  rawTextPreview?: string;
};

export type QualificationRow = {
  qualification: string;
  name: string;
  institution: string;
};

export type EmploymentRow = {
  organisation: string;
  responsibilities: string;
  years: string;
};

export type RefereeRow = {
  name: string;
  positionTitle: string;
  organisation: string;
  address: string;
  phone: string;
};

export type JobApplicationFormData = {
  positionApplyingFor: string;
  bandGrade: string;
  schoolDepartment: string;
  gender: string;
  personalStatement: string;
  qualifications: QualificationRow[];
  currentlyEmployed: "yes" | "no" | "";
  currentEmployer: string;
  currentPosition: string;
  currentResponsibilities: string;
  employmentPeriod: string;
  currentSalary: string;
  ifNotEmployed: string;
  previousEmployment: EmploymentRow[];
  skillsDevelopment: EmploymentRow[];
  keySelectionCriteria: Record<string, string>;
  referees: RefereeRow[];
  declarationAccepted: boolean;
  electronicSignature: string;
  signatureDate: string;
};
