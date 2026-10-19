"""Generate Cobalt Light foundations and validate the canonical token set.

Run with Python 3.10+. No dependencies are required for this generator.
The JSON format is a deliberately simple project format, not a DTCG export.

Outputs foundations.css beside this file and, inside the portfolio repo,
src/styles/cobalt-light.css: the Tailwind v4 entry the site actually imports.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent

INITIAL_TOKENS = {
    "$metadata": {"name": "Cobalt Light", "version": "1.0.0", "date": "2026-10-19", "owner": "Chukwuebuka Onyemelukwe", "format": "Project-specific semantic tokens; not a DTCG interchange file", "appearance": "light with local inverse surfaces"},
    "color": {
        "bg": {"canvas": "#F5F7FB", "surface": "#FFFFFF", "subtle": "#E8EDF7", "inverse": "#141820"},
        "text": {"primary": "#141820", "secondary": "#475467", "muted": "#596579", "inverse": "#F5F7FB", "inverseSecondary": "#B8C6DD"},
        "brand": {"default": "#0041D9", "hover": "#0038BA", "active": "#002E9B", "soft": "#DBE4FA", "on": "#FFFFFF", "inverse": "#A9C1FF"},
        "border": {"default": "#B8C6DD", "subtle": "#DCE3ED", "control": "#7D8BA0"},
        "focus": "#0041D9",
        "status": {"info": "#0041D9", "infoBg": "#E8EDF7", "success": "#16754A", "successBg": "#E9F6EF", "warning": "#8A4B08", "warningBg": "#FFF4DB", "error": "#B42318", "errorBg": "#FFF0EE"},
        "chart": {"selected": "#0041D9", "comparison": "#475467", "teal": "#0D766E", "purple": "#6941C6", "orange": "#B54708", "magenta": "#B42369", "cyan": "#087E8B", "olive": "#54772B"},
        "overlay": "rgba(20, 24, 32, 0.48)",
        "header": "rgba(255, 255, 255, 0.94)"
    },
    "font": {
        "display": ["Space Grotesk", "Arial", "sans-serif"],
        "body": ["Inter", "Arial", "sans-serif"],
        "code": ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"]
    },
    "type": {
        "display": {"min": 44, "max": 88, "lineHeight": 1.02, "tracking": "-0.04em", "weight": 500, "family": "display"},
        "page": {"min": 36, "max": 64, "lineHeight": 1.08, "tracking": "-0.035em", "weight": 500, "family": "display"},
        "section": {"min": 30, "max": 48, "lineHeight": 1.12, "tracking": "-0.03em", "weight": 500, "family": "display"},
        "project": {"min": 26, "max": 36, "lineHeight": 1.18, "tracking": "-0.025em", "weight": 500, "family": "display"},
        "subheading": {"min": 22, "max": 26, "lineHeight": 1.25, "tracking": "-0.02em", "weight": 500, "family": "display"},
        "lead": {"min": 18, "max": 22, "lineHeight": 1.55, "tracking": "-0.01em", "weight": 400, "family": "body"},
        "body": {"min": 16, "max": 18, "lineHeight": 1.65, "tracking": "0", "weight": 400, "family": "body"},
        "ui": {"min": 14, "max": 14, "lineHeight": 1.4, "tracking": "0", "weight": 500, "family": "body"},
        "caption": {"min": 13, "max": 14, "lineHeight": 1.5, "tracking": "0", "weight": 400, "family": "body"},
        "eyebrow": {"min": 12, "max": 12, "lineHeight": 1.5, "tracking": "0.08em", "weight": 500, "family": "body"},
        "code": {"min": 13, "max": 14, "lineHeight": 1.6, "tracking": "0", "weight": 400, "family": "code"}
    },
    "space": {str(n): n for n in [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160]},
    "radius": {"control": 4, "field": 6, "media": 8, "card": 12, "dialog": 16, "pill": 999},
    "shadow": {"subtle": "0 2px 8px rgba(20,24,32,.06)", "raised": "0 8px 24px rgba(20,24,32,.08)", "overlay": "0 20px 64px rgba(20,24,32,.16)"},
    "breakpoint": {"sm": 480, "md": 768, "lg": 1024, "xl": 1440, "xxl": 1920},
    "layout": {"contentMax": 1200, "wideMediaMax": 1440, "proseMax": "68ch", "gutterSmall": 20, "gutterMedium": 32, "gutterLarge": 48, "gapSmall": 16, "gapLarge": 24, "sectionSmall": 64, "sectionMedium": 80, "sectionLarge": 120, "projectGapSmall": 48, "projectGapMedium": 64, "projectGapLarge": 96, "headerSmall": 56, "headerLarge": 64, "headerOffsetSmall": 12, "headerOffsetLarge": 16, "anchorSmall": 96, "anchorLarge": 112},
    "control": {"target": 44, "smallVisual": 36, "large": 48, "iconSmall": 16, "iconDefault": 20, "iconLarge": 24, "iconStroke": 1.75, "focusWidth": 2, "focusOffset": 3},
    "motion": {"duration": {"instant": 0, "micro": 120, "feedback": 160, "standard": 240, "enter": 360, "layout": 480, "hero": 800}, "ease": {"standard": "cubic-bezier(0.2,0,0,1)", "enter": "cubic-bezier(0.16,1,0.3,1)", "exit": "cubic-bezier(0.4,0,1,1)", "linear": "linear"}, "distance": {"arrow": 2, "lift": 4, "panel": 16, "parallax": 12}, "scale": {"press": 0.98, "mediaHover": 1.015}, "stagger": {"step": 40, "max": 240}, "limits": {"sharedTransitionMax": 600, "pinnedExtraViewportMax": 1, "reducedFeedbackMax": 100}},
    "z": {"base": 0, "sticky": 20, "header": 40, "popover": 60, "modalBackdrop": 80, "modal": 90, "notification": 100}
}

def kebab(s):
    return re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", str(s)).lower()

def flatten(d, path=()):
    for k, v in d.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict):
            yield from flatten(v, path + (k,))
        else:
            yield path + (k,), v

def number(n):
    return f"{n:.6f}".rstrip("0").rstrip(".") if isinstance(n, float) else str(n)

def fluid(minimum, maximum):
    if minimum == maximum:
        return f"{number(minimum / 16)}rem"
    # 320px -> 1440px anchors. Rem intercept preserves user text scaling.
    slope = (maximum - minimum) / 1120 * 100
    intercept = minimum - slope * 3.2
    return f"clamp({number(minimum / 16)}rem, {number(intercept / 16)}rem + {number(slope)}vw, {number(maximum / 16)}rem)"

# Families served as downloaded faces. next/font exposes each self-hosted face
# as --font-<family>, so the Tailwind entry puts that variable first and keeps
# the plain family name as its fallback. foundations.css is left unbound.
FACE_FONTS = ("display", "body")

def css_value(path, value, bind_faces=False):
    if path[0] == "font":
        names = [f'"{v}"' if " " in v else v for v in value]
        if bind_faces and path[-1] in FACE_FONTS:
            names[0] = f"var(--font-{value[0].lower().replace(' ', '-')}, {names[0]})"
        return ", ".join(names)
    if isinstance(value, (int, float)):
        if path[0] in ["space", "radius", "breakpoint", "layout"] or path[:2] == ("motion", "distance"):
            return f"{number(value / 16)}rem" if path[0] != "breakpoint" else f"{value}px"
        if path[0] == "control" and path[-1] != "iconStroke":
            return f"{number(value / 16)}rem"
        if path[:2] in [("motion", "duration"), ("motion", "stagger")]:
            return f"{value}ms"
    return str(value)

CSS_BASE = r'''
/* Foundation layer. It does not implement modal, menu, tab or form behaviour. */
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 100%; scroll-padding-top: var(--cl-anchor); }
body { margin: 0; background: var(--cl-color-bg-canvas); color: var(--cl-color-text-primary); font-family: var(--cl-font-body); font-size: var(--cl-type-body-size); line-height: var(--cl-type-body-line-height); }
::selection { background: var(--cl-color-brand-soft); color: var(--cl-color-text-primary); }
img, video { display: block; max-width: 100%; height: auto; }
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea, summary { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: var(--cl-control-focus-width) solid var(--cl-color-focus); outline-offset: var(--cl-control-focus-offset); }
[id] { scroll-margin-top: var(--cl-anchor); }
.cl-container { width: min(calc(100% - 2 * var(--cl-gutter)), var(--cl-layout-content-max)); margin-inline: auto; }
.cl-prose { max-width: var(--cl-layout-prose-max); }
.cl-section { padding-block: var(--cl-section-space); }
.cl-page { padding-top: calc(var(--cl-header-height) + var(--cl-header-offset) + var(--cl-space-24)); }
.cl-grid { display: grid; grid-template-columns: repeat(var(--cl-columns), minmax(0, 1fr)); gap: var(--cl-grid-gap); }
.cl-stack { display: flex; flex-direction: column; gap: var(--cl-space-24); }
.cl-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--cl-space-12); }
.cl-tabular { font-variant-numeric: tabular-nums; }
.cl-muted { color: var(--cl-color-text-muted); }
.cl-sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
.cl-skip { position:fixed; top:var(--cl-space-8); left:var(--cl-space-8); transform:translateY(-200%); z-index:var(--cl-z-notification); padding:var(--cl-space-12); background:var(--cl-color-bg-surface); color:var(--cl-color-brand-default); }
.cl-skip:focus { transform:none; }
.cl-header { position:fixed; top:var(--cl-header-offset); left:50%; transform:translateX(-50%); width:min(calc(100% - 2 * var(--cl-gutter)), var(--cl-layout-content-max)); min-height:var(--cl-header-height); padding-inline:var(--cl-space-20); display:flex; align-items:center; justify-content:space-between; gap:var(--cl-space-24); border:1px solid var(--cl-color-border-default); border-radius:var(--cl-radius-card); background:var(--cl-color-bg-surface); box-shadow:var(--cl-shadow-subtle); z-index:var(--cl-z-header); }
@supports (backdrop-filter: blur(1px)) { .cl-header { background:var(--cl-color-header); backdrop-filter:blur(16px); } }
.cl-button { min-height:var(--cl-control-target); display:inline-flex; justify-content:center; align-items:center; gap:var(--cl-space-8); padding:var(--cl-space-12) var(--cl-space-16); border:1px solid transparent; border-radius:var(--cl-radius-control); font-family:var(--cl-font-body); font-size:var(--cl-type-ui-size); line-height:var(--cl-type-ui-line-height); font-weight:500; text-decoration:none; cursor:pointer; transition:background-color var(--cl-motion-duration-micro) var(--cl-motion-ease-standard), color var(--cl-motion-duration-micro) var(--cl-motion-ease-standard), border-color var(--cl-motion-duration-micro) var(--cl-motion-ease-standard); }
.cl-button--primary { background:var(--cl-color-brand-default); color:var(--cl-color-brand-on); }
.cl-button--secondary { background:var(--cl-color-bg-surface); color:var(--cl-color-text-primary); border-color:var(--cl-color-border-control); }
.cl-button--text { color:var(--cl-color-brand-default); background:transparent; padding-inline:0; }
.cl-button--large { min-height:var(--cl-control-large); padding-inline:var(--cl-space-20); }
.cl-button--primary:active:not(:disabled) { background:var(--cl-color-brand-active); color:var(--cl-color-brand-on); }
.cl-button--secondary:active:not(:disabled) { background:var(--cl-color-brand-soft); color:var(--cl-color-text-primary); }
.cl-button--text:active:not(:disabled) { background:transparent; color:var(--cl-color-brand-active); }
.cl-button:disabled { background:var(--cl-color-bg-subtle); color:var(--cl-color-text-muted); border-color:var(--cl-color-border-default); cursor:not-allowed; }
.cl-button[aria-busy="true"] { cursor:progress; }
.cl-link { color:var(--cl-color-brand-default); text-decoration:underline; text-underline-offset:.2em; text-decoration-thickness:1px; }
.cl-icon { flex:none; width:var(--cl-control-icon-default); height:var(--cl-control-icon-default); stroke-width:var(--cl-control-icon-stroke); }
.cl-icon--small { width:var(--cl-control-icon-small); height:var(--cl-control-icon-small); }
.cl-icon--large { width:var(--cl-control-icon-large); height:var(--cl-control-icon-large); }
.cl-icon--direction { transition:transform var(--cl-motion-duration-standard) var(--cl-motion-ease-standard); }
.cl-button:focus-visible .cl-icon--direction { transform:translate(var(--cl-motion-distance-arrow), calc(-1 * var(--cl-motion-distance-arrow))); }
.cl-field { display:flex; flex-direction:column; gap:var(--cl-space-8); }
.cl-label { font-size:var(--cl-type-ui-size); font-weight:500; }
.cl-input { width:100%; min-height:var(--cl-control-target); padding:var(--cl-space-12); border:1px solid var(--cl-color-border-control); border-radius:var(--cl-radius-field); background:var(--cl-color-bg-surface); color:var(--cl-color-text-primary); font-size:1rem; line-height:1.5; }
.cl-input::placeholder { color:var(--cl-color-text-muted); opacity:1; }
textarea.cl-input { min-height:10rem; resize:vertical; }
.cl-input[aria-invalid="true"] { border-color:var(--cl-color-status-error); }
.cl-help { margin:0; font-size:var(--cl-type-caption-size); color:var(--cl-color-text-secondary); }
.cl-error { margin:0; font-size:var(--cl-type-caption-size); color:var(--cl-color-status-error); }
.cl-filter { min-height:var(--cl-control-target); padding:var(--cl-space-8) var(--cl-space-16); border:1px solid var(--cl-color-border-control); border-radius:var(--cl-radius-pill); background:var(--cl-color-bg-surface); color:var(--cl-color-text-primary); font-size:var(--cl-type-ui-size); cursor:pointer; }
.cl-filter[aria-pressed="true"] { background:var(--cl-color-brand-default); color:var(--cl-color-brand-on); border-color:var(--cl-color-brand-default); }
.cl-tag { display:inline-flex; align-items:center; gap:var(--cl-space-4); padding:var(--cl-space-4) var(--cl-space-8); border-radius:var(--cl-radius-control); font-size:.75rem; line-height:1.5; color:var(--cl-color-text-secondary); background:var(--cl-color-bg-subtle); }
.cl-tag--success { color:var(--cl-color-status-success); background:var(--cl-color-status-success-bg); }
.cl-tag--warning { color:var(--cl-color-status-warning); background:var(--cl-color-status-warning-bg); }
.cl-tag--error { color:var(--cl-color-status-error); background:var(--cl-color-status-error-bg); }
.cl-media { margin:0; overflow:hidden; border:1px solid var(--cl-color-border-default); border-radius:var(--cl-radius-media); background:var(--cl-color-bg-subtle); }
.cl-media img, .cl-media video { width:100%; aspect-ratio:16/10; object-fit:contain; }
.cl-figure { margin:0; }
.cl-figure figcaption { margin-top:var(--cl-space-12); font-size:var(--cl-type-caption-size); line-height:1.5; color:var(--cl-color-text-secondary); }
.cl-project { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--cl-space-24); }
.cl-project-list { display:flex; flex-direction:column; gap:var(--cl-project-gap); }
.cl-table-region { max-width:100%; overflow-x:auto; }
.cl-table { width:100%; border-collapse:collapse; text-align:left; font-size:var(--cl-type-caption-size); }
.cl-table th, .cl-table td { padding:var(--cl-space-12); border-bottom:1px solid var(--cl-color-border-default); vertical-align:top; }
.cl-table th { font-weight:600; }
.cl-inverse { color:var(--cl-color-text-inverse); background:var(--cl-color-bg-inverse); }
.cl-inverse .cl-link { color:var(--cl-color-brand-inverse); }
.cl-inverse .cl-muted { color:var(--cl-color-text-inverse-secondary); }
.cl-inverse :focus-visible { outline-color:var(--cl-color-brand-inverse); }
.cl-inverse .cl-button--primary { background:var(--cl-color-brand-inverse); color:var(--cl-color-bg-inverse); }
.cl-inverse .cl-button--primary:active { background:var(--cl-color-border-default); }
.cl-code { overflow:auto; padding:var(--cl-space-20); border-radius:var(--cl-radius-media); background:var(--cl-color-bg-inverse); color:var(--cl-color-text-inverse); font-family:var(--cl-font-code); font-size:var(--cl-type-code-size); line-height:var(--cl-type-code-line-height); }
@media (hover:hover) and (pointer:fine) {
 .cl-button--primary:hover:not(:disabled):not(:active) { background:var(--cl-color-brand-hover); }
 .cl-button--secondary:hover:not(:disabled):not(:active) { background:var(--cl-color-bg-subtle); }
 .cl-button--text:hover:not(:disabled):not(:active), .cl-link:hover { color:var(--cl-color-brand-hover); }
 .cl-button:hover:not(:disabled) .cl-icon--direction { transform:translate(var(--cl-motion-distance-arrow),calc(-1 * var(--cl-motion-distance-arrow))); }
 .cl-inverse .cl-button--primary:hover:not(:disabled):not(:active) { background:var(--cl-color-bg-surface); color:var(--cl-color-bg-inverse); }
 .cl-inverse .cl-link:hover { color:var(--cl-color-text-inverse); }
}
@media (min-width:48rem) { :root { @@ROOT_MD@@ } }
@media (min-width:64rem) { :root { @@ROOT_LG@@ } .cl-project { grid-template-columns:repeat(12,minmax(0,1fr)); column-gap:var(--cl-grid-gap); align-items:center; } .cl-project__content { grid-column:1 / span 5; } .cl-project__media { grid-column:7 / span 6; } }
@media (prefers-reduced-motion:reduce) {
 html { scroll-behavior:auto; }
 .cl-button, .cl-icon--direction, .cl-motion { animation:none!important; transition:none!important; transform:none!important; }
 /* JavaScript must separately remove pinning, stop render loops and reveal content. */
}
'''

# Responsive layout aliases, shared by foundations.css and the Tailwind entry.
ROOT_MD = "--cl-gutter:var(--cl-layout-gutter-medium); --cl-grid-gap:var(--cl-layout-gap-large); --cl-columns:8; --cl-section-space:var(--cl-layout-section-medium); --cl-header-height:var(--cl-layout-header-large); --cl-header-offset:var(--cl-layout-header-offset-large); --cl-anchor:var(--cl-layout-anchor-large); --cl-project-gap:var(--cl-layout-project-gap-medium);"
ROOT_LG = "--cl-gutter:var(--cl-layout-gutter-large); --cl-columns:12; --cl-section-space:var(--cl-layout-section-large); --cl-project-gap:var(--cl-layout-project-gap-large);"

HEADER = "/* Generated from tokens.json by build_foundations.py. Edit tokens, then regenerate. */"

def media(tokens, key):
    return f"@media (min-width:{number(tokens['breakpoint'][key]/16)}rem)"

def root_vars(tokens, bind_faces=False):
    lines = []
    for path, value in flatten(tokens):
        if path[0] == "type":
            continue
        lines.append(f"  --cl-{'-'.join(map(kebab,path))}: {css_value(path,value,bind_faces)};")
    for name, t in tokens["type"].items():
        lines += [f"  --cl-type-{name}-size: {fluid(t['min'],t['max'])};", f"  --cl-type-{name}-line-height: {t['lineHeight']};", f"  --cl-type-{name}-tracking: {t['tracking']};", f"  --cl-type-{name}-weight: {t['weight']};"]
    lines += ["  --cl-gutter: var(--cl-layout-gutter-small);", "  --cl-grid-gap: var(--cl-layout-gap-small);", "  --cl-columns: 4;", "  --cl-section-space: var(--cl-layout-section-small);", "  --cl-header-height: var(--cl-layout-header-small);", "  --cl-header-offset: var(--cl-layout-header-offset-small);", "  --cl-anchor: var(--cl-layout-anchor-small);", "  --cl-project-gap: var(--cl-layout-project-gap-small);"]
    return lines

def type_rule(name, t):
    return f"font-family:var(--cl-font-{t['family']}); font-size:var(--cl-type-{name}-size); font-weight:var(--cl-type-{name}-weight); line-height:var(--cl-type-{name}-line-height); letter-spacing:var(--cl-type-{name}-tracking);"

def build_css(tokens):
    lines = [HEADER, ":root {", *root_vars(tokens), "}"]
    for name, t in tokens["type"].items():
        lines.append(f".cl-type-{name} {{ {type_rule(name, t)} }}")
    base = CSS_BASE.replace("@media (min-width:48rem)", media(tokens, "md")).replace("@media (min-width:64rem)", media(tokens, "lg")).replace("@@ROOT_MD@@", ROOT_MD).replace("@@ROOT_LG@@", ROOT_LG)
    return "\n".join(lines) + "\n" + base

# The portfolio builds with Tailwind v4, so it takes the same variables through
# a second entry: the foundation rules it needs, the tokens mapped onto
# Tailwind's theme namespaces (defaults cleared, so off-system colours, sizes,
# radii and shadows do not exist), and the spec's foundation classes as
# utilities that accept variants. Written only when the app is present.
TAILWIND_OUT = ROOT.parent.parent / "src" / "styles" / "cobalt-light.css"

TAILWIND_BASE = r'''
@layer base {
  :root { color-scheme: light; }
  html { scroll-padding-top: var(--cl-anchor); }
  body { background: var(--cl-color-bg-canvas); color: var(--cl-color-text-primary); font-family: var(--cl-font-body); font-size: var(--cl-type-body-size); line-height: var(--cl-type-body-line-height); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--cl-color-brand-soft); color: var(--cl-color-text-primary); }
  button, a, input, select, textarea, summary { -webkit-tap-highlight-color: transparent; }
  :focus-visible { outline: var(--cl-control-focus-width) solid var(--cl-color-focus); outline-offset: var(--cl-control-focus-offset); }
  [data-surface="inverse"] :focus-visible { outline-color: var(--cl-color-brand-inverse); }
  [id] { scroll-margin-top: var(--cl-anchor); }
  @media (prefers-reduced-motion:reduce) { html { scroll-behavior: auto; } }
}
@utility cl-container { width: min(calc(100% - 2 * var(--cl-gutter)), var(--cl-layout-content-max)); margin-inline: auto; }
@utility cl-section { padding-block: var(--cl-section-space); }
@utility cl-page { padding-top: calc(var(--cl-header-height) + var(--cl-header-offset) + var(--cl-space-24)); }
'''

def build_tailwind(tokens):
    lines = [HEADER, "/* Tailwind v4 entry. Display and body fonts bind to the self-hosted next/font faces. */", "@layer base {", "  :root {", *("  " + l for l in root_vars(tokens, bind_faces=True)), "  }", f"  {media(tokens, 'md')} {{ :root {{ {ROOT_MD} }} }}", f"  {media(tokens, 'lg')} {{ :root {{ {ROOT_LG} }} }}", "}"]
    lines += ["@theme inline {", "  --color-*: initial;"]
    for path, _ in flatten(tokens["color"]):
        name = "-".join(map(kebab, path))
        lines.append(f"  --color-{re.sub(r'-default$', '', name)}: var(--cl-color-{name});")
    lines += [f"  --font-{name}: var(--cl-font-{name});" for name in tokens["font"]]
    lines += ["  --font-sans: var(--cl-font-body);", "  --font-mono: var(--cl-font-code);", "  --text-*: initial;", "  --radius-*: initial;"]
    lines += [f"  --radius-{name}: var(--cl-radius-{name});" for name in tokens["radius"]]
    lines += ["  --shadow-*: initial;"] + [f"  --shadow-{name}: var(--cl-shadow-{name});" for name in tokens["shadow"]]
    lines += ["  --ease-*: initial;"] + [f"  --ease-{name}: var(--cl-motion-ease-{name});" for name in tokens["motion"]["ease"]]
    lines += ["  --breakpoint-*: initial;"] + [f"  --breakpoint-{'2xl' if name == 'xxl' else name}: {number(px/16)}rem;" for name, px in tokens["breakpoint"].items()]
    lines += ["  --container-content: var(--cl-layout-content-max);", "  --container-wide: var(--cl-layout-wide-media-max);", "  --container-measure: var(--cl-layout-prose-max);", "}"]
    lines += [f"@utility cl-type-{name} {{ {type_rule(name, t)} }}" for name, t in tokens["type"].items()]
    return "\n".join(lines) + "\n" + TAILWIND_BASE

def luminance(value):
    v = [int(value[i:i+2],16)/255 for i in (1,3,5)]
    v = [c/12.92 if c <= .04045 else ((c+.055)/1.055)**2.4 for c in v]
    return sum(a*b for a,b in zip(v,[.2126,.7152,.0722]))

def contrast(a,b):
    lo, hi = sorted([luminance(a),luminance(b)])
    return (hi+.05)/(lo+.05)

def validate(tokens, css):
    c = tokens["color"]
    pairs = []
    for surface in ["canvas","surface","subtle"]:
        for foreground in ["primary","secondary","muted"]:
            pairs.append((f"text.{foreground} / bg.{surface}",c["text"][foreground],c["bg"][surface],4.5))
        pairs.append((f"brand / bg.{surface}",c["brand"]["default"],c["bg"][surface],4.5))
    for state in ["default","hover","active"]:
        pairs.append((f"primary button {state}",c["brand"]["on"],c["brand"][state],4.5))
    for status in ["info","success","warning","error"]:
        pairs.append((f"status {status}",c["status"][status],c["status"][status+"Bg"],4.5))
    pairs += [("inverse text",c["text"]["inverse"],c["bg"]["inverse"],4.5),("inverse secondary",c["text"]["inverseSecondary"],c["bg"]["inverse"],4.5),("inverse link",c["brand"]["inverse"],c["bg"]["inverse"],4.5),("control border on white",c["border"]["control"],c["bg"]["surface"],3),("control border on canvas",c["border"]["control"],c["bg"]["canvas"],3)]
    for name,color in c["chart"].items():
        pairs.append((f"chart {name} on white",color,c["bg"]["surface"],3))
    out = [{"pair":n,"foreground":a,"background":b,"ratio":round(contrast(a,b),4),"required":limit,"pass":contrast(a,b)>=limit} for n,a,b,limit in pairs]
    failures = [p for p in out if not p["pass"]]
    defined = set(re.findall(r"(--cl-[a-z0-9-]+)\s*:",css))
    referenced = set(re.findall(r"var\((--cl-[a-z0-9-]+)",css))
    missing = sorted(referenced-defined)
    typography = [{"role":name,"at320":t["min"],"at1440":t["max"],"css":fluid(t["min"],t["max"])} for name,t in tokens["type"].items()]
    report = {"token_version":tokens["$metadata"]["version"],"contrast_pairs":out,"missing_css_variables":missing,"typography":typography,"scope":"Static token and foundation checks only. Not browser, screen-reader, full-state, field-performance or site compliance verification."}
    (ROOT/"validation-report.json").write_text(json.dumps(report,indent=2)+"\n")
    if failures or missing:
        raise ValueError({"contrast_failures":failures,"missing_variables":missing})
    return report

def main():
    path = ROOT/"tokens.json"
    if not path.exists():
        path.write_text(json.dumps(INITIAL_TOKENS,indent=2)+"\n")
    tokens = json.loads(path.read_text())
    css = build_css(tokens)
    report = validate(tokens,css)
    (ROOT/"foundations.css").write_text(css)
    summary = {"status":"passed","contrast_pairs":len(report["contrast_pairs"]),"css_variables":len(set(re.findall(r'(--cl-[a-z0-9-]+)\s*:',css))),"css_bytes":len(css.encode())}
    if TAILWIND_OUT.parent.exists():
        tw = build_tailwind(tokens)
        missing = sorted(set(re.findall(r"var\((--cl-[a-z0-9-]+)",tw)) - set(re.findall(r"(--cl-[a-z0-9-]+)\s*:",tw)))
        if missing:
            raise ValueError({"tailwind_missing_variables":missing})
        TAILWIND_OUT.write_text(tw)
        summary["tailwind"] = str(TAILWIND_OUT.relative_to(ROOT.parent.parent))
    print(json.dumps(summary))

if __name__ == "__main__":
    main()
