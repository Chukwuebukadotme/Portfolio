"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { GlassPanel } from "@/components/site/glass-panel";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Route changes close the menu; an open menu locks the page behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/work" ? pathname.startsWith("/work") : pathname === href;

  return (
    <>
      <div className="pointer-events-none sticky top-3 z-60 flex justify-center px-[var(--page-margin)]">
        <GlassPanel
          flat
          className="pointer-events-auto w-full max-w-[var(--container-large)]"
        >
          <div className="flex items-center gap-3 px-5 py-3 sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-baseline gap-1.5 whitespace-nowrap text-[17px] leading-none tracking-[var(--track-heading)] text-text-primary no-underline"
            >
              <span className="font-bold">Chukwuebuka</span>
              <span className="hidden font-light text-text-tertiary sm:inline">
                Onyemelukwe
              </span>
            </Link>

            <span className="flex-1" />

            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 md:flex"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "ds-eyebrow whitespace-nowrap no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary",
                    isActive(item.href)
                      ? "text-text-primary"
                      : "text-text-tertiary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="ds-eyebrow whitespace-nowrap text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
              >
                Résumé <span className="text-text-accent">↗</span>
              </a>
              <ThemeToggle />
            </nav>

            <div className="flex items-center gap-1.5 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="min-h-[40px] rounded-lg px-3 py-2 text-tiny uppercase tracking-[var(--track-eyebrow)] text-text-primary shadow-[inset_0_0_0_1px_var(--border-hairline)]"
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </GlassPanel>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="fixed inset-0 z-59 flex flex-col justify-between gap-10 overflow-y-auto overscroll-contain bg-surface-page bg-[image:var(--surface-field)] px-[var(--page-margin)] pb-10 pt-20 md:hidden"
      >
        <ul className="flex flex-col">
          {[
            ...nav.filter((n) => n.href !== "/contact"),
            { href: site.resume, label: "Résumé ↗" },
            { href: "/contact", label: "Contact" },
          ].map((item, i, all) => {
            const external = item.href.startsWith("/uploads");
            const last = i === all.length - 1;
            return (
              <li
                key={item.href}
                className={cn(
                  "border-t border-border-hairline py-1.25",
                  last && "border-b",
                )}
              >
                {external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener"
                    className="text-h3 font-bold tracking-[var(--track-display)] text-text-primary no-underline"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-h3 font-bold tracking-[var(--track-display)] no-underline",
                      last ? "text-text-accent" : "text-text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="ds-eyebrow">UK based · Open to permanent UK roles</p>
        </div>
      </nav>
    </>
  );
}
