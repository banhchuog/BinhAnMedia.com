import Link from "next/link";

const projects = [
  { title: "TVC Vinamilk – Tết 2025", category: "TVC", thumb: "bg-gradient-to-br from-orange-900 to-red-900" },
  { title: "MV 'Bình Yên' – Hà Anh Tuấn", category: "MV", thumb: "bg-gradient-to-br from-purple-900 to-indigo-900" },
  { title: "Corporate Film – FPT Software", category: "Doanh nghiệp", thumb: "bg-gradient-to-br from-blue-900 to-cyan-900" },
  { title: "TikTok Series – Grab Food", category: "Social Content", thumb: "bg-gradient-to-br from-green-900 to-teal-900" },
  { title: "Event Highlight – VinFast Launch", category: "Event", thumb: "bg-gradient-to-br from-yellow-900 to-orange-900" },
  { title: "Explainer – Be App", category: "Motion Graphics", thumb: "bg-gradient-to-br from-pink-900 to-rose-900" },
];

export default function PortfolioSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-[#e8c547] text-sm font-medium tracking-widest uppercase mb-3">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Dự án nổi bật</h2>
          </div>
          <Link href="/portfolio" className="text-gray-400 hover:text-[#e8c547] transition-colors text-sm">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`${p.thumb} ${i === 0 ? "h-72" : "h-52"} w-full`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-xs font-semibold text-[#e8c547] uppercase tracking-wider">{p.category}</span>
                <h3 className="text-white font-bold mt-1">{p.title}</h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-[#e8c547] flex items-center justify-center">
                  <span className="text-black text-xl ml-1">▶</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
