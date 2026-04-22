"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Globe, Download, Loader2, Play, X, ArrowRight,
  Film, Music, Building2, Smartphone, Camera, Sparkles,
  Phone, Mail, MapPin, Globe2, Award, Clock, Shield, Layers, Zap, Star,
} from "lucide-react";
// ─── Shared Types (also exported for page.tsx) ───────────────────
export type VideoItem = { id: string; ytId: string; title: string; client: string; year: string; cat: string; desc?: string; views?: string; duration?: string; thumbnail?: string };
export type FounderData = { name: string; title: string; experience: string; photoUrl: string; bio: string[]; linkUrl?: string; linkLabel?: string };
export type TestimonialItem = { name: string; role: string; body: string };
export type ServiceItem = { iconName: string; title: string; titleEn: string; desc: string; descEn: string };

// ─── Types ────────────────────────────────────────────────────────
type Lang = "vi" | "en";
type GalleryPhoto = { id: string; url: string; type: "frame" | "bts"; caption: string; project: string };

// ─── Icon map ─────────────────────────────────────────────────────
const IconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Film, Music, Building2, Smartphone, Camera, Sparkles,
  Award, Clock, Shield, Layers, Zap, Star,
};

// ─── Category config (same as showreel) ──────────────────────────
const CAT_COLORS: Record<string, { accent: string; bg: string }> = {
  TVC:       { accent: "#fb923c", bg: "rgba(251,146,60,0.08)" },
  MV:        { accent: "#c084fc", bg: "rgba(192,132,252,0.08)" },
  Corporate: { accent: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  Social:    { accent: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  Event:     { accent: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  Motion:    { accent: "#f472b6", bg: "rgba(244,114,182,0.08)" },
};

const CATS_VI = ["Tất cả", "TVC", "MV", "Corporate", "Social", "Event", "Motion"];
const CATS_EN = ["All", "TVC", "MV", "Corporate", "Social", "Event", "Motion"];

function extractYtId(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/[?&]v=([^&]+)/) || raw.match(/youtu\.be\/([^?&]+)/) || raw.match(/shorts\/([^?&]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return "";
}

// ─── Props ────────────────────────────────────────────────────────
interface Props {
  heroId: string;
  clientLogos: string[];
  founder: FounderData;
  testimonials: TestimonialItem[];
  videos: VideoItem[];
  services: ServiceItem[];
}

// ─── Main ─────────────────────────────────────────────────────────
export default function ProposalClient({ heroId, clientLogos, founder, testimonials, videos, services }: Props) {
  const [lang, setLang] = useState<Lang>("vi");
  const [downloading, setDownloading] = useState(false);
  const [activeVideoCat, setActiveVideoCat] = useState("Tất cả");
  const [lightboxVideo, setLightboxVideo] = useState<VideoItem | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [activeGalFilter, setActiveGalFilter] = useState<"all" | "frame" | "bts">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const docRef = useRef<HTMLDivElement>(null);

  // Fetch gallery photos from settings
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.galleryPhotos)) setGalleryPhotos(d.galleryPhotos); })
      .catch(() => {});
  }, []);

  const vi = lang === "vi";

  // ── PDF ──────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!docRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `BinhAnMedia_Proposal_${lang.toUpperCase()}_${new Date().getFullYear()}.pdf`,
          html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: "#0a0a0a" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(docRef.current)
        .save();
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }, [lang, downloading]);

  // ── Filtered videos ──────────────────────────────────────────────
  const cats = vi ? CATS_VI : CATS_EN;
  const filteredVideos = videos.filter((v) => {
    if (activeVideoCat === "Tất cả" || activeVideoCat === "All") return true;
    return v.cat === activeVideoCat;
  });

  const filteredGallery = galleryPhotos.filter((p) => activeGalFilter === "all" || p.type === activeGalFilter);

  // ── Helpers ──────────────────────────────────────────────────────
  const dateStr = new Date().toLocaleDateString(vi ? "vi-VN" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      {/* ── Floating controls (screen-only) ─────────────────────── */}
      <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => { setLang(l => l === "vi" ? "en" : "vi"); setActiveVideoCat(lang === "vi" ? "All" : "Tất cả"); }}
          className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-white/20 transition"
        >
          <Globe size={13} /> {vi ? "EN" : "VI"}
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 bg-[#C9972A] text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-[#dba830] transition disabled:opacity-60"
        >
          {downloading ? <><Loader2 size={13} className="animate-spin" /> {vi ? "Đang xuất..." : "Exporting..."}</> : <><Download size={13} /> {vi ? "Tải PDF" : "Download PDF"}</>}
        </button>
      </div>

      {/* ── Lightbox: Video ─────────────────────────────────────── */}
      {lightboxVideo && (
        <div className="no-print fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxVideo(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={24} /></button>
          <div className="w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            {extractYtId(lightboxVideo.ytId) ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYtId(lightboxVideo.ytId)}?autoplay=1`}
                className="w-full h-full rounded-2xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                <p className="text-white/40 text-sm">{vi ? "Video chưa có link YouTube" : "No YouTube link yet"}</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-6 text-center">
            <p className="text-white font-bold text-sm">{lightboxVideo.title}</p>
            <p className="text-white/40 text-xs mt-1">{lightboxVideo.client} · {lightboxVideo.year}</p>
          </div>
        </div>
      )}

      {/* ── Lightbox: Photo ─────────────────────────────────────── */}
      {lightboxPhoto && (
        <div className="no-print fixed inset-0 z-[999] bg-black/97 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={24} /></button>
          <div className="max-w-4xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxPhoto.url} alt={lightboxPhoto.caption} className="max-w-full max-h-[78vh] object-contain rounded-xl" />
            {(lightboxPhoto.caption || lightboxPhoto.project) && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl px-4 py-3">
                {lightboxPhoto.caption && <p className="text-white text-sm font-semibold">{lightboxPhoto.caption}</p>}
                {lightboxPhoto.project && <p className="text-white/50 text-xs mt-0.5">{lightboxPhoto.project}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════ DOCUMENT ══════════════════════════ */}
      <div ref={docRef} className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: "'Segoe UI','Inter',sans-serif" }}>

        {/* ── COVER ─────────────────────────────────────────────── */}
        <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "linear-gradient(135deg,#0a0a0a 0%,#140e03 60%,#0a0a0a 100%)" }}>
          {/* Hero video blurred bg */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <iframe
              src={`https://www.youtube.com/embed/${heroId}?autoplay=1&mute=1&loop=1&playlist=${heroId}&controls=0&playsinline=1`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.8%] h-full min-w-full"
              allow="autoplay; encrypted-media"
              title="bg"
            />
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%,rgba(201,151,42,0.12),transparent 70%)" }} />
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C9972A,transparent)" }} />

          {/* Top bar */}
          <div className="relative flex items-center justify-between px-8 sm:px-16 pt-10">
            <div>
              <span className="font-black text-2xl text-white">BinhAn</span><span className="font-black text-2xl text-[#C9972A]">Media</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.25em]">{vi ? "Tài liệu giới thiệu" : "Company Presentation"}</div>
              <div className="text-xs text-white/50 mt-0.5">{vi ? "Ngày phát hành" : "Issue Date"}: {dateStr}</div>
            </div>
          </div>

          {/* Center */}
          <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8 py-20">
            <p className="text-[10px] font-bold text-[#C9972A] uppercase tracking-[0.4em] mb-6">{vi ? "Kính gửi Quý khách hàng" : "Dear Valued Client"}</p>
            <h1 className="text-6xl sm:text-7xl font-black leading-tight mb-5">
              Bình An<br /><span className="text-[#C9972A]">Media</span>
            </h1>
            <p className="text-lg font-semibold text-white/70 mb-2">{vi ? "Đơn vị sản xuất video chuyên nghiệp" : "Professional Video Production Company"}</p>
            <p className="text-sm text-white/35 tracking-widest">{vi ? "TVC · MV Ca nhạc · Phim doanh nghiệp · Social Content" : "TVC · Music Video · Corporate Film · Social Content"}</p>

            {/* Stats */}
            <div className="flex gap-10 sm:gap-16 justify-center mt-14">
              {[
                { v: "200+", l: vi ? "Dự án hoàn thành" : "Projects Completed" },
                { v: "12+",  l: vi ? "Năm kinh nghiệm"  : "Years Experience" },
                { v: "50+",  l: vi ? "Thương hiệu lớn"  : "Major Brands" },
                { v: "4K",   l: vi ? "Tiêu chuẩn quay"  : "Production Std." },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#C9972A]">{s.v}</div>
                  <div className="text-[10px] text-white/35 mt-1 leading-tight">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Client logos */}
            {clientLogos.length > 0 && (
              <div className="mt-12">
                <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] mb-4">{vi ? "Một số khách hàng" : "Some clients"}</p>
                <div className="flex flex-wrap justify-center gap-5 items-center">
                  {clientLogos.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt="" className="h-6 w-auto object-contain" style={{ filter: "grayscale(1) brightness(0.6)", opacity: 0.5 }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative px-8 sm:px-16 pb-10 flex items-center justify-between border-t border-white/6 pt-6">
            <p className="text-[10px] text-white/25">hello@binhanmedia.vn · binhanmedia.vn</p>
            <p className="text-[10px] text-white/15">© {new Date().getFullYear()} Bình An Media</p>
          </div>
        </div>

        {/* ── BODY ──────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 space-y-24">

          {/* ─ Services ─────────────────────────────────────────── */}
          <section>
            <SectionLabel>{vi ? "02 — Dịch vụ" : "02 — Services"}</SectionLabel>
            <h2 className="text-3xl font-black text-white mb-10">{vi ? "Chúng tôi làm được gì" : "What We Do"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => {
                const Icon = IconMap[svc.iconName];
                return (
                  <div key={svc.title} className="group bg-[#161616] border border-white/6 rounded-2xl p-6 hover:border-[#C9972A]/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#C9972A]/10 flex items-center justify-center mb-4">
                      {Icon && <Icon size={18} className="text-[#C9972A]" />}
                    </div>
                    <h3 className="font-bold text-white text-[14px] mb-2">{vi ? svc.title : svc.titleEn}</h3>
                    <p className="text-white/40 text-[12px] leading-relaxed">{vi ? svc.desc : svc.descEn}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─ Portfolio videos ──────────────────────────────────── */}
          <section>
            <SectionLabel>{vi ? "03 — Portfolio" : "03 — Portfolio"}</SectionLabel>
            <h2 className="text-3xl font-black text-white mb-3">{vi ? "Dự án nổi bật" : "Featured Work"}</h2>
            <p className="text-white/40 text-sm mb-8">{vi ? `${videos.length} dự án — nhấn để xem video` : `${videos.length} projects — click to watch`}</p>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-8">
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveVideoCat(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition no-print ${
                    activeVideoCat === cat
                      ? "bg-[#C9972A] text-black"
                      : "bg-white/5 text-white/50 border border-white/10 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((v) => {
                const ytId = extractYtId(v.ytId);
                const cc = CAT_COLORS[v.cat] || CAT_COLORS.TVC;
                const thumb = v.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");
                return (
                  <button
                    key={v.id}
                    onClick={() => setLightboxVideo(v)}
                    className="group text-left bg-[#111] rounded-2xl overflow-hidden border border-white/6 hover:border-[#C9972A]/40 transition-all hover:-translate-y-0.5 no-print"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg,${cc.bg},transparent)` }}>
                          <Film size={28} className="text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Play size={18} fill="white" className="text-white ml-0.5" />
                        </div>
                      </div>
                      {/* Cat badge */}
                      <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: cc.accent, color: "#000" }}>{v.cat}</span>
                      {v.views && <span className="absolute top-2 right-2 text-[9px] text-white/70 bg-black/60 px-2 py-0.5 rounded-full">{v.views}</span>}
                      {v.duration && <span className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/60 px-1.5 py-0.5 rounded font-mono">{v.duration}</span>}
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <p className="font-bold text-white text-[13px] leading-snug mb-1 line-clamp-2">{v.title}</p>
                      <p className="text-[11px] text-white/35">{v.client}{v.year ? ` · ${v.year}` : ""}</p>
                      {v.desc && <p className="text-[11px] text-white/30 mt-2 leading-relaxed line-clamp-2">{v.desc}</p>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PDF version: static grid without hover */}
            <div className="pdf-only hidden grid grid-cols-3 gap-3">
              {videos.slice(0, 9).map((v) => {
                const ytId = extractYtId(v.ytId);
                const thumb = v.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");
                const cc = CAT_COLORS[v.cat] || CAT_COLORS.TVC;
                return (
                  <div key={v.id} className="rounded-xl overflow-hidden bg-[#111] border border-white/8">
                    <div className="relative aspect-video bg-[#1a1a1a]">
                      {thumb && <img src={thumb} alt={v.title} className="w-full h-full object-cover" />}
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: cc.accent, color: "#000" }}>{v.cat}</span>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-white text-[11px] mb-0.5 line-clamp-1">{v.title}</p>
                      <p className="text-[9px] text-white/35">{v.client}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─ Gallery ───────────────────────────────────────────── */}
          {galleryPhotos.length > 0 && (
            <section>
              <SectionLabel>{vi ? "04 — Thư viện ảnh" : "04 — Gallery"}</SectionLabel>
              <h2 className="text-3xl font-black text-white mb-3">{vi ? "Frame đẹp & Hậu trường" : "Stills & Behind the Scenes"}</h2>
              <p className="text-white/40 text-sm mb-6">{vi ? "Từng khoảnh khắc đẹp trên phim trường" : "Beautiful moments from our sets"}</p>

              {/* Filter */}
              <div className="flex gap-2 mb-8 no-print">
                {([["all", vi ? "Tất cả" : "All"], ["frame", vi ? "Frame đẹp" : "Stills"], ["bts", vi ? "Hậu trường" : "Behind the Scenes"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveGalFilter(key as "all" | "frame" | "bts")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                      activeGalFilter === key ? "bg-[#C9972A] text-black" : "bg-white/5 text-white/50 border border-white/10 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Masonry-style grid */}
              <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                {filteredGallery.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo)}
                    className="group break-inside-avoid w-full text-left relative overflow-hidden rounded-xl bg-[#111] border border-white/6 hover:border-[#C9972A]/40 transition-all no-print block"
                    style={{ marginBottom: "12px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i % 3 === 0 ? "aspect-video" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition">
                      {photo.caption && <p className="text-white text-xs font-semibold leading-snug">{photo.caption}</p>}
                      {photo.project && <p className="text-white/50 text-[10px] mt-0.5">{photo.project}</p>}
                    </div>
                    {/* Type badge */}
                    <span className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full ${photo.type === "frame" ? "bg-[#C9972A] text-black" : "bg-white/15 text-white backdrop-blur"}`}>
                      {photo.type === "frame" ? (vi ? "Frame" : "Still") : (vi ? "BTS" : "BTS")}
                    </span>
                  </button>
                ))}
              </div>

              {/* PDF static grid */}
              <div className="pdf-only hidden grid grid-cols-3 gap-3">
                {galleryPhotos.slice(0, 9).map((photo) => (
                  <div key={photo.id} className="rounded-xl overflow-hidden bg-[#111] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.caption} className="w-full aspect-video object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                        <p className="text-white text-[9px] font-semibold line-clamp-1">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─ Founder ───────────────────────────────────────────── */}
          <section>
            <SectionLabel>{vi ? "05 — Người sáng lập" : "05 — Founder"}</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-14 items-start">
              <div className="relative w-48 sm:w-64 h-60 sm:h-80 rounded-2xl overflow-hidden border border-white/8 mx-auto md:mx-0">
                {founder.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={founder.photoUrl} alt={founder.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(201,151,42,0.2),#111)" }}>
                    <span className="text-6xl font-black text-white/10 select-none">{founder.name.split(" ").map((w: string) => w[0]).join("")}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#C9972A] uppercase tracking-[0.3em] mb-3">{founder.title}</p>
                <h2 className="text-3xl font-black text-white mb-2">{founder.name}</h2>
                <p className="text-[#C9972A] font-bold text-sm mb-5">{founder.experience} {vi ? "trong ngành sản xuất phim" : "in film production"}</p>
                <div className="space-y-3">
                  {founder.bio.map((p: string, i: number) => <p key={i} className="text-white/50 text-[13px] leading-relaxed">{p}</p>)}
                </div>
                {founder.linkUrl && (
                  <a href={founder.linkUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 border border-white/10 text-white/50 px-5 py-2.5 rounded-full text-xs hover:border-[#C9972A]/40 hover:text-[#C9972A] transition"
                  >
                    {founder.linkLabel || founder.linkUrl} <ArrowRight size={11} />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* ─ Testimonials ──────────────────────────────────────── */}
          {testimonials.length > 0 && (
            <section>
              <SectionLabel>{vi ? "06 — Khách hàng nói" : "06 — What Clients Say"}</SectionLabel>
              <h2 className="text-3xl font-black text-white mb-10">{vi ? "Đánh giá từ khách hàng" : "Client Testimonials"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-[#111] rounded-2xl p-6 border border-white/6">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#C9972A" className="text-[#C9972A]" />)}
                    </div>
                    <p className="text-white/60 text-[13px] leading-relaxed mb-5 italic">&ldquo;{t.body}&rdquo;</p>
                    <div>
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-white/35 text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─ Why us ────────────────────────────────────────────── */}
          <section>
            <SectionLabel>{vi ? "07 — Tại sao chọn chúng tôi" : "07 — Why Choose Us"}</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: "Award",  vi: ["12+ năm chuyên môn",    "Đội ngũ đào tạo bài bản, kinh nghiệm thực chiến hàng trăm thương hiệu."],                en: ["12+ Years Expertise",    "Professionally trained team with real-world experience across hundreds of brands."] },
                { icon: "Clock",  vi: ["Đúng hẹn cam kết",      "Quy trình chặt chẽ, milestone rõ ràng. Không bao giờ trễ deadline."],                     en: ["Deadline Committed",     "Rigorous workflow, clear milestones. Never miss a deadline."] },
                { icon: "Shield", vi: ["Giá minh bạch",         "Báo giá chi tiết từng hạng mục, không phát sinh ẩn."],                                     en: ["Transparent Pricing",    "Detailed itemized quotes, no hidden costs."] },
                { icon: "Layers", vi: ["Thiết bị chuyên nghiệp","Blackmagic, Sony FX, RED — chuẩn quảng cáo quốc tế."],                                    en: ["Pro Equipment",          "Blackmagic, Sony FX, RED — international advertising standard."] },
                { icon: "Zap",    vi: ["Sáng tạo linh hoạt",    "Mỗi concept được thiết kế riêng, không làm template."],                                    en: ["Creative Flexibility",   "Every concept custom-designed, no templates."] },
                { icon: "Star",   vi: ["Dịch vụ trọn gói",      "Script → post-production: một ekip, một quy trình nhất quán."],                           en: ["Full-Service Studio",    "Script to post-production: one team, one consistent workflow."] },
              ].map((r) => {
                const Icon = IconMap[r.icon];
                return (
                  <div key={r.vi[0]} className="bg-[#111] border border-white/6 rounded-2xl p-5 hover:border-[#C9972A]/25 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#C9972A]/10 flex items-center justify-center mb-3">
                      {Icon && <Icon size={16} className="text-[#C9972A]" />}
                    </div>
                    <h3 className="font-bold text-white text-[13px] mb-1.5">{vi ? r.vi[0] : r.en[0]}</h3>
                    <p className="text-white/35 text-[11px] leading-relaxed">{vi ? r.vi[1] : r.en[1]}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─ CTA ───────────────────────────────────────────────── */}
          <section>
            <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d0d0d,#1a1208)", border: "1px solid rgba(201,151,42,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(201,151,42,0.1),transparent 60%)" }} />
              <p className="text-[10px] font-bold text-[#C9972A] uppercase tracking-[0.4em] mb-4 relative">{vi ? "Sẵn sàng hợp tác?" : "Ready to collaborate?"}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative">{vi ? "Bắt đầu dự án của bạn" : "Start Your Project"}</h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto relative">{vi ? "Liên hệ để nhận tư vấn miễn phí và báo giá chi tiết." : "Contact us for a free consultation and detailed quote."}</p>
              <div className="flex items-center justify-center gap-2 bg-[#C9972A] text-black font-bold text-sm px-8 py-3.5 rounded-full w-fit mx-auto relative">
                {vi ? "Nhận báo giá miễn phí" : "Get a Free Quote"} <ArrowRight size={14} />
              </div>
              <p className="text-white/20 text-xs mt-5 relative">binhanmedia.vn · 0969 427 639 · Dinhconghieufilm@gmail.com</p>
            </div>
          </section>

          {/* ─ Footer ────────────────────────────────────────────── */}
          <footer className="border-t border-white/8 pt-8 pb-4">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
              <div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-black text-xl text-white">BinhAn</span>
                  <span className="font-black text-xl text-[#C9972A]">Media</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    { icon: Phone,  v: "0969 427 639" },
                    { icon: Mail,   v: "Dinhconghieufilm@gmail.com" },
                    { icon: Globe2, v: "binhanmedia.vn" },
                    { icon: MapPin, v: vi ? "TP. Hồ Chí Minh, Việt Nam" : "Ho Chi Minh City, Vietnam" },
                  ].map(({ icon: Icon, v }) => (
                    <div key={v} className="flex items-center gap-2 text-[12px] text-white/40">
                      <Icon size={12} className="text-[#C9972A] flex-shrink-0" />{v}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-white/20 max-w-xs leading-relaxed">
                {vi
                  ? "Tài liệu này được tạo bởi hệ thống Bình An Media. Mọi thông tin mang tính tham khảo."
                  : "This document was generated by Bình An Media. All information is for reference purposes."}
              </p>
            </div>
          </footer>

        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .pdf-only { display: grid !important; }
          body { margin: 0; background: #0a0a0a; }
        }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-black text-[#C9972A]/50 uppercase tracking-[0.3em]">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#C9972A]/20 to-transparent" />
    </div>
  );
}
