// src/app/contact/page.tsx
import Header from "@/components/layout/Header";
import { cabinet, neima } from "@/lib/fonts";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-page text-fg overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-5 opacity-20 noise-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-4">
        <Header />

        <section className="flex flex-1 items-center">
          <div className="w-full max-w-2xl">
            {/* Titre */}
            <h1 className={`${neima.className} text-6xl md:text-8xl tracking-tight leading-none mb-16`}>
              Contact
            </h1>

            {/* Formulaire */}
            <form className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className={`${cabinet.className} text-[0.6rem] tracking-[0.3em] uppercase text-fg-3`}
                  >
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    className={`${cabinet.className} border-b border-fg/25 bg-transparent py-3 text-sm text-fg placeholder:text-fg-3/60 outline-none transition-colors focus:border-accent`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className={`${cabinet.className} text-[0.6rem] tracking-[0.3em] uppercase text-fg-3`}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className={`${cabinet.className} border-b border-fg/25 bg-transparent py-3 text-sm text-fg placeholder:text-fg-3/60 outline-none transition-colors focus:border-accent`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className={`${cabinet.className} text-[0.6rem] tracking-[0.3em] uppercase text-fg-3`}
                >
                  Sujet
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="De quoi s'agit-il ?"
                  className={`${cabinet.className} border-b border-fg/25 bg-transparent py-3 text-sm text-fg placeholder:text-fg-3/60 outline-none transition-colors focus:border-accent`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className={`${cabinet.className} text-[0.6rem] tracking-[0.3em] uppercase text-fg-3`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Votre message..."
                  className={`${cabinet.className} border-b border-fg/25 bg-transparent py-3 text-sm text-fg placeholder:text-fg-3/60 outline-none resize-none transition-colors focus:border-accent`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`${cabinet.className} text-[0.6rem] tracking-[0.25em] uppercase text-fg-3`}>
                  studio@elssila.com
                </span>
                <button
                  type="submit"
                  className={`${cabinet.className} rounded-none bg-accent px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover`}
                >
                  Envoyer →
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
