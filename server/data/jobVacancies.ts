export type JobVacancyRecord = {
  vacancyNo: string;
  position: string;
  facultyDepartment: string;
  bandGrade?: string;
  dueDate: string;
  status: "open" | "closed";
  keySelectionCriteria?: string[];
};

export const JOB_VACANCIES: JobVacancyRecord[] = [
  {
    vacancyNo: "VAC-2026-001",
    position: "Senior Lecturer – Information Technology",
    facultyDepartment: "Faculty of Science & Technology",
    bandGrade: "Band 7",
    dueDate: "30 June 2026",
    status: "open",
    keySelectionCriteria: [
      "Demonstrated teaching experience at tertiary level in IT or related disciplines.",
      "Relevant postgraduate qualification and industry or research experience.",
      "Ability to contribute to curriculum development and student supervision.",
    ],
  },
  {
    vacancyNo: "VAC-2026-002",
    position: "Administrative Officer – Human Resources",
    facultyDepartment: "Human Resources Department",
    bandGrade: "Band 4",
    dueDate: "15 July 2026",
    status: "open",
    keySelectionCriteria: [
      "Experience in HR administration, recruitment, or personnel records.",
      "Strong written communication and attention to detail.",
      "Proficiency with office systems and confidentiality in handling personal data.",
    ],
  },
  {
    vacancyNo: "VAC-2026-003",
    position: "Research Officer – Climate Adaptation",
    facultyDepartment: "Research & Postgraduate Studies",
    bandGrade: "Band 5",
    dueDate: "1 August 2026",
    status: "open",
    keySelectionCriteria: [
      "Background in environmental science, climate studies, or related field.",
      "Experience supporting research projects, reporting, and stakeholder engagement.",
      "Ability to work collaboratively across faculties and community partners.",
    ],
  },
];
