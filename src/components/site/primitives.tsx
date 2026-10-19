import type { ReactNode } from "react";
import {
  Archive,
  CircleCheck,
  CircleDashed,
  FlaskConical,
  Lightbulb,
  Shapes,
  type LucideIcon,
} from "lucide-react";

import { Icon } from "@/components/site/icon";
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

const statusStyle: Record<ProjectStatus, { tone: string; icon: LucideIcon }> = {
  Deployed: { tone: "bg-status-success-bg text-status-success", icon: CircleCheck },
  "In development": { tone: "bg-status-warning-bg text-status-warning", icon: CircleDashed },
  Research: { tone: "bg-status-info-bg text-status-info", icon: FlaskConical },
  Prototype: { tone: "bg-bg-subtle text-text-secondary", icon: Shapes },
  Concept: { tone: "bg-bg-subtle text-text-secondary", icon: Lightbulb },
  Archived: { tone: "bg-bg-subtle text-text-secondary", icon: Archive },
};

/**
 * C06 status badge. The word carries the meaning; the icon gives each status
 * a shape and the semantic colour reinforces both. Development status, never
 * an outcome.
 */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { tone, icon } = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-control px-2 py-1 text-[0.75rem] leading-normal font-medium",
        tone,
      )}
    >
      <Icon icon={icon} size={16} className="-ml-0.5" />
      {status}
    </span>
  );
}
