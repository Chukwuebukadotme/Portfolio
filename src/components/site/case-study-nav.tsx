"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * C09. Anchor links to the case study's sections. They are ordinary links, so
 * deep links and navigation work without scripts; with scripts, the section in
 * view is marked visually and with aria-current. Sticky on desktop below the
 * header; a short wrapping list on smaller screens.
 */
export function CaseStudyNav({
  sections,
}: {
  sections: readonly { id: string; label: string; number?: string }[];
}) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section counts as current once its top passes the upper third of the
    // viewport, which matches where the reader's eye is after an anchor jump.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setCurrent(top.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case study sections">
      <p className="cl-type-eyebrow uppercase text-text-muted">On this page</p>
      <ol className="mt-2 flex flex-wrap gap-x-5 lg:flex-col">
        {sections.map((s) => {
          const on = s.id === current;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-3 cl-type-ui no-underline transition-colors duration-(--cl-motion-duration-micro) ease-standard lg:-ml-3 lg:border-l-2 lg:pl-3",
                  on
                    ? "text-text-primary underline decoration-brand decoration-2 underline-offset-[0.4em] lg:border-brand lg:no-underline"
                    : "text-text-secondary hover:text-text-primary lg:border-transparent",
                )}
              >
                {/* Matches the number set beside each chapter heading. */}
                {s.number ? (
                  <span aria-hidden className={cn("tabular-nums", on ? "text-brand" : "text-text-muted")}>
                    {s.number}
                  </span>
                ) : null}
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
