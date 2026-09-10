"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { fragmentShader, palette, vertexShader } from "./shaders";

type GridSurfaceProps = {
  /** 0 = light palette, 1 = dark. Crossfaded, not switched. */
  mixTarget: number;
  reduced: boolean;
  onFirstFrame?: () => void;
};

const LIGHT = {
  bg: new THREE.Color(palette.light.bg),
  line: new THREE.Color(palette.light.line),
  glow: new THREE.Color(palette.light.glow),
};
const DARK = {
  bg: new THREE.Color(palette.dark.bg),
  line: new THREE.Color(palette.dark.line),
  glow: new THREE.Color(palette.dark.glow),
};

/**
 * The mesh. Subdivision is what buys smooth deformation — the grid is drawn
 * from UVs, but the *bending* comes from moving vertices, so too few segments
 * and the curves turn into visible facets.
 *
 * Every write goes through `matRef.current.uniforms`, never through the object
 * passed to the `uniforms` prop. THREE.ShaderMaterial *clones* the uniforms it
 * is constructed with, so the object handed to React and the object the GPU
 * samples are two different things.
 */
export function GridSurface({
  mixTarget,
  reduced,
  onFirstFrame,
}: GridSurfaceProps) {
  const { viewport, invalidate } = useThree();

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0, amt: 0, target: 0 });
  const clock = useRef(0);
  const mix = useRef(mixTarget);
  const announced = useRef(false);

  // Oversized so displacement never pulls an edge into view.
  const w = viewport.width * 1.35;
  const h = viewport.height * 1.35;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.42 },
      uRipple: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uBg: { value: LIGHT.bg.clone() },
      uLine: { value: LIGHT.line.clone() },
      uGlow: { value: LIGHT.glow.clone() },
      uDensityX: { value: 26 },
      uDensityY: { value: 17 },
      uSpread: { value: 1.05 },
      uBloom: { value: 0 },
    }),
    [],
  );

  /**
   * Hover. The pointer is mapped into the plane's own coordinates so the rings
   * originate exactly under the cursor, and the effect belongs to the hero
   * rather than following the cursor down the page.
   */
  useEffect(() => {
    if (reduced) return;

    function onPointer(e: PointerEvent) {
      const hero = document.querySelector("[data-hero]");
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      pointer.current.target = inside ? 1 : 0;
      if (inside) {
        pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * w;
        pointer.current.y = (0.5 - (e.clientY - r.top) / r.height) * h;
      }
      invalidate();
    }
    function onLeave() {
      pointer.current.target = 0;
      invalidate();
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, invalidate, w, h]);

  useFrame((_, rawDelta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;

    const dt = Math.min(rawDelta, 0.05);

    if (!reduced) {
      clock.current += dt;

      const p = pointer.current;
      // Ease in faster than out: prompt to answer the cursor, unhurried
      // letting go.
      const rate = p.target > p.amt ? 3.4 : 1.6;
      p.amt += (p.target - p.amt) * Math.min(dt * rate, 1);

      u.uTime.value = clock.current;
      u.uRipple.value = p.amt;
      u.uPointer.value.set(p.x, p.y);
    }

    // Theme crossfade — the palette lerps rather than the geometry changing.
    if (mix.current !== mixTarget) {
      const step = dt / 0.7;
      mix.current += Math.sign(mixTarget - mix.current) * step;
      if (Math.abs(mixTarget - mix.current) < step) mix.current = mixTarget;
      invalidate();
    }
    const m = mix.current;
    u.uBg.value.copy(LIGHT.bg).lerp(DARK.bg, m);
    u.uLine.value.copy(LIGHT.line).lerp(DARK.line, m);
    u.uGlow.value.copy(LIGHT.glow).lerp(DARK.glow, m);
    // Additive bloom belongs to the dark palette; on a pale ground it only
    // washes the hue out to white.
    u.uBloom.value = 0.12 + m * 0.88;

    if (!announced.current) {
      announced.current = true;
      onFirstFrame?.();
    }
  });

  return (
    <mesh frustumCulled={false} rotation={[0.06, 0, 0]}>
      <planeGeometry args={[w, h, 300, 220]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
