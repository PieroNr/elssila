"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "elssila:theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to "light"; the inline <script> in layout.tsx already applied the
  // correct data-theme attribute before React hydrates, so there's no flash.
  const [theme, setThemeState] = useState<Theme>("light");

  // Sync React state with what's already applied by the inline script
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist + apply on every change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    // Enable cross-element colour transitions for the duration of the switch
    document.documentElement.setAttribute("data-theme-animating", "");
    setThemeState(t);
    setTimeout(
      () => document.documentElement.removeAttribute("data-theme-animating"),
      380
    );
  };

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
