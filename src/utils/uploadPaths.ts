import path from "path";

export function getStudentUploadDir(): string {
  const fromEnv = process.env.STUDENT_UPLOAD_DIR;
  if (fromEnv && fromEnv.trim()) {
    return path.resolve(fromEnv.trim());
  }
  return path.join(process.cwd(), "uploads", "student-applications");
}
