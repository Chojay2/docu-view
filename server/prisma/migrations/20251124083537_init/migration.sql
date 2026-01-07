-- CreateTable
CREATE TABLE "datasets" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "license" TEXT NOT NULL,
    "source_org" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "update_frequency" TEXT NOT NULL,
    "spatial_coverage" JSONB,
    "temporal_coverage_start" TIMESTAMP(3),
    "temporal_coverage_end" TIMESTAMP(3),
    "data_format" TEXT[],
    "preview_schema" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataset_resources" (
    "id" TEXT NOT NULL,
    "dataset_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "storage_url" TEXT,
    "api_endpoint" TEXT,
    "file_format" TEXT,
    "size" BIGINT,
    "hash" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataset_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT,
    "link_type" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "authors" TEXT[],
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_datasets" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "dataset_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_datasets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "datasets_slug_key" ON "datasets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_datasets_project_id_dataset_id_key" ON "project_datasets"("project_id", "dataset_id");

-- AddForeignKey
ALTER TABLE "dataset_resources" ADD CONSTRAINT "dataset_resources_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_datasets" ADD CONSTRAINT "project_datasets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_datasets" ADD CONSTRAINT "project_datasets_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
