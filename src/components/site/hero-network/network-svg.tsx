import { VIEW, network, nodeAt, palette } from "./network";

/**
 * The network as inline SVG, rendered on the server.
 *
 * This is what paints the hero — immediately, inside the HTML, with no image
 * request and nothing to wait for. The canvas fades in over it and this fades
 * out; if WebGL is unavailable or JavaScript never runs, it simply stays. It is
 * drawn at t = 0 from the same layout the canvas animates, so the handover has
 * nothing to jump between.
 */
export function NetworkSvg({ id }: { id: string }) {
  const { nodes, edges, arcs } = network;
  const [node, hub, edge, arc] = [palette.node, palette.hub, palette.edge, palette.arc].map(
    (token) => `var(${token})`,
  );
  const pts = nodes.map((n) => nodeAt(n, 0));

  const X = (v: number) => v * VIEW.w;
  const Y = (v: number) => v * VIEW.h;

  return (
    <>
      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0%" stopColor={hub} stopOpacity="0.32" />
            <stop offset="45%" stopColor={hub} stopOpacity="0.1" />
            <stop offset="100%" stopColor={hub} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke={arc} fill="none">
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={X(a.cx)}
              cy={Y(a.cy)}
              r={a.r * VIEW.w}
              strokeWidth={1}
              opacity={a.opacity}
            />
          ))}
        </g>

        <g data-net-live>
          <g stroke={edge}>
            {edges.map((e, i) => (
              <line
                key={i}
                x1={X(pts[e.a].x)}
                y1={Y(pts[e.a].y)}
                x2={X(pts[e.b].x)}
                y2={Y(pts[e.b].y)}
                strokeWidth={0.6 + e.strength * 0.7}
                opacity={0.18 + e.strength * 0.34}
              />
            ))}
          </g>

          {nodes.map((n, i) =>
            n.hub ? (
              <circle
                key={`g${i}`}
                cx={X(pts[i].x)}
                cy={Y(pts[i].y)}
                r={n.r * 7}
                fill={`url(#${id}-glow)`}
              />
            ) : null,
          )}

          <g>
            {nodes.map((n, i) => (
              <circle
                key={i}
                cx={X(pts[i].x)}
                cy={Y(pts[i].y)}
                r={n.r}
                fill={n.hub ? hub : node}
                opacity={n.hub ? 1 : 0.8}
              />
            ))}
          </g>
        </g>
      </svg>
    </>
  );
}
