"use client";

import Link from "next/link";
import LangSwitcher from "@/components/ui/LangSwitcher";
import { useLang, t } from "@/lib/language";

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
  ["Manifeste", "/studio"],
  ["Équipe", "/studio#team"],
  ["Presse", "/studio#press"],
  ["Carrières", "/studio#careers"],
];

const NAV_LINK_HREFS: [string, string][] = [
  ["/projects", "projects"],
  ["/services", "services"],
  ["/studio", "studio"],
  ["/contact", "contact"],
] as const;

const SOCIAL: [string, string][] = [
  ["Instagram", "@elssila.studio"],
  ["Are.na", "/elssila"],
  ["Vimeo", "/elssila"],
  ["LinkedIn", "/elssila"],
];

const MARQUEE_ITEMS = ["Photo", "Réalisation", "Direction artistique", "Préproduction", "Production", "Postproduction"];

export function PageFooter() {
  return <HomeFooter showMarquee={false} />;
}

export default function HomeFooter({ showMarquee = true }: { showMarquee?: boolean }) {
  const { lang } = useLang();
  return (
    <footer
      className="relative overflow-hidden pt-12 pb-6 md:pt-24 md:pb-8"
      style={{ background: BG, color: FG, borderTop: `0.5px solid ${FG_18}` }}
    >
      {/* Mark top-right — hidden on small mobile to save space */}
      <div
        className="micro-sm font-mono-ui absolute top-8 right-6 hidden items-center gap-3 sm:flex md:right-16"
        style={{ color: FG_45 }}
      >
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--color-accent-vivid)", boxShadow: "0 0 12px var(--color-accent-vivid)" }}
        />
        <span>ELSSILA · 2026</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-16">
        <div className="micro" style={{ color: FG_50 }}>
          {t.home_footer.tag[lang]}
        </div>
        <div className="mt-3 h-[0.5px] w-full" style={{ background: FG_18 }} />

        <h3
          className="font-display mt-6 md:mt-8"
          style={{
            fontSize: "clamp(40px, 8vw, 112px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            maxWidth: 800,
            margin: "24px 0 0",
          }}
        >
          {lang === "fr" ? <>Un projet,{" "}<span className="italic-display" style={{ color: "var(--color-accent-vivid)" }}>une idée</span>{" "}?</> : <>A project,{" "}<span className="italic-display" style={{ color: "var(--color-accent-vivid)" }}>an idea</span>?</>}
        </h3>

        <div className="mt-7 flex flex-wrap gap-2.5 md:mt-10 md:gap-3.5">
          <Link
            href="/contact"
            className="bg-accent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover md:px-9 md:py-3.5"
          >
            {t.home_footer.cta_btn[lang]}
          </Link>
          <a
            href="mailto:elssila.pro@gmail.com"
            className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors md:px-9 md:py-3.5"
            style={{ border: "1px solid rgba(255,255,255,0.4)", color: "#fff" }}
          >
            elssila.pro@gmail.com
          </a>
        </div>

        {/* Columns — on mobile: 2 cols (brand + nav), on desktop: 4 cols */}
        <div
          className="mt-10 grid grid-cols-2 gap-8 pt-8 md:mt-24 md:grid-cols-[1.5fr_1fr] md:gap-12 md:pt-10"
          style={{ borderTop: `0.5px solid ${FG_18}` }}
        >
          {/* Brand col — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="italic-display" style={{ fontSize: 28 }}>
              Elssila
            </div>
            <p className="mt-2 text-sm leading-relaxed md:mt-3 md:max-w-xs" style={{ color: FG_60 }}>
              {t.home_footer.desc[lang].split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </p>
            <LangSwitcher className="mt-4" />
          </div>

          {/* Navigation col */}
          <div>
            <div className="micro-sm mb-3" style={{ color: FG_40 }}>{t.home_footer.nav_label[lang]}</div>
            {NAV_LINK_HREFS.map(([h, key]) => (
              <Link key={h} href={h} className="block py-1.5 text-sm transition-colors hover:text-white" style={{ color: "rgba(253,242,233,0.85)" }}>
                {t.nav[key as keyof typeof t.nav][lang]}
              </Link>
            ))}
          </div>
        </div>

        {/* Marquee — home only, desktop only */}
        {showMarquee && (
          <div
            className="mt-12 hidden overflow-hidden whitespace-nowrap py-8 md:mt-16 md:block"
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
        )}

        {/* Bottom row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 md:mt-8 md:gap-4">
          <span className="micro-sm" style={{ color: FG_40 }}>
            {t.home_footer.copy[lang]}
          </span>
          <span className="micro-sm font-mono-ui hidden md:inline" style={{ color: FG_40 }}>
            VOL. 01 · ISO 400 · v1.0
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
