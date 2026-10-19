import type { ReactNode } from "react";

import type { ProjectStatus } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** The 1200px content container with the responsive 20/32/48px gutter. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("cl-container", className)}>{children}</div>;
}

/** A chapter of the page, spaced by the 64/80/120px section token. */
export function Section({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("cl-section", className)}>
      {children}
    </section>
  );
}

/** Short uppercase label above a heading. The only place uppercase is used. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("cl-type-eyebrow uppercase text-brand", className)}>
      {children}
    </p>
  );
}

/** C06 capability tag: neutral fill, no pointer or hover, since it is not a control. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-control bg-bg-subtle px-2 py-1 text-[0.75rem] leading-normal text-text-secondary">
      {children}
    </span>
  );
}

const statusTone: Record<ProjectStatus, string> = {
  Deployed: "bg-status-success-bg text-status-success",
  "In development": "bg-status-warning-bg text-status-warning",
  Research: "bg-status-info-bg text-status-info",
  Prototype: "bg-bg-subtle text-text-secondary",
  Concept: "bg-bg-subtle text-text-secondary",
  Archived: "bg-bg-subtle text-text-secondary",
};

/**
 * C06 status badge. The word carries the meaning; the semantic colour only
 * reinforces it. Development status, never an outcome.
 */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-control px-2 py-1 text-[0.75rem] leading-normal font-medium",
        statusTone[status],
      )}
    >
      {status}
    </span>
  );
}
