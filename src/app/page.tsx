// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// chargement de la scène 3D
const BustScene = dynamic<{ animate: boolean }>(
    () => import("@/components/three/BustScene")
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  // Loader d'entrée (≈ 1.8s) pour laisser le temps à la 3D de charger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
      <main className="relative min-h-screen bg-[#fdf2e9] text-slate-900 overflow-hidden">
        {/* BACKGROUND 3D PLEIN ÉCRAN */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Le modèle se charge dès le début, mais n'anime (fade-in) qu'après le loader */}
          <BustScene animate={!isLoading} />
        </div>

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
            <div className="mb-6 text-xs font-semibold tracking-[0.35em] uppercase text-slate-700">
              Elssila Studio
            </div>

            {/* bloc central */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                CREATIVE
                <br className="hidden sm:block" />
                PRODUCTION
              </h1>

              <p className="mt-3 text-[0.65rem] tracking-[0.35em] uppercase text-[#d9772c]">
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
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
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
                    className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-center"
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
                    className="mt-4 text-[0.7rem] tracking-[0.35em] uppercase text-[#d9772c] text-center"
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
                  <button className="rounded-full bg-[#d9772c] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#c36722] transition-colors">
                    Start Free Trial
                  </button>

                  {/* bouton blanc */}
                  <button className="rounded-full border border-slate-900/30 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 hover:border-slate-900/60 transition-colors">
                    View Demo
                  </button>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </main>
  );
}