type Award = { year: string; title: string; prize: string };

const AWARDS: Award[] = [
  { year: "2025", title: "ADC France · Direction artistique", prize: "Or" },
  { year: "2024", title: "Awwwards · Site of the Year (NOMA)", prize: "—" },
  { year: "2024", title: "Étapes: Magazine · Cover feature", prize: "—" },
  { year: "2023", title: "Type Directors Club NY", prize: "Certificate" },
  { year: "2022", title: "Prix de la Photo Editoriale", prize: "Mention" },
];

export default function Recognitions() {
  return (
    <section
      className="mx-auto max-w-6xl border-t px-6 py-20 pb-24 md:py-24"
      style={{ borderColor: "var(--color-separator)" }}
    >
      <div className="micro mb-10 text-fg-3">III — Reconnaissances sélectives</div>

      <div
        className="grid items-baseline gap-y-5"
        style={{ gridTemplateColumns: "auto 1fr auto", columnGap: "2rem" }}
      >
        {AWARDS.map((a) => (
          <div key={a.title} className="contents">
            <div className="italic-display text-xl text-accent md:text-2xl">{a.year}</div>
            <div className="font-display text-base leading-tight tracking-tight md:text-2xl">
              {a.title}
            </div>
            <div className="micro-sm text-fg-3">{a.prize}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
