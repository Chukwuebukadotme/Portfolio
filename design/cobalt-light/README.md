# Cobalt Light portfolio design system

Version 1.0.0 · 19 October 2026 · Chukwuebuka Onyemelukwe

Start with `Cobalt-Light-Design-System.pdf` for an illustrated orientation and the complete written specification. Use `Cobalt-Light-Design-System.md` as the editable master. This is a design and implementation handoff; the live portfolio has not been modified.

## Package contents

- `Cobalt-Light-Design-System.md`: complete visual, component, motion, responsive, content and release rules.
- `Cobalt-Light-Design-System.pdf`: illustrated guide plus the complete written rules.
- `tokens.json`: canonical values in a documented project-specific JSON format, not a DTCG export.
- `TOKEN-FORMAT.md`: token structure, naming and update conventions.
- `foundations.css`: generated CSS variables, responsive type and selected foundational classes.
- `markup-examples.html`: semantic examples for applying the foundation classes.
- `build_foundations.py`: dependency-free token-to-CSS generator and static contrast/reference validator.
- `validation-report.json`: computed solid-colour contrast pairs and foundation checks.
- `projects.schema.json`: project-data structure in JSON Schema 2020-12.
- `project.example.json`: intentionally unpublished draft record; not production content.

## Implementation

1. Supply and verify licensed Space Grotesk and Inter webfont assets. The fonts are not redistributed in this package. Use 500/600/700 display and 400/500/600 body weights as needed, with immediate fallbacks.
2. Import `foundations.css` once. Apply `cl-container`, `cl-prose`, `cl-type-*`, `cl-button` and other foundation classes where appropriate.
3. Implement semantic components and their behaviour using Section 09 of the master. CSS does not implement focus management, modal semantics, browser history or message delivery.
4. Source Lucide icons from the official distribution; source grid 24, nominal stroke 1.75. Brand marks are separate reviewed assets.
5. Add authentic project assets, data and evidence. The example record deliberately has no made-up URLs or metric sources.
6. Build static content, keyboard behaviour and responsive layouts before decorative motion.

## Updating foundations

```bash
python3 build_foundations.py
```

This creates `tokens.json` only when absent, otherwise uses the existing JSON as canonical input. It regenerates CSS and writes the validation report. A failed required contrast pair or undefined CSS variable causes a nonzero exit.

The token generator is dependency-free. JSON Schema validation is optional and requires a separate validator. For example, a Python project may use `jsonschema` with format checking. JSON Schema alone cannot check if an evidence source is truthful or if a media file exists; enforce those publication gates separately.

## Verification boundaries

The package includes static token checks and rendered-PDF inspection. It does not claim that the current website passes browser, keyboard, screen-reader, full-state, mobile, form delivery, security or performance checks. The review matrix in the master defines what remains to verify during implementation.

## Design decisions

The selected Cobalt Light palette, Space Grotesk / Inter pairing and Lucide treatment are preserved. Extended tokens and component/motion specifications are original recommendations informed by the research cited in the master. No reference site's exact font or icon package is claimed without verification.
