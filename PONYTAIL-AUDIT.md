# Ponytail Audit Report

**Date:** September 28, 2026  
**Scope:** Whole-repo audit for over-engineering, unused code, and simplification opportunities  
**Assessment:** Well-modularized, mostly clean — but 3 major dead-file deletions and 2 unused dependencies identified

---

## Findings (Ranked by Biggest Cut First)

### 🗑️ delete: old-blocks.scss (2,675 lines)
**What:** Dead legacy component styles never imported  
**Why:** Superseded by active `blocks.scss`  
**Where:** `src/scss/case-studies/old-blocks.scss`  
**Action:** Delete file  

### 🗑️ delete: about.scss (325 lines)
**What:** Commented-out import, replaced by `new-about.scss`  
**Why:** Dual maintenance of same styles in two files  
**Where:** `src/scss/landing-page/about.scss` — import at top is `// @use 'about'` (commented) while `@use 'new-about'` is active  
**Action:** Delete file, verify imports point to `new-about.scss`  

### 🗑️ delete: index copy.html (58,703 bytes)
**What:** Duplicate template file with zero references  
**Why:** Unlinked static archive  
**Where:** `index copy.html` (root)  
**Action:** Delete file  

### ⚙️ yagni: @phosphor-icons/web dependency (v2.1.2)
**What:** Unused package — zero Phosphor icon classes found in codebase  
**Why:** Iconoir is the active icon library (103+ uses); Phosphor is dead weight  
**Where:** `package.json` dependencies  
**Action:** Remove `@phosphor-icons/web` from `package.json`, run `npm install`  
**Savings:** ~50 KB bundle  

### 📚 stdlib: Scroll listener debounce pattern
**What:** Debounce logic duplicated across 3 modules  
**Why:** `navigation.js`, `scroll-hinter.js` (lines 96, 131) all re-implement debounce  
**Where:** `src/js/modules/`  
**Action:** Extract to `src/js/utils/debounce.js`, import in all three  
**Savings:** ~15 lines of boilerplate  

### ⚙️ yagni: GSAP ScrollTrigger registered 4 times
**What:** `.registerPlugin(ScrollTrigger)` called in multiple modules  
**Why:** Only needs to run once globally  
**Where:** 
- `src/js/modules/about-entry-animation.js`
- `src/js/modules/project-card-entry-animation.js`
- `src/js/modules/scroll-hinter.js`
- `src/js/modules/icon-animation.js`  

**Action:** Register once in `src/js/main.js` before importing other modules  
**Savings:** 3 redundant calls  

### ⚙️ yagni: Swiper dependency (v12.0.3)
**What:** Loaded but never instantiated  
**Why:** No `.swiper` classes or Swiper JS calls detected in active HTML/JS  
**Where:** `package.json` dependencies  
**Action:** Remove from `package.json`, run `npm install`  
**Savings:** ~60 KB bundle  

### 🗑️ delete: design-system-wip.html (15,859 bytes)
**What:** In-progress WIP case study  
**Why:** Linked in CTAs but marked incomplete  
**Where:** `design-system-wip.html` (root)  
**Action:** Decide: ship or archive. If archive, move to `/public/archive/` and unlink from CTAs  

### 📏 shrink: Dual DOMContentLoaded listeners
**What:** Two separate `DOMContentLoaded` events in `main.js`  
**Why:** Line 33 initializes main flow, line 88 initializes icon-animation separately  
**Where:** `src/js/main.js`  
**Action:** Merge both into single listener  
**Savings:** 3 lines  

### 📏 shrink: Legacy color/font/spacing aliases
**What:** `_variables.scss` maintains dual names (old + new) for ~25 lines  
**Why:** 4 "to-be-deprecated LEGACY" comments still aliased alongside new names  
**Where:** `src/scss/_variables.scss` (lines 27-34, 56-62, 93-98, 117-120)  
**Action:** Once migration is complete, delete the old aliases  
**Savings:** ~25 lines  

### 🏗️ native: Custom scroll hint functions (low priority)
**What:** Three scroll hint functions (`showScrollHint`, `showScrollHinter`, `checkVisibility`)  
**Why:** Could unify into single `IntersectionObserver`-based pattern  
**Where:** `src/js/modules/scroll-hinter.js`  
**Action:** Refactor (optional — low priority, currently working)  
**Savings:** 200+ lines possible  

### 🗑️ delete: _animations.scss placeholder (2,166 bytes)
**What:** File contains only `@keyframes` that are duplicated in `_variables.scss`  
**Why:** Imported but redundant  
**Where:** `src/scss/landing-page/_animations.scss`  
**Action:** Move all `@keyframes` to `_variables.scss`, delete file, update imports  
**Savings:** ~2 KB  

### ⚙️ yagni: Dev-only ngrok whitelist in vite.config.js
**What:** `allowedHosts` whitelist for local ngrok tunneling  
**Why:** Dev-only config in prod build file  
**Where:** `vite.config.js` (line 26)  
**Action:** Move to `.env.local`, exclude from production build  
**Savings:** 1 line  

---

## Summary

| Metric | Value |
|--------|-------|
| **Total lines to delete** | ~3,133 lines |
| **Unused dependencies** | 2 (`@phosphor-icons/web`, `swiper`) |
| **Bundle savings** | ~110 KB |
| **Dead files** | 3 (`old-blocks.scss`, `about.scss`, `index copy.html`, `design-system-wip.html`) |
| **Consolidation opportunities** | 3 (debounce, ScrollTrigger, DOMContentLoaded) |

## Recommendation

**High Priority (ship immediately):**
1. Delete `index copy.html` and `old-blocks.scss`
2. Remove `@phosphor-icons/web` and `swiper` from `package.json`
3. Merge dual DOMContentLoaded listeners

**Medium Priority (next sprint):**
4. Delete dead `about.scss`, consolidate to `new-about.scss`
5. Extract debounce utility, consolidate scroll listeners
6. Register GSAP ScrollTrigger once globally

**Low Priority (tech debt):**
7. Decide on `design-system-wip.html` (ship or archive)
8. Clean up legacy variable aliases after migration
9. Consolidate scroll hint functions into IntersectionObserver pattern

---

## Assessment

**Lean already.** The codebase is well-modularized and minimal overall. No over-engineering at the architectural level. The wins are:
- Removing 3 dead files (quick wins)
- Eliminating 2 unused dependencies (bundle reduction)
- Small consolidations (debounce, GSAP registration, DOMContentLoaded)

This is clean, vanilla JS — keep it.
