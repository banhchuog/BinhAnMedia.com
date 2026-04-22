-- Replace galleryPhotos (per-photo JSON array) with two Drive folder URL fields
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryFrameFolder" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "galleryBtsFolder"   TEXT NOT NULL DEFAULT '';
