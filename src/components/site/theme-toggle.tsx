"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The stored theme is unknown on the server, so the label is withheld until
  // the client knows it rather than rendered wrong and corrected.
  useEffect(() => setMounted(true), []);

  const isLight = resolvedTheme !== "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-pressed={mounted ? isLight : undefined}
      title={
        mounted
          ? isLight
            ? "Switch to dark mode"
            : "Switch to light mode"
          : "Switch theme"
      }
      className="inline-flex items-center gap-1.5 px-2 py-1.5 text-tiny text-text-tertiary transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:bg-state-hover hover:text-text-primary"
    >
      {mounted ? (
        isLight ? (
          <Moon aria-hidden className="size-[14px]" />
        ) : (
          <Sun aria-hidden className="size-[14px]" />
        )
      ) : (
        <span className="size-[14px]" />
      )}
      <span className="hidden font-mono tracking-[var(--track-meta)] sm:inline">
        {mounted ? (isLight ? "Dark" : "Light") : ""}
      </span>
      <span className="sr-only">Toggle colour theme</span>
    </button>
  );
}
