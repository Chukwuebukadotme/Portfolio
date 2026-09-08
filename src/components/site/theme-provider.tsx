"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * The design system resolves dark from :root[data-theme="dark"] or .dark.
 * Writing both keeps the token files untouched and lets Tailwind's dark:
 * variant key off the same state.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute={["class", "data-theme"]}
      defaultTheme="light"
      enableSystem={false}
      storageKey="co-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
