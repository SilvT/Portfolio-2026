# SCSS Architecture

## File Structure

```
src/scss/
├── _main.scss              # Root entry point - imports everything
├── _variables.scss         # Design tokens (colors, fonts, spacing) + fadeInUp/fade-in-up + stagger-children
├── breakpoints.scss        # Responsive breakpoint mixins
├── typography.scss         # Type system styles
├── accesibility.scss       # Accessibility utilities
├── iconoir-custom.css      # Auto-generated icon subset (npm run icons)
├── archive/                # Retired files kept for reference, not imported anywhere
│
├── landing-page/           # Landing page styles
│   ├── _landing-page.scss     # Entry point + base reset + section styles
│   ├── _animations.scss       # stagger-fade-in mixin + reduced-motion variant
│   ├── _project-rows-new.scss # Layout/grid for the project rows section
│   ├── new-about.scss         # About section (current; supersedes archived about.scss)
│   ├── nav-bar.scss
│   ├── project-cards.scss     # Themed project card styles (blue/green/etc.)
│   ├── footer.scss
│   └── scroll-hinter.scss
│
└── case-studies/           # Case study page styles
    ├── _case-study.scss        # Entry point + layout + data-theme overrides
    ├── blocks.scss              # cs-* block/column/grid components
    ├── case-study-components.scss # case-* editorial components (masthead, tldr, phase rail, etc.)
    ├── hero.scss
    ├── carousel.scss
    ├── accordion.scss
    ├── side-nav-bar.scss
    ├── project-navigation.scss
    ├── breadcrumbs.scss
    ├── lightbox.scss
    ├── line-breaker.scss
    ├── switch.scss
    ├── scroll-to-top.scss
    └── tldr-mascot.scss
```

---

## Import Flow

```
_main.scss
    ├── _variables.scss
    ├── breakpoints.scss
    ├── typography.scss
    ├── accesibility.scss
    ├── landing-page/_landing-page.scss
    │       └── imports: new-about, footer, nav-bar, project-cards,
    │                     project-rows-new, scroll-hinter, case-studies/switch
    └── case-studies/_case-study.scss
            └── imports: blocks, breadcrumbs, lightbox, side-nav-bar, hero,
                         line-breaker, carousel, accordion,
                         case-study-components, project-navigation,
                         tldr-mascot, scroll-to-top
```

`landing-page/_animations.scss` is imported directly by whichever component
needs `stagger-fade-in` (not globally via `_landing-page.scss`).

---

## Key Patterns

### 1. Entry Point Files (underscore prefix)
Files prefixed with `_` are entry points that aggregate imports:
- `_main.scss` - Root entry, imports global + page modules
- `_landing-page.scss` - Imports all landing page components
- `_case-study.scss` - Imports all case study components

Not every underscore-prefixed file is an aggregator (e.g. `_animations.scss`,
`_project-rows-new.scss` are regular component partials using the Sass
underscore-partial convention, not import hubs).

### 2. Variables & Design Tokens
All in `_variables.scss`:
- **Colors:** Numbered scale (100-600) with shorthand aliases
- **Typography:** Font families, sizes ($font-xs to $font-4xl), weights
- **Spacing:** Rem-based scale ($space-4 to $space-120)
- **Animation primitives:** `fadeInUp` keyframe, `fade-in-up` mixin, `stagger-children` mixin (shared across landing + case study components — duplicated-by-name `fadeInUp` keyframe also exists in `_animations.scss`, both compile to the same global CSS `@keyframes fadeInUp`, harmless but don't rely on them staying separate)

### 3. Breakpoints
Use the `breakpoint()` mixin from `breakpoints.scss`:
```scss
@include breakpoint(mobile) { ... }
@include breakpoint(tablet) { ... }
```
Breakpoints: small-mobile, mobile, tablet, desktop, laptop, large-desktop

### 4. Component Organization
Each component file is self-contained:
- Imports shared dependencies (`variables`, `breakpoints`, `typography`)
- Contains all styles for that component
- Handles its own responsive behavior

### 5. Theming
Case studies support themes via `data-theme` attribute:
- `data-theme="blue"`, `"green"`, `"neutral"`, `"mauve"`, `"brick"`, `"bronze"`

Theme overrides are defined in `_case-study.scss`.

### 6. Naming convention split (known, not a bug)
Case study components use two different class prefixes:
- `cs-*` in `blocks.scss` (block/column/grid primitives)
- `case-*` in `case-study-components.scss` (editorial components: masthead, tldr panel, phase rail, etc.)

These don't collide and both are live. Unifying them would touch multiple
HTML pages (marketing-management, energy-tracker, design-system,
library-freeze) and JS modules (`phase-rail-accordion.js`,
`lightgallery.js`) — treat as a deliberate future cleanup, not something to
fix opportunistically mid-task.

### 7. Archive
`archive/` holds files removed from the active import tree but kept for
reference instead of deleted outright (e.g. `about.scss`, superseded by
`new-about.scss`). Nothing in `archive/` is imported — if you need to revive
one, move it back out and re-add the `@use`.

---

## Naming Conventions

| Prefix | Usage |
|--------|-------|
| `cs-` | Case study block/grid primitives (cs-block, cs-section-heading) |
| `case-` | Case study editorial components (case-masthead, case-tldr) |
| `section-` | Landing page sections (section-about, section-project) |
| `$color-{name}-{number}` | Color scale variables |
| `$space-{number}` | Spacing variables |
| `$font-{size}` | Font size variables |

---

## New Components and Testing

For all new components and testing, create a new separate scss file named
after its purpose and index it to its parent section (`_landing-page`,
`_case-study`, or `_main`).

---

## Responsiveness

Contextual/component-scoped media queries (`@include breakpoint(){ }`) are
preferred. Decentralised approach to breakpoints and responsiveness.
