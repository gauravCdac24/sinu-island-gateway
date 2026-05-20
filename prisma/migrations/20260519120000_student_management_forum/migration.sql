-- Student Management Forum (SINUSA–Management Dialogue)

CREATE TABLE "forum_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "forum_categories_slug_key" ON "forum_categories"("slug");

CREATE TABLE "forum_suggested_questions" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "forum_suggested_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "forum_suggested_questions_category_id_idx" ON "forum_suggested_questions"("category_id");

CREATE TABLE "forum_submissions" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "application_id" TEXT,
    "student_name" TEXT NOT NULL,
    "student_email" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "suggested_question_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "forum_submissions_category_id_idx" ON "forum_submissions"("category_id");
CREATE INDEX "forum_submissions_status_idx" ON "forum_submissions"("status");
CREATE INDEX "forum_submissions_application_id_idx" ON "forum_submissions"("application_id");
CREATE INDEX "forum_submissions_is_public_idx" ON "forum_submissions"("is_public");

CREATE TABLE "forum_replies" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "author_role" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_replies_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "forum_replies_submission_id_idx" ON "forum_replies"("submission_id");

ALTER TABLE "forum_suggested_questions" ADD CONSTRAINT "forum_suggested_questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "forum_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "forum_submissions" ADD CONSTRAINT "forum_submissions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "forum_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "forum_submissions" ADD CONSTRAINT "forum_submissions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "student_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "forum_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
