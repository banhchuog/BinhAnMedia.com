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
  const body = await req.json();
  const { id, contacted, password, action, items, total, service, note, name, phone } = body;
  const stored = await getStoredPassword();
  if (password !== stored) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ error: "Database chưa kết nối" }, { status: 503 });

  // action=updateQuote: update items/total/service/note/name/phone
  if (action === "updateQuote") {
    await prisma.lead.update({
      where: { id },
      data: {
        ...(items !== undefined ? { items } : {}),
        ...(total !== undefined ? { total } : {}),
        ...(service !== undefined ? { service } : {}),
        ...(note !== undefined ? { note } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  // action=delete: xoá lead
  if (action === "delete") {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  // default: toggle contacted
  await prisma.lead.update({
    where: { id },
    data: { contacted },
  });
  return NextResponse.json({ ok: true });
}
