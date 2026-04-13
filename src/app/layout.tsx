import type { Metadata } from "next";
import { cabinet, neima } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme";
import CustomCursor from "@/components/layout/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elssila Studio",
  description: "Creative Production Studio",
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
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
