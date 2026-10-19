import type { Metadata } from "next";

import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { ProjectCard } from "@/components/site/project-card";
import { WorkIndex } from "@/components/site/work-index";
import { publishedProjects } from "@/lib/projects";

const intro =
  "A collection of digital products, design systems, machine learning systems and engineering projects spanning product design, frontend development, artificial intelligence and data.";

export const metadata: Metadata = {
  title: "Work",
  description: intro,
};

export default function WorkPage() {
  return (
    <>
      <Section className="pt-32">
        <Container>
          <Eyebrow>Selected work</Eyebrow>
          <h1 className="mt-3 max-w-[var(--measure-large)] text-h1 font-extrabold text-text-primary">
            Designed with intent. Built to solve real problems.
          </h1>
          <p className="mt-6 max-w-[var(--measure-large)] text-large text-text-secondary">
            {intro}
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <WorkIndex
            items={publishedProjects.map((p) => ({
              slug: p.slug,
              categories: p.categories,
              card: <ProjectCard project={p} heading="h2" />,
            }))}
          />
        </Container>
      </Section>
    </>
  );
}
