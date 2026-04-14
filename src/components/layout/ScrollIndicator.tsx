"use client";

import Lottie from "lottie-react";
import animData from "../../../public/lottie/scroll-anim.json";

type ScrollIndicatorProps = {
  visible: boolean;
  isDark?: boolean;
};

export default function ScrollIndicator({ visible, isDark = false }: ScrollIndicatorProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[55] -translate-x-1/2 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <Lottie
        animationData={animData}
        loop
        autoplay
        className="h-36 w-36 sm:h-44 sm:w-44"
        style={{ filter: isDark ? "brightness(0) invert(1)" : "none" }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </div>
  );
}
