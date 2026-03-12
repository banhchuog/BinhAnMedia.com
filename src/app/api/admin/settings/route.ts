import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const EMPTY_RESPONSE = {
  priceOverrides: {},
  presets: {},
  videos: [],
  heroVideoId: "",
  clientLogos: [],
  founder: null,
  customCatalogItems: [],
  customServices: [],
  testimonials: [],
  catalogEdits: {},
  dbConnected: false,
  dbError: "",
};

export async function GET() {
  if (!prisma) return NextResponse.json({ ...EMPTY_RESPONSE, dbError: "DATABASE_URL chưa được cấu hình" });

  try {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  // Fetch videos from Video table
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });

  if (!settings) {
    return NextResponse.json({
      priceOverrides: {},
      presets: {},
      videos: videos.map((v) => ({
        id: v.id, title: v.title, cat: v.cat, client: v.client,
        year: v.year, views: v.views, duration: v.duration, ytId: v.ytId,
        desc: v.desc, thumbnail: v.thumbnail,
      })),
      heroVideoId: "",
      clientLogos: [],
      founder: null,
      customCatalogItems: [],
      customServices: [],
      testimonials: [],
      catalogEdits: {},
    });
  }

  // IDs permanently removed from DEFAULT_SERVICE_OPTIONS — strip them from DB response
  const REMOVED_SERVICE_IDS = new Set(["social", "event"]);
  const cleanedServices = Array.isArray(settings.customServices)
    ? (settings.customServices as { id: string }[]).filter((s) => !REMOVED_SERVICE_IDS.has(s.id))
    : settings.customServices;

  return NextResponse.json({
    priceOverrides: settings.priceOverrides,
    presets: settings.presets,
    heroVideoId: settings.heroVideoId,
    clientLogos: settings.clientLogos,
    founder: settings.founder,
    customCatalogItems: settings.customCatalogItems,
    customServices: cleanedServices,
    testimonials: settings.testimonials,
    catalogEdits: settings.catalogEdits,
    dbConnected: true,
    dbError: "",
    videos: videos.map((v) => ({
      id: v.id, title: v.title, cat: v.cat, client: v.client,
      year: v.year, views: v.views, duration: v.duration, ytId: v.ytId,
      desc: v.desc, thumbnail: v.thumbnail,
    })),
  });
  } catch (e) {
    console.error("[settings] DB error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ...EMPTY_RESPONSE, dbError: msg });
  }
}
