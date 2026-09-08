"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { masks, type MaskName } from "./shaders";
import { RibbonPlane } from "./ribbon-plane";

type GlassRibbonProps = {
  className?: string;
  mask?: MaskName;
  amplitude?: number;
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
 * The hero visual. Both static textures render first and always, with CSS
 * choosing between them — not JavaScript. `resolvedTheme` is undefined during
 * SSR and the first client render, so picking the source in JS showed the light
 * ribbon on a dark page until hydration caught up. The `dark:` variant keys off
 * the data-theme attribute that the blocking script in <head> sets before first
 * paint, so the right one is showing from the very first frame.
 *
 * The canvas fades in over them once there is a context and the textures
 * decode. If WebGL is unavailable, the context is lost, or a texture fails, the
 * image simply stays — the hero degrades rather than disappearing.
 */
export function GlassRibbon({
  className,
  mask = "both",
  amplitude = 0.006,
  opacity = 1,
}: GlassRibbonProps) {
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

  const maskImage = masks[mask];

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("pointer-events-none relative overflow-hidden", className)}
      style={
        maskImage
          ? {
              maskImage,
              WebkitMaskImage: maskImage,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }
          : undefined
      }
    >
      <Image
        src="/assets/ribbon-light-1440.webp"
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
        src="/assets/ribbon-dark-1440.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover opacity-0 transition-opacity duration-[var(--dur-scene)] ease-[var(--ease-glass)] dark:opacity-100",
          ready && "dark:opacity-0",
        )}
      />

      {/* Mounting is deferred until the theme is known, so the plane is built
          with the correct starting mix rather than crossfading out of the
          wrong texture on load. */}
      {gl && mounted ? (
        <Canvas
          // Motion is demand-driven: the plane invalidates when it needs a
          // frame, so a still hero in a background tab renders nothing.
          frameloop={reduced || !visible ? "demand" : "always"}
          gl={{ alpha: false, antialias: false, powerPreference: "low-power" }}
          dpr={[1, 2]}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? opacity : 0,
            transition: "opacity var(--dur-scene) var(--ease-glass)",
          }}
          onCreated={({ gl: renderer }) => {
            renderer.domElement.addEventListener("webglcontextlost", () =>
              setReady(false),
            );
            setReady(true);
          }}
        >
          <Suspense fallback={null}>
            <RibbonPlane
              mixTarget={isDark ? 1 : 0}
              amplitude={amplitude}
              reduced={reduced}
            />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
