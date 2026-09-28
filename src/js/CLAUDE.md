# JavaScript Architecture

## Overview

The JS architecture follows a **modular vanilla JavaScript** approach with no framework dependencies. Each module is self-contained and exports initialisation functions that are called from the main entry point (landing page) or from each case study's inline module script.

```
src/js/
├── main.js                            # Entry point (index + marketing-management)
└── modules/
    ├── navigation.js                  # Landing page nav active states
    ├── flipBoardAnimation.js          # Hero animated job titles
    ├── scroll-hinter.js               # Scroll hint + GSAP smooth scroll
    ├── about-entry-animation.js       # About section GSAP entry stagger
    ├── about-modal.js                 # About <dialog> slide-in panel
    ├── project-card-entry-animation.js # Project card GSAP entry stagger
    ├── marquee-scroll.js              # GSAP marquee tween factory + registry
    ├── carousel-dots.js               # Mobile dot nav + tap-to-lightbox
    ├── icon-animation.js              # Footer SVG dot orbit/bounce
    ├── analytics-events.js            # Vercel Analytics custom events
    ├── lightgallery.js                # GLightbox for images/galleries
    ├── accordion.js                   # Expand/collapse sections
    └── side-nav-bar.js                # Case study dynamic side nav
```

---

## Entry Point: main.js

### Initialisation Flow

```
Module load
    ├── inject()                          # Vercel Analytics
    └── injectSpeedInsights()             # Vercel Speed Insights

DOMContentLoaded
    │
    ├── initNavigation()                  # Core: nav active states
    ├── initAboutEntryAnimation()         # About section stagger
    ├── initAboutModal()                  # About <dialog> panel
    ├── initProjectCardEntryAnimation()   # Card stagger + creates marquee tweens
    │
    ├── initVisualEffects()               # Grouped visual features
    │   ├── initFlipBoardAnimation()
    │   └── initScrollHint()
    │
    ├── [if carousel / column image / gallery grid exists]
    │   ├── inject GLightbox CSS <link> from CDN
    │   └── import('./modules/lightgallery.js') → initLightGallery()
    │
    ├── initCarouselDots()                # Needs marquee tweens to exist
    ├── initAnalyticsEvents()
    └── Lazy video IntersectionObserver

DOMContentLoaded (second listener)
    └── initIconAnimation()
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `initVisualEffects()` | Groups passive visual-only effects (no navigation, no input) |

### Lazy Video Playback

- Observes every `video[preload="none"]` with a 200px `rootMargin`
- Calls `.play()` on enter and `.pause()` on leave
- Replaces `autoplay`, which forces the browser to download the video immediately

Images use native `loading="lazy"` in the HTML; there is no JS image lazy loader.

---

## Module: navigation.js

**Purpose:** Track viewport position and update landing page nav active state.

### How It Works

1. Maps sections to nav items via `sectionNavMap`:
   ```js
   [
     { selector: '.section-about', navIndex: 0 },
     { selector: '.section-project', navIndex: 1 },
     { selector: '.section-contact, footer', navIndex: 2 }
   ]
   ```

2. On scroll (debounced 10ms), checks which section is in view
3. Updates `.active` class and `aria-current="page"` attribute

### Visibility Logic

Section is active when:
- `rect.top <= 100` (near top of viewport)
- `rect.bottom >= windowHeight * 0.3` (still visible)

---

## Module: flipBoardAnimation.js

**Purpose:** Split-flap departure board animation cycling through job titles.

### Configuration

```js
CONFIG = {
  titles: ['UI Designer', 'Design Systems', 'Product Thinking',
           'Atomic Design', 'Variables Geek', 'Vibe Coder'],
  flipDuration: 200,      // ms per character flip
  cycleCount: 8,          // random chars before settling
  staggerDelay: 120,      // ms between each char starting
  pauseDuration: 6000     // ms pause between titles
}
```

### Animation Flow

```
Initial title displayed
    │
    └── Wait pauseDuration (6s)
            │
            └── For each character (staggered 120ms):
                    │
                    ├── Cycle through 8 random characters
                    │   └── Each cycle: add .flipping class (200ms)
                    │
                    └── Land on target character
                            │
                            └── Show cursor, wait 6s, repeat
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `cycleCharacter(el, target)` | Animate single char through random chars to target |
| `transitionToTitle(container, title, cursor)` | Orchestrate full title transition |
| `createCharacterSpans(text)` | Split text into `<span class="flip-char">` elements with line break after first word |

### Accessibility

- Checks `prefers-reduced-motion` - falls back to instant text swap
- Uses `aria-label`, `role="status"`, `aria-live="polite"` on wrapper
- Individual chars marked `aria-hidden="true"`

### DOM Structure Created

```html
<div class="dynamic-job-title" aria-label="UI Designer" role="status" aria-live="polite">
  <div class="flip-board-container">
    <span class="flip-char" aria-hidden="true">U</span>
    <span class="flip-char" aria-hidden="true">I</span>
    <br>
    <span class="flip-char" aria-hidden="true">D</span>
    <!-- ... -->
    <span class="typing-cursor" aria-hidden="true"></span>
  </div>
</div>
```

---

## Module: scroll-hinter.js

**Purpose:** Show scroll hint in About section with GSAP-powered smooth scroll.

### Dependencies

```js
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
```

### Handles Two Elements

| Element | Behaviour |
|---------|----------|
| `.scroll-hint` | Clickable, triggers GSAP scroll to `#marketing-management` |
| `.scroll-hinter` | Visual indicator, opacity controlled by scroll position |

### Click Handler (scroll-hint)

```js
gsap.to(window, {
  duration: 1.5,
  scrollTo: {
    y: targetY,           // Centered in viewport
    autoKill: false       // Complete even if user scrolls
  },
  ease: 'power2.inOut'
});
```

### Visibility Logic

Both use scroll listeners (debounced 10ms) to check if About section is visible:
- `rect.top <= 100`
- `rect.bottom >= windowHeight * 0.5`

When visible: show hint. Otherwise: hide.

---

## Module: about-entry-animation.js

**Purpose:** Staggered GSAP entry for the About section.

- ScrollTrigger timeline, order: SVG circles (0.2s apart) → first letter + rest of name → job title → bio → about CTA → scroll hinter
- Sets `opacity`, `y` and (for the scroll hinter) `visibility` so inline styles from `scroll-hinter.js` don't conflict
- Replays on `onEnter` and `onEnterBack` via a paused timeline + `resetToHidden()` + `tl.restart()`
- Returns early on `prefers-reduced-motion`

---

## Module: about-modal.js

**Purpose:** Slide-in About panel built on `<dialog>`.

| Behaviour | Implementation |
|-----------|----------------|
| Open | Any `[data-open-about-modal]` → `showModal()`, then `.is-open` added two frames later so the CSS transition runs |
| Close | `[data-close-about-modal]` (X button, backdrop) or Escape. Removes `.is-open`, waits `CLOSE_DURATION` (450ms, matches CSS) then `close()` |
| Escape | `cancel` event is intercepted so the panel animates out instead of closing instantly |
| URL | Sets `#about` on open, clears it on close; opens on load if the hash is `#about` |

Styles live in `src/scss/landing-page/new-about.scss`.

---

## Module: project-card-entry-animation.js

**Purpose:** Staggered GSAP entry for each `.section-project` card, integrated with the marquee.

### Two parallel blocks (both start at t=0)
1. **Text:** `.project-title` → `.type-label` + `.project-meta` → `.project-description` → `.project-details` + `.meta-group` → `.metric-card` (0.2s stagger)
2. **Slideshow:** first 3 original slides one by one (0.25s stagger) → remaining originals + all clones together → `.data-tags`

### Marquee integration
- Calls `createMarqueeTween(slideshow, { paused: true })` **before** querying `aria-hidden` duplicates, so runtime clones are included
- Timeline `onComplete` plays the marquee after 600ms
- `resetToHidden()` re-queries clones live, pauses the tween and sets `progress(0)`

### ScrollTrigger
- `start: 'top 80%'`
- `onEnter`: `timeScale(1)`; `onEnterBack`: `timeScale(2.5)` (faster when scrolling back up)
- Returns early on `prefers-reduced-motion`

---

## Module: marquee-scroll.js

**Purpose:** Creates and stores one GSAP marquee tween per project card slideshow.

### API

```js
import { createMarqueeTween, getMarqueeTween } from './marquee-scroll.js';

createMarqueeTween(slideshow, { paused: true }); // returns tween, or null on reduced motion
getMarqueeTween(slideshow);                      // returns the stored tween or undefined
```

Tweens are stored in a module-level `Map<HTMLElement, Tween>`. Creating a tween for a slideshow kills any existing one.

### How it works
1. `ensureFillWidth()` sums the widths (+ gap) of original `.project-image[data-slide]` elements to get `oneSetWidth`, then clones originals (as `aria-hidden="true"`, without `data-slide`, `loading`, `fetchpriority`) until the strip is at least `oneSetWidth + viewport` wide
2. Tween: `{ x: -oneSetWidth, ease: 'none', repeat: -1 }`
3. Duration: `oneSetWidth / PX_PER_SEC` (`PX_PER_SEC = 90`) so every slideshow scrolls at the same speed
4. Fallback if nothing can be measured: `xPercent: -50`, 45s desktop / 80s mobile
5. Desktop only (> 768px): `mouseenter` pauses, `mouseleave` resumes

---

## Module: carousel-dots.js

**Purpose:** Mobile dot navigation and tap-to-lightbox for project card slideshows.

- A `requestAnimationFrame` loop reads `tween.progress()` and sets `.active` on dot `floor(progress * slideCount) % slideCount`
- Dot click: `tween.pause()` → `tween.progress(index / slideCount)` → `tween.play()` after `RESUME_DELAY` (3000ms)
- Mobile tap (≤ 768px, outside the dots): on first tap, `await import('glightbox')` and inject its CSS from CDN, then open at the active slide. Videos are passed as `type: 'video'`

---

## Module: icon-animation.js

**Purpose:** Looping footer icon animation.

- Uses GSAP `MotionPathPlugin`; needs `#dot`, `#orbitPathOne`, `#orbitPathTwo`, `#bouncePathOne`, `#bouncePathTwo` in the SVG (warns and exits if missing)
- Timeline (`repeat: -1`): orbit one → 4 bounces upwards → pause → orbit two → 5 bounces downwards → pause
- `addSmoothBounce()` builds physics-style keyframes where each bounce keeps `energyRetention` of the previous height
- Returns early on `prefers-reduced-motion`

---

## Module: analytics-events.js

**Purpose:** Vercel Analytics custom events via `track()` from `@vercel/analytics`.

| Event | Trigger | Properties |
|-------|---------|------------|
| `nav_click` | `.nav-item[data-open-about-modal]` | `{ item: 'about' }` |
| `nav_click` | `.nav-item[href="#contact"]` | `{ item: 'contact' }` |
| `read_case_study` | `.cta-button` | `{ project: <closest section id> }` |
| `footer_click` | `.social-link[data-name]` | `{ item: <data-name> }` |

---

## Module: accordion.js

**Purpose:** Mutually exclusive accordion behaviour (only one open at a time).

### Two Accordion Types

| Type | Selector | Content Selector |
|------|----------|------------------|
| Milestones | `.milestone` | Uses `open` attribute + `.is-open` class |
| Case Study | `.cs-line-breaker.accordion` | `.accordion-content` with `display` toggle |

### Behaviour

1. Click header/accordion
2. Close all accordions in group
3. If clicked one wasn't open, open it

### Milestone Accordions

```js
// Click handler on .milestone-header
milestones.forEach(item => {
  item.classList.remove('is-open');
  item.removeAttribute('open');
});
if (!isCurrentlyOpen) {
  accordion.classList.add('is-open');
  accordion.setAttribute('open', '');
}
```

### Case Study Accordions

```js
// Initially hide content
content.style.display = 'none';
accordion.style.cursor = 'pointer';

// On click: toggle display: none/block
```

---

## Module: side-nav-bar.js

**Purpose:** Generate dynamic side navigation for case studies from `data-section-title` attributes.

### Initialisation Flow

```
Find all [data-section-title] elements
    │
    ├── Build navigation HTML dynamically
    │
    ├── Append to document.body
    │
    ├── Setup IntersectionObserver for scroll tracking
    │
    ├── Setup click handlers for smooth scroll
    │
    └── Add .is-visible class after 300ms
```

### DOM Structure Created

```html
<nav class="side-nav" aria-label="Case study sections">
  <ul class="side-nav__list">
    <div class="side-nav__indicator"></div>
    <li class="side-nav__item">
      <a class="side-nav__link" href="#section-1" data-section-index="0">
        <span class="side-nav__number">01</span>
        <span class="side-nav__label">Overview</span>
      </a>
    </li>
    <!-- ... more items -->
  </ul>
</nav>
```

### Scroll Tracking

Uses `IntersectionObserver` with:
```js
{
  root: null,
  rootMargin: '-20% 0px -60% 0px',  // Upper-middle viewport
  threshold: 0
}
```

When section intersects, updates `.is-active` class and moves indicator via `transform: translateY()`.

### Click Handler

- Smooth scroll with 80px offset (for sticky nav)
- Updates URL hash via `history.pushState()` without page jump

---

## Module: lightgallery.js

**Purpose:** Initialise GLightbox for various image/video contexts.

### Dependencies

```js
import GLightbox from 'glightbox';
```

The GLightbox CSS is **not** imported here. It is injected at runtime as a `<link>` from `cdn.jsdelivr.net` so Vite does not bundle it into every page.

### How it is loaded

- **Landing page:** never loaded on page load
- **`marketing-management.html`:** dynamically imported by `main.js` when `.new-carousel.swiper, .cs-column-image, .cs-gallery-grid` exists
- **Other case studies:** imported by each page's inline `<script type="module">`

**Never import this module (or GLightbox) statically from `main.js` or anything `main.js` statically imports.**

### Four Initialisation Contexts

| Function | Selector | Gallery Grouping |
|----------|----------|------------------|
| `initCarouselGalleries()` | `.new-carousel.swiper` | Each carousel is its own gallery |
| `initStandaloneImages()` | `figure.cs-column-image` | Individual images |
| `initGalleryGrid()` | `.cs-gallery-grid` | All items in one group |
| `initAccordionImages()` | `.accordion .cs-three-column-grid` | Single accordion gallery |

### Common Pattern

1. Find elements
2. Extract caption from figcaption/alt text
3. Build description HTML
4. Add `data-glightbox`, `data-gallery` attributes
5. Wrap images in `<a>` anchors
6. Initialise GLightbox with selector

### Description Builder

```js
function buildDescription(altText, captionText) {
  // Combines alt + caption into HTML
  // <p class="alt-content">...</p>
  // <p class="lg-figcaption">...</p>
}
```

### GLightbox Options

```js
GLightbox({
  selector: '.glightbox-gallery',
  touchNavigation: true,
  loop: true
});
```

---

## Patterns & Conventions

### IntersectionObserver Usage

Used for scroll-based behaviour:
- `main.js`: lazy video play/pause
- `side-nav-bar.js`: active section tracking

`navigation.js` and `scroll-hinter.js` use debounced scroll listeners instead. Entry animations use GSAP ScrollTrigger.

### Debounced Scroll Listeners

Pattern used consistently:
```js
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(checkFunction, 10);
}, { passive: true });
```

### Accessibility Patterns

- `aria-current="page"` for active nav items
- `aria-label` on navigation elements
- `aria-hidden="true"` on decorative elements
- `prefers-reduced-motion` checks (every animation module returns early)

### GSAP Patterns

- Register plugins in the module that uses them (`gsap.registerPlugin(ScrollTrigger)`)
- Build a paused timeline, then `restart()` it from ScrollTrigger callbacks for replayable entries
- Never use `!important` on properties GSAP animates; it overrides `gsap.set()`
- Never pass a function as the target of `.to()`; it silently does nothing. Use a cached NodeList queried after any DOM cloning

### Module Export Pattern

Each module exports an `init*` function:
```js
export function initModuleName() {
  // Check if required elements exist
  const element = document.querySelector('.selector');
  if (!element) return;

  // Initialise functionality
}
```

---

## Page-Specific Loading

### Landing Page (index.html)

Loads `main.js`, which runs every module above except `accordion.js` and `side-nav-bar.js`. GLightbox is only loaded on a mobile slideshow tap.

### Case Study Pages

Each case study has its own inline `<script type="module">` in `<head>` that:
- Calls Vercel `inject()` + `injectSpeedInsights()`
- Imports `accordion.js`, `lightgallery.js` and `side-nav-bar.js` from `/src/js/modules/`
- Imports Swiper + `Pagination` from npm and initialises `.stacked-metrics-swiper` and other `.swiper` elements (`token-launch.html` has no Swiper)
- Loads Swiper CSS from the jsDelivr CDN

`marketing-management.html` also loads `main.js`, so it calls the Vercel `inject()` functions twice.

---

## External Dependencies

| Library | Version | Usage |
|---------|---------|-------|
| GSAP | 3.14.2 | ScrollTrigger entries, ScrollTo, MotionPath, marquee tweens |
| GLightbox | 3.3.1 | Image/video lightbox galleries (dynamically loaded) |
| Swiper | 12.0.3 | Case study carousels (initialised inline per page) |
| @vercel/analytics | 1.6.1 | Page views + custom events |
| @vercel/speed-insights | 1.3.1 | Core Web Vitals |

---

## Adding New Modules

1. Create file in `src/js/modules/`
2. Export `initModuleName()` function
3. Import in `main.js`
4. Call in appropriate lifecycle hook (DOMContentLoaded)
5. Use early return pattern if required elements missing
6. If it animates, return early on `prefers-reduced-motion`
7. If it pulls in a heavy library only some pages need, use dynamic `import()`

---

## New Components and Testing

For all new elements, modules and testing, create a new separate JS file named after its purpose, then import it in `main.js`.
