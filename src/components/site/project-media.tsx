import Image from "next/image";

import { MediaPlaceholder } from "@/components/site/primitives";
import { ProjectVisualView } from "@/components/site/project-visuals";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * A project's artwork for a given slot, in order of preference: a real image,
 * a designed visual drawn from the project's data, or the pending frame.
 * The box always holds its ratio, so nothing shifts as images load.
 */
export function ProjectMedia({
  project,
  slot,
  ratio,
  sizes,
  eager = false,
  className,
}: {
  project: Project;
  slot: "card" | "primary";
  ratio: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const image = project.media?.[slot];

  if (!image && !project.visual) {
    return (
      <MediaPlaceholder
        label={`${project.name} preview`}
        ratio={ratio}
        className={className}
      />
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn("relative w-full overflow-hidden rounded-md bg-surface-sunken", className)}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover object-top"
        />
      ) : project.visual ? (
        <ProjectVisualView kind={project.visual} />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_0_0_1px_var(--border-hairline)]"
      />
    </div>
  );
}
