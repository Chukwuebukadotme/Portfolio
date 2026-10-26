import type { Metadata } from "next";
import Link from "next/link";

import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { about, education, site } from "@/lib/content";
import { publishedProjects } from "@/lib/projects";
import { resumeMeta } from "@/lib/resume";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
};

/**
 * About: the person, how design and AI meet in the work, education, and a
 * skills-to-evidence table built from the published projects rather than a
 * free-standing technology list. The career list is omitted at the owner's
 * request (see the spec's decision register).
 */
export default function AboutPage() {
  const resume = resumeMeta();

  return (
    <>
      <section aria-labelledby="about-title" className="cl-page pb-(--cl-section-space)">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-(--cl-grid-gap)">
          <div className="lg:col-span-7">
            <Eyebrow>About</Eyebrow>
            <h1 id="about-title" className="mt-3 cl-type-page text-text-primary">
              {site.name}
            </h1>
            <p className="mt-3 cl-type-subheading text-text-secondary">{site.role}</p>
            <p className="mt-6 max-w-measure cl-type-lead text-text-primary">{about.intro}</p>
            <p className="mt-4 max-w-measure cl-type-body text-text-secondary">{about.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Get in touch</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                  <span className="cl-type-caption text-text-secondary">{resume}</span>
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              </Button>
            </div>
            <p className="mt-6 max-w-measure cl-type-caption text-text-secondary">{about.availability}</p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <h2 className="cl-type-eyebrow uppercase text-text-muted">How I work</h2>
            <dl className="mt-3">
              {about.practice.map((p) => (
                <div key={p.title} className="border-t border-border py-4 last:border-b">
                  <dt className="cl-type-ui text-text-primary">{p.title}</dt>
                  <dd className="mt-1 cl-type-caption text-text-secondary">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <Section labelledBy="design-ai-title" className="border-t border-border-subtle">
        <Container>
          <Eyebrow>Design and AI</Eyebrow>
          <h2 id="design-ai-title" className="mt-3 max-w-[24ch] cl-type-section text-text-primary">
            Where the two meet in the work.
          </h2>
          <p className="mt-4 max-w-measure cl-type-body text-text-secondary">{about.designAndAi}</p>
        </Container>
      </Section>

      <Section labelledBy="education-title" className="border-t border-border-subtle">
        <Container>
          <Eyebrow>Education</Eyebrow>
          <h2 id="education-title" className="mt-3 cl-type-section text-text-primary">
            Education and certification
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3 md:gap-(--cl-grid-gap)">
            {education.map((e) => (
              <li key={e.award} className="border-t border-border pt-5">
                <p className="cl-type-caption text-text-secondary tabular-nums">{e.date}</p>
                <h3 className="mt-2 cl-type-ui text-text-primary">{e.award}</h3>
                <p className="mt-1 cl-type-caption text-text-secondary">
                  {"location" in e ? `${e.institution}, ${e.location}` : e.institution}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="skills-title" className="border-t border-border-subtle">
        <Container>
          <Eyebrow>Skills in context</Eyebrow>
          <h2 id="skills-title" className="mt-3 cl-type-section text-text-primary">
            Where each tool was used
          </h2>
          <div role="region" aria-labelledby="skills-title" tabIndex={0} className="mt-8 max-w-full overflow-x-auto">
            <table className="w-full border-collapse text-left cl-type-caption">
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border py-3 pr-6 font-semibold text-text-primary">
                    Project
                  </th>
                  <th scope="col" className="border-b border-border py-3 font-semibold text-text-primary">
                    Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {publishedProjects
                  .filter((p) => p.tools?.length)
                  .map((p) => (
                    <tr key={p.slug}>
                      <th scope="row" className="border-b border-border py-3 pr-6 align-top font-normal">
                        <Link href={`/work/${p.slug}`} className="text-brand underline underline-offset-2 hover:text-brand-hover">
                          {p.name}
                        </Link>
                      </th>
                      <td className="border-b border-border py-3 align-top text-text-secondary">
                        {p.tools?.join(", ")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
    </>
  );
}
