# Portfolio

Personal site for Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer.

Built from a [Claude Design](https://claude.ai/design) canvas. The design is the source of
truth; `build.js` compiles it into a static site with no framework and no dependencies.

## Layout

```
design/                  source of truth, imported from Claude Design
  Portfolio.dc.html        the design canvas document (template DSL + content data)
  image-slot.js            web component: fillable image placeholders
  video-slot.js            web component: drag-drop video placeholders
  .image-slots.state.json  filled image-slot contents (the case-study screenshots)
  uploads/                 résumé PDF
src/
  app.js                 client runtime: routing, theme, nav, reveal, contact form
build.js                 compiles design/ + src/ -> docs/
docs/                    build output — this is what gets served
```

## Build

```sh
node build.js       # or: npm run build
npm run serve       # build, then serve docs/ at http://localhost:8899
```

No install step — the build uses only the Node standard library.

## How the build works

`Portfolio.dc.html` is a design-canvas document. Its markup is a small template DSL —
`{{ bindings }}`, `<sc-if>`, `<sc-for>`, `style-hover` — that the Claude Design canvas
renders through React and its `support.js` runtime. That runtime is not something you want
on a public site, so the build resolves the DSL ahead of time:

- **Content is baked.** Each of the 7 routes is rendered to static HTML at build time, so
  the page is fully populated before any JavaScript runs.
- **Interaction becomes `data-*` hooks.** Theme, mobile nav, the contact form, the rotating
  hero word and scroll reveal are driven by `src/app.js`.
- **Hover styling becomes CSS.** `style-hover` attributes are collected, de-duplicated and
  emitted as real rules, so hover works without JS.
- **The capability accordion became pure CSS.** In the canvas it was React state; here it is
  `:hover` / `:focus-within`, which also makes it keyboard-reachable.

Routing is hash-based (`#/work/budgetview`), matching the design. Every route is present in
`index.html`; the script toggles which one is visible. That keeps the whole site one file
with no server rewrites, and all content stays in the HTML for crawlers.

## Editing

Change the design in Claude Design, re-export `Portfolio.dc.html` into `design/`, and rebuild.
Content — case studies, links, the rotating words — lives in the `<script type="text/x-dc">`
block at the bottom of that file, and the build reads it directly, so content edits need no
changes to `build.js`.

## Deploying

`docs/` is committed, so **GitHub Pages** works with no CI: Settings → Pages → deploy from
branch `main`, folder `/docs`. A `.nojekyll` file is included so the underscore- and
dot-prefixed assets are served.

For **Vercel** or **Netlify**: build command `node build.js`, output directory `docs`.

## Known TODOs, carried over from the design

These are placeholders in `design/Portfolio.dc.html` and still need real values:

- `GITHUB` and `CALCOM` both point at `TODO` URLs.
- The contact form has no backend — submitting only shows a confirmation. The `mailto:`
  link in the sidebar is the working path until a handler is wired up.
- BudgetView's status reads "In development"; the design notes it should flip to a live
  product link once deployed.
- The home-page project animations are empty `<video-slot>`s. They accept a dropped MP4 in
  the browser, but that is stored per-visitor in IndexedDB — real videos need to be
  committed as files and referenced directly.
- Case-study image slots are filled from `.image-slots.state.json`, and the design marks
  them as placeholders to be replaced with final interface screenshots.
