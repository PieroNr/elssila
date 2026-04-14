"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cabinet, neima } from "@/lib/fonts";
import { useTheme } from "@/lib/theme";

const BlobScene = dynamic(() => import("@/components/three/BlobScene"), { ssr: false });

/* ─── Data ──────────────────────────────────────────────────────────────── */

const PROJECTS = [
  {
    id: "01",
    title: "Void Campaign",
    category: "Brand Identity",
    year: "2025",
    label: "Direction artistique · Motion",
    bg: "linear-gradient(155deg, #1c1410 0%, #2e2218 45%, #0e0b08 100%)",
    highlight: "radial-gradient(ellipse 80% 60% at 35% 28%, rgba(200,130,40,0.20) 0%, transparent 65%)",
  },
  {
    id: "02",
    title: "Hollow Swine",
    category: "Editorial",
    year: "2025",
    label: "Photographie · Layout",
    bg: "linear-gradient(150deg, #22201a 0%, #3a3425 35%, #181610 70%, #090807 100%)",
    highlight: "radial-gradient(ellipse 75% 65% at 55% 30%, rgba(160,145,65,0.18) 0%, transparent 65%)",
  },
  {
    id: "03",
    title: "NOMA Manifesto",
    category: "Digital Experience",
    year: "2024",
    label: "3D · Expérience Web",
    bg: "linear-gradient(145deg, #060e18 0%, #0e1f2e 40%, #051018 72%, #020810 100%)",
    highlight: "radial-gradient(ellipse 85% 55% at 60% 22%, rgba(30,95,165,0.20) 0%, transparent 62%)",
  },
  {
    id: "04",
    title: "Rift Collection",
    category: "Fashion",
    year: "2024",
    label: "Direction artistique · Vidéo",
    bg: "linear-gradient(148deg, #120a12 0%, #200e1a 42%, #0d0609 70%, #060304 100%)",
    highlight: "radial-gradient(ellipse 70% 60% at 40% 35%, rgba(155,30,55,0.20) 0%, transparent 62%)",
  },
  {
    id: "05",
    title: "Archive III",
    category: "Installation",
    year: "2023",
    label: "Scénographie · Print",
    bg: "linear-gradient(152deg, #100e08 0%, #1e1a08 42%, #0c0a06 70%, #050402 100%)",
    highlight: "radial-gradient(ellipse 75% 55% at 50% 25%, rgba(180,150,40,0.16) 0%, transparent 62%)",
  },
];

/* Default scatter: rotation + vertical offset per card */
const SCATTER = [
  { r: -7, y: -18 },
  { r: -2.5, y: 10 },
  { r: 1,   y: -6 },
  { r: 4.5, y: 14 },
  { r: 8,   y: -22 },
];

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface CardProps {
  project: (typeof PROJECTS)[number];
  scatter: (typeof SCATTER)[number];
  index: number;
  activeIndex: number | null;
  onActivate: (i: number) => void;
  onDeactivate: () => void;
  inView: boolean;
  /** True for every card after the first — creates horizontal overlap */
  overlap: boolean;
}

function ProjectCard({
  project,
  scatter,
  index,
  activeIndex,
  onActivate,
  onDeactivate,
  inView,
  overlap,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* Mouse tracking (normalised -0.5 → +0.5) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  /* Tilt from mouse */
  const rawTiltX = useTransform(my, [-0.5, 0.5], [8, -8]);
  const rawTiltY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const tiltX = useSpring(rawTiltX, { stiffness: 280, damping: 28, mass: 0.6 });
  const tiltY = useSpring(rawTiltY, { stiffness: 280, damping: 28, mass: 0.6 });

  /* Glare follows mouse */
  const glareX = useTransform(mx, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(my, [-0.5, 0.5], [10, 90]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.09) 0%, transparent 58%)`;

  const isActive  = activeIndex === index;
  const isOther   = activeIndex !== null && !isActive;
  const isIdle    = activeIndex === null;

  /* Compose the animate object */
  const getAnimate = () => {
    if (!inView) return { opacity: 0, y: 50 + scatter.y, rotate: scatter.r, scale: 0.84 };
    if (isActive) return { opacity: 1, y: -10, rotate: 0, scale: 1.06 };
    if (isOther)  return { opacity: 0.28, y: scatter.y, rotate: scatter.r, scale: 0.9 };
    /* idle */    return { opacity: 1,    y: scatter.y, rotate: scatter.r, scale: 1 };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    onDeactivate();
  }, [mx, my, onDeactivate]);

  return (
    <motion.div
      ref={cardRef}
      /* Outer — scale / rotate / y / opacity */
      className="relative shrink-0"
      style={{
        width: "clamp(188px, 21vw, 260px)",
        aspectRatio: "2/3",
        zIndex: isActive ? 30 : isIdle ? 10 - Math.abs(index - 2) : 5,
        transformStyle: "preserve-3d",
        marginLeft: overlap ? "clamp(-56px, -5.5vw, -28px)" : 0,
      }}
      animate={getAnimate()}
      initial={{ opacity: 0, y: 50 + scatter.y, rotate: scatter.r, scale: 0.84 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 30,
        mass: 0.8,
        delay: inView ? index * 0.08 : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner — 3-D tilt */}
      <motion.div
        className="relative h-full w-full overflow-hidden"
        style={{ rotateX: tiltX, rotateY: tiltY }}
      >
        {/* Background */}
        <div className="absolute inset-0" style={{ background: project.bg }} />

        {/* Colour highlight */}
        <div className="absolute inset-0" style={{ background: project.highlight }} />

        {/* Film grain */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />

        {/* Mouse-glare */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: glareBg,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Bottom vignette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top-left index */}
        <div
          className={`${cabinet.className} absolute left-4 top-4 text-[0.52rem] tracking-[0.32em] uppercase text-white/25`}
        >
          {project.id}
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <motion.div
            animate={{ opacity: isActive ? 1 : 0.65, y: isActive ? 0 : 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={`${cabinet.className} mb-1.5 text-[0.48rem] tracking-[0.32em] uppercase text-white/40`}
            >
              {project.category}&nbsp;—&nbsp;{project.year}
            </div>
            <h3
              className={`${neima.className} text-xl leading-tight text-white/92`}
            >
              {project.title}
            </h3>
          </motion.div>

          {/* Sub-label — appears on hover */}
          <motion.div
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
            transition={{ duration: 0.25, delay: isActive ? 0.06 : 0 }}
            className={`${cabinet.className} mt-3 flex items-center gap-2 text-[0.48rem] uppercase tracking-[0.26em] text-white/50`}
          >
            <span>{project.label}</span>
            <span className="text-accent">→</span>
          </motion.div>
        </div>

        {/* Active border accent */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.12)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef     = useRef<HTMLDivElement>(null);
  const blurMaskRef    = useRef<HTMLDivElement>(null);
  const startSpotRef   = useRef<(() => void) | null>(null);
  const pointerTarget  = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });

  const isInView = useInView(sectionRef, { once: true, margin: "-8%" });
  const { theme } = useTheme();
  const wireframeColor = theme === "dark" ? "#2391ff" : "#ff6a00";

  // ── Lerp spotlight — same pattern as the bust ──────────────────────────────
  useEffect(() => {
    let rafId = 0;
    let running = false;

    const startRAF = () => {
      if (running || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    startSpotRef.current = startRAF;

    const tick = () => {
      const mask = blurMaskRef.current;
      if (mask) {
        const dx = pointerTarget.current.x - pointerCurrent.current.x;
        const dy = pointerTarget.current.y - pointerCurrent.current.y;
        pointerCurrent.current.x += dx * 0.16;
        pointerCurrent.current.y += dy * 0.16;
        mask.style.setProperty("--spot-x", `${pointerCurrent.current.x}px`);
        mask.style.setProperty("--spot-y", `${pointerCurrent.current.y}px`);
        if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) { running = false; return; }
      }
      rafId = requestAnimationFrame(tick);
    };

    const setCenter = () => {
      const s = sectionRef.current;
      if (!s) return;
      const cx = s.clientWidth / 2;
      const cy = s.clientHeight / 2;
      pointerTarget.current  = { x: cx, y: cy };
      pointerCurrent.current = { x: cx, y: cy };
      blurMaskRef.current?.style.setProperty("--spot-x", `${cx}px`);
      blurMaskRef.current?.style.setProperty("--spot-y", `${cy}px`);
    };

    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(rafId); running = false; }
      else startRAF();
    };

    setCenter();
    startRAF();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(rafId);
      startSpotRef.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = sectionRef.current;
    if (!s) return;
    const rect = s.getBoundingClientRect();
    pointerTarget.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    startSpotRef.current?.();
  }, []);

  const handlePointerLeave = useCallback(() => {
    const s = sectionRef.current;
    if (!s) return;
    pointerTarget.current = { x: s.clientWidth / 2, y: s.clientHeight / 2 };
    startSpotRef.current?.();
  }, []);

  const onActivate   = useCallback((i: number) => setActiveIndex(i), []);
  const onDeactivate = useCallback(() => setActiveIndex(null), []);

  return (
    // The outer section is the reference frame for both the blur mask and the
    // blob canvas, so they cover everything: label, title AND cards.
    <div
      ref={sectionRef}
      className="relative z-10"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* ── 3-D blob canvas — spans the whole section ── */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <BlobScene wireframeColor={wireframeColor} isDark={theme === "dark"} />
      </div>

      {/* ── Cursor-reveal blur mask — above blobs, below all text/cards ── */}
      <div
        ref={blurMaskRef}
        className="blob-blur-mask pointer-events-none absolute inset-0 z-5 hidden md:block"
      />

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-6xl px-6 pt-24"
      >
        <div
          className={`${cabinet.className} flex items-center justify-between text-[0.6rem] uppercase tracking-[0.3em] text-fg-3`}
        >
          <span>Selected Work</span>
          <span>{PROJECTS.length} projets</span>
        </div>
        <div className="mt-3 h-[0.5px] w-full bg-(--color-separator)" />
      </motion.div>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
        className="relative z-10 mx-auto max-w-6xl px-6 mt-10 flex items-end justify-between"
      >
        <h2 className={`${neima.className} text-5xl md:text-7xl tracking-tight leading-none text-fg`}>
          Projects
        </h2>
        <span
          className={`${cabinet.className} mb-1 hidden sm:block text-[0.6rem] uppercase tracking-[0.28em] text-fg-3`}
        >
          Hover to explore
        </span>
      </motion.div>

      {/* ── Cards ── */}
      <div
        className="relative z-10 mt-14 overflow-x-auto md:overflow-visible"
        style={{ perspective: "1400px" }}
      >
        <div className="flex items-center justify-start md:justify-center py-20 md:py-28 px-10 md:px-0">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              scatter={SCATTER[i]}
              index={i}
              activeIndex={activeIndex}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              inView={isInView}
              overlap={i > 0}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom tagline ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
        className={`${cabinet.className} relative z-10 mx-auto max-w-6xl px-6 pb-32 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.28em] text-fg-3`}
      >
        <span>Voir tous les projets</span>
        <span className="text-accent">→</span>
      </motion.div>
    </div>
  );
}
