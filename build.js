#!/usr/bin/env node
/**
 * Builds the static site from the Claude Design source in design/Portfolio.dc.html.
 *
 * The .dc.html is a design-canvas document: its markup is a small template DSL
 * ({{ bindings }}, <sc-if>, <sc-for>, style-hover) that the canvas renders through
 * React + dc-runtime/support.js. This script resolves that DSL ahead of time so the
 * published site is plain HTML/CSS/JS with no runtime and no build-time dependency.
 *
 * Everything that is fixed per route (copy, case-study data, links) is baked into the
 * HTML. Everything genuinely interactive (theme, mobile nav, capability accordion,
 * contact form, rotating word, scroll reveal) becomes a data-* hook that assets/app.js
 * drives. Hover styling moves from style-hover attributes into real CSS rules.
 *
 *   node build.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'design', 'Portfolio.dc.html');
const OUT = path.join(ROOT, 'docs');

const src = fs.readFileSync(SRC, 'utf8');

/* ------------------------------------------------------------------ *
 * 1. Pull the three parts we need out of the design document.
 * ------------------------------------------------------------------ */

function slice(str, openRe, closeTag) {
  const open = openRe.exec(str);
  if (!open) throw new Error('missing ' + openRe);
  const start = open.index + open[0].length;
  const end = str.indexOf(closeTag, start);
  if (end === -1) throw new Error('unclosed ' + closeTag);
  return str.slice(start, end);
}

const helmet = slice(src, /<helmet>/, '</helmet>');
const baseCss = slice(helmet, /<style>/, '</style>');

// Template = everything inside <x-dc> after the <helmet> block.
const dcInner = slice(src, /<x-dc>/, '</x-dc>');
let template = dcInner.slice(dcInner.indexOf('</helmet>') + '</helmet>'.length);

// The logic script holds the content data. Evaluate the constants up to the class.
const scriptBody = slice(src, /<script type="text\/x-dc"[^>]*>/, '</script>');
const dataSource = scriptBody.slice(0, scriptBody.indexOf('class Component'));
const data = new Function(dataSource + '\nreturn { RESUME_URL, EMAIL, LINKEDIN, GITHUB, CALCOM, WORDS, CASES };')();

/* ------------------------------------------------------------------ *
 * 2. Tag-matching helper — finds the close tag for a nestable element.
 * ------------------------------------------------------------------ */

function findClose(str, from, tag) {
  const open = new RegExp('<' + tag + '(?=[\\s>])', 'g');
  const close = new RegExp('</' + tag + '>', 'g');
  let depth = 1;
  let i = from;
  while (depth > 0) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(str);
    const c = close.exec(str);
    if (!c) throw new Error('unclosed <' + tag + '>');
    if (o && o.index < c.index) {
      depth++;
      i = o.index + 1;
    } else {
      depth--;
      if (depth === 0) return { start: c.index, end: c.index + c[0].length };
      i = c.index + 1;
    }
  }
  throw new Error('unclosed <' + tag + '>');
}

/* ------------------------------------------------------------------ *
 * 3. Pre-passes over the raw template (route-independent).
 * ------------------------------------------------------------------ */

// 3a. Drop canvas-only scaffolding.
template = template.replace(/<template id="__bundler_thumbnail">[\s\S]*?<\/template>/g, '');
template = template.replace(/ hint-placeholder-(val|count)="[^"]*"/g, '');
template = template.replace(/ data-comment-anchor="[^"]*"/g, '');

// 3b. Rewrite the three state-driven <sc-if> blocks into always-emitted, JS-toggled
//     containers. Their contents must exist in the DOM for the script to reveal.
const toggles = [
  { binding: 'menuOpen', hook: 'data-mobile-nav' },
  { binding: 'projectEnquiry', hook: 'data-project-fields' },
  { binding: 'sent', hook: 'data-sent' }
];
for (const t of toggles) {
  const re = new RegExp('<sc-if value="\\{\\{ ' + t.binding + ' \\}\\}">');
  const m = re.exec(template);
  if (!m) throw new Error('toggle not found: ' + t.binding);
  const close = findClose(template, m.index + m[0].length, 'sc-if');
  const inner = template.slice(m.index + m[0].length, close.start);
  // Hoist the child's own attributes onto the wrapper so we do not add a box that
  // would disturb the flex/grid layout the design relies on.
  const child = /^\s*<([a-z-]+)((?:[^>"]|"[^"]*")*)>([\s\S]*)<\/\1>\s*$/.exec(inner);
  const replacement = child
    ? '<' + child[1] + ' ' + t.hook + ' hidden' + child[2] + '>' + child[3] + '</' + child[1] + '>'
    : '<div ' + t.hook + ' hidden>' + inner + '</div>';
  template = template.slice(0, m.index) + replacement + template.slice(close.end);
}

// 3c. The capability accordion is hover state expressed as ~16 interpolated inline
//     style values. Strip those declarations and mark each element with a role, so
//     plain CSS (:hover / :focus-within) can drive it instead of JS state.
const CAP_ROLE = [
  [/capBg\d|capShadow\d/, 'data-cap'],
  [/capNum\d/, 'data-cap-num'],
  [/capX\d/, 'data-cap-title'],
  [/capArrow\d/, 'data-cap-arrow'],
  [/capRows\d/, 'data-cap-panel'],
  [/capOp\d/, 'data-cap-arrow'] // only reached when capArrow/capRows absent
];

template = template.replace(/<([a-z][a-z0-9-]*)((?:[^>"]|"[^"]*")*?)>/gi, (tag, name, attrs) => {
  if (!/\{\{ cap/.test(attrs)) return tag;

  let role = null;
  let out = attrs.replace(/style="([^"]*)"/, (_m, styleVal) => {
    const kept = styleVal
      .split(';')
      .filter(decl => {
        if (!/\{\{ cap/.test(decl)) return true;
        if (!role) {
          for (const [re, r] of CAP_ROLE) {
            if (re.test(decl)) { role = r; break; }
          }
        }
        return false;
      })
      .join(';');
    return kept.trim() ? 'style="' + kept + '"' : '';
  });

  // The panel carries both capOp and capRows; the arrow carries capOp and capArrow.
  if (/capRows\d/.test(attrs)) role = 'data-cap-panel';
  else if (/capArrow\d/.test(attrs)) role = 'data-cap-arrow';

  // Row hover is entered via onMouseEnter — that element is the accordion row.
  if (/onMouseEnter/.test(attrs)) role = 'data-cap';

  out = out.replace(/ on(MouseEnter|MouseLeave)="\{\{ [^}]*\}\}"/g, '');
  return '<' + name + (role ? ' ' + role : '') + out + '>';
});

// 3d. style-hover / style-focus become real CSS rules on generated classes.
const hoverRules = new Map();
template = template.replace(/ style-(hover|focus)="([^"]*)"/g, (_m, kind, decls) => {
  const key = kind + '|' + decls;
  if (!hoverRules.has(key)) hoverRules.set(key, 'x' + hoverRules.size.toString(36));
  return ' data-fx="' + hoverRules.get(key) + '"';
});

// Merge duplicate data-fx onto one attribute if an element somehow gets two.
template = template.replace(/ data-fx="([^"]*)" data-fx="([^"]*)"/g, ' data-fx="$1 $2"');

// 3e. Navigation, form and scroll handlers become declarative hooks.
template = template
  .replace(/ onClick="\{\{ scrollWork \}\}"/g, ' data-scroll-work')
  .replace(/ onClick="\{\{ toggleTheme \}\}"/g, ' data-theme-toggle')
  .replace(/ onClick="\{\{ toggleMenu \}\}"/g, ' data-menu-toggle')
  .replace(/ onSubmit="\{\{ onSubmit \}\}"/g, ' data-contact-form')
  .replace(/ onChange="\{\{ setType \}\}"/g, ' data-type-select')
  // go(route) handlers only mirror what the href already does under hash routing.
  .replace(/ onClick="\{\{ go[A-Za-z]* \}\}"/g, '')
  .replace(/ onClick="\{\{ c\.onClick \}\}"/g, '');

// 3f. Theme-dependent values: bake the light-theme defaults, hook them for app.js.
template = template
  .replace(/aria-pressed="\{\{ isLight \}\}"/g, 'aria-pressed="true"')
  .replace(/title="\{\{ themeTitle \}\}"/g, 'title="Switch to dark mode"')
  .replace(/background:\{\{ themeDot \}\}/g, 'background:transparent" data-theme-dot="')
  .replace(/\{\{ themeLabel \}\}/g, '<span data-theme-text>Dark</span>')
  .replace(/\{\{ menuLabel \}\}/g, '<span data-menu-label>Menu</span>')
  .replace(/aria-expanded="\{\{ menuOpen \}\}"/g, 'aria-expanded="false"');

// 3f2. Let the footer year refresh itself client-side, so a stale build does not
//      show last year's copyright.
template = template.replace(/\{\{ year \}\}/g, '<span data-year>{{ year }}</span>');

// 3g. The rotating hero word.
template = template.replace(
  /\{\{ rotEl \}\}/g,
  '<span data-rot style="display:inline-block;color:var(--accent)">' + esc(data.WORDS[0]) + '</span>'
);

/* ------------------------------------------------------------------ *
 * 4. Template renderer — {{ bindings }}, <sc-if>, <sc-for>.
 * ------------------------------------------------------------------ */

function esc(v) {
  return String(v).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function lookup(ctx, expr) {
  const parts = expr.trim().split('.');
  let v = ctx;
  for (const p of parts) {
    if (v == null) return undefined;
    v = v[p];
  }
  return v;
}

function render(tpl, ctx) {
  let out = '';
  let i = 0;
  const next = /<sc-(if|for)([^>]*)>/g;

  while (i < tpl.length) {
    next.lastIndex = i;
    const m = next.exec(tpl);
    if (!m) { out += interpolate(tpl.slice(i), ctx); break; }

    out += interpolate(tpl.slice(i, m.index), ctx);
    const bodyStart = m.index + m[0].length;
    const close = findClose(tpl, bodyStart, 'sc-' + m[1]);
    const body = tpl.slice(bodyStart, close.start);

    if (m[1] === 'if') {
      const cond = /value="\{\{ ([^}]+) \}\}"/.exec(m[2]);
      if (lookup(ctx, cond[1])) out += render(body, ctx);
    } else {
      const list = /list="\{\{ ([^}]+) \}\}"/.exec(m[2]);
      const as = /as="([^"]+)"/.exec(m[2])[1];
      const items = lookup(ctx, list[1]) || [];
      for (const item of items) {
        out += render(body, Object.assign(Object.create(ctx), { [as]: item }));
      }
    }
    i = close.end;
  }
  return out;
}

function interpolate(str, ctx) {
  return str.replace(/\{\{ ([^}]+) \}\}/g, (_m, expr) => {
    const v = lookup(ctx, expr);
    return v === undefined || v === null ? '' : esc(v);
  });
}

/* ------------------------------------------------------------------ *
 * 5. Per-route context, mirroring renderVals() in the design.
 * ------------------------------------------------------------------ */

const { CASES, RESUME_URL, EMAIL, LINKEDIN, GITHUB, CALCOM } = data;

function baseCtx(route) {
  const csIndex = CASES.findIndex(c => route === '/work/' + c.slug);
  const cs = csIndex > -1 ? CASES[csIndex] : null;
  const next = cs ? CASES[(csIndex + 1) % CASES.length] : null;

  return {
    resumeUrl: RESUME_URL, email: EMAIL, emailHref: 'mailto:' + EMAIL,
    linkedin: LINKEDIN, github: GITHUB, calcom: CALCOM,
    cWork: route.indexOf('/work') === 0 ? 'var(--ink)' : 'var(--ink-2)',
    cAbout: route === '/about' ? 'var(--ink)' : 'var(--ink-2)',
    isHome: route === '/', isWork: route === '/work',
    isAbout: route === '/about', isContact: route === '/contact',
    isCase: !!cs, cs, next,
    isBudget: !!cs && cs.slug === 'budgetview',
    isSite: !!cs && cs.slug === 'siteresolve',
    isReferral: !!cs && cs.slug === 'referralview',
    cases: CASES,
    csFlow: cs ? cs.flow.map((f, i) => ({ label: f, n: String(i + 1).padStart(2, '0') })) : [],
    csArch: cs ? cs.arch.map(a => ({ k: a[0], v: a[1] })) : [],
    csTech: cs ? cs.tech.map(t => ({ t })) : [],
    csAreas: cs ? cs.areas.map(t => ({ t })) : [],
    csDecisions: cs ? cs.decisions.map((d, i) => ({ ...d, n: String(i + 1).padStart(2, '0') })) : [],
    nextHref: next ? '#/work/' + next.slug : '#/work',
    caseLinks: CASES.map(c => ({ ...c, href: '#/work/' + c.slug, flowText: c.flow.join('  →  '), open: true })),
    year: new Date().getFullYear()
  };
}

const routes = ['/', '/work', '/about', '/contact'].concat(CASES.map(c => '/work/' + c.slug));

/* ------------------------------------------------------------------ *
 * 6. Split the template into chrome (header/footer) and routed body.
 * ------------------------------------------------------------------ */

const mainOpen = template.indexOf('<main id="main">');
const mainClose = template.indexOf('</main>');
if (mainOpen === -1 || mainClose === -1) throw new Error('cannot locate <main>');

const chromeTop = template.slice(0, mainOpen + '<main id="main">'.length);
const mainBody = template.slice(mainOpen + '<main id="main">'.length, mainClose);
const chromeBottom = template.slice(mainClose);

// Header/footer are route-sensitive only through the two nav colours, which app.js
// keeps in sync — render them once against the home route.
const homeCtx = baseCtx('/');
const headerHtml = render(chromeTop, homeCtx);
const footerHtml = render(chromeBottom, homeCtx);

const routeHtml = routes.map(route => {
  const html = render(mainBody, baseCtx(route)).trim();
  const hidden = route === '/' ? '' : ' hidden';
  return '<div data-route="' + route + '"' + hidden + '>\n' + html + '\n</div>';
}).join('\n');

/* ------------------------------------------------------------------ *
 * 7. Stylesheet: design CSS + generated hover rules + accordion rules.
 * ------------------------------------------------------------------ */

let css = baseCss.trim() + '\n\n/* --- generated from style-hover / style-focus --- */\n';
for (const [key, cls] of hoverRules) {
  const [kind, decls] = key.split(/\|(.*)/s);
  const pseudo = kind === 'hover' ? ':hover' : ':focus';
  css += '[data-fx~="' + cls + '"]' + pseudo + '{' + decls + '}\n';
}

css += `
/* --- the canvas host supplied this reset; a standalone page must carry its own.
       Several toggled elements set display inline, which otherwise beats [hidden]. --- */
[hidden]{display:none!important}

/* --- capability accordion: hover state that was JS in the canvas --- */
[data-cap]{background:transparent;box-shadow:inset 0 0 0 var(--accent)}
[data-cap]:hover,[data-cap]:focus-within{background:var(--bg-2);box-shadow:inset 2px 0 0 var(--accent)}
[data-cap-num]{color:var(--ink-2)}
[data-cap]:hover [data-cap-num],[data-cap]:focus-within [data-cap-num]{color:var(--accent)}
[data-cap-title]{transform:translateX(0)}
[data-cap]:hover [data-cap-title],[data-cap]:focus-within [data-cap-title]{transform:translateX(6px)}
[data-cap-arrow]{opacity:0;transform:translateX(-6px)}
[data-cap]:hover [data-cap-arrow],[data-cap]:focus-within [data-cap-arrow]{opacity:1;transform:translateX(0)}
[data-cap-panel]{opacity:0;grid-template-rows:0fr}
[data-cap]:hover [data-cap-panel],[data-cap]:focus-within [data-cap-panel]{opacity:1;grid-template-rows:1fr}

/* --- reveal-on-scroll: hidden only when the script can run --- */
.js [data-reveal]:not(.is-in){opacity:0;transform:translateY(18px)}
[data-reveal]{transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion: reduce){
  .js [data-reveal]:not(.is-in){opacity:1;transform:none}
}
`;

/* ------------------------------------------------------------------ *
 * 8. Emit.
 * ------------------------------------------------------------------ */

const meta = helmet
  .replace(/<style>[\s\S]*<\/style>/, '')
  .replace(/<script src="\.\/(image-slot|video-slot)\.js"><\/script>/g, '')
  .trim();

const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer</title>
${meta}
<link rel="stylesheet" href="./assets/styles.css">
</head>
<body data-theme="light">
${headerHtml}
${routeHtml}
${footerHtml}
<script src="./assets/image-slot.js"></script>
<script src="./assets/video-slot.js"></script>
<script src="./assets/app.js"></script>
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);
fs.writeFileSync(path.join(OUT, 'assets', 'styles.css'), css);

for (const f of ['image-slot.js', 'video-slot.js', 'app.js']) {
  const from = fs.existsSync(path.join(ROOT, 'design', f)) ? path.join(ROOT, 'design', f) : path.join(ROOT, 'src', f);
  fs.copyFileSync(from, path.join(OUT, 'assets', f));
}

// image-slot.js reads its sidecar relative to the document, so it sits beside index.html.
fs.copyFileSync(path.join(ROOT, 'design', '.image-slots.state.json'), path.join(OUT, '.image-slots.state.json'));

fs.cpSync(path.join(ROOT, 'design', 'uploads'), path.join(OUT, 'uploads'), { recursive: true });
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log('built ' + routes.length + ' routes -> docs/');
console.log('  routes: ' + routes.join(', '));
console.log('  hover rules: ' + hoverRules.size);
console.log('  html: ' + (page.length / 1024).toFixed(1) + 'KB, css: ' + (css.length / 1024).toFixed(1) + 'KB');
