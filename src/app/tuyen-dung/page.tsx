"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send, Loader2, MapPin, Clock, Video, FileText,
  CheckCircle, ChevronRight, Briefcase, Users, Zap, Monitor,
} from "lucide-react";

const INTERVIEW_SLOTS = [
  { id: "slot1", day: "Thứ 2 – Thứ 6", time: "09:00 – 10:00", label: "Buổi sáng" },
  { id: "slot2", day: "Thứ 2 – Thứ 6", time: "14:00 – 15:00", label: "Buổi chiều" },
  { id: "slot3", day: "Thứ 7", time: "10:00 – 11:00", label: "Cuối tuần" },
];

const PROCESS_STEPS = [
  { icon: FileText, title: "Gửi hồ sơ", desc: "Điền thông tin, gắn CV & showreel" },
  { icon: Users, title: "Xét duyệt", desc: "Công ty xem hồ sơ trong 1–2 ngày" },
  { icon: Video, title: "Phỏng vấn online", desc: "Zalo video call theo lịch đã chọn" },
  { icon: CheckCircle, title: "Kết quả", desc: "Thông báo kết quả qua Zalo" },
];

export default function RecruitmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cvLink: "",
    showreelLink: "",
    selectedSlots: [] as string[],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSlot = (slotId: string) => {
    setForm((prev) => ({
      ...prev,
      selectedSlots: prev.selectedSlots.includes(slotId)
        ? prev.selectedSlots.filter((s) => s !== slotId)
        : [...prev.selectedSlots, slotId],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Số điện thoại không hợp lệ";
    if (!form.showreelLink.trim()) e.showreelLink = "Vui lòng gắn link showreel";
    if (form.selectedSlots.length === 0) e.slots = "Vui lòng chọn ít nhất 1 khung giờ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const slotLabels = form.selectedSlots.map((id) => {
        const s = INTERVIEW_SLOTS.find((sl) => sl.id === id);
        return s ? `${s.day} ${s.time}` : id;
      });
      await fetch("/api/recruitment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selectedSlots: slotLabels }),
      });
      router.push("/cam-on");
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9972A] text-xs font-semibold tracking-[0.15em] uppercase mb-4">
            Tuyển dụng
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-black text-white tracking-[-0.03em] leading-tight mb-4">
            Tuyển Dựng Phim (Video Editor)
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Bình An Media đang tìm kiếm editor tài năng, đam mê kể chuyện bằng hình ảnh.
            Gia nhập đội ngũ sản xuất video chuyên nghiệp tại TP.HCM.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT — JD + Location */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Briefcase size={18} className="text-[#C9972A]" /> Mô tả công việc
              </h2>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Dựng phim hoàn chỉnh từ footage thô: TVC, MV, phim doanh nghiệp, recap sự kiện</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Chỉnh màu (color grading) theo phong cách từng dự án</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Thêm hiệu ứng, motion graphics, text animation khi cần</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Làm việc trực tiếp với đạo diễn để đảm bảo vision sản phẩm</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Export & bàn giao file chuẩn broadcast / digital platform</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Quản lý footage, media asset gọn gàng, có hệ thống</li>
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Zap size={18} className="text-[#C9972A]" /> Yêu cầu
              </h2>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Thành thạo <strong className="text-white/80">Adobe Premiere Pro</strong> hoặc <strong className="text-white/80">DaVinci Resolve</strong></li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Có kiến thức về color grading (LUT, node-based color)</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Biết cơ bản After Effects / Motion Graphics là lợi thế</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Có showreel hoặc portfolio thể hiện khả năng dựng phim</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Cảm nhận tốt về nhịp phim, âm nhạc, storytelling</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Có máy tính cá nhân cấu hình đủ dựng 4K là lợi thế</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Monitor size={18} className="text-[#C9972A]" /> Quyền lợi
              </h2>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Lương thoả thuận theo năng lực, review định kỳ</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Được tham gia các dự án TVC, MV lớn, có tên trong credit</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Môi trường trẻ, sáng tạo, không gò bó</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Làm việc tại căn hộ studio Vinhomes Grand Park — tiện ích đầy đủ</li>
                <li className="flex gap-2.5"><span className="text-[#C9972A] mt-0.5">•</span>Cơ hội học hỏi từ đạo diễn & quay phim chuyên nghiệp</li>
              </ul>
            </div>

            {/* Location */}
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#C9972A]" /> Địa điểm làm việc
              </h2>
              <p className="text-white/60 text-sm mb-4">
                <strong className="text-white/80">S3.03 Vinhomes Grand Park</strong>, Nguyễn Xiển, Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM
              </p>
              <a
                href="https://maps.app.goo.gl/v6iyXPa1RedXixZZA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9972A] text-sm font-medium hover:underline"
              >
                <MapPin size={14} /> Xem trên Google Maps
              </a>
              <div className="mt-4 rounded-xl overflow-hidden border border-white/8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8552246863175!2d106.83!3d10.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175275cf5b40d5d%3A0x51c4fa04e08a1dbb!2sVinhomes%20Grand%20Park!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vinhomes Grand Park"
                />
              </div>
            </div>

            {/* Process */}
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={18} className="text-[#C9972A]" /> Quy trình tuyển dụng
              </h2>
              <div className="flex flex-col gap-0">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#C9972A]/15 border border-[#C9972A]/30 flex items-center justify-center flex-shrink-0">
                        <step.icon size={16} className="text-[#C9972A]" />
                      </div>
                      {i < PROCESS_STEPS.length - 1 && (
                        <div className="w-px h-8 bg-white/10 my-1" />
                      )}
                    </div>
                    <div className="pt-2 pb-4">
                      <p className="text-white font-semibold text-sm">{step.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white/4 border border-white/8 rounded-xl p-4">
                <p className="text-white/50 text-xs leading-relaxed">
                  <strong className="text-white/70">Lưu ý:</strong> Phỏng vấn online qua <strong className="text-white/70">Zalo video call</strong>. 
                  Sau khi xem hồ sơ, công ty sẽ nhắn tin qua Zalo để xác nhận lịch phỏng vấn cụ thể dựa trên khung giờ bạn đã chọn.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Application Form */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-1">Ứng tuyển ngay</h2>
              <p className="text-white/40 text-xs mb-5">Vị trí: Dựng phim (Video Editor)</p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9972A]/50 transition"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Số điện thoại (Zalo) *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0xxx xxx xxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9972A]/50 transition"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* CV Link */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Link CV (Google Drive / PDF)</label>
                  <input
                    type="url"
                    value={form.cvLink}
                    onChange={(e) => setForm({ ...form, cvLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9972A]/50 transition"
                  />
                </div>

                {/* Showreel Link */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Link Showreel / Portfolio *</label>
                  <input
                    type="url"
                    value={form.showreelLink}
                    onChange={(e) => setForm({ ...form, showreelLink: e.target.value })}
                    placeholder="https://youtube.com/... hoặc link portfolio"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9972A]/50 transition"
                  />
                  {errors.showreelLink && <p className="text-red-400 text-xs mt-1">{errors.showreelLink}</p>}
                </div>

                {/* Interview Time Slots */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">Khung giờ phỏng vấn khả thi *</label>
                  <p className="text-white/30 text-[11px] mb-2">Chọn 1 hoặc nhiều khung giờ bạn có thể tham gia</p>
                  <div className="space-y-2">
                    {INTERVIEW_SLOTS.map((slot) => {
                      const selected = form.selectedSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => toggleSlot(slot.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                            selected
                              ? "border-[#C9972A]/50 bg-[#C9972A]/10"
                              : "border-white/10 bg-white/3 hover:border-white/20"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                            selected ? "border-[#C9972A] bg-[#C9972A]" : "border-white/20"
                          }`}>
                            {selected && <CheckCircle size={12} className="text-black" />}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${selected ? "text-white" : "text-white/60"}`}>
                              {slot.label} — {slot.time}
                            </p>
                            <p className="text-white/30 text-[11px]">{slot.day}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.slots && <p className="text-red-400 text-xs mt-1">{errors.slots}</p>}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Ghi chú thêm</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Kinh nghiệm, phần mềm sử dụng, câu hỏi..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9972A]/50 transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#C9972A] text-black font-bold py-3.5 rounded-full hover:bg-[#DBA93A] transition disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} /> Gửi hồ sơ ứng tuyển
                    </>
                  )}
                </button>

                <p className="text-white/25 text-[11px] text-center leading-relaxed">
                  Phỏng vấn online qua Zalo video call. Công ty sẽ nhắn Zalo để xác nhận lịch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
