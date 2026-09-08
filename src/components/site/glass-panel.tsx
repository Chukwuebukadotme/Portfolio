"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Flat panels drop the caustic and specular layers — used for the header. */
  flat?: boolean;
  /** Specular follows the pointer. Off for large or static surfaces. */
  interactive?: boolean;
  as?: "div" | "section" | "article" | "aside";
};

/**
 * The signature surface: a body that blurs and saturates what is behind it, a
 * bright lensed top rim where light enters, a cyan refraction along the bottom
 * edge where it exits, and one specular sweep. Every ratio comes from
 * tokens/material.css — this component adds none of its own.
 */
export function GlassPanel({
  children,
  className,
  style,
  flat = false,
  interactive = true,
  as: Tag = "div",
}: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: React.PointerEvent) {
    if (!interactive || flat) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Shift the sweep a fraction of the way toward the pointer. The layer is
    // inset -20%, so small percentages read as a large travel.
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
    el.style.setProperty("--spec-x", `${x}%`);
    el.style.setProperty("--spec-y", `${y}%`);
  }

  return (
    <Tag
      ref={ref as never}
      onPointerMove={onPointerMove}
      className={cn(
        "relative isolate overflow-hidden rounded-lg",
        "bg-[var(--glass-body)] shadow-[var(--glass-inner),var(--glass-shadow)]",
        "backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] backdrop-brightness-[var(--glass-brightness)]",
        "transition-shadow duration-[var(--dur-slow)] ease-[var(--ease-glass)]",
        className,
      )}
      style={
        {
          ...(flat
            ? ({
                "--glass-caustic": "none",
                "--glass-specular": "none",
              } as CSSProperties)
            : null),
          ...style,
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[image:var(--glass-caustic)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[20%] z-0 bg-[image:var(--glass-specular)] opacity-90 mix-blend-screen transition-transform duration-[var(--dur-slow)] ease-[var(--ease-glass)]"
        style={{
          transform:
            "translate3d(var(--spec-x, 0%), var(--spec-y, 0%), 0)",
        }}
      />
      {/* Side rims — light entering the vertical edges. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] rounded-lg shadow-[inset_1px_0_0_0_var(--glass-rim-side),inset_-1px_0_0_0_var(--glass-rim-side)]"
      />
      <span className="relative z-[1] block">{children}</span>
    </Tag>
  );
}
