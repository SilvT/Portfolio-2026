# Editorial Specimen Page — Layout Spec

Reference: Font Review Journal, "Sporting Grotesque" (fontreviewjournal.com/sporting-grotesque). Footer directory of other entries excluded.

https://fontreviewjournal.com/sporting-grotesque/

## Core principle

This is a long-form editorial article, not a spec sheet. Hierarchy comes from a strict **claim → evidence** alternation in a single text column, not from grids or cards. Three nested zoom levels build the argument: whole object → component → applied/real-world use.

## Page structure (top to bottom)

1. **Masthead** — site name + minimal nav. Low visual weight, just an anchor.
2. **Title block** — large headline (subject name) + subtitle (creator), small issue-number tag. Below it, a compact metadata list (see Component 1). A link out to the source/purchase.
3. **Lead evidence** — one or two full-width images of the subject "in the wild," shown *before* any commentary. Show, don't tell, first.
4. **Thesis paragraph** — one dense, opinionated paragraph stating the overall take. Appears exactly once, right after the lead images.
5. **Component-level close read** — paged carousel (Component 2), one detail + one caption per slide.
6. **Historic/contextual section** — prose with comparison imagery (same subject vs. contemporaries/predecessors).
7. **Strengths section** — repeated claim+evidence units (Component 3), each proving one strength with a real example.
8. **Weaknesses/quirks section** — mirrors the strengths section structurally, arguing the opposite direction.
9. ~~Footer directory of other entries~~ — excluded from this spec.

## Reusable components

### 1. Metadata block
Fixed-order label/value list, small type, appears once near the top only.
Fields: Name, Author/Creator, Source/Distributor, Category, Year, Reviewer, Date, Link.
Reusable for any subject with provenance.

### 2. Claim + Evidence unit (the atomic block)
```
<short paragraph stating a claim>
<image evidencing the claim>
<caption: credit / source>
```
This single unit, repeated with different claims, makes up almost the entire page. Caption always credits a source — citation is folded into the layout, no separate bibliography.

### 3. Paged detail carousel
One image + one short analytical caption per slide, arrows to navigate. Used only for the component-level (zoomed-in) section. Generalise as "feature-by-feature" or "detail-by-detail" review of any subject.

### 4. Pro/con section pair
Two mirrored sections ("Strengths" / "Quirks"), each built from repeated Claim+Evidence units, arguing opposite directions. Gives the piece a built-in verdict without a separate conclusion.

## Typographic scale

- **Display size** — title only.
- **Body size** — all prose paragraphs.
- **Small/label size** — metadata block and all image captions (muted colour, often italic).
- No more than these three sizes. Hierarchy is produced by size + alternation, not colour blocking or boxes.

## Grid / layout rules

- Single column, generous side margins, max reading width (~700–800px).
- Images may break out wider or full-bleed; text never does.
- No sidebar, no multi-column grid, no cards.
- Never two images or two paragraphs back-to-back for long — always alternate.

## Content ordering logic (reusable regardless of subject)

1. Identify (metadata).
2. Show before telling (lead evidence, no commentary).
3. State the thesis (one paragraph).
4. Zoom into components (carousel).
5. Contextualise (comparisons).
6. Argue strengths (claim+evidence, repeated).
7. Complicate with weaknesses (claim+evidence, repeated, opposite direction).

## To adapt for different content

Keep:
- the claim→evidence alternation as the only content unit
- one interactive module reserved for zoomed-in/detail content
- captions as the sole citation mechanism
- the three-level zoom progression (whole → part → application)

Avoid:
- turning any section into a grid, table, or card layout
- adding a second interactive component
- more than three type sizes
