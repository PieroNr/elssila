import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectMetaStrip from "@/components/projects/ProjectMetaStrip";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectGalleryHorizontal from "@/components/projects/ProjectGalleryHorizontal";
import ProjectCredits from "@/components/projects/ProjectCredits";
import { getAllProjects, getProjectBySlug } from "@/lib/db/projects";
import {
  projects as staticProjects,
  getProjectBySlug as getStaticBySlug,
  getProjectNeighbors as getStaticNeighbors,
  type Project,
} from "@/data/projects";

type Params = { slug: string };

export const dynamic = "force-dynamic";

async function resolveProject(slug: string) {
  try {
    const row = await getProjectBySlug(slug);
    if (row) return row as unknown as Project;
  } catch {}
  return getStaticBySlug(slug) ?? null;
}

async function resolveNeighbors(slug: string) {
  try {
    const rows = await getAllProjects();
    if (rows.length > 0) {
      const idx = rows.findIndex((p) => p.slug === slug);
      if (idx === -1) return null;
      const prev = rows[(idx - 1 + rows.length) % rows.length] as unknown as Project;
      const next = rows[(idx + 1) % rows.length] as unknown as Project;
      return { prev, next };
    }
  } catch {}
  return getStaticNeighbors(slug);
}

async function resolveIndex(slug: string): Promise<number> {
  try {
    const rows = await getAllProjects();
    if (rows.length > 0) return rows.findIndex((p) => p.slug === slug);
  } catch {}
  return staticProjects.findIndex((p) => p.slug === slug);
}

async function resolveTotalCount(): Promise<number> {
  try {
    const rows = await getAllProjects();
    if (rows.length > 0) return rows.length;
  } catch {}
  return staticProjects.length;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveProject(slug);
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
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await resolveProject(slug);
  if (!project) notFound();

  const [neighbors, index, total] = await Promise.all([
    resolveNeighbors(slug),
    resolveIndex(slug),
    resolveTotalCount(),
  ]);

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
      <ProjectGalleryHorizontal images={project.gallery} />
      {neighbors && (
        <ProjectCredits project={project} nextProject={neighbors.next} />
      )}

      <PageFooter />
    </main>
  );
}
