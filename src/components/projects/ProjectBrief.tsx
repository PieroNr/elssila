import Image from "next/image";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import type { Project, RichTextDoc, ProjectMedia } from "@/data/projects";
import SpreadVideoPlayer from "./SpreadVideoPlayer";

type Props = { project: Project };

function renderBrief(brief: string | RichTextDoc): string {
  if (typeof brief === "string") return brief;
  if (!brief || !("type" in brief)) return "";
  try {
    return generateHTML(brief as Parameters<typeof generateHTML>[0], [StarterKit, Link]);
  } catch {
    return "";
  }
}

function isVideo(media: ProjectMedia): media is { type: "video"; src: string; alt: string } {
  return media.type === "video";
}

export default function ProjectBrief({ project }: Props) {
  const briefHtml = renderBrief(project.brief);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5">
          <div className="micro mb-5 text-accent">Note d&apos;intention</div>

          {project.intent ? (
            <p className="font-display text-2xl leading-snug md:text-3xl">{project.intent}</p>
          ) : (
            <div
              className="font-display text-2xl leading-snug md:text-3xl [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_blockquote]:border-l-2 [&_blockquote]:border-current [&_blockquote]:pl-4 [&_blockquote]:opacity-70"
              dangerouslySetInnerHTML={{ __html: briefHtml }}
            />
          )}

          {project.intent && briefHtml && (
            <div
              className="mt-6 max-w-md text-sm leading-relaxed text-fg-2 [&_p]:mb-3 [&_strong]:font-semibold [&_em]:italic [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_blockquote]:border-l-2 [&_blockquote]:border-current [&_blockquote]:pl-4 [&_blockquote]:opacity-70"
              dangerouslySetInnerHTML={{ __html: briefHtml }}
            />
          )}

          {project.body && (
            <p className="mt-8 max-w-md text-sm leading-relaxed text-fg-2">{project.body}</p>
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
          <figure className="relative w-full md:col-span-7">
            {isVideo(project.spread) ? (
              <SpreadVideoPlayer src={project.spread.src} alt={project.spread.alt} />
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={project.spread.src}
                  alt={project.spread.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 opacity-15 noise-overlay" />
              </div>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}
