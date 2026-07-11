"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/layout/Header";
import { PageFooter } from "@/components/home/HomeFooter";
import Clock from "@/components/contact/Clock";
import SeismographLive from "@/components/contact/SeismographLive";

const STUDIO_EMAIL = "elssila.pro@gmail.com";
const STUDIO_PHONE = "+33 1 02 03 04 05";
const PROJECT_TYPES = ["Brand", "Editorial", "Web / 3D", "Film", "Autre"] as const;

type FocusedField = "name" | "email" | "subject" | "message" | null;

export default function ContactPage() {
  const [focused, setFocused] = useState<FocusedField>(null);
  const [vals, setVals] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const setVal = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setVals((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = vals.subject || "Demande de contact";
    const body =
      `${vals.message}\n\n` +
      `—\n` +
      `Envoyé depuis elssila.com\n` +
      (vals.name ? `De : ${vals.name}\n` : "") +
      (vals.email ? `Email : ${vals.email}\n` : "");

    const href =
      `mailto:${STUDIO_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  };

  // Field label component — micro label left, status indicator right
  const FieldLabel = ({
    id,
    children,
    idx,
  }: {
    id: FocusedField;
    children: React.ReactNode;
    idx: number;
  }) => (
    <div className="micro-sm mb-2 flex justify-between">
      <span className="text-fg-3">{children}</span>
      <span
        className="font-mono-ui transition-colors"
        style={{ color: focused === id ? "var(--color-accent)" : "var(--color-fg-4)" }}
      >
        {focused === id ? "● ACTIVE" : `0${idx}/04`}
      </span>
    </div>
  );

  const inputClass =
    "w-full bg-transparent border-0 text-fg outline-none transition-[border-color] font-display";

  const inputStyle = (id: FocusedField): React.CSSProperties => ({
    fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
    padding: "10px 0 14px",
    borderBottom:
      focused === id
        ? "1px solid var(--color-accent)"
        : "0.5px solid var(--color-separator)",
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-page text-fg">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="pt-12 pb-32">
          <div className="flex items-baseline justify-between">
            <div className="micro text-fg-3">⌗ Get in touch · Paris / Remote</div>
            <div className="micro font-mono-ui text-fg-3">
              <Clock /> · 48.8566° N
            </div>
          </div>
          <div className="hairline mt-3" />

          <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-24">
            {/* LEFT — form */}
            <div className="md:col-span-7">
              <h1 className="font-display text-6xl leading-[0.92] tracking-tight md:text-9xl">
                <span className="italic-display">Bonjour</span>
                <span className="text-accent">.</span>
              </h1>
              <p className="font-display mt-6 max-w-xl text-lg leading-snug text-fg-2 md:text-xl">
                Un brief, une intuition, un projet à long terme. Écrivez — nous répondons
                en moins de 48 h.
              </p>

              <form onSubmit={handleSubmit} className="mt-14 flex flex-col gap-7">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <FieldLabel id="name" idx={1}>
                      Nom complet
                    </FieldLabel>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Votre nom"
                      value={vals.name}
                      onChange={setVal("name")}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      className={inputClass}
                      style={inputStyle("name")}
                    />
                  </div>
                  <div>
                    <FieldLabel id="email" idx={2}>
                      Email
                    </FieldLabel>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="vous@studio.com"
                      value={vals.email}
                      onChange={setVal("email")}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      className={inputClass}
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel id="subject" idx={3}>
                    Type de projet
                  </FieldLabel>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {PROJECT_TYPES.map((t) => {
                      const sel = vals.subject === t;
                      return (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setVals((v) => ({ ...v, subject: t }))}
                          className="micro-sm px-4 py-2.5 transition-colors"
                          style={{
                            background: sel ? "var(--color-fg)" : "transparent",
                            color: sel ? "var(--color-page)" : "var(--color-fg-2)",
                            border: "0.5px solid var(--color-separator)",
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <FieldLabel id="message" idx={4}>
                    Message
                  </FieldLabel>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Décrivez votre projet…"
                    value={vals.message}
                    onChange={setVal("message")}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    className={`${inputClass} resize-none`}
                    style={{
                      ...inputStyle("message"),
                      fontSize: "1rem",
                      fontFamily: "var(--font-cabinet), Arial, sans-serif",
                      lineHeight: 1.55,
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="micro-sm text-fg-3">
                    {sent ? (
                      <span>Mail ouvert dans votre app.</span>
                    ) : (
                      <>
                        <a
                          href={`mailto:${STUDIO_EMAIL}`}
                          className="hover:text-accent"
                        >
                          {STUDIO_EMAIL}
                        </a>
                        <span className="mx-2">·</span>
                        <span>{STUDIO_PHONE}</span>
                      </>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-accent px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover"
                  >
                    Envoyer →
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT — seismograph + studio */}
            <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
              <div
                className="bg-card-hover p-6 md:p-7"
                style={{ border: "0.5px solid var(--color-separator)" }}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="micro-sm font-mono-ui text-fg-3">
                    ▌STUDIO ACTIVITY · LIVE
                  </span>
                  <span className="micro-sm text-accent">● REC</span>
                </div>
                <SeismographLive />
                <div className="mt-2 flex justify-between">
                  <span className="micro-sm font-mono-ui text-fg-4">0s</span>
                  <span className="micro-sm font-mono-ui text-fg-4">+30s</span>
                </div>
              </div>

              <div className="mt-10">
                <div className="micro mb-5 text-fg-3">Studio</div>
                <div className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                  17, rue du Faubourg
                  <br />
                  <span className="italic-display">Saint-Antoine</span>
                  <br />
                  75011 Paris
                </div>
                <div className="micro-sm mt-4 text-fg-3">
                  Lun–Ven · 10h00 → 19h00
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  { k: "Instagram", v: "@elssila.studio", href: "#" },
                  { k: "Are.na", v: "/elssila", href: "#" },
                  { k: "Vimeo", v: "/elssila", href: "#" },
                  { k: "LinkedIn", v: "/elssila", href: "#" },
                ].map(({ k, v, href }) => (
                  <a
                    key={k}
                    href={href}
                    className="micro-sm flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-card-hover"
                    style={{
                      border: "0.5px solid var(--color-separator)",
                      color: "var(--color-fg-2)",
                    }}
                  >
                    <span>{k}</span>
                    <span className="text-fg-3">{v} ↗</span>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>

      <PageFooter />
    </main>
  );
}
