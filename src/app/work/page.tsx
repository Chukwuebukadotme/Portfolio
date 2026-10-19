import type { Metadata } from "next";

import { Container, Eyebrow } from "@/components/site/primitives";
import { ProjectCard } from "@/components/site/project-card";
import { WorkIndex } from "@/components/site/work-index";
import { publishedProjects } from "@/lib/projects";

const intro =
  "Products, research and engineering across product design, design engineering, AI and data. Each case study names my role, what I built and the evidence behind its results.";

export const metadata: Metadata = {
  title: "Work",
  description: intro,
};

export default function WorkPage() {
  return (
    <section aria-labelledby="work-title" className="cl-page pb-(--cl-section-space)">
      <Container>
        <Eyebrow>Work</Eyebrow>
        <h1 id="work-title" className="mt-3 cl-type-page text-text-primary">
          Selected work
        </h1>
        <p className="mt-4 max-w-measure cl-type-lead text-text-secondary">{intro}</p>

        <div className="mt-10">
          <WorkIndex
            items={publishedProjects.map((p) => ({
              slug: p.slug,
              categories: p.categories,
              card: <ProjectCard project={p} heading="h2" />,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
