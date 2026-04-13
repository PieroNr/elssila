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
    <main className="relative min-h-screen bg-page text-fg overflow-hidden">
      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="flex-1 pt-16 pb-24">
          <div className="mb-16 flex items-end justify-between">
            <h1 className={`${neima.className} text-6xl md:text-8xl tracking-tight leading-none`}>
              Projects
            </h1>
            <p className={`${cabinet.className} text-[0.65rem] tracking-[0.3em] uppercase text-fg-3 mb-2`}>
              {projects.length} travaux sélectionnés
            </p>
          </div>

          <div className="divide-y divide-fg/10">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center justify-between gap-6 py-7 cursor-pointer transition-colors hover:bg-fg/[0.02] -mx-3 px-3"
              >
                <span className={`${cabinet.className} w-8 shrink-0 text-[0.6rem] tracking-[0.25em] text-fg-3`}>
                  {project.id}
                </span>

                <div className="flex-1">
                  <h2 className={`${neima.className} text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-accent`}>
                    {project.title}
                  </h2>
                </div>

                <div className="hidden md:flex gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${cabinet.className} border border-fg/15 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-fg-2`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className={`${cabinet.className} text-[0.65rem] tracking-[0.2em] uppercase text-fg-2`}>
                    {project.category}
                  </span>
                  <span className={`${cabinet.className} text-[0.6rem] tracking-[0.15em] text-fg-3`}>
                    {project.year}
                  </span>
                </div>

                <span className="shrink-0 text-fg-4 transition-transform group-hover:translate-x-1 group-hover:text-accent">
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
