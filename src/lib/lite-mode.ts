"use client";

import { useEffect, useState } from "react";

// Detect low-power devices that can't comfortably run multiple WebGL scenes:
//   - user opted into reduced transparency
//   - < 4 GB RAM (Chrome's deviceMemory hint)
//   - < 4 logical CPU cores
// Consumers skip 3D scenes entirely when this returns true.
export function useLiteMode(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    setLite(
      window.matchMedia("(prefers-reduced-transparency: reduce)").matches ||
        (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) ||
        (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4),
    );
  }, []);

  return lite;
}
