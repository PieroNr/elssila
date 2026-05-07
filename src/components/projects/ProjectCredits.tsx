import type { Project } from "@/data/projects";
import NextProjectCard from "./NextProjectCard";

type Props = { project: Project; nextProject: Project };

// Two-column outro: credits on the left, next-project card on the right.

export default function ProjectCredits({ project, nextProject }: Props) {
  // Synthesize a credits list from `project.credits` (preferred) or fall back
  // to `client + role` so every project has something to render.
  const credits =
    project.credits && project.credits.length
      ? project.credits
      : [
          ...(project.client ? [{ role: "Client", name: project.client }] : []),
          { role: "Direction", name: "Elssila Studio" },
          ...(project.role.length
            ? [{ role: "Disciplines", name: project.role.join(" · ") }]
            : []),
        ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <div className="micro mb-5 text-fg-3">Credits</div>
          <ul>
            {credits.map((c) => (
              <li
                key={c.role + c.name}
                className="flex items-baseline justify-between gap-6 border-b py-4"
                style={{ borderColor: "var(--color-separator)" }}
              >
                <span className="micro-sm text-fg-3">{c.role}</span>
                <span className="italic-display text-base text-fg md:text-lg">
                  {c.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <NextProjectCard project={nextProject} />
      </div>
    </section>
  );
}
