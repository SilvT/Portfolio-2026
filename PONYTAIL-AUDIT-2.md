# Ponytail Audit Report — Comprehensive

**Date:** September 28, 2026  
**Scope:** Whole-repo audit for over-engineering, dead code, unused assets, and simplification  
**Status:** Ready for cleanup — not fully lean yet

---

## Findings (Ranked by Biggest Cut First)

### 🗑️ delete: old-blocks.scss (2,675 lines)
**What:** Dead/experimental SCSS file, never imported anywhere  
**Why:** Complete deadweight from earlier iteration  
**Where:** `src/scss/case-studies/old-blocks.scss`  
**Action:** Delete file immediately  
**Impact:** -2,675 lines  

---

### 🗑️ delete: about.scss (325 lines)
**What:** Replaced by `new-about.scss`, marked dead in landing-page  
**Why:** Duplicate job title styles maintained in two places  
**Where:** `src/scss/landing-page/about.scss`  
**Action:** Verify all imports point to `new-about.scss`, delete `about.scss`  
**Impact:** -325 lines  

---

### 🗑️ delete: index copy.html (15.9 KB)
**What:** Dead page backup, never built or linked  
**Why:** Not in vite.config rollupOptions, unlinked static archive  
**Where:** `index copy.html` (root)  
**Action:** Delete file  
**Impact:** -15.9 KB  

---

### 🗑️ delete: design-system-wip.html (15.9 KB)
**What:** Incomplete WIP case study  
**Why:** Not linked anywhere, included in build, work-in-progress  
**Where:** `design-system-wip.html` (root)  
**Action:** Move to `/archive/` or complete and ship  
**Impact:** -15.9 KB  

---

### 🗑️ delete: Old CV file (210 KB)
**What:** `Silvia Travieso - Design Systems - UI - CV.pdf` — old CV  
**Why:** Never referenced; only `cv-silvia-travieso-2025.pdf` is used  
**Where:** `public/Silvia Travieso - Design Systems - UI - CV.pdf`  
**Action:** Delete file  
**Impact:** -210 KB  

---

### 🖼️ shrink: PNG/WebP duplication (significant asset overhead)
**What:** 46+ PNG files have WebP pairs taking 2x storage  
**Why:** HTML only uses `.png` format; WebP variants are dead weight  
**Where:** `public/` subdirectories — every PNG has matching WebP  
**Action:** Choose one format per image; delete unused pairs  
**Savings:** ~50% image directory reduction  
**Example paths:**
- `public/ds/` (Design Systems project)
- `public/plugin/` (Plugin project)  
- `public/mkm/` (Marketing Management project)

---

### 📦 stdlib: @phosphor-icons/web dependency
**What:** Zero usage across entire codebase  
**Why:** All icons use Iconoir custom subset (103+ uses vs 0 Phosphor uses)  
**Where:** `package.json` line 13  
**Action:** Remove dependency, run `npm install`  
**Impact:** -1 dependency, ~50 KB bundle  

---

### ⚙️ yagni: Duplicate DOMContentLoaded listeners in main.js
**What:** Icon init split into separate listener (lines 88-90)  
**Why:** Unnecessary second event; can merge with main listener  
**Where:** `src/js/main.js` lines 88-90 (separate from main listener at 33-83)  
**Action:** Merge icon initialization into main DOMContentLoaded  
**Impact:** -1 event listener, cleaner init flow  

---

### 🗑️ delete: switch.scss component
**What:** Single unused stylesheet with `.switch-container` hidden  
**Why:** Marked `display: none` in `_case-study.scss` lines 268-270  
**Where:** `src/scss/case-studies/switch.scss`  
**Action:** Either remove file and CSS rule, or implement the component  
**Impact:** -1 unused component  

---

### 📏 shrink: vite.config.js redundant modulePreload config
**What:** `modulePreload: false` (line 12)  
**Why:** Vite 7.3.1 defaults to false — explicit config is redundant  
**Where:** `vite.config.js` line 12  
**Action:** Delete line  
**Impact:** -1 line  

---

### 📏 shrink: vite.config.js dev-only ngrok config
**What:** `allowedHosts` whitelist for ngrok tunneling (line 26)  
**Why:** Development-only, shouldn't be in production config  
**Where:** `vite.config.js` line 26  
**Action:** Move to `.env.local`, exclude from version control  
**Impact:** Cleaner config, no dev-only leakage  

---

### 📏 shrink: Redundant transition rules in _landing-page.scss
**What:** `.contentbox` transition rules (lines 74-76)  
**Why:** Identical `opacity` and `transform` on all sections, no overrides  
**Where:** `src/scss/landing-page/_landing-page.scss` lines 74-76  
**Action:** Absorb into base reset, consolidate duplicates  
**Impact:** -3 lines of repeated rules  

---

## Summary Table

| Category | Count | Impact |
|----------|-------|--------|
| **Dead files** | 4 | -47.7 KB |
| **Dead assets** | 1 CV | -210 KB |
| **Image duplication** | 46+ PNG/WebP pairs | ~50% overhead |
| **Unused dependencies** | 1 (@phosphor-icons/web) | ~50 KB bundle |
| **Lines to delete** | ~3,061 | -3,061 LOC |
| **Over-registered logic** | 2 (DOMContentLoaded, switch.scss) | Cleaner flow |
| **Redundant config** | 2 (modulePreload, ngrok) | Cleaner vite.config |

---

## Priority Checklist

### 🔴 High Priority (Do Immediately)
- [ ] Delete `old-blocks.scss` (2,675 lines)
- [ ] Delete `index copy.html`
- [ ] Delete old CV file (`Silvia Travieso - Design Systems - UI - CV.pdf`)
- [ ] Remove `@phosphor-icons/web` from `package.json`
- [ ] Choose image format: delete all PNG or all WebP pairs (~210 KB+ recovery)

### 🟡 Medium Priority (Next Sprint)
- [ ] Delete `about.scss`, verify imports
- [ ] Delete `design-system-wip.html` or move to archive
- [ ] Merge dual DOMContentLoaded listeners
- [ ] Remove/implement `switch.scss`
- [ ] Move ngrok config to `.env.local`

### 🟢 Low Priority (Tech Debt)
- [ ] Delete redundant `modulePreload` config
- [ ] Consolidate `.contentbox` transition rules

---

## Assessment

**Not fully lean yet.** The codebase has good architecture but carries dead files and duplicate assets from earlier iterations. The biggest wins are:

1. **Deleting 2,675 lines** of old-blocks.scss
2. **Removing PNG/WebP duplication** (~50% image overhead)
3. **Cleaning up 4 dead files** (265 KB)
4. **Removing 1 unused dependency** (50 KB bundle)

**Recommendation:** Complete the high-priority checklist. After cleanup, this will be truly lean.

---

*Generated by Ponytail audit agent on 2026-09-28*
