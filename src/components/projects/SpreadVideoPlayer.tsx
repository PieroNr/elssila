"use client";

import { useState } from "react";

function getYtId(src: string): string | null {
  const m = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getEmbedUrl(src: string): string | null {
  const ytId = getYtId(src);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
  const vimeo = src.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return null;
}

export default function SpreadVideoPlayer({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  const embedUrl = getEmbedUrl(src);
  const ytId = getYtId(src);

  if (!embedUrl) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <video src={src} controls playsInline className="absolute inset-0 h-full w-full object-cover" title={alt} />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {loaded ? (
        <iframe
          src={embedUrl}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          {ytId ? (
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(135deg, rgba(183,211,213,0.04) 0px, rgba(183,211,213,0.04) 2px, transparent 2px, transparent 14px), linear-gradient(160deg, #0d1f2d, #040d14)",
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
          <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setLoaded(true)}
              aria-label={`Lancer la vidéo : ${alt || "vidéo"}`}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15 text-base text-white backdrop-blur-md transition-transform hover:scale-110 md:h-20 md:w-20 md:text-lg"
            >
              ▶︎
            </button>
          </div>

          {alt && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 md:px-6 md:py-4">
              <span className="micro text-white/75">{alt}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
