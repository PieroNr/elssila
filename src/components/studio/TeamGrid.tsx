type Member = { name: string; role: string; city: string };

const TEAM: Member[] = [
  { name: "Camille L.", role: "Co-fondatrice · DA", city: "Lyon" },
  { name: "Marin A.", role: "Co-fondateur · 3D", city: "Lyon" },
  { name: "Iris B.", role: "Photographie", city: "Bruxelles" },
  { name: "Théo K.", role: "Motion · Code", city: "Lyon" },
  { name: "Léa S.", role: "Editorial · Strat.", city: "Lyon" },
  { name: "Studio +", role: "Auteurs invités", city: "—" },
];

export default function TeamGrid() {
  return (
    <section
      className="mx-auto max-w-6xl border-t px-6 py-20"
      style={{ borderColor: "var(--color-separator)" }}
    >
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="italic-display text-4xl tracking-tight md:text-7xl">Équipe</h2>
        <div className="micro text-fg-3">06 personnes · 03 villes</div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        style={{ borderTop: "0.5px solid var(--color-separator)" }}
      >
        {TEAM.map((member, i) => {
          const col = i % 3;
          const isLastRow = i >= 3;
          return (
            <div
              key={member.name}
              className="px-6 py-8 md:px-7 md:py-10"
              style={{
                borderBottom: isLastRow ? "0.5px solid var(--color-separator)" : undefined,
                borderRight:
                  col !== 2 ? "0.5px solid var(--color-separator)" : undefined,
              }}
            >
              <div className="font-mono-ui micro-sm text-fg-3">№0{i + 1}</div>
              <div className="font-display mt-4 text-2xl leading-tight tracking-tight md:text-3xl">
                {member.name}
              </div>
              <div className="italic-display mt-1 text-base text-fg-2">{member.role}</div>
              <div className="micro-sm mt-4 text-fg-4">{member.city}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
