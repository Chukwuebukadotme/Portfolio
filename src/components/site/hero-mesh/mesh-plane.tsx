"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { fragmentShader, vertexShader } from "./shaders";

type MeshPlaneProps = {
  /** 0 = light texture, 1 = dark. Crossfaded, not switched. */
  mixTarget: number;
  amplitude: number;
  reduced: boolean;
};

/**
 * The animated quad. Pointer position and hover strength live in refs updated
 * by window listeners rather than React state, so neither re-renders the tree —
 * they only move uniforms inside the frame loop.
 *
 * Every write goes through `matRef.current.uniforms`, never through the object
 * passed to the `uniforms` prop. THREE.ShaderMaterial *clones* the uniforms it
 * is constructed with, so the object handed to React and the object the GPU
 * samples are two different things. Mutating the former animates nothing: the
 * loop still runs and the frames still draw, but every value stays at whatever
 * it was when the material was built.
 */
export function MeshPlane({ mixTarget, amplitude, reduced }: MeshPlaneProps) {
  const [texLight, texDark] = useTexture([
    "/assets/grid-light-1600.webp",
    "/assets/grid-dark-1600.webp",
  ]);

  const { size, invalidate, gl } = useThree();

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, amt: 0, target: 0 });
  const clock = useRef(0);
  const mix = useRef(mixTarget);

  /**
   * Mipmaps matter more here than they did for the ribbon. This art is a
   * wireframe of roughly one-pixel lines at 1600px wide; minified onto a
   * smaller viewport without mip levels, those lines alias into a crawling
   * moire the moment anything moves. Anisotropy keeps them from smearing at
   * the shallow angles the cover-fit produces.
   */
  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    for (const t of [texLight, texDark]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = maxAniso;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
    }
    invalidate();
  }, [texLight, texDark, gl, invalidate]);

  /** Seed values only. The material clones these; the frame loop owns the rest. */
  const initialUniforms = useMemo(
    () => ({
      uTexA: { value: texLight },
      uTexB: { value: texDark },
      uMix: { value: mixTarget },
      uTime: { value: 0 },
      uAmp: { value: amplitude },
      uRipple: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTexRes: { value: new THREE.Vector2(1600, 1200) },
    }),
    // Rebuilding this would rebuild the material, so only a texture swap should.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texLight, texDark],
  );

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

  /**
   * Hover. The ripple is driven by the pointer's position over the hero, and
   * fades out when the pointer leaves it — so the effect belongs to the hero
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
        pointer.current.x = (e.clientX - r.left) / r.width;
        pointer.current.y = 1 - (e.clientY - r.top) / r.height;
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
  }, [reduced, invalidate]);

  useFrame((_, rawDelta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;

    const dt = Math.min(rawDelta, 0.05);

    if (!reduced) {
      clock.current += dt;

      const p = pointer.current;
      // Ease in faster than out, so the ripple answers the cursor promptly
      // but recedes rather than snapping off.
      const rate = p.target > p.amt ? 3.4 : 1.6;
      p.amt += (p.target - p.amt) * Math.min(dt * rate, 1);

      u.uTime.value = clock.current;
      u.uRipple.value = p.amt;
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
