import type { Metadata } from "next";
import Link from "next/link";

import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { about, site, skills } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-2">
            <div>
              <Eyebrow>{about.eyebrow}</Eyebrow>
              <h1 className="mt-3 text-h1 font-extrabold text-text-primary">
                {about.title}
              </h1>
              <p className="mt-6 max-w-[var(--measure-large)] text-large text-text-secondary">
                {about.intro}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-l-2 border-border-accent pl-6">
              <p className="font-mono text-tiny tracking-[var(--track-eyebrow)] text-text-accent">
                {site.initials}
              </p>
              <p className="text-h2 font-extrabold leading-[var(--leading-tight)] tracking-[var(--track-display)] text-text-primary">
                {about.markTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section grid>
        <Container>
          <Reveal className="max-w-[var(--measure-large)]">
            <h2 className="text-h4 font-bold text-text-primary">
              {about.questionLead}
            </h2>
            <p className="mt-3 text-h3 font-bold text-text-accent">
              {about.question}
            </p>
            <p className="mt-6 text-medium text-text-secondary">
              {about.body}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Eyebrow>The practice</Eyebrow>
          </Reveal>
          <dl className="mt-8 grid gap-6 md:grid-cols-4">
            {about.practice.map((p, i) => (
              <Reveal
                key={p.title}
                index={i}
                className="border-t border-border-hairline pt-5"
              >
                <dt className="text-h5 font-semibold text-text-primary">
                  {p.title}
                </dt>
                <dd className="mt-2 text-small text-text-secondary">
                  {p.body}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>Journey</Eyebrow>
              <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">
                {about.journey.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="text-medium font-medium text-text-primary">
                      {step}
                    </span>
                    {i < about.journey.length - 1 ? (
                      <span aria-hidden className="text-text-accent">
                        →
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>

              <div className="mt-10 border-t border-border-hairline pt-6">
                <Eyebrow>Education</Eyebrow>
                <p className="mt-3 text-h5 font-semibold text-text-primary">
                  {about.education.degree}
                </p>
                <p className="mt-1.5 text-medium text-text-secondary">
                  {about.education.school}
                  <br />
                  {about.education.country}
                </p>
              </div>
            </Reveal>

            <Reveal index={1}>
              <Eyebrow>Availability</Eyebrow>
              <p className="mt-4 text-medium text-text-secondary">
                {about.availability.body}
              </p>
              <p className="mt-3 text-medium text-text-secondary">
                {about.availability.note}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
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
          </div>
        </Container>
      </Section>

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
    </>
  );
}
