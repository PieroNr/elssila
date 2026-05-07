import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Manifesto from "@/components/studio/Manifesto";
import MarqueeBand from "@/components/studio/MarqueeBand";
import Approach from "@/components/studio/Approach";
import TeamGrid from "@/components/studio/TeamGrid";
import Recognitions from "@/components/studio/Recognitions";

export const metadata: Metadata = {
  title: "Studio — Elssila",
  description:
    "Studio indépendant fondé en 2019 à Paris. Direction artistique, photographie, film, web & 3D. Trois à cinq projets par an, jamais plus.",
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
      <TeamGrid />
      <Recognitions />

      <Footer />
    </main>
  );
}
