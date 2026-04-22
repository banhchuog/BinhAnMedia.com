import { prisma } from "@/lib/db";
import ProposalClient from "./ProposalClient";
import type { VideoItem, FounderData, TestimonialItem, ServiceItem } from "./ProposalClient";

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "1", ytId: "dQw4w9WgXcQ", title: "TVC Thương hiệu ABC", client: "ABC Corp", year: "2024", cat: "TVC" },
  { id: "2", ytId: "dQw4w9WgXcQ", title: "MV Ca nhạc Xuân 2024", client: "Nhạc sĩ X", year: "2024", cat: "MV" },
  { id: "3", ytId: "dQw4w9WgXcQ", title: "Phim doanh nghiệp XYZ", client: "XYZ Ltd", year: "2023", cat: "Corporate" },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { name: "Nguyễn Văn A", role: "Marketing Manager · Công ty ABC", body: "Đội ngũ Bình An Media cực kỳ chuyên nghiệp, hình ảnh đẹp và đúng deadline. Rất hài lòng!" },
  { name: "Trần Thị B", role: "Brand Director · XYZ Group", body: "Ý tưởng sáng tạo, phong cách quay phim cinematic chuyên nghiệp. Chúng tôi sẽ hợp tác lâu dài." },
  { name: "Lê Văn C", role: "CEO · Startup Tech", body: "Giá hợp lý, chất lượng vượt kỳ vọng. Đội quay rất nhiệt tình và có tâm với nghề." },
];

const DEFAULT_FOUNDER: FounderData = {
  name: "Đinh Công Hiếu",
  title: "Founder & Đạo diễn",
  experience: "12+ năm",
  photoUrl: "",
  bio: [
    "Đạo diễn với hơn 12 năm kinh nghiệm sản xuất TVC, MV ca nhạc, phim doanh nghiệp và nội dung số — từ concept sáng tạo đến hậu kỳ hoàn chỉnh.",
    "Founder nền tảng mạng xã hội phim ảnh anhemphim.com.vn — cộng đồng kết nối những người yêu điện ảnh tại Việt Nam.",
    "Với triết lý mỗi khung hình là một câu chuyện, Hiếu đã dẫn dắt Bình An Media trở thành đối tác tin cậy của hàng trăm thương hiệu.",
  ],
  linkUrl: "https://anhemphim.com.vn",
  linkLabel: "anhemphim.com.vn",
};

const DEFAULT_SERVICES: ServiceItem[] = [
  { iconName: "Film",       title: "TVC & Quảng cáo",   titleEn: "TVC & Advertising",  desc: "Từ concept đến post-production — brand awareness, performance ads, viral campaign.",   descEn: "From concept to post-production — brand awareness, performance ads, viral campaigns." },
  { iconName: "Music",      title: "MV Ca nhạc",         titleEn: "Music Video",         desc: "Hình ảnh cinematic 4K, color grade điện ảnh, storytelling chạm cảm xúc.",              descEn: "Cinematic 4K visuals, film-grade color, emotional storytelling." },
  { iconName: "Building2",  title: "Phim doanh nghiệp",  titleEn: "Corporate Film",      desc: "Corporate film, recruitment video, investor pitch — mỗi frame chuẩn quốc tế.",        descEn: "Corporate film, recruitment video, investor pitch — every frame world-class." },
  { iconName: "Smartphone", title: "Social Content",     titleEn: "Social Content",      desc: "Reels, TikTok, Shorts tối ưu thuật toán — hook mạnh, chuyển đổi cao.",                descEn: "Reels, TikTok, Shorts algorithm-optimized — strong hooks, high conversion." },
  { iconName: "Camera",     title: "Event & Livestream", titleEn: "Event & Livestream",  desc: "Multi-camera, same-day edit, highlight film giao ngay sau sự kiện.",                   descEn: "Multi-camera, same-day edit, highlight film delivered right after the event." },
  { iconName: "Sparkles",   title: "Motion & Animation", titleEn: "Motion & Animation",  desc: "Logo animation, explainer video, infographic động — brand motion nhất quán.",         descEn: "Logo animation, explainer videos, animated infographics — consistent brand motion." },
];

export default async function ProposalPage() {
  let heroId = "dQw4w9WgXcQ";
  let clientLogos: string[] = [];
  let founder = DEFAULT_FOUNDER;
  let testimonials = DEFAULT_TESTIMONIALS;
  let videos = DEFAULT_VIDEOS;
  let services = DEFAULT_SERVICES;

  try {
    const settings = await prisma!.settings.findUnique({ where: { id: 1 } });
    if (settings) {
      if (settings.heroVideoId) heroId = settings.heroVideoId;
      if (Array.isArray(settings.clientLogos)) clientLogos = settings.clientLogos as string[];

      const f = settings.founder as Record<string, unknown> | null;
      if (f && typeof f === "object") {
        founder = {
          name: (f.name as string) || DEFAULT_FOUNDER.name,
          title: (f.title as string) || DEFAULT_FOUNDER.title,
          experience: (f.experience as string) || DEFAULT_FOUNDER.experience,
          photoUrl: (f.photoUrl as string) || "",
          bio: Array.isArray(f.bio) ? (f.bio as string[]) : DEFAULT_FOUNDER.bio,
          linkUrl: (f.linkUrl as string) || undefined,
          linkLabel: (f.linkLabel as string) || undefined,
        };
      }

      if (Array.isArray(settings.testimonials) && settings.testimonials.length > 0) {
        testimonials = (settings.testimonials as Record<string, string>[]).map((t) => ({
          name: t.name || "", role: t.role || "", body: t.body || "",
        }));
      }

      if (Array.isArray(settings.customCatalogItems) && settings.customCatalogItems.length > 0) {
        const svcMap: Record<string, ServiceItem> = {
          Film:       { iconName: "Film",       title: "TVC & Quảng cáo",   titleEn: "TVC & Advertising",  desc: "", descEn: "" },
          Music:      { iconName: "Music",      title: "MV Ca nhạc",         titleEn: "Music Video",         desc: "", descEn: "" },
          Building2:  { iconName: "Building2",  title: "Phim doanh nghiệp",  titleEn: "Corporate Film",      desc: "", descEn: "" },
          Smartphone: { iconName: "Smartphone", title: "Social Content",     titleEn: "Social Content",      desc: "", descEn: "" },
          Camera:     { iconName: "Camera",     title: "Event & Livestream", titleEn: "Event & Livestream",  desc: "", descEn: "" },
          Sparkles:   { iconName: "Sparkles",   title: "Motion & Animation", titleEn: "Motion & Animation",  desc: "", descEn: "" },
        };
        const custom = settings.customCatalogItems as Record<string, string>[];
        const mapped = custom.map((c) => {
          const base = svcMap[c.icon || "Film"] || DEFAULT_SERVICES[0];
          return { ...base, title: c.title || base.title, titleEn: c.titleEn || base.titleEn, desc: c.desc || base.desc, descEn: c.descEn || base.descEn };
        });
        if (mapped.length > 0) services = mapped;
      }
    }

    const dbVideos = await prisma!.video.findMany({ orderBy: { sortOrder: "asc" } });
    if (dbVideos.length > 0) {
      videos = dbVideos.map((v) => ({
        id: String(v.id),
        ytId: v.ytId,
        title: v.title,
        client: v.client || "",
        year: v.year ? String(v.year) : "",
        cat: v.cat || "TVC",
        desc: v.desc || undefined,
        views: v.views || undefined,
        duration: v.duration || undefined,
        thumbnail: v.thumbnail || undefined,
      }));
    }
  } catch {
    // use defaults
  }

  return (
    <ProposalClient
      heroId={heroId}
      clientLogos={clientLogos}
      founder={founder}
      testimonials={testimonials}
      videos={videos}
      services={services}
    />
  );
}
