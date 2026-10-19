"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const pages = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Header and menu panel share the content container, so they align. */
const shell = "fixed inset-x-0 z-40 cl-container rounded-card border border-border";

/**
 * C01 floating header and C02 mobile navigation.
 *
 * Desktop: the wordmark and Work / About / Contact / Résumé on one floating
 * bar. Below 768px the links move into a panel opened by one labelled button.
 * While the panel is open the page behind it is inert and does not scroll,
 * Escape closes it and focus returns to the button; the active route is marked
 * with an underline and aria-current, never with a second primary action.
 */
export function SiteHeader({ resumeMeta }: { resumeMeta: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Following a link closes the menu; the new page takes focus from there.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const behind = ["main", "site-footer"].map((id) => document.getElementById(id));
    behind.forEach((el) => el?.setAttribute("inert", ""));
    // The menu only exists on touch-sized layouts, where scrollbars overlay
    // the page, so locking scroll here cannot shift the layout sideways.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("a")?.focus(),
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    // Growing past the mobile layout hides the panel, so it must not stay
    // open behind the desktop bar with the page still inert.
    const wide = window.matchMedia("(min-width: 48rem)");
    const onWide = () => {
      if (wide.matches) close(false);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);

    return () => {
      cancelAnimationFrame(frame);
      behind.forEach((el) => el?.removeAttribute("inert"));
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          shell,
          "top-(--cl-header-offset) flex min-h-(--cl-header-height) items-center justify-between gap-6 bg-bg-surface px-4 shadow-subtle md:px-5",
          "supports-[backdrop-filter]:bg-header supports-[backdrop-filter]:backdrop-blur-[16px]",
        )}
      >
        <Link
          href="/"
          aria-label={`CO, ${site.name}, home`}
          className="inline-flex min-h-11 items-center font-display text-[1.5rem] leading-none font-semibold tracking-[-0.02em] text-text-primary no-underline"
        >
          CO
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {pages.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center cl-type-ui underline-offset-[0.45em] transition-colors duration-(--cl-motion-duration-micro) ease-standard",
                    isActive(item.href)
                      ? "text-text-primary underline decoration-brand decoration-2"
                      : "text-text-secondary no-underline hover:text-text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1 cl-type-ui text-text-secondary no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-text-primary"
              >
                Résumé
                <Icon icon={ArrowUpRight} size={16} />
                <span className="sr-only">({resumeMeta}, opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close(true) : setOpen(true))}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={cn(
            // A bordered control, so it reads as a button and not a link.
            "inline-flex min-h-11 items-center gap-2 rounded-control border border-border-control bg-bg-subtle px-3 cl-type-ui text-text-primary md:hidden",
            "transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:bg-brand-soft",
            "aria-expanded:border-brand aria-expanded:bg-brand-soft",
          )}
        >
          <Icon icon={open ? X : Menu} />
          Menu
        </button>
      </header>

      {/* Dims the inert page behind the panel; a tap outside closes it. */}
      <div
        aria-hidden
        onClick={() => close(true)}
        className={cn(
          "fixed inset-0 z-30 bg-overlay transition-opacity md:hidden motion-reduce:transition-none",
          open
            ? "opacity-100 duration-(--cl-motion-duration-enter) ease-enter"
            : "pointer-events-none opacity-0 duration-(--cl-motion-duration-standard) ease-exit",
        )}
      />

      {/* Hidden with visibility, not display, so it can animate out; while
          hidden it is out of the tab order and the accessibility tree. */}
      <nav
        id="mobile-nav"
        ref={panelRef}
        aria-label="Menu"
        className={cn(
          shell,
          "top-[calc(var(--cl-header-offset)+var(--cl-header-height)+0.5rem)] max-h-[calc(100dvh-var(--cl-header-offset)-var(--cl-header-height)-1.5rem)] overflow-y-auto overscroll-contain bg-bg-surface p-2 shadow-raised md:hidden",
          "motion-reduce:transition-none",
          // Visibility flips at once on open, so the first link can take
          // focus on the next frame, and only waits out the exit on close.
          open
            ? "visible opacity-100 transition-[opacity,translate] duration-(--cl-motion-duration-enter) ease-enter"
            : "invisible -translate-y-4 opacity-0 transition-[opacity,translate,visibility] duration-(--cl-motion-duration-standard) ease-exit",
        )}
      >
        <ul>
          {[
            ...pages.filter((p) => p.href !== "/contact"),
            { href: site.resume, label: "Résumé" },
            { href: "/contact", label: "Contact" },
          ].map((item) => {
            const row =
              "flex min-h-14 items-center justify-between gap-3 rounded-control px-3 cl-type-section no-underline hover:bg-bg-subtle";
            return (
              <li key={item.href} className="border-b border-border-subtle last:border-b-0">
                {item.href === site.resume ? (
                  <a href={item.href} target="_blank" rel="noopener" className={cn(row, "text-text-primary")}>
                    <span>
                      {item.label}
                      <span className="sr-only"> ({resumeMeta}, opens in a new tab)</span>
                    </span>
                    <Icon icon={ArrowUpRight} className="text-text-secondary" />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      row,
                      "text-text-primary underline-offset-[0.3em]",
                      isActive(item.href) && "underline decoration-brand decoration-2",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <p className="px-3 pt-4 pb-2 cl-type-caption text-text-secondary">
          {site.availability}
        </p>
      </nav>
    </>
  );
}
