import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectMetaStrip from "@/components/projects/ProjectMetaStrip";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectGalleryHorizontal from "@/components/projects/ProjectGalleryHorizontal";
import ProjectCredits from "@/components/projects/ProjectCredits";
import {
  projects,
  getProjectBySlug,
  getProjectNeighbors,
} from "@/data/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable — Elssila Studio" };

  return {
    title: `${project.title} — Elssila Studio`,
    description: project.brief,
    openGraph: {
      title: `${project.title} — Elssila Studio`,
      description: project.brief,
      images: [{ url: project.hero.src, width: project.hero.w, height: project.hero.h }],
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const neighbors = getProjectNeighbors(slug);
  const index = projects.findIndex((p) => p.slug === slug);

  return (
    <main className="relative min-h-screen bg-page text-fg">
      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      {/* Sticky translucent header — overlays the hero */}
      <div className="sticky top-0 z-30 bg-page/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Header />
        </div>
      </div>

      <ProjectHero project={project} index={index} total={projects.length} />
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
