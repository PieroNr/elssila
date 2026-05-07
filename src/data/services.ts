// Single source for services. Read by /services and the home teaser.

export type GlyphKind = "mesh" | "orbit" | "grid" | "pulse";

export type Service = {
  id: string;
  title: string;
  fr: string;
  en: string;
  short: string;          // 1 line, used by the home teaser
  description: string;    // Fuller paragraph
  blurb: string;          // Mid-length copy used by the split-screen list
  disciplines: string[];
  glyph: GlyphKind;
  process?: string;       // "Brief · Recherche · Itération · Livrable"
  duration?: string;      // "4–12 semaines"
};

export const services: Service[] = [
  {
    id: "01",
    title: "Direction Artistique",
    fr: "Direction Artistique",
    en: "Art Direction",
    short: "Concevoir le langage visuel d'un projet, du concept au livrable.",
    description:
      "Conception et pilotage de l'identité visuelle d'un projet — du concept initial au rendu final. Nous définissons la tonalité, la palette, le langage graphique.",
    blurb: "Concept, identité, langage graphique. De la note d'intention au book final.",
    disciplines: ["Brand", "Visual Strategy", "Editorial"],
    glyph: "mesh",
    process: "Brief · Recherche · Itération · Livrable",
    duration: "4–12 semaines",
  },
  {
    id: "02",
    title: "Production Visuelle",
    fr: "Production Visuelle",
    en: "Visual Production",
    short: "Photo, vidéo, motion — produire des contenus à haute valeur éditoriale.",
    description:
      "Photographie, vidéo, motion design — nous produisons des contenus à haute valeur éditoriale, adaptés aux besoins de la mode, du luxe et de la culture.",
    blurb: "Photo, film, motion. Production complète à haute valeur éditoriale.",
    disciplines: ["Photo", "Film", "Motion"],
    glyph: "orbit",
    process: "Préprod · Tournage · Post · Livrable",
    duration: "3–8 semaines",
  },
  {
    id: "03",
    title: "Expériences Digitales",
    fr: "Expériences Digitales",
    en: "Digital Experiences",
    short: "Prolonger l'univers d'une marque dans le web et l'interactif.",
    description:
      "Création d'interfaces, de sites et d'installations numériques qui prolongent l'univers de la marque dans l'espace web et interactif.",
    blurb: "Sites, interfaces, installations. WebGL, 3D temps réel, prototypes interactifs.",
    disciplines: ["Web", "WebGL", "Interactive"],
    glyph: "grid",
    process: "Recherche · Prototype · Build · Mise en ligne",
    duration: "6–16 semaines",
  },
  {
    id: "04",
    title: "Stratégie de Contenu",
    fr: "Stratégie de Contenu",
    en: "Content Strategy",
    short: "Penser la diffusion en cohérence avec l'identité.",
    description:
      "Accompagnement éditorial et stratégique pour penser la diffusion des contenus sur les plateformes, en cohérence avec l'identité de marque.",
    blurb: "Édito et déploiement. Pensée de la diffusion sur tous les canaux.",
    disciplines: ["Editorial", "Social", "Copy"],
    glyph: "pulse",
    process: "Audit · Édito · Calendrier · Suivi",
    duration: "Récurrent",
  },
];
