import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { CaseStudyNav } from "@/components/site/case-study-nav";
import { Icon } from "@/components/site/icon";
import { Container, StatusBadge, Tag } from "@/components/site/primitives";
import { ProjectMedia } from "@/components/site/project-media";
import { RmseComparison } from "@/components/site/project-visuals";
import { Button } from "@/components/ui/button";
import { disciplineLabel } from "@/lib/disciplines";
import { projectBySlug, publishedProjects, type Metric } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

/** Every published project is known at build time, so all are prerendered. */
export function generateStaticParams() {
  return publishedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: p.name, description: p.description },
  };
}

const checked = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const direction: Record<NonNullable<Metric["direction"]>, string | null> = {
  "lower-is-better": "Lower is better",
  "higher-is-better": "Higher is better",
  descriptive: null,
};

const isUrl = (source: string) => /^https?:\/\//.test(source);

const textLink =
  "inline-flex min-h-11 items-center gap-2 cl-type-ui text-brand no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-brand-hover";

/**
 * One chapter of the study, reachable from the section navigation. Its number
 * is set in display type beside the heading and matches the menu; it is a
 * visual landmark only, since document order already carries the sequence.
 */
function Chapter({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border-subtle pt-10 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span aria-hidden className="cl-type-section text-border-control tabular-nums">
          {number}
        </span>
        <h2 id={`${id}-title`} className="cl-type-section text-text-primary">
          {title}
        </h2>
      </div>
      <div className="mt-6 flex flex-col gap-10">{children}</div>
    </section>
  );
}

/**
 * The case study, in the spec's narrative order: summary, evidence preview,
 * problem, key decisions, build, results with their sources, reflection and
 * the next step. Every number on the page comes from the project record and
 * names its source; demonstration media is labelled in its caption.
 */
export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const at = publishedProjects.indexOf(p);
  const prev = publishedProjects[at - 1];
  const next = publishedProjects[at + 1];
  const sources = new Map(p.evidence.map((e) => [e.id, e]));

  const chapters = [
    { id: "overview", label: "Overview" },
    { id: "decisions", label: "Decisions" },
    { id: "build", label: "Build" },
    { id: "results", label: "Results" },
    ...(p.reflection ? [{ id: "reflection", label: "Reflection" }] : []),
  ].map((c, i) => ({ ...c, number: String(i + 1).padStart(2, "0") }));
  const chapter = (id: string) => {
    const { number } = chapters.find((c) => c.id === id)!;
    return { id, number };
  };

  const facts = [
    ["Role", p.role],
    ["Contribution", p.contributions.join(" · ")],
    ["Discipline", p.categories.map(disciplineLabel).join(" · ")],
    ["Year", p.year],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  return (
    <article aria-labelledby="case-title">
      <header className="cl-page">
        <Container>
          <Link
            href="/work"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 cl-type-ui text-text-secondary no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-text-primary"
          >
            <Icon icon={ArrowLeft} />
            All work
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={p.status} />
            <span className="cl-type-caption text-text-secondary">{p.type}</span>
          </div>
          <h1 id="case-title" className="mt-4 max-w-[20ch] cl-type-page text-balance text-text-primary">
            {p.name}
          </h1>
          {p.headline ? (
            <p className="mt-4 max-w-measure cl-type-subheading text-text-primary">{p.headline}</p>
          ) : null}
          <p className="mt-4 max-w-measure cl-type-lead text-text-secondary">{p.description}</p>

          {p.links?.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-6">
              {p.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className={textLink}>
                    {l.label}
                    <Icon icon={ArrowUpRight} size={16} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

        </Container>
      </header>

      <Container className="mt-10 md:mt-12">
        <ProjectMedia
          project={p}
          slot="primary"
          ratio="16 / 10"
          sizes="(min-width: 75rem) 1200px, 100vw"
          eager
        />
      </Container>

      <Container className="grid gap-10 py-(--cl-section-space) lg:grid-cols-12 lg:gap-x-(--cl-grid-gap)">
        {/* Facts sit beside the story rather than between the title and the
            media. Only the section menu is sticky, so a long contribution
            line can never push it off screen. */}
        <aside className="flex flex-col gap-10 lg:col-span-3">
          <dl className="grid gap-x-8 gap-y-5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-1">
            {facts.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="cl-type-eyebrow uppercase text-text-muted">{k}</dt>
                <dd className="mt-1 cl-type-ui text-text-primary">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:sticky lg:top-[calc(var(--cl-header-offset)+var(--cl-header-height)+1.5rem)]">
            <CaseStudyNav sections={chapters} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-16 lg:col-span-8 lg:col-start-5">
          <Chapter {...chapter("overview")} title="Overview">
            <div className="max-w-measure">
              <h3 className="cl-type-subheading text-text-primary">The problem</h3>
              <p className="mt-3 cl-type-body text-text-secondary">{p.problem}</p>
            </div>
          </Chapter>

          <Chapter {...chapter("decisions")} title="Key decisions">
            <ol className="flex flex-col">
              {p.decisions.map((d) => (
                <li key={d.t} className="grid gap-2 border-t border-border py-6 last:border-b md:grid-cols-[2fr_3fr] md:gap-8">
                  <h3 className="cl-type-subheading text-text-primary">{d.t}</h3>
                  <p className="cl-type-body text-text-secondary">{d.d}</p>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter {...chapter("build")} title="Build">
            <div className="max-w-measure">
              <h3 className="cl-type-subheading text-text-primary">What I built</h3>
              {p.built.split("\n\n").map((para) => (
                <p key={para.slice(0, 32)} className="mt-3 cl-type-body text-text-secondary">
                  {para}
                </p>
              ))}
            </div>

            <div>
              <h3 className="cl-type-subheading text-text-primary">{p.processLabel}</h3>
              <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                {p.process.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-control border border-border bg-bg-surface px-3 py-2 cl-type-caption text-text-primary">
                      <span className="tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
                      {step}
                    </span>
                    {i < p.process.length - 1 ? (
                      <Icon icon={ArrowRight} size={16} className="text-text-muted" />
                    ) : null}
                  </li>
                ))}
              </ol>
              {p.processNote ? (
                <p className="mt-6 max-w-measure cl-type-body text-text-secondary">{p.processNote}</p>
              ) : null}
            </div>

            {p.engineering ? (
              <div>
                <h3 className="cl-type-subheading text-text-primary">{p.engineering.label}</h3>
                {p.engineering.body ? (
                  <p className="mt-3 max-w-measure cl-type-body text-text-secondary">{p.engineering.body}</p>
                ) : null}
                <dl className="mt-6 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2">
                  {p.engineering.grid.map(([k, v]) => (
                    <div key={k} className="bg-bg-surface p-5">
                      <dt className="cl-type-eyebrow uppercase text-text-muted">{k}</dt>
                      <dd className="mt-1.5 cl-type-body text-text-primary">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {p.media?.detail ? (
              <figure className="m-0">
                <div className="overflow-hidden rounded-media border border-border bg-bg-subtle">
                  <Image
                    src={p.media.detail.src}
                    alt={p.media.detail.alt}
                    sizes="(min-width: 75rem) 800px, 100vw"
                    placeholder="blur"
                    className="h-auto w-full"
                  />
                </div>
                {p.media.detail.caption ? (
                  <figcaption className="mt-3 cl-type-caption text-text-secondary">
                    {p.media.detail.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {p.tools?.length ? (
              <div>
                <h3 className="cl-type-ui text-text-primary">Tools</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <li key={t}>
                      <Tag>{t}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Chapter>

          <Chapter {...chapter("results")} title="Results">
            {p.metrics?.length ? (
              <dl
                className={
                  "grid gap-px overflow-hidden rounded-card border border-border bg-border " +
                  (p.metrics.length > 2 ? "md:grid-cols-3" : "sm:grid-cols-2")
                }
              >
                {p.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col gap-2 bg-bg-surface p-6">
                    <dt className="cl-type-caption text-text-secondary">{m.label}</dt>
                    <dd className="flex flex-wrap items-baseline gap-x-2">
                      <span className="cl-type-section text-text-primary tabular-nums">{m.value}</span>
                      <span className="cl-type-ui text-text-secondary">{m.unit}</span>
                    </dd>
                    {m.comparison === "rmse" ? (
                      <dd className="my-2">
                        <RmseComparison />
                      </dd>
                    ) : null}
                    <dd className="cl-type-caption text-text-secondary">
                      {[m.context, m.direction ? direction[m.direction] : null].filter(Boolean).join(". ")}.
                    </dd>
                    <dd className="cl-type-caption text-text-muted">
                      Source: {sources.get(m.sourceId)?.label}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <p className="max-w-measure cl-type-body text-text-secondary">{p.outcome}</p>

            <div>
              <h3 className="cl-type-ui text-text-primary">Sources</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {p.evidence.map((e) => (
                  <li key={e.id} className="max-w-measure cl-type-caption text-text-secondary">
                    <span className="text-text-primary">{e.label}.</span>{" "}
                    {isUrl(e.source) ? (
                      <a href={e.source} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2 hover:text-brand-hover">
                        {new URL(e.source).hostname}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span>{e.source}</span>
                    )}{" "}
                    Checked {checked.format(new Date(e.verifiedOn))}.
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>

          {p.reflection ? (
            <Chapter {...chapter("reflection")} title="Reflection">
              <p className="max-w-measure cl-type-body text-text-secondary">{p.reflection}</p>
            </Chapter>
          ) : null}
        </div>
      </Container>

      {/* C19: real links with labels and names, in Work order, no wrap-around. */}
      <Container className="pb-(--cl-section-space)">
        <nav aria-label="More projects" className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              rel="prev"
              className="group flex flex-col gap-1 rounded-card p-4 no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:bg-bg-subtle sm:-ml-4"
            >
              <span className="inline-flex items-center gap-2 cl-type-ui text-text-secondary">
                <Icon icon={ArrowLeft} size={16} />
                Previous project
              </span>
              <span className="cl-type-subheading text-text-primary">{prev.name}</span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/work/${next.slug}`}
              rel="next"
              className="group flex flex-col gap-1 rounded-card p-4 no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:bg-bg-subtle sm:-mr-4 sm:items-end sm:text-right"
            >
              <span className="inline-flex items-center gap-2 cl-type-ui text-text-secondary">
                Next project
                <Icon icon={ArrowRight} size={16} />
              </span>
              <span className="cl-type-subheading text-text-primary">{next.name}</span>
              {/* A teaser, so the next project has a reason to be opened. */}
              <span className="mt-1 line-clamp-3 max-w-measure cl-type-caption text-text-secondary">
                {next.description}
              </span>
              <span className="cl-type-caption text-text-muted">
                {[next.categories.map(disciplineLabel).join(" · "), next.year].filter(Boolean).join(" · ")}
              </span>
            </Link>
          ) : null}
        </nav>

        <div className="mt-12 flex flex-col gap-4 rounded-card border border-border bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <p className="cl-type-subheading text-text-primary">Working on something similar?</p>
          <Button asChild>
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </Container>
    </article>
  );
}
