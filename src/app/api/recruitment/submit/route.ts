import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, cvLink, showreelLink, selectedSlots, note } = body;

    if (!prisma) {
      return NextResponse.json({ ok: true, id: "offline" });
    }

    const applicant = await prisma.applicant.create({
      data: {
        name: name || "(chưa điền)",
        phone: phone || "(chưa điền)",
        cvLink: cvLink || "",
        showreelLink: showreelLink || "",
        selectedSlots: selectedSlots || [],
        note: note || "",
        position: "video_editor",
        reviewed: false,
      },
    });

    return NextResponse.json({ ok: true, id: applicant.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
