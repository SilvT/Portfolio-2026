# Portfolio 2026 - Silvia Travieso

**Personal Product / UI / Design Systems Designer Portfolio Website**
Live: https://silviatravieso.com
Repo: `SilvT/Portfolio-2026`

---

## Project Summary

A personal portfolio that showcases design work and demonstrates front-end skills. Priorities:

- **Minimal footprint**: no framework, vanilla JavaScript, aggressive asset optimisation
- **Strong visual identity**: custom typography, colour themes, GSAP motion
- **Accessibility**: ARIA labels, `prefers-reduced-motion` support, focus management
- **Smooth experience**: CSS scroll snap, GSAP animations, lightbox galleries

Two page types: the **landing page** (about, project cards, contact) and **case studies** (carousels, accordions, side nav, galleries).

---

## Related Docs

| File | Purpose |
|------|---------|
| `.claude/CLAUDE-LOG.md` | Dated session log: changes, decisions, files touched |
| `.claude/to-do-list.md` | Open tasks |
| `.claude/Documentation.md` | Reference links (GSAP docs) |
| `src/js/CLAUDE.md` | Detailed JS module reference |
| `src/scss/CLAUDE.md` | Detailed SCSS architecture reference |
| `building-about.md` | Notes from the about section redesign |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 7.3.1 |
| Styling | SASS/SCSS 1.69.0 |
| Animation | GSAP 3.14.2 (ScrollTrigger, ScrollToPlugin, MotionPathPlugin) |
| Carousels | Swiper 12.0.3 (case studies only) |
| Lightbox | GLightbox 3.3.1 (dynamically loaded) |
| Icons | Phosphor Icons, Iconoir (custom subset) |
| Analytics | `@vercel/analytics` 1.6.1, `@vercel/speed-insights` 1.3.1 |
| Deployment | Vercel |

---

## Pages

All six pages are listed as Rollup inputs in `vite.config.js`. **A new page must be added there or it will not be built.**

| File | Type | `data-theme` | Loads `main.js` |
|------|------|--------------|-----------------|
| `index.html` | Landing page | n/a | Yes |
| `marketing-management.html` | Case study | `blue` | Yes |
| `design-system.html` | Case study (full) | `green` | No |
| `design-system-wip.html` | Case study (live version) | `green` | No |
| `energy-tracker.html` | Case study | `neutral` | No |
| `token-launch.html` | Case study | `blue` | No |

- Internal links to the design system case study point to **`design-system-wip.html`**, not `design-system.html`.
- `index copy.html` is a local scratch file, git-ignored and not built.

### Landing Page (`index.html`)
- About section: animated flip-board job titles, SVG circle decoration, staggered GSAP entry
- About modal: slide-in `<dialog>` panel (opens on `#about`)
- Four project cards, each with a GSAP marquee slideshow, metric cards and a "Read Case Study" CTA
- Contact / footer with animated icon and social links
- CSS scroll snap navigation

### Case Studies
- Hero with project overview, breadcrumbs
- Content blocks (1-col, 2-col, galleries)
- Swiper carousels and stacked metric swipers
- Accordion sections, dynamic side nav from `data-section-title`
- Theme set via `data-theme` on `<body>` and the `.case-study-page` wrapper
- Each page has its **own inline `<script type="module">`** that imports Vercel analytics, `accordion.js`, `lightgallery.js`, `side-nav-bar.js` and Swiper directly. Swiper CSS comes from the jsDelivr CDN.

---

## Project Structure

```
Portfolio-2026/
├── index.html                    # Landing page
├── marketing-management.html     # Case studies (see Pages table)
├── design-system.html
├── design-system-wip.html
├── energy-tracker.html
├── token-launch.html
├── building-about.md             # About redesign notes
├── scripts/
│   └── build-icons.cjs           # Iconoir CSS subset generator
├── vite.config.js                # Build config (page inputs, modulePreload: false)
├── vercel.json                   # Deployment config
├── public/                       # Static assets
│   ├── ds/                       # Design System images
│   ├── plugin/                   # Token Launch plugin images
│   ├── mkm/                      # Marketing Management images and videos
│   ├── microsite/                # Energy tracker microsite images and videos
│   ├── logo-filled.svg, logo-outlined.svg, favicon.png
│   ├── *.pdf                     # CVs
│   └── robots.txt, sitemap.xml
└── src/
    ├── js/
    │   ├── CLAUDE.md             # JS module reference
    │   ├── main.js               # Entry point (landing + marketing-management)
    │   └── modules/
    │       ├── navigation.js                  # Nav active state tracking
    │       ├── flipBoardAnimation.js          # Animated job titles
    │       ├── scroll-hinter.js               # Scroll hint + GSAP scroll
    │       ├── about-entry-animation.js       # About section GSAP entry stagger
    │       ├── about-modal.js                 # About <dialog> slide-in panel
    │       ├── project-card-entry-animation.js # Project card GSAP entry stagger
    │       ├── marquee-scroll.js              # GSAP marquee tween factory + registry
    │       ├── carousel-dots.js               # Mobile dot nav + tap-to-lightbox
    │       ├── icon-animation.js              # Footer SVG dot orbit/bounce
    │       ├── analytics-events.js            # Vercel custom events
    │       ├── lightgallery.js                # GLightbox initialisation
    │       ├── accordion.js                   # Expand/collapse sections
    │       └── side-nav-bar.js                # Dynamic case study nav
    └── scss/
        ├── CLAUDE.md             # SCSS architecture reference
        ├── _main.scss            # Root import file
        ├── _variables.scss       # Design tokens
        ├── typography.scss       # Type system
        ├── breakpoints.scss      # Responsive mixins
        ├── accesibility.scss     # Accessibility utilities
        ├── iconoir-custom.css    # Auto-generated icon subset (npm run icons)
        ├── landing-page/
        │   ├── _landing-page.scss  # Entry, base reset, sections
        │   ├── _animations.scss    # Keyframes + stagger-fade-in mixin
        │   ├── about.scss
        │   ├── new-about.scss      # Redesigned about + about modal
        │   ├── nav-bar.scss
        │   ├── project-cards.scss
        │   ├── scroll-hinter.scss
        │   └── footer.scss
        └── case-studies/
            ├── _case-study.scss    # Entry, layout, themes
            ├── hero.scss
            ├── blocks.scss
            ├── carousel.scss
            ├── accordion.scss
            ├── side-nav-bar.scss
            ├── breadcrumbs.scss
            ├── lightbox.scss
            ├── line-breaker.scss
            ├── switch.scss
            └── old-blocks.scss     # Legacy, being cleaned up
```

---

## Design System

### Colours
- **Blues:** Light (#edf1f3) → Dark (#203a48)
- **Greens:** Light (#E8EBE0) → Dark (#525D2E)
- **Cream:** Background scale (#FAF9F7 → #B8B0A4)
- **Neutrals:** Light (#A8ADB8) → Dark (#2A2723)

### Typography
- **Primary:** Bricolage Grotesque
- **Display:** Fascinate
- **Monospace:** Anonymous Pro
- **Scale:** 4XL (48px) → XS (14px)

### Spacing
- 10-level scale: `$space-4` (0.25rem) → `$space-120` (7.5rem)

### Breakpoints
| Name | Value |
|------|-------|
| small-mobile | 480px |
| mobile | 768px |
| tablet | 1024px |
| desktop | 1200px |
| laptop | 1728px |
| large-desktop | 1750px |

---

## JavaScript

### `main.js` start-up order
Runs on `index.html` and `marketing-management.html`.

1. Vercel `inject()` + `injectSpeedInsights()` (module level)
2. On `DOMContentLoaded`: `initNavigation()` → `initAboutEntryAnimation()` → `initAboutModal()` → `initProjectCardEntryAnimation()` → `initVisualEffects()` (flip-board + scroll hint)
3. GLightbox: dynamic `import('./modules/lightgallery.js')` only if `.new-carousel.swiper, .cs-column-image, .cs-gallery-grid` exists, with CSS injected from CDN
4. `initCarouselDots()` → `initAnalyticsEvents()`
5. Lazy video playback: `IntersectionObserver` (200px margin) plays/pauses every `video[preload="none"]`
6. Separate `DOMContentLoaded` listener: `initIconAnimation()`

### Modules

| Module | What it does |
|--------|--------------|
| `navigation.js` | Tracks viewport position, sets `.active` + `aria-current="page"` on nav items |
| `flipBoardAnimation.js` | Split-flap animation cycling through job titles. Respects reduced motion |
| `scroll-hinter.js` | GSAP ScrollTo smooth scroll to first project. Only **hides** the hinter; the about entry animation controls showing it |
| `about-entry-animation.js` | ScrollTrigger timeline: SVG circles → name → job title → bio → CTA → scroll hinter. Replays on `onEnter` / `onEnterBack` |
| `about-modal.js` | `<dialog>` panel opened by any `[data-open-about-modal]`. Animates via `.is-open` class, intercepts Escape to animate out, syncs `#about` hash |
| `project-card-entry-animation.js` | Per-card ScrollTrigger timeline in two parallel blocks (text; slideshow + tags). Creates the marquee paused, plays it 600ms after entry completes. `timeScale(2.5)` on scroll-back |
| `marquee-scroll.js` | GSAP marquee factory. Exports `createMarqueeTween(slideshow, opts)` and `getMarqueeTween(slideshow)` via a shared `Map` registry |
| `carousel-dots.js` | Mobile dot nav synced to `tween.progress()`; tap on slideshow loads GLightbox on demand |
| `icon-animation.js` | Footer SVG `#dot` orbits and bounces using MotionPathPlugin. Respects reduced motion |
| `analytics-events.js` | Vercel `track()` events: `nav_click` (about, contact), `read_case_study` (project id), `footer_click` (social link) |
| `lightgallery.js` | GLightbox for Swiper carousels, standalone images, gallery grids and accordion images |
| `accordion.js` | Mutually exclusive accordions for `.milestone` and `.cs-line-breaker.accordion` |
| `side-nav-bar.js` | Builds side nav from `data-section-title`; `IntersectionObserver` drives the active indicator |

### GSAP rules
- Prefer GSAP (with ScrollTrigger) over CSS `@keyframes` for anything that needs pause, replay or scroll control.
- Never use `!important` on properties GSAP animates (e.g. `opacity`); it silently overrides `gsap.set()`.
- Never pass a function (`() => querySelectorAll(...)`) as the target of `.to()`; it does nothing. Use a cached NodeList, queried **after** any DOM cloning.
- Every animation module returns early on `prefers-reduced-motion: reduce`.

---

## Slideshow Behaviour (Project Cards)

The project card slideshows use a **GSAP-driven marquee** on all viewports: a continuous horizontal scroll with duplicated images for a seamless loop.

### Marquee (`marquee-scroll.js`)
- `ensureFillWidth()` measures one original set and **clones originals at runtime** (as `aria-hidden="true"`) until the strip is at least one set + viewport wide
- Tween: `gsap.to(slideshow, { x: -oneSetWidth, ease: 'none', repeat: -1 })`
- Constant speed: `duration = oneSetWidth / PX_PER_SEC` with `PX_PER_SEC = 90`
- Fallback only if width cannot be measured: `xPercent: -50`, 45s desktop / 80s mobile
- Hover pauses the tween on desktop (`mouseenter` / `mouseleave`)
- `prefers-reduced-motion` → returns `null`, no tween; consumers must handle `null`
- `width: max-content` on `.project-image-wrapper.slideshow`; gap `1.5rem` desktop / `1rem` mobile
- **NEVER use CSS `@keyframes` or `animation:` for the marquee**; control is via `.pause()`, `.play()`, `.progress()`, `.restart()`

### Dot Indicators (Mobile Only)
- `.carousel-dots` are `display: none` on desktop, `display: flex` at `max-width: 768px`
- Active dot: 8px circle → 24px rounded rectangle in `$blue`; inactive dots at 30% opacity
- `requestAnimationFrame` loop reads `tween.progress()` to set the active dot
- Dot click: `tween.pause()` → `tween.progress(index / count)` → resumes after 3s
- Tapping the slideshow on mobile opens a GLightbox gallery at the current slide

---

## Performance Rules

These came out of the Speed Insights work in January and February 2026 (see the log). Keep to them when adding content.

- **Images:** WebP only. Hero / LCP image keeps `loading="eager"` + `fetchpriority="high"` and a `<link rel="preload">` in `<head>`. Everything else `loading="lazy"` + `decoding="async"`.
- **Video:** MP4 (H.264). No `.mov`, no GIFs (convert to `<video muted loop playsinline>`). Below the fold use `preload="none"` and **no `autoplay`**; `main.js` plays them on scroll.
- **Fonts:** Google Fonts load without blocking render (`media="print" onload="this.media='all'"` + `<noscript>` fallback). Bricolage Grotesque is preloaded; Fascinate and Anonymous Pro are deferred.
- **Bundles:** `modulePreload: false` in `vite.config.js`. Heavy libraries used only on some pages are dynamically imported.
- **Analytics:** Vercel Analytics + Speed Insights run on all six pages.

### Iconoir Icons: Custom Subset
The project uses a **custom CSS subset** of Iconoir (a few dozen icons out of 1,400+), not the full library. The full CSS is about 2.9 MB.

- **Source:** `src/scss/iconoir-custom.css` (auto-generated, do not edit by hand)
- **Imported in:** `src/scss/_main.scss` via `@import 'iconoir-custom.css'`
- **Generator:** `scripts/build-icons.cjs` scans all HTML files for `iconoir-*` classes and extracts matching rules from `node_modules/iconoir/css/iconoir.css`
- **To add or remove icons:** change the class in HTML, then run `npm run icons`

**NEVER import `iconoir/css/iconoir.css` directly**; CSS cannot tree-shake unused rules.

### GLightbox: Dynamic Loading
- **Landing page:** not loaded on page load
- **`marketing-management.html` via `main.js`:** dynamic `import()` when a carousel, column image or gallery grid is present
- **Other case studies:** imported by their own inline module script
- **Mobile slideshow tap:** `carousel-dots.js` loads it on first tap with `await import('glightbox')`
- **CSS:** injected at runtime as a `<link>` from `cdn.jsdelivr.net`, never through Vite CSS extraction

**NEVER add a static `import GLightbox` or `import 'glightbox/dist/css/glightbox.min.css'` to `main.js` or any module statically imported by `main.js`**. It would add about 60 KB JS + 14 KB CSS to the landing page.

---

## Critical CSS Rule: `overflow: clip`, not `hidden`

**NEVER use `overflow: hidden` on `html`, `body`, or ancestors of sticky elements.** `overflow: hidden` creates a scroll container, which breaks `position: sticky`. `overflow: clip` clips the same way without creating one.

Current usage:
- `html`, `body`: `overflow-x: clip` + `max-width: 100%`
- `.top-nav`: `overflow-x: clip`
- `.project-content` in `.experimental-layout`: `overflow: clip` (contains the `max-content` marquee)
- `.contentbox`: `overflow: hidden` is allowed here because `.top-nav` is not a descendant

### Horizontal overflow prevention
- Never use `100vw` / `100dvw` for widths (they include the scrollbar); use `100%`
- On mobile, reset fixed widths, `flex-shrink: 0` and `white-space: nowrap` that can push content wider than the screen (past offenders: `.metric-card` `min-width: 30vw`, footer `.social-link` `width: 10vw`)

---

## Commands

```bash
npm run dev      # Dev server on port 3000 (ngrok hosts allowed)
npm run build    # Build all six pages to dist/
npm run preview  # Preview production build
npm run icons    # Regenerate Iconoir CSS subset from HTML usage
```

---

## Deployment

Automatic deployment to Vercel on push to `main`. `vercel.json`:
- Build: `npm run build`
- Output: `dist/`
- Framework: Vite, catch-all rewrite for clean paths

---

## User Flow

```
User lands on index.html
    ↓
About entry animation + flip-board titles
    ↓
Scroll through project cards (CSS snap, GSAP entry, marquee)
    ↓
Click "Read Case Study"
    ↓
Case study page (carousels, accordions, side nav)
    ↓
Open images in GLightbox gallery
```

---

# Actions

At the first interaction of the day, before doing the prompt, read `.claude/CLAUDE-LOG.md`, review its content and update it with the key changes and decisions from the last 24 hours.

When a change alters anything documented here (pages, modules, rules), update this file in the same commit.
