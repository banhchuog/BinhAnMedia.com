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
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 safe-area-pb">
      <div className="flex items-stretch h-[60px]">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
                ${active ? "text-[#C9972A]" : "text-white/40 active:text-white/80"}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#C9972A] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
