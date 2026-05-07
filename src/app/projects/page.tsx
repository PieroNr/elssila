import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArchiveTable from "@/components/projects/ArchiveTable";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Index — Elssila Studio",
  description:
    "Tous les travaux du studio depuis sa fondation. Filtrer, trier, ouvrir — comme on feuillette un registre.",
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="pt-12 pb-32">
          <div className="flex items-baseline justify-between">
            <div className="micro text-fg-3">⌗ Archive · 2019 → 2025</div>
            <div className="micro font-mono-ui text-fg-3">
              {projects.length} ENTRIES · INDEX_24
            </div>
          </div>
          <div className="hairline mt-3" />

          <h1 className="font-display mt-12 text-6xl leading-none tracking-tight md:text-9xl">
            <span className="italic-display">Index</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="font-display mt-6 max-w-xl text-lg leading-snug text-fg-2 md:text-xl">
            Tous les travaux du studio depuis sa fondation. Filtrer, trier, ouvrir —
            comme on feuillette un registre.
          </p>

          <ArchiveTable />

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
            <div className="micro text-fg-3">End of index · Pre-2019 sur demande</div>
            <button
              type="button"
              className="micro border px-6 py-3 text-fg transition-colors hover:border-fg hover:bg-fg hover:text-page"
              style={{ borderColor: "var(--color-separator)" }}
            >
              Télécharger le registre PDF ↓
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
