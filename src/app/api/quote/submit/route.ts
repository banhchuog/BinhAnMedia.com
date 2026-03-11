import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, note, service, total, items } = body;

    if (!prisma) {
      return NextResponse.json({ ok: true, id: "offline" });
    }

    const lead = await prisma.lead.create({
      data: {
        name: name || "(chưa điền)",
        phone: phone || "(chưa điền)",
        note: note || "",
        service: service || "",
        total: total || 0,
        items: items || [],
        contacted: false,
      },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
