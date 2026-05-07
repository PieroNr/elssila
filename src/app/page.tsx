"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import HomeHero from "@/components/home/HomeHero";
import HomeProjects from "@/components/home/HomeProjects";
import HomeServices from "@/components/home/HomeServices";
import HomeFooter from "@/components/home/HomeFooter";
import { cabinet, neima } from "@/lib/fonts";
import { useTheme } from "@/lib/theme";

export default function Home() {
  const { theme, toggle } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="custom-cursor-host relative bg-page text-fg">
      {/* Loader */}
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
          <h1 className={`${neima.className} text-center text-4xl tracking-tight leading-tight md:text-5xl md:leading-[1.2]`}>
            CREATIVE
            <br className="hidden sm:block" />
            PRODUCTION
          </h1>
          <p className={`${cabinet.className} mt-3 text-[0.65rem] tracking-[0.35em] uppercase text-accent`}>
            Initialising Visual System
          </p>
          <div className="mt-7 h-[2px] w-56 overflow-hidden bg-fg/15">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="h-full w-full bg-accent-vivid"
            />
          </div>
        </motion.div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-page/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Header />
        </div>
      </div>

      <HomeHero ready={!isLoading} onPastHeroChange={setPastHero} />
      <HomeProjects />
      <HomeServices />
      <HomeFooter />

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggle}
        suppressHydrationWarning
        aria-label="Toggle theme"
        className={`${cabinet.className} fixed bottom-6 right-6 z-[70] border border-fg/60 bg-page/80 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-fg backdrop-blur-sm transition-colors hover:bg-fg hover:text-page`}
      >
        <span suppressHydrationWarning>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>

      <ScrollIndicator visible={!showLoader && !pastHero} isDark={theme === "dark"} />
    </main>
  );
}
