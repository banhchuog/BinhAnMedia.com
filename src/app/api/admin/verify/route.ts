import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_PASSWORD = "admin@2026";

async function getStoredPassword(): Promise<string> {
  const s = await prisma.settings.findUnique({ where: { id: 1 } });
  return s?.password || DEFAULT_PASSWORD;
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const stored = await getStoredPassword();
    if (password === stored) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
