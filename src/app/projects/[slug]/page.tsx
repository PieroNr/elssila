import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectMetaStrip from "@/components/projects/ProjectMetaStrip";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectGalleryHorizontal from "@/components/projects/ProjectGalleryHorizontal";
import ProjectVideos from "@/components/projects/ProjectVideos";
import ProjectCredits from "@/components/projects/ProjectCredits";
import { getAllProjects, getProjectBySlug, getAllSlugs } from "@/lib/db/projects";
import {
  projects as staticProjects,
  getProjectBySlug as getStaticBySlug,
  getProjectNeighbors as getStaticNeighbors,
  type Project,
} from "@/data/projects";

type Params = { slug: string };

export const revalidate = 3600;

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await getAllSlugs();
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }));
  } catch {}
  return staticProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const row = await getProjectBySlug(slug);
    const project = row ? (row as unknown as Project) : getStaticBySlug(slug);
    if (!project) return { title: "Projet introuvable — Elssila Studio" };
    const briefText = typeof project.brief === "string" ? project.brief : undefined;
    return {
      title: `${project.title} — Elssila Studio`,
      description: briefText,
      openGraph: {
        title: `${project.title} — Elssila Studio`,
        description: briefText,
        images: [{ url: project.hero.src, width: project.hero.w, height: project.hero.h }],
        type: "article",
      },
    };
  } catch {
    return { title: "Projet — Elssila Studio" };
  }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  // Single DB fetch — derive project, neighbors, index and total from one call.
  let project: Project | null = null;
  let neighbors: { prev: Project; next: Project } | null = null;
  let index = 0;
  let total = 0;

  try {
    const [row, allRows] = await Promise.all([
      getProjectBySlug(slug),
      getAllProjects(),
    ]);

    project = row ? (row as unknown as Project) : getStaticBySlug(slug) ?? null;

    if (allRows.length > 0) {
      const idx = allRows.findIndex((p) => p.slug === slug);
      index = idx >= 0 ? idx : 0;
      total = allRows.length;
      if (idx >= 0) {
        const prev = allRows[(idx - 1 + total) % total] as unknown as Project;
        const next = allRows[(idx + 1) % total] as unknown as Project;
        neighbors = { prev, next };
      }
    } else {
      // Fallback to static data
      index = staticProjects.findIndex((p) => p.slug === slug);
      total = staticProjects.length;
      neighbors = getStaticNeighbors(slug);
    }
  } catch {
    project = getStaticBySlug(slug) ?? null;
    index = staticProjects.findIndex((p) => p.slug === slug);
    total = staticProjects.length;
    neighbors = getStaticNeighbors(slug);
  }

  if (!project) notFound();

  return (
    <main className="relative min-h-screen bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="sticky top-0 z-30 bg-page/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Header />
        </div>
      </div>

      <ProjectHero project={project} index={index} total={total} />
      <ProjectMetaStrip project={project} />
      <ProjectBrief project={project} />
      <ProjectVideos videos={(project as { videos?: { src: string; title?: string }[] }).videos ?? []} />
      {project.gallery && project.gallery.length > 0 && (
        <ProjectGalleryHorizontal images={project.gallery} />
      )}
      {neighbors && (
        <ProjectCredits project={project} nextProject={neighbors.next} />
      )}

      <PageFooter />
    </main>
  );
}
