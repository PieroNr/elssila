import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import Manifesto from "@/components/studio/Manifesto";
import MarqueeBand from "@/components/studio/MarqueeBand";
import Approach from "@/components/studio/Approach";

export const metadata: Metadata = {
  title: "Studio — À propos de Lisa Eymard",
  description:
    "Lisa Eymard, vidéaste, photographe et directrice artistique indépendante basée à Lyon. Diplômée en direction artistique et réalisation audiovisuelle.",
  alternates: { canonical: "https://elssila.com/studio" },
  openGraph: {
    title: "Studio — Lisa Eymard | Elssila",
    description:
      "Vidéaste, photographe et directrice artistique indépendante basée à Lyon.",
    url: "https://elssila.com/studio",
    images: [{ url: "/studio/photo-color.jpg", width: 1200, height: 630, alt: "Lisa Eymard — Elssila" }],
  },
};

export default function StudioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-4">
        <Header />
      </div>

      <Manifesto />
      <MarqueeBand />
      <Approach />

      <PageFooter />
    </main>
  );
}
