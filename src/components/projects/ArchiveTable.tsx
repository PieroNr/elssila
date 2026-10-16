"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { PROJECT_CATEGORIES, type Project } from "@/data/projects";
import { useLang, t } from "@/lib/language";

type SortKey = "year" | "title";

const CARD_W = 300;
const CARD_H = 430;

// Tabular registry view of every project. Filter by category, sort by year/title,
// hover a row to surface a cursor-following preview card (desktop only).

export default function ArchiveTable({ projects }: { projects: Project[] }) {
  const { lang } = useLang();
  const [filter, setFilter] = useState<string>("Tous");
  const [sort, setSort] = useState<SortKey>("year");
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);
  const cardX = useSpring(rawX, { stiffness: 150, damping: 22 });
  const cardY = useSpring(rawY, { stiffness: 150, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = Math.max(8, Math.min(e.clientX + 28, window.innerWidth - CARD_W - 8));
    // Flip card above cursor when there isn't enough room below
    const spaceBelow = window.innerHeight - e.clientY - 28;
    const y = spaceBelow >= CARD_H ? e.clientY + 28 : Math.max(8, e.clientY - CARD_H - 20);
    rawX.set(x);
    rawY.set(y);
  };

  const list = useMemo<Project[]>(() => {
    let l = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);
    if (sort === "year") {
      l = [...l].sort((a, b) => Number(b.year) - Number(a.year));
    } else {
      l = [...l].sort((a, b) => a.title.localeCompare(b.title));
    }
    return l;
  }, [filter, sort, projects]);

  const counts = useMemo<Record<string, number>>(() => {
    const c: Record<string, number> = { Tous: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [projects]);

  const hovered = projects.find((p) => p.slug === hoverSlug);

  return (
    <>
      {/* Filters */}
      <div
        className="mt-14 border-y py-5"
        style={{ borderColor: "var(--color-separator)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="micro text-fg-2">{t.archive.filter[lang]}</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.archive.filter[lang]}>
              {PROJECT_CATEGORIES.map((c) => {
                const sel = c === filter;
                const count = counts[c] ?? 0;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    aria-pressed={sel}
                    className={`micro flex h-9 items-center gap-2 rounded-full border px-4 leading-none transition-colors ${
                      sel
                        ? "border-accent bg-accent font-bold text-white"
                        : "border-fg-3 text-fg hover:border-accent hover:text-accent"
                    }`}
                  >
                    <span>{c === "Tous" ? t.archive.all[lang] : c}</span>
                    <span className={sel ? "opacity-80" : "text-fg-3"}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="micro flex items-center gap-4 text-fg-3">
            <span>{t.archive.sort[lang]}</span>
            {(["year", "title"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
                className="micro transition-colors hover:text-accent"
                style={{
                  color: sort === s ? "var(--color-accent)" : undefined,
                  textDecoration: sort === s ? "underline" : "none",
                  textUnderlineOffset: "4px",
                }}
              >
                {s === "year" ? t.archive.year[lang] : t.archive.title[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header row (desktop) */}
      <div
        className="mt-8 hidden border-y py-3 md:grid"
        style={{
          gridTemplateColumns: "60px 2.4fr 1fr 1fr 1.4fr 60px",
          columnGap: "24px",
          borderColor: "var(--color-separator)",
        }}
      >
        {["№", t.archive.col_title[lang], t.archive.col_category[lang], t.archive.col_year[lang], "Client", ""].map((h, i) => (
          <div key={i} className="micro-sm text-fg-3">
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div onMouseMove={handleMouseMove}>
        {list.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            onMouseEnter={() => setHoverSlug(p.slug)}
            onMouseLeave={() => setHoverSlug(null)}
            onFocus={() => setHoverSlug(p.slug)}
            onBlur={() => setHoverSlug(null)}
            className="group block border-b transition-colors"
            style={{ borderColor: "var(--color-separator)" }}
          >
            {/* Desktop grid */}
            <div
              className="hidden items-center px-0 py-5 transition-[padding,background] duration-200 group-hover:bg-card-hover group-hover:px-3 md:grid"
              style={{
                gridTemplateColumns: "60px 2.4fr 1fr 1fr 1.4fr 60px",
                columnGap: "24px",
              }}
            >
              <span className="micro-sm font-mono-ui text-fg-3">{p.year}</span>
              <div className="font-display text-2xl tracking-tight transition-colors group-hover:text-accent">
                {p.title}
              </div>
              <span className="micro-sm text-fg-2">{p.category}</span>
              <span className="italic-display text-base text-fg-2">{p.year}</span>
              <span className="micro-sm text-fg-3">{p.client ?? "—"}</span>
              <span
                aria-hidden
                className="text-right text-lg text-fg-4 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-accent"
              >
                ↗︎
              </span>
            </div>

            {/* Mobile card */}
            <div className="flex items-baseline justify-between gap-4 py-5 md:hidden">
              <div className="flex-1">
                <div className="micro-sm font-mono-ui mb-1 text-fg-3">{p.year}</div>
                <div className="font-display text-2xl tracking-tight">{p.title}</div>
                <div className="micro-sm mt-1 text-fg-3">
                  {p.category} · {p.year}
                </div>
              </div>
              <span aria-hidden className="text-fg-4">→︎</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating preview (desktop only) */}
      <AnimatePresence mode="wait">
        {hovered && (
          <motion.aside
            key={hovered.slug}
            className="pointer-events-none fixed z-50 hidden w-[280px] bg-fg text-page shadow-2xl md:block"
            aria-hidden
            style={{ left: cardX, top: cardY }}
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={hovered.hero.src}
                alt=""
                fill
                sizes="280px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
            </div>
            <div className="p-4">
              <div className="font-mono-ui text-[9px] tracking-[0.2em] opacity-60">
                ▌︎ {hovered.year}
              </div>
              <div className="font-display mt-2 text-xl leading-tight tracking-tight">
                {hovered.title}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hovered.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="micro-sm border px-1.5 py-0.5"
                    style={{ borderColor: "rgba(253,242,233,0.25)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
