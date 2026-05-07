"use client";

import Link from "next/link";

// Always-dark footer (independent of theme). Hard-coded colors are intentional.
const BG = "#01060d";
const FG = "#fdf2e9";
const FG_60 = "rgba(253,242,233,0.65)";
const FG_50 = "rgba(253,242,233,0.5)";
const FG_45 = "rgba(253,242,233,0.45)";
const FG_40 = "rgba(253,242,233,0.4)";
const FG_18 = "rgba(253,242,233,0.18)";
const FG_10 = "rgba(253,242,233,0.1)";

const STUDIO_LINKS: [string, string][] = [
  ["Manifesto", "/studio"],
  ["Équipe", "/studio#team"],
  ["Presse", "/studio#press"],
  ["Carrières", "/studio#careers"],
];

const NAV_LINKS: [string, string][] = [
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Archive", "/projects"],
  ["Contact", "/contact"],
];

const SOCIAL: [string, string][] = [
  ["Instagram", "@elssila.studio"],
  ["Are.na", "/elssila"],
  ["Vimeo", "/elssila"],
  ["LinkedIn", "/elssila"],
];

const MARQUEE_ITEMS = ["Direction Artistique", "Photography", "Film", "Web&3D"];

export default function HomeFooter() {
  return (
    <footer
      className="relative overflow-hidden pt-24 pb-8"
      style={{ background: BG, color: FG, borderTop: `0.5px solid ${FG_18}` }}
    >
      {/* Mark top-right */}
      <div
        className="micro-sm font-mono-ui absolute top-10 right-8 flex items-center gap-3 md:right-16"
        style={{ color: FG_45 }}
      >
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--color-accent-vivid)", boxShadow: "0 0 12px var(--color-accent-vivid)" }}
        />
        <span>ELS · MMXXV</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-16">
        <div className="micro" style={{ color: FG_50 }}>
          ⌗ Get in touch
        </div>
        <div className="mt-3 h-[0.5px] w-full" style={{ background: FG_18 }} />

        <h3
          className="font-display mt-8"
          style={{
            fontSize: "clamp(56px, 8vw, 112px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            maxWidth: 800,
            margin: "32px 0 0",
          }}
        >
          Un projet,{" "}
          <span className="italic-display" style={{ color: "var(--color-accent-vivid)" }}>
            une intuition
          </span>{" "}
          ?
        </h3>

        <div className="mt-10 flex flex-wrap gap-3.5">
          <Link
            href="/contact"
            className="bg-accent px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover"
          >
            Démarrer un projet
          </Link>
          <a
            href="mailto:studio@elssila.com"
            className="px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.4)", color: "#fff" }}
          >
            studio@elssila.com
          </a>
        </div>

        {/* Columns */}
        <div
          className="mt-24 grid gap-12 pt-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]"
          style={{ borderTop: `0.5px solid ${FG_18}` }}
        >
          <div>
            <div className="italic-display" style={{ fontSize: 32 }}>
              Elssila
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: FG_60 }}>
              Studio de production créative indépendant.
              <br />
              Direction artistique, image, expériences.
            </p>
            <div
              className="micro-sm font-mono-ui mt-6"
              style={{ color: FG_40 }}
            >
              EST. 2019 · MMXXV
              <br />
              48.8566° N · 2.3522° E
            </div>
          </div>

          <FooterColumn label="Studio" items={STUDIO_LINKS} />
          <FooterColumn label="Navigation" items={NAV_LINKS} />

          <div>
            <div className="micro-sm mb-4" style={{ color: FG_40 }}>
              Suivre
            </div>
            {SOCIAL.map(([k, v]) => (
              <a
                key={k}
                href="#"
                className="flex items-center justify-between py-2 text-sm"
                style={{ color: FG, borderBottom: `0.5px solid ${FG_10}` }}
              >
                <span>{k}</span>
                <span style={{ color: FG_45 }}>{v} ↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div
          className="mt-16 overflow-hidden whitespace-nowrap py-8"
          style={{ borderTop: `0.5px solid ${FG_18}`, borderBottom: `0.5px solid ${FG_18}` }}
          aria-hidden
        >
          <div
            className="marquee-track italic-display"
            style={{ fontSize: 64, letterSpacing: "-0.02em", color: "rgba(253,242,233,0.85)" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                {MARQUEE_ITEMS.map((m, j) => (
                  <span key={m}>
                    {m}{" "}
                    <span style={{ color: "var(--color-accent-vivid)" }}>·</span>
                    {j === MARQUEE_ITEMS.length - 1 ? " " : " "}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <span className="micro-sm" style={{ color: FG_40 }}>
            © Elssila Studio · Tous droits réservés
          </span>
          <span className="micro-sm font-mono-ui" style={{ color: FG_40 }}>
            VOL. 01 · ISO 400 · v1.0
          </span>
          <span className="micro-sm" style={{ color: FG_40 }}>
            Mentions légales · Crédits
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.12] noise-overlay" />
    </footer>
  );
}

function FooterColumn({ label, items }: { label: string; items: [string, string][] }) {
  return (
    <div>
      <div className="micro-sm mb-4" style={{ color: FG_40 }}>
        {label}
      </div>
      {items.map(([l, h]) => (
        <Link
          key={l}
          href={h}
          className="block py-2 text-sm transition-colors hover:text-white"
          style={{ color: "rgba(253,242,233,0.85)" }}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
