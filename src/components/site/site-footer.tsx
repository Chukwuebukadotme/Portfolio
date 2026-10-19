import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { site } from "@/lib/content";
import { resumeMeta } from "@/lib/resume";

const pages = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const elsewhere = [
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.github, label: "GitHub" },
] as const;

const link =
  "inline-flex min-h-11 items-center gap-1 cl-type-ui text-text-inverse no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-brand-inverse";

/**
 * C20. One inset plate on the inverse palette: a contact invitation with the
 * address visible, the site's routes, résumé and profiles, and the full name
 * in the copyright. The first name set large along the bottom edge is
 * decoration only; the readable name is the copyright line.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const resume = resumeMeta();

  return (
    <footer id="site-footer" className="pb-6 pt-12 md:pt-16">
      <div
        data-surface="inverse"
        className="relative isolate cl-container overflow-hidden rounded-card bg-bg-inverse px-6 pt-10 text-text-inverse sm:px-10 sm:pt-12"
      >
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div>
            <p className="cl-type-eyebrow uppercase text-text-inverse-secondary">
              Contact
            </p>
            <h2 className="mt-3 cl-type-section text-text-inverse">
              Let’s connect.
            </h2>
            <p className="mt-3 max-w-measure cl-type-body text-text-inverse-secondary">
              {site.availability}. Selected product collaborations welcome.
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 break-all cl-type-lead text-brand-inverse underline decoration-1 underline-offset-4 transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-text-inverse"
            >
              <Icon icon={Mail} />
              {site.contactEmail}
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2">
            <ul>
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={link}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              <li>
                <a href={site.resume} target="_blank" rel="noopener" className={link}>
                  Résumé
                  <Icon icon={ArrowUpRight} size={16} />
                  <span className="sr-only">({resume}, opens in a new tab)</span>
                </a>
              </li>
              {elsewhere.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label}
                    <Icon icon={ArrowUpRight} size={16} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-text-inverse/15 pt-6 cl-type-caption text-text-inverse-secondary">
          © {year} {site.name}
        </p>

        {/* The first name, spanning the plate and cropped by its bottom edge.
            SVG text with a fixed textLength fills the width at any viewport. */}
        <div
          aria-hidden
          className="pointer-events-none relative -z-10 mt-6 select-none overflow-hidden"
          style={{ aspectRatio: "1000 / 132" }}
        >
          <svg viewBox="0 0 1000 200" preserveAspectRatio="xMidYMin meet" className="block w-full">
            <text
              x="500"
              y="168"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="fill-text-inverse/[0.05]"
              style={{
                fontFamily: "var(--cl-font-display)",
                fontSize: "176px",
                fontWeight: 700,
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
