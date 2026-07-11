import Image from "next/image";

export default function Approach() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      {/* Rangée 1 : grande photo BW1 + texte */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
        <figure className="relative aspect-square w-full overflow-hidden">
          <Image
            src="/studio/photo-bw-1.jpg"
            alt="Sur le tournage"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover object-center grayscale"
          />
          <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
        </figure>

        <div>
          <div className="micro mb-6 text-fg-3">I — Approche</div>
          <p className="font-display text-2xl leading-snug md:text-3xl">
            Elssila, c&apos;est le nom sous lequel je conçois et réalise mes projets vidéo et
            photo, en tant que{" "}
            <span className="italic-display">vidéaste, photographe</span> et directrice
            artistique indépendante.
          </p>

          <div className="hairline my-10" />

          <p className="text-sm leading-relaxed text-fg-2">
            Diplômée en direction artistique et réalisation audiovisuelle, je travaille en
            autonomie complète sur l&apos;ensemble de la chaîne créative : de l&apos;écriture à la
            captation, jusqu&apos;au montage et à l&apos;étalonnage.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-2">
            Selon l&apos;ampleur du projet, je collabore avec d&apos;autres professionnels
            indépendants : photographes, vidéastes, pour apporter l&apos;expertise nécessaire à
            chaque étape, sans jamais perdre la cohérence artistique du projet.
          </p>
        </div>
      </div>

      {/* Rangée 2 : 2 photos sur toute la largeur */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <figure className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src="/studio/photo-bw-2.jpg"
            alt="Sur le plateau"
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover grayscale"
          />
          <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
        </figure>
        <figure className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src="/studio/photo-color.jpg"
            alt="Derrière la caméra"
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
        </figure>
      </div>
    </section>
  );
}
