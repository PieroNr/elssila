import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import ArchiveTable from "@/components/projects/ArchiveTable";
import { getAllProjects } from "@/lib/db/projects";
import { projects as staticProjects } from "@/data/projects";
import type { Project } from "@/data/projects";

export const metadata = {
  title: "Projets — Elssila Studio",
  description:
    "Les projets vidéos et photos réalisés durant ces deux dernières années.",
};

// Revalidate every hour as a safety fallback.
// Admin saves call revalidatePath("/projects") for immediate cache bust.
export const revalidate = 3600;

export default async function ProjectsPage() {
  let allProjects: Project[] = [];
  try {
    const rows = await getAllProjects();
    allProjects = rows.length > 0 ? (rows as unknown as Project[]) : staticProjects;
  } catch {
    allProjects = staticProjects;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="pt-12 pb-32">
          <div className="flex items-baseline justify-between">
            <div className="micro text-fg-3">⌗ Projets · 2025 →︎ 2026</div>
          </div>
          <div className="hairline mt-3" />

          <h1 className="font-display mt-12 text-6xl leading-none tracking-tight md:text-9xl">
            <span className="italic-display">Index</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="font-display mt-6 max-w-xl text-lg leading-snug text-fg-2 md:text-xl">
            Les projets vidéos et photos réalisés durant ces deux dernières années.
          </p>

          <ArchiveTable projects={allProjects} />

        </section>
      </div>

      <PageFooter />
    </main>
  );
}
