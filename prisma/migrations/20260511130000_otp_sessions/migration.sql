-- AlterTable: add OTP fields to student_applications
ALTER TABLE "student_applications" ADD COLUMN IF NOT EXISTS "otp_code" TEXT;
ALTER TABLE "student_applications" ADD COLUMN IF NOT EXISTS "otp_expires_at" TIMESTAMP(3);
ALTER TABLE "student_applications" ADD COLUMN IF NOT EXISTS "otp_attempts" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: student_sessions for refresh-token / session management
CREATE TABLE "student_sessions" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_sessions_refresh_token_key" ON "student_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "student_sessions_application_id_idx" ON "student_sessions"("application_id");

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_application_id_fkey"
    FOREIGN KEY ("application_id") REFERENCES "student_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
