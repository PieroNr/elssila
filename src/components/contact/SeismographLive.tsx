"use client";

import { useEffect, useRef, useState } from "react";

// Live seismograph — animated SVG polyline driven by RAF. The trace is a
// stack of sin waves with bell-curve "spikes" added in for character. Pauses
// when the tab is hidden, when reduced motion is requested, and on lite-mode.

function detectLiteMode(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(prefers-reduced-transparency: reduce)").matches ||
    (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) ||
    (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4)
  );
}

function buildPath(phase: number): string {
  const pts: string[] = [];
  for (let x = 0; x < 600; x += 4) {
    const t = (x + phase) * 0.04;
    const spike =
      Math.sin(t * 7.3) *
      Math.exp(-Math.pow(((x % 200) - 100) / 30, 2)) *
      18;
    const y = 40 + Math.sin(t) * 6 + Math.sin(t * 2.7) * 3 + spike;
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

export default function SeismographLive() {
  const polyRef = useRef<SVGPolylineElement>(null);
  const [staticTrace, setStaticTrace] = useState<string>(() => buildPath(0));

  useEffect(() => {
    if (detectLiteMode()) {
      // Render a single frozen frame and bail out — no RAF.
      setStaticTrace(buildPath(0));
      return;
    }

    let rafId = 0;
    let phase = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      phase += 1;
      if (polyRef.current) {
        polyRef.current.setAttribute("points", buildPath(phase));
      }
      rafId = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <svg viewBox="0 0 600 80" className="block h-20 w-full" aria-hidden>
      <line
        x1="0"
        y1="40"
        x2="600"
        y2="40"
        stroke="var(--color-fg-4)"
        strokeWidth="0.5"
        strokeDasharray="2 4"
      />
      <polyline
        ref={polyRef}
        points={staticTrace}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
    </svg>
  );
}
