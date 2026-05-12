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

// Hero + Showreel share a single absolute BustScene that spans both sections.
// Pausing the bust once the showreel leaves the viewport saves GPU cycles.
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
      {/* Bust 3D — spans hero + showreel */}
      {!lite && bustVisible && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <BustScene animate={ready} wireframeColor={wireframeColor} isDark={theme === "dark"} />
        </div>
      )}

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative z-[2] flex max-w-2xl flex-col items-center text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[999px] bg-[var(--color-hero-glow)] blur-3xl"
          />
          <motion.div
            className="relative"
            variants={heroContainer}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
          >
            <motion.h1
              variants={heroItem}
              className="font-display tracking-tight"
              style={{ fontSize: "clamp(56px, 9vw, 128px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}
            >
              CREATIVE
              <br />
              PRODUCTION
            </motion.h1>

            <motion.p variants={heroItem} className="micro mt-5 text-accent">
              Defining the visual edge of tomorrow
            </motion.p>

            <motion.div variants={heroItem} className="mt-10 flex flex-wrap justify-center gap-3.5">
              <Link
                href="/projects"
                className="bg-accent px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover"
              >
                Voir le travail
              </Link>
              <Link
                href="/contact"
                className="border border-fg/60 px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-page"
              >
                Discutons-en
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Corner stamps */}
        <div className="micro-sm font-mono-ui absolute top-8 left-8 z-[2] text-fg-3 md:left-16">
          ⌗ EST. 2019
          <br />
          PARIS · FR
        </div>
        <div className="micro-sm font-mono-ui absolute top-8 right-8 z-[2] text-right text-fg-3 md:right-16">
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
      <Reveal className="mx-auto max-w-6xl px-6 pt-24">
        <div className="flex items-baseline justify-between">
          <span className="micro text-fg-3">⌗ Showreel</span>
          <span className="micro text-fg-3">2025 · 02:47</span>
        </div>
        <div className="hairline mt-3" />
      </Reveal>

      <div className="relative mt-6 aspect-video w-full overflow-hidden">
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
            className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-white/15 text-xl text-white backdrop-blur-md transition-transform hover:scale-110"
          >
            {playing ? "▮▮" : "▶"}
          </button>
        </div>

        {/* Bottom labels */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-8 py-5">
          <span className="micro text-white/85">▌ Selected work · 2024 — 2025</span>
          <span className="micro-sm font-mono-ui text-white/55">VOL. 01 / MUTED</span>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between px-6 pb-24">
        <span className="micro text-fg-3">Defining the visual edge of tomorrow</span>
        <span className="micro text-accent">→ See full reel</span>
      </div>
    </section>
  );
}
