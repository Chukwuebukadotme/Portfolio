/**
 * Hero shaders.
 *
 * The grid is geometry, not a picture. A finely subdivided plane is displaced
 * along Z, and the lines are drawn onto that moving surface in the fragment
 * stage. Because the lines live on a surface that actually deforms, displacing
 * it moves them through perspective — which is what makes this read as a mesh
 * bending rather than a photograph being warped.
 *
 * The previous version sampled a flat image and offset its UVs. That can only
 * warp the whole sheet, because to a texture lookup there are no lines, only
 * pixels — which is why it read as rippling paper.
 *
 * The composition is built around a centreline that snakes across the width.
 * Everything else is expressed relative to it: the surface rises into a ridge
 * along it, the flow lines are contours parallel to it, and the glow is a tight
 * band on it. That is what gives the artwork its shape, so it is what the
 * geometry models.
 */

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uRipple;
uniform vec2  uPointer;   // plane space, same units as position.xy
uniform float uSpread;

varying vec2  vUv;
varying float vDy;        // signed distance from the centreline
varying float vRing;

/* The spine of the composition, travelling slowly so it never reads as a loop. */
float centreline(float x, float t) {
  /* Frequency is chosen so roughly one and a half periods cross the plane —
     that is what makes the band read as an S sweeping the full width rather
     than a single arc leaving the top corner. */
  return sin(x * 1.70 + t * 0.11) * 0.44
       + sin(x * 0.78 - t * 0.07) * 0.16;
}

void main() {
  vUv = uv;

  vec3 pos = position;
  vec2 p = position.xy;

  float dy = p.y - centreline(p.x, uTime);
  vDy = dy;

  /* A ridge along the centreline: the sheet lifts toward the camera where the
     wave runs, and lies flat away from it. */
  float e = exp(-pow(dy * uSpread, 2.0)) * uAmp;

  /* Rings from the pointer. These displace real vertices, so the grid
     genuinely bends around the cursor. */
  vec2 d = p - uPointer;
  float r = length(d);
  float ring = sin(r * 7.5 - uTime * 2.6) * exp(-r * 2.7);
  float rip = ring * uRipple;
  e += rip * 0.13;

  pos.z += e;
  vRing = abs(rip);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3  uBg;
uniform vec3  uLine;
uniform vec3  uGlow;
uniform float uDensityX;
uniform float uDensityY;
uniform float uSpread;
uniform float uBloom;

varying vec2  vUv;
varying float vDy;
varying float vRing;

/* One anti-aliased line per cell. fwidth keeps the stroke a constant width on
   screen however much the surface is foreshortened, which is what stops the
   mesh aliasing into moire where it turns away from the camera. */
float line(float c) {
  float g = fract(c);
  float d = min(g, 1.0 - g);
  return 1.0 - smoothstep(0.0, fwidth(c) * 1.2, d);
}

void main() {
  /* Flow lines are contours of the distance from the centreline, so they run
     parallel to the wave and fan with it rather than ruling a flat grid. */
  float lh = line(vDy * uDensityY);
  float lv = line(vUv.x * uDensityX);

  /* Density falls away from the band, the way the artwork thins toward the
     corners, and the frame edges fade so the mesh sits in the page. */
  float near = exp(-pow(vDy * uSpread * 0.80, 2.0));
  vec2 q = abs(vUv - 0.5) * 2.0;
  float vign = smoothstep(1.06, 0.10, max(q.x * 0.80, q.y * 0.92));
  float field = near * vign;

  /* A tight glow living on the centreline itself, so the crest reads as one
     continuous stroke of light rather than merely brighter grid. */
  float spine = exp(-pow(vDy * 7.0, 2.0));

  vec3 col = uBg;
  col = mix(col, uLine, lv * vign * (0.10 + near * 0.42));
  col = mix(col, uLine, lh * field * 0.92);

  col = mix(col, uGlow, clamp(spine * vign * 0.45, 0.0, 1.0));
  col = mix(col, uGlow, clamp(spine * lh * vign * 0.70, 0.0, 1.0));
  col += uGlow * spine * vign * 0.22 * uBloom;

  /* The disturbance is felt mostly as the lines bending; the light it adds is
     a hint, not a headline. */
  col = mix(col, uGlow, clamp(vRing * 0.30 * vign, 0.0, 1.0));
  col += uGlow * vRing * 0.28 * vign * uBloom;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Sampled from the supplied artwork so the rebuild matches its ground. */
export const palette = {
  light: { bg: "#F1F3F2", line: "#8FBBD0", glow: "#22C2E6" },
  dark: { bg: "#071427", line: "#1D6486", glow: "#31E4FF" },
} as const;
