import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("johndoe") || url.includes("randompassword")) {
    console.warn("[DB] DATABASE_URL not configured — running without database");
    return null;
  }
  try {
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({ adapter });
  } catch (e) {
    console.error("[DB] Failed to create PrismaClient:", e);
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma !== undefined ? globalForPrisma.prisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
