"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type ScrollIndicatorProps = {
  visible: boolean;
  isDark?: boolean;
};

export default function ScrollIndicator({ visible, isDark = false }: ScrollIndicatorProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      const response = await fetch("/lottie/scroll-anim.json", { signal: controller.signal });
      if (!response.ok) return;
      const data = (await response.json()) as object;
      setAnimationData(data);
    };

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[55] -translate-x-1/2 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {animationData && (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          className="h-36 w-36 sm:h-44 sm:w-44"
          style={{ filter: isDark ? "brightness(0) invert(1)" : "none" }}
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        />
      )}
    </div>
  );
}


