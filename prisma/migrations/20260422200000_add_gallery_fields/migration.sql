-- Add gallery and storyboard fields to Settings
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryPhotos"    JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "storyboardPhotos" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryFrameFolder" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryBtsFolder"   TEXT NOT NULL DEFAULT '';
