"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import {
  Plus, Minus, Trash2, ChevronDown, ChevronUp,
  Send, Loader2, Check, X, Download,
} from "lucide-react";
import Link from "next/link";

import { CATALOG, GROUPS, DEFAULT_PRESETS } from "@/lib/catalog";
import type { CatalogItem, PresetItem } from "@/lib/catalog";

type LineItem = CatalogItem & { qty: number };

type ServiceDef = {
  id: string;
  label: string;
  desc: string;
  svgIcon: string;
  qualityRef: string;
  refVideoUrl?: string;
  unitCount?: number;
  unitLabel?: string;
};

const extractYtId = (url: string): string | null => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/shorts\/([^?&]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
  return null;
};

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

const DEFAULT_SERVICE_OPTIONS: ServiceDef[] = [
  { id: "tvc", label: "TVC", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`, desc: "Quảng cáo thương mại, viral video", qualityRef: "4K RED/ARRI, ekip 8-12 người, color grade chuyên nghiệp", refVideoUrl: "" },
  { id: "mv", label: "MV Ca nhạc", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`, desc: "Music video, nghệ thuật", qualityRef: "4K cinematic, multi-location, stylist & art director", refVideoUrl: "" },
  { id: "corporate", label: "Phim doanh nghiệp", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`, desc: "Giới thiệu công ty, thương hiệu", qualityRef: "4K, kịch bản chuyên nghiệp, voice-over, motion graphics", refVideoUrl: "" },
  { id: "social", label: "Social Content", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`, desc: "Reels, TikTok, YouTube Shorts", qualityRef: "Cinema camera, full crew, concept sáng tạo", refVideoUrl: "" },
  { id: "event", label: "Event & Livestream", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`, desc: "Hội nghị, sự kiện, lễ ra mắt", qualityRef: "Multi-camera (4+), đạo diễn hình, livestream chuyên nghiệp", refVideoUrl: "" },
  { id: "event_recap", label: "Recap sự kiện", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/><circle cx="8.5" cy="12" r="2.5"/></svg>`, desc: "Highlight 2-3 phút, giá tốt", qualityRef: "2 cameraman, quay + dựng gọn 2-3 ngày", refVideoUrl: "" },
  { id: "small_ad", label: "Video quảng cáo nhỏ", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`, desc: "Quảng cáo 15-30s, sản phẩm, F&B", qualityRef: "1 ngày quay, ekip gọn 4-5 người, studio nhỏ", refVideoUrl: "" },
  { id: "social_bulk", label: "Gói Social 10+ video", svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`, desc: "Combo 10+ video Reels/TikTok, tiết kiệm 30%", qualityRef: "2 ngày quay liên tục, 10+ bản cắt, giá combo tiết kiệm", refVideoUrl: "", unitCount: 10, unitLabel: "clip" },
];

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────
export default function QuotePage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-[#8E8E93]">Đang tải...</div>}>
      <QuoteBuilder />
    </Suspense>
  );
}

function QuoteBuilder() {
  const [service, setService] = useState<string>("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"service" | "items" | "contact">("service");
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [customPresets, setCustomPresets] = useState<Record<string, PresetItem[]>>({});
  const [customCatalogItems, setCustomCatalogItems] = useState<CatalogItem[]>([]);
  const [customServices, setCustomServices] = useState<ServiceDef[]>([]);
  const [catalogEdits, setCatalogEdits] = useState<Record<string, { name?: string; unit?: string }>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.priceOverrides) setPriceOverrides(data.priceOverrides);
        if (data.presets) setCustomPresets(data.presets);
        if (Array.isArray(data.customCatalogItems)) setCustomCatalogItems(data.customCatalogItems);
        if (Array.isArray(data.customServices)) setCustomServices(data.customServices);
        if (data.catalogEdits) setCatalogEdits(data.catalogEdits);
      })
      .catch(() => {});
  }, []);

  // Always show defaults; if admin saved a full list (containing all default IDs), use that instead.
  // Any extras from admin (IDs not in defaults) are appended.
  const allServices: ServiceDef[] = useMemo(() => {
    if (customServices.length === 0) return DEFAULT_SERVICE_OPTIONS;
    const defaultIds = new Set(DEFAULT_SERVICE_OPTIONS.map((d) => d.id));
    const savedIds = new Set(customServices.map((s) => s.id));
    const hasAllDefaults = DEFAULT_SERVICE_OPTIONS.every((d) => savedIds.has(d.id));
    if (hasAllDefaults) {
      // Admin saved the full list — use it as-is
      return customServices;
    }
    // Partial save: keep defaults + append extras
    const extras = customServices.filter((s) => !defaultIds.has(s.id));
    return [...DEFAULT_SERVICE_OPTIONS, ...extras];
  }, [customServices]);

  const allCatalog = useMemo(() => [...CATALOG, ...customCatalogItems], [customCatalogItems]);
  const allGroups = useMemo(() => {
    const gs = new Set([...GROUPS, ...customCatalogItems.map((c) => c.group)]);
    return Array.from(gs);
  }, [customCatalogItems]);

  const effectiveCatalog: Omit<LineItem, "qty">[] = allCatalog.map((item) => ({
    ...item,
    name: catalogEdits[item.id]?.name || item.name,
    unit: catalogEdits[item.id]?.unit || item.unit,
    unitPrice: priceOverrides[item.id] ?? item.unitPrice,
  }));

  const loadPreset = (svc: string) => {
    const preset = (customPresets[svc]?.length ? customPresets[svc] : DEFAULT_PRESETS[svc]) || [];
    const loaded: LineItem[] = preset.flatMap(({ id, qty }) => {
      const cat = effectiveCatalog.find((c) => c.id === id);
      return cat ? [{ ...cat, qty }] : [];
    });
    setService(svc);
    setItems(loaded);
    setStep("items");
  };

  const { groupedItems, subtotal, vat, total } = useMemo(() => {
    const groupedItems: Record<string, LineItem[]> = {};
    items.forEach((item) => {
      if (!groupedItems[item.group]) groupedItems[item.group] = [];
      groupedItems[item.group].push(item);
    });
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const vat = Math.round(subtotal * 0.1);
    return { groupedItems, subtotal, vat, total: subtotal + vat };
  }, [items]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const setQty = (id: string, val: number) => {
    if (val <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: val } : i));
    }
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const addFromCatalog = (catItem: Omit<LineItem, "qty">) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === catItem.id)) {
        return prev.map((i) => i.id === catItem.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...catItem, qty: 1 }];
    });
  };

  const toggleGroup = (g: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const filteredCatalog = effectiveCatalog.filter(
    (c) => catalogSearch === "" ||
      c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.group.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          note: contact.note,
          service,
          total,
          items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, unitPrice: i.unitPrice })),
        }),
      });
    } catch {
      // fail silently
    }
    setLoading(false);
    setSubmitted(true);
  };

  const downloadQuote = () => {
    const svcLabel = allServices.find((s) => s.id === service)?.label || service;
    const today = new Date();
    const dateStr = today.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const quoteId = `BA-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,"0")}${String(today.getDate()).padStart(2,"0")}-${String(Math.floor(Math.random()*9000)+1000)}`;

    const groupRows = Object.entries(groupedItems).map(([group, gItems]) => {
      const itemRows = gItems.map((item, idx) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#333;">${idx+1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#333;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;color:#333;">${item.unit}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;color:#333;">${item.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#333;white-space:nowrap;">${item.unitPrice.toLocaleString("vi-VN")}đ</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#333;font-weight:600;white-space:nowrap;">${(item.unitPrice*item.qty).toLocaleString("vi-VN")}đ</td>
        </tr>`).join("");
      return `
        <tr><td colspan="6" style="padding:10px 12px;background:#f8f5ee;font-weight:700;color:#8B7220;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">${group}</td></tr>
        ${itemRows}`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Báo giá ${quoteId}</title>
    <style>
      @page { size: A4; margin: 15mm 12mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; margin: 0; padding: 24px; font-size: 13px; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #C9972A; }
      .brand { font-size: 22px; font-weight: 900; color: #111; }
      .brand span { color: #C9972A; }
      .company-info { font-size: 11px; color: #666; margin-top: 6px; line-height: 1.7; }
      .quote-meta { text-align: right; }
      .quote-meta .id { font-size: 16px; font-weight: 800; color: #C9972A; }
      .quote-meta .date { font-size: 12px; color: #888; margin-top: 4px; }
      .section-title { font-size: 15px; font-weight: 700; margin: 24px 0 10px; color: #111; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      thead th { background: #111; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
      thead th:nth-child(3), thead th:nth-child(4) { text-align: center; }
      thead th:nth-child(5), thead th:nth-child(6) { text-align: right; }
      .summary { margin-top: 20px; display: flex; justify-content: flex-end; }
      .summary-table { width: 280px; }
      .summary-table td { padding: 6px 0; font-size: 13px; }
      .summary-table .total { font-size: 20px; font-weight: 900; color: #C9972A; border-top: 2px solid #C9972A; padding-top: 10px; }
      .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
      .note { background: #fffbeb; border: 1px solid #f0e6c0; border-radius: 8px; padding: 14px 16px; margin-top: 24px; font-size: 11px; color: #8B7220; }
      @media print { body { padding: 0; } }
    </style></head><body>
      <div class="header">
        <div>
          <div class="brand">BinhAn<span>Media</span><span style="font-size:14px;opacity:0.7">.com</span></div>
          <div class="company-info">
            <strong>CÔNG TY TNHH BÌNH AN MEDIA</strong><br>
            📍 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh<br>
            📞 0901 234 567 &nbsp;&nbsp; ✉ hello@binhanmedia.com<br>
            🌐 binhanmedia.com &nbsp;&nbsp; MST: 0312345678
          </div>
        </div>
        <div class="quote-meta">
          <div class="id">${quoteId}</div>
          <div class="date">Ngày báo giá: ${dateStr}</div>
          <div style="margin-top:8px;font-size:12px;color:#555;">Dịch vụ: <strong>${svcLabel}</strong></div>
        </div>
      </div>

      <div class="section-title">BẢNG BÁO GIÁ CHI TIẾT</div>
      <table>
        <thead><tr>
          <th style="width:30px">STT</th>
          <th>Hạng mục</th>
          <th style="width:70px">Đơn vị</th>
          <th style="width:50px">SL</th>
          <th style="width:100px">Đơn giá</th>
          <th style="width:110px">Thành tiền</th>
        </tr></thead>
        <tbody>${groupRows}</tbody>
      </table>

      <div class="summary"><table class="summary-table">
        <tr><td>Tạm tính</td><td style="text-align:right;font-weight:600;">${subtotal.toLocaleString("vi-VN")}đ</td></tr>
        <tr><td>VAT (10%)</td><td style="text-align:right;font-weight:600;">${vat.toLocaleString("vi-VN")}đ</td></tr>
        <tr><td class="total">TỔNG CỘNG</td><td class="total" style="text-align:right;">${total.toLocaleString("vi-VN")}đ</td></tr>
      </table></div>

      <div class="note">
        <strong>⚠ Lưu ý:</strong><br>
        • Báo giá có hiệu lực trong 15 ngày kể từ ngày phát hành.<br>
        • Giá trên chưa bao gồm chi phí phát sinh ngoài phạm vi thỏa thuận.<br>
        • Giá cuối cùng sẽ được xác nhận sau khi trao đổi chi tiết với khách hàng.
      </div>

      <div class="footer">
        © ${today.getFullYear()} Bình An Media. Tài liệu này được tạo tự động từ hệ thống báo giá trực tuyến binhanmedia.com
      </div>
    </body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      w.onload = () => { setTimeout(() => w.print(), 400); };
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6 bg-[#0A0A0A]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-[#C9972A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Đã gửi thành công!</h1>
          <p className="text-white/50 mb-2">
            Tổng báo giá:{" "}
            <span className="font-black text-xl text-[#C9972A]">{total.toLocaleString("vi-VN")}đ</span>
          </p>
          <p className="text-white/40 text-sm mb-8">
            Team sẽ liên hệ <strong className="text-white">{contact.name}</strong> qua số{" "}
            <strong className="text-[#C9972A]">{contact.phone}</strong> trong vòng 2 giờ làm việc.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="bg-[#C9972A] text-white font-bold px-6 py-3 rounded-full hover:bg-[#DBA93A] transition">
              Về trang chủ
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep("service"); setService(""); setItems([]); }}
              className="border border-white/12 text-white/70 px-6 py-3 rounded-full hover:border-white/25 transition"
            >
              Tạo báo giá mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/6 py-5 sm:py-10 px-4 sm:px-6 text-center">
        <p className="text-[#C9972A] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-1 sm:mb-2">Báo giá</p>
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">Tạo báo giá chi tiết</h1>
        <p className="text-white/40 text-[11px] sm:text-sm leading-relaxed">Chọn dự án → xem hạng mục → tuỳ chỉnh theo nhu cầu</p>
      </div>

      {/* Step indicator */}
      <div className="border-b border-white/6 bg-[#0A0A0A] px-2 sm:px-6 py-2 sm:py-3">
        <div className="max-w-5xl mx-auto flex gap-0.5 sm:gap-1 items-center justify-center sm:justify-start overflow-x-auto pb-0.5 scrollbar-hide">
          {(["service", "items", "contact"] as const).map((s, i) => {
            const labels = ["Chọn dịch vụ", "Tuỳ chỉnh hạng mục", "Thông tin & Liên hệ"];
            const done = (step === "items" && i === 0) || (step === "contact" && i <= 1);
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-1">
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-medium transition-all whitespace-nowrap ${active ? "bg-[#C9972A] text-white" : done ? "bg-[#C9972A]/20 text-[#C9972A]" : "bg-white/6 text-white/40"}`}>
                  {done ? <Check size={10} /> : <span>{i + 1}</span>}
                  <span className="hidden xs:inline sm:inline">{labels[i]}</span>
                  <span className="xs:hidden">{["Dịch vụ", "Hạng mục", "Liên hệ"][i]}</span>
                </div>
                {i < 2 && <div className="w-4 sm:w-6 h-px bg-white/8" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* ── STEP 1 ── */}
        {step === "service" && (() => {
          // Calculate estimated price for each service from its preset
          const withPrice = allServices.map((s) => {
            const preset = (customPresets[s.id]?.length ? customPresets[s.id] : DEFAULT_PRESETS[s.id]) || [];
            const est = preset.reduce((sum, p) => {
              const cat = effectiveCatalog.find((c) => c.id === p.id);
              return sum + (cat ? cat.unitPrice * p.qty : 0);
            }, 0);
            return { ...s, est };
          });
          // Sort by price ascending
          withPrice.sort((a, b) => a.est - b.est);
          const BUDGET_THRESHOLD = 60_000_000;
          const budget = withPrice.filter((s) => s.est < BUDGET_THRESHOLD);
          const premium = withPrice.filter((s) => s.est >= BUDGET_THRESHOLD);

          const renderCard = (s: typeof withPrice[0], variant: "budget" | "premium") => {
            const isBudget = variant === "budget";
            return (
              <button
                key={s.id}
                onClick={() => loadPreset(s.id)}
                className={`group w-full p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-start gap-3 sm:gap-4 ${
                  isBudget
                    ? "bg-[#0F1A12] border-emerald-500/15 hover:border-emerald-400/50 hover:bg-emerald-500/8"
                    : "bg-[#161616] border-white/8 hover:border-[#C9972A]/50 hover:bg-[#C9972A]/8"
                }`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition mt-0.5 [&>svg]:w-[18px] [&>svg]:h-[18px] ${
                  isBudget
                    ? "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20 text-emerald-400"
                    : "bg-[#C9972A]/10 border-[#C9972A]/20 group-hover:bg-[#C9972A]/20 text-[#C9972A]"
                }`} dangerouslySetInnerHTML={{ __html: s.svgIcon }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm sm:text-base">{s.label}</span>
                    {s.est > 0 && (() => {
                      const isCombo = s.unitCount && s.unitCount > 1;
                      const perUnit = isCombo ? s.est / s.unitCount! : null;
                      return (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isBudget
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-[#C9972A]/15 text-[#C9972A]"
                        }`}>
                          {isCombo
                            ? `~${(perUnit! / 1_000_000).toFixed(1).replace(/\.0$/, "")}tr/${s.unitLabel || "unit"}`
                            : `~${(s.est / 1_000_000).toFixed(0)}tr`}
                        </span>
                      );
                    })()}
                  </div>
                  {/* Combo secondary line */}
                  {s.est > 0 && s.unitCount && s.unitCount > 1 && (
                    <div className={`text-[10px] font-medium mt-0.5 ${isBudget ? "text-emerald-400/60" : "text-[#C9972A]/60"}` }>
                      = {(s.est / 1_000_000).toFixed(0)}tr / gói {s.unitCount} {s.unitLabel || "unit"}
                    </div>
                  )}
                  <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
                  {s.qualityRef && (
                    <div className={`text-[10px] mt-2 leading-relaxed border-t pt-2 ${
                      isBudget
                        ? "text-emerald-400/50 border-emerald-500/10"
                        : "text-[#C9972A]/60 border-white/6"
                    }`}>
                      ⚡ {s.qualityRef}
                    </div>
                  )}
                </div>
              </button>
            );
          };

          return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">Bạn cần sản xuất loại video gì?</h2>
            <p className="text-white/40 text-xs sm:text-sm text-center mb-6 sm:mb-8">
              Chọn loại dự án để xem báo giá chi tiết
            </p>

            {/* Budget packages */}
            {budget.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Gói giá tốt</span>
                  <span className="text-[10px] text-emerald-400/50">dưới 60 triệu</span>
                  <div className="flex-1 h-px bg-emerald-500/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {budget.map((s) => renderCard(s, "budget"))}
                </div>
              </>
            )}

            {/* Premium packages */}
            {premium.length > 0 && (
              <>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9972A]" />
                  <span className="text-xs font-bold text-[#C9972A] uppercase tracking-wider">Gói chuyên nghiệp</span>
                  <span className="text-[10px] text-[#C9972A]/50">từ 60 triệu</span>
                  <div className="flex-1 h-px bg-[#C9972A]/15" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {premium.map((s) => renderCard(s, "premium"))}
                </div>
              </>
            )}
          </div>
          );
        })()}

        {/* ── STEP 2 ── */}
        {step === "items" && (() => {
          const selectedSvc = allServices.find((s) => s.id === service);
          const svcVid = selectedSvc ? extractYtId(selectedSvc.refVideoUrl || "") : null;
          return (
          <div className="max-w-4xl mx-auto">
            {/* ── Reference video ── */}
            {svcVid && (
              <div className="mb-4 bg-[#161616] border border-white/8 rounded-2xl overflow-hidden">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${svcVid}?rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="px-4 py-2.5 flex items-center gap-2 border-t border-white/6">
                  <svg className="w-3.5 h-3.5 text-[#C9972A]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span className="text-[11px] text-white/50">Video chất lượng tham khảo — <span className="text-[#C9972A]/80 font-medium">{selectedSvc?.label}</span></span>
                </div>
              </div>
            )}

            {/* ── Price Hero ── */}
            <div className="sticky top-[72px] sm:top-[105px] z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 pb-3 sm:pb-4 pt-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]/0 pointer-events-none">
              <div className="pointer-events-auto bg-[#111] border border-[#C9972A]/25 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-white/40 mb-0.5">Chi phí ước tính <span className="text-white/25">(chưa VAT)</span></p>
                    <p className="text-2xl sm:text-5xl font-black text-[#C9972A] tracking-tight leading-none">
                      {subtotal.toLocaleString("vi-VN")}
                      <span className="text-sm sm:text-lg font-bold text-[#C9972A]/60 ml-0.5">đ</span>
                    </p>
                    <p className="text-[9px] sm:text-[11px] text-white/25 mt-0.5 sm:mt-1.5 truncate">{items.length} hạng mục · VAT 10%: {vat.toLocaleString("vi-VN")}đ · Tổng: {total.toLocaleString("vi-VN")}đ</p>
                  </div>
                  {/* Desktop buttons */}
                  <div className="hidden sm:flex sm:flex-col md:flex-row gap-2">
                    <button onClick={() => setStep("service")}
                      className="text-xs text-white/40 hover:text-white border border-white/10 px-4 py-2.5 rounded-full transition"
                    >← Đổi dịch vụ</button>
                    <button onClick={downloadQuote}
                      className="border border-white/15 text-white/60 text-xs font-semibold px-5 py-2.5 rounded-full hover:border-white/30 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Download size={11} /> Tải báo giá
                    </button>
                    <button
                      onClick={() => setStep("contact")}
                      className="bg-[#C9972A] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#DBA93A] transition-all hover:shadow-[0_4px_20px_rgba(201,151,42,0.25)] flex items-center gap-1.5"
                    >
                      <Send size={12} /> Yêu cầu liên hệ
                    </button>
                  </div>
                  {/* Mobile CTA only */}
                  <button
                    onClick={() => setStep("contact")}
                    className="sm:hidden bg-[#C9972A] text-white text-[11px] font-bold px-4 py-2.5 rounded-full active:bg-[#DBA93A] transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Send size={12} /> Liên hệ
                  </button>
                </div>
                {/* Mobile secondary buttons */}
                <div className="flex sm:hidden gap-2 mt-2.5 pt-2.5 border-t border-white/6">
                  <button onClick={() => setStep("service")}
                    className="flex-1 text-[11px] text-white/40 active:text-white border border-white/10 px-3 py-2 rounded-full transition text-center"
                  >← Đổi dịch vụ</button>
                  <button onClick={downloadQuote}
                    className="flex-1 border border-white/15 text-white/50 text-[11px] font-semibold px-3 py-2 rounded-full active:border-white/30 active:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download size={11} /> Tải báo giá
                  </button>
                </div>
              </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between mb-3 mt-2 gap-3">
              <p className="text-white/30 text-[11px] sm:text-xs hidden sm:block">Thêm, bớt hoặc chỉnh số lượng hạng mục bên dưới — giá cập nhật tức thì</p>
              <p className="text-white/30 text-[11px] sm:hidden">Chỉnh số lượng bên dưới</p>
              <button onClick={() => setShowCatalog(true)}
                className="flex items-center gap-1.5 bg-[#C9972A]/12 border border-[#C9972A]/30 text-[#C9972A] text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-full active:bg-[#C9972A]/20 hover:bg-[#C9972A]/20 transition flex-shrink-0"
              >
                <Plus size={13} /> Thêm hạng mục
              </button>
            </div>

            {/* ── Item groups ── */}
            <div className="space-y-2">
              {Object.entries(groupedItems).map(([group, gItems]) => (
                <div key={group} className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden">
                  <button onClick={() => toggleGroup(group)}
                    className="w-full flex items-center justify-between px-3.5 sm:px-5 py-3.5 sm:py-3.5 active:bg-white/4 hover:bg-white/4 transition"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-[13px] sm:text-sm font-bold text-white truncate">{group}</span>
                      <span className="text-[10px] sm:text-xs text-white/40 bg-white/6 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">{gItems.length} mục</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-[#C9972A] text-[13px] sm:text-sm font-bold">
                        {gItems.reduce((s, i) => s + i.unitPrice * i.qty, 0).toLocaleString("vi-VN")}đ
                      </span>
                      {collapsedGroups.has(group)
                        ? <ChevronDown size={16} className="text-white/40" />
                        : <ChevronUp size={16} className="text-white/40" />}
                    </div>
                  </button>

                  {!collapsedGroups.has(group) && (
                    <>
                      {/* ── Mobile card layout ── */}
                      <div className="sm:hidden border-t border-white/6 divide-y divide-white/5">
                        {gItems.map((item) => (
                          <div key={item.id} className="px-3.5 py-3 active:bg-white/3 transition">
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] text-white/85 font-medium leading-snug">{item.name}</div>
                                <div className="text-[11px] text-white/30 mt-0.5">{item.unitPrice.toLocaleString("vi-VN")}đ / {item.unit}</div>
                              </div>
                              <button onClick={() => removeItem(item.id)}
                                className="text-white/25 active:text-red-400 p-1.5 -mr-1.5 -mt-0.5 rounded-lg"
                              ><Trash2 size={15} /></button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => updateQty(item.id, -1)}
                                  className="w-9 h-9 rounded-xl bg-white/8 active:bg-white/15 transition flex items-center justify-center text-white/60"
                                ><Minus size={14} /></button>
                                <input
                                  type="number"
                                  value={item.qty}
                                  min={1}
                                  onChange={(e) => setQty(item.id, parseInt(e.target.value) || 0)}
                                  className="w-12 text-center bg-white/5 text-white text-sm font-semibold focus:outline-none focus:bg-white/10 rounded-xl py-2"
                                />
                                <button onClick={() => updateQty(item.id, 1)}
                                  className="w-9 h-9 rounded-xl bg-white/8 active:bg-white/15 transition flex items-center justify-center text-white/60"
                                ><Plus size={14} /></button>
                              </div>
                              <div className="text-white font-bold text-sm">
                                {(item.unitPrice * item.qty).toLocaleString("vi-VN")}đ
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ── Desktop table layout ── */}
                      <div className="hidden sm:block border-t border-white/6">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-white/4 text-white/40 uppercase tracking-wider">
                              <th className="text-left px-5 py-2 font-medium">Hạng mục</th>
                              <th className="text-right px-3 py-2 font-medium">Đơn giá</th>
                              <th className="text-center px-3 py-2 font-medium w-28">Số lượng</th>
                              <th className="text-right px-5 py-2 font-medium">Thành tiền</th>
                              <th className="w-8" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {gItems.map((item) => (
                              <tr key={item.id} className="group/row hover:bg-white/3 transition">
                                <td className="px-5 py-3 text-white/80">
                                  {item.name}
                                  <span className="text-white/25 ml-1">/ {item.unit}</span>
                                </td>
                                <td className="px-3 py-3 text-right text-white/40 whitespace-nowrap">
                                  {item.unitPrice.toLocaleString("vi-VN")}đ
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center justify-center gap-1">
                                    <button onClick={() => updateQty(item.id, -1)}
                                      className="w-7 h-7 rounded-md bg-white/8 hover:bg-white/12 transition flex items-center justify-center text-white/60"
                                    ><Minus size={11} /></button>
                                    <input
                                      type="number"
                                      value={item.qty}
                                      min={1}
                                      onChange={(e) => setQty(item.id, parseInt(e.target.value) || 0)}
                                      className="w-10 text-center bg-transparent text-white text-xs focus:outline-none focus:bg-white/8 rounded-md py-0.5"
                                    />
                                    <button onClick={() => updateQty(item.id, 1)}
                                      className="w-7 h-7 rounded-md bg-white/8 hover:bg-white/12 transition flex items-center justify-center text-white/60"
                                    ><Plus size={11} /></button>
                                  </div>
                                </td>
                                <td className="px-5 py-3 text-right text-white font-semibold whitespace-nowrap">
                                  {(item.unitPrice * item.qty).toLocaleString("vi-VN")}đ
                                </td>
                                <td className="pr-3">
                                  <button onClick={() => removeItem(item.id)}
                                    className="opacity-0 group-hover/row:opacity-100 transition text-white/25 hover:text-red-400"
                                  ><Trash2 size={13} /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* ── Bottom CTA ── */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6">
              <button onClick={downloadQuote}
                className="flex-1 border border-white/15 text-white/70 font-bold py-3.5 sm:py-4 rounded-2xl active:border-white/30 hover:border-white/30 active:text-white hover:text-white transition-all text-sm flex items-center justify-center gap-2"
              >
                <Download size={15} /> Tải báo giá
              </button>
              <button
                onClick={() => setStep("contact")}
                className="flex-[2] bg-[#C9972A] text-white font-bold py-3.5 sm:py-4 rounded-2xl active:bg-[#DBA93A] hover:bg-[#DBA93A] transition-all hover:shadow-[0_4px_20px_rgba(201,151,42,0.25)] text-sm flex items-center justify-center gap-2"
              >
                <Send size={15} /> Yêu cầu liên hệ
              </button>
            </div>
            <p className="text-white/20 text-[10px] text-center mt-2">* Giá cuối xác nhận sau khi tư vấn trực tiếp</p>
          </div>
          );
        })()}

        {/* ── STEP 3 ── */}
        {step === "contact" && (
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="md:col-span-2 bg-[#161616] border border-[#C9972A]/20 rounded-2xl shadow-sm p-4 sm:p-5">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="text-[11px] sm:text-xs text-white/40 mb-0.5">Tổng báo giá ({items.length} hạng mục)</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#C9972A]">{total.toLocaleString("vi-VN")}đ</p>
                </div>
                <button onClick={() => setStep("items")}
                  className="text-[11px] sm:text-xs text-white/40 border border-white/10 px-3 sm:px-4 py-2 rounded-full active:border-white/20 hover:border-white/20 transition"
                >
                  ← Chỉnh sửa hạng mục
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs text-white/40 mb-1.5 block">Họ và tên *</label>
              <input required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white text-[15px] sm:text-sm placeholder:text-white/20 focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[11px] sm:text-xs text-white/40 mb-1.5 block">Số điện thoại *</label>
              <input required value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="0901 234 567" inputMode="tel"
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white text-[15px] sm:text-sm placeholder:text-white/20 focus:border-[#C9972A] focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] sm:text-xs text-white/40 mb-1.5 block">Ghi chú thêm về dự án</label>
              <textarea value={contact.note} onChange={(e) => setContact({ ...contact, note: e.target.value })}
                rows={3} placeholder="Mô tả thêm ý tưởng, timeline, yêu cầu đặc biệt…"
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white text-[15px] sm:text-sm placeholder:text-white/20 focus:border-[#C9972A] focus:outline-none transition resize-none"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <button onClick={handleSubmit}
                disabled={loading || !contact.name || !contact.phone}
                className="w-full flex items-center justify-center gap-2 bg-[#C9972A] text-white font-bold py-4 rounded-2xl hover:bg-[#DBA93A] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Đang gửi…" : "Yêu cầu liên hệ"}
              </button>
              <button onClick={downloadQuote}
                className="w-full flex items-center justify-center gap-2 border border-white/15 text-white/60 font-semibold py-3.5 rounded-2xl hover:border-white/30 hover:text-white transition-all text-sm"
              >
                <Download size={15} /> Tải báo giá về máy
              </button>
              <p className="text-white/20 text-xs text-center">Team tư vấn phản hồi trong 2 giờ làm việc</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Catalog Drawer ── */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowCatalog(false)} />
          <div className="w-full sm:max-w-lg bg-[#111] border-l border-white/10 flex flex-col h-full">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/8 safe-top">
              <h3 className="font-bold text-white text-[15px] sm:text-base">Thêm hạng mục</h3>
              <button onClick={() => setShowCatalog(false)} className="text-white/40 active:text-white hover:text-white transition p-1 -mr-1">
                <X size={20} />
              </button>
            </div>
            <div className="px-4 sm:px-5 py-3 border-b border-white/6">
              <input
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Tìm kiếm hạng mục…"
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3 sm:py-2.5 text-[15px] sm:text-sm text-white placeholder:text-white/20 focus:border-[#C9972A] focus:outline-none transition"
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 overscroll-contain">
              {allGroups.filter((g) =>
                catalogSearch === "" || filteredCatalog.some((c) => c.group === g)
              ).map((group) => {
                const gItems = filteredCatalog.filter((c) => c.group === group);
                if (gItems.length === 0) return null;
                return (
                  <div key={group}>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider px-2 mb-2">{group}</div>
                    <div className="space-y-0.5">
                      {gItems.map((catItem) => {
                        const inList = items.find((i) => i.id === catItem.id);
                        return (
                          <button key={catItem.id} onClick={() => addFromCatalog(catItem)}
                            className="w-full flex items-center justify-between px-3 py-3 sm:py-2.5 rounded-xl active:bg-white/5 hover:bg-white/5 transition text-left group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] sm:text-sm text-white/80 transition truncate">{catItem.name}</div>
                              <div className="text-[12px] sm:text-xs text-white/35 mt-0.5">{catItem.unitPrice.toLocaleString("vi-VN")}đ / {catItem.unit}</div>
                            </div>
                            <div className={`flex-shrink-0 ml-3 w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition ${inList ? "bg-[#C9972A]/20 text-[#C9972A]" : "bg-white/8 text-white/35 group-hover:bg-white/12"}`}>
                              {inList ? <Check size={14} /> : <Plus size={14} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
