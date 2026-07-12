import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Écrivez à Lisa Eymard",
  description:
    "Une idée, un projet ? Contactez Lisa Eymard, vidéaste et photographe à Lyon. Réponse en moins de 48h.",
  alternates: { canonical: "https://elssila.com/contact" },
  openGraph: {
    title: "Contact — Elssila",
    description: "Une idée, un projet ? Contactez Lisa Eymard à Lyon. Réponse en moins de 48h.",
    url: "https://elssila.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
