"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { GridSurface } from "./grid-surface";
import { palette } from "./shaders";

type HeroMeshProps = {
  className?: string;
  opacity?: number;
};

/** WebGL support is checked once; a failure means the static image stands in. */
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
 * The hero visual. The supplied artwork renders first and always as a still
 * image, with CSS choosing between the two — not JavaScript. `resolvedTheme` is
 * undefined during SSR and the first client render, so selecting the source in
 * JS showed the light art on a dark page until hydration caught up. The `dark:`
 * variant keys off the data-theme attribute that the blocking script in <head>
 * sets before first paint, so the right one shows from the very first frame.
 *
 * The live mesh fades in over it once it has actually drawn a frame.
 *
 * That last part is load-bearing. `ready` used to be set in `onCreated`, which
 * fires as soon as the *renderer* exists — before anything had been drawn. With
 * an opaque clear colour that meant a black canvas at full opacity sitting over
 * the artwork, which on a light page read as a dark flash midway through load.
 * `ready` now waits for the first rendered frame, and the clear colour matches
 * the theme's own ground, so even a dropped frame cannot show as black.
 */
export function HeroMesh({ className, opacity = 1 }: HeroMeshProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

  // Off-screen heroes cost nothing: the loop only runs in view.
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
      <Image
        src="/assets/grid-light-1600.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover transition-opacity duration-[var(--dur-scene)] ease-[var(--ease-glass)] dark:opacity-0",
          ready && "opacity-0",
        )}
      />
      <Image
        src="/assets/grid-dark-1600.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover opacity-0 transition-opacity duration-[var(--dur-scene)] ease-[var(--ease-glass)] dark:opacity-100",
          ready && "dark:opacity-0",
        )}
      />

      {/* Mounting is deferred until the theme is known, so the surface starts
          on the correct palette rather than crossfading out of the wrong one. */}
      {gl && mounted ? (
        <Canvas
          // Motion is demand-driven: the surface invalidates when it needs a
          // frame, so a still hero in a background tab renders nothing.
          frameloop={reduced || !visible ? "demand" : "always"}
          gl={{ alpha: false, antialias: true, powerPreference: "low-power" }}
          dpr={[1, 2]}
          camera={{ fov: 42, position: [0, 0, 3.2], near: 0.1, far: 20 }}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? opacity : 0,
            transition: "opacity var(--dur-scene) var(--ease-glass)",
          }}
          onCreated={({ gl: renderer }) => {
            // Clear to the theme's own ground, so no frame can ever show black.
            renderer.setClearColor(
              isDark ? palette.dark.bg : palette.light.bg,
              1,
            );
            renderer.domElement.addEventListener("webglcontextlost", () =>
              setReady(false),
            );
          }}
        >
          <GridSurface
            mixTarget={isDark ? 1 : 0}
            reduced={reduced}
            onFirstFrame={() => setReady(true)}
          />
        </Canvas>
      ) : null}
    </div>
  );
}
