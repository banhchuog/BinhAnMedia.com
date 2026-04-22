"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calculator, Film } from "lucide-react";

const tabs = [
  { href: "/",          label: "Trang chủ", Icon: Home       },
  { href: "/quote",     label: "Báo giá",   Icon: Calculator },
  { href: "/showreel",  label: "Showreel",  Icon: Film       },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/proposal") return null;

  return (
    <nav className="sm:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 bg-[#161616]/96 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/70 px-2 py-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-full transition-all
                ${active
                  ? "bg-[#C9972A]/15 text-[#C9972A]"
                  : "text-white/40 active:bg-white/8 active:text-white/70"
                }`}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold tracking-wide leading-none ${active ? "text-[#C9972A]" : "text-white/35"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
