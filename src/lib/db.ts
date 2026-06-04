import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  // Prefer public URL (works across Railway's network), fallback to private
  let url = process.env.DATABASE_PUBLIC_URL ?? process.env.DATABASE_URL;
  if (!url || url.includes("johndoe") || url.includes("randompassword")) {
    console.warn("[DB] DATABASE_URL not configured — running without database");
    return null;
  }
  // Add SSL for public TCP proxy connections (Railway public URLs need this)
  if (!url.includes("railway.internal") && !url.includes("sslmode") && !url.includes("ssl=")) {
    url = url.includes("?") ? `${url}&sslmode=no-verify` : `${url}?sslmode=no-verify`;
  }
  console.log("[DB] Connecting to database...");
  return new PrismaClient({
    datasources: { db: { url } },
  });
}

export const prisma: PrismaClient | null =
  "prisma" in globalForPrisma ? globalForPrisma.prisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
