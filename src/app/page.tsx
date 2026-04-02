// src/app/page.tsx
"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Header from "@/components/layout/Header";
import { cabinet, neima } from "@/lib/fonts";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// chargement de la scène 3D
const BustScene = dynamic<{ animate: boolean }>(
    () => import("@/components/three/BustScene")
);

const DARK_MODE_STORAGE_KEY = "elssila:dark-mode-invert";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const blurMaskRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });

  // Loader d'entrée (≈ 1.8s) pour laisser le temps à la 3D de charger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (stored === "off") {
        setIsDarkMode(false);
      } else if (stored === "on") {
        setIsDarkMode(true);
      }
    } catch {
      // Ignore localStorage errors (private mode, blocked storage, etc.)
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode ? "on" : "off");
    } catch {
      // Ignore localStorage errors (private mode, blocked storage, etc.)
    }
  }, [hasHydrated, isDarkMode]);

  useEffect(() => {
    const setSpotToCenter = () => {
      const host = mainRef.current;
      const mask = blurMaskRef.current;
      const cursor = cursorRef.current;
      if (!host || !mask) return;

      const rect = host.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      pointerTarget.current = { x: centerX, y: centerY };
      pointerCurrent.current = { x: centerX, y: centerY };
      mask.style.setProperty("--spot-x", `${centerX}px`);
      mask.style.setProperty("--spot-y", `${centerY}px`);
      if (cursor) {
        cursor.style.setProperty("--cursor-x", `${centerX}px`);
        cursor.style.setProperty("--cursor-y", `${centerY}px`);
      }
    };

    setSpotToCenter();
    window.addEventListener("resize", setSpotToCenter);

    let rafId = 0;
    const tick = () => {
      const mask = blurMaskRef.current;
      const cursor = cursorRef.current;
      if (mask) {
        pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.18;
        pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.18;
        mask.style.setProperty("--spot-x", `${pointerCurrent.current.x}px`);
        mask.style.setProperty("--spot-y", `${pointerCurrent.current.y}px`);
        if (cursor) {
          cursor.style.setProperty("--cursor-x", `${pointerCurrent.current.x}px`);
          cursor.style.setProperty("--cursor-y", `${pointerCurrent.current.y}px`);
        }
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

    const target = event.target as HTMLElement | null;
    const isClickable = Boolean(
      target?.closest("a, button, [role='button'], input, select, textarea, label, [data-clickable='true']")
    );
    cursorRef.current?.classList.toggle("is-active", isClickable);
    cursorRef.current?.classList.remove("is-hidden");
  };

  const handlePointerLeave = () => {
    const host = mainRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    pointerTarget.current = { x: rect.width / 2, y: rect.height / 2 };
    cursorRef.current?.classList.add("is-hidden");
  };

  const handlePointerEnter = () => {
    cursorRef.current?.classList.remove("is-hidden");
  };

  return (
      <main
        ref={mainRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`custom-cursor-host relative min-h-screen bg-[#fdf2e9] text-slate-900 overflow-hidden transition-[filter] duration-300 ${isDarkMode ? "site-invert" : ""}`}
      >
        {/* BACKGROUND 3D PLEIN ÉCRAN */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Le modèle se charge dès le début, mais n'anime (fade-in) qu'après le loader */}
          <BustScene animate={!isLoading} />
        </div>

        {/* Filtre de flou sur la 3D avec fenêtre nette autour du curseur */}
        <div ref={blurMaskRef} className="bust-blur-mask pointer-events-none absolute inset-0 z-[2]" />

        {/* Curseur custom en croix */}
        <div ref={cursorRef} className="app-cross-cursor is-hidden pointer-events-none absolute inset-0 z-[60]" />

        {/* GRAIN / NOISE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 z-5 opacity-25 noise-overlay" />

        {/* LOADER PLEIN ÉCRAN AVEC FADE OUT */}
        {showLoader && (
          <motion.div
            key="loader"
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#fdf2e9]"
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoading ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (!isLoading) {
                setShowLoader(false);
              }
            }}
          >
            {/* petit label en haut */}
            <div className={`${cabinet.className} mb-6 text-xs font-semibold tracking-[0.35em] uppercase text-slate-700`}>
              Elssila Studio
            </div>

            {/* bloc central */}
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

              <p className={`${cabinet.className} mt-3 text-[0.65rem] tracking-[0.35em] uppercase text-[#d9772c]`}>
                Initialising Visual System
              </p>

              {/* barre de loading */}
              <div className="mt-8 w-40 sm:w-56 h-[2px] bg-slate-300/60 overflow-hidden rounded-full">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                  className="h-full w-full bg-[#f97316]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CONTENU PRINCIPAL */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
          {/* HEADER / NAV */}
          <Header />

          {/* HERO CENTRAL */}
          <section className="flex flex-1 items-center justify-center">
            {/* Bloc texte + blur */}
            <div className="relative max-w-xl flex flex-col items-center text-center">
              {/* BLUR BACKGROUND DERRIÈRE LE HERO */}
              <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[999px] bg-white/55 blur-3xl" />

              {/* CONTENU ANIMÉ */}
              <div className="relative">
                {/* GROS TEXTE NOIR */}
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

                {/* TEXTE PLUS PETIT COLORÉ */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 16 : 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
                    className={`${cabinet.className} mt-4 text-[0.7rem] tracking-[0.35em] uppercase text-[#d9772c] text-center`}
                >
                  DEFINING THE VISUAL EDGE OF TOMORROW
                </motion.p>

                {/* BOUTONS */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 16 : 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    className="mt-10 flex flex-wrap justify-center gap-4"
                >
                  {/* bouton coloré */}
                  <button className={`${cabinet.className} rounded-none bg-[#d9772c] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#c36722]`}>
                    Start Free Trial
                  </button>

                  {/* bouton blanc */}
                  <button className={`${cabinet.className} rounded-none border border-slate-900/40 bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:border-black`}>
                    View Demo
                  </button>
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          aria-pressed={isDarkMode}
          aria-label="Activer ou désactiver le dark mode"
          className={`${cabinet.className} fixed bottom-6 right-6 z-[70] border border-black/60 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white`}
        >
          Dark mode {isDarkMode ? "ON" : "OFF"}
        </button>
      </main>
  );
}