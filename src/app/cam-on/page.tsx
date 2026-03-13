"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone } from "lucide-react";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      // Google Ads conversion tag (page load)
      (window as any).gtag("event", "conversion", {
        send_to: "AW-18010717244/GBtoCLTCoIccELz4loxD",
      });
      // GA4-linked conversion event
      (window as any).gtag("event", "conversion_event_request_quote");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 pt-20 pb-32">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-emerald-400" />
        </div>
        <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-3">
          Cảm ơn bạn!
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8">
          Chúng tôi đã nhận được yêu cầu báo giá của bạn.<br />
          Đội ngũ <span className="text-[#C9972A] font-semibold">Bình An Media</span> sẽ phản hồi trong vòng <strong className="text-white">2 giờ</strong>.
        </p>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-8 text-left">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Liên hệ trực tiếp</p>
          <a href="tel:0969427639" className="flex items-center gap-3 text-white hover:text-[#C9972A] transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#C9972A]/15 flex items-center justify-center flex-shrink-0">
              <Phone size={15} className="text-[#C9972A]" />
            </div>
            <div>
              <p className="font-bold text-base">0969 427 639</p>
              <p className="text-white/40 text-xs">Ông Đinh Công Hiếu — Giám đốc</p>
            </div>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-white/12 text-white/60 px-5 py-3 rounded-full hover:border-white/25 hover:text-white transition text-sm font-medium"
          >
            Về trang chủ
          </Link>
          <Link
            href="/showreel"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9972A] text-black font-bold px-5 py-3 rounded-full hover:bg-[#DBA93A] transition text-sm"
          >
            Xem portfolio <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
