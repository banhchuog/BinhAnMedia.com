import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const DEFAULT_PASSWORD = "admin@2026";

function getStoredPassword(): string {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return DEFAULT_PASSWORD;
    const data = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
    return data.password || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password === getStoredPassword()) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
