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
# Actions

At the first interaction of the day, before doing prompt, read CLAUDE-LOG file, review content and compile as much as possible, update with last 24hours key changes and decisions.

