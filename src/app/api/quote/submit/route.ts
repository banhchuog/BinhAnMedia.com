import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, note, service, total, items } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
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
