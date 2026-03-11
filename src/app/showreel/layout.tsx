import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Showreel — Dự án nổi bật",
  description:
    "Xem các dự án TVC, MV ca nhạc, phim doanh nghiệp, video quảng cáo tiêu biểu của Bình An Media. Portfolio với hơn 200 dự án hoàn thành cho các thương hiệu lớn.",
  alternates: {
    canonical: "/showreel",
  },
  openGraph: {
    title: "Showreel — Dự án nổi bật | Bình An Media",
    description:
      "Xem các dự án TVC, MV ca nhạc, phim doanh nghiệp tiêu biểu của Bình An Media.",
  },
};

export default function ShowreelLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
