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
              STUDIO
              <br />
              AUDIOVISUEL
            </motion.h1>

            <motion.p variants={heroItem} className="micro mt-4 text-accent">
              vidéaste photographe et directrice artistique audiovisuelle
            </motion.p>

            <motion.div variants={heroItem} className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/projects"
                className="bg-accent px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover md:px-9 md:py-3.5"
              >
                Voir les projets
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

        <div ref={heroSentinelRef} className="absolute bottom-0 h-px w-px" />
      </section>

      {/* SHOWREEL */}
      <Showreel />
    </div>
  );
}

function Showreel() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative">
      <Reveal className="mx-auto max-w-6xl px-6 pt-12 md:pt-24">
        <div className="flex items-baseline justify-between">
          <span className="micro text-fg-3">⌗ Showreel</span>
        </div>
        <div className="hairline mt-3" />
      </Reveal>

      <div className="relative mt-4 w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {loaded ? (
          <iframe
            src="https://www.youtube.com/embed/oUt0rwGF37k?autoplay=1&rel=0&modestbranding=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            title="Showreel Elssila Studio"
          />
        ) : (
          <>
            {/* YouTube thumbnail */}
            <img
              src="https://img.youtube.com/vi/oUt0rwGF37k/maxresdefault.jpg"
              alt="Showreel Elssila Studio"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setLoaded(true)}
                aria-label="Lancer le showreel"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15 text-base text-white backdrop-blur-md transition-transform hover:scale-110 md:h-24 md:w-24 md:text-xl"
              >
                ▶
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-end px-4 py-4 md:px-8 md:py-5">
              <span className="micro text-white/85">▌ Travaux sélectionnés · 2025 — 2026</span>
            </div>
          </>
        )}
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-6 pb-16 md:pb-24">
        <span className="micro text-fg-3">vidéaste photographe et directrice artistique audiovisuelle</span>
        <a
          href="https://youtu.be/oUt0rwGF37k"
          target="_blank"
          rel="noopener noreferrer"
          className="micro text-accent"
        >
          → Voir le showreel
        </a>
      </div>
    </section>
  );
}
