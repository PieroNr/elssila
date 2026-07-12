"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cabinet, neima } from "@/lib/fonts";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="pb-2">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className={`${neima.className} text-2xl uppercase italic text-fg transition-opacity hover:opacity-70`}
        >
          Elssila
        </Link>

        {/* Desktop nav */}
        <nav className={`${cabinet.className} hidden gap-8 text-xs font-medium tracking-[0.16em] uppercase md:flex`}>
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

        {/* Mobile burger */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative z-[80] flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <motion.span
            className="block h-[1px] w-5 origin-center bg-fg"
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.span
            className="block h-[1px] w-5 bg-fg"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-[1px] w-5 origin-center bg-fg"
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
          />
        </button>
      </header>

      <div className="mx-auto mt-4 h-[0.5px] w-full bg-[var(--color-separator)]" />

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`${cabinet.className} fixed inset-x-0 top-0 z-[70] flex flex-col bg-page/95 px-6 pt-20 pb-8 backdrop-blur-md md:hidden`}
            style={{ borderBottom: "0.5px solid var(--color-separator)" }}
          >
            {navLinks.map(({ label, href }, i) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between border-b py-5 text-2xl font-medium tracking-tight transition-colors ${
                      isActive ? "text-accent" : "text-fg"
                    }`}
                    style={{ borderColor: "var(--color-separator)" }}
                  >
                    <span className={`${neima.className} italic`}>{label}</span>
                    <span className="text-fg-4 text-base">↗</span>
                  </Link>
                </motion.div>
              );
            })}
            <div className="mt-8 text-xs tracking-[0.2em] uppercase text-fg-4">
              ELSSILA · 2026
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
