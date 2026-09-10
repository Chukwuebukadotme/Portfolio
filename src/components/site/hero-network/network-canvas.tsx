"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { VIEW, network, nodeAt, palette } from "./network";

/** How many nodes the cursor may link to at once. */
const CURSOR_LINKS = 6;
/** Hero-space radius within which the cursor reaches for nodes. */
const REACH = 0.17;

const nodeVert = /* glsl */ `
uniform float uScale;
attribute float aSize;
attribute float aHub;
attribute float aBoost;
varying float vHub;
varying float vBoost;
void main() {
  vHub = aHub;
  vBoost = aBoost;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  /* Hubs carry a wide halo, so their sprite has to be much larger than the
     dot itself; plain nodes only need a little room for the antialiased rim. */
  float spread = mix(2.6, 9.0, aHub) + aBoost * 2.2;
  gl_PointSize = aSize * uScale * spread;
}
`;

const nodeFrag = /* glsl */ `
precision highp float;
uniform vec3 uNode;
uniform vec3 uHub;
uniform float uOpacity;
varying float vHub;
varying float vBoost;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;

  /* The sprite is mostly empty space around a small core, so the core radius
     is expressed as a fraction of the quad rather than in pixels. */
  float spread = mix(2.6, 9.0, vHub) + vBoost * 2.2;
  float core = 1.0 - smoothstep(0.0, 2.0 / spread, d);
  float halo = exp(-d * d * 7.0) * mix(0.0, 0.85, vHub);

  vec3 c = mix(uNode, uHub, max(vHub, vBoost * 0.85));
  float a = clamp(core * mix(0.80, 1.0, max(vHub, vBoost)) + halo, 0.0, 1.0);
  if (a < 0.004) discard;
  gl_FragColor = vec4(c, a * uOpacity);
}
`;

function Network({
  isDark,
  reduced,
  onFirstFrame,
}: {
  isDark: boolean;
  reduced: boolean;
  onFirstFrame: () => void;
}) {
  const { viewport, size, invalidate } = useThree();
  const { nodes, edges } = network;

  const pointsRef = useRef<THREE.Points>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const linkRef = useRef<THREE.LineSegments>(null);
  const nodeMatRef = useRef<THREE.ShaderMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const linkMatRef = useRef<THREE.LineBasicMaterial>(null);

  const clock = useRef(0);
  const announced = useRef(false);
  const pointer = useRef({ x: 0, y: 0, amt: 0, target: 0 });
  const mix = useRef(isDark ? 1 : 0);

  const COL = useMemo(
    () => ({
      node: [new THREE.Color(palette.light.node), new THREE.Color(palette.dark.node)],
      hub: [new THREE.Color(palette.light.hub), new THREE.Color(palette.dark.hub)],
      edge: [new THREE.Color(palette.light.edge), new THREE.Color(palette.dark.edge)],
    }),
    [],
  );

  /* Hero space (0..1, y down) into world units, matching how the SVG maps its
     viewBox — so the two renderings sit exactly on top of each other. */
  const { toWorld, pxPerViewUnit } = useMemo(() => {
    /* Cover, exactly as the SVG's preserveAspectRatio="slice" does — the two
       renderings have to land on the same pixels or the handover would jump. */
    const scale = Math.max(viewport.width / (VIEW.w / VIEW.h), viewport.height);
    const w = scale * (VIEW.w / VIEW.h);
    const h = scale;

    /* Device pixels per viewBox unit. Deriving this from height alone made the
       canvas dots ~20% smaller than the SVG's whenever width was the limiting
       dimension, which is the usual case on a wide hero. */
    const cssPerWorld = viewport.width > 0 ? size.width / viewport.width : 0;
    const px = ((w / VIEW.w) * cssPerWorld) * viewport.dpr;

    return {
      toWorld: (x: number, y: number) => ({
        x: (x - 0.5) * w,
        y: (0.5 - y) * h,
      }),
      pxPerViewUnit: px,
    };
  }, [viewport.width, viewport.height, viewport.dpr, size.width]);

  const geo = useMemo(() => {
    const n = nodes.length;
    const pos = new Float32Array(n * 3);
    const aSize = new Float32Array(n);
    const aHub = new Float32Array(n);
    const aBoost = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      aSize[i] = nodes[i].r;
      aHub[i] = nodes[i].hub ? 1 : 0;
    }
    return { pos, aSize, aHub, aBoost };
  }, [nodes]);

  const edgePos = useMemo(
    () => new Float32Array(edges.length * 6),
    [edges.length],
  );
  const linkPos = useMemo(() => new Float32Array(CURSOR_LINKS * 6), []);

  /* Hover stays available under reduced motion. The preference is about
     autonomous movement, and this only responds to something the person is
     already doing; the drift is what gets frozen, in the frame loop below. */
  useEffect(() => {
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
        pointer.current.y = (e.clientY - r.top) / r.height;
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
  }, [invalidate]);

  useFrame((_, rawDelta) => {
    const pts = pointsRef.current;
    const nodeMat = nodeMatRef.current;
    if (!pts || !nodeMat) return;

    const dt = Math.min(rawDelta, 0.05);
    if (!reduced) clock.current += dt;
    const t = clock.current;

    const p = pointer.current;
    const rate = p.target > p.amt ? 3.2 : 1.8;
    p.amt += (p.target - p.amt) * Math.min(dt * rate, 1);

    // Node positions, and how strongly the cursor is reaching each one.
    const live: { x: number; y: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodeAt(nodes[i], t);
      live.push(n);
      const w = toWorld(n.x, n.y);
      geo.pos[i * 3] = w.x;
      geo.pos[i * 3 + 1] = w.y;
      geo.pos[i * 3 + 2] = 0;

      const d = Math.hypot(n.x - p.x, n.y - p.y);
      const near = Math.max(0, 1 - d / REACH);
      geo.aBoost[i] = near * near * p.amt;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.attributes.aBoost.needsUpdate = true;

    // Edges follow their nodes.
    for (let i = 0; i < edges.length; i++) {
      const a = toWorld(live[edges[i].a].x, live[edges[i].a].y);
      const b = toWorld(live[edges[i].b].x, live[edges[i].b].y);
      edgePos[i * 6] = a.x;
      edgePos[i * 6 + 1] = a.y;
      edgePos[i * 6 + 2] = 0;
      edgePos[i * 6 + 3] = b.x;
      edgePos[i * 6 + 4] = b.y;
      edgePos[i * 6 + 5] = 0;
    }
    if (edgeRef.current)
      edgeRef.current.geometry.attributes.position.needsUpdate = true;

    /* The cursor joins the network: it links to the nodes nearest it, so the
       gesture reads as connecting rather than disturbing. */
    const cw = toWorld(p.x, p.y);
    const ranked = live
      .map((n, i) => ({ i, d: Math.hypot(n.x - p.x, n.y - p.y) }))
      .filter((n) => n.d < REACH * 1.5)
      .sort((a, b) => a.d - b.d)
      .slice(0, CURSOR_LINKS);

    for (let k = 0; k < CURSOR_LINKS; k++) {
      const r = ranked[k];
      // Unused slots collapse to a zero-length segment rather than drawing.
      const w = r ? toWorld(live[r.i].x, live[r.i].y) : cw;
      linkPos[k * 6] = cw.x;
      linkPos[k * 6 + 1] = cw.y;
      linkPos[k * 6 + 2] = 0;
      linkPos[k * 6 + 3] = w.x;
      linkPos[k * 6 + 4] = w.y;
      linkPos[k * 6 + 5] = 0;
    }
    if (linkRef.current)
      linkRef.current.geometry.attributes.position.needsUpdate = true;
    if (linkMatRef.current) linkMatRef.current.opacity = 0.62 * p.amt;

    // Theme crossfade — the palette lerps, the layout never changes.
    const target = isDark ? 1 : 0;
    if (mix.current !== target) {
      const step = dt / 0.7;
      mix.current += Math.sign(target - mix.current) * step;
      if (Math.abs(target - mix.current) < step) mix.current = target;
      invalidate();
    }
    const m = mix.current;
    nodeMat.uniforms.uNode.value.copy(COL.node[0]).lerp(COL.node[1], m);
    nodeMat.uniforms.uHub.value.copy(COL.hub[0]).lerp(COL.hub[1], m);
    nodeMat.uniforms.uScale.value = pxPerViewUnit;
    if (edgeMatRef.current)
      edgeMatRef.current.color.copy(COL.edge[0]).lerp(COL.edge[1], m);
    if (linkMatRef.current)
      linkMatRef.current.color.copy(COL.hub[0]).lerp(COL.hub[1], m);

    if (!announced.current) {
      announced.current = true;
      onFirstFrame();
    }
  });

  return (
    <>
      <lineSegments ref={edgeRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePos, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={edgeMatRef}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments ref={linkRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linkPos, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={linkMatRef}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geo.pos, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute attach="attributes-aSize" args={[geo.aSize, 1]} />
          <bufferAttribute attach="attributes-aHub" args={[geo.aHub, 1]} />
          <bufferAttribute
            attach="attributes-aBoost"
            args={[geo.aBoost, 1]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMatRef}
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          transparent
          depthWrite={false}
          uniforms={{
            uScale: { value: 1 },
            uOpacity: { value: 1 },
            uNode: { value: new THREE.Color(palette.light.node) },
            uHub: { value: new THREE.Color(palette.light.hub) },
          }}
        />
      </points>
    </>
  );
}

export function NetworkCanvas({
  isDark,
  reduced,
  visible,
  onFirstFrame,
  style,
}: {
  isDark: boolean;
  reduced: boolean;
  visible: boolean;
  onFirstFrame: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <Canvas
      // Transparent, so the arcs and the page's own ground show through and
      // there is no opaque rectangle that could ever flash over the hero.
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      frameloop={reduced || !visible ? "demand" : "always"}
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 3], near: 0.1, far: 20 }}
      style={style}
    >
      <Network
        isDark={isDark}
        reduced={reduced}
        onFirstFrame={onFirstFrame}
      />
    </Canvas>
  );
}
