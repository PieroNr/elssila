// src/app/services/page.tsx
import Header from "@/components/layout/Header";
import { cabinet, neima } from "@/lib/fonts";

const services = [
  {
    id: "01",
    title: "Direction Artistique",
    description:
      "Conception et pilotage de l'identité visuelle d'un projet — du concept initial au rendu final. Nous définissons la tonalité, la palette, le langage graphique.",
    disciplines: ["Brand Identity", "Visual Strategy", "Art Direction"],
  },
  {
    id: "02",
    title: "Production Visuelle",
    description:
      "Photographie, vidéo, motion design — nous produisons des contenus à haute valeur éditoriale, adaptés aux besoins de la mode, du luxe et de la culture.",
    disciplines: ["Photography", "Film", "Motion Design"],
  },
  {
    id: "03",
    title: "Expériences Digitales",
    description:
      "Création d'interfaces, de sites et d'installations numériques qui prolongent l'univers de la marque dans l'espace web et interactif.",
    disciplines: ["Web Design", "3D / WebGL", "Interactive"],
  },
  {
    id: "04",
    title: "Stratégie de Contenu",
    description:
      "Accompagnement éditorial et stratégique pour penser la diffusion des contenus sur les plateformes, en cohérence avec l'identité de marque.",
    disciplines: ["Editorial", "Social", "Copywriting"],
  },
];

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen bg-page text-fg overflow-hidden">
      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="flex-1 pt-16 pb-24">
          <div className="mb-20">
            <h1 className={`${neima.className} text-6xl md:text-8xl tracking-tight leading-none`}>
              Services
            </h1>
            <p className={`${cabinet.className} mt-4 text-[0.65rem] tracking-[0.3em] uppercase text-accent`}>
              Ce que nous faisons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-fg/10">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-card p-10 flex flex-col gap-6 transition-colors hover:bg-card-hover"
              >
                <span className={`${cabinet.className} text-[0.6rem] tracking-[0.3em] text-fg-3 uppercase`}>
                  {service.id}
                </span>

                <h2 className={`${neima.className} text-3xl md:text-4xl tracking-tight leading-tight`}>
                  {service.title}
                </h2>

                <p className={`${cabinet.className} text-sm leading-relaxed text-fg-2 tracking-[0.02em]`}>
                  {service.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-fg/[0.08]">
                  {service.disciplines.map((d) => (
                    <span
                      key={d}
                      className={`${cabinet.className} text-[0.55rem] tracking-[0.2em] uppercase text-fg-3`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-center text-center gap-6">
            <p className={`${neima.className} text-2xl md:text-3xl`}>
              Un projet en tête ?
            </p>
            <button
              className={`${cabinet.className} rounded-none bg-accent px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover`}
            >
              Nous contacter
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
