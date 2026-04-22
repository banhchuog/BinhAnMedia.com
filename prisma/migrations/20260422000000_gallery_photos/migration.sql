-- AlterTable: add galleryPhotos column to Settings
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryPhotos" JSONB NOT NULL DEFAULT '[]';
