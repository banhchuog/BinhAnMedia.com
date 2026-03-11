import Link from "next/link";
import { Tv, Music, Building2, Smartphone, Mic, Layers } from "lucide-react";

const services = [
  {
    icon: Tv,
    title: "TVC / Quảng cáo",
    desc: "Quảng cáo truyền hình và digital. Kể câu chuyện thương hiệu chỉ trong 15–60 giây.",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
  },
  {
    icon: Music,
    title: "MV Ca nhạc",
    desc: "Sản xuất MV chuyên nghiệp, từ indie đến mainstream. Hình ảnh đẹp, kể chuyện cảm xúc.",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
  },
  {
    icon: Building2,
    title: "Phim doanh nghiệp",
    desc: "Corporate film, giới thiệu công ty, sản phẩm, tuyển dụng. Chuyên nghiệp và uy tín.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
  },
  {
    icon: Smartphone,
    title: "Content Social Media",
    desc: "Reels, TikTok, YouTube Shorts. Nội dung viral, tối ưu cho từng nền tảng.",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
  },
  {
    icon: Mic,
    title: "Event & Livestream",
    desc: "Ghi hình sự kiện, hội nghị, ra mắt sản phẩm. Livestream multi-camera chuyên nghiệp.",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/30",
  },
  {
    icon: Layers,
    title: "Motion Graphics",
    desc: "Infographic, animation, explainer video, logo sting. Đẹp mắt và dễ hiểu.",
    color: "from-red-500/20 to-pink-500/20",
    border: "border-red-500/30",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#e8c547] text-sm font-medium tracking-widest uppercase mb-3">
            Dịch vụ của chúng tôi
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Chúng tôi làm được gì?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Từ kịch bản đến hậu kỳ — một quy trình khép kín, một đội ngũ chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className={`p-6 rounded-2xl bg-gradient-to-br ${s.color} border ${s.border} hover:scale-105 transition-transform duration-300 cursor-pointer group`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition">
                <s.icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full hover:border-[#e8c547] hover:text-[#e8c547] transition-all duration-200 text-sm"
          >
            Xem tất cả dịch vụ →
          </Link>
        </div>
      </div>
    </section>
  );
}
