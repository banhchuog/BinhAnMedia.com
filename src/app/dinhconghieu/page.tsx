import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đinh Công Hiếu — Đạo diễn",
  description:
    "Hồ sơ năng lực đạo diễn Đinh Công Hiếu — phiên bản capability profile từ Anh Em Phim.",
};

export default function DinhCongHieuPage() {
  return (
    <main className="min-h-screen bg-black">
      <iframe
        src="/dinhconghieu-profile.html"
        title="Hồ sơ năng lực Đinh Công Hiếu"
        className="block h-screen w-full border-0"
      />
    </main>
  );
}
