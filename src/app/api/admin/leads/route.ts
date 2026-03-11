import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");
const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const DEFAULT_PASSWORD = "admin@2026";

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_PATH)) return [];
    return JSON.parse(fs.readFileSync(LEADS_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function getStoredPassword(): string {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return DEFAULT_PASSWORD;
    const d = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
    return d.password || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password");
  if (password !== getStoredPassword()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readLeads());
}

export async function POST(req: Request) {
  // Mark a lead as contacted
  const { id, contacted, password } = await req.json();
  if (password !== getStoredPassword()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = readLeads();
  const updated = leads.map((l: { id: string; contacted: boolean }) =>
    l.id === id ? { ...l, contacted } : l
  );
  fs.mkdirSync(path.dirname(LEADS_PATH), { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
