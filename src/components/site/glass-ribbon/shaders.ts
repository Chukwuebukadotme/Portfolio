/**
 * Hero shaders, carried over unchanged from the previous build's
 * <glass-ribbon> custom element.
 *
 * A plane samples two matched ribbon textures with slow UV flow, micro
 * refraction and a theme crossfade. The vertex stage writes clip space
 * directly, so the quad covers the viewport regardless of camera.
 */

export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform float uTime;
uniform float uAmp;
uniform float uBoost;
uniform float uPointerAmt;
uniform vec2  uPointer;
uniform vec2  uRes;
uniform vec2  uTexRes;

vec2 coverUV(vec2 uv) {
  float ca = uRes.x / max(uRes.y, 1.0);
  float ta = uTexRes.x / max(uTexRes.y, 1.0);
  vec2 s = ca > ta ? vec2(1.0, ta / ca) : vec2(ca / ta, 1.0);
  return (uv - 0.5) * s + 0.5;
}

/* three taps per texture: R and B nudged for micro-refraction */
vec3 glass(sampler2D tex, vec2 uv, vec2 ca) {
  vec3 c;
  c.r = texture2D(tex, uv + ca).r;
  c.g = texture2D(tex, uv).g;
  c.b = texture2D(tex, uv - ca).b;
  return c;
}

void main() {
  vec2 uv = coverUV(vUv);
  float t = uTime;

  /* low-frequency flow — one perceptual cycle ~12s */
  float w1 = sin(uv.x * 2.05 + t * 0.62) * 0.6 + sin(uv.y * 1.55 - t * 0.47) * 0.4;
  float w2 = sin((uv.x + uv.y) * 2.6 - t * 0.53) * 0.6 + cos(uv.y * 2.2 + t * 0.39) * 0.4;
  vec2 disp = vec2(w1, w2) * uAmp;

  /* secondary micro-refraction, sub-pixel scale */
  disp += vec2(
    sin(uv.y * 26.0 + t * 1.4) * 0.0011,
    cos(uv.x * 22.0 - t * 1.1) * 0.0009
  );

  /* localized pointer disturbance, a few pixels, eased by the host */
  vec2 pd = uv - uPointer;
  pd.x *= uRes.x / max(uRes.y, 1.0);
  float g = exp(-dot(pd, pd) * 14.0) * uPointerAmt;
  disp += normalize(pd + vec2(1e-5)) * g * 0.010;

  vec2 suv = clamp(uv + disp, 0.0, 1.0);
  vec2 ca = vec2(0.0016 + g * 0.004 + uBoost * 0.0008, 0.0);

  vec3 col;
  if (uMix <= 0.001) col = glass(uTexA, suv, ca);
  else if (uMix >= 0.999) col = glass(uTexB, suv, ca);
  else col = mix(glass(uTexA, suv, ca), glass(uTexB, suv, ca), uMix);

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Edge masks, so the plane meets the page rather than ending at a hard line. */
export const masks = {
  left: "linear-gradient(to right, transparent 0%, transparent 26%, rgba(0,0,0,.4) 56%, #000 86%)",
  bottom:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.35) 30%, #000 70%, rgba(0,0,0,.5) 100%), linear-gradient(to bottom, transparent 0%, #000 42%, transparent 100%)",
  both: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,.42) 60%, #000 90%), linear-gradient(to bottom, rgba(0,0,0,.55) 0%, #000 55%, rgba(0,0,0,.25) 100%)",
  none: undefined,
} as const;

export type MaskName = keyof typeof masks;
