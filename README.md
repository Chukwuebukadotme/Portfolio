# Portfolio

Personal site for Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer.

Next.js (App Router) and TypeScript, with shadcn/ui themed by the site's own
design system and a React Three Fiber hero.

## Stack

| | |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (Radix primitives) |
| 3D | three.js via React Three Fiber + drei |
| Forms | Server Actions + Zod + shadcn form controls |
| Theming | next-themes |

## Layout

```
src/
  app/
    layout.tsx           shell: fonts, theme, header/footer, js gate
    page.tsx             home
    work/page.tsx        work index
    work/[slug]/page.tsx case studies (prerendered from content.ts)
    about/page.tsx
    contact/
      page.tsx
      actions.ts         server action — validation, honeypot, delivery
    globals.css          Tailwind entry + the design-system bridge
  components/
    ui/                  shadcn primitives, stock apart from their theming
    site/                site components (header, footer, glass, reveal, form)
      hero-network/      the hero: network.ts (layout) + SVG + canvas
  lib/
    content.ts           all copy and case-study data, typed
    contact-schema.ts    Zod schema shared by client and server
    utils.ts             cn(), with the design system's type scale registered
  styles/
    ds.css               imports the token files
    tokens/              the bound design system, copied from design/_ds
design/                  the original Claude Design canvas — reference only
legacy/                  the previous zero-dependency static build
public/                  measurement texture, résumé
```

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## How the design system binds to Tailwind

The site has its own design system — palette, type scale, spacing, elevation,
material and motion — as CSS custom properties in `src/styles/tokens`. Those
files are copied verbatim from `design/_ds` and are the source of truth for
every value.

`src/app/globals.css` is the bridge, and it does three things:

1. **Imports the tokens into Tailwind's `base` layer.** The layer matters:
   unlayered CSS outranks every `@layer`, so importing the design system
   normally would make its `a { text-decoration: underline }` unbeatable by
   `no-underline`.
2. **Defines shadcn's variables in terms of design-system tokens.** `--primary`,
   `--border`, `--ring` and the rest all resolve to a token, so Radix primitives
   inherit the site's material rather than shipping a neutral palette beside it.
   Change a token and every shadcn component moves with it.
3. **Exposes the system to Tailwind via `@theme inline`,** which generates real
   utilities: `text-h1`, `text-text-secondary`, `bg-surface-raised`,
   `border-border-hairline`, `shadow-glass`.

Spacing is deliberately **not** overridden. The design system's steps
(4, 8, 12, 20, 24, 32, 40, 48, 64, 80, 128 px) already sit on Tailwind's native
4px grid, so `p-6` is the system's 24px step. Redefining `--spacing-*` to the
pixel values instead breaks every shadcn component, whose stock spacing assumes
the default scale.

One related trap worth knowing about: `tailwind-merge` classifies `text-h3` as a
*colour* rather than a size, because it is not a t-shirt size. Left alone, that
made `cn("text-h3", "text-text-primary")` silently drop the size. The scale is
registered with `extendTailwindMerge` in `src/lib/utils.ts`.

## The hero

A network of nodes and the links between them. **There is no image anywhere in
it** — no photograph, no exported artwork, nothing to download. The hero is
drawn twice from one shared description:

```
network.ts        the layout: node positions, edges, arcs, palette
network-svg.tsx   renders it as inline SVG, on the server
network-canvas.tsx renders it live in WebGL, on the client
```

`network.ts` generates the layout **deterministically** — a seeded PRNG, never
`Math.random` — because the server and the client must agree exactly. The SVG is
drawn at `t = 0`, which is precisely where the canvas begins, so the handover
has nothing to jump between. Measured, the two renderings differ on 0.8% of
pixels.

**What paints when.** The SVG ships inside the HTML, so the hero is there on
first paint with no request to wait for. The canvas fades in over it once it has
rendered a frame, and the SVG's live group fades out; the background arcs stay,
since the canvas is transparent. If WebGL is missing, the context is lost, or
JavaScript never runs, the SVG simply remains — a complete hero, not a
placeholder.

**Motion.** Nodes drift on slow deterministic orbits while the graph itself
stays fixed, so lines stretch and breathe but the composition never churns
behind the text. Hovering makes the cursor a node: it links to the nearest few
and brightens them, so the gesture reads as joining the network rather than
disturbing it.

**One animation, both themes.** The geometry, motion and interaction are
identical in light and dark; only the palette differs, and it lerps on a theme
change rather than switching. The palette lives in `network.ts` and is emitted
as CSS custom properties for the SVG and read directly by the canvas, so there
is a single source for it.

Two things that were subtly wrong and are worth not repeating:

- *Frustum culling kills geometry you rewrite every frame.* The cursor links
  start collapsed at a single point, so Three computes a zero-radius bounding
  sphere on the first frame and then culls the whole object the moment the
  cursor moves. Everything here sets `frustumCulled={false}`.
- *Point size must match the SVG's cover mapping.* Deriving it from viewport
  height alone made canvas dots ~20% smaller than the SVG's whenever width is
  the limiting dimension — which is the usual case on a wide hero — so the
  handover visibly shrank.

**The uniforms gotcha**, still true of anything using `ShaderMaterial`:
`THREE.ShaderMaterial` *clones* the uniforms object it is constructed with, so
the object React holds is not the one the GPU samples. The loop runs, every draw
call happens, and nothing moves. Write through `matRef.current.uniforms`.

Worth knowing when debugging: `canvas.toDataURL()` reads a cleared buffer unless
the context was created with `preserveDrawingBuffer`, so screenshotting the
canvas will not tell you whether it is animating. Read the values instead.

The network is weighted to the right and thins before it reaches the headline,
so the scrim only has to soften its edge and blend the hero into the page — far
lighter than earlier heroes needed, which is why the artwork reads at full
strength.

## Divergences from the bound design system

The token files in `src/styles/tokens` are copied from `design/_ds` verbatim,
with one deliberate exception, marked in place with a comment: the dark-mode
`--glass-rim-*` values. The source ships cyan rims at 55% alpha, which read as a
blue outline drawn around every glass surface rather than as light catching an
edge. They are softened to white at low alpha. Re-importing the design system
will overwrite this.

## Routing

Real routes, prerendered: `/`, `/work`, `/work/{budgetview,siteresolve,referralview}`,
`/about`, `/contact`.

The previous site routed on the hash (`#/work/budgetview`), and those links are
already in the wild. `HashRedirect` translates any hash that names a real route
into the equivalent path, once, on arrival.

## The contact form

The form validates with Zod on the client and again in the server action, keeps a
honeypot field, and surfaces field-level errors. Delivery is the one piece left
open: `deliver()` in `src/app/contact/actions.ts` logs the enquiry until a
provider is configured.

To send real email: `npm i resend`, set `RESEND_API_KEY`, verify a sending
domain, and complete `deliver()` — the Resend call is written out in a comment
there. Everything around it is already wired.

## Accessibility and resilience

- Every route is server-rendered, so content is present before any JS runs.
- The scroll reveal is gated on a `js` class set by a blocking script in
  `<head>`. Without JavaScript the displaced start state never applies and the
  page renders plainly, rather than hiding content behind an observer that will
  never run.
- `prefers-reduced-motion` stops the hero loop, the reveal and the rotating word.
- The theme toggle withholds its label until the client knows the stored theme,
  rather than rendering the wrong one and correcting it. It is a floating
  control fixed to the bottom-right, so the theme stays one click away on every
  page without occupying the navbar or requiring a scroll to the footer.

## Deploying

Vercel: framework preset Next.js, no configuration needed. Add `RESEND_API_KEY`
when the form is wired to a provider.

## Known gaps

Carried over from the design, and still open:

- **Case-study screenshots are placeholders.** `MediaPlaceholder` renders a
  labelled frame wherever artwork belongs. The v1 sidecar in `legacy/` was
  checked and does not help: it holds only two distinct images, each repeated
  three times, and both are a stock third-party invoicing landing page rather
  than any of these products.
- **Homepage project animations** are the same placeholders. They were empty
  `<video-slot>` elements before — a drag-drop component that stored footage per
  visitor in IndexedDB and shipped nothing.
- **Cal.com URL** is still a placeholder, so the booking link is withheld from
  the contact page rather than shipped broken.
- **Case-study outcomes** are marked TODO in `src/lib/content.ts`, pending real
  evidence. No metrics, clients or testimonials are claimed.
