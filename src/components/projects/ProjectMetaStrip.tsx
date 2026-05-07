import type { Project } from "@/data/projects";

type Props = { project: Project };

// 5-column meta strip shown right under the hero on the project detail page.
// Optional fields (format, run) collapse gracefully — only filled cells render.

export default function ProjectMetaStrip({ project }: Props) {
  const cells: { label: string; value: string }[] = [
    { label: "Client", value: project.client ?? "Auto-prod." },
    { label: "Année", value: project.year },
    { label: "Discipline", value: project.category },
  ];
  if (project.format) cells.push({ label: "Format", value: project.format });
  if (project.run) cells.push({ label: "Tirage", value: project.run });

  return (
    <section
      className="mx-auto max-w-6xl border-b px-6 py-10 md:py-12"
      style={{ borderColor: "var(--color-separator)" }}
    >
      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
      >
        {cells.map((c) => (
          <div key={c.label}>
            <div className="micro-sm mb-2 text-fg-3">{c.label}</div>
            <div className="italic-display text-lg leading-tight text-fg md:text-2xl">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
