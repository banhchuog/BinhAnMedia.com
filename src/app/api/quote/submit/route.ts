import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");

type Lead = {
  id: string;
  name: string;
  phone: string;
  note?: string;
  service: string;
  total: number;
  items: { id: string; name: string; qty: number; unitPrice: number }[];
  date: string;
  contacted: boolean;
};

function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(LEADS_PATH)) return [];
    return JSON.parse(fs.readFileSync(LEADS_PATH, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, note, service, total, items } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const lead: Lead = {
      id: Date.now().toString(),
      name,
      phone,
      note: note || "",
      service: service || "",
      total: total || 0,
      items: items || [],
      date: new Date().toISOString(),
      contacted: false,
    };

    const leads = readLeads();
    leads.unshift(lead); // newest first

    fs.mkdirSync(path.dirname(LEADS_PATH), { recursive: true });
    fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
