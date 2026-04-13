// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cabinet, neima } from "@/lib/fonts";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="pb-2">
      <header className="flex items-center justify-between">
        <Link href="/" className={`${neima.className} text-2xl uppercase`}>
          Elssila
        </Link>

        <nav className={`${cabinet.className} flex gap-8 text-base font-medium tracking-[0.16em] uppercase`}>
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-[#d9772c] align-middle" />
                )}
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto mt-4 h-[0.5px] w-full bg-black/70" />
    </div>
  );
}
