import Link from "next/link";

import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section className="pt-32">
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-3 text-h1 font-extrabold text-text-primary">
          That page isn’t here.
        </h1>
        <p className="mt-4 max-w-[var(--measure-small)] text-large text-text-secondary">
          The link may be out of date. The work index is the best place to pick
          things up again.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/work">Selected work</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
