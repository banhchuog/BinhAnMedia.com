import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight, Youtube } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đinh Công Hiếu — Đạo diễn",
  description:
    "Hồ sơ năng lực đạo diễn Đinh Công Hiếu — Phim điện ảnh chiếu rạp, Netflix, nền tảng chiếu phim trả phí & quảng cáo thương hiệu.",
  openGraph: {
    title: "Đinh Công Hiếu — Đạo diễn",
    description: "Phim chiếu rạp · Netflix · Founder · Quảng cáo",
    type: "profile",
  },
};

/* ─── Grain SVG (inline, reusable) ──────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Projects data ──────────────────────────────────────── */
const projects = [
  {
    id: "hon-ma",
    year: "2019",
    index: "01",
    category: "Phim điện ảnh · Netflix",
    title: "Hồn Ma\nĐêm Valentine",
    logline: "Tình yêu không chết — nhưng đôi khi nó trở lại theo cách bạn không muốn.",
    desc: "Bộ phim kinh dị tâm lý phát hành độc quyền trên Netflix. Câu chuyện về tình yêu và nỗi ám ảnh từ thế giới bên kia trong đêm Valentine, chạm đến hàng triệu khán giả quốc tế.",
    meta: ["Netflix Original", "Phát hành 2019", "Phim dài"],
    accent: "#E50914",
    accentDim: "rgba(229,9,20,0.10)",
    poster: "/images/dcv/hon-ma-poster.jpg",
    wide: "/images/dcv/hon-ma-wide.jpg",
    frames: [
      { src: "/images/dcv/hon-ma-f1.jpg", caption: "Cảnh mở đầu" },
      { src: "/images/dcv/hon-ma-f2.jpg", caption: "Nhân vật chính" },
      { src: "/images/dcv/hon-ma-f3.jpg", caption: "Đêm Valentine" },
      { src: "/images/dcv/hon-ma-f4.jpg", caption: "Nỗi ám ảnh" },
      { src: "/images/dcv/hon-ma-f5.jpg", caption: "Climax" },
      { src: "/images/dcv/hon-ma-f6.jpg", caption: "Kết phim" },
      { src: "/images/dcv/hon-ma-f7.jpg", caption: "Color grade" },
      { src: "/images/dcv/hon-ma-f8.jpg", caption: "Behind the scenes" },
    ],
  },
  {
    id: "vo-dien",
    year: "2020 – 2022",
    index: "02",
    category: "Phim điện ảnh chiếu rạp",
    title: "Vô Diện\nSát Nhân",
    logline: "Hắn không có mặt — nhưng hắn đang nhìn bạn.",
    desc: "Phim kinh dị tâm lý chiếu rạp toàn quốc. Sản xuất từ 2020, ra rạp năm 2022. Câu chuyện về kẻ giết người không danh tính gieo rắc nỗi kinh hoàng trong một thành phố ẩn chứa bí mật tối tăm.",
    meta: ["Chiếu rạp toàn quốc", "Ra rạp 2022", "Horror · Thriller"],
    accent: "#C9972A",
    accentDim: "rgba(201,151,42,0.10)",
    poster: "/images/dcv/vo-dien-poster.jpg",
    wide: "/images/dcv/vo-dien-wide.jpg",
    frames: [
      { src: "/images/dcv/vd-f1.jpg", caption: "Cảnh mở màn" },
      { src: "/images/dcv/vd-f2.jpg", caption: "Kẻ vô diện" },
      { src: "/images/dcv/vd-f3.jpg", caption: "Theo dõi" },
      { src: "/images/dcv/vd-f4.jpg", caption: "Đêm định mệnh" },
      { src: "/images/dcv/vd-f5.jpg", caption: "Cuộc đối đầu" },
      { src: "/images/dcv/vd-f6.jpg", caption: "Final scene" },
      { src: "/images/dcv/vd-f7.jpg", caption: "Color grade" },
      { src: "/images/dcv/vd-f8.jpg", caption: "Behind the scenes" },
    ],
  },
  {
    id: "platform",
    year: "2025",
    index: "03",
    category: "Founder · Nền tảng số",
    title: "Social &\nStreaming Platform",
    logline: "Hệ sinh thái nội dung bản địa — 104 tập phim mới mỗi năm.",
    desc: "Sáng lập nền tảng kết hợp mạng xã hội và chiếu phim trả phí. Vận hành với hiệu suất 104 tập phim mới mỗi năm — tương đương 2 tập/tuần liên tục — kiến tạo hệ sinh thái nội dung bản địa bền vững.",
    meta: ["Founder & Director", "Ra mắt 2025", "104 tập / năm"],
    accent: "#6C63FF",
    accentDim: "rgba(108,99,255,0.10)",
    poster: "/images/dcv/platform-poster.jpg",
    wide: "/images/dcv/platform-wide.jpg",
    frames: [
      { src: "/images/dcv/pl-f1.jpg", caption: "Tập 1" },
      { src: "/images/dcv/pl-f2.jpg", caption: "Studio" },
      { src: "/images/dcv/pl-f3.jpg", caption: "Post-production" },
      { src: "/images/dcv/pl-f4.jpg", caption: "Series nổi bật" },
      { src: "/images/dcv/pl-f5.jpg", caption: "On set" },
      { src: "/images/dcv/pl-f6.jpg", caption: "Tập 104" },
      { src: "/images/dcv/pl-f7.jpg", caption: "Color grade" },
      { src: "/images/dcv/pl-f8.jpg", caption: "Behind the camera" },
    ],
  },
  {
    id: "ads",
    year: "Ongoing",
    index: "04",
    category: "TVC & Brand Film",
    title: "Quảng Cáo\nThương Hiệu",
    logline: "Mỗi thương hiệu đều xứng đáng có một câu chuyện điện ảnh.",
    desc: "Song song với điện ảnh, liên tục dẫn dắt các dự án TVC, viral video và brand film cho doanh nghiệp trong nước và quốc tế — từ brief đến post-production.",
    meta: ["TVC", "Brand Film", "Viral Content"],
    accent: "#2DD4BF",
    accentDim: "rgba(45,212,191,0.10)",
    poster: "/images/dcv/ads-poster.jpg",
    wide: "/images/dcv/ads-wide.jpg",
    frames: [
      { src: "/images/dcv/ads-f1.jpg", caption: "TVC 30s" },
      { src: "/images/dcv/ads-f2.jpg", caption: "Brand film" },
      { src: "/images/dcv/ads-f3.jpg", caption: "Viral campaign" },
      { src: "/images/dcv/ads-f4.jpg", caption: "Product shot" },
      { src: "/images/dcv/ads-f5.jpg", caption: "On set" },
      { src: "/images/dcv/ads-f6.jpg", caption: "Color grade" },
      { src: "/images/dcv/ads-f7.jpg", caption: "Director's cut" },
      { src: "/images/dcv/ads-f8.jpg", caption: "Behind the scenes" },
    ],
  },
];

/* ─── Sprocket strip ─────────────────────────────────────── */
function Sprockets() {
  return (
    <div className="flex items-center justify-between px-3 h-full gap-[3px]">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="w-[7px] h-[9px] rounded-[2px] bg-[#111] border border-[#1e1e1e] flex-shrink-0" />
      ))}
    </div>
  );
}

/* ─── Cinematic film frame ───────────────────────────────── */
function FilmFrame({
  src,
  caption,
  accent,
  aspect = "16/9",
}: {
  src: string;
  caption: string;
  accent: string;
  aspect?: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-[#0c0c0c]" style={{ borderRadius: 3 }}>
      {/* Top sprocket strip */}
      <div className="h-5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <Sprockets />
      </div>

      {/* Frame image */}
      <div className="relative overflow-hidden mx-[2px]" style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={caption}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Caption reveal */}
        <div
          className="absolute inset-x-0 bottom-0 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), transparent)" }}
        >
          <p
            className="text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            {caption}
          </p>
        </div>
        {/* Placeholder icon when no image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 pointer-events-none">
          <div className="flex flex-col items-center gap-1 opacity-[0.18]">
            <Play size={18} style={{ color: accent }} />
            <span className="text-[8px] font-mono tracking-widest uppercase" style={{ color: accent }}>
              {caption}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom sprocket strip */}
      <div className="h-5 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <Sprockets />
      </div>

      {/* Kodak label */}
      <div className="absolute top-[2px] right-10 h-5 flex items-center pointer-events-none">
        <span className="text-[7px] font-mono text-[#2a2a2a] tracking-[0.3em] uppercase">
          KODAK 5219
        </span>
      </div>
    </div>
  );
}

/* ─── Wide cinematic banner ──────────────────────────────── */
function WideBanner({ src, title, accent }: { src: string; title: string; accent: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9", borderRadius: 3 }}>
      <Image src={src} alt={title} fill className="object-cover" />
      {/* Letterbox bars */}
      <div className="absolute inset-x-0 top-0 h-[7%] bg-black pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[7%] bg-black pointer-events-none" />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px" }}
      />
      {/* Gradient sides */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.65) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2" style={{ opacity: 0.15 }}>
          <Play size={36} style={{ color: accent }} />
          <span
            className="text-[10px] tracking-[0.4em] uppercase font-bold"
            style={{ color: accent }}
          >
            Wide Shot
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Poster ─────────────────────────────────────────────── */
function PosterFrame({ src, title, accent }: { src: string; title: string; accent: string }) {
  return (
    <div
      className="group relative overflow-hidden w-full h-full"
      style={{ aspectRatio: "2/3", borderRadius: 3 }}
    >
      <Image src={src} alt={`Poster ${title}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div
        className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
      />
      {/* Placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ opacity: 0.15 }}>
        <Play size={24} style={{ color: accent }} />
        <span className="text-[9px] tracking-widest uppercase font-bold mt-1" style={{ color: accent }}>
          Poster
        </span>
      </div>
      {/* Label */}
      <div
        className="absolute inset-x-0 bottom-0 p-3"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase font-bold" style={{ color: accent }}>
          Official Poster
        </span>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default async function DinhCongHieuPage() {
  // Fetch directorMedia from DB
  type DirectorProjectMedia = {
    poster?: string;
    wide?: string;
    frames?: { id: string; url: string; caption: string }[];
    youtubeLinks?: { id: string; ytId: string; label: string }[];
  };
  let directorMedia: Record<string, DirectorProjectMedia> = {};
  try {
    if (prisma) {
      const s = await prisma.settings.findUnique({ where: { id: 1 } });
      if (s) {
        const raw = (s as unknown as { directorMedia?: unknown }).directorMedia;
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
          directorMedia = raw as Record<string, DirectorProjectMedia>;
        }
      }
    }
  } catch {}

  // Merge DB media into projects (DB values override static fallbacks when non-empty)
  const mergedProjects = projects.map((p) => {
    const dm = directorMedia[p.id];
    if (!dm) return p;
    return {
      ...p,
      poster: dm.poster?.startsWith("data:") ? dm.poster : p.poster,
      wide: dm.wide?.startsWith("data:") ? dm.wide : p.wide,
      frames: p.frames.map((f, i) => {
        const df = dm.frames?.[i];
        return df?.url?.startsWith("data:") ? { src: df.url, caption: df.caption || f.caption } : f;
      }),
      youtubeLinks: dm.youtubeLinks ?? [],
    };
  });

  return (
    <main
      className="min-h-screen text-[#F5F5F7] overflow-x-hidden"
      style={{ background: "#070707" }}
    >
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 px-6 sm:px-12 lg:px-20">
        {/* Grain BG */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px" }}
        />
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(201,151,42,0.07) 0%, transparent 65%)",
          }}
        />

        {/* Breadcrumb */}
        <div className="absolute top-8 left-6 sm:left-12 lg:left-20 flex items-center gap-3">
          <Link
            href="/"
            className="text-[10px] tracking-[0.25em] uppercase font-bold transition-colors"
            style={{ color: "#444" }}
          >
            Bình An Media
          </Link>
          <span style={{ color: "#222" }}>/</span>
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: "#333" }}>
            Director
          </span>
        </div>

        {/* Vertical label */}
        <div
          className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-4"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-[8px] tracking-[0.4em] uppercase font-bold" style={{ color: "#222" }}>
            Director Profile
          </span>
          <div className="w-px h-16 bg-[#181818]" />
          <span className="text-[8px] tracking-[0.4em] uppercase font-bold" style={{ color: "#222" }}>
            2019 — 2025
          </span>
        </div>

        {/* Main content */}
        <div className="relative max-w-6xl">
          <p
            className="mb-6 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-black"
            style={{ color: "#C9972A" }}
          >
            Hồ sơ năng lực · Đạo diễn
          </p>

          <h1
            className="font-black leading-[0.86] tracking-[-0.045em] mb-8"
            style={{ fontSize: "clamp(3.8rem, 15vw, 12rem)", color: "#F5F5F7" }}
          >
            Đinh
            <br />
            <span
              style={{
                WebkitTextStroke: "2px rgba(201,151,42,0.55)",
                color: "transparent",
              }}
            >
              Công
            </span>
            <br />
            Hiếu
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap items-end gap-x-12 gap-y-5 mb-10">
            {[
              { val: "2", label: "Phim điện ảnh" },
              { val: "1", label: "Netflix title" },
              { val: "104", label: "Tập / năm" },
              { val: "12+", label: "Năm kinh nghiệm" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="font-black leading-none tracking-tight"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#C9972A" }}
                >
                  {s.val}
                </p>
                <p
                  className="text-[10px] tracking-[0.25em] uppercase font-bold mt-1"
                  style={{ color: "#444" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2">
            {["Điện ảnh chiếu rạp", "Netflix", "Streaming Founder", "TVC & Brand Film"].map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-[7px]"
                style={{
                  borderRadius: 2,
                  border: "1px solid rgba(201,151,42,0.2)",
                  color: "rgba(201,151,42,0.75)",
                  background: "rgba(201,151,42,0.05)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#2a2a2a]" />
          <span className="text-[8px] tracking-[0.35em] uppercase font-bold" style={{ color: "#2a2a2a" }}>
            Scroll
          </span>
        </div>
      </section>

      {/* ══ PROJECTS ══════════════════════════════════════════ */}
      {mergedProjects.map((p, pi) => (
        <section
          key={p.id}
          className="relative py-24 sm:py-32 lg:py-40"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {/* BG glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 55% 45% at ${pi % 2 === 0 ? "15%" : "85%"} 50%, ${p.accentDim} 0%, transparent 65%)`,
            }}
          />

          <div className="relative max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="text-[9px] tracking-[0.45em] uppercase font-black"
                    style={{ color: p.accent }}
                  >
                    {p.category}
                  </span>
                  <div className="h-px w-12" style={{ background: p.accent, opacity: 0.25 }} />
                  <span className="text-[9px] font-mono tracking-[0.3em]" style={{ color: "#222" }}>
                    {p.index} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <h2
                  className="font-black leading-[0.88] tracking-[-0.04em] whitespace-pre-line mb-5"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", color: "#F5F5F7" }}
                >
                  {p.title}
                </h2>

                <p
                  className="text-sm sm:text-base italic font-light mb-4"
                  style={{ color: p.accent, maxWidth: 500 }}
                >
                  &ldquo;{p.logline}&rdquo;
                </p>

                <p className="text-[#555] text-sm leading-relaxed max-w-lg">{p.desc}</p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-3 lg:pb-3">
                <span
                  className="font-black tracking-[-0.04em] leading-none"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5.5rem)",
                    color: "rgba(255,255,255,0.04)",
                  }}
                >
                  {p.year}
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.meta.map((m) => (
                    <span
                      key={m}
                      className="text-[9px] tracking-[0.2em] uppercase font-black px-3 py-[6px]"
                      style={{
                        borderRadius: 2,
                        background: p.accentDim,
                        color: p.accent,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Wide banner (21:9) ── */}
            <div className="mb-3">
              <WideBanner src={p.wide} title={p.title} accent={p.accent} />
            </div>

            {/* ── Row 1: Poster (portrait) + 2 landscape frames ── */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="row-span-2 col-span-1">
                <PosterFrame src={p.poster} title={p.title} accent={p.accent} />
              </div>
              {p.frames.slice(0, 2).map((f) => (
                <div key={f.src} className="col-span-1">
                  <FilmFrame src={f.src} caption={f.caption} accent={p.accent} />
                </div>
              ))}
              {/* 3rd landscape frame fills bottom-right of the 3-col grid */}
              {p.frames.slice(2, 4).map((f) => (
                <div key={f.src} className="col-span-1">
                  <FilmFrame src={f.src} caption={f.caption} accent={p.accent} />
                </div>
              ))}
            </div>

            {/* ── 4 frames in a row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {p.frames.slice(4, 8).map((f) => (
                <FilmFrame key={f.src} src={f.src} caption={f.caption} accent={p.accent} />
              ))}
            </div>

            {/* ── Extra frames if any ── */}
            {p.frames.length > 8 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {p.frames.slice(8).map((f) => (
                  <FilmFrame key={f.src} src={f.src} caption={f.caption} accent={p.accent} />
                ))}
              </div>
            )}

            {/* ── YouTube Links ── */}
            {("youtubeLinks" in p) && Array.isArray((p as { youtubeLinks?: { id: string; ytId: string; label: string }[] }).youtubeLinks) && (p as { youtubeLinks?: { id: string; ytId: string; label: string }[] }).youtubeLinks!.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {(p as { youtubeLinks: { id: string; ytId: string; label: string }[] }).youtubeLinks.map((yt) => (
                  <a
                    key={yt.id}
                    href={yt.ytId.startsWith("http") ? yt.ytId : `https://youtu.be/${yt.ytId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all hover:opacity-80"
                    style={{
                      borderRadius: 2,
                      border: `1px solid ${p.accent}40`,
                      background: `${p.accent}12`,
                      color: p.accent,
                    }}
                  >
                    <Youtube size={14} />
                    {yt.label || "Xem video"}
                  </a>
                ))}
              </div>
            )}

            {/* Accent divider */}
            <div
              className="mt-20 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${p.accent}30, transparent)`,
              }}
            />
          </div>
        </section>
      ))}

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section
        className="relative py-32 px-6 sm:px-12 text-center overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,151,42,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px" }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.45em] uppercase font-black mb-6" style={{ color: "#C9972A" }}>
            Hợp tác
          </p>
          <h2
            className="font-black leading-[0.88] tracking-[-0.045em] mb-6"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", color: "#F5F5F7" }}
          >
            Cùng tạo ra
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(201,151,42,0.6)", color: "transparent" }}>
              dự án tiếp theo
            </span>
          </h2>
          <p className="text-[#444] text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Bạn có dự án phim, thương hiệu hoặc nội dung sáng tạo muốn đưa lên màn ảnh?
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-3 font-black px-10 py-4 transition-all duration-300 hover:gap-5"
            style={{
              borderRadius: 2,
              background: "#C9972A",
              color: "#070707",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Liên hệ ngay <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
