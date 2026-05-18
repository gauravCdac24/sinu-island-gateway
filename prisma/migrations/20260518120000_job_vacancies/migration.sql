-- CreateTable
CREATE TABLE IF NOT EXISTS "job_vacancies" (
    "id" TEXT NOT NULL,
    "vacancy_no" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "division_department" TEXT NOT NULL,
    "location_campus" TEXT NOT NULL,
    "band_grade" TEXT,
    "staff_category" TEXT,
    "reports_to" TEXT,
    "summary_of_duties" TEXT,
    "main_duties" TEXT,
    "dimensions" TEXT,
    "general_responsibilities" TEXT,
    "qualifications_required" TEXT,
    "experience_required" TEXT,
    "minimum_qualification_experience" TEXT,
    "salary_range" TEXT,
    "employment_type" TEXT,
    "terms_and_conditions" TEXT,
    "key_selection_criteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "closing_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "job_applications" (
    "id" TEXT NOT NULL,
    "vacancy_no" TEXT NOT NULL,
    "position_title" TEXT NOT NULL,
    "faculty_department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "form_data" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "resume_extracted" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "job_vacancies_vacancy_no_key" ON "job_vacancies"("vacancy_no");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "job_vacancies_status_idx" ON "job_vacancies"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "job_vacancies_closing_date_idx" ON "job_vacancies"("closing_date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "job_applications_vacancy_no_idx" ON "job_applications"("vacancy_no");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "job_applications_email_idx" ON "job_applications"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "job_applications_status_idx" ON "job_applications"("status");
