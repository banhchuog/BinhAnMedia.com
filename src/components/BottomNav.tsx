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

  return (
    <nav className="sm:hidden fixed bottom-5 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-stretch bg-[#141414]/95 backdrop-blur-xl border border-white/12 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden h-[58px]">
        {tabs.map(({ href, label, Icon }, idx) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-7 transition-colors
                ${active ? "text-[#C9972A]" : "text-white/40 active:text-white/70"}
                ${idx > 0 ? "border-l border-white/8" : ""}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C9972A] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
