import Link from "next/link";
import type { Project } from "@/data/projects";

type Props = { project: Project };

// Inverted "Next →" card — fg background, page color text. Acts as the
// outbound CTA at the end of a project page, leading the reader into the
// neighboring project.

export default function NextProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden bg-fg p-8 text-page transition-colors hover:bg-fg-2 md:p-10"
    >
      <div className="micro-sm mb-5 opacity-60">Next →</div>
      <div className="font-display text-4xl leading-[0.95] tracking-tight md:text-6xl">
        {project.title.split(" ").map((word, i, arr) => (
          <span key={i}>
            {i === arr.length - 1 ? (
              <span className="italic-display">{word}</span>
            ) : (
              <>{word}&nbsp;</>
            )}
          </span>
        ))}
      </div>
      <div className="micro-sm mt-6 opacity-70">
        {project.ref} · {project.category} · {project.year}
      </div>
      <div
        className="absolute right-5 bottom-5 text-3xl text-accent-vivid transition-transform duration-300 group-hover:translate-x-1 md:right-7 md:bottom-7"
        aria-hidden
      >
        ↗
      </div>
    </Link>
  );
}
