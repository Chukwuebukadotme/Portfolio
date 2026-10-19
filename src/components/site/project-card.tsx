import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { StatusBadge } from "@/components/site/primitives";
import { ProjectMedia } from "@/components/site/project-media";
import { disciplineLabel } from "@/lib/disciplines";
import type { Project } from "@/lib/projects";

/**
 * C04 project row. In the DOM, and so on a phone, it reads title, status and
 * discipline, description, evidence, link, then media. On desktop the text
 * takes five columns and the media six, after a one-column gap.
 *
 * One navigation target: the case-study link stretches over the whole row, so
 * the artwork is clickable without adding a second keyboard stop, and the
 * image keeps its text alternative.
 */
export function ProjectCard({
  project: p,
  heading: Heading = "h3",
}: {
  project: Project;
  heading?: "h2" | "h3";
}) {
  return (
    <article className="group relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-(--cl-grid-gap)">
      <div className="min-w-0 lg:col-span-5">
        <Heading className="cl-type-project text-balance text-text-primary">{p.name}</Heading>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge status={p.status} />
          <span className="cl-type-caption text-text-secondary">
            {[p.categories.map(disciplineLabel).join(" · "), p.year].filter(Boolean).join(" · ")}
          </span>
        </div>
        <p className="mt-4 cl-type-body text-text-secondary">{p.description}</p>

        {/* A measured figure is set large with its label beside it, so it
            reads at a glance; an outcome without a figure stays a line. */}
        {p.highlight ? (
          <p className="mt-5 border-l-2 border-brand pl-3">
            <span className="block cl-type-eyebrow uppercase text-text-muted">Evidence</span>
            {p.highlight.value ? (
              <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="cl-type-subheading text-text-primary tabular-nums">
                  {p.highlight.value}
                </span>
                <span className="cl-type-caption text-text-secondary">{p.highlight.label}</span>
              </span>
            ) : (
              <span className="mt-1 block cl-type-ui text-text-primary">{p.highlight.label}</span>
            )}
          </p>
        ) : null}

        <Link
          href={`/work/${p.slug}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 cl-type-ui text-brand no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard after:absolute after:inset-0 hover:text-brand-hover"
        >
          View {p.name} case study
          <Icon
            icon={ArrowRight}
            className="transition-transform duration-(--cl-motion-duration-standard) ease-standard group-focus-within:translate-x-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>

      <ProjectMedia
        project={p}
        slot="card"
        ratio="16 / 10"
        sizes="(min-width: 75rem) 600px, (min-width: 64rem) 50vw, 100vw"
        className="lg:col-span-6 lg:col-start-7"
        mediaClassName="transition-transform duration-(--cl-motion-duration-standard) ease-standard group-focus-within:scale-[1.015] group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100"
      />
    </article>
  );
}
