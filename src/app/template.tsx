"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

// Single-bar horizontal sweep: slides in from left, pauses, exits right.
// CSS-driven (template.tsx remounts per route — CSS handles the sequence
// correctly without needing AnimatePresence exit hooks).
// Skipped on Home (friction-free return) and when reduced motion is set.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (pathname === "/" || reduce) {
    return <>{children}</>;
  }

  return (
    <>
      <div aria-hidden className="page-overlay pointer-events-none fixed inset-0 z-[60]" />

      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}