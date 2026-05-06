-- AddColumn: directorMedia for /dinhconghieu director profile admin
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "directorMedia" JSONB NOT NULL DEFAULT '{}';
