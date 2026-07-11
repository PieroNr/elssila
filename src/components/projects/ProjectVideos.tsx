import type { ProjectVideoLink } from "@/data/projects";
import SpreadVideoPlayer from "./SpreadVideoPlayer";

export default function ProjectVideos({ videos }: { videos: ProjectVideoLink[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="space-y-10">
        {videos.map((v, i) => (
          <div key={i}>
            {v.title && (
              <p className="micro mb-3 text-fg-3">{v.title}</p>
            )}
            <SpreadVideoPlayer src={v.src} alt={v.title ?? `Vidéo ${i + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
