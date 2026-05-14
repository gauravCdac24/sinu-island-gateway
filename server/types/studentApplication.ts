export type ApplicationStatus = "pending" | "approved" | "rejected";

export type DocumentCategory =
  | "profile_image"
  | "study_documents"
  | "certificates"
  | "sop"
  | "english_requirement";

export interface IProgrammeChoice {
  priority: number;
  programme_code: string;
  programme_name: string;
}

export interface IDocumentRef {
  category: DocumentCategory;
  storedFileName: string;
  originalName: string;
}
