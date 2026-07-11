"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { useTheme } from "@/lib/theme";
import { useLiteMode } from "@/lib/lite-mode";
import { Reveal } from "@/components/ui/Reveal";

const BlobScene = dynamic(() => import("@/components/three/BlobScene"), { ssr: false });

// Mock-aligned chip lists per service.
const CHIPS: Record<string, string[]> = {
  "01": ["Brand", "Strategy", "Editorial"],
  "02": ["Photo", "Film", "Motion"],
  "03": ["Web", "WebGL", "Interactive"],
  "04": ["Editorial", "Social", "Copy"],
};

export default function HomeServices() {
  const { theme } = useTheme();
  const lite = useLiteMode();
  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";
  const sectionRef = useRef<HTMLElement>(null);
  const [blobVisible, setBlobVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setBlobVisible(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--color-separator)] px-6 py-16 md:px-16 md:py-32"
    >
      {/* Blob background — fades in when section enters viewport */}
      {!lite && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: blobVisible ? 0.85 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <BlobScene wireframeColor={wireframeColor} isDark={theme === "dark"} />
        </motion.div>
      )}
      {/* Page tint to soften the blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-page opacity-55"
      />

      <div className="relative z-[1] mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <span className="micro text-fg-3">⌗ Services</span>
          </div>
          <div className="hairline mt-3" />
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex items-end justify-between">
          <h2
            className="font-display"
            style={{ fontSize: "clamp(64px, 9vw, 128px)", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}
          >
            <span className="italic-display">Services</span>
            <span className="text-accent">.</span>
          </h2>
          <Link href="/services" className="micro pb-3 text-fg-2 transition-colors hover:text-accent">
            Tous les services →
          </Link>
        </Reveal>

        {/* Desktop: vertical list */}
        <ul className="mt-10 hidden md:mt-14 md:block">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.07} className={i === 0 ? "border-t border-[var(--color-separator)]" : undefined}>
              <Link
                href="/services"
                className="srow group grid items-baseline gap-8 border-b border-[var(--color-separator)] py-8 transition-[padding,background] duration-300"
                style={{ gridTemplateColumns: "60px 1fr auto auto" }}
              >
                <span className="micro-sm font-mono-ui text-fg-3">№{s.id}</span>
                <div>
                  <div
                    className="font-display stitle leading-none transition-colors duration-300 group-hover:text-accent"
                    style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                  >
                    {s.title}
                  </div>
                  <div className="italic-display mt-1 text-sm text-fg-3">/{s.en}</div>
                </div>
                <div className="hidden gap-1.5 md:flex md:flex-wrap">
                  {(CHIPS[s.id] ?? s.disciplines).map((c) => (
                    <span key={c} className="micro-sm border border-[var(--color-separator)] px-2.5 py-1 text-fg-2">
                      {c}
                    </span>
                  ))}
                </div>
                <motion.span
                  aria-hidden
                  className="text-xl text-fg-4 transition-colors duration-300 group-hover:text-accent"
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  →
                </motion.span>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* Mobile: 2×2 grid */}
        <div className="mt-8 grid grid-cols-2 gap-2 md:hidden">
          {services.map((s) => (
            <Link
              key={s.id}
              href="/services"
              className="group flex aspect-square flex-col justify-between border p-4 transition-colors"
              style={{ borderColor: "var(--color-separator)" }}
            >
              <span className="micro-sm font-mono-ui text-fg-4">№{s.id}</span>
              <div>
                <div className="font-display text-xl leading-none transition-colors group-hover:text-accent">
                  {s.title}
                </div>
                <div className="italic-display mt-1 text-xs text-fg-3">/{s.en}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
