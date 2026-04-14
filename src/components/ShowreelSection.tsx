"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cabinet, neima } from "@/lib/fonts";

type ShowreelSectionProps = {
  src?: string;
};

export default function ShowreelSection({ src = "" }: ShowreelSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Pause when scrolled out of view
  useEffect(() => {
    if (!videoRef.current || !src) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          setPlaying(false);
        } else if (playing) {
          void video.play();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, playing]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={sectionRef} className="relative z-10">

      {/* Label + séparateur — contraint à max-w-6xl */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-6 pt-24"
      >
        <div className={`${cabinet.className} flex items-center justify-between text-[0.6rem] uppercase tracking-[0.3em] text-fg-3`}>
          <span>Showreel</span>
          <span>2025</span>
        </div>
        <div className="mt-3 h-[0.5px] w-full bg-[var(--color-separator)]" />
      </motion.div>

      {/* Vidéo — pleine largeur, aucune contrainte de conteneur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        className="relative mt-6 aspect-video w-full overflow-hidden"
      >
        {src ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <div className={`${neima.className} text-xs uppercase tracking-[0.4em] text-white/20`}>
              Showreel
            </div>
            <div className={`${cabinet.className} mt-3 text-[0.55rem] uppercase tracking-[0.3em] text-white/10`}>
              Vidéo à venir
            </div>
          </div>
        )}

        {/* Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-10 noise-overlay" />

        {/* Contrôles bas de vidéo */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent px-6 py-5">
          <button
            type="button"
            onClick={togglePlay}
            className={`${cabinet.className} flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white`}
          >
            <span>{playing && src ? "▶" : "▶"}</span>
            {playing && src ? "Pause" : "Play"}
          </button>
          <span className={`${cabinet.className} text-[0.55rem] uppercase tracking-[0.25em] text-white/40`}>
            VOL. 01
          </span>
        </div>
      </motion.div>

      {/* Tagline — contraint à max-w-6xl */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className={`${cabinet.className} mx-auto max-w-6xl px-6 mt-5 pb-32 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.28em] text-fg-3`}
      >
        <span>Defining the Visual Edge of Tomorrow</span>
        <span className="text-accent">→</span>
      </motion.div>

    </div>
  );
}
