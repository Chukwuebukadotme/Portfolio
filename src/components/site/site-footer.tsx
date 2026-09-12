import Link from "next/link";

import { site } from "@/lib/content";

/**
 * The footer is one inset panel rather than a full-bleed strip: a card with
 * fastened corners, the contact details across the top, and the name set
 * enormous along the bottom where the card clips it.
 *
 * It carries its own ground in both themes. In dark it is a shade lighter than
 * the page so it reads as a plate laid on top; in light it is a shade darker,
 * which is the same relationship inverted rather than a light-mode afterthought.
 */

const socials = [
  { href: site.linkedin, label: "LinkedIn", external: true },
  { href: site.github, label: "GitHub", external: true },
  { href: site.resume, label: "Résumé", external: true },
] as const;

const pages = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** The four fasteners. Small, and deliberately not perfectly bright. */
function Screw({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-[9px] rounded-full bg-[var(--footer-screw)] shadow-[inset_0_1px_1px_rgba(0,0,0,.45)] ${className}`}
    />
  );
}

function Arrow() {
  return (
    <span aria-hidden className="ml-0.5 inline-block">
      ↗
    </span>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-[var(--page-margin)] pb-6 pt-32">
      <div
        className="
          relative isolate overflow-hidden rounded-[18px]
          bg-[var(--footer-bg)] px-6 pb-0 pt-10
          shadow-[inset_0_0_0_1px_var(--footer-line)]
          sm:px-10 sm:pt-12
        "
      >
        <Screw className="left-3 top-3" />
        <Screw className="right-3 top-3" />
        <Screw className="bottom-3 left-3" />
        <Screw className="bottom-3 right-3" />

        <div className="relative z-10 mx-auto flex max-w-[var(--container-large)] flex-col gap-10 text-center md:flex-row md:items-start md:justify-between md:gap-8 md:text-left">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <h2 className="text-h2 font-light tracking-[var(--track-heading)] text-[var(--footer-text)]">
              Let&rsquo;s Connect
            </h2>
            <a
              href={`mailto:${site.contactEmail}`}
              className="
                text-medium text-[var(--footer-accent)] underline
                decoration-[var(--footer-accent)]/45 underline-offset-4
                transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)]
                hover:decoration-[var(--footer-accent)] sm:text-large
              "
            >
              {site.contactEmail}
              <Arrow />
            </a>

            <nav
              aria-label="Footer"
              className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-start"
            >
              {pages.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="ds-eyebrow text-[var(--footer-muted)] no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-[var(--footer-text)]"
                >
                  {p.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-center gap-5 md:items-end">
            <p className="text-small text-[var(--footer-muted)]">
              © {year} {site.name}
            </p>

            <nav
              aria-label="Elsewhere"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-medium text-[var(--footer-text)] no-underline transition-opacity duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:opacity-70"
                >
                  {s.label}
                  <Arrow />
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* The name, spanning the card and cropped along the bottom edge.
            Drawn as SVG text with an explicit textLength so it fills the width
            exactly at any viewport, rather than depending on a font size that
            happens to fit one screen and overflows the next. The wrapper's
            aspect ratio is shorter than the artwork, so the crop comes from
            overflow rather than from guessing pixel heights. */}
        <div
          aria-hidden
          className="pointer-events-none relative z-0 mt-8 select-none overflow-hidden"
          style={{ aspectRatio: "1000 / 132" }}
        >
          <svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="xMidYMin meet"
            className="block w-full"
          >
            <text
              x="500"
              y="168"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="var(--footer-mark)"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "176px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Chukwuebuka
            </text>
          </svg>
        </div>

      </div>
    </footer>
  );
}
