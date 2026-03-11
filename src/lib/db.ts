import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("johndoe") || url.includes("randompassword")) {
    console.warn("[DB] DATABASE_URL not configured — running without database");
    return null;
  }
  return new PrismaClient();
}

export const prisma: PrismaClient | null =
  "prisma" in globalForPrisma ? globalForPrisma.prisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
