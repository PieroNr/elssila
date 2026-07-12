"use client";

import { useLang, type Lang } from "@/lib/language";

const OPTIONS: { lang: Lang; flag: string; label: string }[] = [
  { lang: "fr", flag: "🇫🇷", label: "FR" },
  { lang: "en", flag: "🇬🇧", label: "EN" },
];

export default function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      {OPTIONS.map(({ lang: l, flag, label }) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className="flex items-center gap-1 px-2 py-1 text-[0.6rem] tracking-[0.2em] uppercase transition-opacity"
          style={{
            opacity: lang === l ? 1 : 0.35,
            fontVariantEmoji: "emoji",
          }}
          aria-label={l === "fr" ? "Version française" : "English version"}
        >
          <span style={{ fontVariantEmoji: "emoji" }}>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
