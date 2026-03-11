import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://binhanmedia.vn";
const SITE_NAME = "Bình An Media";
const TITLE_DEFAULT = "Bình An Media | Sản xuất TVC · MV · Phim doanh nghiệp · Video quảng cáo";
const DESCRIPTION = "Bình An Media — Đơn vị sản xuất video chuyên nghiệp tại Việt Nam: TVC quảng cáo, MV ca nhạc, phim doanh nghiệp, content mạng xã hội. Báo giá minh bạch, giao hàng đúng hẹn. 200+ dự án hoàn thành, 12+ năm kinh nghiệm.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "sản xuất video", "production house", "TVC quảng cáo", "MV ca nhạc",
    "phim doanh nghiệp", "video marketing", "quay phim", "hậu kỳ",
    "content social", "video Reels TikTok", "báo giá quay phim",
    "Bình An Media", "video quảng cáo", "phim giới thiệu công ty",
    "recap sự kiện", "livestream sự kiện", "sản xuất phim Việt Nam",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Bình An Media — Sản xuất video chuyên nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

// JSON-LD Organization + VideoProductionCompany structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoProductionCompany",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-192.png`,
  description: DESCRIPTION,
  foundingDate: "2014",
  founder: {
    "@type": "Person",
    name: "Đinh Công Hiếu",
    jobTitle: "Founder & Đạo diễn",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hồ Chí Minh",
    addressCountry: "VN",
  },
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dịch vụ sản xuất video",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TVC & Quảng cáo" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "MV Ca nhạc" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Phim doanh nghiệp" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social Content" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event & Livestream" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motion & Animation" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F2F2F7] text-[#1C1C1E] antialiased" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

