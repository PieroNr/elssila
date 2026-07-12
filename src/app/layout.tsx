import type { Metadata, Viewport } from "next";
import { cabinet, neima } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme";
import SuppressR3FWarnings from "@/components/layout/SuppressR3FWarnings";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const BASE_URL = "https://elssila.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Elssila — Vidéaste & Photographe à Lyon | Studio audiovisuel",
    template: "%s | Elssila",
  },
  description:
    "Lisa Eymard, vidéaste, photographe et directrice artistique basée à Lyon. Réalisation de clips musicaux, courts métrages, publicités et shootings photo en France.",
  keywords: [
    "vidéaste Lyon",
    "photographe Lyon",
    "directrice artistique Lyon",
    "réalisation vidéo Lyon",
    "production audiovisuelle Lyon",
    "clip musical Lyon",
    "court métrage Lyon",
    "studio audiovisuel Lyon",
    "vidéaste France",
    "tournage Lyon",
    "post-production Lyon",
    "Lisa Eymard",
    "Elssila",
  ],
  authors: [{ name: "Lisa Eymard", url: BASE_URL }],
  creator: "Lisa Eymard",
  publisher: "Elssila",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "Elssila",
    title: "Elssila — Vidéaste & Photographe à Lyon",
    description:
      "Lisa Eymard, vidéaste, photographe et directrice artistique basée à Lyon. Clips musicaux, courts métrages, publicités et shootings photo.",
    images: [
      {
        url: "/studio/photo-color.jpg",
        width: 1200,
        height: 630,
        alt: "Elssila — Studio audiovisuel à Lyon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elssila — Vidéaste & Photographe à Lyon",
    description:
      "Vidéaste, photographe et directrice artistique basée à Lyon. Disponible partout en France.",
    images: ["/studio/photo-color.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('elssila:theme');document.documentElement.setAttribute('data-theme',(t==='dark'||t==='light')?t:'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": BASE_URL + "/#person",
                  name: "Lisa Eymard",
                  jobTitle: "Vidéaste, Photographe & Directrice artistique",
                  url: BASE_URL,
                  email: "elssila.pro@gmail.com",
                  sameAs: ["https://www.instagram.com/el.ssila"],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Lyon",
                    addressRegion: "Auvergne-Rhône-Alpes",
                    addressCountry: "FR",
                  },
                  areaServed: "France",
                },
                {
                  "@type": "ProfessionalService",
                  "@id": BASE_URL + "/#business",
                  name: "Elssila",
                  description:
                    "Studio de production audiovisuelle indépendant basé à Lyon. Direction artistique, réalisation vidéo et photographie.",
                  url: BASE_URL,
                  email: "elssila.pro@gmail.com",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Lyon",
                    addressRegion: "Auvergne-Rhône-Alpes",
                    addressCountry: "FR",
                  },
                  areaServed: [
                    { "@type": "Country", name: "France" },
                    { "@type": "City", name: "Lyon" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": BASE_URL + "/#website",
                  url: BASE_URL,
                  name: "Elssila",
                  publisher: { "@id": BASE_URL + "/#business" },
                  inLanguage: "fr-FR",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${cabinet.variable} ${neima.variable} font-cabinet antialiased`}
      >
        <ThemeProvider>
          <SuppressR3FWarnings />
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
