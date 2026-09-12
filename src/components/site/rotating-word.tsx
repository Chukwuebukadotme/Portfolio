"use client";

import { useEffect, useState } from "react";

import { rotateIntervalMs, words } from "@/lib/content";

/**
 * Cycles the hero's object noun. The first word is server-rendered so the
 * headline reads correctly before hydration and for crawlers; rotation starts
 * only if motion is welcome.
 *
 * The word sits in the normal inline flow rather than in a box reserved for the
 * longest option — reserving left a visible gap mid-sentence, and the design it
 * came from reflowed too.
 */
export function RotatingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % words.length),
      rotateIntervalMs,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <span
        key={i}
        aria-hidden
        className="text-gradient-accent motion-safe:animate-[ribbon-word_var(--dur-slow)_var(--ease-glass)]"
      >
        {words[i]}
      </span>
      {/* One live region, so the headline is announced once rather than on
          every rotation. */}
      <span className="sr-only">{words[0]}</span>
    </>
  );
}
