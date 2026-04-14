"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initialise au centre de la fenêtre
    pointerTarget.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    pointerCurrent.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    cursor.style.setProperty("--cursor-x", `${pointerTarget.current.x}px`);
    cursor.style.setProperty("--cursor-y", `${pointerTarget.current.y}px`);

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.current = { x: event.clientX, y: event.clientY };

      const target = event.target as HTMLElement | null;
      const isClickable = Boolean(
        target?.closest("a, button, [role='button'], input, select, textarea, label, [data-clickable='true']")
      );
      cursor.classList.toggle("is-active", isClickable);
      cursor.classList.remove("is-hidden");
    };

    const handlePointerLeave = () => {
      cursor.classList.add("is-hidden");
    };

    const handlePointerEnter = () => {
      cursor.classList.remove("is-hidden");
    };

    let rafId = 0;
    let running = false;

    const startRAF = () => {
      if (running || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      const dx = pointerTarget.current.x - pointerCurrent.current.x;
      const dy = pointerTarget.current.y - pointerCurrent.current.y;
      pointerCurrent.current.x += dx * 0.18;
      pointerCurrent.current.y += dy * 0.18;
      cursor.style.setProperty("--cursor-x", `${pointerCurrent.current.x}px`);
      cursor.style.setProperty("--cursor-y", `${pointerCurrent.current.y}px`);
      // Stop once converged (< 0.5 px remaining)
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        running = false;
      } else {
        startRAF();
      }
    };

    // Wrap original pointermove to also restart RAF after convergence/hide
    const handlePointerMoveWithRAF = (event: PointerEvent) => {
      handlePointerMove(event);
      startRAF();
    };

    startRAF();
    document.addEventListener("pointermove", handlePointerMoveWithRAF);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("pointerenter", handlePointerEnter);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("pointermove", handlePointerMoveWithRAF);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("pointerenter", handlePointerEnter);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="app-cross-cursor is-hidden pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}