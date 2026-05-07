"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

// 8-panel page transition. Each panel falls in (scaleY 0→1, origin top), then
// retracts (scaleY 1→0, origin bottom) with a 0.05s stagger between panels.
// Skipped on the Home route (the user wants a friction-free return) and when
// reduced motion is requested.

const PANEL_COUNT = 8;
const STAGGER = 0.05;
const PANEL_DURATION = 0.7;
const OUT_DELAY = 0.75;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (pathname === "/" || reduce) {
    return <>{children}</>;
  }

  return (
    <>
      <div aria-hidden className="page-panels">
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <div
            key={i}
            className="page-panel"
            style={{ animationDelay: `${i * STAGGER}s, ${OUT_DELAY + i * STAGGER}s` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: OUT_DELAY - 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}