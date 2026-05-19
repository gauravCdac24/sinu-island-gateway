-- CreateTable
CREATE TABLE "tender_eoi" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "closing_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tender_eoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_eoi_documents" (
    "id" TEXT NOT NULL,
    "tender_id" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "label" TEXT,
    "filename" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimetype" TEXT NOT NULL DEFAULT 'application/pdf',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tender_eoi_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tender_eoi_status_idx" ON "tender_eoi"("status");

-- CreateIndex
CREATE INDEX "tender_eoi_type_idx" ON "tender_eoi"("type");

-- CreateIndex
CREATE INDEX "tender_eoi_closing_date_idx" ON "tender_eoi"("closing_date");

-- CreateIndex
CREATE INDEX "tender_eoi_documents_tender_id_idx" ON "tender_eoi_documents"("tender_id");

-- CreateIndex
CREATE UNIQUE INDEX "tender_eoi_documents_tender_id_slot_key" ON "tender_eoi_documents"("tender_id", "slot");

-- AddForeignKey
ALTER TABLE "tender_eoi_documents" ADD CONSTRAINT "tender_eoi_documents_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender_eoi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
