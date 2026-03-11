import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative bg-gradient-to-br from-[#1a1000] to-[#0d0d0d] border border-[#e8c547]/20 rounded-3xl p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8c547] to-transparent" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #e8c547 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Sẵn sàng bắt đầu<br />
              <span className="gradient-text">dự án của bạn?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Nhận báo giá trong vòng 2 giờ. Không phức tạp, không ràng buộc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-[#e8c547] text-black font-bold px-8 py-4 rounded-full hover:bg-[#f5d060] transition-all hover:shadow-[0_0_30px_rgba(232,197,71,0.5)] text-base"
              >
                Báo giá ngay
                <ArrowRight size={18} />
              </Link>
              <a
                href="tel:0901234567"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full hover:border-white/50 transition-all text-base"
              >
                <Phone size={18} />
                0901 234 567
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
