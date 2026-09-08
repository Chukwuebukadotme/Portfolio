import type { Metadata } from "next";
import Link from "next/link";

import {
  Container,
  Eyebrow,
  MediaPlaceholder,
  Section,
  Tag,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { cases, homeCaseOrder } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected digital products across financial technology, construction technology and healthcare.",
};

const ordered = homeCaseOrder
  .map((slug) => cases.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export default function WorkPage() {
  return (
    <>
      <Section className="pt-32">
        <Container>
          <Eyebrow>Work</Eyebrow>
          <h1 className="mt-3 max-w-[var(--measure-large)] text-h1 font-extrabold text-text-primary">
            Designed with intent. Built to solve real problems.
          </h1>
          <p className="mt-6 max-w-[var(--measure-small)] text-large text-text-secondary">
            Selected digital products across financial technology, construction
            technology and healthcare.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <ul className="flex flex-col gap-20">
            {ordered.map((c, i) => (
              <Reveal key={c.slug} index={i} as="li">
                <article className="grid items-center gap-10 md:grid-cols-2">
                  <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-accent">
                        {c.number}
                      </span>
                      <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                        {c.year}
                      </span>
                      <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                        {c.industry}
                      </span>
                      <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
                        {c.status}
                      </span>
                    </div>

                    <h2 className="mt-3 text-h3 font-bold text-text-primary">
                      <Link
                        href={`/work/${c.slug}`}
                        className="text-text-primary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-accent"
                      >
                        {c.name}
                      </Link>
                    </h2>

                    <p className="mt-3 text-large text-text-primary">
                      {c.headline}
                    </p>
                    <p className="mt-3 max-w-[var(--measure-large)] text-medium text-text-secondary">
                      {c.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {c.tech.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>

                    <dl className="mt-6 flex flex-col gap-2 text-small">
                      <div className="flex flex-wrap gap-2">
                        <dt className="ds-eyebrow">Role</dt>
                        <dd className="text-text-secondary">{c.role}</dd>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <dt className="ds-eyebrow">Areas</dt>
                        <dd className="text-text-secondary">
                          {c.areas.join(" · ")}
                        </dd>
                      </div>
                    </dl>

                    <Link
                      href={`/work/${c.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-medium font-medium text-text-primary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-accent"
                    >
                      View case study{" "}
                      <span aria-hidden className="text-text-accent">
                        →
                      </span>
                    </Link>
                  </div>

                  <MediaPlaceholder label={`${c.name} — preview`} />
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
