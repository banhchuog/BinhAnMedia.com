"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";

export default function ThankYouRecruitmentPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 pt-20 pb-32">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-emerald-400" />
        </div>
        <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-3">
          Đã nhận hồ sơ!
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8">
          Cảm ơn bạn đã ứng tuyển vào <span className="text-[#C9972A] font-semibold">Bình An Media</span>.<br />
          Chúng tôi sẽ xem xét hồ sơ và phản hồi qua <strong className="text-white">Zalo</strong> trong vòng <strong className="text-white">1–2 ngày</strong>.
        </p>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-8 text-left">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Các bước tiếp theo</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#C9972A]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#C9972A] text-xs font-bold">1</span>
              </div>
              <p className="text-white/60 text-sm">Công ty xem hồ sơ & showreel của bạn</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#C9972A]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#C9972A] text-xs font-bold">2</span>
              </div>
              <p className="text-white/60 text-sm">Nếu phù hợp, nhắn tin qua Zalo để xác nhận lịch phỏng vấn</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#C9972A]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#C9972A] text-xs font-bold">3</span>
              </div>
              <p className="text-white/60 text-sm">Phỏng vấn online qua Zalo video call</p>
            </div>
          </div>
        </div>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-8 text-left">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Lưu ý</p>
          <div className="flex items-start gap-3">
            <MessageCircle size={16} className="text-[#C9972A] flex-shrink-0 mt-0.5" />
            <p className="text-white/50 text-sm leading-relaxed">
              Hãy đảm bảo <strong className="text-white/70">Zalo</strong> của bạn đang hoạt động với số điện thoại đã đăng ký để công ty có thể liên hệ.
            </p>
          </div>
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
