# JavaScript Architecture

## Overview

Modular vanilla JavaScript, no framework. Each module in `src/js/modules/`
is self-contained and exports one or more `init*` functions. Modules reach
the page in two different ways — know which one a module uses before adding
a new import:

1. **Landing page (`index.html`)** loads a single bundled entry point,
   `src/js/main.js`, which statically imports and calls most modules.
2. **Case study pages** (`design-system.html`, `energy-tracker.html`,
   `library-freeze.html`,
   `marketing-management.html`) do **not** load `main.js`. Each loads only
   the modules it needs via its own inline `<script type="module">` tag,
   importing directly from `/src/js/modules/<name>.js`.

```
src/js/
├── main.js                         # Entry point for index.html only
└── modules/
    ├── navigation.js                 # Landing page nav active states
    ├── flipBoardAnimation.js         # Hero animated job titles
    ├── scroll-hinter.js              # Scroll hint + GSAP smooth scroll
    ├── icon-animation.js             # Icon entry animation
    ├── carousel-dots.js              # Dot nav synced to marquee-scroll tween
    ├── marquee-scroll.js             # GSAP marquee tween registry (project card slideshows)
    ├── about-entry-animation.js      # About section entry stagger
    ├── about-modal.js                # About modal slide-in panel
    ├── project-card-entry-animation.js # Project card entry stagger, creates marquee tween
    ├── analytics-events.js           # Vercel Analytics custom events
    ├── service-cards-preview.js      # Tools grid: preview swaps with hovered/focused card
    ├── phase-rail-accordion.js       # Expand/collapse for .case-phase-rail--accordion
    ├── accordion.js                  # Expand/collapse for .milestone / .cs-line-breaker.accordion
    ├── side-nav-bar.js               # Case study dynamic side nav
    ├── scroll-to-top.js              # Case study mobile scroll-to-top button
    └── lightgallery.js               # GLightbox for images/galleries/videos
```

---

## Which page loads which modules

| Page | Loads |
|------|-------|
| `index.html` | `main.js` (bundles: flipBoardAnimation, scroll-hinter, navigation, icon-animation, carousel-dots, about-entry-animation, about-modal, project-card-entry-animation, analytics-events, service-cards-preview, phase-rail-accordion; `lightgallery.js` only via dynamic `import()` if a carousel/gallery selector is present on the page) |
| `design-system.html` | `lightgallery.js`, `phase-rail-accordion.js`, `scroll-to-top.js` |
| `energy-tracker.html` | `accordion.js`, `lightgallery.js`, `scroll-to-top.js`, `side-nav-bar.js` |
| `library-freeze.html` | `lightgallery.js`, `scroll-to-top.js` |
| `marketing-management.html` | `accordion.js`, `lightgallery.js`, `scroll-to-top.js`, `side-nav-bar.js` |

`marquee-scroll.js` has no importer of its own in any HTML page — it's a
shared `Map<HTMLElement, Tween>` registry imported only by
`carousel-dots.js` and `project-card-entry-animation.js` on the landing page.

Before assuming a module is unused, check both `main.js`'s static imports
**and** every HTML page's inline `<script type="module">` block — an
`import` inside an inline script tag doesn't show up in a `grep -r "src="`
search the way an external `<script src="...">` would.

---

## Entry Point: main.js (index.html only)

### Initialization Flow

```
DOMContentLoaded
    │
    ├── initNavigation()
    ├── initAboutEntryAnimation()
    ├── initAboutModal()
    ├── initProjectCardEntryAnimation()
    ├── initServiceCardsPreview()
    ├── initVisualEffects()
    │   ├── initFlipBoardAnimation()
    │   └── initScrollHint()
    ├── (conditional) dynamic import of lightgallery.js
    │   — only if `.new-carousel.swiper, .cs-column-image, .cs-gallery-grid` exists
    ├── initCarouselDots()
    ├── initAnalyticsEvents()
    └── lazy-play IntersectionObserver for video[preload="none"]

Separate DOMContentLoaded listener:
    └── initIconAnimation()
```

---

## Module: navigation.js

**Purpose:** Track viewport position and update landing page nav active state.

Maps sections to nav items via `sectionNavMap`, checks on a 10ms-debounced
scroll listener which section is in view (`rect.top <= 100` and
`rect.bottom >= windowHeight * 0.3`), updates `.active` class and
`aria-current="page"`.

---

## Module: flipBoardAnimation.js

**Purpose:** Split-flap departure board animation cycling through job titles.

Respects `prefers-reduced-motion` (instant text swap fallback). Uses
`aria-label`, `role="status"`, `aria-live="polite"`.

---

## Module: scroll-hinter.js

**Purpose:** Show scroll hint in About section with GSAP-powered smooth scroll
(`gsap` + `gsap/ScrollToPlugin`). Handles `.scroll-hint` (click → scroll) and
`.scroll-hinter` (visual indicator, opacity toggled by scroll position, same
10ms-debounced pattern as `navigation.js`).

---

## Module: marquee-scroll.js

**Purpose:** Shared GSAP marquee tween registry for project card slideshows.
Exports `createMarqueeTween(slideshow, opts)` and `getMarqueeTween(slideshow)`
backed by a module-level `Map`. Duration 45s desktop / 80s mobile, pauses on
hover (desktop), respects `prefers-reduced-motion` (returns `null`, no tween
created). Consumed by `carousel-dots.js` (reads `tween.progress()` to sync
dots) and `project-card-entry-animation.js` (creates the tween paused, plays
it 3s after entry animation completes).

---

## Module: carousel-dots.js

**Purpose:** Mobile dot navigation synced to the `marquee-scroll.js` tween via
`requestAnimationFrame`. Clicking a dot pauses the tween, jumps
`tween.progress()`, resumes after 3s. Loads GLightbox + `lightgallery.js` on
demand (dynamic `import()`) on first tap, for the mobile slideshow-tap-to-view
interaction.

---

## Module: accordion.js

**Purpose:** Mutually exclusive accordion behavior (only one open at a time)
for case study pages — two types: `.milestone` (uses `open` attribute +
`.is-open` class) and `.cs-line-breaker.accordion` (`.accordion-content`
`display` toggle). Loaded directly by `energy-tracker.html` and
`marketing-management.html`, not via `main.js`.

---

## Module: phase-rail-accordion.js

**Purpose:** Expand/collapse for `.case-phase-rail--accordion` rows. Used on
the landing page (via `main.js`) and loaded directly on
`design-system.html`.

---

## Module: side-nav-bar.js

**Purpose:** Generate dynamic side navigation for case studies from
`[data-section-title]` elements. Builds nav HTML, appends to `document.body`,
`IntersectionObserver` (`rootMargin: '-20% 0px -60% 0px'`) tracks active
section and moves an indicator via `transform: translateY()`. Click handler
smooth-scrolls with an 80px offset for the sticky nav and updates the URL
hash via `history.pushState()`. Loaded directly by `energy-tracker.html` and
`marketing-management.html`, not via `main.js`.

---

## Module: scroll-to-top.js

**Purpose:** Mobile scroll-to-top button for case study pages. Loaded
directly by every case study page (`design-system.html`,
`energy-tracker.html`, `library-freeze.html`,
`marketing-management.html`), not via `main.js`.

---

## Module: lightgallery.js

**Purpose:** Initialize GLightbox for images/galleries/videos.

### Dependencies (dynamic only — never statically imported)

```js
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
```

See the root `CLAUDE.md` "GLightbox — Dynamic Loading" section: never add a
static `import GLightbox` or its CSS to `main.js` or any module statically
imported by it — this would add ~60 KB JS + 14 KB CSS to the landing page,
where it's unused except behind the conditional dynamic import.

### Four Initialization Contexts

| Function | Selector | Gallery Grouping |
|----------|----------|-------------------|
| `initCarouselGalleries()` | `.new-carousel.swiper` | Each carousel is its own gallery |
| `initStandaloneImages()` | `figure.cs-column-image` | Individual images |
| `initGalleryGrid()` | `.cs-gallery-grid` | All items in one group |
| `initAccordionImages()` | `.accordion .cs-three-column-grid` | Single accordion gallery |

Loaded directly by every case study page, and dynamically by `main.js` on
the landing page only when a matching selector is present.

---

## Other modules (landing page only, via main.js)

| Module | Purpose |
|--------|---------|
| `icon-animation.js` | Icon entry animation, initialized in its own `DOMContentLoaded` listener |
| `about-entry-animation.js` | About section entry stagger |
| `about-modal.js` | About modal slide-in panel |
| `project-card-entry-animation.js` | Project card entry stagger; also creates the paused marquee tween (see `marquee-scroll.js`) |
| `analytics-events.js` | Vercel Analytics custom events |
| `service-cards-preview.js` | Tools grid: preview image swaps with whichever card is hovered/focused |

---

## Patterns & Conventions

### Debounced Scroll Listeners

```js
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(checkFunction, 10);
}, { passive: true });
```
Used in `navigation.js` and `scroll-hinter.js`.

### IntersectionObserver Usage

Used in `main.js` (lazy-playing videos), `side-nav-bar.js` (active section
tracking), and `carousel-dots.js`/`project-card-entry-animation.js` context.

### Accessibility Patterns

- `aria-current="page"` for active nav items
- `aria-label` on navigation elements
- `aria-hidden="true"` on decorative elements
- `prefers-reduced-motion` checks before any GSAP/CSS animation

### Module Export Pattern

```js
export function initModuleName() {
  const element = document.querySelector('.selector');
  if (!element) return;
  // ...
}
```

---

## External Dependencies

| Library | Version | Usage |
|---------|---------|-------|
| GSAP | 3.14.2 | Marquee, smooth scroll, entry animations |
| GLightbox | 3.3.1 | Image/video lightbox galleries (dynamic import only) |
| Swiper | 12.0.3 | Carousels (initialized separately, not via these modules) |

---

## Adding New Modules

1. Create file in `src/js/modules/`.
2. Export `initModuleName()`.
3. Decide how it reaches the page: statically imported + called in
   `main.js` (landing page only), or imported via an inline
   `<script type="module">` in the specific case study HTML page(s) that
   need it. Don't assume `main.js` covers case study pages — it doesn't.
4. Use the early-return pattern if required elements are missing.
