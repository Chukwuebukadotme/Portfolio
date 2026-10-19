import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Container, Section, Tag } from "@/components/site/primitives";
import { ProjectMedia } from "@/components/site/project-media";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { projectBySlug, publishedProjects as projects } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

/** Every project is known at build time, so all case studies are prerendered. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
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

/** Label column plus body, the rhythm every text section shares. */
function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-10">
      <Reveal>
        <h2 className="ds-eyebrow">{label}</h2>
      </Reveal>
      <Reveal index={1} className="min-w-0">
        {children}
      </Reveal>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const at = projects.indexOf(p);
  const prev = projects[(at - 1 + projects.length) % projects.length];
  const next = projects[(at + 1) % projects.length];

  const facts = [
    ["Type", p.type],
    ["Role", p.role],
    ["Contribution", p.contributions.join(" · ")],
    ["Year", p.year],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  return (
    <>
      {/* Hero */}
      <Section className="pt-32">
        <Container>
          <Link
            href="/work"
            className="ds-eyebrow no-underline transition-colors duration-[var(--dur-fast)] hover:text-text-primary"
          >
            ← All work
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-accent">
                {String(at + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              {p.status ? (
                <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                  {p.status}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-[20ch] text-h1 font-extrabold text-balance text-text-primary">
              {p.name}
            </h1>
            {p.headline ? (
              <p className="mt-4 max-w-[var(--measure-large)] text-h5 font-medium text-text-primary">
                {p.headline}
              </p>
            ) : null}
            <p className="mt-4 max-w-[var(--measure-large)] text-large text-text-secondary">
              {p.description}
            </p>

            {p.links?.[0] ? (
              <a
                href={p.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-medium font-medium text-text-primary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-accent"
              >
                Visit the product site
                <span aria-hidden className="text-text-accent">
                  ↗
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}

            <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-border-hairline pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="ds-eyebrow">{k}</dt>
                  <dd className="mt-1.5 text-medium text-text-secondary">{v}</dd>
                </div>
              ))}
            </dl>
          </header>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal>
            <ProjectMedia
              project={p}
              slot="primary"
              ratio="16 / 9"
              sizes="(min-width: 1440px) 1312px, 100vw"
              eager
            />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Block label="The problem">
            <p className="max-w-[var(--measure-large)] text-large text-text-primary">
              {p.problem}
            </p>
          </Block>
        </Container>
      </Section>

      <Section>
        <Container>
          <Block label="What I built">
            <div className="flex max-w-[var(--measure-large)] flex-col gap-4">
              {p.built.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)} className="text-medium text-text-secondary">
                  {para}
                </p>
              ))}
            </div>
          </Block>
        </Container>
      </Section>

      {/* Approach: each project names its own sequence. */}
      <Section className="pt-0">
        <Container>
          <Block label="Approach">
            <h3 className="text-h5 font-semibold text-text-primary">{p.processLabel}</h3>
            <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
              {p.process.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-tiny tracking-[var(--track-meta)] text-text-secondary shadow-[inset_0_0_0_1px_var(--border-hairline)]">
                    <span className="text-text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </span>
                  {i < p.process.length - 1 ? (
                    <span aria-hidden className="text-text-accent">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
            {p.processNote ? (
              <p className="mt-8 max-w-[var(--measure-large)] text-medium text-text-secondary">
                {p.processNote}
              </p>
            ) : null}
          </Block>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <h2 className="ds-eyebrow">Key decisions</h2>
          </Reveal>
          <ul className="mt-6 flex flex-col">
            {p.decisions.map((d, i) => (
              <Reveal
                key={d.t}
                index={i}
                as="li"
                className="grid gap-3 border-t border-border-hairline py-6 last:border-b md:grid-cols-[1fr_2fr] md:gap-8"
              >
                <h3 className="text-h6 font-semibold text-text-primary">{d.t}</h3>
                <p className="text-medium text-text-secondary">{d.d}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {p.media?.detail ? (
        <Section className="pt-0">
          <Container>
            <Reveal as="div">
              <figure>
                <div className="relative overflow-hidden rounded-md bg-surface-sunken">
                  <Image
                    src={p.media.detail.src}
                    alt={p.media.detail.alt}
                    sizes="(min-width: 1440px) 1312px, 100vw"
                    placeholder="blur"
                    className="block h-auto w-full"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_0_0_1px_var(--border-hairline)]"
                  />
                </div>
                {p.media.detail.caption ? (
                  <figcaption className="mt-3 font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                    {p.media.detail.caption}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {p.engineering ? (
        <Section>
          <Container>
            <Block label={p.engineering.label}>
              {p.engineering.body ? (
                <p className="max-w-[var(--measure-large)] text-medium text-text-secondary">
                  {p.engineering.body}
                </p>
              ) : null}
              <dl
                className={
                  (p.engineering.body ? "mt-8 " : "") +
                  "grid gap-px overflow-hidden rounded-sm border border-border-hairline bg-border-hairline sm:grid-cols-2"
                }
              >
                {p.engineering.grid.map(([k, v]) => (
                  <div key={k} className="bg-surface-page p-5">
                    <dt className="ds-eyebrow text-text-accent">{k}</dt>
                    <dd className="mt-1.5 font-mono text-small text-text-secondary">{v}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          </Container>
        </Section>
      ) : null}

      {/* Outcome */}
      <Section>
        <Container>
          <Reveal>
            <h2 className="ds-eyebrow">Outcome</h2>
          </Reveal>
          {p.metrics ? (
            <dl className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border-hairline bg-border-hairline sm:grid-cols-3">
              {p.metrics.map((m, i) => (
                <Reveal key={m.label} index={i} className="flex flex-col-reverse gap-2 bg-surface-page p-6 md:p-8">
                  <dt className="ds-eyebrow">{m.label}</dt>
                  <dd className="self-start text-h2 font-bold text-gradient-accent tabular-nums">{m.value} {m.unit}</dd>
                </Reveal>
              ))}
            </dl>
          ) : null}
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <p className="text-medium text-text-secondary">{p.outcome}</p>
            </Reveal>
            {p.reflection ? (
              <Reveal index={1}>
                <h3 className="ds-eyebrow">Reflection</h3>
                <p className="mt-4 text-medium text-text-secondary">{p.reflection}</p>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* Tools and capabilities */}
      <Section className="pt-0">
        <Container>
          <dl className="grid gap-8 border-t border-border-hairline pt-8 md:grid-cols-2">
            {p.tools?.length ? (
              <div>
                <dt className="ds-eyebrow">Tools</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="ds-eyebrow">Capabilities</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {p.capabilities.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      {/* Sequence follows the Selected Work order. */}
      <Section className="pt-0">
        <Container>
          <nav
            aria-label="More projects"
            className="grid gap-px overflow-hidden rounded-sm border border-border-hairline bg-border-hairline sm:grid-cols-2"
          >
            {[
              { dir: "Previous", item: prev, arrow: "←" },
              { dir: "Next", item: next, arrow: "→" },
            ].map(({ dir, item, arrow }) => (
              <Link
                key={dir}
                href={`/work/${item.slug}`}
                rel={dir === "Next" ? "next" : "prev"}
                className={
                  "group flex flex-col gap-2 bg-surface-page p-6 no-underline transition-colors duration-[var(--dur-fast)] hover:bg-state-hover md:p-8 " +
                  (dir === "Next" ? "sm:items-end sm:text-right" : "")
                }
              >
                <span className="ds-eyebrow">
                  {dir === "Previous" ? `${arrow} ${dir}` : `${dir} ${arrow}`}
                </span>
                <span className="text-h5 font-bold text-balance text-text-primary transition-colors duration-[var(--dur-fast)] group-hover:text-text-accent">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-medium text-text-secondary">
              Working on something similar?
            </p>
            <Button asChild>
              <Link href="/contact">Start a conversation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
