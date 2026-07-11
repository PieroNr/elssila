// Single source for services. Read by /services and the home teaser.

export type GlyphKind = "mesh" | "orbit" | "grid" | "pulse";

export type Service = {
  id: string;
  title: string;
  fr: string;
  en: string;
  short: string;
  description: string;
  blurb: string;
  disciplines: string[];
  glyph: GlyphKind;
  process?: string;
  duration?: string;
};

export const services: Service[] = [
  {
    id: "01",
    title: "Direction artistique",
    fr: "Direction artistique",
    en: "Art Direction",
    short: "Définir l'univers visuel, le ton et la narration de votre projet.",
    description:
      "Définition de l'univers visuel, du ton et de la narration de votre projet — de la note d'intention aux références visuelles, jusqu'au brief technique.",
    blurb:
      "Définition de l'univers visuel, du ton et de la narration de votre projet — de la note d'intention aux références visuelles, jusqu'au brief technique.",
    disciplines: ["Univers visuel", "Narration", "Brief créatif"],
    glyph: "mesh",
    process: "Échange · Références · Note d'intentions · Brief technique",
    duration: "1–3 semaines",
  },
  {
    id: "02",
    title: "Pré production",
    fr: "Pré production",
    en: "Pre-production",
    short: "Écriture, découpage technique et storyboard pour préparer le tournage.",
    description:
      "Écriture, découpage technique et storyboard pour préparer le tournage dans les meilleures conditions.",
    blurb:
      "Écriture, découpage technique et storyboard pour préparer le tournage dans les meilleures conditions.",
    disciplines: ["Écriture", "Découpage technique", "Storyboard"],
    glyph: "orbit",
    process: "Écriture · Scénario · Découpage technique · Storyboard",
    duration: "1–2 semaines",
  },
  {
    id: "03",
    title: "Production",
    fr: "Production",
    en: "Production",
    short: "Organisation et tournage : repérages, cadrage, lumière, prise de son.",
    description:
      "Organisation et tournage : repérages, cadrage, lumière, prise de son. Je m'entoure ponctuellement d'autres professionnels indépendants selon les besoins spécifiques du projet.",
    blurb:
      "Organisation et tournage : repérages, cadrage, lumière, prise de son. Je m'entoure ponctuellement d'autres professionnels indépendants selon les besoins spécifiques du projet.",
    disciplines: ["Repérages", "Tournage", "Prise de son"],
    glyph: "grid",
    process: "Organisation · Repérage · Tournage",
    duration: "Variable selon projet",
  },
  {
    id: "04",
    title: "Post-production",
    fr: "Post-production",
    en: "Post-production",
    short: "Montage, étalonnage et habillage sonore pour donner leur identité à vos images.",
    description:
      "Montage, étalonnage et habillage sonore pour donner à vos images leur rythme et leur identité finale.",
    blurb:
      "Montage, étalonnage et habillage sonore pour donner à vos images leur rythme et leur identité finale.",
    disciplines: ["Montage", "Étalonnage", "Sound design"],
    glyph: "pulse",
    process: "Dérushage · Montage · Étalonnage · Mixage",
    duration: "1–4 semaines",
  },
  {
    id: "05",
    title: "Photographie",
    fr: "Photographie",
    en: "Photography",
    short: "Shootings portraits, événementiels ou institutionnels, de la prise de vue à la retouche.",
    description:
      "Shootings portraits, événementiels ou institutionnels, de la prise de vue à la retouche.",
    blurb:
      "Shootings portraits, événementiels ou institutionnels, de la prise de vue à la retouche.",
    disciplines: ["Portrait", "Événementiel", "Institutionnel"],
    glyph: "mesh",
    process: "Brief · Shooting · Sélection · Retouche",
    duration: "1–2 semaines",
  },
];
