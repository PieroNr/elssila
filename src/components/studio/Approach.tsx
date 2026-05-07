import Image from "next/image";

const STUDIO_PHOTO = {
  // Atelier / workshop photo via Unsplash
  src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80&auto=format&fit=crop",
  alt: "L'atelier du studio à Paris",
  w: 1400,
  h: 1867,
};

export default function Approach() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
        {/* Studio photo */}
        <figure className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={STUDIO_PHOTO.src}
            alt={STUDIO_PHOTO.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 opacity-20 noise-overlay" />
          <figcaption className="font-mono-ui pointer-events-none absolute left-3 top-3 bg-page/70 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-fg-3">
            STUDIO/01 · ATELIER
          </figcaption>
        </figure>

        {/* Text */}
        <div>
          <div className="micro mb-6 text-fg-3">I — Approche</div>
          <p className="font-display text-2xl leading-snug md:text-3xl">
            Elssila est un studio indépendant fondé en{" "}
            <span className="italic-display">2019</span> à Paris. Nous travaillons par
            engagement, sur le temps long, avec des marques, institutions et auteurs qui
            partagent une exigence — la matière, le silence, l&apos;écart.
          </p>

          <div className="hairline my-10" />

          <div className="micro mb-6 text-fg-3">II — Méthode</div>
          <p className="text-sm leading-relaxed text-fg-2">
            Une équipe restreinte, un atelier ouvert, des outils mélangés (argentique,
            motion capture, WebGL, presse offset). Chaque projet commence par une
            recherche, un déplacement, une note. Aucun rendu n&apos;arrive sans avoir été
            montré, défait, refait.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-2">
            Nous refusons les commandes que nous ne pouvons pas signer. Trois à cinq
            projets par an, jamais plus.
          </p>
        </div>
      </div>
    </section>
  );
}
