"use client";

// Slow horizontal marquee. Pure CSS animation (transform-based, GPU-only).
// Pauses when the user opted into reduced motion.

const ITEMS = [
  "Photo",
  "Réalisation",
  "Direction artistique",
  "Préproduction",
  "Production",
  "Postproduction",
];

export default function MarqueeBand() {
  // Three repetitions guarantee the marquee never reveals an empty edge,
  // because we translate by -33.333% per loop (one full set width).
  const set = (
    <span className="marquee-set inline-flex shrink-0 items-baseline">
      {ITEMS.map((label, i) => (
        <span key={i} className="inline-flex items-baseline">
          <span className={i % 2 === 1 ? "italic-display" : ""}>{label}</span>
          <span className="px-6 text-accent">·</span>
        </span>
      ))}
    </span>
  );

  return (
    <section
      aria-hidden
      className="overflow-hidden border-y border-fg/10 py-8 md:py-10"
      style={{ borderColor: "var(--color-separator)" }}
    >
      <div className="marquee-track inline-flex whitespace-nowrap text-5xl tracking-tight md:text-7xl">
        {set}
        {set}
        {set}
      </div>

      <style>{`
        .marquee-track {
          font-family: var(--font-neima), "Times New Roman", serif;
          letter-spacing: -0.01em;
          animation: marquee 36s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.333%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
