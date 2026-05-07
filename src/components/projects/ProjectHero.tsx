import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = { project: Project; index: number; total: number };

// Full-bleed hero with title overlay. Breadcrumb and an editorial code label
// sit at the top corners, mirroring the case-study layout from the design mock.

export default function ProjectHero({ project, index, total }: Props) {
  const { hero, title, category, year, ref } = project;

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" />

      {/* Gradient + grain overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
      <div className="pointer-events-none absolute inset-0 opacity-25 noise-overlay" />

      {/* Breadcrumb top-left + ref top-right */}
      <div className="pointer-events-none absolute top-6 left-0 right-0 z-10 mx-auto flex max-w-6xl items-baseline justify-between px-6 text-white/80">
        <span className="micro-sm">← Index / Projects / {ref}</span>
        <span className="micro-sm font-mono-ui">ELS · {year} · ISO 400</span>
      </div>

      {/* Title block */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 md:pb-20">
          <div className="micro mb-5 font-mono-ui text-white/70">
            ⌗ Case Study · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <h1 className="font-display max-w-5xl text-5xl leading-[0.95] tracking-tight text-white md:text-9xl">
            {/* Last word in italic for editorial feel */}
            {(() => {
              const words = title.split(" ");
              if (words.length === 1) return title;
              return (
                <>
                  {words.slice(0, -1).join(" ")}{" "}
                  <span className="italic-display">{words[words.length - 1]}</span>
                </>
              );
            })()}
          </h1>
          <div className="micro mt-6 text-white/80">
            {category} — {year}
          </div>
        </div>
      </div>
    </section>
  );
}
