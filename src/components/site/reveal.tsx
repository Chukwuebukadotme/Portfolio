"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The tags this wrapper is used as. Kept explicit so the ref type stays sound. */
type RevealTag = "div" | "section" | "article" | "li" | "aside" | "header";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger position; 60ms per step, matching the previous build. */
  index?: number;
  as?: RevealTag;
};

/**
 * Settles content into place as it enters the viewport. Under reduced motion
 * the CSS never displaces the element, so this only adds a class that has no
 * visual effect.
 */
export function Reveal({
  children,
  className,
  index = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.unobserve(el);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      style={{ "--reveal-delay": `${(index % 6) * 60}ms` } as React.CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
