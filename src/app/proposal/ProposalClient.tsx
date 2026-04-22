"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Globe, Download, Loader2, ArrowRight,
  Film, Music, Building2, Smartphone, Camera, Sparkles,
  Phone, Mail, MapPin, Globe2, Award, Clock, Shield, Layers, Zap, Star,
} from "lucide-react";

// ─── Shared Types ─────────────────────────────────────────────────
export type VideoItem = { id: string; ytId: string; title: string; client: string; year: string; cat: string; desc?: string; views?: string; duration?: string; thumbnail?: string };
export type FounderData = { name: string; title: string; experience: string; photoUrl: string; bio: string[]; linkUrl?: string; linkLabel?: string };
export type TestimonialItem = { name: string; role: string; body: string };
export type ServiceItem = { iconName: string; title: string; titleEn: string; desc: string; descEn: string };
type Lang = "vi" | "en";
type GalleryPhoto = { id: string; url: string; type: "frame" | "bts"; caption: string; project: string };

// ─── Icon map ─────────────────────────────────────────────────────
const IconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Film, Music, Building2, Smartphone, Camera, Sparkles,
  Award, Clock, Shield, Layers, Zap, Star,
};

const CAT_COLORS: Record<string, string> = {
  TVC: "#fb923c", MV: "#c084fc", Corporate: "#60a5fa",
  Social: "#4ade80", Event: "#fbbf24", Motion: "#f472b6",
};

function extractYtId(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/[?&]v=([^&]+)/) || raw.match(/youtu\.be\/([^?&]+)/) || raw.match(/shorts\/([^?&]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return "";
}

interface Props {
  heroId: string;
  clientLogos: string[];
  founder: FounderData;
  testimonials: TestimonialItem[];
  videos: VideoItem[];
  services: ServiceItem[];
}

export default function ProposalClient({ heroId, clientLogos, founder, testimonials, videos, services }: Props) {
  const [lang, setLang] = useState<Lang>("vi");
  const [downloading, setDownloading] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [storyboardPhotos, setStoryboardPhotos] = useState<GalleryPhoto[]>([]);
  const docRef = useRef<HTMLDivElement>(null);
  const vi = lang === "vi";

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.galleryPhotos)) setGalleryPhotos(d.galleryPhotos);
        if (Array.isArray(d.storyboardPhotos)) setStoryboardPhotos(d.storyboardPhotos);
      })
      .catch(() => {});
  }, []);

  const handleDownload = useCallback(async () => {
    if (!docRef.current || downloading) return;
    setDownloading(true);
    try {
      // Scroll to top so html2canvas captures from correct origin
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 120)); // wait for scroll + repaint

      const el = docRef.current;
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 30000,
        // Critical: anchor render at element's top-left, ignore page scroll
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onclone: (clonedDoc: Document) => {
          clonedDoc.querySelectorAll<HTMLElement>(".no-print").forEach(e => { e.style.display = "none"; });
          clonedDoc.querySelectorAll<HTMLElement>(".pdf-only").forEach(e => { e.style.display = "block"; });
          clonedDoc.querySelectorAll<HTMLElement>(".marquee-track").forEach(e => { e.style.animation = "none"; e.style.transform = "translateX(0)"; });
          clonedDoc.querySelectorAll<HTMLElement>("iframe").forEach(e => { e.remove(); });
        },
      });

      const imgW = canvas.width;
      const imgH = canvas.height;
      // 1 tall page sized exactly to canvas (pixels as unit avoids mm rounding)
      const pdf = new jsPDF({ unit: "px", format: [imgW, imgH], orientation: "portrait", compress: true });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgW, imgH);
      pdf.save(`BinhAnMedia_Proposal_${lang.toUpperCase()}_${new Date().getFullYear()}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }, [lang, downloading]);

  const dateStr = new Date().toLocaleDateString(vi ? "vi-VN" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });

  // Group videos by category for display
  const videosByCat = videos.reduce<Record<string, VideoItem[]>>((acc, v) => {
    (acc[v.cat] = acc[v.cat] || []).push(v);
    return acc;
  }, {});
  const catOrder = ["TVC", "MV", "Corporate", "Social", "Event", "Motion"];
  const framePhotos = galleryPhotos.filter((p) => p.type === "frame");
  const btsPhotos   = galleryPhotos.filter((p) => p.type === "bts");

  return (
    <>
      {/* ── Floating controls (screen only, hidden in PDF) ────── */}
      <div className="no-print fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={() => setLang(l => l === "vi" ? "en" : "vi")}
          className="flex items-center gap-1.5 bg-white border border-black/15 text-[#1a1a1a] text-xs font-bold px-3 py-2 rounded-full hover:border-[#C9972A] shadow-sm transition"
        >
          <Globe size={12} /> {vi ? "EN" : "VI"}
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#b8841e] shadow transition disabled:opacity-60"
        >
          {downloading
            ? <><Loader2 size={12} className="animate-spin" /> {vi ? "Đang xuất..." : "Exporting..."}</>
            : <><Download size={12} /> {vi ? "Tải PDF" : "Download PDF"}</>}
        </button>
      </div>

      {/* ══════════════════ DOCUMENT ═══════════════════════════ */}
      <div ref={docRef} style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#ffffff", color: "#1a1a1a" }}>

        {/* ━━ COVER HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ background: "#ffffff", borderBottom: "1px solid #ede8df", position: "relative", overflow: "hidden" }}>

          {/* Top accent line */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#C9972A 0%,#e8b84b 50%,#C9972A 100%)" }} />

          {/* Main content */}
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 40px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
            {/* Left — text */}
            <div>
              {/* Brand */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 16 }}>
                <span style={{ fontWeight: 900, fontSize: 36, color: "#1a1a1a", letterSpacing: "-0.03em", lineHeight: 1 }}>BinhAn</span>
                <span style={{ fontWeight: 900, fontSize: 36, color: "#C9972A", letterSpacing: "-0.03em", lineHeight: 1 }}>Media</span>
              </div>
              {/* Tag */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,151,42,0.08)", border: "1px solid rgba(201,151,42,0.2)", borderRadius: 999, padding: "4px 14px", marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9972A" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#C9972A", textTransform: "uppercase", letterSpacing: "0.25em" }}>
                  {vi ? "Tài liệu năng lực sản xuất" : "Video Production Proposal"}
                </span>
              </div>
              {/* Greeting */}
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" }}>
                {vi ? "Kính gửi Quý Khách Hàng," : "Dear Valued Client,"}
              </p>
              <p style={{ fontSize: 13, color: "#6b6259", margin: "0 0 28px", maxWidth: 420, lineHeight: 1.8 }}>
                {vi
                  ? "Bình An Media trân trọng gửi đến Quý Khách tài liệu giới thiệu năng lực — đơn vị chuyên sản xuất TVC, MV, phim doanh nghiệp và nội dung số."
                  : "Bình An Media is pleased to present our capability proposal — specialists in TVC, MV, Corporate Film and Digital Content production."}
              </p>
              {/* Stats */}
              <div style={{ display: "flex", gap: 32 }}>
                {[{v:"200+",l:vi?"Dự án":"Projects"},{v:"12+",l:vi?"Năm KN":"Years"},{v:"50+",l:vi?"Thương hiệu":"Brands"}].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#C9972A", lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: "#9a8f82", marginTop: 4, letterSpacing: "0.06em" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — date + domain */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#9a8f82", marginBottom: 6 }}>{dateStr}</div>
              <div style={{ fontSize: 11, color: "#C9972A", fontWeight: 700 }}>binhanmedia.com</div>
            </div>
          </div>

          {/* Gallery strip — marquee of frame photos */}
          {(framePhotos.length + btsPhotos.length) > 0 && (
            <div style={{ overflow: "hidden", borderTop: "1px solid #f0ece5", position: "relative" }}>
              {/* fade edges */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg,#fff,transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg,#fff,transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div className="marquee-track" style={{ display: "flex", gap: 8, padding: "10px 0", width: "max-content" }}>
                {[...framePhotos, ...btsPhotos, ...framePhotos, ...btsPhotos].map((photo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${photo.id}-${i}`}
                    src={photo.url}
                    alt=""
                    style={{ height: 72, width: "auto", borderRadius: 8, objectFit: "cover", flexShrink: 0, display: "block" }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BODY — all sections
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 40px" }}>

          {/* ── ABOUT ─────────────────────────────────────────── */}
          <Section num="01" label={vi ? "Về chúng tôi" : "About Us"}>
            <h2 style={headingStyle}>{vi ? "Bình An Media là ai?" : "Who is Bình An Media?"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
              <p style={bodyStyle}>
                {vi
                  ? "Bình An Media là đơn vị sản xuất nội dung video chuyên nghiệp hàng đầu tại Việt Nam — từ TVC thương mại đến MV ca nhạc, phim doanh nghiệp, content mạng xã hội và sự kiện trực tiếp."
                  : "Bình An Media is a leading professional video content production company in Vietnam — from commercial TVC to music videos, corporate films, social content and live events."}
              </p>
              <p style={bodyStyle}>
                {vi
                  ? "Được sáng lập bởi đạo diễn Đinh Công Hiếu với hơn 12 năm kinh nghiệm, chúng tôi đã đồng hành cùng hơn 200 thương hiệu — từ startup đến tập đoàn đa quốc gia — biến tầm nhìn thương hiệu thành những khung hình chạm đến cảm xúc."
                  : "Founded by director Dinh Cong Hieu with over 12 years of experience, we have partnered with over 200 brands — from startups to multinationals — turning brand visions into frames that touch emotions."}
              </p>
            </div>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 32 }}>
              {[
                { v: "200+", l: vi ? "Dự án" : "Projects" },
                { v: "12+",  l: vi ? "Năm kinh nghiệm" : "Years" },
                { v: "50+",  l: vi ? "Thương hiệu" : "Brands" },
                { v: "4K",   l: vi ? "Tiêu chuẩn" : "Standard" },
              ].map((s) => (
                <div key={s.l} style={{ background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#C9972A" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#9a8f82", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── CLIENT LOGOS ──────────────────────────────────── */}
          {clientLogos.length > 0 && (
            <Section num="02" label={vi ? "Khách hàng" : "Clients"}>
              <h2 style={headingStyle}>{vi ? "Khách hàng tiêu biểu" : "Our Clients"}</h2>
              <p style={{ ...bodyStyle, marginTop: 8, marginBottom: 32 }}>
                {vi
                  ? "Bình An Media tự hào đồng hành cùng hơn 50 thương hiệu lớn nhỏ trên nhiều ngành hàng tại Việt Nam và khu vực."
                  : "Bình An Media is proud to have partnered with over 50 brands across various industries in Vietnam and the region."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {clientLogos.map((url, i) => (
                  <div key={i} style={{ background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ height: 28, width: "auto", maxWidth: 100, objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── SERVICES ──────────────────────────────────────────── */}
          <Section num={clientLogos.length > 0 ? "03" : "02"} label={vi ? "Dịch vụ" : "Services"}>
            <h2 style={headingStyle}>{vi ? "Chúng tôi có thể làm gì cho bạn" : "What We Can Do For You"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 28 }}>
              {[
                { icon: "Film",       vi: "TVC & Quảng cáo",       en: "TVC & Advertising",    tags: ["15s","30s","60s","Brand film"] },
                { icon: "Music",      vi: "MV Ca nhạc",            en: "Music Video",          tags: ["Narrative","Performance","Cinematic"] },
                { icon: "Building2",  vi: "Phim doanh nghiệp",    en: "Corporate Film",       tags: ["Brand story","Recruitment","CSR"] },
                { icon: "Smartphone", vi: "Social Content",        en: "Social Content",       tags: ["Reels","TikTok","Shorts","Series"] },
                { icon: "Camera",     vi: "Sự kiện & Livestream",  en: "Event & Livestream",   tags: ["Multi-cam","Same-day edit","Live"] },
                { icon: "Sparkles",   vi: "Motion & Animation",    en: "Motion & Animation",   tags: ["Logo anim","Explainer","Infographic"] },
              ].map((svc) => {
                const Icon = IconMap[svc.icon];
                return (
                  <div key={svc.vi} className="pdf-no-break" style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,42,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {Icon && <Icon size={16} className="text-[#C9972A]" />}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>{vi ? svc.vi : svc.en}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {svc.tags.map(t => (
                          <span key={t} style={{ fontSize: 10, color: "#8a7d6e", background: "#fff", border: "1px solid #e2dbd0", borderRadius: 999, padding: "2px 9px" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── PRODUCTION PROCESS ────────────────────────────── */}
          <Section num={clientLogos.length > 0 ? "04" : "03"} label={vi ? "Quy trình sản xuất" : "Production Process"}>
            <h2 style={headingStyle}>{vi ? "Chúng tôi làm việc như thế nào" : "How We Work"}</h2>
            <p style={{ ...bodyStyle, marginTop: 10, marginBottom: 36 }}>
              {vi
                ? "Mỗi dự án được thực hiện theo quy trình 5 bước chuẩn hoá — minh bạch, đúng hẹn và luôn có sự phê duyệt của khách hàng trước khi chuyển giai đoạn."
                : "Every project follows a standardised 5-step process — transparent, on-schedule, and with client approval at every stage before moving forward."}
            </p>

            {/* Steps */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 40 }}>
              {[
                { n: "01", vi: ["Khởi động",       "Brief, mục tiêu, ngân sách. Ký hợp đồng & thanh toán đợt 1."],                          en: ["Kickoff",         "Brief, goals, budget. Contract signing & first payment."] },
                { n: "02", vi: ["Ý tưởng &\nKịch bản", "Concept, script, storyboard chi tiết. Duyệt với khách hàng."],                       en: ["Concept &\nScript", "Concept, script, detailed storyboard. Client approval."] },
                { n: "03", vi: ["Sản xuất",         "Quay phim theo call sheet. Khách hàng có thể theo dõi trực tiếp."],                      en: ["Production",      "Shoot per call sheet. Client can observe on-set."] },
                { n: "04", vi: ["Hậu kỳ",           "Dựng, color grade, âm thanh, motion. Gửi bản nháp để góp ý."],                          en: ["Post-Production", "Edit, color grade, sound, motion. Draft sent for feedback."] },
                { n: "05", vi: ["Bàn giao",         "Chỉnh sửa theo phản hồi, xuất file chất lượng cao, bàn giao file gốc."],                 en: ["Delivery",        "Revisions, high-quality export, source files handed over."] },
              ].map((step, i) => (
                <div key={step.n} style={{ position: "relative" }}>
                  {i < 4 && (
                    <div style={{ position: "absolute", top: 18, left: "60%", right: "-40%", height: 1, background: "linear-gradient(90deg,rgba(201,151,42,0.4),rgba(201,151,42,0.05))", zIndex: 0 }} />
                  )}
                  <div className="pdf-no-break" style={{ background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 14, padding: "18px 14px", position: "relative", zIndex: 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,151,42,0.15)", border: "1px solid rgba(201,151,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: "#C9972A" }}>{step.n}</span>
                    </div>
                    <h4 style={{ fontSize: 11, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px", whiteSpace: "pre-line", lineHeight: 1.4 }}>
                      {vi ? step.vi[0] : step.en[0]}
                    </h4>
                    <p style={{ fontSize: 10, color: "#8a7d6e", lineHeight: 1.65, margin: 0 }}>
                      {vi ? step.vi[1] : step.en[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Storyboard visual */}
            {storyboardPhotos.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                {storyboardPhotos.map((photo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={photo.id} src={photo.url} alt={photo.caption || "Storyboard"} style={{ width: "100%", display: "block", borderRadius: 12, marginBottom: 10 }} />
                ))}
              </div>
            ) : (
              <div style={{ background: "#fff", border: "1px solid #e2dbd0", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #ede8df", background: "#faf8f4" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                    </div>
                    <span style={{ fontSize: 10, color: "#b0a898", fontFamily: "monospace" }}>storyboard_v2.pdf</span>
                  </div>
                  <span style={{ fontSize: 9, color: "#c4bbad" }}>{vi ? "Ví dụ minh hoạ" : "Illustration example"}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
                  {[
                    { shot: "01", angle: vi ? "Cảnh mở đầu" : "Opening shot",    note: vi ? "Wide — thiết lập không gian" : "Wide — establish space",     bars: [0.7, 0.4, 0.9] },
                    { shot: "02", angle: vi ? "Giới thiệu SP" : "Product intro",  note: vi ? "Close-up — sản phẩm hero" : "Close-up — hero product",        bars: [0.5, 0.8, 0.6] },
                    { shot: "03", angle: vi ? "Nhân vật" : "Character",           note: vi ? "Medium — cảm xúc chân thực" : "Medium — authentic emotion",   bars: [0.9, 0.3, 0.7] },
                    { shot: "04", angle: vi ? "Hành động" : "Action",             note: vi ? "Tracking — theo chuyển động" : "Tracking — follow movement",  bars: [0.6, 0.7, 0.5] },
                    { shot: "05", angle: vi ? "Chi tiết" : "Detail",              note: vi ? "Macro — texture sản phẩm" : "Macro — product texture",        bars: [0.4, 0.9, 0.8] },
                    { shot: "06", angle: vi ? "Cảnh đẹp" : "Beauty shot",         note: vi ? "Overhead — lifestyle context" : "Overhead — lifestyle context", bars: [0.8, 0.5, 0.4] },
                    { shot: "07", angle: vi ? "Branding" : "Branding",            note: vi ? "Close-up — logo reveal" : "Close-up — logo reveal",           bars: [0.3, 0.6, 0.9] },
                    { shot: "08", angle: vi ? "Kết thúc" : "End card",            note: vi ? "Fade — CTA & tagline" : "Fade — CTA & tagline",               bars: [0.9, 0.8, 0.7] },
                  ].map((frame, idx) => (
                    <div key={frame.shot} style={{ padding: "14px 14px 12px", borderRight: idx % 4 !== 3 ? "1px solid #ede8df" : "none", borderBottom: idx < 4 ? "1px solid #ede8df" : "none", background: "#fff" }}>
                      <div style={{ background: "#f0ece5", borderRadius: 8, aspectRatio: "16/10", marginBottom: 10, position: "relative", overflow: "hidden" }}>
                        <svg width="100%" height="100%" viewBox="0 0 160 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                          <rect x="0" y="0" width="160" height={100 * frame.bars[0] * 0.45} fill="rgba(201,151,42,0.10)" rx="0"/>
                          <rect x="0" y={100 * frame.bars[0] * 0.45} width="160" height={100 * frame.bars[1] * 0.3} fill="rgba(0,0,0,0.04)" rx="0"/>
                          <ellipse cx={70 + frame.bars[2] * 20} cy={100 * frame.bars[0] * 0.45 - 8} rx={18 * frame.bars[2]} ry={22 * frame.bars[1]} fill="rgba(0,0,0,0.08)"/>
                          <line x1="53" y1="0" x2="53" y2="100" stroke="rgba(201,151,42,0.2)" strokeWidth="0.5" strokeDasharray="3,3"/>
                          <line x1="107" y1="0" x2="107" y2="100" stroke="rgba(201,151,42,0.2)" strokeWidth="0.5" strokeDasharray="3,3"/>
                          <line x1="0" y1="33" x2="160" y2="33" stroke="rgba(201,151,42,0.2)" strokeWidth="0.5" strokeDasharray="3,3"/>
                          <line x1="0" y1="67" x2="160" y2="67" stroke="rgba(201,151,42,0.2)" strokeWidth="0.5" strokeDasharray="3,3"/>
                          <rect x="1" y="1" width="158" height="98" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                          <text x="6" y="13" fontSize="8" fill="rgba(201,151,42,0.7)" fontWeight="bold" fontFamily="monospace">{frame.shot}</text>
                        </svg>
                        <div style={{ position: "absolute", bottom: 5, right: 6, fontSize: 8, color: "rgba(0,0,0,0.25)", fontFamily: "monospace" }}>
                          {idx % 3 === 0 ? "WIDE" : idx % 3 === 1 ? "CU" : "MS"}
                        </div>
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#3a3530", margin: "0 0 2px" }}>{frame.angle}</p>
                      <p style={{ fontSize: 9, color: "#9a8f82", margin: 0, lineHeight: 1.5 }}>{frame.note}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 20px", background: "#faf8f4", borderTop: "1px solid #ede8df", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#b0a898" }}>
                    {vi ? "Storyboard được duyệt trước khi bắt đầu quay" : "Storyboard approved before filming begins"}
                  </span>
                  <span style={{ fontSize: 9, color: "#C9972A" }}>Bình An Media © {new Date().getFullYear()}</span>
                </div>
              </div>
            )}
          </Section>
          {/* ── GALLERY ────────────────────────────────────────────── */}
          {(framePhotos.length + btsPhotos.length) > 0 && (
            <Section num={clientLogos.length > 0 ? "05" : "04"} label={vi ? "Thư viện ảnh" : "Gallery"}>
              <h2 style={headingStyle}>{vi ? "Frame đẹp & Hậu trường" : "Stills & Behind the Scenes"}</h2>
              <p style={{ ...bodyStyle, marginTop: 8, marginBottom: 28 }}>{vi ? "Từng khoảnh khắc đẹp trên phim trường" : "Beautiful moments from our sets"}</p>

              {framePhotos.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#C9972A", textTransform: "uppercase", letterSpacing: "0.25em", margin: "0 0 14px" }}>
                    {vi ? "Frame đẹp" : "Stills"}
                  </p>
                  <div style={{ columns: 3, columnGap: 10 }}>
                    {framePhotos.map((photo) => (
                      <div key={photo.id} style={{ breakInside: "avoid", marginBottom: 10, borderRadius: 10, overflow: "hidden", background: "#f5f5f5", border: "1px solid #e8e4de" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt={photo.caption} style={{ width: "100%", display: "block" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {btsPhotos.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9a8f82", textTransform: "uppercase", letterSpacing: "0.25em", margin: "0 0 14px" }}>
                    {vi ? "Hậu trường" : "Behind the Scenes"}
                  </p>
                  <div style={{ columns: 3, columnGap: 10 }}>
                    {btsPhotos.map((photo) => (
                      <div key={photo.id} style={{ breakInside: "avoid", marginBottom: 10, borderRadius: 10, overflow: "hidden", background: "#f5f5f5", border: "1px solid #e8e4de" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt={photo.caption} style={{ width: "100%", display: "block" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}
          {/* ── PORTFOLIO ─────────────────────────────────────── */}
          <Section num={clientLogos.length > 0 ? "05" : "04"} label={vi ? "Portfolio" : "Portfolio"}>
            <h2 style={headingStyle}>{vi ? "Dự án nổi bật" : "Featured Work"}</h2>
            <p style={{ ...bodyStyle, marginBottom: 32 }}>{vi ? `${videos.length} dự án được chọn lọc` : `${videos.length} curated projects`}</p>

            {catOrder.map((cat) => {
              const catVideos = videosByCat[cat];
              if (!catVideos || catVideos.length === 0) return null;
              const accent = CAT_COLORS[cat] || "#C9972A";
              return (
                <div key={cat} style={{ marginBottom: 40 }}>
                  {/* Category heading */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, background: accent, color: "#000", padding: "3px 10px", borderRadius: 999 }}>{cat}</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
                    <span style={{ fontSize: 10, color: "#b0a898" }}>{catVideos.length} {vi ? "video" : "videos"}</span>
                  </div>
                  {/* Video cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                    {catVideos.map((v) => {
                      const ytId = extractYtId(v.ytId);
                      const thumb = v.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");
                      const ytUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined;
                      return (
                        <div key={v.id} className="pdf-no-break" style={{ background: "#faf8f4", borderRadius: 14, overflow: "hidden", border: "1px solid #ede8df" }}>
                          {/* Thumbnail — clickable on screen */}
                          <a
                            href={ytUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-print"
                            style={{ display: "block", position: "relative", paddingBottom: "56.25%", background: "#1a1a1a", cursor: ytUrl ? "pointer" : "default", textDecoration: "none" }}
                          >
                            {thumb && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(201,151,42,0.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                            {v.duration && (
                              <span style={{ position: "absolute", bottom: 6, right: 6, fontSize: 9, color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.7)", padding: "2px 5px", borderRadius: 4, fontFamily: "monospace" }}>{v.duration}</span>
                            )}
                          </a>
                          {/* PDF-only static thumbnail (no link) */}
                          <div className="pdf-only" style={{ display: "none", position: "relative", paddingBottom: "56.25%", background: "#1a1a1a" }}>
                            {thumb && <img src={thumb} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,151,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                          </div>
                          {/* Info */}
                          <div style={{ padding: "12px 14px 14px" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", lineHeight: 1.3 }}>{v.title}</p>
                            <p style={{ fontSize: 10, color: "#8a7d6e", margin: 0 }}>{v.client}{v.year ? ` · ${v.year}` : ""}</p>
                            {v.views && <p style={{ fontSize: 10, color: "#b0a898", margin: "3px 0 0" }}>{v.views}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Section>

          {/* ── FOUNDER ───────────────────────────────────────── */}
          <Section num={`0${(clientLogos.length > 0 ? 5 : 4) + ((framePhotos.length + btsPhotos.length) > 0 ? 2 : 1)}`} label={vi ? "Người sáng lập" : "Founder"}>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, alignItems: "start" }}>
              <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e2dbd0", background: "#f0ece5", aspectRatio: "3/4" }}>
                {founder.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={founder.photoUrl} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,rgba(201,151,42,0.12),#f0ece5)" }}>
                    <span style={{ fontSize: 52, fontWeight: 900, color: "rgba(201,151,42,0.25)" }}>
                      {founder.name.split(" ").map((w: string) => w[0]).join("")}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#C9972A", textTransform: "uppercase", letterSpacing: "0.3em", margin: "0 0 10px" }}>{founder.title}</p>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", margin: "0 0 6px" }}>{founder.name}</h2>
                <p style={{ fontSize: 13, color: "#C9972A", fontWeight: 700, margin: "0 0 20px" }}>
                  {founder.experience} {vi ? "trong ngành sản xuất phim" : "in film production"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {founder.bio.map((p: string, i: number) => (
                    <p key={i} style={{ fontSize: 13, color: "#6b6259", lineHeight: 1.75, margin: 0 }}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── TESTIMONIALS ──────────────────────────────────── */}
          {testimonials.length > 0 && (
            <Section num={`0${(clientLogos.length > 0 ? 5 : 4) + ((framePhotos.length + btsPhotos.length) > 0 ? 3 : 2)}`} label={vi ? "Khách hàng nói gì" : "Testimonials"}>
              <h2 style={headingStyle}>{vi ? "Đánh giá từ khách hàng" : "What Clients Say"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 24 }}>
                {testimonials.map((t, i) => (
                  <div key={i} className="pdf-no-break" style={{ background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 18, padding: "22px 20px" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#C9972A" className="text-[#C9972A]" />)}
                    </div>
                    <p style={{ fontSize: 12, color: "#6b6259", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 16px" }}>&ldquo;{t.body}&rdquo;</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: "0 0 2px" }}>{t.name}</p>
                    <p style={{ fontSize: 10, color: "#9a8f82", margin: 0 }}>{t.role}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── WHY US ────────────────────────────────────────── */}
          <Section num={`0${(clientLogos.length > 0 ? 5 : 4) + ((framePhotos.length + btsPhotos.length) > 0 ? 4 : 3) + (testimonials.length > 0 ? 1 : 0)}`} label={vi ? "Tại sao chọn chúng tôi" : "Why Choose Us"}>
            <h2 style={headingStyle}>{vi ? "Cam kết của Bình An Media" : "Our Commitments"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 24 }}>
              {[
                { icon: "Award",  vi: ["12+ năm chuyên môn",     "Đội ngũ đào tạo bài bản, kinh nghiệm thực chiến với hàng trăm thương hiệu."],                    en: ["12+ Years Expertise",   "Professionally trained team with real-world experience across hundreds of brands."] },
                { icon: "Clock",  vi: ["Đúng hẹn cam kết",       "Quy trình chặt chẽ, milestone rõ ràng. Không bao giờ trễ deadline."],                             en: ["Deadline Committed",    "Rigorous workflow, clear milestones. Never miss a deadline."] },
                { icon: "Shield", vi: ["Giá minh bạch",          "Báo giá chi tiết từng hạng mục. Không phát sinh ẩn."],                                            en: ["Transparent Pricing",   "Detailed itemized quotes. No hidden costs."] },
                { icon: "Layers", vi: ["Thiết bị chuyên nghiệp", "Blackmagic, Sony FX, RED — chuẩn quảng cáo quốc tế."],                                           en: ["Pro Equipment",         "Blackmagic, Sony FX, RED — international advertising standard."] },
                { icon: "Zap",    vi: ["Sáng tạo riêng biệt",    "Mỗi concept được thiết kế riêng, không dùng template."],                                          en: ["Custom Creative",       "Every concept custom-designed, no templates."] },
                { icon: "Star",   vi: ["Trọn gói một ekip",      "Script → post-production: một đội ngũ duy nhất, quy trình nhất quán."],                          en: ["Full-Service Studio",   "Script to post: one team, one consistent workflow."] },
              ].map((r) => {
                const Icon = IconMap[r.icon];
                return (
                  <div key={r.vi[0]} className="pdf-no-break" style={{ background: "#faf8f4", border: "1px solid #ede8df", borderRadius: 16, padding: "20px 18px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      {Icon && <Icon size={15} className="text-[#C9972A]" />}
                    </div>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>{vi ? r.vi[0] : r.en[0]}</h3>
                    <p style={{ fontSize: 11, color: "#6b6259", lineHeight: 1.65, margin: 0 }}>{vi ? r.vi[1] : r.en[1]}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── CTA ───────────────────────────────────────────── */}
          <div style={{ borderRadius: 24, padding: "52px 48px", textAlign: "center", background: "linear-gradient(135deg,#faf8f4,#f0ece5)", border: "1px solid #e2dbd0", position: "relative", overflow: "hidden", marginBottom: 60 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#C9972A", textTransform: "uppercase", letterSpacing: "0.4em", margin: "0 0 16px", position: "relative" }}>
              {vi ? "Sẵn sàng hợp tác?" : "Ready to collaborate?"}
            </p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a1a", margin: "0 0 14px", position: "relative" }}>
              {vi ? "Bắt đầu dự án của bạn" : "Start Your Project"}
            </h2>
            <p style={{ fontSize: 13, color: "#6b6259", maxWidth: 400, margin: "0 auto 28px", position: "relative" }}>
              {vi ? "Liên hệ để nhận tư vấn miễn phí và báo giá chi tiết." : "Contact us for a free consultation and detailed quote."}
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9972A", color: "#fff", fontWeight: 700, fontSize: 13, padding: "12px 28px", borderRadius: 999, position: "relative" }}>
              {vi ? "Nhận báo giá miễn phí" : "Get a Free Quote"} <ArrowRight size={14} />
            </div>
            <p style={{ fontSize: 11, color: "#9a8f82", marginTop: 20, position: "relative" }}>
              binhanmedia.com · 0969 427 639 · Dinhconghieufilm@gmail.com
            </p>
          </div>

          {/* ── FOOTER ────────────────────────────────────────── */}
          <footer style={{ borderTop: "1px solid #e2dbd0", paddingTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
              <div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontWeight: 900, fontSize: 18, color: "#1a1a1a" }}>BinhAn</span>
                  <span style={{ fontWeight: 900, fontSize: 18, color: "#C9972A" }}>Media</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
                  {[
                    { Icon: Phone,  v: "0969 427 639" },
                    { Icon: Mail,   v: "Dinhconghieufilm@gmail.com" },
                    { Icon: Globe2, v: "binhanmedia.com" },
                    { Icon: MapPin, v: vi ? "TP. Hồ Chí Minh, Việt Nam" : "Ho Chi Minh City, Vietnam" },
                  ].map(({ Icon, v }) => (
                    <div key={v} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#6b6259" }}>
                      <Icon size={11} className="text-[#C9972A]" style={{ flexShrink: 0, color: "#C9972A" }} />{v}
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 10, color: "#b0a898", maxWidth: 260, lineHeight: 1.7, textAlign: "right" }}>
                {vi
                  ? "Tài liệu này được tạo bởi hệ thống Bình An Media. Mọi thông tin mang tính tham khảo và có hiệu lực trong 15 ngày."
                  : "This document was generated by Bình An Media system. All information is for reference and valid for 15 days."}
              </p>
            </div>
          </footer>

        </div>
      </div>

      <style>{`
        .pdf-no-break { page-break-inside: avoid; break-inside: avoid; }
        .pdf-only { display: none; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @media print {
          .no-print { display: none !important; }
          .pdf-only { display: block !important; }
          body { margin: 0; background: #ffffff; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .pdf-no-break { page-break-inside: avoid; }
          .marquee-track { animation: none !important; transform: translateX(0) !important; }
        }
      `}</style>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  fontSize: 26, fontWeight: 900, color: "#1a1a1a", margin: 0,
};
const bodyStyle: React.CSSProperties = {
  fontSize: 13, color: "#6b6259", lineHeight: 1.8, margin: 0,
};

function Section({ num, label, children }: { num: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: "#C9972A", letterSpacing: "0.3em", textTransform: "uppercase" }}>{num}</span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(201,151,42,0.3),transparent)" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#b0a898", textTransform: "uppercase", letterSpacing: "0.25em" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}
