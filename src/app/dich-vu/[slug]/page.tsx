import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

// ─── Service Data ─────────────────────────────────────────────────
const SERVICES = [
  {
    slug: "quay-tvc",
    serviceId: "tvc",
    title: "Dịch vụ Quay TVC Quảng Cáo",
    metaTitle: "Quay TVC Quảng Cáo Chuyên Nghiệp | Bình An Media TP.HCM",
    metaDesc:
      "Dịch vụ sản xuất TVC quảng cáo 4K chuyên nghiệp tại TP.HCM & Đồng Nai. Ekip 8–12 người, thiết bị RED/ARRI, color grade cinema. Báo giá miễn phí.",
    tagline: "TVC · Quảng cáo thương mại · Viral video",
    description:
      "Bình An Media sản xuất TVC quảng cáo với chất lượng cinema — từ concept đến thành phẩm. Ekip chuyên nghiệp, thiết bị 4K RED/ARRI, color grade chuẩn broadcast.",
    youtubeId: "",
    features: [
      "Thiết bị quay 4K RED / ARRI chuyên nghiệp",
      "Ekip 8–12 người: đạo diễn, quay phim, ánh sáng, âm thanh",
      "Color grade & post-production chuyên nghiệp",
      "Bàn giao file chuẩn broadcast / digital",
      "Phục vụ TP.HCM, Đồng Nai và toàn quốc",
    ],
    useCases: ["Quảng cáo sản phẩm", "Viral marketing", "TVC truyền hình", "Digital ads"],
  },
  {
    slug: "quay-mv",
    serviceId: "mv",
    title: "Dịch vụ Quay MV Ca Nhạc",
    metaTitle: "Quay MV Ca Nhạc Chuyên Nghiệp | Bình An Media TP.HCM",
    metaDesc:
      "Sản xuất MV ca nhạc 4K cinematic, multi-location, có stylist & art director tại TP.HCM. Báo giá miễn phí ngay hôm nay.",
    tagline: "MV · Music video · Nghệ thuật",
    description:
      "Chúng tôi tạo ra những music video kể câu chuyện — không chỉ là hình ảnh đẹp. Từ concept đến styling, dàn cảnh và hậu kỳ, Bình An Media đồng hành cùng nghệ sĩ.",
    youtubeId: "",
    features: [
      "Quay phim 4K cinematic, màu sắc điện ảnh",
      "Đa địa điểm (multi-location)",
      "Có stylist & art director",
      "Chỉnh màu chuyên nghiệp, hiệu ứng visual đặc trưng",
      "Hỗ trợ storyboard và concept trước khi quay",
    ],
    useCases: ["MV Pop / Ballad / EDM", "Lyric video", "Performance video", "Concept video"],
  },
  {
    slug: "phim-doanh-nghiep",
    serviceId: "corporate",
    title: "Dịch vụ Sản Xuất Phim Doanh Nghiệp",
    metaTitle: "Quay Phim Doanh Nghiệp Chuyên Nghiệp | Bình An Media",
    metaDesc:
      "Sản xuất phim giới thiệu công ty, phim thương hiệu 4K tại TP.HCM & Đồng Nai. Kịch bản, voice-over, motion graphics. Báo giá miễn phí.",
    tagline: "Phim giới thiệu công ty · Thương hiệu · Corporate",
    description:
      "Phim doanh nghiệp là bộ mặt thương hiệu trên mọi nền tảng. Bình An Media sản xuất phim giới thiệu công ty chuyên nghiệp — kịch bản rõ ràng, hình ảnh sắc nét, truyền tải đúng giá trị cốt lõi.",
    youtubeId: "",
    features: [
      "Kịch bản chuyên nghiệp, tư vấn nội dung",
      "Quay 4K, ánh sáng studio & ngoại cảnh",
      "Voice-over tiếng Việt / tiếng Anh",
      "Motion graphics & infographic",
      "Phụ đề song ngữ theo yêu cầu",
    ],
    useCases: ["Giới thiệu công ty", "Hồ sơ năng lực", "Onboarding nội bộ", "Pitch investor"],
  },
  {
    slug: "recap-su-kien",
    serviceId: "event_recap",
    title: "Dịch vụ Quay Recap Sự Kiện",
    metaTitle: "Quay Recap Sự Kiện Chuyên Nghiệp | Bình An Media TP.HCM",
    metaDesc:
      "Quay recap sự kiện highlight 2–3 phút, phóng sự sự kiện chuyên nghiệp tại TP.HCM. 2 cameraman, bàn giao nhanh. Báo giá miễn phí.",
    tagline: "Recap · Phóng sự · Highlight sự kiện",
    description:
      "Ghi lại trọn vẹn khoảnh khắc sự kiện — hội nghị, lễ khai trương, gala dinner, workshop — thành video highlight ngắn gọn, súc tích, chia sẻ ngay trên mạng xã hội.",
    youtubeId: "",
    features: [
      "2 cameraman quay đồng thời, không bỏ sót khoảnh khắc quan trọng",
      "Dựng phim highlight 2–3 phút",
      "Bàn giao nhanh trong 2–3 ngày",
      "Có thêm gói phóng sự dài 5–10 phút",
      "Phù hợp mọi quy mô sự kiện",
    ],
    useCases: ["Hội nghị / Hội thảo", "Lễ khai trương", "Gala dinner", "Team building"],
  },
  {
    slug: "goi-social-video",
    serviceId: "social_bulk",
    title: "Gói Sản Xuất Social Video 10+ Clip",
    metaTitle: "Quay Video Reels TikTok Số Lượng Lớn | Bình An Media",
    metaDesc:
      "Gói sản xuất 10+ video Reels/TikTok/Short tiết kiệm 30% chi phí. 2 ngày quay liên tục, bàn giao đúng hạn. Phù hợp thương hiệu cần content đều đặn.",
    tagline: "Reels · TikTok · Short-form video · Gói combo",
    description:
      "Thương hiệu cần nội dung video đều đặn? Gói Social 10+ clip của Bình An Media giúp bạn có kho content chất lượng cao chỉ trong 2 ngày quay — tiết kiệm 30% so với đặt lẻ.",
    youtubeId: "",
    features: [
      "Quay 10+ video trong 2 ngày liên tục",
      "Format linh hoạt: 9:16, 1:1, 16:9",
      "Phù hợp Reels, TikTok, YouTube Shorts",
      "Tiết kiệm 30% so với đặt từng clip",
      "Có thể thêm gói caption & subtitles",
    ],
    useCases: ["Content marketing", "Brand awareness", "Product showcase", "Influencer collab"],
  },
];

// ─── Static Params ─────────────────────────────────────────────────
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return {};
  return {
    title: svc.metaTitle,
    description: svc.metaDesc,
    openGraph: {
      title: svc.metaTitle,
      description: svc.metaDesc,
      url: `https://www.binhanmedia.com/dich-vu/${svc.slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) notFound();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#C9972A] text-xs font-semibold tracking-[0.15em] uppercase mb-4">
            {svc.tagline}
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white tracking-[-0.03em] leading-tight mb-5">
            {svc.title}
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {svc.description}
          </p>
          <Link
            href={`/quote?service=${svc.serviceId}`}
            className="inline-flex items-center gap-2 bg-[#C9972A] text-black font-bold px-7 py-3.5 rounded-full hover:bg-[#DBA93A] transition text-base"
          >
            Nhận báo giá miễn phí <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* Video Showreel */}
      {svc.youtubeId && (
        <section className="px-4 sm:px-6 pb-14">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/8">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${svc.youtubeId}?autoplay=0&rel=0`}
                title={svc.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 sm:px-6 py-14 bg-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[#C9972A] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
                Cam kết chất lượng
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.03em] mb-6">
                Tại sao chọn Bình An Media?
              </h2>
              <ul className="space-y-3.5">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle size={17} className="text-[#C9972A] flex-shrink-0 mt-0.5" />
                    <span className="text-white/70 text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[#C9972A] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
                Phù hợp cho
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.03em] mb-6">
                Ứng dụng thực tế
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {svc.useCases.map((u) => (
                  <span
                    key={u}
                    className="border border-white/12 text-white/60 text-sm px-4 py-2 rounded-full"
                  >
                    {u}
                  </span>
                ))}
              </div>

              {/* Contact box */}
              <div className="mt-8 bg-white/4 border border-white/8 rounded-2xl p-5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
                  Tư vấn trực tiếp
                </p>
                <a
                  href="tel:0969427639"
                  className="flex items-center gap-3 text-white hover:text-[#C9972A] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#C9972A]/15 flex items-center justify-center flex-shrink-0">
                    <Phone size={15} className="text-[#C9972A]" />
                  </div>
                  <div>
                    <p className="font-bold text-base">0969 427 639</p>
                    <p className="text-white/40 text-xs">Ông Đinh Công Hiếu — Giám đốc</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-4 sm:px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.03em] mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-white/45 mb-8">
            Nhận báo giá chính xác trong vòng 1 phút — không cần gọi điện, không cần chờ đợi.
          </p>
          <Link
            href={`/quote?service=${svc.serviceId}`}
            className="inline-flex items-center gap-2 bg-[#C9972A] text-black font-bold px-8 py-4 rounded-full hover:bg-[#DBA93A] transition text-base"
          >
            Tính giá ngay — Miễn phí <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </main>
  );
}
