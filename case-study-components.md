# Case Study Layout Components

Spec extracted from the Sporting Grotesque / Font Review Journal specimen, for reuse across portfolio case studies. Built on a single flex/grid layout, fixed max-width container, one spacing scale. No component should define its own layout logic outside this system.

**This file is written for an agent to generate or modify case study markup/CSS without guessing.** Every component below has a prose description (the "why") and a fenced YAML block (the "contract" — real selector, real slots, real constraints). When the two disagree, the YAML block wins; file an issue against the prose instead of trusting it.

---

## How to use this file (read this first)

- **Source of truth for values:** component tokens here cite the local SCSS variables defined in `src/scss/case-studies/case-study-components.scss` (`$case-*`), **not** the sitewide `src/scss/_variables.scss` tokens. This is deliberate for now — `case-study-components.scss` intentionally stands apart from the sitewide design system to match the Font Review Journal reference. **Known migration debt:** Silvia plans to migrate most `$case-*` tokens into `_variables.scss` once the current visual testing pass is finished. Once that happens, this file's token references need updating — treat every `$case-*` value below as provisional, not permanent.
- **Class names are real, not generic.** Every selector below (`.case-pairing-row`, `.case-split-panel__half`, etc.) is copy-pasteable against the current stylesheet (`src/scss/case-studies/case-study-components.scss`) and matches what's actually shipped in `case-design-system.html`, `case-energy-tracker.html`, `case-marketing-management.html`, and `library-freeze.html`. The `case-` prefix is specific to these four pages today — if this pattern set ever gets promoted to the main case-study templates (`marketing-management.html` etc.), the prefix will need deciding separately. Note `library-freeze.html` doesn't carry the `case-` (or former `specimen-`) prefix in its own *filename* — only `case-design-system.html`, `case-energy-tracker.html`, `case-marketing-management.html` do — but it uses the exact same `.case-*` CSS classes as the other three.
- **Status field:** every component below has `status: verified` (used in real, live HTML on at least one of the four pages in this set — copy it with confidence) or `status: unverified` (CSS exists, zero HTML usage — the shape is designed but untested; verify it renders/behaves as expected before shipping, don't assume it's correct).
- **Media slot type:** several components accept visual content in a slot. All of them share one definition — see [Shared: Media Slot](#shared-media-slot) — rather than each component inventing its own list of accepted types.
- **Theming is partial, not sitewide.** `data-theme` on `.case-page` currently **only** recolours `.case-title-block`'s background (see Title Block's `theme_backgrounds`). No other component — captions, stage, pairing rows, split panel — is theme-aware. Don't assume a component responds to `data-theme` unless its section below says so explicitly.

---

## Global layout

```yaml
component: page-shell
status: verified
selector: .case-page
wrapper: .case-article
tokens:
  max_width: $case-max        # 1550px
  page_margin: $case-page-margin          # 40px desktop
  page_margin_mobile: $case-page-margin-mobile  # 20px, @include breakpoint(mobile)
  gutter: $case-gutter        # 24px
  space_section: $case-space-section              # 96px, desktop
  space_section_mobile: $case-space-section-mobile  # 56px, @include breakpoint(mobile)
rhythm_rule: ".case-article > * + * { margin-top: $case-space-section }"
full_bleed_pattern: "margin-inline: calc(50% - 50vw)"  # used by .case-title-block, .case-stage
```

- Every direct child of `.case-article` gets `margin-top: $case-space-section` automatically via `> * + *` — no component should set its own top margin to create section rhythm.
- Exception: `.case-title-block` resets the next sibling's margin to `0` (`.case-title-block + * { margin-top: 0 }`) because the title block already carries its own bottom padding.
- Full-bleed components (title block, stage) break out of `.case-article`'s max-width via `margin-inline: calc(50% - 50vw)` plus negative margins matching the page margin — see each component's own block for exact values.

---

## Shared: Media Slot

Any component slot that can hold visual content (not just text) accepts one of these types. Components reference this instead of redefining their own list.

```yaml
type: media-slot
accepts: [image, carousel, video, none]
rules:
  image:
    tag: img
    sizing: "width: 100%; display: block;  object-fit: contain within slot width"
    alt: required, descriptive (see Accessibility section)
  carousel:
    implementation: "Swiper (swiper@12), .new-carousel.swiper > .new-container.swiper-wrapper > .new-slide.swiper-slide"
    required_children: [.swiper-button-prev, .swiper-button-next, .swiper-pagination]
    image_class_inside_slide: .cs-carousel-img
    js_init: "see case-*.html / library-freeze.html <script type=module> block — instantiates Swiper per .new-carousel.swiper found on the page, modules [Pagination, Navigation]"
    width_rule: "the carousel element itself (.new-carousel) is NEVER full-bleed — always width-capped and centred within whatever container holds it (e.g. max-width: 900px inside .case-stage). A carousel's own width stays inside the grid/content column at all times. An enclosing section (like .case-stage) is allowed to have a full-bleed BACKGROUND — that's a section-background effect, not the carousel being full-bleed. Don't widen .new-carousel/.new-container/.new-slide to span the viewport even inside a full-bleed section."
  video:
    status: theoretical — no specimen page currently uses a video slot; CSS (.case-pairing-row__left img, video / .case-split-panel__half img, video) already targets video the same as img, but unverified in practice
  none:
    rule: "the slot's column width is still reserved as empty space — see component 9's alignment rule. Never collapse the row to fewer columns just because a slot is empty."
```

**Known components currently exercising this type:** Split Panel (component 3, either panel), Pairing Row (component 9, left slot only — right slot is text/image, not full media-slot).

---

## 1. Label + Content (atomic unit)

The base pattern several other components wrap, including the new TL;DR component below.

```yaml
component: label-content
status: verified
selector: .case-label  # the label half; the content half has no shared wrapper class today — each parent component (e.g. .case-tldr) styles its own content element directly
tokens:
  font: $case-font-mono       # 'Anonymous Pro', monospace
  font_size: 12px
  font_weight: 700
  text_transform: uppercase
  letter_spacing: 0.05em
  color: $case-ink-soft       # #6b6b6b
  margin_bottom: 16px
```

- `.case-label` typography is a single fixed style — do not vary size/weight/colour per section.
- There is no single `.case-content` class; each component that uses this pattern (e.g. `.case-tldr-content`) defines its own content-side styling appropriate to that component's role. Don't invent a generic `.case-content` class without checking whether the component you're building actually needs component-specific content styling (most do — see TL;DR vs. Phase Rail's challenge/learning labels, which both use `.case-label` but style their content completely differently).

### 1a. Inline label (variant)

```yaml
component: inline-label
status: verified
example_page: library-freeze.html
selector: .case-label--inline
tokens:
  font: $case-font-mono
  font_size: 15px
  font_weight: $weight-bold   # from _variables.scss
  text_transform: none        # overrides .case-label's uppercase
  letter_spacing: normal      # overrides .case-label's 0.05em
  color: $case-ink
  margin_right: 0.5em
```

A bold monospace marker that sits inline at the start of a sentence, inside a `<span>` within a `<p>` — not a standalone block like the base `.case-label`. Used for a short lead-in word (e.g. "TL;DR ") directly before flowing body copy, in the same paragraph. Typography reference: the lettered "A."/"B." markers in the Sporting Grotesque "Musings & References" section (see `case-study-library-freeze-layout.md`). Sized at 15px specifically to sit comfortably next to `.case-prose p`'s 17px Georgia body text — the base `.case-label`'s 12px would read too small next to body copy at this weight.

---

## 1.5. TL;DR

```yaml
component: tldr
status: verified
selector: .case-tldr
example_page: case-design-system.html
structure:
  - .case-label            # "TL;DR" — reuses component 1's label style exactly
  - .case-tldr-content     # the summary paragraph
tokens:
  max_width: 640px
  content_font: $case-font-display   # 'Bricolage Grotesque'
  content_font_size: 18px
  content_line_height: 1.5
  content_color: $case-ink-soft      # muted — this block must stay visually quieter than body prose
position_rule: "directly after .case-title-block, before the first .case-split-panel or text block — optional per page, but when present it is always the first thing after the hero"
```

Usage: a one- or two-sentence career/project arc summary, quieter than everything that follows it. Optional — only `case-design-system.html` currently uses it; the other three pages skip straight from title block to lead evidence.

**Second TL;DR pattern exists — `library-freeze.html` uses a different shape.** Two variants were tried for that page before landing on a third: first a simple `.case-tldr` (like above), then a 4-cell Index Grid variant (built, then explicitly reverted — see Open Questions), and finally a single flowing paragraph using the Intro Text Block pattern (component 9a) with an [inline label](#1a-inline-label-variant) lead-in instead of `.case-label`/`.case-tldr-content`:

```yaml
component: tldr-narrative-variant
status: verified
example_page: library-freeze.html
selector: .case-pairing-row.case-pairing-row--text-only.case-prose   # same markup as 9a, with a .case-label--inline span inside the <p>
structure:
  right_only:
    - "p > span.case-label--inline (e.g. \"TL;DR\") + plain text"
```

**Why this shape, not the simpler `.case-tldr`:** per `case-study-library-freeze-layout.md`, this is "the narrative TL;DR, not a metadata recap" — role/company/stack already live in the hero's Information sidebar, so a four-cell fact sheet (the Index Grid attempt) read as a second spec sheet repeating what the sidebar already said. A single flowing paragraph reads as "here's the story" instead, which is what a 10-second skim actually wants. **Keep this paragraph's substance distinct from the Intro Text Block that follows it:** TL;DR is outcome-first compression (problem → decision → outcome, compressed); Intro is scene-setting detail (texture and specifics that don't fit a 10-second read). If the two start saying the same thing, one of them is redundant — rewrite, don't just vary the wording.

**Which TL;DR pattern to use for a new page:** no fixed rule yet — `case-design-system.html` and `library-freeze.html` made different calls. If the summary is genuinely a single short sentence, the simple `.case-tldr` block is less markup. If it needs a full sentence or two of narrative compression, use the paragraph variant. Ask Silvia if unsure rather than defaulting to either.

---

## 3. Two-Column Split Panel

```yaml
component: split-panel
status: verified
selector: .case-split-panel
structure:
  - .case-split-panel__half   # left
  - .case-split-panel__half   # right
tokens:
  columns: "1fr 1fr"
  gap: $case-gutter   # 24px
  stacks_to_single_column: "@include breakpoint(tablet)"   # 1024px
slots:
  left: media-slot    # see Shared: Media Slot — image | carousel | video | none
  right: media-slot
```

Two equal panels side by side, each self-contained. Used for each page's lead-evidence pair, directly after the title block (or after the TL;DR, when present).

**Carousel as a panel:** either panel can be a carousel instead of a static image — e.g. a set of screenshots cycling on one side while the other panel holds a single static image. Same 50/50 weighting as any other Split Panel; the carousel doesn't get special sizing for having multiple images inside it. (Not yet exercised on any live page — the pages built so far all use `image | image`. Verify in-browser the first time this combination ships.)

Usage: before/after, two product states, paired examples, lead evidence. Stacks to full-width single column on mobile/tablet.

---

## 4. Full-Bleed Image Block

```yaml
component: image-block
status: verified
selector: .case-image-block
tag: figure  # with figcaption using .case-caption
slot: media-slot  # image confirmed in use; carousel/video untested here
```

One image, no card/frame, nothing else on the same row.

Props: `src`, `alt`, `caption` (via `<figcaption class="case-caption">`).

Usage: breather/proof beat between text sections, or the single most important visual beat on the page (used once per page in the pages built so far, in the Strengths section). Always preceded and followed by the standard section spacing token — never tight against adjacent text.

---

## 5. Display Statement

```yaml
component: display-statement
status: verified
selector: .case-display-statement
tokens:
  max_width: 900px
  font: $case-font-display
  font_size: "clamp(26px, 3vw, 40px)"
  font_size_mobile: "clamp(22px, 6vw, 30px)"   # @include breakpoint(mobile)
  font_weight: 500
  line_height: 1.05
  letter_spacing: -0.01em
  text_align: center
  color: $case-ink
```

Large tight-leading headline, stacked lines, centred, minimal decoration.

Props: `text` (string — can include line breaks via markup, no `lines` array prop exists in the real implementation, unlike the original doc draft).

Usage: pull-quotes, key takeaways, section dividers. Sparingly — 1–2 per page max. `case-marketing-management.html` uses it twice (thesis statement + a CEO quote) — this is the documented ceiling, not a target to always hit.

**Decision rule (new — this was previously undocumented and caused confusion):** if the text is the page's *opening* thesis/intro statement, prefer the Intro Text Block (new sub-component under 9) instead of Display Statement — `case-design-system.html` was migrated from Display Statement to a plain text block for exactly this reason (see changelog 2026-10-07). Reserve Display Statement for mid-page pull-quotes and emphasis, not the page's first substantial text.

---

## 6. Index Grid (repeating-unit grid)

```yaml
component: index-grid
status: unverified
selector: .case-index-grid
cell_selector: .case-index-grid__cell
tokens:
  grid: "repeat(auto-fill, minmax(160px, 1fr))"
  gap: $case-gutter
```

Fixed-shape cells, same label position, swappable content. Replaces ad hoc lists.

```
.case-index-grid
└── repeat(auto-fill, minmax(160px, 1fr))
    └── .case-index-grid__cell
        └── .case-label (content below it — no shared content class, see component 1 note)
```

Props: `items: [{ label, content }]`.

Usage: tech stack, team roles, artefact index, enumerable sets. **CSS exists, zero HTML usage across any of the 4 pages in this set — unproven. Build a throwaway test instance and verify in-browser before using this on real content.**

---

## 7. Phase Rail (timeline component)

```yaml
component: phase-rail
status: unverified
selector: .case-phase-rail
row_selector: .case-phase-row
elements:
  index: .case-phase-row__index
  title: .case-phase-row__title
  meta: .case-phase-row__meta       # hidden @include breakpoint(mobile)
  outcome: .case-phase-row__outcome
  toggle: .case-phase-row__toggle
  detail: .case-phase-row__detail   # display:none by default, display:grid + .is-open
tokens:
  grid_desktop: "48px 1fr auto auto"
  grid_mobile: "32px 1fr auto"   # @include breakpoint(mobile), meta column dropped
  detail_grid: "1fr 1fr"          # 1fr @include breakpoint(mobile)
```

Rules:
- Collapsed rows are slim, single-line, identical styling across all phases regardless of state.
- All phases visible in collapsed form simultaneously — never hide phases behind pagination.
- Only `.case-phase-row__detail` toggles (`display:none` → `display:grid` via `.is-open`); the row's core shape never changes size/position on expand.
- Outcome text is plain, not a chip/pill.

Props: `phases: [{ index, title, duration, outcome, challenges: [], keyLearning }]`.

Usage: project timeline/milestones. **CSS exists, zero HTML usage — unproven, same caveat as Index Grid.** No JS toggle logic has been written for `.case-phase-row__toggle` / `.is-open` yet either — confirm whether this needs new JS or can reuse the existing `accordion.js` pattern before building.

---

## 8. Dense Footer/Index Grid

```yaml
component: footer-grid
status: unverified
selector: .case-footer-grid
tokens:
  grid: "repeat(auto-fit, minmax(120px, 1fr))"
  gap: $case-gutter
  font: $case-font-display
  color: $case-ink
```

End-of-page grid, short items, same type treatment, varying scale per item.

Usage: closing gallery/colophon. **CSS exists, zero HTML usage — unproven.**

---

## 9. Pairing Row (Image + Text, or Text alone)

```yaml
component: pairing-row
status: verified
selector: .case-pairing-row
modifiers:
  text_only: .case-pairing-row--text-only
structure:
  left: .case-pairing-row__left    # media-slot type, or OMITTED (see alignment rule)
  right: .case-pairing-row__right  # text or image
tokens:
  gap: "$case-gutter * 2"   # 48px
  left_width: $case-image-support-width   # 22%
  text_only_max_width: 820px
  align_items: flex-start
  stacks_at: tablet   # 1024px, flex-direction: column, gap: $case-gutter
typography_wrapper: .case-prose   # applied as a sibling class alongside .case-pairing-row, styles h2/h3/p inside __right
```

A two-column row where the left slot is a media slot (image, carousel, video) or omitted, and the right slot is always content (text or image).

Valid combinations:
| Left | Right |
|---|---|
| Image | Text block |
| Image | Image |
| (omitted) | Image |
| (omitted) | Text block |
| Carousel | Image |
| Big image | Big image → **this is the Split Panel, component 3, not this component** |
| — | Full-bleed → **breaks out entirely, see component 4** |

**Plain text blocks are valid and expected.** Not every text block needs an image partner — `.case-pairing-row__left` is omitted entirely (not just visually empty) whenever there's nothing to pair it with. Add `.case-pairing-row--text-only` as a modifier class when doing this (it caps `__right`'s `max-width` at 820px).

**Alignment rule — all text blocks share one left edge, paired or not.** The right slot's text must start at the same horizontal position whether or not a left image is present. Implementation: `.case-pairing-row--text-only::before` reserves an empty spacer the same width as `.case-pairing-row__left` (`flex: 0 0 $case-image-support-width`), hidden at the `tablet` breakpoint where the layout stacks to a single column anyway. **Do not solve this by giving `__right` a fixed `margin-left` instead** — the spacer approach is what's implemented and verified (2026-10-07); a margin would desync from `$case-image-support-width` if that token ever changes.

**Top-edge alignment rule (applies whenever the left slot holds an image):** the image's top edge aligns to the top line of the text/content in the right slot — `align-items: flex-start` on the row. Never vertically centred against the whole block.

Implementation note: `.case-pairing-row__left` should not stretch or re-centre as `__right` grows — top-aligned and static, left alone once placed. No `position: sticky` implementation exists today even though the original doc draft floated it as an option — don't assume it's wired up.

### 9a. Intro Text Block (variant — first block only)

```yaml
component: intro-text-block
status: verified
example_page: case-design-system.html
selector: .case-pairing-row.case-pairing-row--text-only  # same markup as a plain text block — "intro" is a usage rule, not a separate CSS class
structure:
  right_only:
    - h2   # larger than any other text block's heading — no separate CSS class exists for this yet; verify actual heading size against the live page before treating this as a fixed token
    - p
```

A plain text block (component 9, right slot only) used specifically for the page's opening thesis statement. **Implementation gap:** there is currently no dedicated `.case-pairing-row--intro` class or heading-size override in `case-study-components.scss` — `case-design-system.html`'s converted intro block uses `.case-prose`'s standard paragraph styling, not a distinct larger heading. If "larger heading for the intro only" is still wanted, that CSS needs to be written; as shipped today, the intro block is visually identical to any other plain text block except for its position (first, right after TL;DR/title block).

Rules:
- One per page, and it must be the first text block in the composition.
- Still governed by the Text-to-break ratio rule (below) — being first doesn't exempt it from break cadence.

---

## Image sizing and proportion tokens

| Role | Width | Behaviour |
|---|---|---|
| Small proof image (Pairing Row left slot) | `$case-image-support-width` = 22% of row | Supporting evidence only, never equal to its text partner |
| Paired big images (Split Panel, component 3) | 50% / 50% | Reserved for two genuinely equal things being compared |
| Full-bleed image (component 4) | 100% | Sparingly used, always alone on its row, the single most important visual beat on the page |

Rules:
- **Never 50/50 for image + text.** Equal split is reserved for image-vs-image comparison (Split Panel) only.
- **Native aspect ratio is preserved.** Each image uses natural sizing within its slot width (`width: 100%; display: block`); row height is a consequence of width × native ratio.
- **Exception — paired/comparison images match each other's ratio** when placed side by side specifically to be compared.
- **No stretching to match a neighbour.** A small proof image never stretches to match its adjacent text block's height; only the top edge is locked (see alignment rule, component 9).
- **Orientation follows role, not a fixed rule.**

There is no "medium" size — a size jumps from thumbnail-scale (22%) straight to half- (50%) or full-width (100%). When adding a new image, pick one of the three roles — don't interpolate a custom width.

---

## Section heading

```yaml
component: section-heading
status: verified
selector: .case-section-heading
tokens:
  font: $case-font-display
  font_size: 36px
  font_size_mobile: 28px   # @include breakpoint(mobile)
  font_weight: 500
  color: $case-ink
  padding_top: 40px
  border_top: "1px solid $case-line"
```

Usage: the `<h2>` marking a new major section ("Context: What It Replaced", "Strengths", "Quirks" in all 3 pages that have content — `library-freeze.html` is being built section by section and doesn't have these yet). Not in the original 9-component draft — added here because it's a real, repeated, undocumented pattern.

---

## Stage (dark section with a width-capped carousel)

**Naming note:** only the section's background is full-bleed. The carousel inside it never is — see the carousel width rule in [Shared: Media Slot](#shared-media-slot). Don't generalize from this component to "carousels can be full-bleed."

```yaml
component: stage
status: verified
selector: .case-stage
caption_selector: .case-stage-caption
structure:
  - .new-carousel.swiper   # see Shared: Media Slot > carousel — width-capped, NOT full-bleed
  - .case-stage-caption
tokens:
  background: $case-stage-bg   # #3a3a3a — this is what's full-bleed, not the carousel
  margin_bottom: $case-space-section
  margin_inline: "calc(50% - 50vw)"   # full-bleed — applies to .case-stage itself (the section/background), never to .new-carousel
  padding: "60px 40px"
  padding_mobile: "40px 20px"   # @include breakpoint(mobile)
  carousel_max_width: 900px   # .new-carousel is capped and centred (margin: 0 auto) inside the full-bleed section
  pagination_bullet_active: $case-accent   # #fcd300
```

Usage: the "Zooming In" / component-level close-read section — one dark full-bleed section per page, with a width-capped carousel centred inside it, always preceded by a short `.case-pairing-row--text-only` intro line (1 sentence). Not in the original 9-component draft — added here because it's a real, repeated, undocumented pattern, used identically across all 3 live pages.

---

## Title Block

```yaml
component: title-block
status: verified
selector: .case-title-block
structure:
  main: .case-title-main       # h1 + .case-subtitle
  image: .case-title-image     # positioned absolute, top-right
  side: .case-title-side
    info: .case-info
      issue_number: .case-issue-number   # e.g. "01", "02", "03", "04" — one per page, sequential in page-creation order (library-freeze.html is "04")
      label: .case-info-label             # "Information"
      metadata: "dl > (dt, dd) pairs, grouped in multiple <dl> blocks with a border-bottom divider between groups, last group's border removed"
tokens:
  grid: "1fr 15vw"
  grid_tablet: "1fr"   # @include breakpoint(tablet), side stacks below main
  gap: 40px
  h1_font_size: 100px
  h1_font_size_tablet: 72px
  h1_font_size_mobile: 48px
  h1_line_height: 0.92
  full_bleed: "negative margin: -$case-page-margin, padding: 40px $case-page-margin 80px"
  # Note: the border-bottom shown in earlier drafts is currently commented
  # out in case-study-components.scss, replaced by margin-bottom: 2rem.
theme_backgrounds:
  default: $blue-light   # fallback — any page with no data-theme, or an unrecognised value, still gets a themed title block rather than a transparent one
  blue: $blue-light       # from _variables.scss — the one place case-study-components.scss reaches into the sitewide tokens today
  green: $green-light
  neutral: $cream
  brick: $brick-light
  bronze: $bronze-light
  mauve: $mauve-light
  red: $color-red-light   # no $red-light shorthand exists in _variables.scss, unlike the other families — this is the one exception
```

**Long-title modifier:** `.case-title-block--long-title` (added for `library-freeze.html`'s "Library Freeze System & Changelog Plugin", which wrapped to 3 lines at the default h1 size and collided with the absolutely-positioned cover image). Scales `h1` down (64px / 52px tablet / 32px mobile, vs. the default 100px / 72px / 48px) and, at the `mobile` breakpoint only, switches `.case-title-image` from `position: absolute` to static/stacked above the title instead of trying to out-shrink the collision. **Note (2026-10-07):** Silvia has since said she's fine with the h1 visually overlapping the cover image as a deliberate design choice (readability permitting) — so this modifier is available but not mandatory; don't apply it automatically just because a title is long. Only use it if the overlap actually breaks readability or Silvia asks for the text to be clear of the image.

Metadata `<dl>` content observed across the 3 live pages (not a fixed schema — these are the fields used so far, not a required set): Project Type, Role, Company, Team, Stack, Timeline. All pages use exactly these 6, in this order, across 3 `<dl>` groups of 2 each (Project Type/Role, Company/Team, Stack/Timeline) — treat this as the working convention, not an enforced rule. **Changed from "Name" to "Project Type" (2026-10-07):** the sidebar's first field used to repeat the h1's text verbatim (pure redundancy — confirmed on all 4 pages). Replaced with a short category instead: System, Product, Design Ops / Plugin, etc. — a word or short phrase naming what kind of thing the project is, not the project's name again.

**Supersedes "Hero Sample" from the original draft.** The original doc described a separate "Hero Sample" component — full-bleed, flat background, one oversized element, optional caption — that was never built (no CSS, no HTML usage anywhere). Title Block is what that idea became in practice: full-bleed, flat theme-coloured background, oversized h1. Merged as one component (2026-10-07) rather than kept as two, since nothing in the codebase distinguishes them.

**Open question carried over from the merge:** Hero Sample's original spec allowed reuse "1–2 other times per page for a major statement," never back-to-back with another image-heavy block. Title Block, as built, is only ever used once, as the page opener — it always carries the metadata sidebar, which wouldn't make sense reused mid-page. If a reusable full-bleed statement block (image/headline, no metadata sidebar) is still wanted for mid-page use, that's a new, smaller component to design — not a reason to reuse the opener's markup as-is.

---

## Masthead

```yaml
component: masthead
status: verified
selector: .case-masthead
tag: nav
aria_label: "Case study navigation"
structure:
  logo_link:
    href: "/"
    aria_label: "Back to home"
    img: { class: .case-logo, src: /logo-filled.svg }
  original_link:
    conditional: true
    href: "/{slug}.html"    # e.g. /energy-tracker.html, /marketing-management.html
    text: "View original case study →"
```

**Conditional rule:** the "View original case study →" link only appears when a real, published (non-specimen) case study page already exists for that project. `case-energy-tracker.html` and `case-marketing-management.html` both link back to their live counterparts (`/energy-tracker.html`, `/marketing-management.html`). `case-design-system.html` omits the link entirely — there is no published design-system case study page to link to yet. When building a new specimen page, check whether a real counterpart page exists before deciding whether to include this link.

---

## Numbered Caption

```yaml
component: numbered-caption
status: verified
selector: .case-caption
number_selector: .case-caption-num
tag: "p, or figcaption inside a <figure> (component 4)"
format: "№{NN} — {description}"
numbering_rule: "sequential across the entire page, starting at №01, including both .case-caption instances AND .case-stage-caption instances in reading order — NOT per-section"
tokens:
  font: $case-font-mono
  font_size: 13px
  color: $case-ink-soft
  number_color: $case-ink
  number_weight: 700
```

**Numbering gotcha (caused a real bug, fixed 2026-10-07):** when a numbered image/caption is removed or added anywhere on the page, every subsequent `№NN` on that same page must be renumbered to stay sequential with no gaps — this is manual today, there is no auto-numbering mechanism. When `case-design-system.html`'s lead Split Panel (№01, №02) was replaced with the TL;DR component, every caption from №03 onward had to be manually decremented by 2 to close the gap. Check the full sequence after any caption-affecting edit, don't just renumber the ones adjacent to your change.

Not in the original 9-component draft — added here because it's the single most-repeated pattern across all 3 live pages (used on nearly every image).

---

## Section Rhythm (rule, not a component)

- One component type per row/section — never mix e.g. an image block and a text block side by side outside the defined Split Panel component.
- Fixed vertical spacing token between every top-level section (`$case-space-section`), applied via the `.case-article > * + *` rule — no component sets its own top margin.

### Text-to-break ratio

How many text blocks can run before a visual interruption (image break, full-bleed, Display Statement, or Stage) is required:

- **Cap: 2 consecutive text blocks before a break.** Never three in a row.
- **Most breaks come after just 1 block.** Two in a row is the exception, not the default.
- **Break size scales with what preceded it:**
  - After a short, caption-length block → a small/medium image break is enough
  - After a genuine reading-length paragraph → use a full-bleed break, not a small one
- **A Display Statement (component 5) counts as a valid break**, not just images.
- **The rule is reading-fatigue, not block-counting.** A single long-form block is already at the cap.

This keeps density in check even on long case studies: the reader is never more than ~2 blocks away from a visual checkpoint.

---

## Accessibility (not in the original draft — filling a real gap)

No accessibility rules existed in the original version of this file. The sitewide rules in the project's `CLAUDE.md` apply here too; the specimen-specific application is:

- **Alt text:** every `img` inside a media-slot needs a real, descriptive `alt` — observed convention across all 3 live pages is a full sentence describing what's shown and why it matters in context, not a filename-derived label (e.g. `alt="Published styleguide site showing the neutral and primary colour ramps"`, not `alt="ds-hero.png"`).
- **Contrast:** `$case-ink` (#202020) and `$case-ink-soft` (#6b6b6b) on `$case-bg` (#ffffff) — verify both against WCAG AA (4.5:1 body, 3:1 large text ≥24px/18.66px bold) before reusing either colour at a new size/weight combination; don't assume an existing pairing is safe at a different scale.
- **Focus states:** `.case-masthead a:focus-visible`, `.case-phase-row__toggle:focus-visible`, and the Swiper nav buttons (`.swiper-button-prev/next:focus-visible` inside `.case-stage`) all have explicit visible focus outlines defined in `case-study-components.scss`. Any new interactive element added to this component set needs the same.
- **Reduced motion:** no `prefers-reduced-motion` guard currently exists anywhere in `case-study-components.scss` — the Swiper carousel's slide transition is the only animation in this component set, and it is **not currently guarded**. This is a gap against the sitewide CLAUDE.md rule ("every animation must respect prefers-reduced-motion") — flag this to Silvia rather than silently fixing or silently ignoring it.
- **Heading hierarchy:** confirmed pattern across live pages is `h1` (title block) → `h2` (section heading / stage intro, when present) → `h3` (pairing row content headings). No component skips a level in the 3 live pages; preserve that when adding new sections.

---

## Open questions for Silvia (unresolved as of 2026-10-07)

- Is a reusable, no-metadata full-bleed statement block (the mid-page reuse case Hero Sample originally described) still wanted, separate from Title Block? If yes, it needs its own component spec and CSS — nothing today covers "big flat-colour statement block, not the page opener."
- Index Grid, Phase Rail, Footer Grid (components 6, 7, 8) have CSS but no usage or worked example — what real content would first exercise each of these? Without a concrete use case it's hard to verify the CSS is even correct.
- Phase Rail's expand/collapse has no JS — reuse `accordion.js`'s pattern, or does this need its own?
- Intro Text Block (9a) was asked to have "a larger heading" but no CSS implements that yet — still wanted, or is the current (visually identical to a normal text block) version fine?
- Video as a media-slot type has supporting CSS but zero real usage — any case study content planned that would need it?
- Should `$case-*` tokens migrate to `_variables.scss` all at once after the current visual testing pass, or incrementally per-component? Affects how this doc's token references get updated.
