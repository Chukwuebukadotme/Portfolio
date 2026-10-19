import { education, experience } from "@/lib/content";
import { cn } from "@/lib/utils";

type Entry =
  | { kind: "role"; key: string; title: string; detail: string; dates: string; start: string; end?: string }
  | { kind: "education"; key: string; title: string; detail: string; dates: string; at: string };

/** Year-month ("2023-09") as a month count, so spans can be measured. */
const month = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

const monthName = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const label = (index: number) =>
  monthName.format(new Date(Date.UTC(Math.floor(index / 12), index % 12, 1)));

/**
 * The career drawn to scale, from the first role to the month of the build.
 * Roles are spans; degrees are completion ticks, which explain the gap and
 * the overlap between roles. The current role is cobalt, the rest graphite.
 *
 * The bars are decoration over a real list: every entry states its dates in
 * text, so the ruler adds proportion, not information that only it carries.
 */
export function CareerRuler() {
  const roles: Entry[] = experience.map((e) => ({
    kind: "role",
    key: e.organisation,
    title: e.role,
    detail: e.organisation,
    dates: e.dates,
    start: e.start,
    end: "end" in e ? e.end : undefined,
  }));

  const origin = Math.min(...roles.map((r) => (r.kind === "role" ? month(r.start) : Infinity)));
  const today = new Date();
  const close = today.getUTCFullYear() * 12 + today.getUTCMonth() + 1;

  // Only qualifications completed within the ruler's span, so an earlier
  // certificate does not stretch the scale.
  const degrees: Entry[] = education
    .filter((e) => month(e.completed) >= origin)
    .map((e) => ({
      kind: "education",
      key: e.award,
      title: e.award,
      detail: e.institution,
      dates: `Completed ${e.date}`,
      at: e.completed,
    }));

  const entries = [...roles, ...degrees].sort(
    (a, b) => month(a.kind === "role" ? a.start : a.at) - month(b.kind === "role" ? b.start : b.at),
  );

  const pct = (index: number) => ((index - origin) / (close - origin)) * 100;
  const years: number[] = [];
  for (let y = Math.floor(origin / 12) + 1; y * 12 < close; y++) years.push(y);

  const grid = years.map((y) => (
    <span
      key={y}
      className="absolute inset-y-0 w-px bg-border-subtle"
      style={{ left: `${pct(y * 12)}%` }}
    />
  ));

  return (
    <figure className="m-0">
      <div aria-hidden className="grid gap-x-6 sm:grid-cols-[16rem_1fr] lg:grid-cols-[22rem_1fr]">
        <span className="hidden sm:block" />
        <div className="relative h-6">
          {years.map((y) => (
            <span
              key={y}
              className="absolute top-0 -translate-x-1/2 cl-type-caption text-text-muted tabular-nums"
              style={{ left: `${pct(y * 12)}%` }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>

      <ol>
        {entries.map((e) => (
          <li
            key={e.key}
            className="grid gap-x-6 gap-y-2 border-t border-border-subtle py-4 last:border-b sm:grid-cols-[16rem_1fr] lg:grid-cols-[22rem_1fr] sm:items-center"
          >
            <div className="min-w-0">
              <p className="cl-type-ui text-text-primary">{e.title}</p>
              <p className="cl-type-caption text-text-secondary">
                {e.detail} · <span className="tabular-nums">{e.dates}</span>
              </p>
            </div>
            <div aria-hidden className="relative h-6">
              {grid}
              {e.kind === "role" ? (
                <span
                  className={cn(
                    "absolute top-1/2 h-2 -translate-y-1/2 rounded-full",
                    e.end ? "bg-[var(--cl-color-chart-comparison)]" : "bg-brand",
                  )}
                  style={{
                    left: `${pct(month(e.start))}%`,
                    width: `${pct(e.end ? month(e.end) + 1 : close) - pct(month(e.start))}%`,
                  }}
                />
              ) : (
                <span
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-text-primary bg-bg-canvas"
                  style={{ left: `${pct(month(e.at) + 0.5)}%` }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="mt-3 cl-type-caption text-text-secondary">
        Drawn to scale from {label(origin)} to {label(close - 1)}. Bars are roles; diamonds mark
        completed degrees.
      </figcaption>
    </figure>
  );
}
