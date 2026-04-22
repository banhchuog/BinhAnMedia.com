import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_PASSWORD = "admin@2026";

async function getPassword(): Promise<string> {
  if (!prisma) return DEFAULT_PASSWORD;
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } });
    return s?.password || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      password, priceOverrides, presets, newPassword, heroVideoId,
      clientLogos, founder, customCatalogItems, customServices, testimonials,
      catalogEdits, videos, galleryPhotos, galleryFrameFolder, galleryBtsFolder,
    } = body;

    const storedPw = await getPassword();
    if (password !== storedPw) {
      return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database chưa kết nối" }, { status: 503 });
    }

    // Upsert settings (single row, id=1)
    await prisma.settings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        password: newPassword || DEFAULT_PASSWORD,
        heroVideoId: heroVideoId ?? "",
        priceOverrides: priceOverrides ?? {},
        presets: presets ?? {},
        clientLogos: clientLogos ?? [],
        founder: founder ?? undefined,
        customCatalogItems: customCatalogItems ?? [],
        customServices: customServices ?? [],
        testimonials: testimonials ?? [],
        catalogEdits: catalogEdits ?? {},
        galleryPhotos: galleryPhotos ?? [],
      },
      update: {
        ...(newPassword ? { password: newPassword } : {}),
        ...(heroVideoId !== undefined ? { heroVideoId } : {}),
        ...(priceOverrides !== undefined ? { priceOverrides } : {}),
        ...(presets !== undefined ? { presets } : {}),
        ...(clientLogos !== undefined ? { clientLogos } : {}),
        ...(founder !== undefined ? { founder } : {}),
        ...(customCatalogItems !== undefined ? { customCatalogItems } : {}),
        ...(customServices !== undefined ? { customServices: (customServices as { id: string }[]).filter((s) => !["social", "event", "mini_tvc", "micro_tvc", "small_ad"].includes(s.id)) } : {}),
        ...(testimonials !== undefined ? { testimonials } : {}),
        ...(catalogEdits !== undefined ? { catalogEdits } : {}),
        ...(galleryPhotos !== undefined ? { galleryPhotos } : {}),
        ...(galleryFrameFolder !== undefined ? { galleryFrameFolder } : {}),
        ...(galleryBtsFolder !== undefined ? { galleryBtsFolder } : {}),
      },
    });

    // Sync videos if provided
    if (Array.isArray(videos)) {
      // Delete existing videos and re-create (simple sync)
      await prisma.video.deleteMany();
      if (videos.length > 0) {
        await prisma.video.createMany({
          data: videos.map((v: Record<string, string>, i: number) => ({
            id: v.id || undefined,
            title: v.title || "",
            cat: v.cat || "TVC",
            client: v.client || "",
            year: v.year || "",
            views: v.views || "",
            duration: v.duration || "",
            ytId: v.ytId || "",
            desc: v.desc || "",
            thumbnail: v.thumbnail || "",
            sortOrder: i,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
