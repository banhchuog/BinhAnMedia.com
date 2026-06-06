import { Prisma, PrismaClient } from "../src/generated/prisma";
import seedSettings from "../data/settings.json";

const prisma = new PrismaClient();

type SeedVideo = {
  id?: string;
  title?: string;
  cat?: string;
  client?: string;
  year?: string;
  views?: string;
  duration?: string;
  ytId?: string;
  desc?: string;
  thumbnail?: string;
  sortOrder?: number;
};

type SeedSettings = {
  password?: string;
  heroVideoId?: string;
  priceOverrides?: object;
  presets?: object;
  clientLogos?: unknown[];
  founder?: unknown;
  customCatalogItems?: unknown[];
  customServices?: unknown[];
  testimonials?: unknown[];
  catalogEdits?: object;
  galleryPhotos?: unknown[];
  storyboardPhotos?: unknown[];
  directorMedia?: object;
  videos?: SeedVideo[];
};

const dataSettings = seedSettings as SeedSettings;

const FALLBACK_VIDEOS: Required<SeedVideo>[] = [
  {
    id: "1773148901776",
    title: "Gunny PC 16 năm",
    cat: "TVC",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "jtj_nHxkGGY",
    desc: "",
    thumbnail: "",
    sortOrder: 0,
  },
  {
    id: "1773149888210",
    title: "Gunny Vua Hải Tặc",
    cat: "TVC",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "__OG8NUN9s8",
    desc: "",
    thumbnail: "",
    sortOrder: 1,
  },
  {
    id: "1773149952462",
    title: "Mùa World Cup",
    cat: "TVC",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "MkfH0jOFf9k",
    desc: "",
    thumbnail: "",
    sortOrder: 2,
  },
  {
    id: "1773150087540",
    title: "MV Quang Hà",
    cat: "MV",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "DI_NSjrhbrI",
    desc: "",
    thumbnail: "",
    sortOrder: 3,
  },
  {
    id: "1773150364896",
    title: "UHP X WOWY",
    cat: "MV",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "ceSd7Hu40NI",
    desc: "",
    thumbnail: "",
    sortOrder: 4,
  },
  {
    id: "1773150568809",
    title: "Sinh nhật 3 tuổi",
    cat: "TVC",
    client: "",
    year: "2026",
    views: "",
    duration: "",
    ytId: "vFTyTn45dhU",
    desc: "",
    thumbnail: "",
    sortOrder: 5,
  },
];

const isEmptyObject = (value: unknown) =>
  !value || (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0);

const isEmptyArray = (value: unknown) => !Array.isArray(value) || value.length === 0;

const asJson = (value: unknown, fallback: Prisma.InputJsonValue): Prisma.InputJsonValue =>
  (value ?? fallback) as Prisma.InputJsonValue;

function normalizeVideo(video: SeedVideo, sortOrder: number) {
  return {
    id: video.id || undefined,
    title: video.title || "",
    cat: video.cat || "TVC",
    client: video.client || "",
    year: video.year || "",
    views: video.views || "",
    duration: video.duration || "",
    ytId: video.ytId || "",
    desc: video.desc || "",
    thumbnail: video.thumbnail || "",
    sortOrder: video.sortOrder ?? sortOrder,
  };
}

async function main() {
  console.log("Seeding database...");

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const settingsData = {
    password: dataSettings.password || "admin@2026",
    heroVideoId: dataSettings.heroVideoId || "jtj_nHxkGGY",
    priceOverrides: asJson(dataSettings.priceOverrides, {}),
    presets: asJson(dataSettings.presets, {}),
    clientLogos: asJson(dataSettings.clientLogos, []),
    founder: dataSettings.founder ? asJson(dataSettings.founder, {}) : undefined,
    customCatalogItems: asJson(dataSettings.customCatalogItems, []),
    customServices: asJson(dataSettings.customServices, []),
    testimonials: asJson(dataSettings.testimonials, []),
    catalogEdits: asJson(dataSettings.catalogEdits, {}),
    galleryPhotos: asJson(dataSettings.galleryPhotos, []),
    storyboardPhotos: asJson(dataSettings.storyboardPhotos, []),
    directorMedia: asJson(dataSettings.directorMedia, {}),
  };

  if (!settings) {
    await prisma.settings.create({
      data: {
        id: 1,
        ...settingsData,
      },
    });
    console.log("Seeded settings row from data/settings.json");
  } else {
    const backfill = {
      ...(settings.heroVideoId ? {} : { heroVideoId: settingsData.heroVideoId }),
      ...(isEmptyObject(settings.priceOverrides) ? { priceOverrides: settingsData.priceOverrides } : {}),
      ...(isEmptyObject(settings.presets) ? { presets: settingsData.presets } : {}),
      ...(isEmptyArray(settings.clientLogos) ? { clientLogos: settingsData.clientLogos } : {}),
      ...(settings.founder ? {} : { founder: settingsData.founder }),
      ...(isEmptyArray(settings.customCatalogItems) ? { customCatalogItems: settingsData.customCatalogItems } : {}),
      ...(isEmptyArray(settings.customServices) ? { customServices: settingsData.customServices } : {}),
      ...(isEmptyArray(settings.testimonials) ? { testimonials: settingsData.testimonials } : {}),
      ...(isEmptyObject(settings.catalogEdits) ? { catalogEdits: settingsData.catalogEdits } : {}),
      ...(isEmptyArray(settings.galleryPhotos) ? { galleryPhotos: settingsData.galleryPhotos } : {}),
      ...(isEmptyArray(settings.storyboardPhotos) ? { storyboardPhotos: settingsData.storyboardPhotos } : {}),
      ...(isEmptyObject(settings.directorMedia) ? { directorMedia: settingsData.directorMedia } : {}),
    };

    if (Object.keys(backfill).length > 0) {
      await prisma.settings.update({ where: { id: 1 }, data: backfill });
      console.log(`Backfilled ${Object.keys(backfill).length} empty settings fields from data/settings.json`);
    } else {
      console.log("Settings already contain data, skipping backfill");
    }
  }

  const count = await prisma.video.count();
  if (count === 0) {
    const sourceVideos = dataSettings.videos?.length ? dataSettings.videos : FALLBACK_VIDEOS;
    await prisma.video.createMany({ data: sourceVideos.map(normalizeVideo) });
    console.log(`Seeded ${sourceVideos.length} videos`);
  } else {
    console.log(`Videos already exist (${count}), skipping`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
