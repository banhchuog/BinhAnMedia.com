import Link from "next/link";
import { Check, Star } from "lucide-react";

const highlights = [
  {
    category: "TVC",
    tag: "Phổ biến nhất",
    tagColor: "bg-orange-500",
    name: "Combo TVC Standard",
    price: "35.000.000",
    features: ["Kịch bản + Storyboard", "2 ngày quay Studio", "4K Full Package", "Color grading", "Nhạc nền bản quyền", "Giao trong 10 ngày"],
  },
  {
    category: "MV",
    tag: "Best Value",
    tagColor: "bg-purple-500",
    name: "Combo MV Premium",
    price: "85.000.000",
    features: ["Concept & Art Direction", "3 ngày quay ngoại cảnh", "2 Camera + Drone", "Color grading cinematic", "Mixing & Mastering âm thanh", "Giao trong 21 ngày"],
  },
  {
    category: "Doanh nghiệp",
    tag: "Chuyên nghiệp",
    tagColor: "bg-blue-500",
    name: "Combo Corporate Pro",
    price: "45.000.000",
    features: ["Phỏng vấn lãnh đạo", "Ghi hình nhà máy/văn phòng", "Motion graphics logo", "Lồng tiếng chuyên nghiệp", "Phụ đề 2 ngôn ngữ", "Giao trong 14 ngày"],
  },
];

export default function ComboHighlight() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#e8c547] text-sm font-medium tracking-widest uppercase mb-3">
            Bảng giá combo
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Combo được thiết kế tối ưu cho từng nhu cầu. Tiết kiệm 20–30% so với báo giá từng hạng mục.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {highlights.map((pkg) => (
            <div
              key={pkg.name}
              className="relative border border-white/10 rounded-2xl p-6 bg-[#111] hover:border-[#e8c547]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,197,71,0.1)] group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{pkg.category}</span>
                <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${pkg.tagColor}`}>{pkg.tag}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{pkg.name}</h3>
              <div className="mb-5">
                <span className="text-3xl font-black gradient-text">{pkg.price}</span>
                <span className="text-gray-400 text-sm ml-1">đ</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check size={15} className="text-[#e8c547] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/packages"
                className="block text-center border border-[#e8c547]/40 text-[#e8c547] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e8c547] hover:text-black transition-all duration-200 group-hover:bg-[#e8c547] group-hover:text-black"
              >
                Chọn gói này
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Không tìm thấy gói phù hợp?</p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-[#e8c547] text-black font-bold px-6 py-3 rounded-full hover:bg-[#f5d060] transition-all text-sm hover:shadow-[0_0_20px_rgba(232,197,71,0.4)]"
          >
            <Star size={16} />
            Báo giá theo yêu cầu riêng
          </Link>
        </div>
      </div>
    </section>
  );
}
