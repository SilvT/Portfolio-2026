# Portfolio 2025 - Silvia Travieso

**Personal UI/UX Designer Portfolio Website**
Live: https://silviatravieso.com

---

## Repository & Local Folder

| | |
|---|---|
| GitHub repo | `SilvT/Portfolio-2026` |
| Local folder (Silvia's computer) | `Portfolio-clean` (the local working copy of this repo) |
| Production branch | `main` (Vercel project `portfolio-clean` deploys on push) |

- Cloud sessions work in their own clone and sync via GitHub. After pushing, remind Silvia to run `git pull origin main` in `Portfolio-clean`.
- Before starting work in a cloud session, fetch the latest `main` in case changes were pushed from `Portfolio-clean`.

---

## Working Rules

- **Avoid overengineering.** Pick the simplest solution that works. No extra abstractions, options or files unless the task needs them.
- **Use the ponytail skills for all code work** (`ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, etc., from the `ponytail@ponytail` plugin). The only exceptions:
  - minimal cleanup (small tidy-ups, typo fixes, removing dead lines)
  - creating content: writing, images, design and other creative work (writing still follows the Professional Voice rule below)
  - If the ponytail skills are not available in the session, say so instead of silently skipping them.
- **Make no assumptions.** Check the code, the changelog or ask Silvia instead of guessing.
- **Bash commands are pre-approved** in Claude Code for this project (`.claude/settings.json` allows `Bash`).
- **Keep a changelog** in `.claude/CHANGELOG.md` (committed to the repo). It started from zero on 2026-09-28 and replaces the old `CLAUDE-LOG.md`, which is no longer updated. Create it if it doesn't exist. After every completed task, add a dated entry covering:
  - structural decisions
  - bugs encountered (symptom, cause, fix)
  - architectural and design choices and preferences
  - any other major change worth tracking
- **When debugging, first do a quick sweep of `.claude/CHANGELOG.md`** to check whether the issue has been seen before.

---

## Design System Rules

1. **`src/scss/_variables.scss` is the single source of truth** for colours, typography, spacing and other design tokens. If this file and `_variables.scss` disagree, `_variables.scss` wins.
2. **Never hardcode colours, pixel values or font sizes.** Always use the variables in `_variables.scss`. If a needed value doesn't exist, ask Silvia before adding a new token.
3. **All text must pass WCAG AA contrast** (4.5:1 for body text, 3:1 for large text of 24px, or 18.66px bold, and above).
4. **Every animation must respect `prefers-reduced-motion`**, and **every clickable element needs a visible focus state.**

---

## Visual Verification & Responsiveness (Playwright)

**No visual change is done until it has been checked in a real browser at every width below.** Responsiveness is a core quality bar for this portfolio: most visitors (recruiters, hiring managers) open it on a phone first.

**Tooling:** the Playwright MCP server is configured in `.mcp.json` (project scope). In cloud sessions without the MCP, use the pre-installed Playwright/Chromium directly. Run `npm run dev` (port 3000) and check `http://localhost:3000`.

**When it applies:** any change to HTML, SCSS or JS that affects layout, spacing, typography, images, animation or interaction. Skip it for text-only copy edits and non-visual changes.

### Widths to check (matching `breakpoints.scss`)
| Width | Represents |
|------:|------------|
| 375px | Small phone (primary mobile target) |
| 480px | `small-mobile` breakpoint |
| 768px | `mobile` breakpoint (carousel dots appear at 768px and below) |
| 1024px | `tablet` breakpoint |
| 1200px | `desktop` breakpoint |
| 1728px | `laptop` breakpoint |

Also check 1px either side of any breakpoint the change touches (e.g. 767px and 769px), where most responsive bugs hide.

### Checklist at every width
1. **No horizontal scroll:** `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. This has broken on mobile before (see "Horizontal Overflow Prevention" below).
2. **No overlapping or clipped elements:** text, images, cards, nav and footer circles.
3. **Readable text:** nothing smaller than the XS size (14px), sensible line lengths, no words breaking out of containers.
4. **Tap targets at least 44×44px** on phone widths.
5. **Sticky nav still sticks** after scrolling.
6. **Images and videos keep their proportions** and load.
7. **Interactive parts work:** nav links, about modal, accordions, Swiper carousels, marquee dots (mobile only), GLightbox on case study pages.
8. **Design System Rules hold:** contrast passes and focus states are visible (tab through the page).

### Animations
GSAP entry animations hide content for the first second or so. Either wait until they finish before taking a screenshot, or load the page with reduced motion emulated (`prefers-reduced-motion: reduce`). Check both: the animated version once finished, and the reduced-motion version.

### Reporting
Take a screenshot at each width and say which widths were checked and what was fixed. If something couldn't be verified, say so rather than reporting it as done.

---

## Writing & Text Content: Professional Voice

**Whenever Silvia asks for a rewrite, copy edit, or new text content** (page copy, case study text, bios, taglines, meta descriptions, alt text, etc.), **always read and follow `professional-voice-baseline.md` first.**

- If the file is not available in the current session, say so and ask Silvia for it before writing. Do not silently fall back to a generic voice.
- Always use British English spelling and never use em dashes.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 7.3.1 |
| Styling | SASS/SCSS 1.69.0 |
| Animation | GSAP 3.14.2 |
| Carousels | Swiper 12.0.3 |
| Lightbox | GLightbox 3.3.1 |
| Icons | Phosphor Icons, Iconoir (custom subset) |
| Deployment | Vercel |

---

## Project Structure

```
Portfolio-clean/
├── index.html                    # Landing page
├── marketing-management.html     # Case study template
├── scripts/
│   └── build-icons.cjs          # Iconoir CSS subset generator
├── vite.config.js               # Build configuration
├── vercel.json                  # Deployment config
├── public/                      # Static assets (images, CV, favicons)
│   ├── ds/                      # Design Systems images
│   ├── plugin/                  # Plugin project images
│   └── mkm/                     # Marketing Management images
└── src/
    ├── js/
    │   ├── main.js              # Entry point
    │   └── modules/
    │       ├── navigation.js        # Nav active state tracking
    │       ├── flipBoardAnimation.js # Animated job titles
    │       ├── scroll-hinter.js     # Scroll hint + GSAP scroll
    │       ├── lightgallery.js      # GLightbox initialization
    │       ├── accordion.js         # Expand/collapse sections
    │       ├── carousel-dots.js     # Slideshow dot nav + marquee sync
    │       └── side-nav-bar.js      # Dynamic case study nav
    └── scss/
        ├── _main.scss           # Main import file
        ├── iconoir-custom.css   # Auto-generated icon subset (npm run icons)
        ├── _variables.scss      # Design tokens
        ├── typography.scss      # Type system
        ├── breakpoints.scss     # Responsive mixins
        ├── landing-page/        # Homepage styles
        │   ├── about.scss
        │   ├── nav-bar.scss
        │   ├── project-cards.scss
        │   └── footer.scss
        └── case-studies/        # Case study styles
            ├── blocks.scss
            ├── hero.scss
            ├── carousel.scss
            └── accordion.scss
```

---

## Pages

### Landing Page (`index.html`)
- Hero with animated flip-board job titles
- About section with scroll hint
- Project cards showcase
- Contact section
- CSS scroll snap navigation

### Case Study (`marketing-management.html`)
- Hero section with project overview
- Content blocks (1-col, 2-col, galleries)
- Swiper carousels for project images
- Accordion sections for detailed content
- Side navigation tracking scroll position
- Theme support via `data-theme` attribute

---

## Design System

### Colors
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

## JavaScript Modules

### `navigation.js`
Tracks viewport position and updates active nav state with `aria-current="page"`.

### `flipBoardAnimation.js`
Character-by-character flip animation cycling through job titles. Respects `prefers-reduced-motion`.

### `scroll-hinter.js`
GSAP-powered smooth scroll to first project section. Manages scroll hint visibility.

### `lightgallery.js`
Initializes GLightbox for carousels, standalone images, gallery grids, and accordion images.

### `accordion.js`
Mutually exclusive accordion behavior for `.milestone` and `.cs-line-breaker.accordion` elements.

### `marquee-scroll.js`
GSAP-driven infinite marquee for project card slideshows. Exports `createMarqueeTween(slideshow, opts)` and `getMarqueeTween(slideshow)` via a shared `Map` registry. Handles hover-pause on desktop and respects `prefers-reduced-motion`. Duration: 45s desktop / 80s mobile.

### `carousel-dots.js`
Syncs dot navigation with the GSAP marquee tween on project card slideshows. Uses `requestAnimationFrame` to read `tween.progress()` and updates the active dot. Clicking a dot pauses the marquee via `tween.pause()`, jumps via `tween.progress()`, and resumes after 3s.

### `side-nav-bar.js`
Generates navigation from `data-section-title` attributes. Intersection Observer tracks scroll position with animated indicator.

---

## Key Features

- **No Framework** - Vanilla JS for minimal footprint
- **CSS Scroll Snap** - Native smooth section navigation
- **Modular Architecture** - Separate JS/SCSS modules
- **Accessibility** - ARIA labels, reduced motion support, focus management
- **Responsive** - Mobile-first with desktop enhancements
- **Theme Support** - Blue, green, neutral themes for case studies

---

## Iconoir Icons — Custom Subset

The project uses a **custom CSS subset** of Iconoir (31 icons out of 1,400+), not the full library. This reduced CSS from 2,973 KB to 47 KB.

- **Source**: `src/scss/iconoir-custom.css` (auto-generated, do not edit manually)
- **Imported in**: `src/scss/_main.scss` via `@import 'iconoir-custom.css'`
- **Generator**: `scripts/build-icons.cjs` — scans all HTML files for `iconoir-*` classes and extracts matching rules from `node_modules/iconoir/css/iconoir.css`

### Adding/Removing Icons
1. Add the icon class to any HTML file (e.g., `<i class="iconoir-arrow-right"></i>`)
2. Run `npm run icons`
3. The subset CSS is regenerated automatically

**NEVER import `iconoir/css/iconoir.css` directly** — it's 2.9 MB of inline SVG data URIs for all 1,400+ icons and CSS cannot tree-shake unused rules.

---

## GLightbox — Dynamic Loading

GLightbox JS and CSS are **dynamically imported**, not bundled into the main landing page:

- **Landing page**: GLightbox is NOT loaded (no lightbox needed)
- **Case study pages**: Loaded via dynamic `import()` in `main.js` when `.new-carousel.swiper` or similar selectors are detected
- **Mobile slideshow tap**: `carousel-dots.js` loads GLightbox on-demand on first tap via `await import('glightbox')`
- **CSS**: Loaded at runtime via `<link>` injection from CDN (`cdn.jsdelivr.net`), not via Vite CSS extraction (which would bundle it into all pages)

**NEVER add a static `import GLightbox` or `import 'glightbox/dist/css/glightbox.min.css'` to `main.js` or any module statically imported by `main.js`** — this would add ~60 KB JS + 14 KB CSS to the landing page where it's unused.

---

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build to dist/
npm run preview  # Preview production build
npm run icons    # Regenerate Iconoir CSS subset from HTML usage
```

---

## Deployment

Automatic deployment to Vercel on git push. Configuration in `vercel.json`:
- Build: `npm run build`
- Output: `dist/`

---

## File Flow

```
User lands on index.html
    ↓
Flip-board animation plays
    ↓
Scroll through sections (CSS snap)
    ↓
Click project card
    ↓
Navigate to case study (marketing-management.html)
    ↓
Explore via carousels, accordions, side nav
    ↓
Open images in GLightbox gallery
```
---
# Project Summary
What it is: A personal portfolio website for Silvia Travieso, a UI/UX Designer.

Live site: https://silviatravieso.com

## Goal
To showcase design work through an elegant, performant portfolio that demonstrates both design and front-end development skills. The site prioritizes:

- Minimal footprint - No framework, vanilla JavaScript
- Strong visual identity - Custom typography, color themes, and animations
- Accessibility - ARIA labels, reduced motion support, focus management
- Smooth user experience - CSS scroll snap, GSAP animations, lightbox galleries
Structure

The site has two main page types:

- Landing page (index.html) - Hero-about section, project CARDS showcase, and contact info

- Case studies (e.g., marketing-management.html) - Detailed project pages with carousels, accordions, side navigation, and image galleries

## Tech Approach
Built with modern vanilla web technologies:

- Vite for fast builds
- SASS/SCSS for organized styling
- GSAP for animations
- Swiper for carousels
-  GLightbox for image galleries
- Deployed automatically to Vercel on git push.


---
# Slideshow Behavior (Project Cards)
The project card slideshows use a **GSAP-driven marquee** on all viewports — a continuous infinite horizontal scroll of images, with duplicated images for seamless looping.

## Marquee Animation (GSAP)
- **Module**: `src/js/modules/marquee-scroll.js` — shared registry (`Map<HTMLElement, Tween>`)
- `gsap.to(slideshow, { xPercent: -50, ease: 'none', repeat: -1 })` replaces CSS `@keyframes`
- Images are duplicated in HTML (`aria-hidden="true"`) so the loop is seamless
- `width: max-content` on `.project-image-wrapper.slideshow` keeps all images side-by-side
- Desktop gap: `1.5rem` / Mobile gap: `1rem`
- Duration: 45s desktop / 80s mobile
- Hover pauses tween on desktop (`mouseenter`/`mouseleave`)
- Respects `prefers-reduced-motion` (returns `null`, no tween created)
- **Entry animation integration**: `project-card-entry-animation.js` creates the tween paused, plays it 3s after entry animation completes
- **NEVER use CSS `@keyframes` or `animation:` for the marquee** — all control is via GSAP `.pause()`, `.play()`, `.progress()`, `.restart()`

## Dot Indicators (Mobile Only)
- `.carousel-dots` are `display: none` on desktop, `display: flex` at `max-width: 768px`
- Positioned absolutely at bottom center with semi-transparent white background
- Active dot: expands from 8px circle to 24px rounded rectangle in `$blue`
- Inactive dots: 8px circles at 30% opacity blue
- **JavaScript-driven** via `carousel-dots.js`:
  - `requestAnimationFrame` loop reads `tween.progress()` to determine which slide is visible
  - Active dot updates in real-time as the marquee scrolls
  - Clicking a dot: `tween.pause()` → `tween.progress(index/count)` → resumes after 3s
---
# Critical CSS Rule: `overflow: clip` not `hidden`

**NEVER use `overflow: hidden` on `html`, `body`, or ancestors of sticky elements.**

`overflow: hidden` creates a scroll container, which breaks `position: sticky` on child/sibling elements. Use `overflow: clip` instead — it clips content visually the same way but does NOT create a scroll container.

This applies to:
- `html` and `body` — use `overflow-x: clip` to prevent horizontal overflow without breaking sticky nav
- `.contentbox` — uses `overflow: hidden` (acceptable since `.top-nav` is not a descendant)
- `.project-content` in `.experimental-layout` — uses `overflow: clip` to contain the `width: max-content` marquee slideshow
- `.top-nav` itself — uses `overflow-x: clip`

### Horizontal Overflow Prevention
Multiple sources of horizontal overflow were fixed on mobile:
- `100vw` / `100dvw` units include scrollbar width — always use `100%` instead
- `.metric-card` had duplicate `min-width: 30vw` overriding `min-width: 0` on mobile
- `.social-link` in footer had `width: 10vw`, `flex-shrink: 0`, `white-space: nowrap` not reset on mobile
- `html` and `body` use `overflow-x: clip` + `max-width: 100%` as safety net

