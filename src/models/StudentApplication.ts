import mongoose, { Schema, Document } from "mongoose";

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

export interface IStudentApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residentialAddress: string;
  programmes: IProgrammeChoice[];
  documents: IDocumentRef[];
  status: ApplicationStatus;
  adminRemarks?: string;
  reviewedAt?: Date;
  passwordHash?: string;
  mustResetPassword?: boolean;
  /** SHA-256 hex of raw reset token (never store raw token). */
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  createdAt: Date;
}

const ProgrammeChoiceSchema = new Schema(
  {
    priority: { type: Number, required: true, min: 1, max: 3 },
    programme_code: { type: String, required: true },
    programme_name: { type: String, required: true },
  },
  { _id: false }
);

const DocumentRefSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "profile_image",
        "study_documents",
        "certificates",
        "sop",
        "english_requirement",
      ],
    },
    storedFileName: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { _id: false }
);

const StudentApplicationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    programmes: { type: [ProgrammeChoiceSchema], required: true },
    documents: { type: [DocumentRefSchema], required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminRemarks: { type: String, required: false },
    reviewedAt: { type: Date, required: false },
    passwordHash: { type: String, required: false },
    mustResetPassword: { type: Boolean, default: false },
    passwordResetTokenHash: { type: String, required: false },
    passwordResetExpiresAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentApplication>(
  "student_applications",
  StudentApplicationSchema
);
