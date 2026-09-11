import Link from "next/link";

import { HeroNetwork } from "@/components/site/hero-network";
import {
  Container,
  Eyebrow,
  MediaPlaceholder,
  Section,
  Tag,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { RotatingWord } from "@/components/site/rotating-word";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  about,
  capabilities,
  cases,
  disciplines,
  homeCaseOrder,
  process,
  site,
  skills,
  stats,
} from "@/lib/content";

const ordered = homeCaseOrder
  .map((slug) => cases.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        data-hero
        className="relative min-h-[86svh] overflow-hidden"
      >
        <HeroNetwork className="absolute inset-0 -z-10" />

        {/* The network is deliberately weighted to the right and thins out
            before it reaches the headline, so this only has to soften the last
            of it and blend the hero into the page. It is far lighter than the
            grid needed — which is why the artwork now reads at full strength. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            "bg-[linear-gradient(to_bottom,transparent_62%,var(--surface-page)_100%)]",
            "md:bg-[linear-gradient(to_right,var(--surface-page)_0%,color-mix(in_oklab,var(--surface-page)_55%,transparent)_26%,transparent_44%),linear-gradient(to_bottom,transparent_62%,var(--surface-page)_100%)]",
          )}
        />

        <Container className="flex min-h-[86svh] items-center pt-32">
          <div className="max-w-[var(--measure-large)]">
            <h1 className="text-h1 font-extrabold text-text-primary">
              I design and engineer <RotatingWord /> that make complex work
              simpler.
            </h1>
            <p className="mt-6 max-w-[var(--measure-small)] text-large text-text-secondary">
              I’m naturally curious about how things work and how they could
              work better. I combine product thinking, design and engineering to
              build fast, usable and durable websites, applications and
              intelligent systems.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/work">Selected work</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                </a>
              </Button>
            </div>
            <Eyebrow className="mt-6">
              UK based · Open to permanent UK roles
            </Eyebrow>
          </div>
        </Container>
      </section>

      {/* Standing figures */}
      <Section>
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.value} index={i} className="flex flex-col gap-1.5">
                <dt className="text-h3 font-bold tracking-[var(--track-heading)] text-text-primary">
                  {s.value}
                </dt>
                <dd className="text-small text-text-tertiary">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Selected work */}
      <Section>
        <Container>
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Selected work 01 / 03</Eyebrow>
              <h2 className="mt-3 max-w-[var(--measure-large)] text-h2 font-bold text-text-primary">
                Designed with intent.
                <br />
                Built to solve real problems.
              </h2>
            </div>
            <p className="max-w-[var(--measure-small)] text-medium text-text-secondary">
              Selected digital products across financial technology,
              construction technology and healthcare.
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-20">
            {ordered.map((c, i) => (
              <Reveal
                key={c.slug}
                index={i}
                as="article"
                className="grid items-center gap-10 md:grid-cols-2"
              >
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
                  </div>
                  <h3 className="mt-3 text-h4 font-bold text-text-primary">
                    {c.name}
                  </h3>
                  <p className="mt-3 text-large text-text-primary">
                    {c.headline}
                  </p>
                  <p className="mt-3 text-medium text-text-secondary">
                    {c.summary}
                  </p>

                  <dl className="mt-6 flex flex-col gap-2 text-small">
                    <div className="flex flex-wrap gap-2">
                      <dt className="ds-eyebrow">Role</dt>
                      <dd className="text-text-secondary">{c.role}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="ds-eyebrow">Stack</dt>
                      <dd className="text-text-secondary">
                        {c.tech.join(" · ")}
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

                {/* TODO — replace with a product animation once real footage
                    exists. The previous build used a drag-drop <video-slot>,
                    which stored footage per-visitor and shipped nothing. */}
                <MediaPlaceholder label={`${c.name} preview`} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section grid>
        <Container>
          <Reveal>
            <Eyebrow>Capabilities</Eyebrow>
            <h2 className="mt-3 max-w-[var(--measure-large)] text-h2 font-bold text-text-primary">
              From ambiguous problems to working products.
            </h2>
          </Reveal>

          <ul className="mt-12 flex flex-col">
            {capabilities.map((cap, i) => (
              <Reveal
                key={cap.number}
                index={i}
                as="li"
                className="group border-t border-border-hairline transition-colors duration-[var(--dur-base)] ease-[var(--ease-glass)] last:border-b hover:bg-state-hover"
              >
                <div className="grid gap-3 px-3 py-8 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8">
                  <span className="font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary transition-colors duration-[var(--dur-base)] group-hover:text-text-accent">
                    {cap.number}
                  </span>
                  <div>
                    <h3 className="text-h5 font-semibold text-text-primary">
                      {cap.title}
                    </h3>
                    <p className="mt-2 max-w-[var(--measure-large)] text-medium text-text-secondary">
                      {cap.body}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-glass)] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 motion-reduce:opacity-100">
                      {cap.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="hidden text-text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-glass)] group-hover:translate-x-1.5 md:block"
                  >
                    ↗
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <Reveal>
            <Eyebrow>Process 01 / 05</Eyebrow>
            <h2 className="mt-3 text-h3 font-bold text-text-primary">
              Understand. Shape. Build. Launch. Learn.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-5">
            {process.map((p, i) => (
              <Reveal
                key={p.step}
                index={i}
                as="li"
                className="border-t border-border-hairline pt-5"
              >
                <p className="ds-eyebrow text-text-accent">{p.step}</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-small text-text-secondary">
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Disciplines */}
      <Section>
        <Container>
          <Reveal className="max-w-[var(--measure-large)]">
            <h2 className="text-h3 font-bold text-text-primary">
              The interface is only half the product.
            </h2>
            <p className="mt-4 text-medium text-text-secondary">
              Visual quality matters, but so do architecture, accessibility,
              performance, reliability and maintainability. I work across both
              sides so that what looks considered also behaves considered.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {disciplines.map((d, i) => (
              <Reveal
                key={d.title}
                index={i}
                as="article"
                className="group flex flex-col gap-3 border border-border-hairline bg-surface-page p-6 transition-colors duration-[var(--dur-base)] ease-[var(--ease-glass)] hover:bg-state-hover"
              >
                <div className="flex items-center justify-between">
                  <p className="ds-eyebrow transition-colors duration-[var(--dur-base)] group-hover:text-text-accent">
                    {d.label}
                  </p>
                  <span
                    aria-hidden
                    className="text-text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-glass)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </div>
                <h3 className="text-h5 font-semibold text-text-primary">
                  {d.title}
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-small text-text-secondary">
                  {d.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Skills index */}
      <Section grid>
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {skills.map((group, i) => (
              <Reveal key={group.heading} index={i}>
                <h2 className="ds-eyebrow">{group.heading}</h2>
                <ul className="mt-4 flex flex-col gap-2 text-medium text-text-secondary">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* About teaser */}
      <Section>
        <Container>
          <Reveal className="grid items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-3 border-l-2 border-border-accent pl-6">
              <p className="font-mono text-tiny tracking-[var(--track-eyebrow)] text-text-accent">
                {site.initials}
              </p>
              <p className="text-h3 font-extrabold leading-[var(--leading-tight)] tracking-[var(--track-display)] text-text-primary">
                {about.markTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <Eyebrow>About CO</Eyebrow>
              <h2 className="mt-3 text-h4 font-bold text-text-primary">
                Different disciplines.
                <br />
                Same question.
              </h2>
              <p className="mt-3 text-large text-text-accent">
                {about.question}
              </p>
              <p className="mt-4 text-medium text-text-secondary">
                I work at the intersection of design, engineering and product,
                turning complicated business and user problems into digital
                systems that are useful, fast and built to last.
              </p>
              <p className="mt-3 text-medium text-text-secondary">
                Curiosity, experimentation and multidisciplinary thinking shape
                how I approach products and systems.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-medium font-medium text-text-primary no-underline transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)] hover:text-text-accent"
              >
                More about me{" "}
                <span aria-hidden className="text-text-accent">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Closing call */}
      <Section>
        <Container>
          <Reveal className="flex flex-col gap-6 border-t border-border-hairline pt-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[var(--measure-large)]">
              <Eyebrow>Open to permanent UK roles</Eyebrow>
              <h2 className="mt-3 text-h3 font-bold text-text-primary">
                Think we could build something useful together?
              </h2>
              <p className="mt-3 text-medium text-text-secondary">
                I’m open to permanent opportunities across the UK and selected
                product collaborations globally.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">Start a conversation</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                </a>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
