import path from "path";

export function getStudentUploadDir(): string {
  const fromEnv = process.env.STUDENT_UPLOAD_DIR;
  if (fromEnv && fromEnv.trim()) {
    return path.resolve(fromEnv.trim());
  }
  return path.join(process.cwd(), "uploads", "student-applications");
}

export function getJobUploadDir(): string {
  const fromEnv = process.env.JOB_UPLOAD_DIR;
  if (fromEnv && fromEnv.trim()) {
    return path.resolve(fromEnv.trim());
  }
  return path.join(process.cwd(), "uploads", "job-applications");
}
