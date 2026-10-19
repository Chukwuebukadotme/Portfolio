# Cobalt Light
## Portfolio design system · Version 1.0

**Owner:** Chukwuebuka Onyemelukwe  
**Positioning:** Design Engineer × AI Engineer  
**Date:** 19 October 2026  
**Status:** Implementation specification. Visual direction selected by the owner; detailed rules below are proposed defaults ready for implementation review.

This system translates the selected Cobalt Light direction and the preceding portfolio review into one visual and interaction language. It covers the entire portfolio, including content, responsive layouts, component states, motion, project evidence, scientific figures and implementation handoff. It specifies a future implementation; it does not claim that the live website has been changed or audited against every requirement.

## How to use this system

1. Read the decisions and foundations before designing individual screens.
2. Use `tokens.json` as the canonical source for foundation values. `foundations.css` is generated from it; regenerate after changing tokens.
3. Use this document for composition, behaviour and content requirements. A token cannot describe a complete component interaction.
4. Use the illustrated PDF for visual orientation and implementation review. The editable document remains authoritative for detailed behaviour.
5. Build and review the core components before applying decorative motion.
6. Publish claims, screenshots and numerical results only after checking their project evidence.

**Requirement language:** MUST is a release requirement. SHOULD is the normal default; record a concrete reason for an exception. MAY is optional. Reference websites explain a design principle; they do not override these rules.

## 01 · Direction and decisions

### Intended impression

The website should communicate precise visual judgement, practical engineering ability and understandable AI work. The interface must help a hiring manager identify the person, locate relevant projects, inspect the evidence and make contact quickly. Visitors who choose to explore should encounter richer product demonstrations and technical explanations.

### Locked foundations

| Decision | Specification |
| --- | --- |
| Primary appearance | Cobalt Light: cool off-white, near-black text and saturated cobalt |
| Display family | Space Grotesk; normal widths; 500, 600 and 700 weights |
| Reading and UI family | Inter; 400, 500 and 600 weights |
| Code | Native monospace stack; no third downloadable font required |
| Functional icons | Lucide outline; 24-unit source grid; nominal stroke 1.75 |
| Primary identity | Full name and professional role visible near the top; CO remains a supporting wordmark |
| Motion | Immersive project storytelling with interruptible transitions and readable static equivalents |
| Primary audience | Hiring managers for design engineering, product engineering and AI engineering roles |
| Primary actions | Explore selected work; view résumé; contact |
| Theme scope | One light theme plus a controlled inverted footer/media treatment. A full alternate dark theme is outside v1. |

### Design principles

- **Evidence leads.** A working example, interface recording, measured result or implementation detail earns more space than a repeated capability statement.
- **One visual system.** Typography, spacing, icons and interaction behaviour remain consistent across design, software and research projects.
- **Content sets the pace.** Motion highlights changes in state, relationships or process; it does not force visitors through a presentation.
- **A person is visible.** The introduction and About page include a name, a career story and attributable experience.
- **Detail remains readable.** Metadata, charts and control states must remain legible on a phone and under zoom.
- **The static experience is complete.** Links, content and outcomes remain available without decorative scripts, WebGL or hover.

### Reference interpretation

| Reference group | Principle to adapt |
| --- | --- |
| 14islands / Lusion | Strong design-and-technology identity; a carefully composed interactive opening |
| Obys / Reform Collective | Spatial continuity between navigation, project index and detail views |
| Dennis Snellenberg / Artem Shcherban | Personal identity, curated work and a clear experience narrative |
| Rauno Freiberg / Emil Kowalski | Small interaction details and playable implementation evidence |
| Bartosz Ciechanowski / Transformer Explainer / Distill | Figures that explain mechanisms, relationships and limitations |
| Mobbin Motion / Scroll Effects / Glass / Editorial | Compare real section and component treatments before making local choices |

The exact colours, fonts and icon libraries of those websites were not established by the reference study. Cobalt Light uses the explicitly selected, original combination. The mood specimens from the earlier exploration are not a source of additional factual career claims.

## 02 · Colour system

### Core semantic tokens

| Token | Value | Required use |
| --- | --- | --- |
| color.bg.canvas | #F5F7FB | Main page background |
| color.bg.surface | #FFFFFF | Reading panels, fields, dialog surfaces |
| color.bg.subtle | #E8EDF7 | Diagram beds and restrained grouped content |
| color.text.primary | #141820 | Headings and primary body text |
| color.text.secondary | #475467 | Supporting text, dates, captions |
| color.text.muted | #596579 | Low-emphasis readable labels |
| color.brand.default | #0041D9 | Primary action, selected state, selected chart series |
| color.brand.hover | #0038BA | Hover on filled primary controls |
| color.brand.active | #002E9B | Pressed primary controls |
| color.brand.soft | #DBE4FA | Selected subtle backgrounds |
| color.brand.on | #FFFFFF | Text on filled primary controls |
| color.border.default | #B8C6DD | Dividers and decorative detail |
| color.border.subtle | #DCE3ED | Secondary group boundaries |
| color.border.control | #7D8BA0 | Field/control boundaries that identify an interactive area |
| color.focus | #0041D9 | Visible focus outline, on light surfaces |
| color.bg.inverse | #141820 | Footer and selected media stages |
| color.text.inverse | #F5F7FB | Primary text on inverse |
| color.text.inverseSecondary | #B8C6DD | Secondary text on inverse |
| color.brand.inverse | #A9C1FF | Links and focus on inverse |

### Status tokens

| Meaning | Text / icon | Background | Label example |
| --- | --- | --- | --- |
| Information | #0041D9 | #E8EDF7 | Research |
| Success | #16754A | #E9F6EF | Message sent |
| Warning | #8A4B08 | #FFF4DB | In development |
| Error | #B42318 | #FFF0EE | Enter a valid email address |

Use a status word and, where helpful, a matching icon. A coloured dot alone must not carry the meaning. Project status is separate from discipline; AI projects are not automatically blue and product projects are not automatically green.

### Application rules

- Use neutrals for most content and surfaces. Cobalt identifies important actions, a selected object or a deliberately highlighted idea.
- Give each viewport one clear primary action. Repeated cobalt buttons in a dense row weaken priority.
- Long body text remains near-black. Cobalt may highlight a short heading phrase, but must not turn entire paragraphs into accent text.
- Use solid cobalt for functional text and controls. Gradients may appear in project artwork, not in body text or the primary CTA label.
- The default border is decorative. Use `color.border.control` when a boundary is needed to recognise a field or control.
- Use the inverse palette as a local surface. Do not place default cobalt text directly on the inverse background.
- Photography and product screenshots retain their native colours. Surround them with the neutral frame rather than recolouring the artefact.
- Transparency requires testing against the actual content underneath. Use an opaque fallback when contrast cannot be guaranteed.

### Contrast requirements

Target WCAG 2.2 AA: normal text at least 4.5:1; qualifying large text at least 3:1; essential control boundaries and graphical objects at least 3:1 against adjacent colours where the criterion applies. Prefer 4.5:1 for all ordinary UI copy even when a large-text exception could apply. Test links, hover, focus, selected and validation states individually. See Sources S01-S03.

The supplied validation report calculates specified solid-colour pairs. It is not an accessibility certification and does not establish contrast over photography, translucent content or every implementation state.

## 03 · Typography

### Families and roles

- **Space Grotesk:** display headlines, page titles, project titles and important numerical outcomes. Use 500 for normal headings, 600 for emphasis and 700 sparingly for short display text.
- **Inter:** paragraphs, navigation, buttons, forms, captions, labels and tables. Use 400 for reading, 500 for UI and 600 for emphasis.
- **Monospace:** `ui-monospace, SFMono-Regular, Consolas, monospace` for code and literal identifiers only. Ordinary metadata remains Inter.

Load only used weights. Prefer self-hosted WOFF2 assets with `font-display: swap`; verify the exact downloaded font's licence before distributing it with a product. The package does not redistribute font binaries. When loading fails, render the fallback immediately.

### Responsive type scale

Values below are CSS pixels at a 16px root; line heights are unitless. Use rem-based tokens and fluid interpolation between the 320px and 1440px anchors. Text must still resize with browser/user settings.

| Role | 320px anchor | 1440px anchor | Family / weight | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display / hero | 44 | 88 | Space Grotesk 500 | 1.02 | -0.04em |
| Page title | 36 | 64 | Space Grotesk 500 | 1.08 | -0.035em |
| Section heading | 30 | 48 | Space Grotesk 500 | 1.12 | -0.03em |
| Project heading | 26 | 36 | Space Grotesk 500 | 1.18 | -0.025em |
| Subheading | 22 | 26 | Space Grotesk 500 | 1.25 | -0.02em |
| Lead paragraph | 18 | 22 | Inter 400 | 1.55 | -0.01em |
| Body | 16 | 18 | Inter 400 | 1.65 | 0 |
| UI / button | 14 | 14 | Inter 500 | 1.4 | 0 |
| Caption / metadata | 13 | 14 | Inter 400 | 1.5 | 0 |
| Eyebrow | 12 | 12 | Inter 500 | 1.5 | 0.08em |
| Code | 13 | 14 | Monospace 400 | 1.6 | 0 |

### Typesetting rules

- One meaningful h1 per page. Heading levels describe the document structure; choose visual size independently where needed.
- Keep long prose to approximately 60-72 characters per line; default prose maximum is 68ch.
- Use normal sentence case. Uppercase is reserved for short eyebrows and identifiers.
- Avoid paragraph-wide bold text, repeated slogan headings and constant sentence fragments.
- Prefer automatic wrapping. A desktop line break may be art-directed only when it does not create awkward mobile breaks or a different reading order.
- Do not split the owner's name into arbitrary character fragments. Render the full name as accessible text even if a decorative wordmark is separate.
- Use tabular figures for aligned tables, counters and chart values. Keep ordinary editorial numbers proportional.
- Maintain at least 12px supporting labels and 16px editable form text on small screens.
- Use real text for titles and essential results. An image may duplicate a heading visually only when the equivalent text remains available.

## 04 · Grid, spacing and responsive layout

### Layout tokens

| Property | Small screens | Tablet ≥768px | Desktop ≥1024px |
| --- | --- | --- | --- |
| Grid columns | 4 | 8 | 12 |
| Page gutter per side | 20px | 32px | 48px |
| Grid gap | 16px | 24px | 24px |
| Standard content max | 1200px | 1200px | 1200px |
| Prose max | 68ch | 68ch | 68ch |
| Section gap | 64px | 80px | 120px |
| Project-row gap | 48px | 64px | 96px |
| Header height | 56px | 64px | 64px |
| Header top offset | 12px | 16px | 16px |
| Anchor scroll offset | 96px | 112px | 112px |

Breakpoints are 480, 768, 1024, 1440 and 1920px. Base support begins at 320px. A breakpoint changes behaviour only when the composition needs it; it is not permission to redesign every component independently.

### Spacing scale

`0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160px`.

Use 4/8/12px inside small controls; 16/24px within cards; 24/32px between related groups; section tokens between chapters. The 160px value is reserved for exceptional large compositions, not repeated default padding.

### Composition rules

- Standard sections align to the same container. A full-bleed media stage may extend to the viewport, but its caption and controls return to the content grid.
- Desktop hero: identity/copy across 7 columns, project composition across 5. At tablet, use a stacked or balanced 4/4 arrangement only when both remain readable. Stack below 768px.
- Project row: 5-column text, 1-column separation and 6-column media. Alternate the desktop visual order sparingly. On mobile, every project follows title → description → outcome → action → media in the DOM.
- Use whitespace to separate information, not to inflate a short list into a long page. Avoid repeated empty viewport-sized sections.
- Do not hide core evidence on mobile. Condense surrounding copy, simplify decoration and move optional detail into accessible disclosure components.
- At 200% text zoom and 400% browser zoom where applicable, content reflows. A wide data table may scroll within a named region; the page itself must not require sideways scrolling.
- Media gets an explicit aspect ratio or intrinsic dimensions to prevent layout shift.

## 05 · Shape, elevation and surfaces

| Element | Radius | Surface / elevation |
| --- | --- | --- |
| Button / small control | 4px | Solid or outlined; no normal shadow |
| Tag / chip | 4px | Neutral or semantic light fill |
| Project/media frame | 8px | Neutral bed; 1px decorative border if needed |
| Product preview card | 12px | Subtle surface; no repeated heavy shadow |
| Floating header | 12px | White 94% base with blur enhancement and restrained shadow |
| Dialog / lightbox | 16px | Opaque surface; overlay shadow |
| Counter / small selection pill | 999px | Use only when the pill shape clarifies a compact control |

Shadows: subtle `0 2px 8px rgba(20,24,32,.06)`; raised `0 8px 24px rgba(20,24,32,.08)`; overlay `0 20px 64px rgba(20,24,32,.16)`. Shadows communicate elevation. Standard sections and every project tile do not need independent floating cards.

The navigation blur is optional enhancement: 16px backdrop blur, white 94% fill, opaque white fallback. A moving scene behind a header must not reduce text contrast. Do not blur form fields, project evidence or reading surfaces.

## 06 · Icons and identity assets

### Functional icon contract

Use Lucide consistently. The nominal source is a 24×24 viewBox with stroke width 1.75; scale the whole glyph rather than arbitrarily redrawing it. Normal rendered sizes: 16px metadata, 20px controls, 24px standalone actions. Preserve the icon's designed line caps and joins. Keep glyph dimensions separate from the larger activation area.

| Meaning | Lucide name |
| --- | --- |
| External destination | arrow-up-right |
| Advance / next project | arrow-right |
| Previous / back | arrow-left |
| Email | mail |
| Résumé / document | file-text |
| Download | download |
| Software implementation | code-xml |
| Components / design system | layers |
| Workflow | workflow |
| Results / analysis | chart-no-axes-combined |
| Menu / dismiss | menu / x |
| Copy / confirmed | copy / check |
| Expand disclosure | chevron-down |
| Information / warning | info / triangle-alert |

- Icons inherit `currentColor`; disabled, hover and focus states use the parent control's tokens.
- Decorative icons are hidden from assistive technology. Icon-only controls MUST have an accessible name.
- Do not use an external-link arrow for an internal route. A right arrow expresses progress through an internal sequence.
- Keep labels for unfamiliar concepts. A generic brain icon is not evidence of an AI capability.
- Use official permitted brand marks for GitHub and LinkedIn where needed; Lucide is the functional family, not a source of invented company logos.
- Match visual weight if introducing a bespoke pictogram. A custom mark is a reviewed identity asset, not an extra icon family.

### Identity

Use CO as a compact typographic wordmark in Space Grotesk 600, normally 24px. It links to Home with an accessible name containing the full owner name. The actual full name and role MUST also appear as visible text in the opening section. Do not rely on the footer copyright or document title to identify the person.

## 07 · Motion foundations

### Timing and easing

| Token | Value | Use |
| --- | --- | --- |
| motion.duration.instant | 0ms | Static / reduced-motion equivalent |
| motion.duration.micro | 120ms | Colour, border, small icon feedback |
| motion.duration.feedback | 160ms | Press/release and status acknowledgement |
| motion.duration.standard | 240ms | Tabs, tooltip, small disclosure |
| motion.duration.enter | 360ms | Menu or panel entrance |
| motion.duration.layout | 480ms | Shared project transition or larger rearrangement |
| motion.duration.hero | 800ms | One initial hero sequence after critical content is visible |
| motion.ease.standard | cubic-bezier(0.2,0,0,1) | Normal interface state changes |
| motion.ease.enter | cubic-bezier(0.16,1,0.3,1) | Larger entrances |
| motion.ease.exit | cubic-bezier(0.4,0,1,1) | Exits, usually shorter than entrance |
| motion.ease.linear | linear | Direct progress and input-controlled movement |

The timings are system defaults, not measured values copied from reference websites. End state correctness and responsiveness take precedence over a fixed animation duration.

### Movement limits

- Button arrow: translate up/right by 2px on hover/focus; button press scale no smaller than 0.98; use only when the entire button remains a stable target.
- Project media: optional scale to 1.015 and maximum 4px translation; clip within its frame. Do not scale body text.
- Panel entrance: at most 16px travel with opacity. Disclosure must track content height rather than jump through a guessed fixed height.
- Stagger: 40ms between related items, capped at 240ms total delay. Do not make a visitor wait through a long list.
- Pointer parallax: maximum 12px in the dedicated hero art. Disable on coarse pointers, touch-only interactions and reduced motion.
- Shared project transition: default 480ms; maximum 600ms. It must be interruptible and cannot delay link activation until an unrelated intro finishes.

### Immersive choreography

One optional pinned showcase is allowed on Home at ≥1024px when the content benefits. Its extra scroll travel is capped at one viewport height, with a clear exit to the next section. At smaller sizes, use normal stacked content or a user-controlled stepper. Do not replace native scrolling with a simulated scroll system for the entire site.

The hero may transform a real product frame into the first project preview. Use a shared visual element only when the two states actually refer to the same project. A background hue shift may mark a new chapter, but must retain readable contrast throughout the interpolation.

### Reduced motion and fallbacks

- Honour `prefers-reduced-motion: reduce` at initial load and when it changes.
- Remove pinning, parallax, camera movement, looping decoration, smooth scrolling and scale/translation choreography. Render final content in normal document flow.
- Functional feedback may use an immediate state change or a short opacity change of at most 100ms. Essential information cannot depend on an animation event firing.
- Provide pause/play for any nonessential movement continuing beyond five seconds alongside other content; prefer no automatic looping at all.
- Audio never starts automatically. Demonstration video has controls and a poster. Pause offscreen media.
- If 3D, a shader or a motion library fails, show a relevant static project image and preserve links and text.

## 08 · Interaction and state contract

Every interactive component must define default, hover where applicable, focus-visible, pressed/selected, disabled where applicable, and loading/error/success where applicable. A touch interaction must not depend on hover.

| State | Visual and behavioural requirement |
| --- | --- |
| Default | Purpose and label are visible; control boundary identifiable where needed |
| Hover | Small colour or icon change; no layout jump; information remains available without hover |
| Focus-visible | 2px focus outline with 3px offset; cobalt on light, inverse accent on dark |
| Pressed | Darker fill or brief scale; activation target stays stable |
| Selected | Text/icon plus fill, underline or marker; selection exposed programmatically |
| Disabled | Native disabled where appropriate, no activation; not communicated through colour alone |
| Loading | Preserve width; text describes the action in progress; prevent duplicate submissions |
| Error | Field-specific message and recovery; preserve entered content |
| Success | Confirm what happened; do not claim success before the operation succeeds |

Use anchors for navigation and buttons for local actions. Native activation and browser history must work. External links keep ordinary browser behaviours. If a link opens a new tab, disclose that accessibly. A résumé link should identify the file type and verified file size when available.

Aim for a 44×44px activation area for standalone controls; use a minimum 24×24px only where necessary and consistent with WCAG 2.2 exceptions and spacing rules. Inline prose links retain natural line layout. This system's 44px recommendation is not a claim that WCAG AA universally requires 44px.

## 09 · Core component specifications

### C01 · Floating header

Desktop: 64px height, top offset 16px, container max 1200px, radius 12px, wordmark left and Work / About / Contact / Résumé right. Internal horizontal padding 20px, item gap 24px. At <768px use 56px height, 12px top offset, 16px internal padding and one labelled menu button. Active route gets a text/underline treatment, not a second primary CTA. It may compact after the hero only when focus and content are not obscured.

### C02 · Mobile navigation

Open as a full-width modal navigation panel below the header or as a full overlay; choose one implementation consistently. Navigation order: Work, About, Résumé, Contact. Each row has at least 48px height. Opening moves focus to the first meaningful control; background content becomes inert; Escape closes; closing restores focus to the trigger. Lock background scrolling without jumping the page. Expose `aria-expanded` and `aria-controls`. Reduced motion shows the final layout immediately. No auto-playing preview in this menu.

### C03 · Buttons and text links

Primary: cobalt fill, white label; hover darker cobalt; active darkest cobalt; min-height 44px; padding 12px 16px; gap 8px; radius 4px. Secondary: surface fill, primary ink and control border. Tertiary: text with a directional icon, no enclosing card. Sizes are small 36px visual height with 44px activation area, default 44px and large 48px. Use only one primary action in a compact group. Loading preserves the label space and exposes busy state. In prose, links are underlined; a hover-only underline is insufficient.

### C04 · Project row / card

An article contains project name, short problem/outcome description, role/discipline, evidence-backed outcome, development status when relevant and a descriptive case-study link. Media is a sibling with a text equivalent. Prefer one clear navigation target; if thumbnail and text both navigate, do not create unnecessary repeated keyboard stops. Desktop uses the grid specified in Section 04. Mobile uses one consistent semantic order. Images are 16:10 for product work; a research figure may use 4:3 when needed for legibility. Never crop axes, labels or essential interface controls.

### C05 · Project filters

Four discipline filters plus All: Product Design, Design Engineering, AI & Machine Learning, Data. Categories may overlap. Counts are computed from published project records. A filter is a button with `aria-pressed`, not a tab unless it controls a genuine tab panel. Keep focus on the filter after activation; announce the result count once through a polite live region. Update the URL query so the view can be shared and restored. Show an explicit no-results state with a clear reset. Cards may reposition over 240-480ms; do not fade the page blank.

### C06 · Status and capability tags

Status badge: 12px Inter 500, 4px radius, 4px vertical / 8px horizontal padding, semantic text and background. Capability tag: neutral fill or thin decorative border; no arrow, pointer or hover effect unless it is actually a filter/link. Limit visible tags to the most informative three or four. Keep development status separate from a product outcome.

### C07 · Outcome metric

Display value in Space Grotesk 500 with Inter description, unit and essential context. Pair a metric with a source/date or case-study evidence reference when available. `12.57 cycles RMSE · FD001 official test` is more useful than `12.57 accuracy`. Do not animate fake counting or display changing model values for decoration. Large numerical treatment is reserved for measured outcomes, not vague availability labels.

### C08 · Figure and media frame

Contains media, concise caption, source or demonstration label and optional expand control. Caption is outside the image. Use an actual figure/figcaption relationship. A static screenshot describes a real implementation; a mockup, simulation or demonstration dataset is labelled accordingly. Opening a larger figure preserves caption and keyboard access. A complex graphic includes a short summary plus a table or extended description.

### C09 · Case-study subnavigation

For studies long enough to need it, use Overview / Decisions / Build / Results / Reflection anchors. Desktop may be sticky below the global header with the shared offset. Mobile uses a compact wrapping list or disclosure. It cannot occupy most of the screen at zoom. The selected section is both visible and programmatically indicated. Normal deep links work without scripts.

### C10 · Tabs and segmented controls

Use tabs for parallel views such as Preview / Code; use a segmented choice for one setting such as desktop/tablet/mobile demonstration width. Follow the keyboard model appropriate to the selected pattern. Tabs have labelled panels and selected state; arrow keys move between tabs. A moving indicator may animate over 240ms. Hidden panels do not contain reachable hidden controls. Do not hide essential methodology only to make the design tidier.

### C11 · Accordion

A heading contains a button with expanded state and a controlled region. Full header row is clickable; plus/chevron change accompanies expansion. Minimum row height 48px. Enter/Space activate. Content uses normal body typography; allow multiple sections open by default. Preserve reading position and do not scroll a user back to the top after expansion. Use for optional implementation detail, not the entire case study.

### C12 · Dialog / lightbox

Use an accessible dialog pattern: labelled title, focus inside on open, inert background, contained tab order, visible close control, Escape to close and focus restoration. Standard maximum width 720px; media may use up to 1120px and available viewport height with readable content scrolling. Keep controls visible at zoom and on mobile. Backdrop click may close a simple figure viewer, but not discard an unsent contact message silently. See S04.

### C13 · Tooltip and chart detail

Supplementary content only. Show after 200ms hover or on keyboard focus; hide on Escape and appropriate pointer/focus departure. It remains reachable/hoverable when needed, does not obscure the trigger unnecessarily and is associated with the trigger. Touch charts support tapping a mark or selecting an item; all values remain available in a table. Never put the only explanation of an unfamiliar icon exclusively in a tooltip.

### C14 · Form fields

Persistent visible label; 44px minimum height; 12px horizontal padding; 6px radius; 1px control border. Inter 16px text. Required fields explicitly marked; company explicitly optional. Help and error text are associated programmatically. Focus uses the common ring. Error changes icon/message/border, not just colour. Do not use placeholder-only labels. Use appropriate autocomplete and input types. Never clear data after a network error.

### C15 · Select / enquiry choice

Prefer native select unless a custom version provides a necessary capability. Options: Hiring, Product collaboration, General enquiry. Label remains visible. Expose selected value and required state. A custom popup must support keyboard selection, screen readers, escape and mobile input; the hidden native and visible custom control must not create duplicate accessible controls.

### C16 · Form submission and notifications

States: idle → validating → sending → success or recoverable error. Disable duplicate sending, use `aria-busy`, retain field values and show field-specific plus summary errors where appropriate. Announce success once. Show success inline near the form; a toast alone is insufficient. Report `Message sent` only after the service confirms acceptance; it is not proof that someone read it. A failed request offers Retry and direct email.

### C17 · Copy email

Use a button labelled Copy email beside the visible address. On success show Copied for about 2 seconds and announce once without moving focus. Clipboard failure exposes the address for manual selection and does not claim success. The mailto link remains separate and available.

### C18 · Loading, empty and error states

Loading placeholders reserve the final image or content dimensions. Prefer static placeholders; shimmer is optional and stops in reduced motion. An empty filtered result names the problem and offers All projects. A failed project asset gets a labelled alternative and a route to text detail. A 404 page offers Work, Home and Contact; it does not become a dead-end animation.

### C19 · Previous / next project

Use clear labels plus project names and real links. No forced cyclic scrolling. At the end of a study, the next preview may enter view naturally; navigation requires deliberate activation. Preserve browser Back position and filters when returning to the index.

### C20 · Footer

Use the inverse palette. Include a clear contact invitation, visible email, résumé, LinkedIn, GitHub, copyright and privacy link when applicable. Full name remains readable. A return of the hero motif may be decorative; contact links remain stable. Do not add local time, rotating slogans or social feeds without a defined purpose.

### State coverage by component

| Component | Required states |
| --- | --- |
| Header/menu | Default, active route, hover, focus, open, closed, reduced motion |
| Buttons/links | Default, hover, focus, pressed; disabled/loading where relevant |
| Project/filter | Default, hover, focus, selected filter, empty, media error |
| Accordion/tabs | Default, focus, expanded/selected, keyboard interaction |
| Dialog | Closed, opening, open, closing, keyboard, mobile, reduced motion |
| Form | Empty, filled, focused, invalid, sending, sent, failed |
| Chart/media | Static, interactive, keyboard/touch detail, no-script alternative, loading/error |

## 10 · Page templates and content architecture

### Routes

| Route | Purpose | Primary action |
| --- | --- | --- |
| / | Introduce the person and curate the strongest evidence | Selected work |
| /work | Browse published projects by discipline | Open a case study |
| /work/[slug] | Explain contribution, decisions and evidence | Explore artefact / next relevant project |
| /about | Establish experience, education and working approach | Résumé / contact |
| /contact | Separate hiring and project enquiries | Email or send enquiry |
| /privacy | Explain actual contact-data handling where applicable | Return to contact |
| Not found | Recover from an invalid URL | Browse work |

Résumé remains a direct link to a verified PDF asset. Avoid a route whose only effect is an unexplained automatic download. Do not publish a privacy statement that invents storage providers, retention periods or data practices.

### Home sequence

1. **Hero:** full name, stable professional role, concise value statement, relevant visual composition, Selected work primary action and Résumé secondary action. The core text is immediately visible before optional motion.
2. **Selected work:** four projects, each with a distinctive real preview and compact evidence. Default order: Make It Responsive, SiteResolve, Predictive Maintenance, Axon UI. This prioritises shipped adoption, then product engineering, research and component craft; order can be changed through content data.
3. **Capabilities through evidence:** three compact areas - Product design, Product engineering, AI engineering. Each links to relevant work. Do not repeat another full service list later.
4. **Experience / person:** short attributable career introduction, selected real milestones and About link. Verified outcome highlights may appear here, without duplicating every project metric.
5. **Working approach:** one concise explanation, ideally connected to a project decision. Optional if it merely repeats the case studies; do not add a full generic five-column process solely to fill space.
6. **Contact and footer:** hiring availability and contact action; global footer as C20.

The first selected work should follow the introduction without an extra full-screen statistics section. At 390×844 the name, role, main message and at least one action should be reachable in the opening viewport; test real text, not a shortened placeholder.

### Work index

Start with Work or Selected work, a short introduction and filters. Do not repeat a full-screen homepage hero. Default view shows all nine project records. Use the same project schema and media components as Home. Provide meaningful status and year only where supplied. Counts and `View all` totals come from data. Grid/list toggles are optional, not required; implement only if both views are useful and accessible.

### About

Full name and portrait or short introduction; dated experience timeline; education; selected links to work; concise principles; résumé and contact. Career entries require actual role, organisation, dates and contribution. If content is missing, omit the entry until supplied instead of generating plausible history. Explain the connection between design and AI with real examples. Keep a compact skills-to-evidence mapping rather than another long technology cloud.

### Contact

Hiring and project enquiry routes remain distinct. Direct email, résumé and LinkedIn are available before the form. Form: Name, Email, Company/organisation (optional), Enquiry type, Message. Display a short truthful data-handling notice and privacy link. Real delivery, validation and recovery must be tested before launch. Avoid promising an unconfirmed response time.

## 11 · Case-study system

### Required narrative

1. **Summary:** project name, precise problem, status, role, contribution, year when known, and links to real artefacts.
2. **Evidence preview:** real interface, demonstration recording or research result with caption.
3. **Problem and context:** who experienced the problem, constraints and why it mattered.
4. **Key decisions:** two to four consequential decisions; explain alternatives, trade-offs and resulting behaviour.
5. **Build:** architecture, implementation or design process with relevant diagrams and artefacts.
6. **Evaluation and outcomes:** measured results, method, evidence, limitations and deployment status.
7. **Reflection:** what changed, what remains unresolved and what you would improve.
8. **Next step:** artefact, repository, report, next project or contact as appropriate.

Short studies may merge adjacent sections; they must not invent a research process to satisfy headings. A large preview placeholder is never an acceptable published outcome. Use a useful supported visual, omit an optional visual, or hold the study as draft.

### Project-specific treatment

| Project | Primary demonstration | Evidence and content gate |
| --- | --- | --- |
| Make It Responsive | Recorded before/after of one real Figma frame across widths | Community/product link; define users vs installs, benchmark date, two-second timing setup and conversion-quality measure |
| SiteResolve | Report → assign → resolve → verify on one issue | Label demonstration data; separate implemented, tested and planned features; product-site link |
| Predictive Maintenance | Sensor history → window → model comparison → endpoint result | FD001 scope, split, cap, units, final test protocol and report/code source; measured cost alongside parameter count |
| Axon UI | Change Figma variant and matching React props | Real component gallery, states, tokens, keyboard behaviour, repository/demo where shareable |
| Plantify | Capture → prediction → uncertainty/result detail | Dataset, species count, split, metric and held-out evaluation; real screen or working demo |
| Mankela | One business request through service selection and tracking | Actual design screens, research/validation evidence and contribution boundaries |
| Liquid State Machine | Noisy audio vs reconstructed output, aligned visualisation | Playable examples, evaluation conditions and clearly stated research status |
| Ozon pipeline | Select a priority tier and follow routing/isolation | Test interval, event volume/rate, actual monitoring screenshots; avoid untested latency guarantees |
| Salary Benchmark | Data preparation → model comparison → example prediction | Dataset, target units, split, error measures and limits; show what was implemented |

### Evidence policy

Every prominent numeric claim requires a definition, context and source in the project record. If not supplied, the CMS flags it internally and the claim is not published. That internal flag must not leak as a distracting implementation label into the public experience.

Use accurately qualified terms: prototype, concept, in development, deployed, evaluated or published. A public waitlist is not customer adoption. A small trainable readout is not proof of low latency. A controlled shared protocol does not establish that all representation and tuning choices are identical. Generalisation claims must name their evaluated domain.

## 12 · Figures, data and technical demonstrations

### Figure styles

- **Product screenshot:** native colours, neutral surround, caption naming the task and state.
- **Architecture:** top-down or left-to-right readable flow; maximum five nodes across; labelled inputs, transformations and outputs. Distinguish synchronous, asynchronous and feedback relationships only when relevant.
- **Code sample:** selectable text with language label, concise snippet and optional Copy. Use an opaque inverse surface; maintain contrast for every syntax colour. Explain the reason the snippet matters.
- **Result chart:** axes, units, direction of improvement, dataset/evaluation context and source. Zero-baseline bars unless a justified alternative is explicit. Avoid 3D charts and decorative fake telemetry.
- **Comparison table:** aligned numbers, consistent precision, sorting where useful, named scroll region on narrow screens and an accessible table structure.

### Chart palette

Use cobalt for the selected or highlighted series, graphite for comparison and soft neutral structure. A ranked eight-model chart normally uses one highlighted bar and neutral bars, not eight unrelated bright colours. When identity genuinely requires multiple colours, use chart tokens cobalt #0041D9, teal #0D766E, purple #6941C6, orange #B54708, magenta #B42369, cyan #087E8B, olive #54772B and graphite #475467. Pair them with direct labels, markers or line styles.

Gridlines use a decorative subtle border; data marks and essential axis lines use sufficient contrast. Keep meaningful numbers visible outside hover. Use only the precision supported by the measurement. Comparisons across latency or model size need explicit units, hardware/setup and whether timing is per sample or batch.

### Predictive-maintenance visual contract

Show FD001 context close to results. Distinguish train/validation windows from official-test engine endpoints. State that RMSE in cycles is lower-is-better. Model selection must use recorded outputs, not change the measured score as the user moves a decorative slider. An example engine selector may expose recorded sensor history and predictions. The figure must disclose any simulated or illustrative data.

### Demonstration behaviour

Initial state is useful before interaction. Provide real labelled controls for model, stage, width or component state. Use keyboard and touch equivalents. Pause media when offscreen. A diagram may reveal stages with scroll, but all stages and descriptions remain in the document in reduced motion. Display an informative fallback if an interactive module cannot load.

## 13 · Detailed motion recipes

| Recipe | Trigger | Sequence | Duration / limit | Fallback |
| --- | --- | --- | --- | --- |
| Hero entrance | Initial route render | Name/role visible immediately; project artwork settles once | Up to 800ms; no blocking loader | Static final composition |
| Hero to project | Scroll through actual related content | Shared product frame shifts into first project media | One optional desktop pin, extra travel ≤1 viewport | Stacked hero and project |
| Header menu | Button activation | Panel enters; focus moves; background becomes inert | 360ms enter, 240ms exit | Immediate panel |
| Project hover | Fine pointer or keyboard focus | Media lifts ≤4px / scales ≤1.015; arrow moves 2px | 240ms | Static frame with visible link |
| Open study | Deliberate link activation | Matching image expands; title appears without hiding essential content | 480ms, cap 600ms | Normal route navigation |
| Filter update | Filter button | Preserve focus; reposition surviving items; announce count | 240-480ms | Immediate result update |
| Figure stage | Scroll or labelled step control | Highlight the relevant stage and its explanation | Input-controlled; no artificial delay | All stages readable |
| Metric detail | Hover/focus/tap | Show a consistent detail surface | 120-240ms | Caption and data table |
| Copy email | Confirmed copy | Icon becomes check; label changes; restores | Feedback 160ms; label about 2s | Selectable email |
| Submit form | Request result | Validate; show sending; confirmed success or recovery | Network-dependent, no fake delay | Inline feedback |
| Footer return | Footer enters view | Optional opening motif returns at low intensity | One entrance ≤360ms | Static footer |

Use a shared motion primitive per recipe. Do not stack independent reveal libraries on the same element. Reading and input must remain responsive while another object animates. Avoid title scrambling, endlessly rotating job labels, cursor replacement and automatic horizontal scroll. The user's role and project names stay stable.

## 14 · Content model and writing

### Project data contract

`projects.schema.json` defines structure. Each published project has a stable slug, title, summary, disciplines, status, role, contributions, media, sections and at least one evidence item. A publication gate separately checks referenced files/URLs, factual support and accessibility. Schema validity alone is not proof of accuracy.

Metric records contain value, unit, label, context, source ID and verification date. Media records contain type, source, alternative text, optional poster/caption and whether the content is a demonstration. Result tables store data values separately from graphics so they can be exported and rendered accessibly.

Experience content has a separate source of truth: role, organisation, dates, location when relevant, contribution and related project slugs. Contact availability is stored once and reused. Never hardcode a project count separately on Home and Work.

### Writing rules

- Start descriptions with the actual product, user problem or outcome.
- Name the contribution: designed, implemented, evaluated, integrated or researched.
- Separate personal contribution from team output. Credit collaborators where appropriate.
- Use concise, specific sentences. Remove unsupported superlatives and repeated abstract claims.
- Explain specialised terms at first use. A recruiter should understand the problem before seeing an architecture diagram.
- Distinguish an intended benefit from a measured result.
- Keep link text meaningful: `View Make It Responsive case study`, `Open report (PDF)` and `View source on GitHub`.
- Use British English consistently; retain official product/library names.
- Do not publish fictional testimonials, client logos, employment details or user-research findings.

### Content length guidance

Hero introduction: normally 25-45 words. Project summary: 25-55 words. Project card: up to four capability tags. Case-study introduction: one short summary before metadata. A paragraph should usually develop one point. These are editing defaults, not truncation rules; preserve necessary context.

## 15 · Accessibility, performance and resilience

### Accessibility acceptance

- Meaningful landmarks, one h1, ordered headings, a working skip link and visible focus.
- Full keyboard navigation through menu, filters, tabs, disclosures, dialogs, media and forms.
- Focus is not hidden behind sticky UI. Anchor navigation respects the shared offset.
- Text and controls retain contrast in every state; information is not encoded by colour alone.
- Accessible names match visible labels. Decorative duplicate thumbnails do not create confusing repeated links.
- Alt text explains an image's purpose. Complex figures have a readable equivalent.
- Form errors identify fields, preserve content and explain recovery. Live announcements do not repeat excessively.
- Reading order matches visual order when content stacks. Hidden content is not keyboard-reachable.
- Reflow and zoom work without clipping. Support reduced motion and touch without hover.
- Captions/transcripts are supplied for demonstrations where audio conveys essential information.

### Performance targets

Aim for field Core Web Vitals at the 75th percentile: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. These are targets to measure, not achieved claims. Use lab checks before release and field data when enough traffic exists. See S06.

Project budgets: initial compressed JavaScript target ≤180KB excluding deferred interactive demonstrations; above-the-fold hero poster target ≤250KB; subsetted initial font transfer target ≤200KB total; no autoplay hero video by default. A visual requiring a budget exception needs measured impact and a fallback. These budgets are local design decisions and may be revised using evidence.

Preload only the necessary above-the-fold asset and essential font faces. Lazy-load later images and demos. Supply responsive images and explicit dimensions. Defer WebGL until the base content is usable and the scene approaches the viewport. Dispose rendering loops when unmounted/offscreen. Avoid layout animations that repeatedly force expensive reflow. No decorative animation may delay the first readable identity and CTA.

### Security and privacy behaviour relevant to design

External URLs and uploaded project assets must be reviewed before publication. Contact error messages do not expose server details. The privacy statement reflects the real service, storage and retention configuration. Do not place private research data, credentials, personal client details or confidential screenshots into public demonstrations.

## 16 · Design and implementation handoff

### Figma structure

Pages: 00 Read me; 01 Foundations; 02 Components; 03 Patterns; 04 Page templates; 05 Project figures; 06 Prototypes; 07 Release checks. Create variables for semantic colours, spacing, radius and motion durations. Keep a light mode and a local inverse surface collection; do not call an inverted footer a complete dark theme.

Use Auto Layout for controls, cards, navigation, forms and stacked mobile content. Components expose only meaningful properties: variant, size, state, icon position, selected and expanded. Match implementation prop names where a reusable component exists. Name examples by purpose rather than copying reference-site brands.

### File and component naming

Semantic tokens use dotted paths in JSON and `--cl-*` names in CSS. Component names: SiteHeader, MobileNavigation, Action, ProjectPreview, ProjectFilters, StatusBadge, OutcomeMetric, FigureFrame, CaseStudyNavigation, Disclosure, Tabs, Dialog, Tooltip, Field, EnquiryForm, CopyEmail, ProjectPagination and SiteFooter.

The supplied CSS provides tokens, type utilities and a small foundation layer. It is not a complete React/component implementation. Interaction code must fulfil Section 09; adding CSS classes alone does not make a menu, dialog or form accessible.

### Change order

1. Update the canonical tokens or written rule.
2. Regenerate foundation CSS and verify token references.
3. Update Figma variable/style values and component variants.
4. Check representative Home, case study, form and figure views.
5. Run contrast, keyboard, zoom, reduced-motion and responsive checks affected by the change.
6. Record the decision and increment the version.

Versioning: patch for corrections with unchanged behaviour; minor for compatible additions; major for renamed/removed tokens or changed component contracts. Do not create one-off near-duplicate colours or radii to solve a local spacing problem.

## 17 · Delivery and release checklist

### Required first implementation

- Build foundations and navigation, then one complete flagship project and one complete research study.
- Replace unfinished preview panels across all published projects.
- Consolidate repeated homepage capability/process/technology sections.
- Add visible full identity and attributable experience.
- Add evidence links and metric definitions, particularly for adoption, conversion quality and research outcomes.
- Implement forms and confirm validation, network recovery and real service acceptance.
- Apply motion recipes after static reading order, routes and focus behaviour are correct.

### Review matrix

| Dimension | Required checks |
| --- | --- |
| Viewports | 320, 390, 768, 1024, 1440 and 1920px; also an intermediate width between each major breakpoint |
| Input | Keyboard only, pointer, touch; no hover dependence |
| Preferences | Reduced motion, increased text size, browser zoom; system font fallback |
| Content | Long name/title, missing optional year, no result, long caption, wide table, failed image |
| Form | Invalid email, missing required fields, sending, success, service failure, retry |
| Navigation | Direct deep link, browser Back/Forward, shared filter URL, anchors, 404 |
| Performance | Slow network/device, hero asset loading, offscreen media, interactive module failure |
| Evidence | All published metric sources and project status reviewed; no unlabelled demonstration data |

### Definition of done

The design system is applied consistently, the portfolio has complete usable routes and evidence, representative components pass manual interaction checks, responsive layouts have no unintended horizontal overflow, motion has a complete reduced-motion path, and performance is measured against the stated targets. A token validator or a polished screenshot alone cannot establish release readiness.

## 18 · Sources and provenance

The selected direction comes from the owner's explicit choice of Cobalt Light in this conversation. The base palette, Space Grotesk / Inter pairing and Lucide outline treatment preserve that choice. Extended tokens, component dimensions, page ordering, motion values and delivery budgets are original implementation recommendations.

### Standards and technical references

- **S01:** W3C, Understanding Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **S02:** W3C, Understanding Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **S03:** W3C, Understanding Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- **S04:** W3C ARIA Authoring Practices, Modal Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **S05:** MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- **S06:** web.dev, Web Vitals: https://web.dev/articles/vitals
- **S07:** Space Grotesk: https://fonts.google.com/specimen/Space+Grotesk
- **S08:** Inter: https://fonts.google.com/specimen/Inter
- **S09:** Lucide: https://lucide.dev/

### Curated inspiration

- Mobbin styles: https://mobbin.com/explore/sites/styles
- Mobbin Scroll Effects: https://mobbin.com/explore/sites/styles/scroll-effects
- Mobbin Motion: https://mobbin.com/explore/sites/styles/ui-animations
- Mobbin Editorial: https://mobbin.com/explore/sites/styles/editorial
- Mobbin Glass: https://mobbin.com/explore/sites/styles/glass
- Mobbin icons: https://mobbin.com/explore/web/ui-elements/icon
- Mobbin Absolute Blue: https://mobbin.com/colors/meaning/absolute-blue
- 14islands: https://www.14islands.com/
- Lusion: https://lusion.co/
- Obys: https://obys.agency/
- Dennis Snellenberg: https://dennissnellenberg.com/
- Artem Shcherban creator case study: https://tympanus.net/codrops/2026/05/02/designing-against-the-gallery-a-two-year-journey-to-a-layered-portfolio-experience/
- Rauno Craft: https://rauno.me/craft
- Emil Kowalski, Building a Toast Component: https://emilkowal.ski/ui/building-a-toast-component
- Bartosz Ciechanowski, Internal Combustion Engine: https://ciechanow.ski/internal-combustion-engine/
- Transformer Explainer: https://poloclub.github.io/transformer-explainer/
- Distill, How to Use t-SNE Effectively: https://distill.pub/2016/misread-tsne/

Reference pages were researched during 18-19 October 2026. Public Mobbin listings established categories and named entries; signed-in recordings and exact brand asset credits were not verified. Links may evolve. References are inspiration, not assertions that another site's source code, typeface or tokens were copied.

## 19 · Editable decision register

| Decision | Current default | Change only when |
| --- | --- | --- |
| Palette | Cobalt Light | Owner selects a revised direction and contrast is rechecked |
| Typography | Space Grotesk + Inter | Real content reveals a specific readability or identity issue |
| Icons | Lucide 1.75 stroke | A documented asset requirement cannot be met consistently |
| Home project order | Plugin, SiteResolve, research, Axon UI | New evidence or target-role priority justifies reordering |
| Home pinning | Optional single desktop stage | Prototype shows useful explanation and acceptable input/performance |
| Full dark theme | Outside v1 | Separate palette, component-state and chart checks are completed |
| Career details | Actual supplied records only | Owner supplies confirmed history |
| Adoption / research metrics | Source-backed claims only | A newer authoritative result is available |

## 20 · Handoff instruction

Implement this system as one cohesive portfolio. Read the master specification and tokens before changing screens. Preserve the selected Cobalt Light identity. Build the static, accessible content structure first; implement the shared components and states; add authentic project media and source-backed evidence; then add the specified motion and responsive adaptations. Record any necessary deviation instead of silently inventing a second visual system. Do not publish unverified metrics, fictional history or unfinished media placeholders.
