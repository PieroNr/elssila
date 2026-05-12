"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cabinet, neima } from "@/lib/fonts";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="pb-2">
      <header className="flex items-center justify-between">
        <Link href="/" className={`${neima.className} text-2xl uppercase italic text-fg transition-opacity hover:opacity-70`}>
          Elssila
        </Link>

        <nav className={`${cabinet.className} flex gap-8 text-xs font-medium tracking-[0.16em] uppercase`}>
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`relative inline-flex items-center gap-1.5 transition-colors duration-200 ${
                  isActive ? "text-fg" : "text-fg-3 hover:text-fg"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="inline-block h-1 w-1 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto mt-4 h-[0.5px] w-full bg-[var(--color-separator)]" />
    </div>
  );
}
