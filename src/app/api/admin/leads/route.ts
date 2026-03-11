import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_PASSWORD = "admin@2026";

async function getStoredPassword(): Promise<string> {
  if (!prisma) return DEFAULT_PASSWORD;
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } });
    return s?.password || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password");
  const stored = await getStoredPassword();
  if (password !== stored) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json([]);
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(
    leads.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      note: l.note,
      service: l.service,
      total: l.total,
      items: l.items,
      date: l.createdAt.toISOString(),
      contacted: l.contacted,
    }))
  );
}

export async function POST(req: Request) {
  const { id, contacted, password } = await req.json();
  const stored = await getStoredPassword();
  if (password !== stored) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ error: "Database chưa kết nối" }, { status: 503 });
  await prisma.lead.update({
    where: { id },
    data: { contacted },
  });
  return NextResponse.json({ ok: true });
}
