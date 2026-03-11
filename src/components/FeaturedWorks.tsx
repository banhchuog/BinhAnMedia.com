"use client";

import { useState, useEffect } from "react";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string; title: string; cat: string; client: string;
  year: string; views: string; ytId: string;
  thumbnail?: string;
};

const CAT_COLORS: Record<string, { text: string; thumb: string }> = {
  TVC:       { text: "text-orange-400", thumb: "from-orange-900/50 to-orange-900/20" },
  MV:        { text: "text-purple-400", thumb: "from-purple-900/50 to-purple-900/20" },
  Corporate: { text: "text-blue-400",   thumb: "from-blue-900/50 to-blue-900/20" },
  Social:    { text: "text-green-400",  thumb: "from-green-900/50 to-green-900/20" },
  Event:     { text: "text-amber-400",  thumb: "from-amber-900/50 to-amber-900/20" },
  Motion:    { text: "text-pink-400",   thumb: "from-pink-900/50 to-pink-900/20" },
};

// Desktop: serpentine Z-pattern (feature card alternates left ↔ right each row)
// Mobile: full-wide / half-half / full-wide / half-half
const COL_SPANS = [
  "col-span-2 lg:col-span-2",   // row 1 — feature LEFT   (wide)
  "col-span-1 lg:col-span-1",   // row 1 — small right
  "col-span-1 lg:col-span-1",   // row 2 — small left
  "col-span-2 lg:col-span-2",   // row 2 — feature RIGHT  (wide)  ← Z-flip
  "col-span-1 lg:col-span-1",   // row 3 — small left
  "col-span-1 lg:col-span-2",   // row 3 — feature RIGHT  (desktop wide, mobile half)
];

const FALLBACK: Project[] = [
  { id: "1", title: "TVC Tết – Vinamilk 2025",        cat: "TVC",       client: "Vinamilk",    year: "2025", views: "12M views",  ytId: "" },
  { id: "2", title: "MV 'Bình Yên' – Hà Anh Tuấn",   cat: "MV",        client: "Hà Anh Tuấn", year: "2024", views: "8M views",   ytId: "" },
  { id: "3", title: "Corporate Film – FPT Software",  cat: "Corporate", client: "FPT",          year: "2025", views: "",           ytId: "" },
  { id: "4", title: "TikTok Series – Grab Food",      cat: "Social",    client: "Grab",         year: "2024", views: "50M+ views", ytId: "" },
  { id: "5", title: "Event Highlight – VinFast",      cat: "Event",     client: "VinFast",      year: "2024", views: "",           ytId: "" },
  { id: "6", title: "Explainer – Be App",             cat: "Motion",    client: "Be Group",     year: "2025", views: "",           ytId: "" },
];

function extractYtId(input: string): string {
  if (!input) return "";
  const short = input.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  const long = input.match(/(?:v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (long) return long[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return "";
}

export default function FeaturedWorks() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { if (data.videos?.length) setProjects(data.videos); })
      .catch(() => {});
  }, []);

  const featured = projects.slice(0, 6);

  return (
    <section className="bg-[#111] py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <div>
            <p className="eyebrow mb-2">Tác phẩm</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-white tracking-[-0.03em] leading-tight">
              Dự án nổi bật
            </h2>
          </div>
          <Link
            href="/showreel"
            className="hidden md:flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors font-medium"
          >
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mosaic bento grid — serpentine Z-pattern */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {featured.map((p, idx) => {
            const cc = CAT_COLORS[p.cat] || CAT_COLORS["TVC"];
            const ytId = extractYtId(p.ytId);
            const isWide = idx === 0 || idx === 3 || idx === 5;
            return (
              <Link
                key={p.id}
                href="/showreel"
                className={`${COL_SPANS[idx]} group relative w-full aspect-video overflow-hidden bg-black ${isWide ? "rounded-2xl" : "rounded-xl sm:rounded-2xl"}`}
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

                {/* Hover dim */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center">
                    <Play size={20} fill="#C9972A" className="ml-1 text-[#C9972A]" />
                  </div>
                </div>

                {/* Title tag — always visible */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <div className="bg-black/70 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg max-w-[80%]">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${cc.text} block leading-none mb-0.5`}>{p.cat}</span>
                    <span className={`text-white font-bold leading-tight line-clamp-1 block ${isWide ? "text-[13px] sm:text-[14px]" : "text-[11px] sm:text-[12px]"}`}>{p.title}</span>
                    {p.views && <span className="text-white/50 text-[10px]">{p.views}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-6 md:hidden">
          <Link href="/showreel" className="text-sm text-[#C9972A] font-medium">
            Xem tất cả →
          </Link>
        </div>
      </div>
    </section>
  );
}
