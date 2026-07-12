"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "fr" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: "fr", setLang: () => {} });

const STORAGE_KEY = "elssila:lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "fr" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export const t = {
  nav: {
    projects: { fr: "Projets",  en: "Projects" },
    services: { fr: "Services", en: "Services" },
    studio:   { fr: "Studio",   en: "Studio" },
    contact:  { fr: "Contact",  en: "Contact" },
  },
  hero: {
    subtitle:    { fr: "vidéaste photographe et directrice artistique audiovisuelle", en: "filmmaker, photographer and creative director" },
    cta_work:    { fr: "Voir les projets",  en: "See projects" },
    cta_contact: { fr: "Discutons-en",      en: "Let's talk" },
    showreel_label: { fr: "⌗ Showreel", en: "⌗ Showreel" },
    selected:    { fr: "▌︎ Travaux sélectionnés · 2025 — 2026", en: "▌︎ Selected works · 2025 — 2026" },
    see_reel:    { fr: "→︎ Voir le showreel", en: "→︎ Watch the showreel" },
  },
  projects: {
    section:  { fr: "⌗ Travaux sélectionnés", en: "⌗ Selected works" },
    title:    { fr: "Projets",                 en: "Projects" },
    all_link: { fr: "Tous les projets →︎",    en: "All projects →︎" },
    all_btn:  { fr: "TOUS LES PROJETS",        en: "ALL PROJECTS" },
    open:     { fr: "↗︎ Voir",                  en: "↗︎ Open" },
  },
  services: {
    section:  { fr: "⌗ Services",          en: "⌗ Services" },
    title:    { fr: "Services",             en: "Services" },
    all_link: { fr: "Tous les services →︎", en: "All services →︎" },
    all_btn:  { fr: "TOUS LES SERVICES",    en: "ALL SERVICES" },
  },
  archive: {
    sort:     { fr: "Trier par", en: "Sort by" },
    year:     { fr: "ANNÉE",     en: "YEAR" },
    title:    { fr: "TITRE",     en: "TITLE" },
    all:      { fr: "Tous",      en: "All" },
    col_title:    { fr: "Titre",     en: "Title" },
    col_category: { fr: "Catégorie", en: "Category" },
    col_year:     { fr: "Année",     en: "Year" },
  },
  home_footer: {
    tag:       { fr: "⌗ Nous écrire",    en: "⌗ Get in touch" },
    cta_title: { fr: "Un projet, une idée ?", en: "A project, an idea?" },
    cta_italic: { fr: "une idée",         en: "an idea" },
    cta_btn:   { fr: "Démarrer un projet", en: "Start a project" },
    nav_label: { fr: "Navigation",        en: "Navigation" },
    copy:      { fr: "© Elssila Studio · Tous droits réservés", en: "© Elssila Studio · All rights reserved" },
    desc:      { fr: "Studio de production audiovisuelle.\nDirection artistique, réalisation et photographie.", en: "Audiovisual production studio.\nArt direction, filmmaking and photography." },
  },
  footer: {
    cta:         { fr: "Discutons de votre\nprochain projet.", en: "Let's talk about\nyour next project." },
    cta_btn:     { fr: "Nous contacter",   en: "Get in touch" },
    navigate:    { fr: "Naviguer",         en: "Navigate" },
    contact:     { fr: "Contact direct",   en: "Direct contact" },
    rendez_vous: { fr: "Lyon · Sur rendez-vous", en: "Lyon · By appointment" },
  },
  theme: {
    light: { fr: "Mode clair",  en: "Light mode" },
    dark:  { fr: "Mode sombre", en: "Dark mode" },
  },
};
