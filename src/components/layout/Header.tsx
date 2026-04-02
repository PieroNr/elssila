// src/components/layout/Header.tsx
import { cabinet, neima } from "@/lib/fonts";

export default function Header() {
  return (
    <div className="pb-2">
      <header className="flex items-center justify-between">
        <div className={`${neima.className} text-2xl  uppercase`}>
          Elssila
        </div>

        <nav className={`${cabinet.className} flex gap-8 text-base font-medium tracking-[0.16em] uppercase text-slate-600`}>
          <button className="transition-colors hover:text-slate-900">
            Projects
          </button>
          <button className="transition-colors hover:text-slate-900">
            Capabilities
          </button>
        </nav>
      </header>

      <div className="mx-auto mt-4 h-[0.5px] w-[calc(100%)] bg-black/70" />
    </div>
  );
}