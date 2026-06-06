import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Film, Music, Building2, Smartphone, Camera, Sparkles, Calculator } from "lucide-react";
import FeaturedWorks from "@/components/FeaturedWorks";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function extractYtId(raw: string): string {
  if (!raw) return "";
  const m =
    raw.match(/[?&]v=([^&]+)/) ||
    raw.match(/youtu\.be\/([^?&]+)/) ||
    raw.match(/shorts\/([^?&]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return raw;
}

const stats = [
  { value: "200+", label: "Dự án hoàn thành" },
  { value: "12+",  label: "Năm kinh nghiệm" },
];

const services = [
  { Icon: Film,        title: "TVC & Quảng cáo",    desc: "Từ script đến post-production — brand awareness, performance ads, viral campaigns cho mọi nền tảng." },
  { Icon: Music,       title: "MV Ca nhạc",         desc: "Hình ảnh cinematic 4K, color grade điện ảnh, storytelling chạm đúng cảm xúc." },
  { Icon: Building2,   title: "Phim doanh nghiệp",  desc: "Corporate film, recruitment video, investor pitch — chuẩn quốc tế, mỗi frame chuyên nghiệp." },
  { Icon: Smartphone,  title: "Social Content",     desc: "Reels, TikTok, Shorts tối ưu thuật toán — hook mạnh, giữ người xem đến hết." },
  { Icon: Camera,      title: "Event & Livestream", desc: "Multi-camera, same-day edit, highlight film giao ngay sau khi sự kiện kết thúc." },
  { Icon: Sparkles,    title: "Motion & Animation", desc: "Logo animation, explainer, infographic — brand motion nhất quán, sắc nét trên mọi kênh." },
];

type TestimonialItem = { name: string; role: string; body: string };

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { name: "Nguyễn Thị Hà",  role: "Marketing Director — Vinamilk",  body: "Bình An Media hiểu đúng insight thương hiệu. TVC Tết năm nay vượt 10M views chỉ sau 3 ngày đăng." },
  { name: "Trần Minh Quân", role: "Ca sĩ độc lập",                   body: "MV được đầu tư hình ảnh đẹp không tưởng với ngân sách hợp lý. Team cực kỳ chuyên nghiệp, luôn đúng hẹn." },
  { name: "Lê Thanh Sơn",   role: "CEO — FPT Software",              body: "Corporate film dùng để pitch đối tác quốc tế. Phản hồi rất tốt. Sẽ tiếp tục hợp tác dài hạn." },
];

type FounderData = {
  name: string;
  title: string;
  photoUrl: string;
  experience: string;
  bio: string[];
  linkUrl: string;
  linkLabel: string;
};

const DEFAULT_FOUNDER: FounderData = {
  name: "Đinh Công Hiếu",
  title: "Founder & Đạo diễn",
  photoUrl: "",
  experience: "12+ năm",
  bio: [
    "Đạo diễn với hơn 12 năm kinh nghiệm trong lĩnh vực sản xuất TVC, MV ca nhạc, phim doanh nghiệp và nội dung số — từ concept sáng tạo đến hậu kỳ hoàn chỉnh.",
    "Founder nền tảng mạng xã hội phim ảnh anhemphim.com.vn — cộng đồng kết nối những người yêu điện ảnh và sản xuất nội dung sáng tạo tại Việt Nam.",
    'Với triết lý "mỗi khung hình là một câu chuyện", Hiếu đã dẫn dắt Bình An Media trở thành đối tác tin cậy của hàng trăm thương hiệu lớn nhỏ, từ TVC quốc gia đến campaign social triệu view.',
  ],
  linkUrl: "https://anhemphim.com.vn",
  linkLabel: "anhemphim.com.vn",
};

async function getPageData() {
  try {
    if (!prisma) throw new Error("No DB");
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) {
      return { heroId: "jtj_nHxkGGY", clientLogos: [] as string[], founder: DEFAULT_FOUNDER, testimonials: DEFAULT_TESTIMONIALS };
    }
    const heroId = extractYtId(settings.heroVideoId || "") || "jtj_nHxkGGY";
    const clientLogos = Array.isArray(settings.clientLogos) ? settings.clientLogos as string[] : [];
    const rawFounder = settings.founder as Record<string, unknown> | null;
    const founder: FounderData = rawFounder
      ? { ...DEFAULT_FOUNDER, ...rawFounder as FounderData, bio: Array.isArray((rawFounder as FounderData).bio) ? (rawFounder as FounderData).bio : DEFAULT_FOUNDER.bio }
      : DEFAULT_FOUNDER;
    const rawTestimonials = settings.testimonials as TestimonialItem[] | null;
    const testimonials = Array.isArray(rawTestimonials) && rawTestimonials.length > 0
      ? rawTestimonials
      : DEFAULT_TESTIMONIALS;
    return { heroId, clientLogos, founder, testimonials };
  } catch {
    return { heroId: "jtj_nHxkGGY", clientLogos: [] as string[], founder: DEFAULT_FOUNDER, testimonials: DEFAULT_TESTIMONIALS };
  }
}

export default async function HomePage() {
  const { heroId, clientLogos, founder, testimonials } = await getPageData();
  return (
    <div className="soft-page">
      {/* HERO */}
      <section className="pt-0 pb-10 sm:pb-16">
        <div className="w-full">
          <div
            className="relative min-h-[620px] sm:min-h-[760px] overflow-hidden rounded-none border-b border-white/60 bg-[#D8DDD0] shadow-[0_34px_120px_rgba(46,42,34,0.16)]"
            style={{ containerType: "size" }}
          >
          <Image
            src="/hero-bg.jpg"
            alt="Cinema camera on location"
            fill
            priority
              className="object-cover object-[50%_55%] opacity-55 saturate-[0.82] contrast-[0.92]"
          />
          <iframe
            src={`https://www.youtube.com/embed/${heroId}?autoplay=1&mute=1&loop=1&playlist=${heroId}&controls=0&playsinline=1&modestbranding=1&rel=0`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-88 saturate-[0.92] contrast-[0.95]"
              style={{ width: "max(108cqw, 192cqh)", height: "max(60.75cqw, 108cqh)" }}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            title="Hero background video"
          />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/4 to-black/24" />
            <div className="absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-[#F8F6F0]/72 via-[#F8F6F0]/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-[#F1EDE4]/92 via-[#F1EDE4]/24 to-transparent" />
            <div className="absolute inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[31%] sm:top-[30%]">
              <div className="soft-glass mx-auto max-w-[650px] rounded-[1.5rem] sm:rounded-[1.9rem] px-6 sm:px-9 py-7 sm:py-8 text-center">
                <p className="text-white/88 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold mb-4">Bình An Media</p>
                <h1 className="text-white font-extrabold text-[clamp(2.1rem,5vw,4.55rem)] leading-[1.03] tracking-[-0.035em] drop-shadow-[0_5px_24px_rgba(0,0,0,0.18)]">
                  Sản xuất video<br className="hidden sm:block" /> chuyên nghiệp<span className="text-[#C9972A]">.</span>
                </h1>
                <div className="w-20 sm:w-28 h-px bg-white/65 mx-auto my-5" />
                <p className="text-white/84 text-sm sm:text-[15px] font-medium leading-relaxed max-w-xl mx-auto drop-shadow-sm">
                  TVC · MV · Phim doanh nghiệp · Social Content — từ ý tưởng đến thành phẩm.
                </p>
              </div>
            </div>
            <div className="absolute left-5 right-5 sm:left-10 sm:right-10 bottom-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4 text-white">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1F241E] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-[#F8F6F0] transition-all shadow-xl shadow-black/15"
                >
                  Báo giá ngay <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/showreel"
                  className="inline-flex items-center justify-center gap-2 border border-white/55 bg-white/18 text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/28 transition-all backdrop-blur-md"
                >
                  <Play size={13} fill="currentColor" /> Xem portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      {clientLogos.length > 0 && (
        <section className="soft-section border-y border-black/8 py-8 sm:py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[#8A8F83] text-[10px] tracking-[0.28em] uppercase mb-6 sm:mb-8">Một số khách hàng đã hợp tác</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6">
              {clientLogos.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Khách hàng ${i + 1}`}
                  className="h-6 sm:h-8 w-auto object-contain transition-opacity duration-300"
                  style={{ filter: "grayscale(1) contrast(0.9)", opacity: 0.58 }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="soft-section-muted border-b border-black/8">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 sm:gap-16 py-4 sm:py-5 px-4">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-10 sm:gap-16">
              {i > 0 && <div className="w-px h-5 bg-black/10 -ml-6 sm:-ml-16" />}
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-black text-[#C9972A] text-lg sm:text-2xl tracking-tight">{s.value}</span>
                <span className="text-[#6F746A] text-[10px] sm:text-[11px] tracking-wide">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORKS */}
      <FeaturedWorks />

      {/* SERVICES */}
      <section className="soft-section py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="eyebrow mb-2">Dịch vụ</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[#1F241E] tracking-[-0.03em] leading-tight">
              Chúng tôi làm được gì
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="soft-card group rounded-2xl p-5 sm:p-7 hover:border-[#C9972A]/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#C9972A]/12 flex items-center justify-center mb-5 group-hover:bg-[#C9972A]/18 transition-colors">
                  <s.Icon size={20} className="text-[#C9972A]" />
                </div>
                <h3 className="font-bold text-[#1F241E] text-[15px] mb-2 tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="text-[#6F746A] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="soft-section-muted py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-14 items-center">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="relative w-48 sm:w-64 h-60 sm:h-80 rounded-[1.7rem] overflow-hidden border border-white/70 shadow-[0_24px_80px_rgba(46,42,34,0.16)]">
                {founder.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={founder.photoUrl} alt={founder.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9972A]/15 via-white to-[#E7E1D4] flex items-center justify-center">
                    <span className="text-7xl font-black text-[#C9972A]/18 select-none">{founder.name.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/24 to-transparent" />
              </div>
            </div>
            {/* Bio */}
            <div>
              <p className="eyebrow mb-3">{founder.title}</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-[#1F241E] tracking-[-0.03em] leading-tight mb-2">
                {founder.name}
              </h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#C9972A] font-bold text-sm">{founder.experience}</span>
                <span className="text-[#8A8F83] text-sm">trong ngành sản xuất phim</span>
              </div>
              <div className="space-y-4 text-[#5D6359] text-sm leading-relaxed">
                {founder.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {founder.linkUrl && (
                <div className="flex flex-wrap gap-3 mt-7">
                  <a href={founder.linkUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-black/10 text-[#5D6359] px-5 py-2.5 rounded-full text-[13px] hover:border-[#C9972A]/40 hover:text-[#C9972A] bg-white/50 transition-colors font-medium"
                  >
                    {founder.linkLabel || founder.linkUrl} <ArrowRight size={11} strokeWidth={2.5} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="soft-section py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center soft-card rounded-[2rem] px-6 sm:px-12 py-12 sm:py-16">
          <p className="eyebrow mb-4">Bắt đầu ngay</p>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-black text-[#1F241E] tracking-[-0.03em] leading-tight mb-5">
            Sẵn sàng cho<br />dự án tiếp theo?
          </h2>
          <p className="text-[#6F746A] mb-10 leading-relaxed text-base font-light">
            Báo giá chi tiết đến từng hạng mục — minh bạch, không ràng buộc, phản hồi trong 2 giờ.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 soft-button font-semibold px-8 py-3.5 rounded-full transition-colors text-sm tracking-[-0.01em]"
            >
              Tạo báo giá miễn phí <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <Link
              href="/showreel"
              className="inline-flex items-center justify-center border border-black/10 text-[#5D6359] bg-white/50 px-8 py-3.5 rounded-full hover:border-black/20 hover:text-[#1F241E] transition-colors text-sm font-medium"
            >
              Xem portfolio
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {["Phản hồi trong 2 giờ", "Báo giá chi tiết 100%", "Ký hợp đồng rõ ràng"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-[#8A8F83]">
                <span className="w-1 h-1 rounded-full bg-[#C9972A]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
