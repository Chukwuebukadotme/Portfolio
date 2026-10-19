"use client";

import { useEffect, useState, type ReactNode } from "react";

import { disciplines, type ProjectCategory } from "@/lib/disciplines";
import { cn } from "@/lib/utils";

type FilterId = ProjectCategory | "all";

const filters: readonly { id: FilterId; label: string }[] = [
  { id: "all", label: "All projects" },
  ...disciplines,
];

type Item = { slug: string; categories: readonly ProjectCategory[]; card: ReactNode };

const isFilter = (v: string | null): v is FilterId => filters.some((f) => f.id === v);

/**
 * C05. Discipline filters over server-rendered project rows. Each filter is a
 * toggle button (aria-pressed), focus stays on it after activation, the result
 * count is announced once through a polite live region, and the choice is
 * mirrored into ?filter= so a view can be shared and restored. Counts come
 * from the published records. Without scripts every project is listed.
 */
export function WorkIndex({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("filter");
    if (isFilter(v)) setFilter(v);
  }, []);

  const count = (id: FilterId) =>
    id === "all" ? items.length : items.filter((i) => i.categories.includes(id)).length;

  function choose(id: FilterId) {
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", id);
    window.history.replaceState(window.history.state, "", url);

    const n = count(id);
    const label = filters.find((f) => f.id === id)!.label;
    setAnnounce(
      id === "all"
        ? `Showing all ${n} projects`
        : `Showing ${n} ${n === 1 ? "project" : "projects"} in ${label}`,
    );
  }

  const visible = items.filter((i) => filter === "all" || i.categories.includes(filter));

  return (
    <>
      <div role="group" aria-label="Filter projects by discipline" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(f.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 py-2 cl-type-ui transition-colors duration-(--cl-motion-duration-micro) ease-standard",
                on
                  ? "border-brand bg-brand text-brand-on"
                  : "border-border-control bg-bg-surface text-text-primary hover:bg-bg-subtle",
              )}
            >
              {f.label}
              <span className={cn("tabular-nums", on ? "text-brand-on" : "text-text-secondary")}>
                {count(f.id)}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      {visible.length ? (
        <ul className="mt-12 flex flex-col gap-(--cl-project-gap) md:mt-16">
          {visible.map((item) => (
            <li key={item.slug}>{item.card}</li>
          ))}
        </ul>
      ) : (
        // C18: an empty result names the problem and offers the way back.
        <div className="mt-12 rounded-card border border-border bg-bg-surface p-8">
          <p className="cl-type-subheading text-text-primary">
            No published projects in this discipline yet.
          </p>
          <button
            type="button"
            onClick={() => choose("all")}
            className="mt-4 inline-flex min-h-11 items-center cl-type-ui text-brand underline underline-offset-4 hover:text-brand-hover"
          >
            Show all projects
          </button>
        </div>
      )}
    </>
  );
}
