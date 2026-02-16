# Claude Log - Portfolio 2025

## 2026-02-16

### Session Summary
Multiple improvements: Vercel Analytics custom events, HTML best-practices audit fixes, project card entry animation refactor (two parallel blocks with staggered slides), **CSS marquee → GSAP marquee refactor**, about modal, and marquee fine-tuning.

### Vercel Analytics Custom Events (`analytics-events.js`)
- **New module** tracking clicks on: About nav, Contact nav, Read Case Study buttons (with project ID), footer social links
- Uses `@vercel/analytics` `track()` function (already installed)

### HTML Best Practices Fixes (`index.html`)
- `<video>` elements: replaced invalid `alt` with `aria-label` (visible) or removed (aria-hidden duplicates)
- Removed `role="contentinfo"` from bio div (reserved for `<footer>`)
- Changed `<p class="icon">` to `<span class="icon">` in footer social links
- Fixed energy-tracker prev button `data-project-id` (3 → 2)
- Changed last project empty `<button>` to `<div aria-hidden="true">`

### Project Card Entry Animation Refactor
- Split into **two parallel blocks**: Block 1 (text: title → description → metrics) and Block 2 (slideshow + tags, starts at t=0)
- Block 2 staggers first 3 slide images individually, then pops in remaining + duplicates
- Marquee starts paused, plays 3s after entry animation completes
- Resets to slide 1 on scroll-down re-entry

### CSS Marquee → GSAP Marquee Refactor
- **Problem**: CSS `@keyframes marqueeScroll` had no clean API for pause/resume/restart. Hacking `animation = 'none'` + reflow + re-apply + `animationPlayState` was fragile and the loop/delay wasn't working correctly.
- **Solution**: New `marquee-scroll.js` module with GSAP tween (`x: -oneSetWidth`, `repeat: -1`, `ease: 'none'`)
- **Architecture**: Shared `Map<HTMLElement, Tween>` registry. Both `project-card-entry-animation.js` and `carousel-dots.js` import from it.
- `createMarqueeTween()` / `getMarqueeTween()` API replaces all CSS animation manipulation
- Desktop hover pause via `mouseenter`/`mouseleave` events (replaces CSS `&:hover { animation-play-state: paused }`)
- `carousel-dots.js` now reads `tween.progress()` instead of parsing CSS transform matrix via `DOMMatrixReadOnly`
- Dot click: `tween.pause()` → `tween.progress(index/count)` → resumes after 3s (replaces `animation-delay` offset hack)
- Reduced motion: `createMarqueeTween()` returns `null`, consumers handle gracefully

### Marquee Fine-Tuning (Session 2)
- **CSS `!important` fix**: Removed `opacity: 1 !important` from `.project-image` in slideshow — was overriding GSAP's `gsap.set(opacity: 0)`, making Block 2 entry animation invisible
- **Seamless loop fix**: Added `ensureFillWidth()` to `marquee-scroll.js` — dynamically clones original images until strip width >= oneSetWidth + viewportWidth, fixing empty space at loop seam for all slideshow lengths
- **Pixel-based offset**: Changed from `xPercent: -50` to `x: -oneSetWidth` (measured pixel width of one original set) — precise loop point regardless of image sizes
- **Consistent scroll speed**: `PX_PER_SEC = 90` constant — duration = oneSetWidth / speed, so all slideshows scroll at the same visual rate
- **Re-entry reset**: `resetToHidden()` uses live DOM query for aria-hidden dupes (catches dynamically cloned elements). `createMarqueeTween()` called before `dupeSlides` query so clones are included in the cached NodeList for timeline animation.
- **Marquee resume delay**: Reduced from 3s → 600ms after entry animation completes

### About Modal
- New `about-modal.js` module — slide-in `<dialog>` panel triggered from about section
- Styled in `new-about.scss`

### Key Decisions
- GSAP tween over CSS `@keyframes` for marquee — enables `.pause()`, `.play()`, `.progress()`, `.restart()` without hacks
- Shared module with Map registry over event bus or global state — minimal coupling, both consumers import directly
- Dynamic cloning via `ensureFillWidth()` over fixed HTML duplicates — adapts to any slideshow length/viewport size
- Never use GSAP function-based targets `() => querySelectorAll()` as `.to()` first arg — they silently do nothing; use cached NodeLists instead

### Files Created
- `src/js/modules/marquee-scroll.js` — GSAP tween factory + registry
- `src/js/modules/analytics-events.js` — Vercel Analytics custom events
- `src/js/modules/about-modal.js` — About modal slide-in panel

### Files Modified
- `src/js/modules/project-card-entry-animation.js` — Two parallel blocks, GSAP marquee integration (replaced CSS animation hacks)
- `src/js/modules/carousel-dots.js` — GSAP tween `.progress()` API (replaced CSS matrix parsing + animation-delay hack)
- `src/scss/landing-page/project-cards.scss` — Removed `@keyframes marqueeScroll`, `animation:`, hover pause, reduced-motion animation rule
- `src/js/main.js` — Added imports for analytics-events, about-modal
- `index.html` — HTML semantic fixes (video alt, contentinfo role, icon elements, nav buttons)
- `.claude/CLAUDE.md` — Added marquee-scroll.js docs, updated slideshow behavior section

---

## 2026-02-15 (Session 2)

### Session Summary
Performance optimization round 3: Vercel Speed Insights still showing RES 60 (desktop) / 62 (mobile), FCP 5.47s, LCP 5.69s. Root cause identified: **Iconoir CSS** (2,973 KB / 265 KB gzipped) was the single largest render-blocking resource — importing all 1,400+ icons when only 31 are used. Also dynamically imported GLightbox, added LCP preload, lazy video playback, and Google Fonts splitting.

### Iconoir CSS — Full Library → Custom 31-Icon Subset
- **Root cause of slow FCP/LCP**: `@import 'iconoir/css/iconoir.css'` in `_main.scss` imported the pre-built CSS with all 1,400+ icons as inline SVG data URIs
- CSS has no tree-shaking — entire file included regardless of usage
- **Created `src/scss/iconoir-custom.css`** with only the 31 icons used across all HTML files
- **2,973 KB → 137 KB total CSS bundle (95% reduction, gzipped: 265 KB → 19 KB)**
- **Automated script**: `npm run icons` (`scripts/build-icons.cjs`) scans all HTML files for `iconoir-*` classes and regenerates the subset from `node_modules/iconoir/css/iconoir.css`

### GLightbox — Dynamic Import (Landing Page)
- GLightbox JS (60 KB) + CSS (14 KB) was bundled into landing page via static imports in `carousel-dots.js` and `main.js`
- Lightbox is only used on case study pages + mobile slideshow tap
- **`carousel-dots.js`**: Removed static `import GLightbox`, now uses `await import('glightbox')` on first mobile tap
- **`main.js`**: GLightbox init wrapped in `if (document.querySelector('.new-carousel.swiper, ...))` with dynamic `import()`
- **`lightgallery.js`**: Removed `import 'glightbox/dist/css/glightbox.min.css'` — CSS loaded at runtime via `<link>` injection from CDN to prevent Vite extracting it into all pages
- **`vite.config.js`**: Added `modulePreload: false` to prevent Vite injecting `<link rel="modulepreload">` for dynamic chunks

### LCP Image Preload
- Added `<link rel="preload" as="image" href="/mkm/mkm-large hero.webp" type="image/webp">` to `index.html` `<head>`
- Starts download before CSS is parsed, improving LCP timing

### Video Lazy Playback
- Removed `autoplay` from all `<video>` tags in `index.html` (10 videos across 3 project cards)
- `autoplay` overrides `preload="none"` — browser downloads video immediately for autoplay
- Added IntersectionObserver in `main.js` that calls `.play()` when video enters viewport (200px margin) and `.pause()` when it leaves
- **Saves ~4 MB of immediate video downloads on landing page load**

### Google Fonts Split
- Previously: single request for Bricolage Grotesque + Fascinate + Anonymous Pro
- Now: Bricolage Grotesque (primary) loaded eagerly with `preload`, Fascinate + Anonymous Pro deferred
- Faster FCP since primary font resolves sooner

### Key Decisions
- Iconoir custom subset over switching icon libraries — preserves existing HTML, no class name changes
- `npm run icons` script for maintainability — regenerate subset after adding new icons to HTML
- CDN for GLightbox CSS (`cdn.jsdelivr.net`) rather than bundled — Vite's CSS extraction couldn't be disabled for dynamic imports
- IntersectionObserver for video playback rather than keeping autoplay — prevents unnecessary bandwidth usage

### Files Modified
- `index.html` — LCP preload, font split, video autoplay removed
- `src/js/main.js` — Dynamic GLightbox import, lazy video observer, removed static lightgallery import
- `src/js/modules/carousel-dots.js` — Dynamic GLightbox import on mobile tap
- `src/js/modules/lightgallery.js` — Removed CSS import (loaded at runtime)
- `src/scss/_main.scss` — `@import 'iconoir-custom.css'` replacing `@import 'iconoir/css/iconoir.css'`
- `vite.config.js` — Added `modulePreload: false`
- `package.json` — Added `"icons": "node scripts/build-icons.cjs"` script
- `.gitignore` — Added `public/mkm/card-hover.gif` (unused)

### Files Created
- `src/scss/iconoir-custom.css` — Custom 31-icon Iconoir subset (47 KB)
- `scripts/build-icons.cjs` — Automated icon subset generator

---

## 2026-02-15 (Session 1)

### Session Summary
Performance optimization round 2: Addressed Vercel Speed Insights showing RES 60, FCP 5.47s, LCP 5.69s on desktop. Converted all landing page images to WebP, videos from .mov to .mp4, GIF to .mp4 video, made Google Fonts non-render-blocking across all 6 pages.

### Image Optimization — PNG → WebP (ffmpeg)
- **15 images converted** to WebP across all 4 project card slideshows
- `mkm/mkm-large hero.png`: 3.4 MB → 594 KB (**83% reduction** — this was the LCP element)
- `mkm/UI-*.png`, `mkm/Look-and-feel-first-screen.png` → 38–65 KB each
- `ds/ds-hero.png`, `ds/ds-card-hover.png`, `ds/UIKIT.png` → 125–322 KB
- `microsite/tomato microsite screens.png`, `landing.png`, `mock.png`, `loading-animation.png` → 23–265 KB
- `plugin/TL-*.png`, `cover1.png` → 38–127 KB
- Original PNGs kept as backup, HTML `src` swapped directly to `.webp`

### Video Optimization — .mov → .mp4, GIF → .mp4 (ffmpeg, libx264 CRF 23)
- `mkm/journey.mov`: 42 MB → 2.9 MB (**93% reduction**)
- `mkm/card-hover-2.gif`: 4.8 MB → 1.1 MB — changed from `<img>` to `<video autoplay muted loop playsinline>`
- `microsite/loading-tomato-frame.mov`: 17 MB → 964 KB (**94% reduction**)
- `microsite/card-hover.mov`: 8.6 MB → 1.1 MB
- `microsite/application.mov`: 1.6 MB → 70 KB

### Font Loading — Render-blocking → Async (all 6 pages)
- Google Fonts `<link rel="stylesheet">` changed to `media="print" onload="this.media='all'"` pattern
- Added `<noscript>` fallback for JS-disabled browsers
- Kept existing `<link rel="preconnect">` and `<link rel="preload" as="style">` hints
- Applied to: `index.html`, `marketing-management.html`, `design-system-wip.html`, `energy-tracker.html`, `token-launch.html`, `design-system.html`

### Loading Hints
- All below-fold videos: `preload="none"` (was `preload="metadata"`)
- All images: added `decoding="async"`
- Hero image keeps `loading="eager"` + `fetchpriority="high"`

### Expected Impact
- FCP: 5.47s → ~1.5–2.5s (fonts no longer blocking render)
- LCP: 5.69s → ~2–3s (hero image 83% smaller + async fonts)
- Total landing page weight reduced by ~60+ MB

### Key Decisions
- Direct `.webp` swap (no `<picture>` fallback) — 97%+ browser support, cleaner HTML
- GIF converted to `<video>` rather than animated WebP — much smaller, better quality
- `.mov` → `.mp4` with H.264 codec for universal browser support

### Known Remaining Issues
- **GLightbox CSS** (~3 MB / 267 KB gzipped) bundled on all pages via `main.js` even though lightbox is only used on case studies — could be dynamically imported
- Speed Insights data needs 24–48h to reflect changes after deploy

### Files Modified
- `index.html` — async fonts, all image src → .webp, video src → .mp4, loading hints
- `marketing-management.html` — async fonts
- `design-system-wip.html` — async fonts
- `energy-tracker.html` — async fonts
- `token-launch.html` — async fonts
- `design-system.html` — async fonts

### Files Created (public/)
- `mkm/mkm-large hero.webp`, `mkm/Look-and-feel-first-screen.webp`, `mkm/UI-Leads-dashboard.webp`, `mkm/UI-interactions-inbox.webp`, `mkm/UI-Interactions-convo.webp`, `mkm/UI-grid-lead.webp`
- `mkm/card-hover-2.mp4`, `mkm/journey.mp4`
- `ds/ds-hero.webp`, `ds/ds-card-hover.webp`, `ds/UIKIT.webp`
- `microsite/tomato microsite screens.webp`, `microsite/landing.webp`, `microsite/loading-animation.webp`, `microsite/mock.webp`
- `microsite/loading-tomato-frame.mp4`, `microsite/card-hover.mp4`, `microsite/application.mp4`
- `plugin/TL-UI-push.webp`, `plugin/TL-Git.webp`, `plugin/cover1.webp`, `plugin/TL-publish.webp`

---

## 2026-02-14

### Session Summary
New `new-about` branch: redesigned About section with entry animations, and added staggered entry animations to all project cards. Removed CSS `stagger-fade-in` mixins from project cards in favour of GSAP ScrollTrigger-driven animations with re-entry support. Marquee slideshow speed reduced.

### About Section Entry Animation (`about-entry-animation.js`)
- **New module** created across prior sessions on this branch
- GSAP timeline with ScrollTrigger, staggering: SVG circles → name parts → job title → bio → scroll hinter
- Individual circle stagger (0.2s apart), grid elements 0.25s apart, scroll hinter with doubled delay
- Replays on `onEnter` and `onEnterBack` via paused timeline + `resetToHidden()` + `tl.restart()`
- Scroll hinter conflict resolved: `scroll-hinter.js` `showScrollHinter()` now only hides (not shows) the element — entry animation controls visibility
- `visibility: hidden/visible` added alongside `opacity` to prevent inline style conflicts

### Project Card Entry Animation (`project-card-entry-animation.js`)
- **New module** — staggered entry for all 4 `.section-project` cards
- Animation order per card:
  1. `.project-title` → `.type-label` + `.project-meta`
  2. `.project-description` → `.project-details` + `.meta-group`
  3. `.metric-card` (staggered one by one, 0.2s apart)
  4. `.slideshow-container` + `.data-tags` (gentle fade, 1.2s duration, `power1.inOut`)
- **Scroll direction speed**: normal `timeScale(1)` on scroll down, faster `timeScale(2.5)` on scroll back up
- Respects `prefers-reduced-motion`

### CSS `stagger-fade-in` Mixin Removal (Project Cards)
- Removed `@include stagger-fade-in()` from: `.text-content`, `.metric-card`, `.cs-metric-content`, `.cs-metric-icon-wrapper`, `.cs-metric-value`, `.cs-metric-label`, `.tags`, `.tag-list`
- Removed `@include stagger-fade-in-reduced-motion` from reduced-motion block
- These CSS animations used `animation: fadeInUp forwards` which overrode GSAP's inline `opacity: 0` — GSAP now has full control
- CSS animations were also not functioning correctly on their own (user confirmed)

### Marquee Speed Reduction
- Desktop: 30s → 45s
- Mobile: 60s → 80s

### Key Decisions
- GSAP ScrollTrigger preferred over CSS animations for entry effects — enables re-entry replay, scroll-direction-aware speed, and programmatic control
- CSS `stagger-fade-in` mixin kept in `_animations.scss` (still used by About section SCSS) but removed from project cards
- `timeScale()` approach for scroll direction speed — same timeline, no duplicate code

### Files Modified
- `src/js/modules/about-entry-animation.js` — New module (created in prior sessions on this branch)
- `src/js/modules/project-card-entry-animation.js` — New module
- `src/js/main.js` — Imports + calls for both entry animation modules
- `src/js/modules/scroll-hinter.js` — `showScrollHinter()` changed to hide-only logic
- `src/scss/landing-page/project-cards.scss` — Removed `stagger-fade-in` includes, marquee speed reduced

### Files Created
- `src/js/modules/project-card-entry-animation.js`
- `src/js/modules/about-entry-animation.js` (prior sessions)

---

## 2026-01-27

### Session Summary
Performance optimization: added native lazy loading, font preloading, and removed unused Noto Sans font across all 6 pages. Git push issue resolved (rebase over remote Vercel PR merge). Remote URL updated to new repo name.

### Performance: Lazy Loading & Font Preload
- **Native `loading="lazy"`** added to all below-fold `<img>` tags across all 6 HTML pages (~60+ images total)
- **`loading="eager"` + `fetchpriority="high"`** added to LCP image on `index.html` (`mkm-large hero.png`)
- Case study hero images already had `loading="eager"` — no change needed
- Logo SVGs left without loading attribute (small, always needed)

### Font Optimization
- **Removed unused Noto Sans** (`wght@100..900`) from Google Fonts URL on all 6 pages — was imported but never referenced in SCSS
- **Added `<link rel="preload" as="style">`** for Google Fonts stylesheet on all 6 pages — hints browser to fetch font CSS earlier
- Fonts retained: Bricolage Grotesque (200-800), Fascinate, Anonymous Pro (400, 700)

### JS Cleanup
- **Removed `initLazyLoading()`** from `src/js/main.js` — it only added a `.loaded` CSS class via IntersectionObserver, didn't actually defer image loading. Native `loading="lazy"` replaces this behavior at the browser level.

### Git / Deployment
- Resolved non-fast-forward push via `git pull --rebase origin main` (remote had Vercel Web Analytics PR merge `acecae6`)
- Updated remote URL from `Portfolio-clean.git` to `Portfolio-2026.git` (repo renamed on GitHub)

### Files Modified
- `index.html` — font preload, remove Noto Sans, `loading="eager"` on LCP, `loading="lazy"` on all other images
- `marketing-management.html` — font preload, remove Noto Sans, `loading="lazy"` on 22 images
- `energy-tracker.html` — font preload, remove Noto Sans, `loading="lazy"` on 9 images
- `design-system.html` — font preload, remove Noto Sans, `loading="lazy"` on 19 images
- `design-system-wip.html` — font preload, remove Noto Sans (only 2 images: logo + hero)
- `token-launch.html` — font preload, remove Noto Sans (only 2 images: logo + hero)
- `src/js/main.js` — Removed `initLazyLoading()` function and its call from `initVisualEffects()`

### Known Remaining Performance Issues
- **Large unoptimized images** — `mkm-large hero.png` (3.4MB), `card-hover-2.gif` (4.8MB) still load at full size. Converting to WebP and replacing GIF with MP4 would yield the biggest improvement.
- **GLightbox CSS** (3MB) loaded on landing page even though lightbox is only used on case studies
- **Duplicate marquee images** — still loaded twice for seamless loop animation

---

## 2026-01-26

### Session Summary
Vercel deployment finalized with analytics and speed insights integration. New case study pages added and design system WIP page created. Marquee animation unified across all viewports and carousel dot navigation made functional.

### Slideshow: Marquee on Mobile + Carousel Dots
- **Marquee kept on mobile** — Removed the `@include breakpoint(mobile)` override in `project-cards.scss` that disabled the marquee animation (`animation: none`, `scroll-snap-type`, `overflow-x: auto`). Mobile now inherits the same continuous marquee as desktop.
- **Mobile image overrides removed** — Removed `width: 100%`, `object-fit: cover`, `scroll-snap-align: start` mobile overrides on `.project-image`. Images now display at natural aspect ratio (same as desktop) with `border-radius: 4px` on mobile.
- **Duplicate images visible on mobile** — Removed `display: none` rule for `aria-hidden="true"` images on mobile, since they're needed for the seamless marquee loop.
- **New module: `carousel-dots.js`** — Created JS to make dot navigation functional:
  - `requestAnimationFrame` loop reads the CSS `transform` matrix to determine which slide is at the left edge
  - Updates `.active` class on the corresponding dot in real-time
  - Clicking a dot pauses the marquee, jumps to that slide via `translateX`, resumes after 3s with correct `animationDelay`
- **Wired up in `main.js`** — `initCarouselDots()` added to `DOMContentLoaded` handler
- Dots remain **mobile-only** (`display: none` on desktop, `display: flex` at `max-width: 768px`)

#### Files Modified
- `src/scss/landing-page/project-cards.scss` — Removed mobile scroll-snap overrides, kept marquee everywhere
- `src/js/modules/carousel-dots.js` — New module
- `src/js/main.js` — Import + init carousel dots

### Vercel Deployment & Analytics
- **`@vercel/analytics` (v1.6.1)** and **`@vercel/speed-insights` (v1.3.1)** added as dependencies
- Both initialized in `src/js/main.js` via `inject()` and `injectSpeedInsights()`
- `vercel.json` configured: Vite framework, build to `dist/`, URL rewrites for clean paths
- Deployment is automatic on git push to main
Problem: Analytics was only running on index.html (via main.js + a redundant inline script). The 5 case study pages had no analytics at all.

Changes:

Removed the duplicate inline analytics script from index.html (already covered by main.js)
Added inject() and injectSpeedInsights() to the inline <script type="module"> in all 5 case study pages:
marketing-management.html
energy-tracker.html
design-system.html
design-system-wip.html
token-launch.html
Coverage now: All 6 pages have Vercel Analytics and Speed Insights. Build passes cleanly.


### New Pages & Content (Jan 25–26)
- **`design-system.html`** — Full design system case study (1000+ lines)
- **`design-system-wip.html`** — Placeholder/WIP version for the design system page
- **`energy-tracker.html`** — Energy tracker case study page
- **`token-launch.html`** — Token launch case study page
- All pages unified with source file imports (accordion, lightgallery, side-nav-bar modules)
- Side-nav HTML removed from templates (generated dynamically from `data-section-title`)
- New project images added: `public/ds/`, `public/microsite/` (playground, ux-translate series)

### Routing & Link Updates
- Internal links to design system updated from `/design-system.html` → `/design-system-wip.html` across `marketing-management.html`, `energy-tracker.html`, and `design-system.html` (breadcrumbs, CTAs, milestone links)
- `design-system-wip.html` added to `vite.config.js` rollup inputs

### Build Config
- `vite.config.js` now includes all pages: `index`, `marketing-management`, `design-system`, `design-system-wip`, `energy-tracker`, `token-launch`

### Key Commits
- `8f7fb6f` — Vercel analytics & speed insights implementation
- `4f0fd6b` — Vercel deploy config, link updates to design-system-wip
- `28e31c1` — New project pages, blocks restructuring, design system WIP page, new images

### Files Modified
- `package.json` — Added `@vercel/analytics`, `@vercel/speed-insights`
- `src/js/main.js` — Analytics + speed insights initialization
- `vite.config.js` — Added `design-system-wip` to build inputs
- `vercel.json` — Deployment configuration
- `design-system.html`, `energy-tracker.html`, `marketing-management.html` — Internal links updated
- `src/scss/case-studies/_case-study.scss` — Style adjustments
- `src/scss/case-studies/blocks.scss` — New block styles
- `src/scss/case-studies/carousel.scss` — Carousel style cleanup
- `src/js/modules/lightgallery.js` — Gallery initialization updates

---

## 2026-01-25

### Session Summary
Unified two new case study pages (`energy-tracker.html` and `token-launch.html`) with existing project architecture.

### Changes Made
- Replaced bundled production assets with source file imports in both new pages
- Added module imports for `accordion.js`, `lightgallery.js`, and `side-nav-bar.js`
- Removed static side-nav HTML (now generated dynamically from `data-section-title` attributes)
- Added both pages to `vite.config.js` build inputs
- Images with `.glightbox` class and `data-gallery` attributes now work with lightbox

### Files Modified
- `energy-tracker.html` - Script/style imports, removed static side-nav
- `token-launch.html` - Script/style imports, removed static side-nav
- `vite.config.js` - Added new pages to rollup inputs

---

## 2026-01-22

### Project Status
Portfolio website is functional with:
- Landing page with flip-board animation, scroll snap navigation
- Case study page (marketing-management.html) with carousels, accordions, side nav
- GLightbox for image galleries (migrated from lightGallery)
- Footer icon animation recently added

### Recent Changes (from git history)
- `e6cda77` - Footer icon animation added
- `59ab575` - Metric cards carousel order fixed
- `904d293` - Lightbox migration to GLightbox
- `1f3ed0e` - SCSS cleanup and restructuring
- `a7d8d84` - Side nav bar fixes for case studies

### Key Decisions
- Using vanilla JS (no framework) for minimal footprint
- GLightbox chosen over lightGallery for lightbox functionality
- CSS scroll snap for section navigation
- Modular SCSS architecture with separate files per component

---
