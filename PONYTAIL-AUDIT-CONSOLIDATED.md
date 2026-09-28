# Ponytail Audit Report — Consolidated

**Date:** September 28, 2026  
**Scope:** Comprehensive whole-repo audit for over-engineering, dead code, and optimization  
**Status:** Complete — Ready for cleanup

---

## Findings (Ranked by Impact)

### 🗑️ CRITICAL: old-blocks.scss (2,675 lines)
`delete:` Dead experimental SCSS never imported. [src/scss/case-studies/old-blocks.scss]

### 🗑️ CRITICAL: about.scss (325 lines)
`delete:` Superseded by new-about.scss, import commented out. [src/scss/landing-page/about.scss]

### 🗑️ HIGH: PNG/WebP image duplication (~240 KB)
`shrink:` 46 PNG files have matching WebP; HTML uses only .png format. Delete one set. [public/ds/, public/plugin/, public/mkm/]

### 🗑️ HIGH: Old CV file (210 KB)
`delete:` "Silvia Travieso - Design Systems - UI - CV.pdf" unused; only cv-silvia-travieso-2025.pdf active. [public/Silvia Travieso - Design Systems - UI - CV.pdf]

### 🗑️ HIGH: index copy.html (15.9 KB)
`delete:` Backup copy, not in Vite build config. [index copy.html]

### 🗑️ HIGH: design-system-wip.html (15.9 KB)
`delete:` Incomplete WIP case study, not linked. [design-system-wip.html]

### 📦 HIGH: @phosphor-icons/web dependency (~50 KB)
`stdlib:` Zero usage; iconoir active (103+ uses). Remove from package.json. [package.json]

### ⚙️ MEDIUM: Duplicate DOMContentLoaded listeners
`yagni:` Icon init split into separate listener (lines 88-90). Merge with main listener (33-83). [src/js/main.js]

### ⚙️ MEDIUM: Debounce logic duplication
`stdlib:` Duplicated in 3 modules (navigation.js, scroll-hinter.js). Extract to utils. [src/js/modules/]

### ⚙️ MEDIUM: GSAP ScrollTrigger registered 4 times
`yagni:` Redundant registrations in multiple modules. Register once in main.js. [src/js/modules/about-entry-animation.js, project-card-entry-animation.js, scroll-hinter.js, icon-animation.js]

### 🗑️ MEDIUM: switch.scss component
`delete:` Single unused stylesheet, `.switch-container` hidden (display: none). [src/scss/case-studies/switch.scss]

### 📏 LOW: vite.config.js modulePreload (line 12)
`shrink:` Vite 7.3.1 defaults false; redundant explicit config. Delete line. [vite.config.js:12]

### 📏 LOW: vite.config.js allowedHosts ngrok (line 26)
`shrink:` Dev-only tunneling config; move to .env.local. [vite.config.js:26]

### 📏 LOW: Dual variable aliases in _variables.scss
`shrink:` Legacy aliases maintained alongside new names (~25 lines). Clean up after migration complete. [src/scss/_variables.scss:27-34, 56-62, 93-98, 117-120]

### 🏗️ LOW: Custom scroll hint functions (low priority)
`native:` Three functions could unify into single IntersectionObserver pattern (~200+ lines possible). [src/js/modules/scroll-hinter.js]

### 🗑️ LOW: _animations.scss placeholder
`delete:` Contains only @keyframes duplicated in _variables.scss. Consolidate and remove file. [src/scss/landing-page/_animations.scss]

---

## Impact Summary

| Metric | Value |
|--------|-------|
| **Total lines to delete** | ~3,061 lines |
| **Asset overhead** | ~450+ KB (images + old CV) |
| **Unused dependencies** | 1 (@phosphor-icons/web) |
| **Bundle savings** | ~50-110 KB |
| **Dead files** | 4 HTML + 2 SCSS |
| **Redundant registrations** | 2 (DOMContentLoaded, GSAP) |
| **Duplicate logic** | 3 (debounce, scroll hints) |

**net: -3,061 lines, -450+ KB assets, -1 dependency possible**

---

## Action Checklist

### 🔴 HIGH PRIORITY (Ship Immediately)
- [ ] Delete `old-blocks.scss` (2,675 lines)
- [ ] Delete `about.scss` (325 lines)
- [ ] Delete `index copy.html` (15.9 KB)
- [ ] Delete old CV file (210 KB)
- [ ] Delete or consolidate PNG/WebP pairs (~240 KB savings)
- [ ] Remove `@phosphor-icons/web` from package.json
- [ ] Run `npm install` after dependency removal

### 🟡 MEDIUM PRIORITY (Next Sprint)
- [ ] Delete `design-system-wip.html` or move to archive
- [ ] Merge dual DOMContentLoaded listeners in main.js
- [ ] Extract debounce utility to `src/js/utils/debounce.js`
- [ ] Register GSAP ScrollTrigger once globally in main.js
- [ ] Delete or implement `switch.scss`
- [ ] Move ngrok config to `.env.local`

### 🟢 LOW PRIORITY (Tech Debt)
- [ ] Clean up legacy variable aliases in _variables.scss
- [ ] Refactor scroll hint functions to IntersectionObserver
- [ ] Remove redundant modulePreload config from vite.config.js
- [ ] Consolidate _animations.scss keyframes to _variables.scss

---

## Assessment

**Not fully optimized yet.** The codebase has good fundamentals but carries dead files and duplicate assets from earlier iterations.

**Biggest wins:**
1. Delete old-blocks.scss (2,675 lines) — quick win
2. Remove PNG/WebP duplication (~240 KB) — significant asset savings
3. Delete 4 dead files (265 KB) — quick cleanup
4. Remove unused dependency (~50 KB bundle)

**After cleanup:** This will be a lean, well-modularized codebase.

---

*Consolidated from multiple ponytail audits run on 2026-09-28*
