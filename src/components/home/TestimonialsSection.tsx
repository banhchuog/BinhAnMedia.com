import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thị Hà",
    role: "Marketing Director – Vinamilk",
    content: "Bình An Production hiểu đúng insight thương hiệu. TVC Tết năm nay vượt 10M views chỉ sau 3 ngày đăng.",
    rating: 5,
  },
  {
    name: "Trần Minh Quân",
    role: "Nghệ sĩ độc lập",
    content: "MV của tôi được đầu tư hình ảnh đẹp đến mức không tưởng với mức ngân sách hợp lý. Team rất chuyên nghiệp.",
    rating: 5,
  },
  {
    name: "Lê Thanh Sơn",
    role: "CEO – FPT Software",
    content: "Corporate film chúng tôi dùng để pitch đối tác quốc tế. Phản hồi rất tốt. Sẽ tiếp tục hợp tác dài hạn.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#e8c547] text-sm font-medium tracking-widest uppercase mb-3">Khách hàng nói gì</p>
          <h2 className="text-4xl font-black text-white">Tin tưởng từ thực tế</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#e8c547] fill-[#e8c547]" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.content}"</p>
              <div>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
