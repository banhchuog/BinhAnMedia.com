// prisma/seed.ts — Seed dữ liệu ban đầu từ data/settings.json cũ
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const VIDEOS = [
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

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Settings (single row)
  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      password: "admin@2026",
      heroVideoId: "jtj_nHxkGGY",
      priceOverrides: {},
      presets: {},
      clientLogos: [],
      customCatalogItems: [],
      customServices: [],
      testimonials: [],
      catalogEdits: {},
    },
    update: {
      heroVideoId: "jtj_nHxkGGY",
    },
  });

  // Seed Videos (only if empty)
  const count = await prisma.video.count();
  if (count === 0) {
    await prisma.video.createMany({ data: VIDEOS });
    console.log(`✅ Seeded ${VIDEOS.length} videos`);
  } else {
    console.log(`⏭  Videos already exist (${count}), skipping`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
