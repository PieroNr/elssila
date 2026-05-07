import Link from "next/link";
import { cabinet, neima } from "@/lib/fonts";

const STUDIO_EMAIL = "studio@elssila.com";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-fg/10 bg-page text-fg">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-10">
        {/* CTA statement */}
        <div className="flex flex-col items-start gap-8 pb-20 md:flex-row md:items-end md:justify-between">
          <h2
            className={`${neima.className} max-w-2xl text-4xl leading-[1.05] tracking-tight md:text-6xl`}
          >
            Discutons de votre
            <br />
            prochain projet.
          </h2>

          <Link
            href="/contact"
            className={`${cabinet.className} inline-flex items-center gap-3 rounded-none bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-accent-hover`}
          >
            Nous contacter
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-12 border-t border-fg/10 pt-12 md:grid-cols-3">
          <div>
            <div
              className={`${cabinet.className} mb-4 text-[0.55rem] tracking-[0.32em] uppercase text-fg-3`}
            >
              Studio
            </div>
            <div className={`${neima.className} text-2xl uppercase italic`}>Elssila</div>
            <p className={`${cabinet.className} mt-3 max-w-xs text-sm leading-relaxed text-fg-2`}>
              Direction artistique, photo et vidéo pour la mode, le luxe et la culture.
            </p>
          </div>

          <div>
            <div
              className={`${cabinet.className} mb-4 text-[0.55rem] tracking-[0.32em] uppercase text-fg-3`}
            >
              Naviguer
            </div>
            <ul className={`${cabinet.className} flex flex-col gap-2 text-sm`}>
              <li>
                <Link href="/projects" className="text-fg-2 transition-colors hover:text-fg">
                  Projets
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-fg-2 transition-colors hover:text-fg">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-fg-2 transition-colors hover:text-fg">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div
              className={`${cabinet.className} mb-4 text-[0.55rem] tracking-[0.32em] uppercase text-fg-3`}
            >
              Contact direct
            </div>
            <a
              href={`mailto:${STUDIO_EMAIL}`}
              className={`${cabinet.className} block text-sm text-fg-2 underline-offset-4 transition-colors hover:text-accent hover:underline`}
            >
              {STUDIO_EMAIL}
            </a>
            <p className={`${cabinet.className} mt-3 text-sm text-fg-3`}>Paris · Sur rendez-vous</p>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-16 flex items-center justify-between border-t border-fg/10 pt-6">
          <span className={`${cabinet.className} text-[0.55rem] tracking-[0.3em] uppercase text-fg-3`}>
            © {year} Elssila Studio
          </span>
          <span className={`${cabinet.className} text-[0.55rem] tracking-[0.3em] uppercase text-fg-3`}>
            ISO 400 · VOL. 01
          </span>
        </div>
      </div>
    </footer>
  );
}
