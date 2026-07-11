import type { Metadata, Viewport } from "next";
import { cabinet, neima } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme";
import CustomCursor from "@/components/layout/CustomCursor";
import SuppressR3FWarnings from "@/components/layout/SuppressR3FWarnings";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Elssila Studio",
  description: "Creative Production Studio",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Reads localStorage and sets data-theme BEFORE first paint
            to prevent any flash of the wrong theme on page load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('elssila:theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${cabinet.variable} ${neima.variable} font-cabinet antialiased`}
      >
        <ThemeProvider>
          <SuppressR3FWarnings />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
