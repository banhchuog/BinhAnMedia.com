import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const DEFAULT_PASSWORD = "admin@2026";

function readSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return { password: DEFAULT_PASSWORD };
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
  } catch {
    return { password: DEFAULT_PASSWORD };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, priceOverrides, presets, videos, newPassword, heroVideoId, clientLogos, founder, customCatalogItems, customServices, testimonials } = body;

    const current = readSettings();
    if (password !== (current.password || DEFAULT_PASSWORD)) {
      return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
    }

    const toSave = {
      priceOverrides: priceOverrides ?? current.priceOverrides ?? {},
      presets:        presets        ?? current.presets        ?? {},
      videos:         videos         ?? current.videos         ?? [],
      heroVideoId:    heroVideoId    ?? current.heroVideoId    ?? "",
      clientLogos:    clientLogos    ?? current.clientLogos    ?? [],
      founder:        founder        ?? current.founder        ?? null,
      customCatalogItems: customCatalogItems ?? current.customCatalogItems ?? [],
      customServices: customServices ?? current.customServices ?? [],
      testimonials:   testimonials   ?? current.testimonials   ?? [],
      password:       newPassword    || current.password       || DEFAULT_PASSWORD,
    };

    fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(toSave, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
