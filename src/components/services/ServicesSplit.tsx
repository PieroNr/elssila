"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/data/services";
import ServiceGlyph from "./ServiceGlyph";

// Split-screen services view: list on the left (hovering enlarges and expands),
// sticky glyph + meta column on the right reflecting the active service.

export default function ServicesSplit() {
  const [activeId, setActiveId] = useState<string>(services[0]?.id ?? "01");
  const active = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
      {/* Left — list */}
      <ul>
        {services.map((s, i) => {
          const isActive = s.id === active.id;
          return (
            <li
              key={s.id}
              onMouseEnter={() => setActiveId(s.id)}
              onFocus={() => setActiveId(s.id)}
              className="grid items-baseline gap-4 border-b py-7"
              style={{
                gridTemplateColumns: "60px 1fr auto",
                borderTop: i === 0 ? "0.5px solid var(--color-separator)" : undefined,
                borderColor: "var(--color-separator)",
              }}
            >
              <span
                className="micro-sm transition-colors"
                style={{
                  color: isActive ? "var(--color-accent)" : "var(--color-fg-3)",
                }}
              >
                №{s.id}
              </span>

              <div>
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className="font-display block text-left transition-[color,font-size] duration-300"
                  style={{
                    fontSize: isActive ? "clamp(2rem, 5vw, 3.5rem)" : "clamp(1.5rem, 3.5vw, 2.4rem)",
                    lineHeight: 0.95,
                    color: isActive ? "var(--color-fg)" : "var(--color-fg-3)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.fr}
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity] duration-500"
                  style={{
                    maxHeight: isActive ? 240 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-2">
                    {s.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.disciplines.map((d) => (
                      <span
                        key={d}
                        className="micro-sm border px-2 py-1"
                        style={{
                          borderColor: "var(--color-separator)",
                          color: "var(--color-fg-2)",
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span
                aria-hidden
                className="text-xl transition-[color,transform] duration-300"
                style={{
                  color: isActive ? "var(--color-accent)" : "var(--color-fg-4)",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                }}
              >
                →︎
              </span>
            </li>
          );
        })}
      </ul>

      {/* Right — glyph + meta */}
      <div className="md:sticky md:top-24 md:self-start">
        <div
          className="relative aspect-square w-full bg-card-hover"
          style={{ border: "0.5px solid var(--color-separator)" }}
        >
          <ServiceGlyph kind={active.glyph} />
          <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
          <div className="micro-sm font-mono-ui pointer-events-none absolute left-4 top-4 text-fg-3">
            ▌︎{active.glyph.toUpperCase()} · WIREFRAME
          </div>
          <div className="micro-sm font-mono-ui pointer-events-none absolute right-4 bottom-4 text-fg-3">
            {active.id}/04
          </div>
        </div>

        {/* Meta block */}
        <div className="mt-8">
          <div className="micro-sm mb-2 text-fg-3">Process</div>
          <div className="italic-display text-base leading-snug md:text-lg">
            {active.process ?? "—"}
          </div>
        </div>

        <Link
          href="/contact"
          className="mt-10 block w-full bg-accent px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-accent-hover"
        >
          Démarrer un projet →︎
        </Link>
      </div>
    </div>
  );
}
