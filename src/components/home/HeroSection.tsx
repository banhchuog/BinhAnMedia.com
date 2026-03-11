import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200] via-[#0a0a0a] to-[#0a0a10]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#e8c547 1px, transparent 1px), linear-gradient(90deg, #e8c547 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e8c547]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#e8c547]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 border border-[#e8c547]/30 bg-[#e8c547]/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-[#e8c547] rounded-full animate-pulse" />
          <span className="text-[#e8c547] text-xs font-medium tracking-wider uppercase">
            Đang nhận dự án Quý 2 / 2026
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          <span className="text-white">Biến ý tưởng</span>
          <br />
          <span className="gradient-text">thành thước phim</span>
          <br />
          <span className="text-white">đáng nhớ</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Bình An Production — chuyên sản xuất TVC, MV, phim doanh nghiệp và
          content mạng xã hội. Báo giá minh bạch, giao hàng đúng hẹn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-[#e8c547] text-black font-bold px-8 py-4 rounded-full hover:bg-[#f5d060] transition-all duration-200 hover:shadow-[0_0_30px_rgba(232,197,71,0.5)] text-base"
          >
            Nhận báo giá ngay
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full hover:border-white/50 transition-all duration-200 text-base group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
              <Play size={14} className="ml-0.5" />
            </div>
            Xem showreel
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center items-center opacity-40">
          {["Vinamilk", "Shopee", "Grab", "VinGroup", "Heineken", "Samsung"].map((b) => (
            <span key={b} className="text-white font-bold text-sm tracking-wider">{b}</span>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-3 tracking-wider">ĐÃ TIN TƯỞNG HỢP TÁC</p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#e8c547] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
