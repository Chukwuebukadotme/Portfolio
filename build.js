#!/usr/bin/env node
/**
 * Builds the static site from the Claude Design source in design/.
 *
 * `Portfolio v2.dc.html` is a design-canvas document. Its markup is a small template
 * DSL — {{ bindings }}, <sc-if>, <sc-for>, style-hover — plus <x-import> tags that pull
 * React components out of the bound design system's bundle. The canvas renders all of
 * that through React and dc-runtime/support.js.
 *
 * Shipping that runtime on a public site would mean React plus a 220KB component bundle
 * to draw markup that never changes after load. So this script resolves it ahead of time:
 *
 *   - every route is rendered to static HTML at build time
 *   - each <x-import> component is expanded to the exact markup its JSX produces
 *   - React state that only drove styling (hover, focus, press) becomes CSS
 *   - what is genuinely interactive becomes a data-* hook that src/app.js drives
 *
 * The design system's own token stylesheets are copied verbatim and linked, so colour,
 * type, spacing, material and motion still come from the system rather than from here.
 *
 *   node build.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DESIGN = path.join(ROOT, 'design');
const SRC = path.join(DESIGN, 'Portfolio v2.dc.html');
const OUT = path.join(ROOT, 'docs');

// The design system is staged flat at design/_ds (styles.css + tokens/ + assets/).
// material.css reaches its textures with url("../assets/textures/...") relative to
// tokens/, so this layout has to be preserved verbatim in the output.
const DS_REL = '_ds';

const src = fs.readFileSync(SRC, 'utf8');
const icons = JSON.parse(fs.readFileSync(path.join(DESIGN, 'icons.json'), 'utf8'));

/* ------------------------------------------------------------------ *
 * 1. Pull the parts we need out of the design document.
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
const pageCss = slice(helmet, /<style>/, '</style>');

const dcInner = slice(src, /<x-dc>/, '</x-dc>');
let template = dcInner.slice(dcInner.indexOf('</helmet>') + '</helmet>'.length);

const scriptBody = slice(src, /<script type="text\/x-dc"[^>]*>/, '</script>');
const dataSource = scriptBody.slice(0, scriptBody.indexOf('class Component'));
const data = new Function(
  dataSource + '\nreturn { RESUME_URL, EMAIL, LINKEDIN, GITHUB, CALCOM, WORDS, ENQUIRY_OPTIONS, CASES };'
)();

/* ------------------------------------------------------------------ *
 * 2. Tag matching.
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
    if (o && o.index < c.index) { depth++; i = o.index + 1; }
    else {
      depth--;
      if (depth === 0) return { start: c.index, end: c.index + c[0].length };
      i = c.index + 1;
    }
  }
  throw new Error('unclosed <' + tag + '>');
}

function parseAttrs(s) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:="([^"]*)")?/g;
  let m;
  while ((m = re.exec(s))) {
    if (!m[1]) continue;
    out[m[1]] = m[2] === undefined ? '' : m[2];
  }
  return out;
}

// `{{ false }}` / `{{ true }}` / `{{ 20 }}` are literal props written in binding syntax.
function literal(v) {
  if (v === undefined) return undefined;
  const m = /^\{\{\s*(.*?)\s*\}\}$/.exec(v);
  if (!m) return v;
  const t = m[1];
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return v; // a real binding — leave it for the interpolation pass
}

function attrsToHtml(attrs, skip) {
  return Object.keys(attrs)
    .filter(k => !skip.has(k) && attrs[k] !== '')
    .map(k => ' ' + k + '="' + attrs[k] + '"')
    .join('');
}

/* ------------------------------------------------------------------ *
 * 3. Design-system components, expanded to the markup their JSX emits.
 *
 * Each mirrors components/<path>.jsx in the bundle. Interaction that the JSX
 * carried in React state (hover, press, focus) is dropped here and reproduced
 * in CSS below, so the markup can be static.
 * ------------------------------------------------------------------ */

const S = {
  // components/actions/Button.jsx
  button(a, children) {
    const variant = a.style === 'secondary' ? 'secondary' : 'primary';
    const isLink = a.href !== undefined || a.as === 'a';
    const tag = isLink ? 'a' : 'button';
    const ring = variant === 'primary' ? 'var(--text-primary)' : 'var(--border-strong)';
    const bg = variant === 'primary' ? 'var(--text-primary)' : 'transparent';
    const fg = variant === 'primary' ? 'var(--text-inverse)' : 'var(--text-primary)';

    const style = [
      'display:inline-flex', 'align-items:center', 'justify-content:center',
      'gap:var(--space-8)', 'height:48px', 'padding:12px 24px', 'box-sizing:border-box',
      'border-radius:var(--radius-8)', 'border:none',
      'background:' + bg, 'color:' + fg,
      'font-family:var(--font-text)', 'font-size:var(--size-text-regular)',
      'font-weight:var(--weight-regular)', 'line-height:var(--leading-body)',
      'letter-spacing:var(--track-body)', 'text-decoration:none',
      'box-shadow:0 0 0 var(--stroke-border) ' + ring,
      'cursor:pointer', '-webkit-tap-highlight-color:transparent'
    ].join(';');

    const cls = ('ds-btn ds-btn-' + variant + ' ' + (a.class || '')).trim();
    const rest = attrsToHtml(a, new Set(['style', 'as', 'class', 'component-from-global-scope', 'hint-size', 'onClick', 'data-comment-anchor']));
    const hook = a.onClick === '{{ scrollWork }}' ? ' data-scroll-work' : '';

    return '<' + tag + ' class="' + cls + '" style="' + style + '"' + rest + hook + '>' +
      '<span style="white-space:nowrap">' + children + '</span></' + tag + '>';
  },

  // components/display/Tag.jsx
  tag(a, children) {
    const style = [
      'display:inline-flex', 'align-items:center', 'gap:0', 'padding:4px 8px',
      'box-sizing:border-box', 'border-radius:var(--radius-none)',
      'background:var(--n-lightest)', 'color:var(--text-primary)',
      'font-family:var(--font-text)', 'font-size:var(--size-text-small)',
      'font-weight:var(--weight-semibold)', 'line-height:var(--leading-body)',
      'letter-spacing:var(--track-body)', 'white-space:nowrap'
    ].join(';');
    return '<span class="ds-tag" style="' + style + '"><span>' + children + '</span></span>';
  },

  // components/icons/Icon.jsx — inlined from the bundle's icon-data.
  icon(name, size, style) {
    const d = icons[name];
    if (!d) throw new Error('icon not bundled: ' + name);
    return '<svg width="' + size + '" height="' + size + '" viewBox="' + d.viewBox +
      '" fill="none"' + (style ? ' style="' + style + '"' : '') + ' aria-hidden="true">' +
      d.body + '</svg>';
  },

  // components/material/GlassPanel.jsx — four physical layers over the content.
  glassPanel(a, children) {
    const radius = a.radius || 'var(--radius-8)';
    const blur = a.thickness === 'thin' ? 'var(--glass-blur-light)'
      : a.thickness === 'heavy' ? 'var(--glass-blur-heavy)' : 'var(--glass-blur)';
    const body = a.thickness === 'thin' ? 'var(--glass-body-thin)'
      : a.tone === 'cool' ? 'var(--glass-body-cool)' : 'var(--glass-body)';
    const refract = literal(a.refract) !== false;

    const filter = 'blur(' + blur + ') saturate(var(--glass-saturate)) brightness(var(--glass-brightness))';
    const style = [
      'position:relative', 'isolation:isolate', 'overflow:hidden',
      'border-radius:' + radius, 'background:' + body,
      'backdrop-filter:' + filter, '-webkit-backdrop-filter:' + filter,
      'box-shadow:var(--glass-inner),var(--glass-shadow)',
      'transition:box-shadow var(--dur-slow) var(--ease-glass)'
    ].join(';') + (a.style ? ';' + a.style : '');

    const rest = attrsToHtml(a, new Set(['style', 'thickness', 'tone', 'radius', 'refract', 'component-from-global-scope', 'hint-size']));

    // Default pointer position from the JSX is {x:.32,y:.14} -> translate3d(-1.08%,-2.16%,0).
    return '<div class="ds-glass" style="' + style + '"' + rest + '>' +
      '<span aria-hidden="true" style="position:absolute;inset:0;z-index:0;pointer-events:none;background:var(--glass-caustic)"></span>' +
      '<span aria-hidden="true"' + (refract ? ' data-glass-specular' : '') +
        ' style="position:absolute;inset:-20%;z-index:0;pointer-events:none;background:var(--glass-specular);' +
        'transform:translate3d(-1.08%,-2.16%,0);transition:transform var(--dur-slow) var(--ease-glass);' +
        'mix-blend-mode:screen;opacity:.9"></span>' +
      '<span aria-hidden="true" style="position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:' + radius +
        ';box-shadow:inset 1px 0 0 0 var(--glass-rim-side),inset -1px 0 0 0 var(--glass-rim-side)"></span>' +
      '<span style="position:relative;z-index:1;display:block">' + children + '</span>' +
      '</div>';
  },

  // components/forms/TextInput.jsx
  textInput(a) {
    const wrap = [
      'display:flex', 'align-items:center', 'gap:var(--space-8)', 'height:48px',
      'padding:12px', 'box-sizing:border-box', 'width:100%',
      'border-radius:var(--radius-8)', 'background:transparent',
      'box-shadow:0 0 0 var(--stroke-border) var(--border-strong)',
      'color:var(--text-primary)',
      'transition:box-shadow var(--dur-fast) var(--ease-glass)'
    ].join(';');
    const input = [
      'flex:1', 'min-width:0', 'border:none', 'outline:none', 'background:transparent',
      'color:var(--text-primary)', 'font-family:var(--font-text)',
      'font-size:var(--size-text-regular)', 'line-height:var(--leading-body)',
      'letter-spacing:var(--track-body)'
    ].join(';');
    const type = a.inputType || 'text';
    const pass = attrsToHtml(a, new Set(['inputType', 'required', 'component-from-global-scope', 'hint-size', 'style']));
    const req = literal(a.required) === true ? ' required' : '';
    return '<div class="ds-field" style="' + wrap + '">' +
      '<input type="' + type + '"' + pass + req + ' style="' + input + '"></div>';
  },

  // components/forms/TextArea.jsx
  textArea(a) {
    const style = [
      'width:100%', 'box-sizing:border-box', 'padding:12px', 'resize:vertical',
      'border-radius:var(--radius-8)', 'border:none', 'outline:none',
      'background:transparent',
      'box-shadow:0 0 0 var(--stroke-border) var(--border-strong)',
      'color:var(--text-primary)', 'font-family:var(--font-text)',
      'font-size:var(--size-text-regular)', 'line-height:var(--leading-body)',
      'transition:box-shadow var(--dur-fast) var(--ease-glass)'
    ].join(';');
    const req = literal(a.required) === true ? ' required' : '';
    const rows = literal(a.rows) || 5;
    const pass = attrsToHtml(a, new Set(['rows', 'required', 'component-from-global-scope', 'hint-size', 'style']));
    return '<textarea class="ds-field-el" rows="' + rows + '"' + pass + req + ' style="' + style + '"></textarea>';
  },

  // components/forms/Select.jsx
  select(a, options) {
    const sel = [
      'appearance:none', '-webkit-appearance:none', 'width:100%', 'height:48px',
      'box-sizing:border-box', 'padding:12px 44px 12px 12px',
      'border-radius:var(--radius-8)', 'border:none', 'outline:none',
      'background:transparent', 'color:rgba(14,23,42,0.6)',
      'box-shadow:0 0 0 var(--stroke-border) var(--border-strong)',
      'font-family:var(--font-text)', 'font-size:var(--size-text-regular)',
      'line-height:var(--leading-body)', 'cursor:pointer',
      'transition:box-shadow var(--dur-fast) var(--ease-glass)'
    ].join(';');
    const req = literal(a.required) === true ? ' required' : '';
    const pass = attrsToHtml(a, new Set(['required', 'options', 'value', 'onChange', 'placeholder', 'component-from-global-scope', 'hint-size', 'style']));
    const opts = ['<option value="">' + esc(a.placeholder || 'Select one...') + '</option>']
      .concat(options.map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>')).join('');
    const hook = a.onChange === '{{ setType }}' ? ' data-type-select' : '';
    const chevron = S.icon('KeyboardArrowDown', 24,
      'position:absolute;right:12px;top:12px;pointer-events:none;color:var(--text-primary)');
    return '<div class="ds-field-el" style="position:relative;width:100%">' +
      '<select' + pass + req + hook + ' style="' + sel + '">' + opts + '</select>' +
      chevron + '</div>';
  }
};

/* ------------------------------------------------------------------ *
 * 4. Expand every <x-import>, innermost first.
 * ------------------------------------------------------------------ */

function expandImports(html) {
  const open = /<x-import((?:[^>"]|"[^"]*")*)>/;
  let m;
  while ((m = open.exec(html))) {
    const attrs = parseAttrs(m[1]);
    const close = findClose(html, m.index + m[0].length, 'x-import');
    const inner = expandImports(html.slice(m.index + m[0].length, close.start));

    const ref = attrs['component-from-global-scope'] || '';
    const name = ref.split('.').pop();
    let out;

    switch (name) {
      case 'Button': out = S.button(attrs, inner); break;
      case 'Tag': out = S.tag(attrs, inner); break;
      case 'GlassPanel': out = S.glassPanel(attrs, inner); break;
      case 'TextInput': out = S.textInput(attrs); break;
      case 'TextArea': out = S.textArea(attrs); break;
      case 'Select': out = S.select(attrs, data.ENQUIRY_OPTIONS); break;
      case 'Icon':
        // The only Icon in the page is the theme toggle's, which swaps with the theme.
        // Emit both and let the script show the right one.
        out = '<span data-theme-icon style="display:inline-flex">' +
          '<span data-icon-light>' + S.icon('DarkMode', literal(attrs.size) || 20) + '</span>' +
          '<span data-icon-dark hidden>' + S.icon('LightMode', literal(attrs.size) || 20) + '</span>' +
          '</span>';
        break;
      case 'glass-ribbon': {
        const pass = attrsToHtml(attrs, new Set(['component-from-global-scope', 'from', 'hint-size', 'theme']));
        out = '<glass-ribbon theme="light"' + pass + '></glass-ribbon>';
        break;
      }
      default:
        throw new Error('unhandled x-import component: ' + ref);
    }
    html = html.slice(0, m.index) + out + html.slice(close.end);
  }
  return html;
}

/* ------------------------------------------------------------------ *
 * 5. Pre-passes over the template.
 * ------------------------------------------------------------------ */

template = template.replace(/<template id="__bundler_thumbnail">[\s\S]*?<\/template>/g, '');
template = template.replace(/ hint-placeholder-(val|count)="[^"]*"/g, '');
template = template.replace(/ data-comment-anchor="[^"]*"/g, '');

template = expandImports(template);

// State-driven <sc-if> blocks become always-emitted, script-toggled containers.
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
  const child = /^\s*<([a-z-]+)((?:[^>"]|"[^"]*")*)>([\s\S]*)<\/\1>\s*$/.exec(inner);
  const replacement = child
    ? '<' + child[1] + ' ' + t.hook + ' hidden' + child[2] + '>' + child[3] + '</' + child[1] + '>'
    : '<div ' + t.hook + ' hidden>' + inner + '</div>';
  template = template.slice(0, m.index) + replacement + template.slice(close.end);
}

// The capability rows and the discipline cards each carried their hover state in
// interpolated inline styles driven by React. Strip those declarations and mark each
// element with a role, so plain CSS (:hover / :focus-within) can drive them instead.
//
// Roles are matched most-specific first: an element carrying the row's own background
// is the row; the rest are its parts. The container is whichever element owns the
// mouse handlers.
const HOVER_FAMILIES = [
  {
    prefix: 'cap',
    container: 'data-cap',
    parts: [
      [/capRows\d/, 'data-cap-panel'],
      [/capArrow\d/, 'data-cap-arrow'],
      [/capNum\d/, 'data-cap-num'],
      [/capX\d/, 'data-cap-title'],
      [/capOp\d/, 'data-cap-arrow']
    ]
  },
  {
    prefix: 'disc',
    container: 'data-disc',
    parts: [
      [/discRule\d/, 'data-disc-rule'],
      [/discArrow\d/, 'data-disc-arrow'],
      [/discLabel\d/, 'data-disc-label'],
      [/discX\d/, 'data-disc-title'],
      [/discOp\d/, 'data-disc-arrow']
    ]
  }
];

for (const fam of HOVER_FAMILIES) {
  const token = new RegExp('\\{\\{ ' + fam.prefix + '\\w*');
  template = template.replace(/<([a-z][a-z0-9-]*)((?:[^>"]|"[^"]*")*?)>/gi, (tag, name, attrs) => {
    if (!token.test(attrs)) return tag;

    let role = null;
    let out = attrs.replace(/style="([^"]*)"/, (_m, styleVal) => {
      const kept = styleVal.split(';').filter(decl => {
        if (!token.test(decl)) return true;
        if (!role) for (const [re, r] of fam.parts) if (re.test(decl)) { role = r; break; }
        return false;
      }).join(';');
      return kept.trim() ? 'style="' + kept + '"' : '';
    });

    for (const [re, r] of fam.parts) if (re.test(attrs)) { role = r; break; }
    if (/onMouseEnter/.test(attrs)) role = fam.container;

    out = out.replace(/ on(MouseEnter|MouseLeave)="\{\{ [^}]*\}\}"/g, '');
    return '<' + name + (role ? ' ' + role : '') + out + '>';
  });
}

// style-hover / style-focus become real CSS rules.
const hoverRules = new Map();
template = template.replace(/ style-(hover|focus)="([^"]*)"/g, (_m, kind, decls) => {
  const key = kind + '|' + decls;
  if (!hoverRules.has(key)) hoverRules.set(key, 'x' + hoverRules.size.toString(36));
  return ' data-fx="' + hoverRules.get(key) + '"';
});
template = template.replace(/ data-fx="([^"]*)" data-fx="([^"]*)"/g, ' data-fx="$1 $2"');

// Handlers become declarative hooks; hash hrefs already do the navigation.
template = template
  .replace(/ onClick="\{\{ scrollWork \}\}"/g, ' data-scroll-work')
  .replace(/ onClick="\{\{ toggleTheme \}\}"/g, ' data-theme-toggle')
  .replace(/ onClick="\{\{ toggleMenu \}\}"/g, ' data-menu-toggle')
  .replace(/ onSubmit="\{\{ onSubmit \}\}"/g, ' data-contact-form')
  .replace(/ onChange="\{\{ setType \}\}"/g, ' data-type-select')
  .replace(/ onClick="\{\{ go[A-Za-z]* \}\}"/g, '')
  .replace(/ onClick="\{\{ c\.onClick \}\}"/g, '');

// Theme-dependent values: bake the light defaults, hook them for the script.
template = template
  .replace(/aria-pressed="\{\{ isLight \}\}"/g, 'aria-pressed="true"')
  .replace(/title="\{\{ themeTitle \}\}"/g, 'title="Switch to dark mode"')
  .replace(/\{\{ themeLabel \}\}/g, '<span data-theme-text>Dark</span>')
  .replace(/\{\{ menuLabel \}\}/g, '<span data-menu-label>Menu</span>')
  .replace(/aria-expanded="\{\{ menuOpen \}\}"/g, 'aria-expanded="false"')
  .replace(/\{\{ year \}\}/g, '<span data-year>{{ year }}</span>');

template = template.replace(
  /\{\{ rotEl \}\}/g,
  '<span data-rot style="display:inline-block;color:var(--text-accent)">' + esc(data.WORDS[0]) + '</span>'
);

/* ------------------------------------------------------------------ *
 * 6. Renderer.
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
      for (const item of lookup(ctx, list[1]) || []) {
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
 * 7. Per-route context, mirroring renderVals().
 * ------------------------------------------------------------------ */

const { CASES, RESUME_URL, EMAIL, LINKEDIN, GITHUB, CALCOM } = data;

function baseCtx(route) {
  const csIndex = CASES.findIndex(c => route === '/work/' + c.slug);
  const cs = csIndex > -1 ? CASES[csIndex] : null;
  const next = cs ? CASES[(csIndex + 1) % CASES.length] : null;
  return {
    resumeUrl: RESUME_URL, email: EMAIL, emailHref: 'mailto:' + EMAIL,
    linkedin: LINKEDIN, github: GITHUB, calcom: CALCOM,
    theme: 'light',
    cWork: route.indexOf('/work') === 0 ? 'var(--text-primary)' : 'var(--text-tertiary)',
    cAbout: route === '/about' ? 'var(--text-primary)' : 'var(--text-tertiary)',
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
    enquiryOptions: data.ENQUIRY_OPTIONS,
    year: new Date().getFullYear()
  };
}

const routes = ['/', '/work', '/about', '/contact'].concat(CASES.map(c => '/work/' + c.slug));

/* ------------------------------------------------------------------ *
 * 8. Chrome + routed body.
 * ------------------------------------------------------------------ */

const mainOpen = template.indexOf('<main id="main">');
const mainClose = template.lastIndexOf('</main>');
if (mainOpen === -1 || mainClose === -1) throw new Error('cannot locate <main>');

const chromeTop = template.slice(0, mainOpen + '<main id="main">'.length);
const mainBody = template.slice(mainOpen + '<main id="main">'.length, mainClose);
const chromeBottom = template.slice(mainClose);

const homeCtx = baseCtx('/');
const headerHtml = render(chromeTop, homeCtx);
const footerHtml = render(chromeBottom, homeCtx);

const routeHtml = routes.map(route => {
  const html = render(mainBody, baseCtx(route)).trim();
  return '<div data-route="' + route + '"' + (route === '/' ? '' : ' hidden') + '>\n' + html + '\n</div>';
}).join('\n');

/* ------------------------------------------------------------------ *
 * 9. Stylesheet.
 * ------------------------------------------------------------------ */

let css = pageCss.trim() + '\n\n/* --- generated from style-hover / style-focus --- */\n';
for (const [key, cls] of hoverRules) {
  const [kind, decls] = key.split(/\|(.*)/s);
  css += '[data-fx~="' + cls + '"]' + (kind === 'hover' ? ':hover' : ':focus') + '{' + decls + '}\n';
}

css += `
/* --- the canvas host supplied this reset; a standalone page carries its own --- */
[hidden]{display:none!important}

/* --- design-system interaction that was React state in the bundle --- */
.ds-btn-primary:hover{box-shadow:0 0 0 var(--stroke-border) var(--text-primary),inset 0 -1px 0 0 var(--glass-rim-bottom)}
.ds-btn-secondary:hover{background:var(--state-hover);box-shadow:0 0 0 var(--stroke-border) var(--border-strong),inset 0 -1px 0 0 var(--glass-rim-bottom)}
.ds-btn:active{transform:translateY(0) scale(var(--press-scale))}
.ds-field:focus-within{box-shadow:0 0 0 var(--stroke-border) var(--border-accent),inset 0 -1px 0 0 var(--glass-rim-bottom)}
.ds-field-el:focus,.ds-field-el select:focus,textarea.ds-field-el:focus{box-shadow:0 0 0 var(--stroke-border) var(--border-accent),inset 0 -1px 0 0 var(--glass-rim-bottom)}
.ds-field input::placeholder,textarea.ds-field-el::placeholder{color:rgba(14,23,42,.6)}
:root[data-theme="dark"] .ds-field input::placeholder,
:root[data-theme="dark"] textarea.ds-field-el::placeholder{color:rgba(255,255,255,.65)}
:root[data-theme="dark"] .ds-field-el select{color:rgba(255,255,255,.65)}
.ds-field-el select:valid{color:var(--text-primary)}

/* --- capability / discipline rows: hover that the canvas drove from JS --- */
[data-cap]{background:transparent;box-shadow:inset 0 0 0 var(--accent-signal)}
[data-cap]:hover,[data-cap]:focus-within{background:var(--state-hover);box-shadow:inset 2px 0 0 var(--accent-signal)}
[data-cap-num]{color:var(--text-tertiary)}
[data-cap]:hover [data-cap-num],[data-cap]:focus-within [data-cap-num]{color:var(--text-accent)}
[data-cap-title]{transform:translateX(0)}
[data-cap]:hover [data-cap-title],[data-cap]:focus-within [data-cap-title]{transform:translateX(6px)}
[data-cap-arrow]{opacity:0;transform:translateX(-6px)}
[data-cap]:hover [data-cap-arrow],[data-cap]:focus-within [data-cap-arrow]{opacity:1;transform:translateX(0)}
[data-cap-panel]{opacity:0;grid-template-rows:0fr}
[data-cap]:hover [data-cap-panel],[data-cap]:focus-within [data-cap-panel]{opacity:1;grid-template-rows:1fr}

/* --- discipline cards: a cyan top edge, label to accent, 6px nudge --- */
[data-disc]{background:var(--surface-page)}
[data-disc]:hover,[data-disc]:focus-within{background:var(--state-hover)}
[data-disc-rule]{transform:scaleX(0)}
[data-disc]:hover [data-disc-rule],[data-disc]:focus-within [data-disc-rule]{transform:scaleX(1)}
[data-disc-label]{color:var(--text-tertiary)}
[data-disc]:hover [data-disc-label],[data-disc]:focus-within [data-disc-label]{color:var(--text-accent)}
[data-disc-title]{transform:translateX(0)}
[data-disc]:hover [data-disc-title],[data-disc]:focus-within [data-disc-title]{transform:translateX(6px)}
[data-disc-arrow]{opacity:0;transform:translateX(-6px)}
[data-disc]:hover [data-disc-arrow],[data-disc]:focus-within [data-disc-arrow]{opacity:1;transform:translateX(0)}

/* --- reveal on scroll, only when the script can run --- */
.js [data-reveal]:not(.is-in){opacity:0;transform:translateY(18px)}
[data-reveal]{transition:opacity var(--dur-ambient) var(--ease-glass),transform var(--dur-ambient) var(--ease-glass)}
@media (prefers-reduced-motion: reduce){.js [data-reveal]:not(.is-in){opacity:1;transform:none}}
`;

/* ------------------------------------------------------------------ *
 * 10. Emit.
 * ------------------------------------------------------------------ */

const meta = helmet
  .replace(/<style>[\s\S]*<\/style>/, '')
  .replace(/<script[^>]*><\/script>/g, '')
  .replace(/<link rel="stylesheet"[^>]*>/g, '')
  .trim();

const page = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer</title>
<meta name="description" content="Chukwuebuka Onyemelukwe — Design Engineer × AI Engineer based in the United Kingdom. Product engineering, product design, AI engineering and web engineering.">
${meta}
<link rel="stylesheet" href="./${DS_REL}/styles.css">
<link rel="stylesheet" href="./assets/styles.css">
</head>
<body>
${headerHtml}
${routeHtml}
${footerHtml}
<script src="./assets/glass-ribbon.js"></script>
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

for (const f of ['image-slot.js', 'video-slot.js', 'glass-ribbon.js']) {
  fs.copyFileSync(path.join(DESIGN, f), path.join(OUT, 'assets', f));
}
fs.copyFileSync(path.join(ROOT, 'src', 'app.js'), path.join(OUT, 'assets', 'app.js'));

// The design system ships as-is so tokens stay its responsibility, not ours.
fs.cpSync(path.join(DESIGN, '_ds'), path.join(OUT, '_ds'), { recursive: true });

// glass-ribbon resolves its textures relative to the document.
fs.cpSync(path.join(DESIGN, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.cpSync(path.join(DESIGN, 'uploads'), path.join(OUT, 'uploads'), { recursive: true });
fs.copyFileSync(path.join(DESIGN, '.image-slots.state.json'), path.join(OUT, '.image-slots.state.json'));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log('built ' + routes.length + ' routes -> docs/');
console.log('  routes: ' + routes.join(', '));
console.log('  hover rules: ' + hoverRules.size);
console.log('  html ' + (page.length / 1024).toFixed(1) + 'KB, css ' + (css.length / 1024).toFixed(1) + 'KB');
