# Portfolio

Personal site for Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer.

Built from a [Claude Design](https://claude.ai/design) canvas. The design is the source of
truth; `build.js` compiles it into a static site with no framework and no dependencies.

## Layout

```
design/                    source of truth, imported from Claude Design
  Portfolio v2.dc.html       current site
  Portfolio.dc.html          previous version, kept for reference — not built
  _ds/                       the bound design system: styles.css + tokens/ + textures
  glass-ribbon.js            WebGL liquid-glass hero visual
  image-slot.js              web component: fillable image placeholders
  video-slot.js              web component: drag-drop video placeholders
  icons.json                 the three DS icons the page uses, lifted from the bundle
  assets/                    ribbon textures (light/dark, 720/1440)
  uploads/                   résumé PDF
  .image-slots.state.json    filled image-slot contents
src/
  app.js                   client runtime: routing, theme, nav, reveal, glass, form
build.js                   compiles design/ + src/ -> docs/
docs/                      build output — this is what gets served
```

## Build

```sh
node build.js       # or: npm run build
npm run serve       # build, then serve docs/ at http://localhost:8899
```

No install step — the build uses only the Node standard library.

## How the build works

`Portfolio v2.dc.html` is a design-canvas document. Its markup is a small template DSL —
`{{ bindings }}`, `<sc-if>`, `<sc-for>`, `style-hover` — plus `<x-import>` tags that pull
React components out of the design system's `_ds_bundle.js`. The canvas renders all of that
through React and `support.js`.

Shipping that runtime would mean React plus a 220KB component bundle to draw markup that
never changes after load. The build resolves it ahead of time instead:

- **Every route is rendered to static HTML**, so content is present before any JS runs.
- **Each `<x-import>` is expanded to the markup its JSX produces.** `GlassPanel`, `Button`,
  `Tag`, `TextInput`, `TextArea`, `Select` and `Icon` are reproduced from their source in
  the bundle — see the `S` object in `build.js`, where each is annotated with the component
  file it mirrors.
- **React state that only drove styling becomes CSS.** Button hover/press, field focus
  rings, the capability rows and the discipline cards were all `useState` in the canvas;
  here they are `:hover` / `:focus-within`, which also makes them keyboard-reachable.
- **`style-hover` attributes** are collected, de-duplicated and emitted as real rules.
- **What is genuinely interactive** becomes a `data-*` hook driven by `src/app.js`: hash
  routing, theme, mobile nav, the rotating hero word, scroll reveal, the glass specular
  tracking and the contact form.

The design system's stylesheets are copied verbatim and linked, so colour, type, spacing,
material and motion still come from the system rather than from this repo. Geist and Geist
Mono load from Google Fonts via the system's own `tokens/fonts.css`.

The hero keeps `<glass-ribbon>`: a WebGL plane sampling two matched ribbon textures with
slow UV flow, pointer refraction and a theme crossfade. It loads three.js from a CDN at
runtime and falls back to a static `<img>` when WebGL or the CDN is unavailable, so the
hero degrades rather than disappearing.

Routing is hash-based (`#/work/budgetview`), matching the design. Every route is present in
`index.html`; the script toggles which one is visible. That keeps the site one file with no
server rewrites, and all content stays in the HTML for crawlers.

## Editing

Change the design in Claude Design, re-import into `design/`, and rebuild. Content — case
studies, links, the rotating words, the enquiry options — lives in the
`<script type="text/x-dc">` block at the bottom of the `.dc.html`, and the build reads it
directly, so content edits need no changes to `build.js`.

Re-import is always a full-file fetch and a full rebuild; there is no incremental sync. Git
still diffs the output by content, so a one-line copy edit stays a one-line diff.

## Deploying

`docs/` is committed, so **GitHub Pages** works with no CI: Settings → Pages → deploy from
branch `main`, folder `/docs`. A `.nojekyll` file is included so the underscore- and
dot-prefixed assets (`_ds/`, `.image-slots.state.json`) are served.

For **Vercel** or **Netlify**: build command `node build.js`, output directory `docs`.

## Known gaps

Carried over from the design, and marked `TODO` there:

- **Case-study image slots are empty.** v2 renamed them to `v2-*` ids while
  `.image-slots.state.json` still holds the v1 ids, so the six screenshots that the previous
  version displayed no longer bind. This is listed as an open TODO in the design's own
  `CLAUDE.md`. Re-keying the sidecar from `bv-main` to `v2-bv-main` (and the other five)
  would restore them; adding final screenshots in Claude Design is the intended fix.
- **Cal.com URL** is still a `TODO` placeholder. The GitHub URL is now real.
- **The contact form has no backend** — submitting only shows a confirmation. The `mailto:`
  link in the sidebar is the working path.
- **Homepage project animations** are empty `<video-slot>`s. They accept a dropped MP4, but
  that is stored per-visitor in IndexedDB; real videos need committing as files.
- **Case-study outcomes** are placeholders pending real evidence.

Two notes specific to this repo rather than the design:

- **The 720px ribbon textures are copies of the 1440px ones.** The originals could not be
  transferred intact through the import channel, and no WebP encoder was available locally
  to downscale them. The hero is visually identical at every viewport; narrow screens just
  download a larger file than they need. Re-exporting the two `-720.webp` files from Claude
  Design into `design/assets/` fixes it with no code change.
- **`_ds/assets/textures/pixel-grid-tile.png` is regenerated,** not the original. It is the
  measurement grid used as a low-opacity overlay behind two sections, reproduced at the same
  360×360 geometry. Dropping in the original replaces it with no code change.
