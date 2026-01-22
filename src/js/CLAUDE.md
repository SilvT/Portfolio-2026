# JavaScript Architecture

## Overview

The JS architecture follows a **modular vanilla JavaScript** approach with no framework dependencies. Each module is self-contained and exports initialization functions that are called from the main entry point.

```
src/js/
├── main.js                    # Entry point - orchestrates all modules
└── modules/
    ├── navigation.js          # Landing page nav active states
    ├── flipBoardAnimation.js  # Hero animated job titles
    ├── scroll-hinter.js       # Scroll hint + GSAP smooth scroll
    ├── lightgallery.js        # GLightbox for images/galleries
    ├── accordion.js           # Expand/collapse sections
    └── side-nav-bar.js        # Case study dynamic side nav
```

---

## Entry Point: main.js

### Initialization Flow

```
DOMContentLoaded
    │
    ├── initNavigation()        # Core: nav active states
    │
    ├── initVisualEffects()     # Grouped visual features
    │   ├── initFlipBoardAnimation()
    │   ├── initScrollHint()
    │   └── initLazyLoading()
    │
    └── initLightGallery()      # Lightbox galleries
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `initVisualEffects()` | Groups passive visual-only effects (no navigation, no input) |
| `initLazyLoading()` | IntersectionObserver for `.project-image` elements |

### Lazy Loading

- Uses `IntersectionObserver` with 50px rootMargin
- Adds `.loaded` class when image enters viewport
- Threshold: 0.01 (triggers early)

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

| Element | Behavior |
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

## Module: accordion.js

**Purpose:** Mutually exclusive accordion behavior (only one open at a time).

### Two Accordion Types

| Type | Selector | Content Selector |
|------|----------|------------------|
| Milestones | `.milestone` | Uses `open` attribute + `.is-open` class |
| Case Study | `.cs-line-breaker.accordion` | `.accordion-content` with `display` toggle |

### Behavior

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

### Initialization Flow

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

**Purpose:** Initialize GLightbox for various image/video contexts.

### Dependencies

```js
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
```

### Four Initialization Contexts

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
6. Initialize GLightbox with selector

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

Used in 3 modules for scroll-based behavior:
- `main.js` - lazy loading images
- `navigation.js` - active nav state (uses manual scroll listener)
- `side-nav-bar.js` - active section tracking

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
- `prefers-reduced-motion` checks

### Module Export Pattern

Each module exports an `init*` function:
```js
export function initModuleName() {
  // Check if required elements exist
  const element = document.querySelector('.selector');
  if (!element) return;

  // Initialize functionality
}
```

---

## Page-Specific Loading

### Landing Page (index.html)

All modules from `main.js` are active:
- Navigation tracking
- Flip-board animation
- Scroll hint
- Lazy loading

### Case Study Pages

Additional modules loaded via separate script tags:
- `side-nav-bar.js` - generates side navigation
- `accordion.js` - expand/collapse sections
- Swiper initialization (via CDN/separate file)

---

## External Dependencies

| Library | Version | Usage |
|---------|---------|-------|
| GSAP | 3.14.2 | Smooth scroll animations |
| GLightbox | 3.3.1 | Image/video lightbox galleries |
| Swiper | 12.0.3 | Carousels (initialized separately) |

---

## Adding New Modules

1. Create file in `src/js/modules/`
2. Export `initModuleName()` function
3. Import in `main.js`
4. Call in appropriate lifecycle hook (DOMContentLoaded)
5. Use early return pattern if required elements missing


---

## New Components and testings

For all new elements, modules and testing, create a new separate js file named after its purpouse and then import in main.js
