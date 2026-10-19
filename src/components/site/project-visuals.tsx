import type { CSSProperties, ReactNode } from "react";

import { turbofanRmse, type ProjectVisual } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Project diagrams, drawn from each project's recorded data or its
 * architecture. Charts use cobalt for the highlighted series and graphite for
 * comparison, never decorative gradients. They fill whatever box they are
 * given and size their type against it (container queries), so the same visual
 * works as a card thumbnail and as a case-study hero.
 */

/** Supporting labels never drop below 12px, however small the frame. */
const label = "text-[0.75rem] leading-normal text-text-secondary @4xl:text-[0.875rem]";

function Frame({
  children,
  description,
  className,
}: {
  children: ReactNode;
  description: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={description}
      className={cn(
        "@container relative size-full overflow-hidden bg-bg-subtle",
        className,
      )}
    >
      <div aria-hidden className="relative size-full">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const rmseMax = 22;

function RmseChart() {
  const best = Math.min(...turbofanRmse.map((r) => r.rmse));
  return (
    <Frame
      description={`Official FD001 test RMSE in cycles, lower is better: ${turbofanRmse
        .map((r) => `${r.model} ${r.rmse.toFixed(2)}`)
        .join(", ")}.`}
    >
      <div className="flex size-full flex-col px-[6%] py-[5%]">
        <div className="flex items-baseline justify-between gap-3">
          <span className={label}>
            Official test RMSE<span className="hidden @md:inline"> · FD001</span>
          </span>
          <span className={label}>
            <span className="hidden @md:inline">cycles · </span>lower is better
          </span>
        </div>
        <ol className="mt-[3%] flex flex-1 flex-col justify-around">
          {turbofanRmse.map((r, i) => {
            const top = r.rmse === best;
            return (
              <li
                key={r.model}
                className="grid grid-cols-[4.5rem_1fr_2.75rem] items-center gap-2 @md:grid-cols-[12.75rem_1fr_3.25rem] @md:gap-3"
              >
                <span
                  className={cn(
                    "truncate text-[0.75rem] @md:text-[0.875rem] @4xl:text-[1rem]",
                    top ? "font-semibold text-text-primary" : "text-text-secondary",
                  )}
                >
                  <span className="@md:hidden">{r.short}</span>
                  <span className="hidden @md:inline">{r.model}</span>
                </span>
                <span className="relative h-1.5 overflow-hidden rounded-full bg-border-subtle @md:h-2 @4xl:h-3">
                  <span
                    className="viz-grow absolute inset-y-0 left-0 rounded-full"
                    style={
                      {
                        width: `${(r.rmse / rmseMax) * 100}%`,
                        background: top
                          ? "var(--cl-color-brand-default)"
                          : "var(--cl-color-chart-comparison)",
                        "--i": i,
                      } as CSSProperties
                    }
                  />
                </span>
                <span
                  className={cn(
                    "text-right text-[0.75rem] tabular-nums @md:text-[0.8125rem] @4xl:text-[1rem]",
                    top ? "font-medium text-text-primary" : "text-text-secondary",
                  )}
                >
                  {r.rmse.toFixed(2)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

function Components() {
  return (
    <Frame description="Illustration of the Figma to React relationship in Axon UI: a component's Figma variant properties map one-to-one onto the props of its React component, over shared colour, type and spacing foundations.">
      <div className="flex size-full flex-col px-[6%] py-[5%]">
        <div className="flex items-baseline justify-between gap-3">
          <span className={label}>Variant ⇄ prop</span>
          <span className={label}>Figma · React</span>
        </div>
        <div className="grid flex-1 grid-cols-2 items-center gap-[5%] pt-[4%]">
          <div className="flex h-[82%] min-h-0 flex-col gap-[6%] overflow-hidden rounded-media bg-bg-surface p-[7%] shadow-[inset_0_0_0_1px_var(--cl-color-border-subtle),var(--cl-shadow-subtle)]">
            <span className={label}>Figma · Button</span>
            <span className="flex flex-1 items-center justify-center">
              <span
                className="rounded-control px-[14%] py-[6%] text-[0.75rem] font-semibold text-brand-on @md:text-[0.875rem]"
                style={{ background: "var(--cl-color-brand-default)" }}
              >
                Button
              </span>
            </span>
            {[
              ["variant", "primary"],
              ["size", "md"],
            ].map(([k, v], i) => (
              <span
                key={k}
                className={cn(
                  "items-center justify-between border-t border-border-subtle pt-[4%] text-[0.75rem] @md:text-[0.875rem]",
                  i === 0 ? "flex" : "hidden @md:flex",
                )}
              >
                <span className="text-text-muted">{k}</span>
                <span className="text-text-primary">{v}</span>
              </span>
            ))}
          </div>
          <div className="flex h-[82%] min-h-0 flex-col gap-[4%] overflow-hidden rounded-media bg-bg-inverse p-[7%] font-mono text-[0.75rem] leading-relaxed text-text-inverse @md:text-[0.875rem]">
            <span className="opacity-60">React · Button.tsx</span>
            <span className="mt-auto">
              &lt;<span className="text-brand-inverse">Button</span>
            </span>
            <span className="pl-[10%]">
              variant=<span className="text-brand-inverse">&quot;primary&quot;</span>
            </span>
            <span className="hidden pl-[10%] @md:inline">
              size=<span className="text-brand-inverse">&quot;md&quot;</span>
            </span>
            <span className="mb-auto">/&gt;</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-[3%]">
          {["colour", "type", "space"].map((t) => (
            <span
              key={t}
              className="rounded-control px-2 py-0.5 font-mono text-[0.75rem] text-text-secondary shadow-[inset_0_0_0_1px_var(--cl-color-border-default)] @md:text-[0.8125rem]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

/** Deterministic layout so the reservoir renders identically on server and client. */
const reservoir = (() => {
  let s = 7;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const nodes = Array.from({ length: 34 }, (_, i) => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 78;
    return { x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r, on: i % 5 === 0 };
  });
  const links: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const j = Math.floor(rand() * nodes.length);
    if (j !== i) links.push([i, j]);
  }
  return { nodes, links };
})();

function wave(noisy: boolean) {
  let s = 3;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const pts: string[] = [];
  for (let x = 0; x <= 200; x += noisy ? 3 : 2) {
    const clean = Math.sin(x / 14) * 34 + Math.sin(x / 5.5) * 8;
    const y = 100 - (noisy ? clean + (rand() - 0.5) * 70 : clean);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
const noisyWave = wave(true);
const cleanWave = wave(false);

function Lsm() {
  return (
    <Frame description="Schematic of the Liquid State Machine: a noisy audio signal is encoded as spikes, drives a fixed recurrent reservoir of spiking neurons, and a trained readout reconstructs a filtered signal.">
      <div className="flex size-full flex-col px-[6%] py-[5%]">
        <div className="flex items-baseline justify-between gap-3">
          <span className={label}>Sound → spikes → sound</span>
          <span className={label}>Liquid State Machine</span>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_auto_1.1fr_auto_1fr] items-center gap-[2%]">
          {[
            { name: "Noisy input", el: <polyline points={noisyWave} fill="none" stroke="var(--cl-color-chart-comparison)" strokeWidth="2" strokeLinejoin="round" /> },
            null,
            {
              name: "Spiking reservoir",
              el: (
                <g>
                  <circle cx="100" cy="100" r="92" fill="none" stroke="var(--cl-color-text-primary)" strokeOpacity="0.35" strokeDasharray="3 5" />
                  {reservoir.links.map(([a, b], i) => (
                    <line
                      key={i}
                      x1={reservoir.nodes[a].x}
                      y1={reservoir.nodes[a].y}
                      x2={reservoir.nodes[b].x}
                      y2={reservoir.nodes[b].y}
                      stroke="var(--cl-color-chart-comparison)"
                      strokeOpacity="0.28"
                    />
                  ))}
                  {reservoir.nodes.map((n, i) => (
                    <circle
                      key={i}
                      cx={n.x}
                      cy={n.y}
                      r={n.on ? 6 : 4}
                      fill={n.on ? "var(--cl-color-brand-default)" : "var(--cl-color-chart-comparison)"}
                      fillOpacity={n.on ? 1 : 0.55}
                    />
                  ))}
                </g>
              ),
            },
            null,
            { name: "Filtered output", el: <polyline points={cleanWave} fill="none" stroke="var(--cl-color-brand-default)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /> },
          ].map((cell, i) =>
            cell ? (
              <div key={i} className="flex flex-col items-center gap-2 @md:gap-3">
                <svg viewBox="0 0 200 200" className="w-full overflow-visible">
                  {cell.el}
                </svg>
                <span className={cn(label, "text-center")}>{cell.name}</span>
              </div>
            ) : (
              <span key={i} className={cn(label, "pb-[30%]")}>
                →
              </span>
            ),
          )}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

const tiers = [
  { name: "Critical", partitions: 4 },
  { name: "High", partitions: 1 },
  { name: "Standard", partitions: 1 },
  { name: "Low", partitions: 1 },
];

function Tiers() {
  return (
    <Frame description="Architecture of the Ozon pipeline: e-commerce events pass through priority assignment into four isolated Azure Event Hubs namespaces, critical with four partitions, then high, standard and low, before transformation, processing and storage.">
      <div className="flex size-full flex-col px-[6%] py-[5%]">
        <div className="flex items-baseline justify-between gap-3">
          <span className={label}>Priority as architecture</span>
          <span className={label}>Azure Event Hubs</span>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_auto_1.6fr_auto_1fr] items-center gap-[3%] pt-[3%]">
          <div className="flex flex-col gap-1.5 @md:gap-3">
            <Node>Events</Node>
            <Node accent>Priority assignment</Node>
          </div>
          <span className={label}>→</span>
          <ol className="flex flex-col gap-1 @md:gap-2">
            {tiers.map((t, i) => (
              <li
                key={t.name}
                className="flex items-center gap-2 rounded-control bg-bg-surface px-2 py-1.5 shadow-[inset_0_0_0_1px_var(--cl-color-border-subtle)] @md:gap-3 @md:px-3 @md:py-2"
              >
                <span className="w-[4.25rem] shrink-0 text-[0.75rem] font-medium text-text-primary @md:w-20 @md:text-[0.875rem]">
                  {t.name}
                </span>
                <span className="flex min-w-0 flex-1 gap-1">
                  {Array.from({ length: t.partitions }, (_, p) => (
                    <span
                      key={p}
                      className="viz-grow h-1.5 flex-1 rounded-full @md:h-2"
                      style={
                        {
                          background: i === 0 ? "var(--cl-color-brand-default)" : "var(--cl-color-chart-comparison)",
                          "--i": i,
                        } as CSSProperties
                      }
                    />
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <span className={label}>→</span>
          <div className="flex flex-col gap-1.5 @md:gap-3">
            <Node>Transform</Node>
            <Node>Process</Node>
            <Node>Store</Node>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Node({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-control px-2 py-1.5 text-center text-[0.75rem] leading-tight @md:px-3 @md:py-2.5 @md:text-[0.875rem]",
        accent
          ? "font-medium text-brand-on"
          : "bg-bg-surface text-text-secondary shadow-[inset_0_0_0_1px_var(--cl-color-border-subtle)]",
      )}
      style={accent ? { background: "var(--cl-color-brand-default)" } : undefined}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */

const visuals: Record<ProjectVisual, () => ReactNode> = {
  rmse: RmseChart,
  components: Components,
  lsm: Lsm,
  tiers: Tiers,
};

/** C08 captions: what each diagram is drawn from, and when it is illustrative. */
export const visualCaption: Record<ProjectVisual, string> = {
  rmse: "Official-test RMSE for all eight pipelines on FD001, from the MSc report. Lower is better.",
  components: "Illustrative diagram: a Figma variant and the matching React props.",
  lsm: "Illustrative diagram of the pipeline, not recorded output.",
  tiers: "Architecture diagram: events routed into four isolated priority tiers.",
};

export function ProjectVisualView({ kind }: { kind: ProjectVisual }) {
  const Visual = visuals[kind];
  return <Visual />;
}
