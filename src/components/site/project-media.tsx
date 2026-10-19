import Image from "next/image";

import { ProjectVisualView, visualCaption } from "@/components/site/project-visuals";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * C08 media frame for a project slot: the real image when there is one,
 * otherwise the diagram drawn from the project's data. The box holds its ratio
 * so nothing shifts while images load, and the whole artefact stays visible
 * (contain, never crop) on the neutral bed. The caption sits outside the
 * media and says when the data shown is not real.
 *
 * The publication gate guarantees every published project has one or the
 * other, so an empty slot renders nothing rather than a placeholder.
 */
export function ProjectMedia({
  project,
  slot,
  ratio,
  sizes,
  eager = false,
  caption = true,
  className,
  mediaClassName,
}: {
  project: Project;
  slot: "card" | "primary";
  ratio: string;
  sizes: string;
  eager?: boolean;
  caption?: boolean;
  className?: string;
  mediaClassName?: string;
}) {
  const image = project.media?.[slot];
  if (!image && !project.visual) return null;

  const text = image ? image.caption : project.visual ? visualCaption[project.visual] : undefined;

  return (
    <figure className={cn("m-0", className)}>
      <div
        style={{ aspectRatio: ratio }}
        className="relative w-full overflow-hidden rounded-media border border-border bg-bg-subtle"
      >
        <div className={cn("absolute inset-0", mediaClassName)}>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              placeholder="blur"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : undefined}
              className="object-contain"
            />
          ) : project.visual ? (
            <ProjectVisualView kind={project.visual} />
          ) : null}
        </div>
      </div>
      {caption && text ? (
        <figcaption className="mt-3 cl-type-caption text-text-secondary">{text}</figcaption>
      ) : null}
    </figure>
  );
}
