"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { featuredProjects as staticFeatured, type Project } from "@/data/projects";
import { useTheme } from "@/lib/theme";
import { useLiteMode } from "@/lib/lite-mode";
import { Reveal } from "@/components/ui/Reveal";

const KnotScene = dynamic(() => import("@/components/three/KnotScene"), { ssr: false });

const SPANS: { gridColumn: string; gridRow: string }[] = [
  { gridColumn: "span 2", gridRow: "span 2" },
  { gridColumn: "span 2", gridRow: "span 1" },
  { gridColumn: "span 2", gridRow: "span 1" },
  { gridColumn: "span 2", gridRow: "span 2" },
  { gridColumn: "span 2", gridRow: "span 2" },
];

export default function HomeProjects() {
  const { theme } = useTheme();
  const lite = useLiteMode();
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [knotVisible, setKnotVisible] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(staticFeatured);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setKnotVisible(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/projects/featured")
      .then((r) => r.json())
      .then((data: Project[]) => { if (data.length > 0) setFeaturedProjects(data); })
      .catch(() => {});
  }, []);

  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";
  const projects = featuredProjects.slice(0, 5);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-16 md:px-16 md:py-32">
      {/* KnotScene — desktop only, behind content, fades in when section enters viewport */}
      {!lite && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-0 z-0 hidden h-[780px] w-[780px] md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: knotVisible ? 0.7 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <KnotScene wireframeColor={wireframeColor} />
        </motion.div>
      )}
      <div className="micro-sm font-mono-ui absolute right-20 top-24 z-[1] hidden text-right text-fg-3 md:block">
        ⌗ OBJ_03
        <br />
        TORUS · p2 q3
      </div>

      <div className="relative z-[1] mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <span className="micro text-fg-3">⌗ Travaux sélectionnés</span>
          </div>
          <div className="hairline mt-3" />
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex items-end justify-between">
          <h2
            className="font-display"
            style={{ fontSize: "clamp(64px, 9vw, 128px)", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}
          >
            Projets<span className="text-accent">.</span>
          </h2>
          <Link href="/projects" className="micro pb-3 text-fg-2 transition-colors hover:text-accent">
            Tous les projets →
          </Link>
        </Reveal>

        {/* Asymmetric grid — desktop */}
        <div
          className="mt-14 hidden p-px md:grid"
          style={{
            background: "var(--color-separator)",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "200px",
            gap: 2,
          }}
        >
          {projects.map((p, i) => {
            const span = SPANS[i] ?? SPANS[SPANS.length - 1];
            const isActive = hoverSlug === p.slug;
            const isOther = hoverSlug !== null && !isActive;
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                onMouseEnter={() => setHoverSlug(p.slug)}
                onMouseLeave={() => setHoverSlug(null)}
                className="group relative block overflow-hidden bg-card transition-opacity duration-500"
                style={{ ...span, opacity: isOther ? 0.32 : 1 }}
              >
                <Image
                  src={p.hero.src}
                  alt={p.hero.alt}
                  fill
                  sizes="(min-width: 1280px) 50vw, 80vw"
                  className="object-cover transition-transform duration-700 ease-out"
                  style={{ transform: isActive ? "scale(1.04)" : "scale(1)" }}
                />
                <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />


                <div className="pointer-events-none absolute right-4 bottom-4 left-4 text-white">
                  <div
                    className="italic-display transition-[font-size] duration-500"
                    style={{ fontSize: isActive ? 38 : 22, lineHeight: 1 }}
                  >
                    {p.title}
                  </div>
                  <div className="micro-sm mt-1.5 text-white/85">
                    {p.category} · {p.year}
                  </div>
                </div>

                <div
                  className="micro-sm font-mono-ui pointer-events-none absolute top-3.5 left-4 bg-accent px-2 py-1 text-white transition-[opacity,transform] duration-300"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(-6px)",
                  }}
                >
                  ↗ Open
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile: 2-column compact grid */}
        <div className="mt-8 grid grid-cols-2 gap-2 md:hidden">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="relative block aspect-square overflow-hidden"
            >
              <Image src={p.hero.src} alt={p.hero.alt} fill sizes="50vw" className="object-cover" />
              <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute right-2.5 bottom-2.5 left-2.5 text-white">
                <div className="italic-display text-sm leading-none">{p.title}</div>
                <div className="micro-sm mt-1 text-white/75">{p.year}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
