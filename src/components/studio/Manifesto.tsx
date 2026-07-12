import { cabinet } from "@/lib/fonts";

export default function Manifesto() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="flex items-baseline justify-between">
        <div className={`${cabinet.className} micro text-fg-3`}>⌗ Studio · Manifeste</div>
      </div>
      <div className="hairline mt-3" />

      <h1 className="font-display mt-16 text-5xl leading-[0.95] tracking-tight md:mt-24 md:text-[7rem]">
        <span className="text-accent">&ldquo;</span>You know<span className="text-accent">,</span>
        <br />
        <span className="italic-display">for research</span>
        <span className="text-accent">&rdquo;</span>
      </h1>
    </section>
  );
}
