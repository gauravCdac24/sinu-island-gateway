-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "student_applications" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_normalized" TEXT,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "residential_address" TEXT NOT NULL,
    "programmes" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_remarks" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "password_hash" TEXT,
    "must_reset_password" BOOLEAN NOT NULL DEFAULT false,
    "password_reset_token_hash" TEXT,
    "password_reset_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimetype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" TEXT NOT NULL,
    "programme_code" TEXT NOT NULL,
    "programme_name" TEXT NOT NULL,
    "programme_department" TEXT,
    "programme_faculty" TEXT,
    "SIQF_level" TEXT,
    "programme_entry_requirement" TEXT,
    "programme_credits" DOUBLE PRECISION,
    "programme_year" TEXT,
    "programme_study_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "programme_description" TEXT,
    "programme_location" TEXT NOT NULL,
    "programme_study_period" TEXT,
    "programme_english_requirement" TEXT,
    "programme_level" TEXT,
    "programme_units" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "programme_units" TEXT NOT NULL,
    "unit_title" TEXT,
    "unit_prerequisite" TEXT,
    "unit_study_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unit_description" TEXT,
    "unit_study_period" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unit_credits" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_applications_email_key" ON "student_applications"("email");

-- CreateIndex
CREATE INDEX "student_applications_phone_normalized_idx" ON "student_applications"("phone_normalized");

-- CreateIndex
CREATE INDEX "student_applications_status_idx" ON "student_applications"("status");

-- CreateIndex
CREATE INDEX "policy_files_filename_idx" ON "policy_files"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_programme_code_key" ON "programmes"("programme_code");

-- CreateIndex
CREATE UNIQUE INDEX "units_programme_units_key" ON "units"("programme_units");
