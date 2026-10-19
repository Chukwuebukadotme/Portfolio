import Link from "next/link";

import { Container, Eyebrow } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";

/** C18: a way back to Work, Home and Contact, never a dead end. */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="cl-page pb-(--cl-section-space)">
      <Container>
        <Eyebrow>Page not found</Eyebrow>
        <h1 id="not-found-title" className="mt-3 cl-type-page text-text-primary">
          That page isn’t here.
        </h1>
        <p className="mt-4 max-w-measure cl-type-lead text-text-secondary">
          The link may be out of date. The work index is the best place to pick
          things up again.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/work">Browse work</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
