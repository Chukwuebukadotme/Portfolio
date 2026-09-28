import Link from "next/link";

import { Tag } from "@/components/site/primitives";
import { ProjectMedia } from "@/components/site/project-media";
import type { Project } from "@/lib/projects";

/**
 * One row of Selected Work. Reads project → what it does → discipline →
 * evidence, with the artwork opposite. Side alternation belongs to the list
 * (.project-list), so it follows visible position when the list is filtered.
 */
export function ProjectCard({
  project: p,
  heading: Heading = "h3",
}: {
  project: Project;
  heading?: "h2" | "h3";
}) {
  const href = `/work/${p.slug}`;
  // The discipline line already names some capabilities; tags add the rest.
  const named = p.type.toLowerCase();
  const tags = p.capabilities
    .filter((c) => !named.includes(c.toLowerCase()))
    .slice(0, 4);

  return (
    <article className="group grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div data-project-text className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-accent">
            {p.number}
          </span>
          {p.year ? (
            <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
              {p.year}
            </span>
          ) : null}
          {p.status ? (
            <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
              {p.status}
            </span>
          ) : null}
        </div>

        <Heading className="mt-3 text-h4 font-bold text-balance text-text-primary">
          {p.name}
        </Heading>
        <p className="mt-3 max-w-[var(--measure-large)] text-medium text-text-secondary">
          {p.description}
        </p>
        <p className="mt-4 font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
          {p.type}
        </p>

        {tags.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Capabilities">
            {tags.map((c) => (
              <li key={c}>
                <Tag>{c}</Tag>
              </li>
            ))}
          </ul>
        ) : null}

        {p.evidence ? (
          <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-border-accent pl-3 text-small text-text-primary">
            <span className="ds-eyebrow">Outcome</span>
            {p.evidence}
          </p>
        ) : null}

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-1.5 text-medium font-medium text-text-primary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-accent"
        >
          View case study<span className="sr-only">: {p.name}</span>
          <span
            aria-hidden
            className="text-text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-glass)] group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </div>

      {/* The artwork repeats the link for pointer users; keyboard and screen
          reader users get the single text link above. */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="block overflow-hidden rounded-md no-underline"
      >
        <ProjectMedia
          project={p}
          slot="card"
          ratio="16 / 10"
          sizes="(min-width: 1440px) 656px, (min-width: 768px) 50vw, 100vw"
          className="transition-transform duration-[var(--dur-slow)] ease-[var(--ease-glass)] group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
    </article>
  );
}
