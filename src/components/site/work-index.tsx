"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Reveal } from "@/components/site/reveal";
import { projectFilters, type ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

type FilterId = ProjectCategory | "all";

type Item = { slug: string; categories: readonly ProjectCategory[]; card: ReactNode };

const isFilter = (v: string | null): v is FilterId =>
  projectFilters.some((f) => f.id === v);

/**
 * Filters server-rendered project cards in place. The choice is mirrored into
 * ?filter= so a filtered view can be linked or restored, without a navigation.
 */
export function WorkIndex({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("filter");
    if (isFilter(v)) setFilter(v);
  }, []);

  function choose(id: FilterId) {
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", id);
    window.history.replaceState(null, "", url);
  }

  const count = (id: FilterId) =>
    id === "all" ? items.length : items.filter((i) => i.categories.includes(id)).length;

  const visible = items.filter((i) => filter === "all" || i.categories.includes(filter));
  const active = projectFilters.find((f) => f.id === filter)!;

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects by discipline"
        className="flex flex-wrap gap-2"
      >
        {projectFilters.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(f.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-pill px-4 text-small transition-colors duration-[var(--dur-fast)] ease-[var(--ease-glass)]",
                on
                  ? "bg-text-primary text-text-inverse"
                  : "text-text-secondary shadow-[inset_0_0_0_1px_var(--border-hairline)] hover:bg-state-hover hover:text-text-primary",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "font-mono text-tiny tabular-nums",
                  on ? "opacity-70" : "text-text-tertiary",
                )}
              >
                {String(count(f.id)).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {filter === "all"
          ? `Showing all ${visible.length} projects`
          : `Showing ${visible.length} ${active.label} projects`}
      </p>

      <ul className="project-list mt-16 flex flex-col gap-20 md:gap-28">
        {visible.map((item, i) => (
          // Keyed by filter so a change re-runs the reveal rather than
          // snapping cards into new positions.
          <Reveal key={`${filter}-${item.slug}`} index={i} as="li">
            {item.card}
          </Reveal>
        ))}
      </ul>
    </>
  );
}
