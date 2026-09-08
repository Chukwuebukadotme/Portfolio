import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Container,
  Eyebrow,
  MediaPlaceholder,
  Section,
  Tag,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { caseBySlug, cases, homeCaseOrder } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Every case study is known at build time, so all three are prerendered. */
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = caseBySlug(slug);
  if (!study) return {};
  return {
    title: `${study.name} — ${study.industry}`,
    description: study.summary,
    openGraph: { title: study.name, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = caseBySlug(slug);
  if (!study) notFound();

  const order = homeCaseOrder.indexOf(slug as (typeof homeCaseOrder)[number]);
  const next =
    order >= 0
      ? caseBySlug(homeCaseOrder[(order + 1) % homeCaseOrder.length])
      : undefined;

  return (
    <>
      <Section className="pt-32">
        <Container>
          <Link
            href="/work"
            className="ds-eyebrow no-underline transition-colors duration-[var(--dur-fast)] hover:text-text-primary"
          >
            ← All work
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-accent">
                {study.number}
              </span>
              <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                {study.year}
              </span>
              <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                {study.industry}
              </span>
              <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                {study.status}
              </span>
            </div>

            <h1 className="mt-4 text-h1 font-extrabold text-text-primary">
              {study.name}
            </h1>
            <p className="mt-4 max-w-[var(--measure-large)] text-h5 font-medium text-text-primary">
              {study.headline}
            </p>
            <p className="mt-4 max-w-[var(--measure-large)] text-large text-text-secondary">
              {study.summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {study.tech.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>

            <dl className="mt-8 grid gap-6 border-t border-border-hairline pt-6 md:grid-cols-3">
              <div>
                <dt className="ds-eyebrow">Role</dt>
                <dd className="mt-1.5 text-medium text-text-secondary">
                  {study.role}
                </dd>
              </div>
              <div>
                <dt className="ds-eyebrow">Discipline</dt>
                <dd className="mt-1.5 text-medium text-text-secondary">
                  {study.discipline}
                </dd>
              </div>
              <div>
                <dt className="ds-eyebrow">Areas</dt>
                <dd className="mt-1.5 text-medium text-text-secondary">
                  {study.areas.join(" · ")}
                </dd>
              </div>
            </dl>
          </header>
        </Container>
      </Section>

      <Section>
        <Container>
          <MediaPlaceholder
            label={`${study.name} — primary screen`}
            ratio="16 / 9"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-[200px_1fr]">
            <Reveal>
              <h2 className="ds-eyebrow">Overview</h2>
            </Reveal>
            <Reveal index={1}>
              <p className="max-w-[var(--measure-large)] text-large text-text-primary">
                {study.overview}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section grid>
        <Container>
          <div className="grid gap-10 md:grid-cols-[200px_1fr]">
            <Reveal>
              <h2 className="ds-eyebrow">The problem</h2>
            </Reveal>
            <Reveal index={1}>
              <p className="max-w-[var(--measure-large)] text-medium text-text-secondary">
                {study.problem}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* The reduction — the spine of the product, drawn as a sequence. */}
      <Section>
        <Container>
          <Reveal>
            <h2 className="ds-eyebrow">{study.flowLabel}</h2>
          </Reveal>
          <Reveal index={1}>
            <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
              {study.flow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="border border-border-hairline px-3 py-2 font-mono text-tiny tracking-[var(--track-meta)] text-text-secondary">
                    {step}
                  </span>
                  {i < study.flow.length - 1 ? (
                    <span aria-hidden className="text-text-accent">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-[200px_1fr]">
            <Reveal>
              <h2 className="ds-eyebrow">Approach</h2>
            </Reveal>
            <Reveal index={1}>
              <p className="max-w-[var(--measure-large)] text-medium text-text-secondary">
                {study.approach}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <h2 className="ds-eyebrow">Decisions</h2>
          </Reveal>
          <ul className="mt-6 flex flex-col">
            {study.decisions.map((d, i) => (
              <Reveal
                key={d.t}
                index={i}
                as="li"
                className="grid gap-3 border-t border-border-hairline py-6 last:border-b md:grid-cols-[1fr_2fr] md:gap-8"
              >
                <h3 className="text-h6 font-semibold text-text-primary">
                  {d.t}
                </h3>
                <p className="text-medium text-text-secondary">{d.d}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <MediaPlaceholder
            label={`${study.name} — detail view`}
            ratio="16 / 10"
          />
        </Container>
      </Section>

      <Section grid>
        <Container>
          <div className="grid gap-10 md:grid-cols-[200px_1fr]">
            <Reveal>
              <h2 className="ds-eyebrow">Engineering</h2>
            </Reveal>
            <div>
              <Reveal index={1}>
                <p className="max-w-[var(--measure-large)] text-medium text-text-secondary">
                  {study.engineering}
                </p>
              </Reveal>
              <Reveal index={2}>
                <dl className="mt-8 grid gap-px overflow-hidden border border-border-hairline bg-border-hairline sm:grid-cols-2">
                  {study.arch.map(([layer, detail]) => (
                    <div key={layer} className="bg-surface-page p-5">
                      <dt className="ds-eyebrow text-text-accent">{layer}</dt>
                      <dd className="mt-1.5 font-mono text-small text-text-secondary">
                        {detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="ds-eyebrow">Outcome</h2>
              <p className="mt-4 text-medium text-text-secondary">
                {study.outcome}
              </p>
            </Reveal>
            <Reveal index={1}>
              <h2 className="ds-eyebrow">Reflection</h2>
              <p className="mt-4 text-medium text-text-secondary">
                {study.reflection}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col gap-6 border-t border-border-hairline pt-12 md:flex-row md:items-end md:justify-between">
            {next ? (
              <div>
                <Eyebrow>Next case study</Eyebrow>
                <p className="mt-3 text-h3 font-bold">
                  <Link
                    href={`/work/${next.slug}`}
                    className="text-text-primary no-underline transition-colors duration-[var(--dur-fast)] hover:text-text-accent"
                  >
                    {next.name} →
                  </Link>
                </p>
              </div>
            ) : (
              <span />
            )}
            <Button asChild>
              <Link href="/contact">Start a conversation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
