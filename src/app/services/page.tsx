import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import ServicesSplit from "@/components/services/ServicesSplit";

export const metadata = {
  title: "Services — Elssila Studio",
  description:
    "Quatre disciplines : direction artistique, production visuelle, expériences digitales, stratégie de contenu.",
};

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="pt-12 pb-32">
          <div className="flex items-baseline justify-between">
            <div className="micro text-fg-3">⌗ Services</div>
            <div className="micro font-mono-ui text-fg-3">
              MMXXV · Ce que nous faisons
            </div>
          </div>
          <div className="hairline mt-3" />

          <h1 className="font-display mt-12 text-5xl leading-[0.92] tracking-tight md:text-9xl">
            Pour vos projets<span className="text-accent">,</span>
            <br />
            <span className="italic-display text-accent">5</span>
            <span className="text-fg"> services</span>
          </h1>

          <div className="mt-20 md:mt-24">
            <ServicesSplit />
          </div>
        </section>
      </div>

      <PageFooter />
    </main>
  );
}
