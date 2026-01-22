# SCSS Architecture

## File Structure

```
src/scss/
├── _main.scss              # Root entry point - imports everything
├── _variables.scss         # Design tokens (colors, fonts, spacing, animations)
├── breakpoints.scss        # Responsive breakpoint mixins
├── typography.scss         # Type system styles
├── accesibility.scss       # Accessibility utilities
│
├── landing-page/           # Landing page styles
│   ├── _landing-page.scss  # Entry point + base reset + section styles
│   ├── about.scss
│   ├── nav-bar.scss
│   ├── project-cards.scss
│   ├── footer.scss
│   └── scroll-hinter.scss
│
└── case-studies/           # Case study page styles
    ├── _case-study.scss    # Entry point + layout + themes
    ├── hero.scss
    ├── blocks.scss
    ├── carousel.scss
    ├── accordion.scss
    ├── side-nav-bar.scss
    ├── breadcrumbs.scss
    ├── lightbox.scss
    ├── line-breaker.scss
    ├── switch.scss
    └── old-blocks.scss     # Legacy (being cleaned up)
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
    │       └── imports: about, footer, nav-bar, project-cards, scroll-hinter
    └── case-studies/_case-study.scss
            └── imports: blocks, breadcrumbs, lightbox, side-nav-bar,
                         hero, line-breaker, carousel, accordion
```

---

## Key Patterns

### 1. Entry Point Files (underscore prefix)
Files prefixed with `_` are entry points that aggregate imports:
- `_main.scss` - Root entry, imports global + page modules
- `_landing-page.scss` - Imports all landing page components
- `_case-study.scss` - Imports all case study components

### 2. Variables & Design Tokens
All in `_variables.scss`:
- **Colors:** Numbered scale (100-700) with shorthand aliases
- **Typography:** Font families, sizes ($font-xs to $font-4xl), weights
- **Spacing:** Rem-based scale ($space-4 to $space-120)
- **Animations:** Shared keyframes and mixins

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
- `data-theme="blue"` - Blue color scheme
- `data-theme="green"` - Green color scheme
- `data-theme="neutral"` - Neutral/cream scheme

Theme overrides are defined in `_case-study.scss`.

---

## Naming Conventions

| Prefix | Usage |
|--------|-------|
| `cs-` | Case study components (cs-block, cs-tag, cs-hero) |
| `section-` | Landing page sections (section-about, section-project) |
| `$color-{name}-{number}` | Color scale variables |
| `$space-{number}` | Spacing variables |
| `$font-{size}` | Font size variables |

---

## Legacy Code

`old-blocks.scss` contains deprecated styles being phased out. Avoid adding new styles here.


---

## New Components and testings

For all new components and testing, create a new separate scss file named after its purpouse and index it to it's parent section (_landing-page or _case-study, or _main).

---

##  Responsiveness

Contentual or Component-scoped Media Queries (`@include breakpoint(){ }` in our case) are prefered. Decentralised approach to breakpoints and responsiveness.