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

      {/* filter must reach "none" (not blur(0px)) so fixed descendants keep
          the viewport as their containing block — otherwise they drift on scroll */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "none" }}
      >
        {children}
      </motion.div>
    </>
  );
}