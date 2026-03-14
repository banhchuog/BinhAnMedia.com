"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/showreel", label: "Showreel" },
  { href: "/quote", label: "Báo giá" },
];

const serviceLinks = [
  { href: "/dich-vu/quay-tvc", label: "Quay TVC" },
  { href: "/dich-vu/quay-mv", label: "Quay MV" },
  { href: "/dich-vu/phim-doanh-nghiep", label: "Phim doanh nghiệp" },
  { href: "/dich-vu/recap-su-kien", label: "Recap sự kiện" },
  { href: "/dich-vu/goi-social-video", label: "Gói Social 10+ video" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/92 backdrop-blur-2xl border-b border-white/8 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[56px]">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-0.5 select-none">
          <span className="font-black text-[15px] tracking-[-0.03em] transition-colors text-white">BinhAn</span><span className="font-black text-[15px] tracking-[-0.03em] text-[#C9972A]">Media</span><span className="font-semibold text-[11px] text-[#C9972A]/70 tracking-[-0.01em]">.com</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-[13px] font-medium px-3.5 py-2 rounded-xl transition-colors tracking-[-0.01em] ${
                  pathname === l.href
                    ? "text-white bg-white/12"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {/* Dịch vụ dropdown */}
          <li ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 text-[13px] font-medium px-3.5 py-2 rounded-xl transition-colors tracking-[-0.01em] ${
                pathname.startsWith("/dich-vu") ? "text-white bg-white/12" : "text-white/60 hover:text-white"
              }`}
            >
              Dịch vụ <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl py-1.5 shadow-xl z-50">
                {serviceLinks.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/6 transition-colors tracking-[-0.01em]"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/quote"
            className="bg-[#C9972A] text-white font-semibold text-[13px] px-4 py-2 rounded-full hover:bg-[#B8841E] transition-colors tracking-[-0.01em]"
          >
            Nhận báo giá
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-white hover:bg-white/10 active:bg-white/15 -mr-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A0A0A]/96 backdrop-blur-2xl border-t border-white/8 px-4 py-3 flex flex-col gap-0.5">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/80 font-medium px-3 py-3 rounded-xl hover:bg-white/8 transition-colors tracking-[-0.01em] active:bg-white/12"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-1 mt-0.5 border-t border-white/8">
            <p className="px-3 pt-2 pb-1 text-[11px] text-white/30 uppercase tracking-widest">Dịch vụ</p>
            {serviceLinks.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-white/60 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors tracking-[-0.01em]"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 mt-1 border-t border-white/8">
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="block text-center bg-[#C9972A] text-white font-semibold text-sm px-4 py-3 rounded-full hover:bg-[#DBA93A] transition-colors"
            >
              Nhận báo giá
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
