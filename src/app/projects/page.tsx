// src/app/projects/page.tsx
import Header from "@/components/layout/Header";
import { cabinet, neima } from "@/lib/fonts";

const projects = [
  {
    id: "01",
    title: "Void Campaign",
    category: "Brand Identity",
    year: "2025",
    tags: ["Direction artistique", "Motion"],
  },
  {
    id: "02",
    title: "Solstice Editorial",
    category: "Editorial",
    year: "2025",
    tags: ["Photographie", "Layout"],
  },
  {
    id: "03",
    title: "NOMA Manifesto",
    category: "Digital Experience",
    year: "2024",
    tags: ["3D", "Web"],
  },
  {
    id: "04",
    title: "Rift Collection",
    category: "Fashion",
    year: "2024",
    tags: ["Direction artistique", "Vidéo"],
  },
  {
    id: "05",
    title: "Archive III",
    category: "Installation",
    year: "2023",
    tags: ["Scénographie", "Print"],
  },
];

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen bg-[#fdf2e9] text-slate-900 overflow-hidden">
      {/* GRAIN OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
        <Header />

        {/* PAGE CONTENT */}
        <section className="flex-1 pt-16 pb-24">
          {/* Titre de section */}
          <div className="mb-16 flex items-end justify-between">
            <h1 className={`${neima.className} text-6xl md:text-8xl tracking-tight leading-none`}>
              Projects
            </h1>
            <p className={`${cabinet.className} text-[0.65rem] tracking-[0.3em] uppercase text-slate-400 mb-2`}>
              {projects.length} travaux sélectionnés
            </p>
          </div>

          {/* Liste des projets */}
          <div className="divide-y divide-black/10">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center justify-between gap-6 py-7 cursor-pointer transition-colors hover:bg-black/[0.02] -mx-3 px-3"
              >
                {/* Numéro */}
                <span className={`${cabinet.className} w-8 shrink-0 text-[0.6rem] tracking-[0.25em] text-slate-400`}>
                  {project.id}
                </span>

                {/* Titre */}
                <div className="flex-1">
                  <h2 className={`${neima.className} text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-[#d9772c]`}>
                    {project.title}
                  </h2>
                </div>

                {/* Tags */}
                <div className="hidden md:flex gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${cabinet.className} border border-black/15 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-slate-500`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Catégorie + Année */}
                <div className="flex flex-col items-end shrink-0">
                  <span className={`${cabinet.className} text-[0.65rem] tracking-[0.2em] uppercase text-slate-500`}>
                    {project.category}
                  </span>
                  <span className={`${cabinet.className} text-[0.6rem] tracking-[0.15em] text-slate-400`}>
                    {project.year}
                  </span>
                </div>

                {/* Flèche */}
                <span className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#d9772c]">
                  →
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
