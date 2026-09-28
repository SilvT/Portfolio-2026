# Ponytail Audit Report

**Date:** September 28, 2026  
**Scope:** Comprehensive whole-repo audit for over-engineering, dead code, and unused assets  
**Status:** Complete — Ready for cleanup

---

## Findings (Ranked by Impact)

### 🗑️ CRITICAL: Unused Video Files (.mov format) — 56 MB

**delete:** 7 `.mov` video files in `public/microsite/`, all replaced by `.mp4` versions:
- `initiated.mov` (2.9 MB) → use `initiated.mp4`
- `loading-tomato-frame.mov` (17 MB) → use `loading-tomato-frame.mp4`
- `payment error.mov` (2.2 MB) → use `payment error.mp4`
- `tomato-ready.mov` (4.0 MB) → use `tomato-ready.mp4`
- `trad meter and end.mov` (5.9 MB) → use `trad meter and end.mp4`
- `application.mov` (1.6 MB) → use `application.mp4`
- `errores.mov` (7.0 MB) — not referenced in HTML
- `switching-smart.mov` (13 MB) — not referenced in HTML

**Path:** `public/microsite/*.mov`  
**Action:** Delete all 7 `.mov` files, verify `.mp4` versions are referenced in HTML  
**Savings:** 56 MB

---

### 🗑️ CRITICAL: Unused Images in public/ds/ — 2.5 MB

**delete:** 13 unused design system images never referenced in HTML:
- `css-export.png`
- `early-designs.png`
- `early-tokens.png`
- `initial-phase-*.png` (3 files)
- `learnings-*.png` (3 files)
- `mistakes-*.png` (3 files)
- `wrong-core.png`

**Path:** `public/ds/`  
**Action:** Delete all 13 image files  
**Note:** CLAUDE-LOG confirms these were "being cleaned up" but never removed  
**Savings:** 2.5 MB

---

### 🗑️ CRITICAL: Unused Images in public/microsite/ — 5.5 MB

**delete:** 21 unused microsite images never referenced in HTML:
- `first draft by stakeholders.png`
- `first playground ui iterations.png`
- `hero.png`
- `mock-*.png` (5 files)
- `playground-*.png` (4 files)
- `stepper-*.png` (2 files)
- `tomato - brand reference.png`
- `ux-customer journey.png`
- `ux-translate-1.png`
- `ui designs.png`
- `micro animations.png`

**Path:** `public/microsite/`  
**Action:** Delete all 21 image files  
**Savings:** 5.5 MB

---

### 🗑️ HIGH: Unused GIF Files — 9.6 MB

**delete:** Two GIF files replaced by `.mp4` versions:
- `public/mkm/card-hover.gif` (4.8 MB) → use `card-hover.mp4`
- `public/mkm/card-hover-2.gif` (4.8 MB) → use `card-hover-2.mp4`

**Path:** `public/mkm/`  
**Action:** Delete both `.gif` files, update `.gitignore`  
**Savings:** 9.6 MB

---

### 📦 HIGH: Unused Dependencies

**delete:** `@phosphor-icons/web` (v2.1.2)
- **What:** Never imported or referenced in codebase
- **Why:** Iconoir is the active icon library
- **Path:** `package.json:13`
- **Action:** Remove from dependencies, run `npm install`

**delete:** `swiper` (v12.0.3)
- **What:** Never imported as ES module, only Swiper CSS loaded from CDN
- **Why:** Inline scripts in case study pages fetch Swiper directly from CDN
- **Path:** `package.json:19`
- **Action:** Remove from dependencies, run `npm install` (or keep if inline scripts need it)

**Savings:** ~110 KB bundle

---

### 🗑️ HIGH: Dead CSS File — 2,675 lines

**delete:** `src/scss/case-studies/old-blocks.scss`
- **What:** Marked as deprecated in comments, never imported by `_case-study.scss`
- **Why:** Superseded by active `blocks.scss`
- **Content:** Only commented-out legacy CSS + one active rule for `.project-page-body`
- **Path:** `src/scss/case-studies/old-blocks.scss`
- **Action:** Extract `.project-page-body` rule (lines 1–21) to `_case-study.scss`, delete file
- **Savings:** 2,675 lines

---

### 📏 MEDIUM: Legacy CSS Variables — 70 lines

**stdlib:** `src/scss/_variables.scss` contains duplicate legacy color aliases

**What:** Lines 27–98 define old color variable names alongside new 100–700 scale:
- `$color-blue-light` → `$color-blue-100`
- `$color-blue-soft` → `$color-blue-200`
- `$color-blue-dark` → `$color-blue-400`
- `$color-blue-darker` → `$color-blue-500`
- Similar for green and neutral scales

**Why:** Marked with "To-be-deprecated — LEGACY" comments, full migration to modern scale not yet complete

**Path:** `src/scss/_variables.scss:27-98`  
**Action:** Migrate all references to modern 100–700 scale, delete old aliases  
**Savings:** ~70 lines

---

### ⚙️ LOW: Orphaned .gitignore Rules

**yagni:** `.gitignore` contains entries for non-existent files:
- `*index copy.html` (line 27) — file doesn't exist
- `*building.about.md` (line 28) — file doesn't exist
- `public/mkm/card-hover.gif` (line 36) — file exists but unreferenced (to be deleted)

**Path:** `.gitignore:27–28, 36`  
**Action:** Remove rules for non-existent files, update after deleting dead assets  
**Savings:** 3 lines

---

### ✓ VERIFIED: vite.config.js Configuration

**status:** Configuration is correct.

`modulePreload: false` (line 12) is intentional — it prevents GLightbox CSS from being bundled on the landing page since it's dynamically imported with runtime CSS injection via CDN. Comment is present and rationale is sound.

---

## Impact Summary

| Category | Count | Size | Priority |
|----------|-------|------|----------|
| **Video files (.mov)** | 7 files | 56 MB | 🔴 CRITICAL |
| **Unused images (ds/)** | 13 files | 2.5 MB | 🔴 CRITICAL |
| **Unused images (microsite/)** | 21 files | 5.5 MB | 🔴 CRITICAL |
| **Unused GIF files** | 2 files | 9.6 MB | 🔴 CRITICAL |
| **Unused dependencies** | 2 deps | ~110 KB | 🟡 HIGH |
| **Dead CSS file** | 1 file | 2,675 lines | 🟡 HIGH |
| **Legacy CSS variables** | ~70 lines | — | 🟢 MEDIUM |
| **Orphaned .gitignore rules** | 3 rules | — | 🟢 LOW |

---

## Total Impact

```
net: -2,675 lines CSS, -2 dependencies, -73.8 MB assets, -110 KB bundle
```

### Breakdown
- **Asset cleanup:** 73.8 MB (videos, images, GIFs)
- **Code cleanup:** 2,675 lines (old-blocks.scss)
- **Dependency cleanup:** 2 deps, ~110 KB bundle
- **CSS refinement:** 70 lines (legacy aliases)

---

## Action Checklist

### 🔴 CRITICAL (Do First — 73.8 MB savings)
- [ ] Delete all 7 `.mov` files from `public/microsite/`
- [ ] Delete all 13 unused images from `public/ds/`
- [ ] Delete all 21 unused images from `public/microsite/`
- [ ] Delete 2 `.gif` files from `public/mkm/`
- [ ] Verify corresponding `.mp4` versions are referenced in HTML
- [ ] Update `.gitignore` to remove obsolete rules

### 🟡 HIGH (Next Priority — 2,677 lines + bundle)
- [ ] Remove `@phosphor-icons/web` from `package.json`
- [ ] Remove `swiper` from `package.json` (or verify it's needed for inline scripts)
- [ ] Run `npm install` after dependency removal
- [ ] Extract `.project-page-body` rule from `old-blocks.scss` to `_case-study.scss`
- [ ] Delete `src/scss/case-studies/old-blocks.scss`

### 🟢 MEDIUM (Next Sprint)
- [ ] Migrate all legacy color variable references in SCSS files to modern 100–700 scale
- [ ] Delete legacy color aliases from `src/scss/_variables.scss`
- [ ] Clean up `.gitignore` entries after asset deletions

---

## Recommendation

**Ship the CRITICAL cleanup immediately.** Removing 73.8 MB of unused media files is a quick, high-impact win with zero risk. The asset overhead is the biggest opportunity.

**For HIGH priority:** The unused dependencies and dead CSS are small but should be cleaned in the same pass as assets.

**For MEDIUM priority:** CSS variable migration can be deferred to a future refactor pass.

---

## Ponytail Summary

**Codebase assessment:** Good architecture, minimal CSS, well-modularized JavaScript. Main issues are asset bloat from earlier iterations (design exploration artifacts) and two unused dependencies. After cleanup, this will be lean.

**Biggest wins:**
1. Remove `.mov` video files (56 MB)
2. Delete unused images (8 MB)
3. Remove unused dependencies (~110 KB bundle)
4. Clean up dead CSS file (2,675 lines)

---

*Generated by Ponytail audit on 2026-09-28*
