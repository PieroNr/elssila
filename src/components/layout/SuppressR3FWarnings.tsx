"use client";

import { useEffect } from "react";

// R3F 9.x still uses THREE.Clock internally (fixed in a future release).
// Intercept and drop this specific deprecation warning to keep the console clean.
export default function SuppressR3FWarnings() {
  useEffect(() => {
    const original = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
      original(...args);
    };
    return () => {
      console.warn = original;
    };
  }, []);
  return null;
}
