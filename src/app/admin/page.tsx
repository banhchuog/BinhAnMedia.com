"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CATALOG, GROUPS, DEFAULT_PRESETS } from "@/lib/catalog";
import type { CatalogItem, PresetItem } from "@/lib/catalog";
import {
  Lock, LogOut, DollarSign, Package, Video, Settings,
  Save, RotateCcw, Plus, Trash2, Check, X, ChevronDown, ChevronUp, ExternalLink, Users, Phone, Home, ImageIcon, Sparkles, Upload, Pencil,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type VideoItem = {
  id: string; title: string; cat: string; client: string;
  year: string; views: string; duration: string; ytId: string; desc: string;
  thumbnail: string;
};
type FounderData = {
  name: string;
  title: string;
  photoUrl: string;
  experience: string;
  bio: string[];
  linkUrl: string;
  linkLabel: string;
};
type CustomService = {
  id: string;
  label: string;
  desc: string;
  svgIcon: string;
  qualityRef: string;
  refVideoUrl?: string;
};
type TestimonialItem = {
  name: string;
  role: string;
  body: string;
};
type CatalogEdit = { name?: string; unit?: string };
type AdminSettings = {
  priceOverrides: Record<string, number>;
  presets: Record<string, PresetItem[]>;
  videos: VideoItem[];
  heroVideoId: string;
  clientLogos: string[];
  founder: FounderData | null;
  customCatalogItems: CatalogItem[];
  customServices: CustomService[];
  testimonials: TestimonialItem[];
  catalogEdits: Record<string, CatalogEdit>;
};
const EMPTY_VIDEO = (): VideoItem => ({
  id: Date.now().toString(), title: "", cat: "TVC", client: "", year: new Date().getFullYear().toString(),
  views: "", duration: "", ytId: "", desc: "", thumbnail: "",
});
const CATS = ["TVC", "MV", "Corporate", "Social", "Event", "Motion"];

const DEFAULT_SERVICES_SEED: CustomService[] = [
  { id: "tvc", label: "TVC", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`, desc: "Quảng cáo thương mại, viral video", qualityRef: "4K RED/ARRI, ekip 8-12 người, color grade chuyên nghiệp", refVideoUrl: "" },
  { id: "mv", label: "MV Ca nhạc", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`, desc: "Music video, nghệ thuật", qualityRef: "4K cinematic, multi-location, stylist & art director", refVideoUrl: "" },
  { id: "corporate", label: "Phim doanh nghiệp", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`, desc: "Giới thiệu công ty, thương hiệu", qualityRef: "4K, kịch bản chuyên nghiệp, voice-over, motion graphics", refVideoUrl: "" },
  { id: "social", label: "Social Content", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`, desc: "Reels, TikTok, YouTube Shorts", qualityRef: "Cinema camera, full crew, concept sáng tạo", refVideoUrl: "" },
  { id: "event", label: "Event & Livestream", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`, desc: "Hội nghị, sự kiện, lễ ra mắt", qualityRef: "Multi-camera (4+), đạo diễn hình, livestream chuyên nghiệp", refVideoUrl: "" },
  { id: "event_recap", label: "Recap sự kiện", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/><circle cx="8.5" cy="12" r="2.5"/></svg>`, desc: "Highlight 2-3 phút, giá tốt", qualityRef: "2 cameraman, quay + dựng gọn 2-3 ngày", refVideoUrl: "" },
  { id: "small_ad", label: "Video quảng cáo nhỏ", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`, desc: "Quảng cáo 15-30s, sản phẩm, F&B", qualityRef: "1 ngày quay, ekip gọn 4-5 người, studio nhỏ", refVideoUrl: "" },
  { id: "social_bulk", label: "Gói Social 10+ video", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`, desc: "Combo 10+ video Reels/TikTok, tiết kiệm 30%", qualityRef: "2 ngày quay liên tục, 10+ bản cắt, giá combo tiết kiệm", refVideoUrl: "" },
];

const svgSize = (svg: string, size: number) => {
  // Extract the <svg ...> opening tag to modify only root attributes
  return svg.replace(/^<svg([^>]*)>/, (match, attrs: string) => {
    let a = attrs;
    if (/width="[^"]*"/.test(a)) a = a.replace(/width="[^"]*"/, `width="${size}"`);
    else a = ` width="${size}"` + a;
    if (/height="[^"]*"/.test(a)) a = a.replace(/height="[^"]*"/, `height="${size}"`);
    else a = ` height="${size}"` + a;
    return `<svg${a}>`;
  });
};

// ─── Root ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [sessionPw, setSessionPw] = useState("");
  const [settings, setSettings] = useState<AdminSettings>({ priceOverrides: {}, presets: {}, videos: [], heroVideoId: "", clientLogos: [], founder: null, customCatalogItems: [], customServices: [], testimonials: [], catalogEdits: {} });
  const [tab, setTab] = useState<"homepage" | "prices" | "presets" | "services" | "videos" | "leads" | "settings">("homepage");
  const [toastMsg, setToastMsg] = useState("");

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const reloadSettings = useCallback(async () => {
    const data = await fetch("/api/admin/settings").then((r) => r.json());
    setSettings({
      priceOverrides: data.priceOverrides || {},
      presets: data.presets || {},
      videos: data.videos?.length ? data.videos : [],
      heroVideoId: data.heroVideoId || "",
      clientLogos: Array.isArray(data.clientLogos) ? data.clientLogos : [],
      founder: data.founder || null,
      customCatalogItems: Array.isArray(data.customCatalogItems) ? data.customCatalogItems : [],
      customServices: Array.isArray(data.customServices) ? data.customServices : [],
      testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      catalogEdits: data.catalogEdits || {},
    });
  }, []);

  const save = useCallback(
    async (partial: Partial<AdminSettings> & { newPassword?: string }) => {
      const body = { password: sessionPw, ...settings, ...partial };
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSettings((prev) => ({ ...prev, ...partial }));
        toast("Đã lưu thành công!");
        if (partial.newPassword) setSessionPw(partial.newPassword);
      } else {
        toast("Lỗi khi lưu, thử lại.");
      }
    },
    [sessionPw, settings],
  );

  if (!authed) {
    return (
      <LoginScreen
        onLogin={async (pw) => {
          const res = await fetch("/api/admin/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw }),
          });
          if (res.ok) {
            setSessionPw(pw);
            await reloadSettings();
            setAuthed(true);
            return true;
          }
          return false;
        }}
      />
    );
  }

  const TABS = [
    { id: "homepage" as const, label: "Trang chủ",       Icon: Home },
    { id: "prices" as const,   label: "Giá cả",          Icon: DollarSign },
    { id: "presets" as const,  label: "Gói mặc định",     Icon: Package },
    { id: "services" as const, label: "Dịch vụ",         Icon: Sparkles },
    { id: "videos" as const,   label: "Video Showreel",   Icon: Video },
    { id: "leads" as const,    label: "Khách hàng",       Icon: Users },
    { id: "settings" as const, label: "Cài đặt",          Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Top bar */}
      <header className="bg-white border-b border-black/8 px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#C9972A] flex items-center justify-center flex-shrink-0">
            <Lock size={11} className="text-white" />
          </div>
          <span className="font-black text-[#1C1C1E] text-xs sm:text-sm truncate">Admin — Bình An Media</span>
        </div>
        <button
          onClick={() => { setAuthed(false); setSessionPw(""); }}
          className="flex items-center gap-1.5 text-xs text-[#8E8E93] hover:text-[#1C1C1E] transition"
        >
          <LogOut size={13} /> Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-black/8 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-0.5 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === id
                  ? "border-[#C9972A] text-[#C9972A]"
                  : "border-transparent text-[#8E8E93] hover:text-[#3C3C43]"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        {tab === "homepage" && (
          <HomePageTab
            clientLogos={settings.clientLogos}
            founder={settings.founder}
            testimonials={settings.testimonials}
            onSaveLogos={(clientLogos) => save({ clientLogos })}
            onSaveFounder={(founder) => save({ founder })}
            onSaveTestimonials={(testimonials) => save({ testimonials })}
          />
        )}
        {tab === "prices" && (
          <PricesTab
            priceOverrides={settings.priceOverrides}
            customCatalogItems={settings.customCatalogItems}
            catalogEdits={settings.catalogEdits}
            onSave={(overrides, catalogEdits) => save({ priceOverrides: overrides, catalogEdits })}
            onSaveCustomItems={(customCatalogItems) => save({ customCatalogItems })}
          />
        )}
        {tab === "presets" && (
          <PresetsTab
            customPresets={settings.presets}
            customCatalogItems={settings.customCatalogItems}
            customServices={settings.customServices}
            onSave={(presets) => save({ presets })}
          />
        )}
        {tab === "services" && (
          <ServicesTab
            customServices={settings.customServices}
            videos={settings.videos}
            onSave={(customServices) => save({ customServices })}
          />
        )}
        {tab === "videos" && (
          <VideosTab
            videos={settings.videos}
            heroVideoId={settings.heroVideoId}
            onSave={(videos, heroVideoId) => save({ videos, heroVideoId })}
          />
        )}
        {tab === "leads" && (
          <LeadsTab sessionPw={sessionPw} />
        )}
        {tab === "settings" && (
          <SettingsTab
            onSave={(newPassword) => save({ newPassword })}
          />
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C1C1E] text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <Check size={14} className="text-[#C9972A]" /> {toastMsg}
        </div>
      )}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => Promise<boolean> }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await onLogin(pw);
    if (!ok) setError("Sai mật khẩu, thử lại.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-black/8 p-8 w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#C9972A]/10 border border-[#C9972A]/20 flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-[#C9972A]" />
        </div>
        <h1 className="text-xl font-black text-[#1C1C1E] text-center mb-1">Đăng nhập Admin</h1>
        <p className="text-[#8E8E93] text-xs text-center mb-6">Bình An Media · Trang quản trị</p>
        <div className="mb-4">
          <label className="text-xs text-[#8E8E93] mb-1.5 block">Mật khẩu</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-3 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
          />
        </div>
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || !pw}
          className="w-full bg-[#C9972A] text-white font-bold py-3 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50"
        >
          {loading ? "Đang xác thực…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

// ─── Prices Tab ───────────────────────────────────────────────────
function PricesTab({
  priceOverrides,
  customCatalogItems,
  catalogEdits,
  onSave,
  onSaveCustomItems,
}: {
  priceOverrides: Record<string, number>;
  customCatalogItems: CatalogItem[];
  catalogEdits: Record<string, CatalogEdit>;
  onSave: (o: Record<string, number>, edits: Record<string, CatalogEdit>) => Promise<void>;
  onSaveCustomItems: (items: CatalogItem[]) => Promise<void>;
}) {
  const [edited, setEdited] = useState<Record<string, number>>({ ...priceOverrides });
  const [nameEdits, setNameEdits] = useState<Record<string, CatalogEdit>>({ ...catalogEdits });
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [customItems, setCustomItems] = useState<CatalogItem[]>(customCatalogItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", group: GROUPS[0], unit: "ngày", unitPrice: 0 });

  useEffect(() => { setEdited({ ...priceOverrides }); }, [priceOverrides]);
  useEffect(() => { setNameEdits({ ...catalogEdits }); }, [catalogEdits]);
  useEffect(() => { setCustomItems(customCatalogItems); }, [customCatalogItems]);

  const ALL_CATALOG = useMemo(() => [...CATALOG, ...customItems], [customItems]);
  const ALL_GROUPS = useMemo(() => {
    const gs = new Set([...GROUPS, ...customItems.map((c) => c.group)]);
    return Array.from(gs);
  }, [customItems]);

  const effective = (item: CatalogItem) => edited[item.id] ?? item.unitPrice;
  const isPriceDirty = (item: CatalogItem) =>
    edited[item.id] !== undefined && edited[item.id] !== item.unitPrice;
  const isNameDirty = (item: CatalogItem) =>
    nameEdits[item.id] !== undefined &&
    ((nameEdits[item.id].name !== undefined && nameEdits[item.id].name !== item.name) ||
     (nameEdits[item.id].unit !== undefined && nameEdits[item.id].unit !== item.unit));
  const isDirty = (item: CatalogItem) => isPriceDirty(item) || isNameDirty(item);

  const displayName = (item: CatalogItem) => nameEdits[item.id]?.name || item.name;
  const displayUnit = (item: CatalogItem) => nameEdits[item.id]?.unit || item.unit;

  const handleSave = async () => {
    setSaving(true);
    const overrides: Record<string, number> = {};
    ALL_CATALOG.forEach((item) => {
      if (edited[item.id] !== undefined && edited[item.id] !== item.unitPrice) {
        overrides[item.id] = edited[item.id];
      }
    });
    // Clean up nameEdits: only keep actual changes
    const cleanEdits: Record<string, CatalogEdit> = {};
    Object.entries(nameEdits).forEach(([id, edit]) => {
      const orig = ALL_CATALOG.find((c) => c.id === id);
      if (!orig) return;
      const e: CatalogEdit = {};
      if (edit.name && edit.name !== orig.name) e.name = edit.name;
      if (edit.unit && edit.unit !== orig.unit) e.unit = edit.unit;
      if (e.name || e.unit) cleanEdits[id] = e;
    });
    await onSave(overrides, cleanEdits);
    setSaving(false);
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    const id = `custom_${Date.now()}`;
    const item: CatalogItem = {
      id,
      group: newItem.group,
      name: newItem.name.trim(),
      unit: newItem.unit.trim() || "ngày",
      unitPrice: newItem.unitPrice || 0,
    };
    const updated = [...customItems, item];
    setCustomItems(updated);
    await onSaveCustomItems(updated);
    setNewItem({ name: "", group: GROUPS[0], unit: "ngày", unitPrice: 0 });
    setShowAddForm(false);
  };

  const handleDeleteCustomItem = async (id: string) => {
    const updated = customItems.filter((c) => c.id !== id);
    setCustomItems(updated);
    await onSaveCustomItems(updated);
  };

  const filteredGroups = ALL_GROUPS.filter((g) => {
    if (!search) return true;
    return ALL_CATALOG.some(
      (c) =>
        c.group === g &&
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())),
    );
  });

  const dirtyCount = ALL_CATALOG.filter((item) => isDirty(item)).length;
  const customIds = new Set(customItems.map((c) => c.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Quản lý đơn giá</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            {dirtyCount > 0 ? (
              <span className="text-[#C9972A] font-medium">{dirtyCount} hạng mục đã thay đổi · </span>
            ) : null}
            Sửa tên, đơn vị, giá → nhấn <strong>Lưu</strong> để áp dụng ngay cho tất cả khách hàng.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs text-[#C9972A] border border-[#C9972A]/30 bg-[#C9972A]/8 px-3 py-2 rounded-xl hover:bg-[#C9972A]/15 transition font-medium"
          >
            <Plus size={12} /> Thêm hạng mục
          </button>
          <button
            onClick={() => { setEdited({}); setNameEdits({}); setEditingRow(null); }}
            className="flex items-center gap-1.5 text-xs text-[#8E8E93] border border-black/10 px-3 py-2 rounded-xl hover:text-[#1C1C1E] transition"
          >
            <RotateCcw size={12} /> Reset tất cả
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50"
          >
            <Save size={12} /> {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Add new item form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-[#C9972A]/30 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-[#1C1C1E]">Thêm hạng mục mới</h3>
            <button onClick={() => setShowAddForm(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] transition">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1 block font-medium">Tên hạng mục *</label>
              <input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="VD: Thuê phòng studio"
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1 block font-medium">Nhóm</label>
              <select
                value={newItem.group}
                onChange={(e) => setNewItem({ ...newItem, group: e.target.value })}
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] focus:border-[#C9972A] focus:outline-none transition"
              >
                {ALL_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
                <option value="__new__">+ Tạo nhóm mới…</option>
              </select>
              {newItem.group === "__new__" && (
                <input
                  autoFocus
                  placeholder="Tên nhóm mới…"
                  onChange={(e) => setNewItem({ ...newItem, group: e.target.value })}
                  className="w-full mt-2 bg-[#F2F2F7] border border-[#C9972A]/40 rounded-xl px-3 py-2 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                />
              )}
            </div>
            <div>
              <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1 block font-medium">Đơn vị tính</label>
              <input
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="ngày, bộ, dự án…"
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1 block font-medium">Đơn giá (VNĐ)</label>
              <input
                type="number"
                value={newItem.unitPrice || ""}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseInt(e.target.value) || 0 })}
                placeholder="5000000"
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddItem}
              disabled={!newItem.name.trim()}
              className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50"
            >
              <Plus size={12} /> Thêm vào danh mục
            </button>
          </div>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm hạng mục…"
        className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none mb-4 transition"
      />

      <div className="space-y-3">
        {filteredGroups.map((group) => {
          const items = ALL_CATALOG.filter(
            (c) =>
              c.group === group &&
              (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())),
          );
          const isCollapsed = collapsed.has(group);
          const groupDirty = items.some((i) => isDirty(i));
          const hasCustom = items.some((i) => customIds.has(i.id));
          return (
            <div key={group} className="bg-white rounded-2xl border border-black/8 overflow-hidden">
              <button
                onClick={() =>
                  setCollapsed((prev) => {
                    const next = new Set(prev);
                    next.has(group) ? next.delete(group) : next.add(group);
                    return next;
                  })
                }
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/3 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1C1C1E]">{group}</span>
                  <span className="text-xs text-[#8E8E93] bg-black/5 px-2 py-0.5 rounded-full">{items.length}</span>
                  {groupDirty && (
                    <span className="text-[10px] font-bold text-[#C9972A] bg-[#C9972A]/10 px-2 py-0.5 rounded-full">Đã sửa</span>
                  )}
                  {hasCustom && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Tuỳ chỉnh</span>
                  )}
                </div>
                {isCollapsed ? <ChevronDown size={14} className="text-[#8E8E93]" /> : <ChevronUp size={14} className="text-[#8E8E93]" />}
              </button>
              {!isCollapsed && (
                <div className="border-t border-black/5 overflow-x-auto">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="bg-black/3 text-[#8E8E93] text-xs uppercase tracking-wider">
                        <th className="text-left px-5 py-2 font-medium">Hạng mục</th>
                        <th className="text-right px-3 py-2 font-medium w-24">Mặc định</th>
                        <th className="text-right px-3 py-2 font-medium w-36">Giá hiện tại</th>
                        <th className="w-16" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {items.map((item) => {
                        const isEditing = editingRow === item.id;
                        return (
                        <tr key={item.id} className={isDirty(item) ? "bg-[#C9972A]/4" : customIds.has(item.id) ? "bg-blue-50/50" : "hover:bg-black/3 transition"}>
                          <td className="px-5 py-3 text-[#1C1C1E]">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  autoFocus
                                  value={displayName(item)}
                                  onChange={(e) =>
                                    setNameEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], name: e.target.value } }))
                                  }
                                  className="bg-[#F2F2F7] border border-[#C9972A] rounded-lg px-2 py-1 text-sm text-[#1C1C1E] focus:outline-none flex-1 min-w-0"
                                  placeholder="Tên hạng mục"
                                />
                                <span className="text-[#8E8E93] text-xs">/</span>
                                <input
                                  value={displayUnit(item)}
                                  onChange={(e) =>
                                    setNameEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], unit: e.target.value } }))
                                  }
                                  className="bg-[#F2F2F7] border border-[#C9972A] rounded-lg px-2 py-1 text-sm text-[#1C1C1E] focus:outline-none w-20"
                                  placeholder="đơn vị"
                                />
                                <button onClick={() => setEditingRow(null)} className="text-[#C9972A] hover:text-[#B8841E] transition" title="Xong">
                                  <Check size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 group">
                                <button
                                  onClick={() => setEditingRow(item.id)}
                                  className="text-[#C7C7CC] hover:text-[#C9972A] transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                                  title="Sửa tên & đơn vị"
                                >
                                  <Pencil size={11} />
                                </button>
                                <span>
                                  {displayName(item)}
                                  <span className="text-[#C7C7CC] ml-1 text-xs">/ {displayUnit(item)}</span>
                                </span>
                                {isNameDirty(item) && (
                                  <span className="text-[9px] font-bold text-[#C9972A] bg-[#C9972A]/10 px-1.5 py-0.5 rounded">ĐÃ SỬA</span>
                                )}
                                {customIds.has(item.id) && (
                                  <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">TUỲ CHỈNH</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right text-[#8E8E93] text-xs whitespace-nowrap">
                            {item.unitPrice.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={effective(item)}
                                onChange={(e) =>
                                  setEdited((prev) => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))
                                }
                                className={`w-32 text-right bg-[#F2F2F7] border rounded-lg px-2 py-1.5 text-xs focus:outline-none transition ${
                                  isPriceDirty(item)
                                    ? "border-[#C9972A] text-[#C9972A] font-bold"
                                    : "border-black/10 text-[#1C1C1E] focus:border-[#C9972A]"
                                }`}
                              />
                              <span className="text-[#8E8E93] text-xs">đ</span>
                            </div>
                          </td>
                          <td className="pr-4 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              {isDirty(item) && (
                                <button
                                  onClick={() => {
                                    setEdited((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                                    setNameEdits((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                                    setEditingRow(null);
                                  }}
                                  className="text-[#8E8E93] hover:text-red-400 transition"
                                  title="Reset về mặc định"
                                >
                                  <RotateCcw size={12} />
                                </button>
                              )}
                              {customIds.has(item.id) && (
                                <button
                                  onClick={() => handleDeleteCustomItem(item.id)}
                                  className="text-[#8E8E93] hover:text-red-500 transition"
                                  title="Xoá hạng mục tuỳ chỉnh"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Presets Tab ──────────────────────────────────────────────────

function PresetsTab({
  customPresets,
  customCatalogItems,
  customServices,
  onSave,
}: {
  customPresets: Record<string, PresetItem[]>;
  customCatalogItems: CatalogItem[];
  customServices: CustomService[];
  onSave: (p: Record<string, PresetItem[]>) => Promise<void>;
}) {
  const allServiceLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    // Always include defaults
    DEFAULT_SERVICES_SEED.forEach((s) => { labels[s.id] = s.label; });
    // Overlay/append any admin-configured services
    customServices.forEach((s) => { if (s.label) labels[s.id] = s.label; });
    return labels;
  }, [customServices]);
  const [svc, setSvc] = useState("tvc");
  const [editingPreset, setEditingPreset] = useState<PresetItem[]>([]);
  const [saving, setSaving] = useState(false);

  const ALL_CATALOG = useMemo(() => [...CATALOG, ...customCatalogItems], [customCatalogItems]);
  const ALL_GROUPS = useMemo(() => {
    const gs = new Set([...GROUPS, ...customCatalogItems.map((c) => c.group)]);
    return Array.from(gs);
  }, [customCatalogItems]);

  const loadPresetForSvc = useCallback(
    (s: string) => {
      const p = customPresets[s]?.length ? customPresets[s] : (DEFAULT_PRESETS[s] || []);
      setEditingPreset(p.map((x) => ({ ...x })));
    },
    [customPresets],
  );

  useEffect(() => { loadPresetForSvc(svc); }, [svc, loadPresetForSvc]);

  const included = new Set(editingPreset.map((p) => p.id));

  const toggle = (id: string) => {
    if (included.has(id)) {
      setEditingPreset((prev) => prev.filter((p) => p.id !== id));
    } else {
      setEditingPreset((prev) => [...prev, { id, qty: 1 }]);
    }
  };

  const setQty = (id: string, qty: number) => {
    setEditingPreset((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...customPresets, [svc]: editingPreset });
    setSaving(false);
  };

  const handleReset = () => {
    setEditingPreset((DEFAULT_PRESETS[svc] || []).map((x) => ({ ...x })));
  };

  const count = editingPreset.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Cấu hình gói mặc định</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Khi khách chọn dịch vụ, hệ thống tự load danh sách hạng mục này.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-[#8E8E93] border border-black/10 px-3 py-2 rounded-xl hover:text-[#1C1C1E] transition">
            <RotateCcw size={12} /> Reset mặc định
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50">
            <Save size={12} /> {saving ? "Đang lưu…" : "Lưu gói"}
          </button>
        </div>
      </div>

      {/* Service selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {Object.entries(allServiceLabels).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSvc(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              svc === id
                ? "bg-[#C9972A] text-white"
                : "bg-white border border-black/10 text-[#3C3C43] hover:border-[#C9972A]/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-[#8E8E93] mb-3">
        Đang cấu hình: <strong className="text-[#C9972A]">{allServiceLabels[svc]}</strong> ·{" "}
        <span>{count} hạng mục được chọn</span>
      </p>

      <div className="space-y-3">
        {ALL_GROUPS.map((group) => {
          const items = ALL_CATALOG.filter((c) => c.group === group);
          if (items.length === 0) return null;
          const checkedCount = items.filter((i) => included.has(i.id)).length;
          return (
            <div key={group} className="bg-white rounded-2xl border border-black/8 overflow-hidden">
              <div className="px-5 py-3 border-b border-black/5 flex items-center gap-2">
                <span className="font-bold text-sm text-[#1C1C1E]">{group}</span>
                {checkedCount > 0 && (
                  <span className="text-[10px] font-bold text-[#C9972A] bg-[#C9972A]/10 px-2 py-0.5 rounded-full">
                    {checkedCount} chọn
                  </span>
                )}
              </div>
              <div className="divide-y divide-black/5">
                {items.map((item) => {
                  const isIn = included.has(item.id);
                  const presetItem = editingPreset.find((p) => p.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-5 py-3 ${isIn ? "bg-[#C9972A]/4" : "hover:bg-black/3"} transition`}
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isIn ? "bg-[#C9972A] border-[#C9972A]" : "border-black/20 hover:border-[#C9972A]/50"
                        }`}
                      >
                        {isIn && <Check size={11} className="text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${isIn ? "text-[#1C1C1E] font-medium" : "text-[#8E8E93]"}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-[#C7C7CC] ml-1">/ {item.unit}</span>
                      </div>
                      <span className="text-xs text-[#8E8E93] flex-shrink-0 hidden sm:block">
                        {item.unitPrice.toLocaleString("vi-VN")}đ
                      </span>
                      {isIn && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-[#8E8E93]">Qty</span>
                          <input
                            type="number"
                            min={1}
                            value={presetItem?.qty ?? 1}
                            onChange={(e) => setQty(item.id, parseInt(e.target.value) || 1)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-14 text-center bg-white border border-[#C9972A]/30 rounded-lg px-1 py-1 text-xs text-[#C9972A] font-bold focus:outline-none focus:border-[#C9972A]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Services Tab ────────────────────────────────────────────────
const DEFAULT_SVG_OPTIONS = [
  { label: "Camera", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>` },
  { label: "Phim", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/><line x1="17" x2="22" y1="17" y2="17"/></svg>` },
  { label: "Âm nhạc", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>` },
  { label: "Micro", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>` },
  { label: "Hình ảnh", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>` },
  { label: "Ngôi sao", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
  { label: "Drone", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m14.7 10.7-4 4"/><circle cx="12" cy="12" r="1"/></svg>` },
  { label: "Màn hình", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>` },
  { label: "Megaphone", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>` },
  { label: "Clapperboard", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>` },
];

function ServicesTab({
  customServices,
  videos,
  onSave,
}: {
  customServices: CustomService[];
  videos: VideoItem[];
  onSave: (services: CustomService[]) => Promise<void>;
}) {
  // Always start with defaults, then merge in any saved customizations
  const mergeWithDefaults = useCallback((saved: CustomService[]) => {
    if (saved.length === 0) return DEFAULT_SERVICES_SEED.map((s) => ({ ...s }));
    // Check if saved list contains the default IDs — if so, treat as full replacement
    const defaultIds = new Set(DEFAULT_SERVICES_SEED.map((s) => s.id));
    const savedIds = new Set(saved.map((s) => s.id));
    const hasDefaults = DEFAULT_SERVICES_SEED.every((d) => savedIds.has(d.id));
    if (hasDefaults) return saved;
    // Otherwise merge: defaults + any extras that aren't defaults
    const extras = saved.filter((s) => !defaultIds.has(s.id));
    return [...DEFAULT_SERVICES_SEED.map((s) => ({ ...s })), ...extras];
  }, []);

  const [list, setList] = useState<CustomService[]>(() => mergeWithDefaults(customServices));
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showSvgPicker, setShowSvgPicker] = useState<string | null>(null);

  useEffect(() => {
    setList(mergeWithDefaults(customServices));
  }, [customServices, mergeWithDefaults]);

  const add = () => {
    const nv: CustomService = {
      id: `svc_${Date.now()}`,
      label: "",
      desc: "",
      svgIcon: DEFAULT_SVG_OPTIONS[0].svg,
      qualityRef: "",
      refVideoUrl: "",
    };
    setList((prev) => [...prev, nv]);
    setExpanded(nv.id);
  };

  const remove = (id: string) => setList((prev) => prev.filter((s) => s.id !== id));

  const update = (id: string, field: keyof CustomService, val: string) => {
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setList((prev) => {
      const n = [...prev];
      [n[i - 1], n[i]] = [n[i], n[i - 1]];
      return n;
    });
  };

  const moveDown = (i: number) => {
    setList((prev) => {
      if (i >= prev.length - 1) return prev;
      const n = [...prev];
      [n[i], n[i + 1]] = [n[i + 1], n[i]];
      return n;
    });
  };

  const handleReset = () => {
    setList(DEFAULT_SERVICES_SEED.map((s) => ({ ...s })));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(list);
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Quản lý dịch vụ báo giá</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Tuỳ chỉnh tên, mô tả, icon SVG và chất lượng tham khảo cho từng dịch vụ. Kéo thả hoặc dùng mũi tên để sắp xếp.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-[#8E8E93] border border-black/10 px-3 py-2 rounded-xl hover:text-[#1C1C1E] transition">
            <RotateCcw size={12} /> Reset mặc định
          </button>
          <button onClick={add} className="flex items-center gap-1.5 text-xs text-[#C9972A] border border-[#C9972A]/30 bg-[#C9972A]/8 px-3 py-2 rounded-xl hover:bg-[#C9972A]/15 transition font-medium">
            <Plus size={12} /> Thêm dịch vụ
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50">
            <Save size={12} /> {saving ? "Đang lưu…" : "Lưu dịch vụ"}
          </button>
        </div>
      </div>

      {/* All services — editable */}
      <div className="space-y-2">
        {list.map((s, i) => (
          <div key={s.id} className="bg-white rounded-2xl border border-black/8 overflow-hidden">
            <div
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-black/3 transition"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); moveUp(i); }} className="text-[#C7C7CC] hover:text-[#1C1C1E] transition" title="Lên">
                  <ChevronUp size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); moveDown(i); }} className="text-[#C7C7CC] hover:text-[#1C1C1E] transition" title="Xuống">
                  <ChevronDown size={12} />
                </button>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#C9972A]/10 flex items-center justify-center flex-shrink-0 text-[#C9972A] [&>svg]:w-4 [&>svg]:h-4" dangerouslySetInnerHTML={{ __html: s.svgIcon || '' }} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[#1C1C1E] truncate">{s.label || "Dịch vụ chưa đặt tên"}</div>
                <div className="text-xs text-[#8E8E93] truncate">{s.desc || "Chưa có mô tả"}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(s.id); }}
                className="text-[#C7C7CC] hover:text-red-400 transition flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
              {expanded === s.id
                ? <ChevronUp size={14} className="text-[#8E8E93] flex-shrink-0" />
                : <ChevronDown size={14} className="text-[#8E8E93] flex-shrink-0" />}
            </div>

            {expanded === s.id && (
              <div className="border-t border-black/5 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Tên dịch vụ" value={s.label} onChange={(val) => update(s.id, "label", val)} placeholder="Quảng cáo truyền hình" />
                <Field label="Mô tả ngắn" value={s.desc} onChange={(val) => update(s.id, "desc", val)} placeholder="TVC truyền hình, digital ads" />
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1 block">Chất lượng tham khảo</label>
                  <input
                    value={s.qualityRef}
                    onChange={(e) => update(s.id, "qualityRef", e.target.value)}
                    placeholder="4K RED/ARRI, ekip 8-12 người, 2-3 ngày quay, color grade chuyên nghiệp"
                    className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1.5 block">Video chất lượng tham khảo</label>

                  {/* Showreel picker */}
                  {videos.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] text-[#C7C7CC] mb-1.5">Chọn từ kho Showreel:</p>
                      <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1 rounded-xl bg-[#F2F2F7] border border-black/10 p-2">
                        {/* Option: no video */}
                        <button
                          onClick={() => update(s.id, "refVideoUrl", "")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition ${
                            !s.refVideoUrl ? "border-[#C9972A] bg-[#C9972A]/10 text-[#C9972A]" : "border-black/10 bg-white text-[#8E8E93] hover:border-[#C9972A]/40"
                          }`}
                        >
                          Không chọn
                        </button>
                        {videos.map((v) => {
                          const isSelected = s.refVideoUrl === `https://www.youtube.com/watch?v=${v.ytId}` || s.refVideoUrl === v.ytId;
                          return (
                            <button
                              key={v.id}
                              onClick={() => update(s.id, "refVideoUrl", v.ytId)}
                              className={`relative group/vid rounded-lg border overflow-hidden transition w-[120px] flex-shrink-0 ${
                                isSelected ? "border-[#C9972A] ring-2 ring-[#C9972A]/30" : "border-black/10 hover:border-[#C9972A]/40"
                              }`}
                            >
                              <div className="aspect-video bg-black/20 relative">
                                {v.ytId ? (
                                  <img src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#C7C7CC]"><Video size={16} /></div>
                                )}
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#C9972A]/20 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full bg-[#C9972A] flex items-center justify-center"><Check size={12} className="text-white" /></div>
                                  </div>
                                )}
                              </div>
                              <p className="text-[9px] text-[#1C1C1E] truncate px-1.5 py-1 font-medium">{v.title || "Untitled"}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual URL input */}
                  <p className="text-[10px] text-[#C7C7CC] mb-1">{videos.length > 0 ? "Hoặc dán link YouTube:" : "Dán YouTube URL hoặc Video ID:"}</p>
                  <input
                    value={s.refVideoUrl || ""}
                    onChange={(e) => update(s.id, "refVideoUrl", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc dQw4w9WgXcQ"
                    className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
                  />
                  {s.refVideoUrl && (() => {
                    const m = s.refVideoUrl.match(/[?&]v=([^&]+)/) || s.refVideoUrl.match(/youtu\.be\/([^?&]+)/) || s.refVideoUrl.match(/shorts\/([^?&]+)/);
                    const vid = m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(s.refVideoUrl) ? s.refVideoUrl : null);
                    return vid ? (
                      <div className="mt-2 rounded-xl overflow-hidden border border-black/10 aspect-video">
                        <iframe src={`https://www.youtube.com/embed/${vid}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    ) : <p className="text-[10px] text-red-400 mt-1">Link không hợp lệ</p>;
                  })()}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1.5 block">
                    Icon SVG <span className="text-[10px] text-[#C7C7CC]">(chọn sẵn hoặc dán SVG tùy chỉnh)</span>
                  </label>
                  {/* Quick SVG picker */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {DEFAULT_SVG_OPTIONS.map((opt) => {
                      const isActive = s.svgIcon === opt.svg;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => update(s.id, "svgIcon", opt.svg)}
                          title={opt.label}
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition [&>svg]:w-4 [&>svg]:h-4 ${
                            isActive
                              ? "border-[#C9972A] bg-[#C9972A]/10 text-[#C9972A]"
                              : "border-black/10 text-[#8E8E93] hover:border-[#C9972A]/40 hover:text-[#C9972A]"
                          }`}
                          dangerouslySetInnerHTML={{ __html: opt.svg }}
                        />
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowSvgPicker(showSvgPicker === s.id ? null : s.id)}
                    className="text-xs text-[#C9972A] font-medium mb-2 hover:underline"
                  >
                    {showSvgPicker === s.id ? "Ẩn editor SVG" : "Dán SVG tùy chỉnh ↓"}
                  </button>
                  {showSvgPicker === s.id && (
                    <div className="space-y-2">
                      <textarea
                        value={s.svgIcon}
                        onChange={(e) => update(s.id, "svgIcon", e.target.value)}
                        rows={4}
                        placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
                        className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-xs text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition resize-none font-mono"
                      />
                      {s.svgIcon && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#8E8E93]">Preview:</span>
                          <div className="w-10 h-10 rounded-xl bg-[#C9972A]/10 flex items-center justify-center text-[#C9972A] [&>svg]:w-5 [&>svg]:h-5" dangerouslySetInnerHTML={{ __html: s.svgIcon }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-black/8">
          <Sparkles size={32} className="text-[#C7C7CC] mx-auto mb-3" />
          <p className="text-[#8E8E93] text-sm">Chưa có dịch vụ nào. Nhấn &quot;Reset mặc định&quot; hoặc &quot;Thêm dịch vụ&quot; để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}

// ─── Videos Tab ───────────────────────────────────────────────────
function extractYtIdFn(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/[?&]v=([^&]+)/) || raw.match(/youtu\.be\/([^?&]+)/) || raw.match(/shorts\/([^?&]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return raw;
}

function VideosTab({
  videos,
  heroVideoId: initialHeroId,
  onSave,
}: {
  videos: VideoItem[];
  heroVideoId: string;
  onSave: (v: VideoItem[], heroVideoId: string) => Promise<void>;
}) {
  const [list, setList] = useState<VideoItem[]>(videos);
  const [heroId, setHeroId] = useState(initialHeroId);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { setList(videos); setHeroId(initialHeroId); }, [videos, initialHeroId]);

  const compressImage = (file: File, maxWidth = 640, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/webp", quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailUpload = async (videoId: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(videoId);
    try {
      const dataUrl = await compressImage(file);
      setList((prev) => prev.map((v) => (v.id === videoId ? { ...v, thumbnail: dataUrl } : v)));
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
    } finally {
      setUploading(null);
    }
  };

  const update = (id: string, field: keyof VideoItem, val: string) => {
    setList((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
  };

  const remove = (id: string) => setList((prev) => prev.filter((v) => v.id !== id));

  const add = () => {
    const nv = EMPTY_VIDEO();
    setList((prev) => [...prev, nv]);
    setExpanded(nv.id);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(list, heroId);
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Danh sách video Showreel</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Nhập YouTube Video ID (phần sau <code className="bg-black/5 px-1 rounded">?v=</code>) để nhúng video.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-1.5 text-xs text-[#C9972A] border border-[#C9972A]/30 bg-[#C9972A]/8 px-3 py-2 rounded-xl hover:bg-[#C9972A]/15 transition font-medium">
            <Plus size={12} /> Thêm video
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-[#C9972A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50">
            <Save size={12} /> {saving ? "Đang lưu…" : "Lưu danh sách"}
          </button>
        </div>
      </div>

      {/* Video bìa trang chủ */}
      <div className="bg-white rounded-2xl border border-[#C9972A]/25 overflow-hidden mb-6">
        <div className="px-5 py-3.5 bg-[#FFF8EC] border-b border-[#C9972A]/15 flex items-center gap-2">
          <span className="text-sm font-bold text-[#1C1C1E]">Video bìa trang chủ</span>
          <span className="text-[10px] font-medium text-[#C9972A] bg-[#C9972A]/10 px-2 py-0.5 rounded-full">Hero 16:9</span>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-[#8E8E93]">
            Video tự phát (tắt tiếng) làm bìa trang chủ. Dán YouTube URL hoặc Video ID vào đây, sau đó nhấn <strong>Lưu danh sách</strong>.
          </p>
          <div className="flex gap-3 items-center">
            <input
              value={heroId}
              onChange={(e) => setHeroId(e.target.value.trim())}
              placeholder="https://youtu.be/xxxxx  hoặc  dQw4w9WgXcQ"
              className="flex-1 bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition font-mono"
            />
            {heroId && (
              <img
                src={`https://img.youtube.com/vi/${extractYtIdFn(heroId)}/mqdefault.jpg`}
                alt="preview"
                className="h-[52px] w-24 object-cover rounded-xl border border-black/8 flex-shrink-0"
              />
            )}
          </div>
          {list.filter((v) => v.ytId).length > 0 && (
            <div>
              <p className="text-[11px] text-[#8E8E93] mb-2 font-medium">Chọn nhanh từ showreel bên dưới:</p>
              <div className="flex gap-2 flex-wrap">
                {list.filter((v) => v.ytId).map((v) => {
                  const vid = extractYtIdFn(v.ytId);
                  const active = extractYtIdFn(heroId) === vid;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setHeroId(vid)}
                      title={v.title}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                        active
                          ? "border-[#C9972A] bg-[#C9972A]/10 text-[#C9972A]"
                          : "border-black/10 text-[#3C3C43] hover:border-[#C9972A]/40 hover:text-[#C9972A]"
                      }`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${vid}/default.jpg`}
                        className="w-8 h-5 object-cover rounded"
                        alt=""
                      />
                      <span className="max-w-[140px] truncate">{v.title || vid}</span>
                      {active && <Check size={10} className="flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {list.map((v, i) => (
          <div key={v.id} className="bg-white rounded-2xl border border-black/8 overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-black/3 transition"
              onClick={() => setExpanded(expanded === v.id ? null : v.id)}
            >
              <span className="text-xs text-[#C7C7CC] w-5 flex-shrink-0">{i + 1}</span>
              {v.thumbnail ? (
                <img
                  src={v.thumbnail}
                  alt=""
                  className="w-10 h-7 object-cover rounded-md flex-shrink-0 bg-black/10 border border-[#C9972A]/30"
                />
              ) : v.ytId ? (
                <img
                  src={`https://img.youtube.com/vi/${v.ytId}/default.jpg`}
                  alt=""
                  className="w-10 h-7 object-cover rounded-md flex-shrink-0 bg-black/10"
                />
              ) : (
                <div className="w-10 h-7 bg-[#F2F2F7] rounded-md flex-shrink-0 flex items-center justify-center">
                  <Video size={12} className="text-[#C7C7CC]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[#1C1C1E] truncate">{v.title || "Video chưa đặt tên"}</div>
                <div className="text-xs text-[#8E8E93]">
                  {v.cat} · {v.client} · {v.year}
                  {v.ytId && <span className="text-[#C9972A] ml-1">· YT: {v.ytId}</span>}
                </div>
              </div>
              {v.ytId && (
                <a
                  href={`https://youtube.com/watch?v=${v.ytId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#8E8E93] hover:text-[#C9972A] transition flex-shrink-0"
                >
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); remove(v.id); }}
                className="text-[#C7C7CC] hover:text-red-400 transition flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
              {expanded === v.id
                ? <ChevronUp size={14} className="text-[#8E8E93] flex-shrink-0" />
                : <ChevronDown size={14} className="text-[#8E8E93] flex-shrink-0" />}
            </div>

            {/* Expanded form */}
            {expanded === v.id && (
              <div className="border-t border-black/5 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Tiêu đề" value={v.title} onChange={(val) => update(v.id, "title", val)} placeholder="TVC Tết – Vinamilk 2025" />
                <div>
                  <label className="text-xs text-[#8E8E93] mb-1 block">Danh mục</label>
                  <select
                    value={v.cat}
                    onChange={(e) => update(v.id, "cat", e.target.value)}
                    className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] focus:border-[#C9972A] focus:outline-none"
                  >
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Field label="Khách hàng" value={v.client} onChange={(val) => update(v.id, "client", val)} placeholder="Vinamilk" />
                <Field label="Năm" value={v.year} onChange={(val) => update(v.id, "year", val)} placeholder="2025" />
                <Field label="Lượt xem" value={v.views} onChange={(val) => update(v.id, "views", val)} placeholder="12M views" />
                <Field label="Thời lượng" value={v.duration} onChange={(val) => update(v.id, "duration", val)} placeholder="1:00" />
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1 block">
                    YouTube Video ID <span className="text-[#C9972A]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={v.ytId}
                      onChange={(e) => update(v.id, "ytId", e.target.value.trim())}
                      placeholder="dQw4w9WgXcQ  (phần sau ?v= trong URL)"
                      className="flex-1 bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition font-mono"
                    />
                    {v.ytId && (
                      <a
                        href={`https://youtube.com/watch?v=${v.ytId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#C9972A] border border-[#C9972A]/30 px-3 rounded-xl hover:bg-[#C9972A]/8 transition"
                      >
                        <ExternalLink size={12} /> Xem
                      </a>
                    )}
                  </div>
                  {v.ytId && !v.thumbnail && (
                    <img
                      src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`}
                      alt="thumbnail"
                      className="mt-2 rounded-xl h-24 object-cover border border-black/8"
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1 block">
                    Ảnh Thumbnail tuỳ chỉnh <span className="text-[10px] text-[#C7C7CC]">(bỏ trống = lấy từ YouTube)</span>
                  </label>
                  <input
                    ref={(el) => { fileInputRefs.current[v.id] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailUpload(v.id, file);
                      e.target.value = "";
                    }}
                  />
                  {v.thumbnail ? (
                    <div className="mt-1 flex items-start gap-3">
                      <img
                        src={v.thumbnail}
                        alt="custom thumbnail"
                        className="rounded-xl h-24 aspect-video object-cover border border-[#C9972A]/30"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="flex flex-col gap-1.5 mt-1">
                        <button
                          onClick={() => fileInputRefs.current[v.id]?.click()}
                          className="text-xs text-[#C9972A] border border-[#C9972A]/30 px-2.5 py-1.5 rounded-lg hover:bg-[#C9972A]/8 transition flex-shrink-0 flex items-center gap-1"
                        >
                          <Upload size={10} />Đổi ảnh
                        </button>
                        <button
                          onClick={() => update(v.id, "thumbnail", "")}
                          className="text-xs text-red-400 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition flex-shrink-0 flex items-center gap-1"
                        >
                          <Trash2 size={10} />Xoá
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRefs.current[v.id]?.click()}
                      disabled={uploading === v.id}
                      className="w-full mt-1 flex items-center justify-center gap-2 bg-[#F2F2F7] border-2 border-dashed border-black/15 rounded-xl px-4 py-4 text-sm text-[#8E8E93] hover:border-[#C9972A]/50 hover:text-[#C9972A] hover:bg-[#C9972A]/5 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploading === v.id ? (
                        <><span className="animate-spin">⏳</span> Đang xử lý...</>
                      ) : (
                        <><Upload size={16} /> Chọn ảnh thumbnail</>
                      )}
                    </button>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8E8E93] mb-1 block">Mô tả ngắn</label>
                  <textarea
                    value={v.desc}
                    onChange={(e) => update(v.id, "desc", e.target.value)}
                    rows={2}
                    placeholder="Mô tả dự án…"
                    className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-black/8">
          <Video size={32} className="text-[#C7C7CC] mx-auto mb-3" />
          <p className="text-[#8E8E93] text-sm">Chưa có video nào. Nhấn &quot;Thêm video&quot; để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────
type Lead = {
  id: string; name: string; phone: string; note?: string;
  service: string; total: number; items: { id: string; name: string; qty: number; unitPrice: number }[];
  date: string; contacted: boolean;
};
const SERVICE_LABEL_MAP: Record<string, string> = {
  tvc: "TVC", mv: "MV", corporate: "Corporate", social: "Social", event: "Event",
};
function LeadsTab({ sessionPw }: { sessionPw: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/leads?password=${encodeURIComponent(sessionPw)}`);
    if (res.ok) setLeads(await res.json());
    setLoading(false);
  }, [sessionPw]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const toggleContacted = async (id: string, contacted: boolean) => {
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, contacted, password: sessionPw }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, contacted } : l)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 border-2 border-[#C9972A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Khách hàng đã để lại thông tin</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">{leads.length} yêu cầu báo giá</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-1.5 text-xs text-[#8E8E93] border border-black/10 px-3 py-2 rounded-xl hover:text-[#1C1C1E] transition">
          <RotateCcw size={12} /> Làm mới
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-black/8">
          <Users size={32} className="text-[#C7C7CC] mx-auto mb-3" />
          <p className="text-[#8E8E93] text-sm">Chưa có khách hàng nào để lại thông tin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className={`bg-white rounded-2xl border overflow-hidden transition ${lead.contacted ? "border-green-200 bg-green-50/30" : "border-black/8"}`}>
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-black/2"
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${lead.contacted ? "bg-green-100" : "bg-[#C9972A]/10"}`}>
                  {lead.contacted
                    ? <Check size={14} className="text-green-600" />
                    : <Phone size={14} className="text-[#C9972A]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#1C1C1E]">{lead.name}</span>
                    <span className="text-xs text-[#C9972A] font-mono">{lead.phone}</span>
                    {lead.contacted && (
                      <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">Đã liên hệ</span>
                    )}
                  </div>
                  <div className="text-xs text-[#8E8E93] mt-0.5">
                    {SERVICE_LABEL_MAP[lead.service] || lead.service}
                    {" · "}
                    <span className="text-[#C9972A] font-medium">{lead.total.toLocaleString("vi-VN")}đ</span>
                    {" · "}
                    {new Date(lead.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleContacted(lead.id, !lead.contacted); }}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-xl border transition ${
                    lead.contacted
                      ? "border-green-200 text-green-600 hover:bg-green-50"
                      : "border-[#C9972A]/30 text-[#C9972A] hover:bg-[#C9972A]/8"
                  }`}
                >
                  {lead.contacted ? "Bỏ đánh dấu" : "Đã liên hệ"}
                </button>
                {expanded === lead.id ? <ChevronUp size={14} className="text-[#8E8E93] flex-shrink-0" /> : <ChevronDown size={14} className="text-[#8E8E93] flex-shrink-0" />}
              </div>
              {expanded === lead.id && (
                <div className="border-t border-black/5 px-5 py-4">
                  {lead.note && (
                    <p className="text-sm text-[#3C3C43] mb-3 bg-[#F2F2F7] rounded-xl px-4 py-3">
                      <strong className="text-[#8E8E93] text-xs block mb-1">Ghi chú:</strong>
                      {lead.note}
                    </p>
                  )}
                  <p className="text-xs text-[#8E8E93] mb-2 font-medium uppercase tracking-wider">{lead.items?.length} hạng mục</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {(lead.items || []).map((item) => (
                      <div key={item.id} className="flex justify-between text-xs py-0.5">
                        <span className="text-[#3C3C43] flex-1 truncate pr-3">{item.name} ×{item.qty}</span>
                        <span className="text-[#8E8E93] flex-shrink-0">{(item.unitPrice * item.qty).toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Home Page Tab ────────────────────────────────────────────────
function HomePageTab({
  clientLogos: initialLogos = [],
  founder: initialFounder,
  testimonials: initialTestimonials = [],
  onSaveLogos,
  onSaveFounder,
  onSaveTestimonials,
}: {
  clientLogos?: string[];
  founder: FounderData | null;
  testimonials?: TestimonialItem[];
  onSaveLogos: (logos: string[]) => Promise<void>;
  onSaveFounder: (founder: FounderData) => Promise<void>;
  onSaveTestimonials: (testimonials: TestimonialItem[]) => Promise<void>;
}) {
  // ── Testimonials ──
  const defaultTestimonials: TestimonialItem[] = [
    { name: "Nguyễn Thị Hà", role: "Marketing Director — Vinamilk", body: "Bình An Media hiểu đúng insight thương hiệu. TVC Tết năm nay vượt 10M views chỉ sau 3 ngày đăng." },
    { name: "Trần Minh Quân", role: "Ca sĩ độc lập", body: "MV được đầu tư hình ảnh đẹp không tưởng với ngân sách hợp lý. Team cực kỳ chuyên nghiệp, luôn đúng hẹn." },
    { name: "Lê Thanh Sơn", role: "CEO — FPT Software", body: "Corporate film dùng để pitch đối tác quốc tế. Phản hồi rất tốt. Sẽ tiếp tục hợp tác dài hạn." },
  ];
  const [tms, setTms] = useState<TestimonialItem[]>(initialTestimonials.length > 0 ? initialTestimonials : defaultTestimonials);
  const [tmsSaving, setTmsSaving] = useState(false);
  const updateTm = (i: number, patch: Partial<TestimonialItem>) => {
    setTms((prev) => prev.map((t, idx) => idx === i ? { ...t, ...patch } : t));
  };
  const addTm = () => setTms((prev) => [...prev, { name: "", role: "", body: "" }]);
  const removeTm = (i: number) => setTms((prev) => prev.filter((_, idx) => idx !== i));
  const saveTestimonials = async () => { setTmsSaving(true); await onSaveTestimonials(tms); setTmsSaving(false); };

  // ── Logos ──
  const [logos, setLogos] = useState<string[]>(initialLogos);
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [logosSaving, setLogosSaving] = useState(false);

  const addLogo = () => {
    const url = newLogoUrl.trim();
    if (!url || logos.includes(url)) return;
    setLogos([...logos, url]);
    setNewLogoUrl("");
  };
  const removeLogo = (i: number) => setLogos(logos.filter((_, idx) => idx !== i));
  const saveLogos = async () => { setLogosSaving(true); await onSaveLogos(logos); setLogosSaving(false); };

  // ── Founder ──
  const defaultFounder: FounderData = {
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
  const [fd, setFd] = useState<FounderData>(initialFounder || defaultFounder);
  const [founderSaving, setFounderSaving] = useState(false);

  const updateFd = (patch: Partial<FounderData>) => setFd((prev) => ({ ...prev, ...patch }));
  const updateBio = (i: number, val: string) => {
    const newBio = [...fd.bio];
    newBio[i] = val;
    setFd((prev) => ({ ...prev, bio: newBio }));
  };
  const addBioP = () => setFd((prev) => ({ ...prev, bio: [...prev.bio, ""] }));
  const removeBioP = (i: number) => setFd((prev) => ({ ...prev, bio: prev.bio.filter((_, idx) => idx !== i) }));

  const saveFounder = async () => { setFounderSaving(true); await onSaveFounder(fd); setFounderSaving(false); };

  return (
    <div className="max-w-2xl space-y-12">
      {/* Client logos */}
      <div>
        <h2 className="text-lg font-black text-[#1C1C1E] mb-1">Logo khách hàng đã hợp tác</h2>
        <p className="text-xs text-[#8E8E93] mb-6">Dán link ảnh logo. Trên trang chủ hiển thị dưới dạng trắng đen.</p>
        <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4">
          <div className="flex gap-2">
            <input
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLogo())}
              placeholder="https://example.com/logo.png"
              className="flex-1 bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
            />
            <button onClick={addLogo} disabled={!newLogoUrl.trim()}
              className="bg-[#C9972A] text-white px-4 py-2.5 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-40 flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
            >
              <Plus size={14} /> Thêm
            </button>
          </div>
          {logos.length > 0 ? (
            <div className="space-y-2">
              {logos.map((url, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F2F2F7] rounded-xl px-4 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-7 w-16 object-contain flex-shrink-0 grayscale opacity-60" />
                  <span className="flex-1 text-xs text-[#8E8E93] truncate">{url}</span>
                  <button onClick={() => removeLogo(i)} className="text-[#8E8E93] hover:text-red-500 transition flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#C7C7CC] text-center py-4">Chưa có logo nào. Dán link ảnh để thêm.</p>
          )}
          <button onClick={saveLogos} disabled={logosSaving}
            className="w-full bg-[#C9972A] text-white font-bold py-3 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {logosSaving ? "Đang lưu…" : <><Save size={14} /> Lưu danh sách logo</>}
          </button>
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-lg font-black text-[#1C1C1E] mb-1">Khách hàng nói gì</h2>
        <p className="text-xs text-[#8E8E93] mb-6">Quản lý danh sách đánh giá hiển thị trên trang chủ.</p>
        <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4">
          {tms.map((t, i) => (
            <div key={i} className="bg-[#F2F2F7] rounded-xl p-4 space-y-3 relative">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-[#8E8E93]">{i + 1}.</span>
                <button onClick={() => removeTm(i)} className="text-[#8E8E93] hover:text-red-500 transition flex-shrink-0" title="Xoá">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8E8E93] mb-1 block">Họ tên</label>
                  <input value={t.name} onChange={(e) => updateTm(i, { name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8E8E93] mb-1 block">Chức vụ / Công ty</label>
                  <input value={t.role} onChange={(e) => updateTm(i, { role: e.target.value })}
                    placeholder="CEO — Tên công ty"
                    className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#8E8E93] mb-1 block">Nội dung đánh giá</label>
                <textarea value={t.body} onChange={(e) => updateTm(i, { body: e.target.value })} rows={2}
                  placeholder="Nội dung đánh giá của khách hàng…"
                  className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition resize-none"
                />
              </div>
            </div>
          ))}
          <button onClick={addTm}
            className="w-full border-2 border-dashed border-black/10 rounded-xl py-3 text-[#8E8E93] hover:text-[#C9972A] hover:border-[#C9972A]/30 transition text-sm flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Thêm đánh giá
          </button>
          <button onClick={saveTestimonials} disabled={tmsSaving}
            className="w-full bg-[#C9972A] text-white font-bold py-3 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {tmsSaving ? "Đang lưu…" : <><Save size={14} /> Lưu đánh giá</>}
          </button>
        </div>
      </div>

      {/* Founder */}
      <div>
        <h2 className="text-lg font-black text-[#1C1C1E] mb-1">Giới thiệu Founder</h2>
        <p className="text-xs text-[#8E8E93] mb-6">Thông tin hiển thị trên trang chủ, section &ldquo;Founder&rdquo;.</p>
        <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-5">
          {/* Photo */}
          <div>
            <label className="text-xs text-[#8E8E93] mb-1.5 block">Link ảnh đại diện</label>
            <div className="flex gap-3 items-center">
              <input value={fd.photoUrl} onChange={(e) => updateFd({ photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
              {fd.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fd.photoUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-black/10 flex-shrink-0" />
              )}
            </div>
          </div>
          {/* Name + Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8E8E93] mb-1.5 block">Họ và tên</label>
              <input value={fd.name} onChange={(e) => updateFd({ name: e.target.value })}
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1.5 block">Chức danh</label>
              <input value={fd.title} onChange={(e) => updateFd({ title: e.target.value })}
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
          </div>
          {/* Experience */}
          <div>
            <label className="text-xs text-[#8E8E93] mb-1.5 block">Kinh nghiệm (VD: &quot;12+ năm&quot;)</label>
            <input value={fd.experience} onChange={(e) => updateFd({ experience: e.target.value })}
              className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm focus:border-[#C9972A] focus:outline-none transition"
            />
          </div>
          {/* Bio paragraphs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#8E8E93]">Giới thiệu (mỗi ô là 1 đoạn văn)</label>
              <button onClick={addBioP} className="text-xs text-[#C9972A] hover:underline flex items-center gap-1">
                <Plus size={12} /> Thêm đoạn
              </button>
            </div>
            <div className="space-y-2">
              {fd.bio.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea value={p} onChange={(e) => updateBio(i, e.target.value)} rows={3}
                    className="flex-1 bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm focus:border-[#C9972A] focus:outline-none transition resize-none"
                  />
                  {fd.bio.length > 1 && (
                    <button onClick={() => removeBioP(i)} className="text-[#8E8E93] hover:text-red-500 transition mt-1 flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8E8E93] mb-1.5 block">URL liên kết</label>
              <input value={fd.linkUrl} onChange={(e) => updateFd({ linkUrl: e.target.value })}
                placeholder="https://anhemphim.com.vn"
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1.5 block">Nhãn hiển thị</label>
              <input value={fd.linkLabel} onChange={(e) => updateFd({ linkLabel: e.target.value })}
                placeholder="anhemphim.com.vn"
                className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-2.5 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>
          </div>
          <button onClick={saveFounder} disabled={founderSaving}
            className="w-full bg-[#C9972A] text-white font-bold py-3 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {founderSaving ? "Đang lưu…" : <><Save size={14} /> Lưu thông tin Founder</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────
function SettingsTab({
  onSave,
}: {
  onSave: (newPw: string) => Promise<void>;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    if (next !== confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    const vRes = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: current }),
    });
    if (!vRes.ok) { setError("Mật khẩu hiện tại không đúng."); return; }
    setSaving(true);
    await onSave(next);
    setCurrent(""); setNext(""); setConfirm("");
    setSaving(false);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-black text-[#1C1C1E] mb-1">Cài đặt</h2>
      <p className="text-xs text-[#8E8E93] mb-6">Đổi mật khẩu đăng nhập admin.</p>
      <form onSubmit={handleChange} className="bg-white rounded-2xl border border-black/8 p-6 space-y-4">
        <h3 className="font-bold text-sm text-[#1C1C1E]">Đổi mật khẩu</h3>
        {[
          { label: "Mật khẩu hiện tại", val: current, set: setCurrent },
          { label: "Mật khẩu mới",      val: next,    set: setNext },
          { label: "Xác nhận mật khẩu", val: confirm,  set: setConfirm },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <label className="text-xs text-[#8E8E93] mb-1.5 block">{label}</label>
            <input
              type="password"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-4 py-3 text-[#1C1C1E] text-sm placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={saving || !current || !next || !confirm}
          className="w-full bg-[#C9972A] text-white font-bold py-3 rounded-xl hover:bg-[#B8841E] transition disabled:opacity-50 text-sm"
        >
          {saving ? "Đang lưu…" : "Đổi mật khẩu"}
        </button>
      </form>
      <div className="mt-4 bg-[#FFF8EC] border border-[#C9972A]/20 rounded-2xl p-5">
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          <strong className="text-[#C9972A]">Lưu ý:</strong> Mật khẩu mặc định là <code className="bg-black/5 px-1 rounded">admin@2026</code>.
          Tất cả thay đổi giá, gói, video được lưu trực tiếp trên server và áp dụng ngay cho tất cả khách hàng.
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-[#8E8E93] mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F2F2F7] border border-black/10 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:border-[#C9972A] focus:outline-none transition"
      />
    </div>
  );
}
