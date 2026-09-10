"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { NetworkCanvas } from "./network-canvas";

/** WebGL support is checked once; a failure leaves the SVG in place. */
function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") ??
        c.getContext("webgl") ??
        c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * The hero visual: a network of nodes and the links between them, drawn twice.
 *
 * There is no image anywhere in this component. The SVG underneath ships inside
 * the HTML and paints immediately; the canvas draws the same layout live and
 * fades in over it once it has rendered a frame, at which point the SVG's live
 * group fades out. The background arcs stay in the SVG throughout, showing
 * through the transparent canvas.
 *
 * Because both renderers read the same deterministic layout and the SVG is
 * drawn at t = 0, the handover has nothing to jump between — and if WebGL is
 * missing, the context is lost, or JavaScript never runs, the SVG simply stays.
 */
export function HeroNetwork({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const uid = useId().replace(/:/g, "");

  const [gl, setGl] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGl(hasWebGL());
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("pointer-events-none relative overflow-hidden", className)}
    >
      {/* The hero's ground. With a transparent canvas this is the only thing
          painting a background, and it is plain CSS — so it is there on the
          very first frame, before any script runs. */}
      <div
        data-net-scope
        className="absolute inset-0 bg-[radial-gradient(120%_100%_at_78%_38%,var(--net-bg-b)_0%,var(--net-bg-a)_62%)]"
      />

      {/* The static rendering. Its live group hides once the canvas is drawing;
          the arcs behind it stay, since the canvas is transparent. */}
      <div
        className={cn(
          "absolute inset-0 [&_[data-net-live]]:transition-opacity",
          "[&_[data-net-live]]:duration-[var(--dur-scene)]",
          "[&_[data-net-live]]:ease-[var(--ease-glass)]",
          ready && "[&_[data-net-live]]:opacity-0",
        )}
      >
        <NetworkSvgSlot id={uid} />
      </div>

      {gl && mounted ? (
        <NetworkCanvas
          isDark={isDark}
          reduced={reduced}
          visible={visible}
          onFirstFrame={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity var(--dur-scene) var(--ease-glass)",
          }}
        />
      ) : null}
    </div>
  );
}

/* Imported lazily at module scope rather than inline so the server component
   boundary stays obvious: the SVG has no client behaviour of its own. */
import { NetworkSvg } from "./network-svg";
function NetworkSvgSlot({ id }: { id: string }) {
  return <NetworkSvg id={id} />;
}
