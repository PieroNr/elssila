"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/data/projects";

type Props = { images: ProjectImage[] };

// Horizontal scroll gallery — section background is `card-hover` to set it
// apart from the surrounding page. Each frame's intrinsic aspect drives its
// width at a fixed height. An IntersectionObserver tracks which frame is
// currently centered to highlight the matching pager dot.

export default function ProjectGalleryHorizontal({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.getAttribute("data-index"));
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { root: track, threshold: 0.6 },
    );

    frameRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [images.length]);

  const scrollTo = (idx: number) => {
    const el = frameRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section
      className="border-y bg-card-hover py-16 md:py-20"
      style={{ borderColor: "var(--color-separator)" }}
    >
      {/* Header */}
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-6">
        <div>
          <div className="micro text-fg-3">
            Plates · {String(images.length).padStart(2, "0")} frames
          </div>
          <h3 className="font-display mt-2 text-3xl tracking-tight md:text-5xl">
            <span className="italic-display">Gallery</span>
          </h3>
        </div>
        <div className="hidden gap-2 sm:flex" role="tablist" aria-label="Plate selector">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Plate ${i + 1}`}
              onClick={() => scrollTo(i)}
              className="h-1 w-8 transition-colors"
              style={{
                background:
                  i === active ? "var(--color-accent)" : "var(--color-fg-4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="mt-10 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex w-max gap-4 px-6 md:gap-6">
          {images.map((f, i) => {
            // Compute width from aspect at fixed height (420px desktop)
            const ratio = f.w / f.h;
            const heightDesk = 420;
            const widthDesk = Math.round(ratio * heightDesk);
            return (
              <div
                key={i}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                data-index={i}
                className="relative h-[280px] flex-shrink-0 md:h-[420px]"
                style={{ width: `${(widthDesk / heightDesk) * 280}px` }}
              >
                <div
                  className="relative h-full"
                  style={{ width: `${widthDesk}px`, maxWidth: "100%" }}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={f.w}
                    height={f.h}
                    sizes="(min-width: 768px) 60vw, 90vw"
                    className="h-full w-auto object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
                  <div className="font-mono-ui absolute bottom-3 left-3 bg-page px-2 py-1 text-[9px] tracking-[0.18em] text-fg">
                    {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
