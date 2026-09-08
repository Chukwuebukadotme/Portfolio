"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { fragmentShader, vertexShader } from "./shaders";

type RibbonPlaneProps = {
  /** 0 = light texture, 1 = dark. Crossfaded, not switched. */
  mixTarget: number;
  amplitude: number;
  reduced: boolean;
};

/**
 * The animated quad. Pointer position and scroll boost are read from refs
 * updated by window listeners rather than React state, so neither re-renders
 * the tree — they only move uniforms inside the frame loop.
 *
 * Every write goes through `matRef.current.uniforms`, never through the object
 * passed to the `uniforms` prop. THREE.ShaderMaterial *clones* the uniforms it
 * is constructed with, so the object handed to React and the object the GPU
 * samples are two different things. Mutating the former animates nothing: the
 * loop still runs and the frames still draw, but every value stays at whatever
 * it was when the material was built — no drift, no refraction, no crossfade.
 */
export function RibbonPlane({
  mixTarget,
  amplitude,
  reduced,
}: RibbonPlaneProps) {
  const [texLight, texDark] = useTexture([
    "/assets/ribbon-light-1440.webp",
    "/assets/ribbon-dark-1440.webp",
  ]);

  const { size, invalidate } = useThree();

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, amt: 0, target: 0 });
  const boost = useRef(0);
  const clock = useRef(0);
  const mix = useRef(mixTarget);

  useEffect(() => {
    for (const t of [texLight, texDark]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
    }
  }, [texLight, texDark]);

  /** Seed values only. The material clones these; the frame loop owns the rest. */
  const initialUniforms = useMemo(
    () => ({
      uTexA: { value: texLight },
      uTexB: { value: texDark },
      uMix: { value: mixTarget },
      uTime: { value: 0 },
      uAmp: { value: amplitude },
      uBoost: { value: 0 },
      uPointerAmt: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTexRes: { value: new THREE.Vector2(1440, 810) },
    }),
    // Rebuilding this would rebuild the material, so only a texture swap should.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texLight, texDark],
  );

  // Texture aspect drives the cover fit; the images rarely match the viewport.
  useEffect(() => {
    const img = texLight.image as { width?: number; height?: number } | undefined;
    const u = matRef.current?.uniforms;
    if (u && img?.width && img?.height) {
      u.uTexRes.value.set(img.width, img.height);
      invalidate();
    }
  }, [texLight, invalidate]);

  useEffect(() => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uRes.value.set(size.width, size.height);
    invalidate();
  }, [size, invalidate]);

  useEffect(() => {
    const u = matRef.current?.uniforms;
    if (u) u.uAmp.value = amplitude;
  }, [amplitude]);

  // Pointer disturbance and scroll boost. Passive listeners, refs only.
  useEffect(() => {
    if (reduced) return;

    function onPointer(e: PointerEvent) {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
      pointer.current.target = 1;
      invalidate();
    }
    function onLeave() {
      pointer.current.target = 0;
    }
    function onScroll() {
      boost.current = Math.min(boost.current + 0.28, 1);
      invalidate();
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, invalidate]);

  useFrame((_, rawDelta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;

    const dt = Math.min(rawDelta, 0.05);

    if (!reduced) {
      clock.current += dt * (1 + boost.current * 1.6);
      boost.current += (0 - boost.current) * Math.min(dt * 1.1, 1);

      const p = pointer.current;
      p.amt += (p.target - p.amt) * Math.min(dt * 2.6, 1);

      u.uTime.value = clock.current;
      u.uBoost.value = boost.current;
      u.uPointerAmt.value = p.amt;
      u.uPointer.value.set(p.x, p.y);
    }

    // Theme crossfade — 0.7s, linear, so it reads as a dissolve not a snap.
    if (mix.current !== mixTarget) {
      const step = dt / 0.7;
      mix.current += Math.sign(mixTarget - mix.current) * step;
      if (Math.abs(mixTarget - mix.current) < step) mix.current = mixTarget;
      invalidate();
    }
    u.uMix.value = mix.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
