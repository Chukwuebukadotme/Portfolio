import Link from "next/link";
import { ArrowRight, BrainCircuit, CodeXml, PenTool, type LucideIcon } from "lucide-react";

import { HeroNetwork } from "@/components/site/hero-network";
import { Icon } from "@/components/site/icon";
import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { capabilities, hero, site } from "@/lib/content";
import { homeProjects, projectBySlug, publishedProjects } from "@/lib/projects";
import { resumeMeta } from "@/lib/resume";

/** One neutral icon per capability; cobalt stays reserved for actions. */
const capabilityIcon: Record<(typeof capabilities)[number]["title"], LucideIcon> = {
  "Product design": PenTool,
  "Product engineering": CodeXml,
  "AI engineering": BrainCircuit,
};

const textLink =
  "inline-flex min-h-11 items-center gap-2 cl-type-ui text-brand no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard hover:text-brand-hover";

/**
 * Home: identity and actions, selected work, capabilities tied to that work,
 * then contact. The spec's experience section is omitted at the owner's
 * request (see its decision register). Everything renders as static content
 * first; the network art and scroll reveals are enhancements only.
 */
export default function HomePage() {
  const resume = resumeMeta();
  const more = publishedProjects.filter((p) => !homeProjects.includes(p));

  return (
    <>
      {/* Hero: name, role, line and actions sit in seven columns; the network
          weights the remaining five and fades out before it reaches the copy. */}
      <section data-hero aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <HeroNetwork className="absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--cl-color-bg-canvas)_78%,transparent)_0%,color-mix(in_oklab,var(--cl-color-bg-canvas)_78%,transparent)_70%,var(--cl-color-bg-canvas)_100%)] lg:bg-[linear-gradient(to_right,var(--cl-color-bg-canvas)_0%,color-mix(in_oklab,var(--cl-color-bg-canvas)_72%,transparent)_38%,transparent_60%),linear-gradient(to_bottom,transparent_70%,var(--cl-color-bg-canvas)_100%)]"
        />

        <Container className="cl-page pb-16 lg:grid lg:min-h-[min(88svh,58rem)] lg:grid-cols-12 lg:items-center lg:gap-x-(--cl-grid-gap) lg:pb-24">
          <div className="lg:col-span-7">
            <p className="cl-type-subheading text-text-primary">{site.name}</p>
            {/* What I do, then whether I am available, before the headline,
                so availability is read first rather than after the actions. */}
            <p className="mt-2 cl-type-eyebrow uppercase text-brand">{site.role}</p>
            <p className="mt-1 cl-type-caption text-text-secondary">{site.availability}</p>
            <h1 id="hero-title" className="mt-6 cl-type-page text-balance text-text-primary">
              {hero.lead} <span className="text-brand">{hero.highlight}</span> {hero.tail}
            </h1>
            <p className="mt-6 max-w-measure cl-type-lead text-text-secondary">{hero.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="#selected-work">Selected work</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                  <span className="cl-type-caption text-text-secondary">{resume}</span>
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section id="selected-work" labelledBy="selected-work-title" className="pt-0 lg:pt-0">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-x-(--cl-grid-gap)">
            <div className="lg:col-span-7">
              <Eyebrow>Selected work</Eyebrow>
              <h2 id="selected-work-title" className="mt-3 cl-type-section text-text-primary">
                Products and research, with the evidence behind them.
              </h2>
            </div>
            <p className="max-w-measure cl-type-body text-text-secondary lg:col-span-5">
              A plugin designers use, a product in development, a research
              study and a cloud pipeline. Each case study separates what I
              built from what it achieved.
            </p>
          </div>

          <ul className="mt-12 flex flex-col gap-(--cl-project-gap) md:mt-16">
            {homeProjects.map((p, i) => (
              <Reveal key={p.slug} index={i} as="li">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-(--cl-project-gap) flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            {more.length ? (
              <p className="cl-type-body text-text-secondary">
                Also on the Work page: {more.map((p) => p.name).join(", ")}.
              </p>
            ) : (
              <span />
            )}
            <Link href="/work" className={textLink}>
              View all {publishedProjects.length} projects
              <Icon icon={ArrowRight} />
            </Link>
          </div>
        </Container>
      </Section>

      <Section labelledBy="capabilities-title" className="border-t border-border-subtle">
        <Container>
          <Eyebrow>Capabilities</Eyebrow>
          <h2 id="capabilities-title" className="mt-3 max-w-[24ch] cl-type-section text-text-primary">
            What I bring to a team, and where to see it.
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-(--cl-grid-gap)">
            {capabilities.map((c, i) => {
              const shown = c.projects.map(projectBySlug).filter((p) => p !== undefined);
              return (
                <Reveal key={c.title} index={i} as="li" className="border-t border-border pt-6">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-control bg-bg-subtle text-text-primary">
                    <Icon icon={capabilityIcon[c.title]} />
                  </span>
                  <h3 className="cl-type-subheading text-text-primary">{c.title}</h3>
                  <p className="mt-3 cl-type-body text-text-secondary">{c.body}</p>
                  {shown.length ? (
                    <>
                      <p className="mt-5 cl-type-eyebrow uppercase text-text-muted">Shown in</p>
                      <ul className="mt-1">
                        {shown.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/work/${p.slug}`} className={textLink}>
                              {p.name}
                              <Icon icon={ArrowRight} size={16} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* The hiring call sits on the subtle surface: more weight than the
          page around it, while cobalt stays on its one action. */}
      <Section labelledBy="contact-title" className="pt-0 lg:pt-0">
        <Container className="flex flex-col gap-6 rounded-card bg-bg-subtle p-6 sm:p-10 md:flex-row md:items-end md:justify-between lg:p-12">
          <div className="max-w-measure">
            <Eyebrow>{site.availability}</Eyebrow>
            <h2 id="contact-title" className="mt-3 cl-type-section text-text-primary">
              Hiring for design, product or AI engineering?
            </h2>
            <p className="mt-3 cl-type-body text-text-secondary">
              I’m open to permanent roles across the UK and to selected product
              collaborations.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
