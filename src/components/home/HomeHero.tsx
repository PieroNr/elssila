"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useLiteMode } from "@/lib/lite-mode";
import { Reveal } from "@/components/ui/Reveal";

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
};

const BustScene = dynamic<{ animate: boolean; wireframeColor: string; isDark: boolean }>(
  () => import("@/components/three/BustScene"),
  { ssr: false },
);

type HomeHeroProps = {
  ready: boolean;
  onPastHeroChange: (past: boolean) => void;
};

export default function HomeHero({ ready, onPastHeroChange }: HomeHeroProps) {
  const { theme } = useTheme();
  const lite = useLiteMode();
  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";

  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [bustVisible, setBustVisible] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setBustVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = heroSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => onPastHeroChange(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onPastHeroChange]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Bust 3D — spans hero + showreel, always mounted to avoid context churn */}
      {!lite && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <BustScene animate={ready && bustVisible} wireframeColor={wireframeColor} isDark={theme === "dark"} />
        </div>
      )}

      {/* HERO */}
      {/* Mobile: min-h auto so bust isn't clipped; desktop: full screen */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-16 pb-8 md:min-h-screen md:pt-0 md:pb-0">
        <div className="relative z-[2] flex max-w-2xl flex-col items-center text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[999px] bg-[var(--color-hero-glow)] blur-3xl"
          />

          {/* Mobile bust — positioned above title, desktop is handled by absolute BustScene */}
          {!lite && (
            <div
              aria-hidden
              className="pointer-events-none relative z-0 -mt-4 mb-2 h-[240px] w-full md:hidden"
            >
              {/* Gradient mask so bust blends into title below */}
              <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[var(--color-page)] to-transparent" />
            </div>
          )}

          <motion.div
            className="relative z-[1]"
            variants={heroContainer}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
          >
            <motion.h1
              variants={heroItem}
              className="font-display tracking-tight"
              style={{ fontSize: "clamp(48px, 9vw, 128px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}
            >
              CREATIVE
              <br />
              PRODUCTION
            </motion.h1>

            <motion.p variants={heroItem} className="micro mt-4 text-accent">
              Defining the visual edge of tomorrow
            </motion.p>

            <motion.div variants={heroItem} className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/projects"
                className="bg-accent px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover md:px-9 md:py-3.5"
              >
                Voir le travail
              </Link>
              <Link
                href="/contact"
                className="border border-fg/60 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-page md:px-9 md:py-3.5"
              >
                Discutons-en
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Corner stamps — hidden on small mobile, visible md+ */}
        <div className="micro-sm font-mono-ui absolute top-8 left-8 z-[2] hidden text-fg-3 sm:block md:left-16">
          ⌗ EST. 2019
          <br />
          PARIS · FR
        </div>
        <div className="micro-sm font-mono-ui absolute top-8 right-8 z-[2] hidden text-right text-fg-3 sm:block md:right-16">
          VOL. 01 · MMXXV
          <br />
          ISO 400
        </div>

        <div ref={heroSentinelRef} className="absolute bottom-0 h-px w-px" />
      </section>

      {/* SHOWREEL */}
      <Showreel />
    </div>
  );
}

function Showreel() {
  const [playing, setPlaying] = useState(true);

  return (
    <section className="relative">
      <Reveal className="mx-auto max-w-6xl px-6 pt-12 md:pt-24">
        <div className="flex items-baseline justify-between">
          <span className="micro text-fg-3">⌗ Showreel</span>
          <span className="micro text-fg-3">2025 · 02:47</span>
        </div>
        <div className="hairline mt-3" />
      </Reveal>

      {/* Video — taller on mobile for better impact */}
      <div className="relative mt-4 w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <div
          className="absolute inset-0 md:hidden"
          style={{ aspectRatio: "9/16", width: "100%", height: "auto" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(183,211,213,0.06) 0px, rgba(183,211,213,0.06) 2px, transparent 2px, transparent 14px), linear-gradient(135deg, #0a1d2c, #051018)",
          }}
        />
        <div className="micro-sm font-mono-ui absolute top-3 left-3 border border-white/10 bg-black/60 px-1.5 py-1 text-white/55">
          REEL/MASTER · 2160p
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-20 noise-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause showreel" : "Play showreel"}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15 text-base text-white backdrop-blur-md transition-transform hover:scale-110 md:h-24 md:w-24 md:text-xl"
          >
            {playing ? "▮▮" : "▶"}
          </button>
        </div>

        {/* Bottom labels */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 py-4 md:px-8 md:py-5">
          <span className="micro text-white/85">▌ Selected work · 2024 — 2025</span>
          <span className="micro-sm font-mono-ui hidden text-white/55 sm:block">VOL. 01 / MUTED</span>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-6 pb-16 md:pb-24">
        <span className="micro text-fg-3">Defining the visual edge of tomorrow</span>
        <span className="micro text-accent">→ See full reel</span>
      </div>
    </section>
  );
}
