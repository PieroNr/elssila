import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = { project: Project };

// Editorial intro: "Note d'intention" display copy on the left, optional
// `spread` image on the right. Falls back gracefully when no spread is set.

export default function ProjectBrief({ project }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5">
          <div className="micro mb-5 text-accent">Note d&apos;intention</div>
          <p className="font-display text-2xl leading-snug md:text-3xl">
            {project.intent ?? project.brief}
          </p>
          {project.body && (
            <p className="mt-8 max-w-md text-sm leading-relaxed text-fg-2">
              {project.body}
            </p>
          )}

          {project.role.length > 0 && (
            <div className="mt-10">
              <div className="micro-sm mb-3 text-fg-3">Rôle</div>
              <div className="italic-display text-base text-fg md:text-lg">
                {project.role.join(" · ")}
              </div>
            </div>
          )}
        </div>

        {project.spread && (
          <figure className="relative aspect-[4/3] w-full overflow-hidden md:col-span-7">
            <Image
              src={project.spread.src}
              alt={project.spread.alt}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
            <figcaption className="font-mono-ui pointer-events-none absolute right-3 top-3 bg-page/70 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-fg-3">
              SPREAD/{project.ref}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
