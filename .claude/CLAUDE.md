# Portfolio 2025 - Silvia Travieso

**Personal UI/UX Designer Portfolio Website**
Live: https://silviatravieso.com

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 7.3.1 |
| Styling | SASS/SCSS 1.69.0 |
| Animation | GSAP 3.14.2 |
| Carousels | Swiper 12.0.3 |
| Lightbox | GLightbox 3.3.1 |
| Icons | Phosphor Icons, Iconoir |
| Deployment | Vercel |

---

## Project Structure

```
Portfolio-clean/
├── index.html                    # Landing page
├── marketing-management.html     # Case study template
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

### `carousel-dots.js`
Syncs dot navigation with the marquee animation on project card slideshows. Uses `requestAnimationFrame` to track which slide is visible via the CSS transform matrix and updates the active dot. Clicking a dot pauses the marquee, jumps to that slide, and resumes after 3s.

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

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build to dist/
npm run preview  # Preview production build
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
The project card slideshows use a **marquee animation** on all viewports — a continuous infinite horizontal scroll of images, with duplicated images for seamless looping.

## Marquee Animation
- CSS `@keyframes marqueeScroll` translates from `0%` to `-50%` over 30s (linear, infinite)
- Images are duplicated in HTML (`aria-hidden="true"`) so the loop is seamless
- `width: max-content` on `.project-image-wrapper.slideshow` keeps all images side-by-side
- Desktop gap: `1.5rem` / Mobile gap: `1rem`
- Animation pauses on hover (desktop)

## Dot Indicators (Mobile Only)
- `.carousel-dots` are `display: none` on desktop, `display: flex` at `max-width: 768px`
- Positioned absolutely at bottom center with semi-transparent white background
- Active dot: expands from 8px circle to 24px rounded rectangle in `$blue`
- Inactive dots: 8px circles at 30% opacity blue
- **JavaScript-driven** via `carousel-dots.js`:
  - `requestAnimationFrame` loop reads the CSS transform matrix to determine which slide is visible
  - Active dot updates in real-time as the marquee scrolls
  - Clicking a dot pauses the marquee, jumps to that slide, and resumes after 3s
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

---

# Actions

At the first interaction of the day, before doing prompt, read CLAUDE-LOG file, review content and compile as much as possible, update with last 24hours key changes and decisions.

