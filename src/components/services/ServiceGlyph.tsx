"use client";

import type { GlyphKind } from "@/data/services";

// Animated SVG glyphs for the services split-screen. Faithful port from
// claude.ai/design mock-services.jsx — the visual signature of each service.
// Animations use SMIL <animate> (works everywhere modern). Skipped via CSS
// when the user prefers reduced motion (see globals.css).

type Props = { kind: GlyphKind };

const STROKE = "var(--color-accent)";
const SUB = "var(--color-fg-3)";

function MeshGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <g fill="none" stroke={STROKE} strokeWidth="0.6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx={30 + i * 6}
            ry={20 + i * 4}
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="3" fill={STROKE}>
        <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function OrbitGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <g fill="none" stroke={SUB} strokeWidth="0.4">
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="40" />
      </g>
      <g stroke={STROKE} strokeWidth="0.8" fill="none">
        <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(20 100 100)" />
        <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(-30 100 100)" />
      </g>
      <circle cx="180" cy="100" r="4" fill={STROKE}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function GridGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <g stroke={SUB} strokeWidth="0.4" fill="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <line x1={20 + i * 16} y1="20" x2={20 + i * 16} y2="180" />
            <line x1="20" y1={20 + i * 16} x2="180" y2={20 + i * 16} />
          </g>
        ))}
      </g>
      <g stroke={STROKE} strokeWidth="1.2" fill="none">
        <path d="M 20 100 Q 60 40, 100 100 T 180 100">
          <animate
            attributeName="d"
            values="M 20 100 Q 60 40, 100 100 T 180 100;M 20 100 Q 60 160, 100 100 T 180 100;M 20 100 Q 60 40, 100 100 T 180 100"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}

function PulseGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <g stroke={STROKE} fill="none" strokeWidth="1">
        {[1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx="100" cy="100" r={20 * i} opacity={1 - i * 0.18}>
            <animate
              attributeName="r"
              values={`${20 * i};${22 * i};${20 * i}`}
              dur={`${1.6 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
      <line x1="20" y1="100" x2="180" y2="100" stroke={SUB} strokeWidth="0.4" strokeDasharray="2 4" />
      <line x1="100" y1="20" x2="100" y2="180" stroke={SUB} strokeWidth="0.4" strokeDasharray="2 4" />
    </svg>
  );
}

export default function ServiceGlyph({ kind }: Props) {
  switch (kind) {
    case "mesh":
      return <MeshGlyph />;
    case "orbit":
      return <OrbitGlyph />;
    case "grid":
      return <GridGlyph />;
    case "pulse":
      return <PulseGlyph />;
  }
}
