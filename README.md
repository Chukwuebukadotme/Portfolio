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
      hero-mesh/         the WebGL hero: shaders.ts + grid-surface.tsx
  lib/
    content.ts           all copy and case-study data, typed
    contact-schema.ts    Zod schema shared by client and server
    utils.ts             cn(), with the design system's type scale registered
  styles/
    ds.css               imports the token files
    tokens/              the bound design system, copied from design/_ds
design/                  the original Claude Design canvas — reference only
legacy/                  the previous zero-dependency static build
public/                  hero grid art, measurement texture, résumé
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

`src/components/site/hero-mesh/` is a finely subdivided plane, displaced along
Z and drawn with its grid painted on in the fragment stage. three.js is a real
dependency rather than a runtime CDN import, and the render loop is
demand-driven — it stops when the hero scrolls out of view, when the tab is
hidden, and under `prefers-reduced-motion`.

**The grid is geometry, not a picture, and that is the whole point.** The
earlier version sampled the supplied artwork as a texture and offset its UVs on
hover. UV displacement can only ever warp the whole sheet, because to a texture
lookup there are no lines — only pixels — so it read as rippling paper rather
than a mesh. Now the lines are painted onto a surface that actually deforms, so
displacing vertices moves the lines through perspective, and hovering genuinely
bends the grid.

The composition is built around a **centreline** that snakes across the width.
Everything is expressed relative to it: the surface rises into a ridge along it,
the flow lines are contours parallel to it (which is why they fan and crowd the
way the artwork does), and the glow is a tight band on it. Its frequency is
chosen so about one and a half periods cross the plane — fewer, and the band
reads as a single arc leaving a corner rather than a wave sweeping the width.

Two details worth keeping:

- *`fwidth` for line width.* Anti-aliasing each line against its own screen-space
  derivative keeps the stroke a constant weight however far the surface turns
  away from the camera. Without it the mesh aliases into a crawling moiré.
- *Glow mixes, it does not only add.* Purely additive light blows out to white on
  a pale ground. The spine blends toward the accent colour in both themes, with
  a small additive bloom scaled in only for the dark palette.

The supplied artwork still ships as the still fallback for both themes, chosen
by **CSS** rather than JavaScript. `resolvedTheme` is undefined during SSR and
the first client render, so selecting the source in JS put the light art on a
dark page until hydration caught up. The `dark:` variant keys off the attribute
the blocking script sets before first paint, so the correct one shows from the
first frame — and still does with JavaScript disabled entirely.

**Why the hero used to flash dark on a light page.** `ready` was set in
`onCreated`, which fires as soon as the *renderer* exists — before anything had
been drawn. With `alpha: false` the canvas clears to opaque black, so for a few
hundred milliseconds a black rectangle sat at full opacity over the artwork
while the still image faded out beneath it. Measured on a throttled load, hero
brightness ran 238 → **34** → 219. `ready` now waits for the first *rendered
frame*, and the clear colour is set to the theme's own ground, so no frame can
show as black even if one is dropped.

**The uniforms gotcha.** `THREE.ShaderMaterial` *clones* the uniforms object it
is constructed with, so the object React holds is not the object the GPU
samples. The symptom is deceptive: the frame loop runs, `useFrame` fires ~45
times a second and every draw call happens, but nothing moves, because each
uniform is pinned to whatever it was at construction. Every write therefore goes
through `matRef.current.uniforms`, never through the `uniforms` prop.

Worth knowing when debugging this: `canvas.toDataURL()` reads a cleared buffer
unless the context was created with `preserveDrawingBuffer`, so screenshotting
the canvas is not a reliable way to tell whether it is animating. Read the
uniform values instead.

A scrim sits between the hero and the text: a side gradient on wide screens that
clears the left third for the headline, and a gentler overall veil on narrow
ones, where the text column spans almost the full width and a side gradient
would leave body copy on bare grid.

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
