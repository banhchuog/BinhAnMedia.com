import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

function readSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return null;
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export async function GET() {
  const settings = readSettings();
  if (!settings) {
    return NextResponse.json({ priceOverrides: {}, presets: {}, videos: [] });
  }
  // Never expose password to clients
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...pub } = settings;
  return NextResponse.json(pub);
}
