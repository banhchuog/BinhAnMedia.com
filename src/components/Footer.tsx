"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Youtube, Instagram, Facebook } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/proposal") return null;
  return (
    <footer className="bg-[#F0ECE3] border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-baseline gap-0.5 mb-4 select-none">
              <span className="font-black text-[17px] tracking-[-0.03em] text-[#1F241E]">BinhAn</span><span className="font-black text-[17px] tracking-[-0.03em] text-[#C9972A]">Media</span><span className="font-semibold text-[12px] text-[#C9972A]/70 tracking-[-0.01em]">.com</span>
            </Link>
            <p className="text-[#6F746A] text-sm leading-relaxed mb-5">
              Đơn vị sản xuất video chuyên nghiệp. Mỗi khung hình là một câu chuyện.
            </p>
            <div className="flex gap-2">
              {([
                { Icon: Youtube, label: "YouTube", href: "#" },
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Facebook, label: "Facebook Bình An Media", href: "https://www.facebook.com/doublecfilm" },
                { Icon: Facebook, label: "Facebook Founder", href: "https://www.facebook.com/dinhconghieu.film/" },
              ]).map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-black/10 bg-white/45 flex items-center justify-center text-[#8A8F83] hover:border-[#C9972A] hover:text-[#C9972A] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav + Contact */}
          <div className="flex flex-wrap gap-12">
            <div>
              <h4 className="font-semibold text-[#1F241E] mb-4 text-sm">Trang</h4>
              <ul className="space-y-2.5 text-sm text-[#6F746A]">
                {[{href:"/",label:"Trang chủ"},{href:"/showreel",label:"Showreel"},{href:"/quote",label:"Báo giá"}].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[#C9972A] transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1F241E] mb-4 text-sm">Dịch vụ</h4>
              <ul className="space-y-2.5 text-sm text-[#6F746A]">
                {[
                  {href:"/dich-vu/quay-tvc",label:"Quay TVC"},
                  {href:"/dich-vu/quay-mv",label:"Quay MV"},
                  {href:"/dich-vu/phim-doanh-nghiep",label:"Phim doanh nghiệp"},
                  {href:"/dich-vu/recap-su-kien",label:"Recap sự kiện"},
                  {href:"/dich-vu/goi-social-video",label:"Gói Social 10+ video"},
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[#C9972A] transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1F241E] mb-4 text-sm">Liên hệ</h4>
              <ul className="space-y-2.5 text-sm text-[#6F746A]">
                <li className="flex gap-2 items-center"><Phone size={13} className="text-[#C9972A] flex-shrink-0" /><a href="tel:0969427639" className="hover:text-[#C9972A] transition-colors">0969 427 639</a></li>
                <li className="flex gap-2 items-center"><Mail size={13} className="text-[#C9972A] flex-shrink-0" /><a href="mailto:Dinhconghieufilm@gmail.com" className="hover:text-[#C9972A] transition-colors">Dinhconghieufilm@gmail.com</a></li>
                <li className="flex gap-2 items-start"><MapPin size={13} className="text-[#C9972A] flex-shrink-0 mt-0.5" />
                  <span>Trụ sở: 63 Tôn Đức Thắng, Phường Trị An, thành phố Đồng Nai</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-black/8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#8A8F83]">
          <p>© 2026 Bình An Media. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#1F241E] transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-[#1F241E] transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
