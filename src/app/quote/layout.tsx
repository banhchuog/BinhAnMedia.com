import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Báo giá sản xuất video",
  description:
    "Tạo báo giá chi tiết cho dự án video: TVC, MV, phim doanh nghiệp, content social, recap sự kiện. Minh bạch từng hạng mục, phản hồi trong 2 giờ.",
  alternates: {
    canonical: "/quote",
  },
  openGraph: {
    title: "Báo giá sản xuất video | Bình An Media",
    description:
      "Tạo báo giá chi tiết cho dự án video — minh bạch, không ràng buộc, phản hồi trong 2 giờ.",
  },
};

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
