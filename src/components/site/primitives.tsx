import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Page gutter plus the 1312px content measure from the source frames. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative px-[var(--page-margin)]", className)}>
      <div className="mx-auto w-full max-w-[var(--container-content)]">
        {children}
      </div>
    </div>
  );
}

export function Section({
  children,
  className,
  grid = false,
}: {
  children: ReactNode;
  className?: string;
  /** Lays the measurement texture behind the section at low opacity. */
  grid?: boolean;
}) {
  return (
    <section className={cn("relative py-[var(--block-gap)]", className)}>
      {grid ? (
        <span
          aria-hidden
          className="ds-grid-overlay pointer-events-none absolute inset-0"
        />
      ) : null}
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("ds-eyebrow", className)}>{children}</p>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm px-2 py-1 font-mono text-tiny tracking-[var(--track-meta)] text-text-secondary shadow-[inset_0_0_0_1px_var(--border-hairline)]">
      {children}
    </span>
  );
}

/**
 * Stands in for artwork that has not been supplied yet. Deliberately reads as
 * a frame rather than a broken image, and carries its own label so an empty
 * slot is never mistaken for a rendering fault.
 */
export function MediaPlaceholder({
  label,
  ratio = "16 / 10",
  className,
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label}, artwork pending`}
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-surface-sunken shadow-[inset_0_0_0_1px_var(--border-hairline)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="ds-grid-overlay pointer-events-none absolute inset-0"
      />
      <span className="absolute bottom-3 left-3 font-mono text-tiny tracking-[var(--track-meta)] text-text-tertiary">
        {label}
      </span>
    </div>
  );
}
