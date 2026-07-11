// Single source of truth for projects. Read by:
//   - /                         (featured projects on home)
//   - /projects                 (Archive Index)
//   - /projects/[slug]          (Detail page)
//
// Schema is decoupled from rendering — swap this for a CMS fetcher (Notion,
// Sanity…) later, only this module changes.

export type ProjectImage = {
  type?: "image";
  src: string;
  alt: string;
  w: number;
  h: number;
  aspect?: "wide" | "tall" | "square";
};

export type ProjectVideo = {
  type: "video";
  src: string;
  alt: string;
};

export type ProjectMedia = ProjectImage | ProjectVideo;

export type ProjectCredit = { role: string; name: string };

// TipTap JSON document node
export type RichTextDoc = { type: "doc"; content: unknown[] } | Record<string, unknown>;

export type ProjectVideoLink = { src: string; title?: string };

export type Project = {
  slug: string;
  ref?: string;
  videos?: ProjectVideoLink[];
  title: string;
  category: string;
  year: string;
  client?: string;
  role: string[];
  brief: string | RichTextDoc;  // string in static data, RichTextDoc from Supabase
  intent?: string;
  body?: string;
  format?: string;
  run?: string;
  hero: ProjectImage;
  spread?: ProjectMedia;
  gallery: ProjectImage[];
  tags: string[];
  credits?: ProjectCredit[];
  featured?: boolean;
};

const u = (id: string, w = 1600, h = 2000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// Curated Unsplash IDs by mood. Reused intelligently across projects to keep
// the network footprint small while preserving variety.
const IMG = {
  // Editorial / portrait
  portraitContrast: "1531746020798-e6953c6e8e04",
  portraitDip: "1488161628813-04466f872be2",
  portraitLight: "1492447273231-0f8fecec1e3a",
  portraitDetail: "1496346236646-50e983ea3f63",
  portraitClose: "1517363898874-737b62a7db91",
  portraitMotion: "1519699047748-de8e457a634e",
  portraitStudio: "1502635385003-ee1e6a1a742d",
  // Fashion
  fashionEditorial: "1490481651871-ab68de25d43d",
  fashionLook: "1539109136881-3be0616acf4b",
  // Studio / behind the scenes
  studioCamera: "1485846234645-a62644f84728",
  studioLight: "1502920917128-1aa500764cbd",
  studioWork: "1452587925148-ce544e77e70d",
  // Documentary / landscape
  docMountain: "1469474968028-56623f02e42e",
  docForest: "1506905925346-21bda4d32df4",
  docFilm: "1518930259200-3e5c81dccaf2",
  docStreet: "1487537708572-3c850b5e856e",
  docUrban: "1455156218388-5e61b526818b",
  // Architecture / installation
  archStairs: "1497366216548-37526070297c",
  archGallery: "1497366754035-f200968a6e72",
  archInterior: "1487958449943-2429e8be8625",
  archWall: "1501045661006-fcebe0257c3f",
  archSpace: "1454944338482-a69bb95894af",
} as const;

const img = (
  key: keyof typeof IMG,
  alt: string,
  aspect?: ProjectImage["aspect"],
): ProjectImage => {
  const wide = aspect === "wide";
  const square = aspect === "square";
  const w = 1600;
  const h = wide ? 1067 : square ? 1600 : 2000;
  return { src: u(IMG[key], w, h), alt, w, h, aspect };
};

export const projects: Project[] = [
  /* ─── 024 ─────────────────────────────────────────────────────────────── */
  {
    slug: "hollow-swine",
    ref: "024",
    title: "Hollow Swine",
    category: "Editorial",
    year: "2025",
    client: "Revue NOMA",
    role: ["Direction artistique", "Photographie", "Layout"],
    brief:
      "Direction artistique du n°07 sur le thème Hollow. Studio, post-production minimale, grille 12 colonnes, papier Munken Pure 130g.",
    intent:
      "Une revue qui regarde la matière sans pudeur — peau, métal, papier — et compose chaque double-page comme un dialogue entre lumière dure et silence éditorial.",
    body:
      "Direction artistique du numéro 07 sur le thème Hollow. Photographie en studio, post-production minimale, grille typographique 12 colonnes, papier Munken Pure 130g. Quatre essais commandés à des auteurs invités.",
    format: "260 × 340 mm",
    run: "1 200 ex.",
    tags: ["Photo", "Layout"],
    featured: true,
    hero: img("portraitContrast", "Portrait éditorial à contre-jour", "wide"),
    spread: img("portraitDip", "Double-page d'ouverture", "wide"),
    gallery: [
      img("portraitDip", "Plate 02", "tall"),
      img("portraitLight", "Plate 03", "wide"),
      img("portraitDetail", "Plate 04", "tall"),
      img("portraitStudio", "Plate 05", "tall"),
      img("fashionEditorial", "Plate 06", "wide"),
    ],
    credits: [
      { role: "Direction artistique", name: "Elssila Studio" },
      { role: "Photographie", name: "M. Aubert" },
      { role: "Stylisme", name: "L. Vega" },
      { role: "Maquette", name: "Elssila + atelier R." },
      { role: "Impression", name: "Stipa, Montreuil" },
    ],
  },

  /* ─── 023 ─────────────────────────────────────────────────────────────── */
  {
    slug: "void-campaign",
    ref: "023",
    title: "Void Campaign",
    category: "Brand",
    year: "2025",
    client: "Maison Velet",
    role: ["Direction artistique", "Motion"],
    brief:
      "Campagne hybride photo/vidéo pour le lancement d'une collection capsule. Espace négatif, gestes lents, chorégraphie de l'absence.",
    intent:
      "Un manifeste visuel construit sur le silence — chaque image est tenue sur une seule note, le mouvement n'arrive qu'à la fin.",
    body:
      "Direction artistique de la campagne globale (print, social, film 30s). Tournage en studio à Pantin, post-production interne, livrables en 14 formats. Sortie simultanée sur cinq marchés.",
    tags: ["DA", "Motion"],
    featured: true,
    hero: img("studioWork", "Plan studio noir et blanc", "wide"),
    spread: img("studioCamera", "Setup caméra", "wide"),
    gallery: [
      img("studioCamera", "Setup", "wide"),
      img("studioLight", "Lumière", "wide"),
      img("portraitClose", "Portrait close", "tall"),
      img("portraitMotion", "Mouvement", "tall"),
      img("fashionEditorial", "Détail tissus", "wide"),
    ],
    credits: [
      { role: "Direction artistique", name: "Elssila Studio" },
      { role: "Réalisation film", name: "C. Lemaître" },
      { role: "Motion", name: "T. Kobzar" },
      { role: "Production", name: "Maison Velet" },
    ],
  },

  /* ─── 022 ─────────────────────────────────────────────────────────────── */
  {
    slug: "thermal",
    ref: "022",
    title: "Thermal",
    category: "Film",
    year: "2025",
    client: "Atelier-K",
    role: ["Réalisation", "Vidéo"],
    brief:
      "Film court documentant le travail de la fonderie Atelier-K en Lorraine. Pellicule 16mm, son binaural, montage en chambre.",
    intent:
      "Filmer la chaleur comme un personnage. Un huis-clos industriel où la matière est plus présente que les corps qui la travaillent.",
    body:
      "Six jours de tournage en immersion. Mélange de 16mm et de captures thermiques. Diffusion festival (sélection officielle Doc Cévennes 2025).",
    tags: ["Direction", "Vidéo", "16mm"],
    hero: img("docFilm", "Plan d'usine", "wide"),
    gallery: [
      img("studioLight", "Forge", "wide"),
      img("portraitMotion", "Geste de coulée", "tall"),
      img("docFilm", "Salle de projection", "wide"),
      img("docStreet", "Extérieur usine", "tall"),
    ],
    credits: [
      { role: "Réalisation", name: "Elssila Studio" },
      { role: "Image", name: "M. Aubert" },
      { role: "Son", name: "Studio Hollow" },
      { role: "Montage", name: "L. Sabatini" },
    ],
  },

  /* ─── 021 ─────────────────────────────────────────────────────────────── */
  {
    slug: "noma-manifesto",
    ref: "021",
    title: "NOMA Manifesto",
    category: "Digital",
    year: "2024",
    client: "Galerie B—612",
    role: ["3D", "Web", "Direction"],
    brief:
      "Plateforme éditoriale et expérience WebGL pour la galerie B—612. Six chapitres scrollytelling, archive 3D des œuvres exposées.",
    intent:
      "Faire d'un site galerie une expérience d'exposition. La navigation devient déambulation, les œuvres sont rendues en temps réel.",
    body:
      "Conception éditoriale, design de l'interface, direction technique. Three.js + custom shaders, performance ciblée 60 fps sur GPU intégré.",
    tags: ["3D", "Web", "WebGL"],
    featured: true,
    hero: img("archGallery", "Vue de l'expo virtuelle", "wide"),
    spread: img("archStairs", "Salle ouest", "wide"),
    gallery: [
      img("archStairs", "Salle ouest", "wide"),
      img("archInterior", "Détail accrochage", "wide"),
      img("archWall", "Mur nord", "tall"),
      img("archSpace", "Mur sud", "tall"),
      img("docMountain", "Œuvre n°08", "wide"),
    ],
    credits: [
      { role: "Direction artistique", name: "Elssila Studio" },
      { role: "Développement", name: "T. Kobzar" },
      { role: "3D / Shaders", name: "M. Aubert" },
      { role: "Édito", name: "L. Sabatini" },
    ],
  },

  /* ─── 020 ─────────────────────────────────────────────────────────────── */
  {
    slug: "rift-collection",
    ref: "020",
    title: "Rift Collection",
    category: "Fashion",
    year: "2024",
    client: "Studio Atelier-K",
    role: ["Direction artistique", "Vidéo"],
    brief:
      "Lookbook film d'une collection automne-hiver. Tournage en pellicule 16mm, post-production minimaliste, palette de pierre.",
    intent:
      "Une collection sculptée par la lumière du nord — peu de mouvement, pas de musique, juste le bruit du tissu.",
    tags: ["DA", "Vidéo", "16mm"],
    featured: true,
    hero: img("fashionEditorial", "Modèle en mouvement", "tall"),
    gallery: [
      img("fashionLook", "Look 1", "tall"),
      img("portraitDip", "Look 2", "tall"),
      img("portraitLight", "Look 3", "wide"),
      img("portraitDetail", "Détail", "tall"),
    ],
    credits: [
      { role: "Direction artistique", name: "Elssila Studio" },
      { role: "Image", name: "M. Aubert" },
      { role: "Stylisme", name: "L. Vega" },
    ],
  },

  /* ─── 019 ─────────────────────────────────────────────────────────────── */
  {
    slug: "cendres",
    ref: "019",
    title: "Cendres",
    category: "Editorial",
    year: "2024",
    client: "Auto-production",
    role: ["Photographie"],
    brief:
      "Série personnelle. Cinq jours en Auvergne, photographie argentique, tirages baryté.",
    intent: "Aller voir ce qui reste après la combustion contrôlée. Une question, pas une réponse.",
    tags: ["Photo", "Argentique"],
    hero: img("docForest", "Forêt brûlée", "wide"),
    gallery: [
      img("docMountain", "Crêtes", "wide"),
      img("docForest", "Sous-bois", "wide"),
      img("docStreet", "Trace", "tall"),
      img("portraitDetail", "Détail mat", "tall"),
    ],
  },

  /* ─── 018 ─────────────────────────────────────────────────────────────── */
  {
    slug: "atlas-lourd",
    ref: "018",
    title: "Atlas Lourd",
    category: "Brand",
    year: "2024",
    client: "Montagnes Granit",
    role: ["Direction artistique", "Print"],
    brief:
      "Refonte d'identité d'une coopérative de carrières. Charte stricte, deux typographies, papier non blanchi.",
    body:
      "Logotype, papeterie, signalétique chantier, site institutionnel. Livrable 60 pages.",
    tags: ["DA", "Print"],
    hero: img("archStairs", "Carrière", "wide"),
    gallery: [
      img("archInterior", "Atelier", "wide"),
      img("archWall", "Chantier", "tall"),
      img("docUrban", "Signalétique", "tall"),
      img("studioWork", "Bureau", "wide"),
    ],
  },

  /* ─── 017 ─────────────────────────────────────────────────────────────── */
  {
    slug: "archive-iii",
    ref: "017",
    title: "Archive III",
    category: "Installation",
    year: "2023",
    client: "Frac Île-de-France",
    role: ["Scénographie", "Print"],
    brief:
      "Troisième volet d'une série d'installations photographiques. Tirages baryté, mise en espace minimale, dialogue entre l'image et le mur.",
    intent: "L'image n'est pas un sujet — c'est un événement de l'espace. La scénographie n'illustre rien, elle organise une rencontre.",
    body:
      "120 tirages, 4 salles, 6 semaines d'exposition. Catalogue 96 pages distribué gratuitement.",
    format: "Tirages 30 × 40 cm",
    run: "120 tirages",
    tags: ["Scéno", "Print", "Argentique"],
    featured: true,
    hero: img("archGallery", "Tirages dans la galerie", "wide"),
    spread: img("archInterior", "Mur ouest", "wide"),
    gallery: [
      img("archStairs", "Salle est", "wide"),
      img("archInterior", "Mur central", "wide"),
      img("archWall", "Tirage 18", "tall"),
      img("archSpace", "Tirage 24", "tall"),
      img("archGallery", "Vue d'ensemble", "wide"),
    ],
    credits: [
      { role: "Scénographie", name: "Elssila Studio" },
      { role: "Tirages", name: "Atelier 213" },
      { role: "Catalogue", name: "Stipa, Montreuil" },
    ],
  },

  /* ─── 016 ─────────────────────────────────────────────────────────────── */
  {
    slug: "halflight",
    ref: "016",
    title: "Halflight",
    category: "Film",
    year: "2023",
    client: "Velvet & Sons",
    role: ["Direction"],
    brief: "Court métrage commandé par Velvet & Sons pour leur fonds documentaire.",
    tags: ["Direction", "Film"],
    hero: img("docFilm", "Plan large", "wide"),
    gallery: [
      img("portraitMotion", "Geste", "tall"),
      img("docForest", "Forêt", "wide"),
      img("docStreet", "Bord de route", "tall"),
    ],
  },

  /* ─── 015 ─────────────────────────────────────────────────────────────── */
  {
    slug: "glass-house",
    ref: "015",
    title: "Glass House",
    category: "Digital",
    year: "2023",
    client: "Maison J.",
    role: ["Web", "3D"],
    brief: "Site portfolio et configurateur 3D pour une marque d'objets en verre soufflé.",
    tags: ["Web", "3D"],
    hero: img("archInterior", "Atelier verre", "wide"),
    gallery: [
      img("archStairs", "Showroom", "wide"),
      img("archWall", "Configurateur", "tall"),
      img("studioWork", "Établi", "wide"),
    ],
  },

  /* ─── 014 ─────────────────────────────────────────────────────────────── */
  {
    slug: "salt-iron",
    ref: "014",
    title: "Salt & Iron",
    category: "Editorial",
    year: "2022",
    client: "Revue MATIÈRE",
    role: ["Photographie", "Layout"],
    brief: "Sujet long pour la revue MATIÈRE — sel, métal, port de Sète.",
    tags: ["Photo", "Layout"],
    hero: img("docStreet", "Quai sud", "wide"),
    gallery: [
      img("docFilm", "Hangar", "wide"),
      img("portraitDetail", "Mains", "tall"),
      img("docUrban", "Rail", "wide"),
    ],
  },

  /* ─── 013 ─────────────────────────────────────────────────────────────── */
  {
    slug: "cobalt",
    ref: "013",
    title: "Cobalt",
    category: "Brand",
    year: "2022",
    client: "Atelier Cobalt",
    role: ["Direction artistique"],
    brief: "Identité d'un atelier de céramique. Logotype, packaging, signalétique.",
    tags: ["DA"],
    hero: img("archInterior", "Atelier céramique", "wide"),
    gallery: [
      img("archWall", "Étagères", "tall"),
      img("studioWork", "Plan de travail", "wide"),
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Returns the previous and next projects, wrapping around. */
export function getProjectNeighbors(slug: string): { prev: Project; next: Project } | null {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  return { prev, next };
}

/** Unique categories — used by the Archive filter chips. */
export const PROJECT_CATEGORIES = [
  "All",
  "Court métrage",
  "Clip musical",
  "Publicité",
  "Institutionnel",
  "Shooting",
] as const;
