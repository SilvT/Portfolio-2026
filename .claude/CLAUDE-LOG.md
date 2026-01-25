# Claude Log - Portfolio 2025

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
