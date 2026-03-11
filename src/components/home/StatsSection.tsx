const stats = [
  { value: "200+", label: "Dự án hoàn thành" },
  { value: "8+", label: "Năm kinh nghiệm" },
  { value: "150+", label: "Khách hàng tin tưởng" },
  { value: "15", label: "Giải thưởng ngành" },
];

export default function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
