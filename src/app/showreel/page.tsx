"use client";

import { useState, useEffect } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────
type Project = {
  id: string; title: string; cat: string; client: string;
  year: string; views: string; duration: string; ytId: string; desc: string;
  thumbnail?: string;
};

// ─── Category accent colours (light palette) ───────────────────────
// Extract YouTube video ID from any URL format or plain ID
function extractYtId(input: string): string {
  if (!input) return "";
  // youtu.be/ID
  const short = input.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  // youtube.com/watch?v=ID or /embed/ID or /shorts/ID
  const long = input.match(/(?:v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (long) return long[1];
  // Already a plain 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return "";
}

const CAT_COLORS: Record<string, { text: string; thumb: string }> = {
  TVC:       { text: "text-orange-400",  thumb: "from-orange-900/50 to-orange-900/20" },
  MV:        { text: "text-purple-400",  thumb: "from-purple-900/50 to-purple-900/20" },
  Corporate: { text: "text-blue-400",    thumb: "from-blue-900/50 to-blue-900/20" },
  Social:    { text: "text-green-400",   thumb: "from-green-900/50 to-green-900/20" },
  Event:     { text: "text-amber-400",   thumb: "from-amber-900/50 to-amber-900/20" },
  Motion:    { text: "text-pink-400",    thumb: "from-pink-900/50 to-pink-900/20" },
};

const DEFAULT_PROJECTS: Project[] = [
  { id: "1",  title: "TVC Tết – Vinamilk 2025",         cat: "TVC",       client: "Vinamilk",    year: "2025", views: "12M views",  duration: "1:00",   ytId: "", desc: "TVC Tết kể câu chuyện gia đình, đạt 12M views sau 3 ngày." },
  { id: "2",  title: "MV 'Bình Yên' – Hà Anh Tuấn",    cat: "MV",        client: "Hà Anh Tuấn", year: "2024", views: "8M views",   duration: "4:32",   ytId: "", desc: "MV cinematic quay tại Đà Lạt và Hội An, 4K anamorphic." },
  { id: "3",  title: "Corporate Film – FPT Software",   cat: "Corporate", client: "FPT Software", year: "2025", views: "",           duration: "5:00",   ytId: "", desc: "Phim doanh nghiệp chuẩn quốc tế, dùng để pitch đối tác nước ngoài." },
  { id: "4",  title: "TikTok Series – Grab Food",       cat: "Social",    client: "Grab",         year: "2024", views: "50M+ views", duration: "Series", ytId: "", desc: "12 tập Reels x TikTok, viral liên tục trong 3 tháng." },
  { id: "5",  title: "Event Highlight – VinFast Launch", cat: "Event",    client: "VinFast",      year: "2024", views: "",           duration: "8:00",   ytId: "", desc: "Buổi ra mắt xe điện, quay 6 camera, same-day edit." },
  { id: "6",  title: "Explainer – Be App",              cat: "Motion",    client: "Be Group",     year: "2025", views: "",           duration: "2:30",   ytId: "", desc: "Explainer video animation giải thích tính năng ứng dụng." },
  { id: "7",  title: "TVC Shopee 11.11",                cat: "TVC",       client: "Shopee",       year: "2024", views: "20M views",  duration: "0:30",   ytId: "", desc: "TVC campaign 11.11 với 3 phiên bản cắt cho nhiều nền tảng." },
  { id: "8",  title: "MV Ra mắt – Sơn Tùng MTP",       cat: "MV",        client: "M-TP",         year: "2025", views: "30M views",  duration: "3:45",   ytId: "", desc: "MV đầy đủ concept, stylist, và hơn 80 outfit changes." },
  { id: "9",  title: "Tuyển dụng – Samsung Vietnam",    cat: "Corporate", client: "Samsung",      year: "2025", views: "",           duration: "3:00",   ytId: "", desc: "Film tuyển dụng trẻ trung, hiện đại cho môi trường Samsung." },
  { id: "10", title: "Reels Campaign – Heineken 0.0",   cat: "Social",    client: "Heineken",     year: "2025", views: "15M views",  duration: "Series", ytId: "", desc: "Campaign ra mắt Heineken 0.0 với 20 video ngắn." },
  { id: "11", title: "Hội nghị quốc tế – Vinhomes",    cat: "Event",     client: "Vinhomes",     year: "2025", views: "",           duration: "12:00",  ytId: "", desc: "Ghi hình hội nghị 2 ngày, highlight + tài liệu đầy đủ." },
  { id: "12", title: "Logo Animation Kit – VIB Bank",   cat: "Motion",    client: "VIB",          year: "2024", views: "",           duration: "Assets", ytId: "", desc: "Bộ brand motion gồm 30+ assets, logo sting và social templates." },
];

const CATEGORIES = ["Tất cả", "TVC", "MV", "Corporate", "Social", "Event", "Motion"];

export default function ShowreelPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [active, setActive] = useState("Tất cả");
  const [preview, setPreview] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.videos?.length) setProjects(data.videos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "Tất cả" ? projects : projects.filter((p) => p.cat === active);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = preview ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [preview]);

  return (
    <div className="pt-20 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/6 py-8 sm:py-12 px-4 sm:px-6 text-center">
        <p className="text-[#C9972A] text-xs font-semibold tracking-widest uppercase mb-2">Showreel</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Tác phẩm của chúng tôi</h1>
        <p className="text-white/40 max-w-lg mx-auto text-xs sm:text-sm">
          200+ dự án từ 2016 — TVC, MV, phim doanh nghiệp, content số.
        </p>
      </div>

      {/* Filter pills */}
      <div className="sticky top-[56px] z-30 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/6 px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                active === cat
                  ? "bg-[#C9972A] text-white shadow-sm"
                  : "bg-white/6 border border-white/10 text-white/60 hover:border-[#C9972A]/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse aspect-video" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((p) => {
              const cc = CAT_COLORS[p.cat] || CAT_COLORS["TVC"];
              const ytId = extractYtId(p.ytId);
              return (
                <button
                  key={p.id}
                  onClick={() => setPreview(p)}
                  className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-black"
                >
                  {/* Thumbnail */}
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : ytId ? (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${cc.thumb} transition-transform duration-500 group-hover:scale-105`} />
                  )}

                  {/* Dim overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center">
                      <Play size={20} fill="#C9972A" className="ml-1 text-[#C9972A]" />
                    </div>
                  </div>

                  {/* Title tag — always visible */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-end justify-between gap-2">
                    <div className="bg-black/70 backdrop-blur-md rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-lg max-w-[80%]">
                      <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${cc.text} block leading-none mb-0.5`}>{p.cat}</span>
                      <span className="text-white font-bold text-[11px] sm:text-[12px] leading-tight line-clamp-1 block">{p.title}</span>
                    </div>
                    {p.duration && (
                      <div className="bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex-shrink-0">
                        {p.duration}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-white/30">Không có video nào trong danh mục này.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:pb-20">
        <div className="border border-dashed border-white/12 rounded-2xl py-10 sm:py-14 px-4 sm:px-6 text-center bg-white/3">
          <p className="text-white/40 mb-4 text-xs sm:text-sm">Thích những gì bạn thấy?</p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-[#C9972A] text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-[#DBA93A] transition-all hover:shadow-[0_4px_24px_rgba(201,151,42,0.35)] text-sm sm:text-base"
          >
            Bắt đầu dự án của bạn →
          </Link>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-[#161616] border-t sm:border border-white/8 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto mb-[84px] sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {extractYtId(preview.ytId) ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYtId(preview.ytId)}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className={`h-48 bg-gradient-to-br ${(CAT_COLORS[preview.cat] || CAT_COLORS["TVC"]).thumb} flex items-center justify-center relative`}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-black/40 shadow-lg flex items-center justify-center mx-auto mb-2">
                    <Play size={20} fill="#C9972A" className="ml-0.5 text-[#C9972A]" />
                  </div>
                  <p className="text-white/50 text-xs">Video sẽ được cập nhật sớm</p>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${(CAT_COLORS[preview.cat] || CAT_COLORS["TVC"]).text}`}>
                    {preview.cat}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5 leading-tight">{preview.title}</h3>
                  <p className="text-white/40 text-xs mt-1">
                    {preview.client} · {preview.year}
                    {preview.duration && ` · ${preview.duration}`}
                    {preview.views && ` · ${preview.views}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {extractYtId(preview.ytId) && (
                    <a
                      href={`https://youtube.com/watch?v=${extractYtId(preview.ytId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-[#C9972A] transition"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => setPreview(null)}
                    className="text-white/40 hover:text-white transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              {preview.desc && (
                <p className="text-white/50 text-sm mt-3 leading-relaxed">{preview.desc}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
                <Link
                  href="/quote"
                  className="flex-1 bg-[#C9972A] text-white font-bold text-sm py-2.5 rounded-xl text-center hover:bg-[#DBA93A] transition"
                >
                  Làm dự án tương tự →
                </Link>
                <button
                  onClick={() => setPreview(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:border-white/20 text-sm transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
