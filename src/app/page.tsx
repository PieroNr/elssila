// src/app/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Header from "@/components/layout/Header";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import { cabinet, neima } from "@/lib/fonts";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const BustScene = dynamic<{ animate: boolean; wireframeColor: string; isDark: boolean }>(
  () => import("@/components/three/BustScene")
);

const ShowreelSection = dynamic(() => import("@/components/ShowreelSection"), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [pastHero, setPastHero] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const blurMaskRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  // Ref to the spotlight RAF restart fn so pointer-move can wake it up
  const startSpotlightRef = useRef<(() => void) | null>(null);

  const { theme, toggle } = useTheme();
  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";

  // Entry loader (~1.8 s)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Hide scroll indicator when the bottom of the hero leaves the viewport
  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Blur spotlight – follows the cursor with lerp.
  // RAF is suspended when the tab is hidden and when the lerp has converged.
  useEffect(() => {
    let rafId = 0;
    let running = false;

    const startRAF = () => {
      if (running || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    startSpotlightRef.current = startRAF;

    const tick = () => {
      const mask = blurMaskRef.current;
      if (mask) {
        const dx = pointerTarget.current.x - pointerCurrent.current.x;
        const dy = pointerTarget.current.y - pointerCurrent.current.y;
        pointerCurrent.current.x += dx * 0.18;
        pointerCurrent.current.y += dy * 0.18;
        mask.style.setProperty("--spot-x", `${pointerCurrent.current.x}px`);
        mask.style.setProperty("--spot-y", `${pointerCurrent.current.y}px`);
        // Stop RAF once the lerp has converged (< 0.5 px remaining)
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          running = false;
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const setSpotToCenter = () => {
      const mask = blurMaskRef.current;
      if (!mask) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      pointerTarget.current = { x: cx, y: cy };
      pointerCurrent.current = { x: cx, y: cy };
      mask.style.setProperty("--spot-x", `${cx}px`);
      mask.style.setProperty("--spot-y", `${cy}px`);
    };

    // Debounced resize handler (200 ms)
    let resizeTimer = 0;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setSpotToCenter, 200);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        running = false;
      } else {
        startRAF();
      }
    };

    setSpotToCenter();
    startRAF();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      startSpotlightRef.current = null;
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    pointerTarget.current = { x: event.clientX, y: event.clientY };
    startSpotlightRef.current?.();
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerTarget.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    startSpotlightRef.current?.();
  }, []);

  return (
    <main
      ref={mainRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="custom-cursor-host relative bg-page text-fg"
    >
      {/* BACKGROUND 3D — limité au hero (h-screen) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-screen z-0">
        <BustScene animate={!isLoading} wireframeColor={wireframeColor} isDark={theme === "dark"} />
      </div>

      {/* Blur spotlight — limité au hero */}
      <div ref={blurMaskRef} className="bust-blur-mask pointer-events-none fixed top-0 left-0 right-0 h-screen z-[2]" />

      {/* Grain overlay — fixed sur toute la page */}
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      {/* Full-screen loader — fixed pour couvrir le viewport quelle que soit la hauteur de la page */}
      {showLoader && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-page"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (!isLoading) setShowLoader(false);
          }}
        >
          <div className={`${cabinet.className} mb-6 text-xs font-semibold tracking-[0.35em] uppercase text-fg/75`}>
            Elssila Studio
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className={`${neima.className} text-4xl sm:text-4xl md:text-5xl tracking-tight leading-tight md:leading-[1.2]`}>
              CREATIVE
              <br className="hidden sm:block" />
              PRODUCTION
            </h1>

            <p className={`${cabinet.className} mt-3 text-[0.65rem] tracking-[0.35em] uppercase text-accent`}>
              Initialising Visual System
            </p>

            <div className="mt-8 w-40 sm:w-56 h-[2px] bg-fg/15 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="h-full w-full bg-accent-vivid"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* STICKY HEADER — persiste au scroll sur toutes les sections */}
      <div className="sticky top-0 z-30 bg-page">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Header />
        </div>
      </div>

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 -mt-[73px]">
        <div className="relative max-w-xl flex flex-col items-center text-center">
          {/* Glow behind text */}
          <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[999px] bg-[var(--color-hero-glow)] blur-3xl" />

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 24 : 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className={`${neima.className} text-5xl sm:text-6xl md:text-8xl tracking-tight leading-tight md:leading-[1.1] text-center`}
            >
              CREATIVE
              <br />
              PRODUCTION
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 16 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
              className={`${cabinet.className} mt-4 text-[0.7rem] tracking-[0.35em] uppercase text-accent text-center`}
            >
              DEFINING THE VISUAL EDGE OF TOMORROW
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 16 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button className={`${cabinet.className} rounded-none bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover`}>
                Start Free Trial
              </button>

              <button className={`${cabinet.className} rounded-none border border-fg/40 bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-fg transition-colors hover:border-fg`}>
                View Demo
              </button>
            </motion.div>
          </div>
        </div>
        {/* Sentinel — masque le scroll indicator dès que le hero quitte le viewport */}
        <div ref={heroSentinelRef} className="absolute bottom-0 h-px w-px" />
      </section>

      {/* SHOWREEL SECTION */}
      <ShowreelSection />

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggle}
        suppressHydrationWarning
        aria-label="Toggle theme"
        className={`${cabinet.className} fixed bottom-6 right-6 z-[70] border border-fg/60 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-page`}
      >
        <span suppressHydrationWarning>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>
      </button>

      <ScrollIndicator visible={!showLoader && !pastHero} isDark={theme === "dark"} />

      <div className={`${cabinet.className} pointer-events-none fixed bottom-20 right-6 z-[70] text-[10px] uppercase tracking-[0.28em] text-fg/45`}>
        ISO 400
      </div>
    </main>
  );
}
