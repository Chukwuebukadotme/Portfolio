/**
 * The network's layout.
 *
 * Generated once, deterministically, and shared by both renderers: the SVG that
 * ships inside the HTML and the WebGL canvas that takes over from it. They must
 * agree exactly or the handover would visibly jump, so nothing here may depend
 * on Math.random or on anything that differs between server and client.
 */

/** The SVG viewBox everything is authored in. Node radii are in these units. */
export const VIEW = { w: 1000, h: 640 } as const;

export type NetNode = {
  /** Position in 0..1 across the hero box; may sit slightly outside to bleed. */
  x: number;
  y: number;
  /** Radius in VIEW units. */
  r: number;
  /** Hubs are the bright cyan nodes that carry the glow. */
  hub: boolean;
  /** Deterministic drift orbit — amplitude, phase and rate. */
  ax: number;
  ay: number;
  phase: number;
  rate: number;
};

export type NetEdge = {
  a: number;
  b: number;
  /** 0..1, thinner and fainter for longer spans. */
  strength: number;
};

export type NetArc = { cx: number; cy: number; r: number; opacity: number };

/** Small, fast, and stable across platforms — unlike Math.random. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function build() {
  const rand = mulberry32(0x5eed_1a7f);
  const nodes: NetNode[] = [];

  /* A jittered grid rather than pure random placement: random scatter clumps
     and leaves holes, and the reference art is evenly spread but not regular.
     The grid starts at x = 0.34 so the headline's side of the hero stays clear. */
  const COLS = 9;
  const ROWS = 7;
  const X0 = 0.40;
  const X1 = 1.06;
  const Y0 = -0.04;
  const Y1 = 1.04;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      // Leave gaps so the mesh breathes instead of reading as a lattice.
      if (rand() < 0.2) continue;

      const cw = (X1 - X0) / COLS;
      const ch = (Y1 - Y0) / ROWS;
      const x = X0 + cw * (c + 0.5 + (rand() - 0.5) * 0.9);
      const y = Y0 + ch * (r + 0.5 + (rand() - 0.5) * 0.9);

      // Density thins toward the left edge, so the network fades into the text.
      const t = (x - X0) / (X1 - X0);
      if (rand() > 0.35 + t * 0.75) continue;

      nodes.push({
        x,
        y,
        r: 3.2 + rand() * 2.6,
        hub: false,
        ax: 0.006 + rand() * 0.012,
        ay: 0.006 + rand() * 0.012,
        phase: rand() * Math.PI * 2,
        rate: 0.08 + rand() * 0.10,
      });
    }
  }

  /* Hubs: a handful of bright nodes, chosen spread out rather than adjacent,
     since the reference reads as a few beacons rather than a bright cluster. */
  const HUBS = 6;
  const chosen: number[] = [];
  for (let i = 0; i < HUBS; i++) {
    let best = -1;
    let bestScore = -1;
    for (let n = 0; n < nodes.length; n++) {
      if (chosen.includes(n)) continue;
      const node = nodes[n];
      // Prefer the right-hand side, and distance from hubs already picked.
      /* Favour the middle of the visible band. Scoring on raw x pushed hubs
         past the right edge, where the cover-crop hides them. */
      const sweet = 1 - Math.abs(node.x - 0.68) / 0.34;
      let score = Math.max(0, sweet) * 1.4 + rand() * 0.35;
      for (const c of chosen) {
        const d = Math.hypot(node.x - nodes[c].x, node.y - nodes[c].y);
        score += Math.min(d, 0.45);
      }
      if (score > bestScore) {
        bestScore = score;
        best = n;
      }
    }
    if (best >= 0) {
      chosen.push(best);
      nodes[best].hub = true;
      nodes[best].r = 6.2 + rand() * 1.8;
    }
  }

  /* Edges by proximity: each node reaches to its nearest few neighbours, which
     produces the loose triangulation of the reference without needing a real
     Delaunay pass. The graph is fixed — nodes drift, but connections do not
     form and break, so the composition stays stable behind the text. */
  const MAX_D = 0.185;
  const seen = new Set<string>();
  const edges: NetEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const near = nodes
      .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .filter((n) => n.j !== i && n.d < MAX_D)
      .sort((a, b) => a.d - b.d)
      .slice(0, nodes[i].hub ? 4 : 3);

    for (const n of near) {
      const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: i, b: n.j, strength: 1 - n.d / MAX_D });
    }
  }

  /* The faint sweeping circles behind everything, straight from the reference. */
  const arcs: NetArc[] = [
    { cx: 0.86, cy: 0.02, r: 0.30, opacity: 0.5 },
    { cx: 0.47, cy: 0.44, r: 0.26, opacity: 0.38 },
    { cx: 0.62, cy: 1.06, r: 0.34, opacity: 0.32 },
    { cx: 1.02, cy: 0.62, r: 0.22, opacity: 0.28 },
  ];

  return { nodes, edges, arcs };
}

export const network = build();

/**
 * Where a node sits at time `t`, in 0..1 hero space. The SVG renders t = 0, so
 * the canvas starts from exactly the same picture.
 */
export function nodeAt(n: NetNode, t: number) {
  return {
    x: n.x + Math.sin(t * n.rate + n.phase) * n.ax,
    y: n.y + Math.cos(t * n.rate * 0.82 + n.phase * 1.3) * n.ay,
  };
}

/**
 * Both renderers read these. Emitted as CSS custom properties for the SVG and
 * used directly by the canvas, so there is one source for the palette.
 */
export const palette = {
  light: {
    node: "#8AA6BC",
    hub: "#12C2E9",
    edge: "#9DB6C9",
    arc: "#C3D2DE",
    /* The hero's own ground. The canvas is transparent, so this is CSS. */
    bgA: "#FBFCFD",
    bgB: "#EDF2F6",
  },
  dark: {
    node: "#93BADD",
    hub: "#22D3EE",
    edge: "#47709C",
    arc: "#1E3A5C",
    bgA: "#060A12",
    bgB: "#0B1A2E",
  },
} as const;
