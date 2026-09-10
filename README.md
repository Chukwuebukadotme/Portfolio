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
      hero-mesh/         the WebGL hero: shaders.ts + mesh-plane.tsx
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

`src/components/site/hero-mesh/` is a plane sampling two matched grid-mesh
textures — one per theme — and disturbing them in two ways: a very slow ambient
drift so the mesh is never dead still, and a ripple that leaves the pointer and
decays with distance. three.js is a real dependency rather than a runtime CDN
import, and the render loop is demand-driven — it stops when the hero scrolls
out of view, when the tab is hidden, and under `prefers-reduced-motion`.

The art is 4:3 while the hero is a wide band, so the shader cover-fits and trims
the overflow symmetrically. A scrim sits between the art and the text: a side
gradient on wide screens that clears the left third for the headline, and a
gentler overall veil on narrow ones, where the text column spans almost the full
width and a side gradient would leave body copy on bare grid.

**Two things this art needs that the previous ribbon did not.** It is a
wireframe of roughly one-pixel lines, and that changes the maths:

- *No channel splitting.* The old shader offset the R and B taps for micro
  refraction. On thin lines that reads as coloured fringing rather than
  refraction, so each texture is now a single tap.
- *Mipmaps and anisotropy are mandatory.* Minified onto a smaller viewport
  without mip levels, one-pixel grid lines alias into a crawling moiré the
  moment anything moves. `LinearMipmapLinearFilter` plus max anisotropy is what
  keeps the mesh still when it should be still.

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

Both static textures render first and always, with **CSS** choosing between them
rather than JavaScript. `resolvedTheme` is undefined during SSR and the first
client render, so selecting the source in JS put the light art on a dark page
until hydration caught up. The `dark:` variant keys off the attribute the
blocking script sets before first paint, so the correct one shows from the first
frame — and still does with JavaScript disabled entirely.

The canvas fades in over them once there is a context and the textures decode,
so a missing WebGL context, a lost context, or a failed texture leaves the hero
as the artwork rather than a hole.

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
  rather than rendering the wrong one and correcting it.

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
