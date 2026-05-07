import { cabinet } from "@/lib/fonts";

export default function Manifesto() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
      <div className="flex items-baseline justify-between">
        <div className={`${cabinet.className} micro text-fg-3`}>⌗ Studio · Manifesto</div>
        <div className={`${cabinet.className} micro font-mono-ui text-fg-3`}>
          EST. 2019 · MMXXV
        </div>
      </div>
      <div className="hairline mt-3" />

      <h1 className="font-display mt-16 text-5xl leading-[0.95] tracking-tight md:mt-24 md:text-[10rem]">
        Nous croyons
        <br />
        aux <span className="italic-display text-accent">images</span>
        <br />
        qui résistent
        <br />
        au temps<span className="text-accent">.</span>
      </h1>
    </section>
  );
}
