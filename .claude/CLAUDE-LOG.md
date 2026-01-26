# Claude Log - Portfolio 2025

## 2026-01-26

### Session Summary
Vercel deployment finalized with analytics and speed insights integration. New case study pages added and design system WIP page created.

### Vercel Deployment & Analytics
- **`@vercel/analytics` (v1.6.1)** and **`@vercel/speed-insights` (v1.3.1)** added as dependencies
- Both initialized in `src/js/main.js` via `inject()` and `injectSpeedInsights()`
- `vercel.json` configured: Vite framework, build to `dist/`, URL rewrites for clean paths
- Deployment is automatic on git push to main

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
