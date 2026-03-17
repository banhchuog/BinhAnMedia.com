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
  const applicants = await prisma.applicant.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(
    applicants.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      cvLink: a.cvLink,
      showreelLink: a.showreelLink,
      selectedSlots: a.selectedSlots,
      note: a.note,
      position: a.position,
      reviewed: a.reviewed,
      date: a.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, reviewed, password, action } = body;
  const stored = await getStoredPassword();
  if (password !== stored) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ error: "Database chưa kết nối" }, { status: 503 });

  if (action === "delete") {
    await prisma.applicant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  // default: toggle reviewed
  await prisma.applicant.update({
    where: { id },
    data: { reviewed },
  });
  return NextResponse.json({ ok: true });
}
