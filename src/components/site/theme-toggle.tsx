"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * A floating control, fixed to the bottom-right, so the theme stays one click
 * away on every page without living in the navbar or forcing a scroll to the
 * footer.
 *
 * It sits below the mobile navigation overlay's z-index, so opening the menu
 * covers it rather than leaving it stranded on top.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The stored theme is unknown on the server, so the label is withheld until
  // the client knows it rather than rendered wrong and corrected.
  useEffect(() => setMounted(true), []);

  const isLight = resolvedTheme !== "dark";

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 print:hidden">
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
        className={[
          "pointer-events-auto inline-flex items-center gap-2 rounded-pill",
          "bg-[var(--glass-body)] px-4 py-2.5 backdrop-blur-[var(--glass-blur)]",
          "backdrop-saturate-[var(--glass-saturate)]",
          "shadow-[var(--glass-inner),var(--glass-shadow)]",
          "text-tiny text-text-secondary",
          "transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-glass)]",
          "hover:text-text-primary hover:-translate-y-px active:translate-y-0",
        ].join(" ")}
      >
        {mounted ? (
          isLight ? (
            <Moon aria-hidden className="size-[15px]" />
          ) : (
            <Sun aria-hidden className="size-[15px]" />
          )
        ) : (
          <span className="size-[15px]" />
        )}
        <span className="font-mono tracking-[var(--track-meta)]">
          {mounted ? (isLight ? "Dark" : "Light") : ""}
        </span>
        <span className="sr-only">Toggle colour theme</span>
      </button>
    </div>
  );
}
