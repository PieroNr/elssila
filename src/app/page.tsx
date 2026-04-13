// src/app/page.tsx
"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Header from "@/components/layout/Header";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import { cabinet, neima } from "@/lib/fonts";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const BustScene = dynamic<{ animate: boolean; wireframeColor: string; isDark: boolean }>(
  () => import("@/components/three/BustScene")
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const blurMaskRef = useRef<HTMLDivElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });

  const { theme, toggle } = useTheme();
  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";

  // Entry loader (~1.8 s)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Blur spotlight – follows the cursor with lerp
  useEffect(() => {
    const setSpotToCenter = () => {
      const host = mainRef.current;
      const mask = blurMaskRef.current;
      if (!host || !mask) return;

      const rect = host.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      pointerTarget.current = { x: cx, y: cy };
      pointerCurrent.current = { x: cx, y: cy };
      mask.style.setProperty("--spot-x", `${cx}px`);
      mask.style.setProperty("--spot-y", `${cy}px`);
    };

    setSpotToCenter();
    window.addEventListener("resize", setSpotToCenter);

    let rafId = 0;
    const tick = () => {
      const mask = blurMaskRef.current;
      if (mask) {
        pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.18;
        pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.18;
        mask.style.setProperty("--spot-x", `${pointerCurrent.current.x}px`);
        mask.style.setProperty("--spot-y", `${pointerCurrent.current.y}px`);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSpotToCenter);
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const host = mainRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    pointerTarget.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    const host = mainRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    pointerTarget.current = { x: rect.width / 2, y: rect.height / 2 };
  };

  return (
    <main
      ref={mainRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="custom-cursor-host relative min-h-screen bg-page text-fg overflow-hidden"
    >
      {/* BACKGROUND 3D */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BustScene animate={!isLoading} wireframeColor={wireframeColor} isDark={theme === "dark"} />
      </div>

      {/* Blur spotlight */}
      <div ref={blurMaskRef} className="bust-blur-mask pointer-events-none absolute inset-0 z-[2]" />

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 z-5 opacity-20 noise-overlay" />

      {/* Full-screen loader with fade-out */}
      {showLoader && (
        <motion.div
          key="loader"
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-page"
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

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
        <Header />

        {/* Hero */}
        <section className="flex flex-1 items-center justify-center">
          <div className="relative max-w-xl flex flex-col items-center text-center">
            {/* Glow behind text */}
            <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[999px] bg-[var(--color-hero-glow)] blur-3xl" />

            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 24 : 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className={`${neima.className} text-4xl sm:text-5xl md:text-7xl tracking-tight leading-tight md:leading-[1.2] text-center`}
              >
                CREATIVE
                <br className="hidden sm:block" />
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
        </section>
      </div>

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

      <ScrollIndicator visible={!showLoader} />

      <div className={`${cabinet.className} pointer-events-none fixed bottom-20 right-6 z-[70] text-[10px] uppercase tracking-[0.28em] text-fg/45`}>
        ISO 400
      </div>
    </main>
  );
}
