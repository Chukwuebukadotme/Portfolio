/**
 * Hero shaders.
 *
 * A plane samples two matched grid-mesh textures — one per theme — and
 * disturbs them in two ways: a very slow ambient drift so the mesh is never
 * dead still, and a ripple that leaves the pointer and decays with distance.
 *
 * The previous ribbon shader split the R and B channels for micro-refraction.
 * That suited a smooth glass form; on a wireframe of roughly one-pixel lines it
 * reads as coloured fringing rather than refraction, so the channel split is
 * gone and each texture is a single tap.
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
uniform sampler2D uTexA;   // light theme
uniform sampler2D uTexB;   // dark theme
uniform float uMix;        // 0 = light, 1 = dark
uniform float uTime;
uniform float uAmp;        // ambient drift amplitude
uniform float uRipple;     // hover strength, eased 0..1 by the host
uniform vec2  uPointer;
uniform vec2  uRes;
uniform vec2  uTexRes;

/* Cover-fit: the art is 4:3 and the hero is a wide band, so the texture is
   scaled to fill and the overflow is trimmed symmetrically. */
vec2 coverUV(vec2 uv) {
  float ca = uRes.x / max(uRes.y, 1.0);
  float ta = uTexRes.x / max(uTexRes.y, 1.0);
  vec2 s = ca > ta ? vec2(1.0, ta / ca) : vec2(ca / ta, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = coverUV(vUv);
  float t = uTime;

  /* Ambient breathing. Deliberately tiny — thin grid lines shimmer long
     before a smooth gradient would, so this is felt more than seen. */
  vec2 drift = vec2(
    sin(uv.y * 2.4 + t * 0.28),
    cos(uv.x * 2.1 - t * 0.23)
  ) * uAmp;

  /* Ripple. Aspect-corrected so the rings stay circular on a wide viewport,
     travelling outward from the pointer and decaying with distance. */
  vec2 pd = uv - uPointer;
  pd.x *= uRes.x / max(uRes.y, 1.0);
  float d = length(pd);
  float wave = sin(d * 26.0 - t * 3.2);
  float decay = exp(-d * 4.5);
  vec2 dir = pd / max(d, 1e-4);
  vec2 ripple = dir * wave * decay * uRipple * 0.012;

  vec2 suv = clamp(uv + drift + ripple, 0.0, 1.0);

  /* One tap in the common case; both only while the theme is crossfading. */
  vec3 col;
  if (uMix <= 0.001) col = texture2D(uTexA, suv).rgb;
  else if (uMix >= 0.999) col = texture2D(uTexB, suv).rgb;
  else col = mix(texture2D(uTexA, suv).rgb, texture2D(uTexB, suv).rgb, uMix);

  /* A faint lift on the wave crests, so the disturbance reads as light
     catching the mesh rather than geometry sliding around. */
  col += abs(wave) * decay * uRipple * 0.05 * vec3(0.35, 0.8, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;
