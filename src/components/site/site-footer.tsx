import Link from "next/link";

import { site } from "@/lib/content";

const internal = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border-hairline px-[var(--page-margin)] py-12">
      <div className="mx-auto flex max-w-[var(--container-large)] flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="inline-flex items-baseline gap-1.5 text-[17px] leading-none tracking-[var(--track-heading)]">
              <span className="font-bold">Chukwuebuka</span>
              <span className="font-light text-text-tertiary">
                Onyemelukwe
              </span>
            </p>
            <p className="ds-eyebrow">
              Design engineer × AI engineer · {site.location}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {internal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ds-eyebrow text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="ds-eyebrow text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
            >
              Résumé ↗
            </a>
            <a
              href={`mailto:${site.email}`}
              className="ds-eyebrow text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
            >
              Email
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-eyebrow text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
            >
              LinkedIn
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-eyebrow text-text-tertiary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-primary"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="ds-eyebrow">
          © {new Date().getFullYear()} · Open to permanent UK roles
        </p>
      </div>
    </footer>
  );
}
