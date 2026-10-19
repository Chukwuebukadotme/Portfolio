# Token format and units

`tokens.json` is the single source for foundations in this package. It is a project-specific JSON object and does not claim conformance with the Design Tokens Community Group interchange format.

| Group | Stored values | Generated CSS |
| --- | --- | --- |
| `color` | Hex or explicit CSS rgba strings | Unchanged |
| `font` | Ordered arrays of family names | CSS family list |
| `type` | Min/max CSS px at 16px root; line height unitless; tracking in em; integer weight; family key | Fluid rem/vw size, line height, tracking and weight variables plus type classes |
| `space`, `radius`, numeric `layout` | CSS px at 16px root | rem |
| `layout.proseMax` | CSS measure string | 68ch |
| `breakpoint` | CSS px at default root | px variables; md/lg media queries generated as rem |
| `control` | CSS px except nominal `iconStroke` | rem except icon stroke remains unitless |
| `shadow`, `motion.ease` | CSS strings | Unchanged |
| `motion.duration`, `motion.stagger` | Milliseconds | ms |
| `motion.distance` | CSS px at 16px root | rem |
| `motion.scale` | Dimensionless multipliers | Unchanged |
| `motion.limits` | Shared transition / reduced feedback in ms; pinning in viewport-height multiples | Raw numeric values for application code; append the documented units when used |
| `z` | Integer stacking order | Unitless |

The fluid scale interpolates between 320px and 1440px at the default root size. It uses a rem intercept plus a viewport term, bounded by rem minima/maxima. Browser zoom and user text settings still require manual reflow testing.

CSS names use the prefix `--cl-`, group paths separated by hyphens and camel-case keys converted to kebab-case. Example: `color.text.inverseSecondary` becomes `--cl-color-text-inverse-secondary`.

Component behaviours, field-level evidence checks and motion choreography remain in the master specification; a generic token value cannot implement them. Update written rules if changing a canonical value changes the contract.
