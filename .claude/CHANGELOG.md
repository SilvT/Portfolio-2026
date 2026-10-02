# Changelog

Started from zero on 2026-09-28. Replaces `CLAUDE-LOG.md`, which is no longer updated.
Newest entries first. Each entry notes structural decisions, bugs (symptom, cause, fix), architecture and design choices, and other major changes.

---

## 2026-10-02

### Typo sweep across landing page and case studies
- Scanned `index.html`, `marketing-management.html`, `design-system.html`, `energy-tracker.html`, `token-launch.html` for spelling errors in visible copy.
- Fixed: "ansyc"→"async", "Reusablility"→"Reusability", "suppport"→"support" (duplicated across `marketing-management.html` and `design-system.html` from shared boilerplate), "incresingly"→"increasingly" (same duplication), "Consolitated"→"Consolidated" (3 files), "perferences"→"preferences", stray "∂" character before "that" in `design-system.html`, "unrealiable"→"unreliable", "scatered"→"scattered", "acomprehensive"→"a comprehensive", "playfull"→"playful", "pluggin"→"plugin", missing space after `</strong>` before "Clear callouts", nav item "contact" capitalized to "Contact" for consistency with other nav items, "Reach Out !" → "Reach Out!" (removed space before exclamation mark).
- Also removed a duplicate stray `</ul>` closing tag in `energy-tracker.html`'s before/after list (markup bug, not a typo).
- **Root cause of duplication:** several case study pages share near-identical content blocks (milestone sections) copy-pasted between `marketing-management.html` and `design-system.html` — same typos appeared in both. Worth keeping in mind for future edits to shared boilerplate sections.

### Cleanup: ponytail audit quick wins (verified manually, ponytail plugin unavailable in-session)
- **Context:** Four ponytail audit reports (`PONYTAIL-AUDIT.md`, `-2.md`, `-3.md`, `-CONSOLIDATED.md`) were run on 2026-09-28, all flagging largely the same dead code/assets. Before acting on them, every claim was re-verified against the current repo state via `grep`, since several turned out to be wrong.
- **Audit errors found during verification:**
  - All four audits claimed "HTML uses only `.png`, delete the `.webp` duplicates." This is backwards for the landing page: `index.html` uses `.webp` directly in live `<img src>` (17 refs) as the primary format. However, the case study pages (`marketing-management.html`, `design-system.html`, `energy-tracker.html`) use the **`.png`** half of several pairs directly (plus `og:image`/`twitter:image` meta tags, which need PNG, not WebP) — so neither "always delete png" nor "always delete webp" is correct. Each pair had to be checked individually.
  - The audits claimed most `.mov` files in `public/microsite/` were dead, superseded by `.mp4`. In fact `energy-tracker.html` (a page the audits apparently didn't check) uses `application.mov`, `switching-smart.mov`, `trad meter and end.mov`, `payment error.mov`, `errores.mov`, and `card-hover.mov` directly as live `<video src>`. Only `initiated.mov` and `tomato-ready.mov` were confirmed truly unreferenced.
  - The "46+ PNG/WebP pairs" figure was wrong; the actual count across `public/ds/`, `public/plugin/`, `public/mkm/`, `public/microsite/` was 17 pairs, most of which turned out to have the PNG half still live.
- **Decision:** Per user instruction, confirmed-dead assets are **not deleted**, only untracked from git (`git rm --cached`) and added to `.gitignore`, so they stay on disk for Silvia to review before permanent removal. `@phosphor-icons/web` was left untouched in `package.json` — Silvia wants to verify its usage herself before removal.
- **Deleted outright (genuine dead code, not an asset):** `src/scss/case-studies/old-blocks.scss` (2,675 lines). Confirmed not imported anywhere (only mentioned in a stale comment in `src/scss/CLAUDE.md`, now removed). Its one seemingly-live rule, `body.project-page-body`, is a verbatim duplicate of the same rule already in the actively-imported `blocks.scss`, so nothing was lost.
- **Untracked + gitignored (kept on disk):**
  - `index copy.html`, `public/Silvia Travieso - Design Systems - UI - CV.pdf` (old CV; only `cv-silvia-travieso-2025.pdf` is referenced)
  - 13 PNGs in `public/ds/` (`UIKIT`, `css-export`, `early-designs`, `early-tokens`, `initial-phase-1/2/3`, `learnings-1/2/3`, `mistakes-1/2/3`, `wrong-core`) — zero references
  - 4 PNGs in `public/plugin/` (`TL-Git`, `TL-UI-push`, `TL-publish`, `cover1`) — zero references
  - 5 files in `public/mkm/` (`UI-Interactions-convo.png`, `UI-grid-lead.png`, `UI-interactions-inbox.png`, `card-hover.gif`, `card-hover-2.gif`) — zero references, gif pair replaced by `.mp4`
  - 23 files in `public/microsite/` (various WIP/exploration PNGs plus `initiated.mov`, `tomato-ready.mov`) — zero references
  - Removed two stale `.gitignore` entries pointing at files that don't exist (`*building.about.md`) and consolidated the ad-hoc `card-hover.gif` rule into the new dead-assets block.
- **Verified safe:** ran `npm run build` after all changes — build succeeds, no missing-asset errors.
- **Known issue surfaced, not yet fixed:** `dist/` (the build output directory) is tracked in git despite being gitignored — ~176 MB across 100 files, including large `.mov`/`.gif` copies. This predates today's cleanup and needs a separate, deliberate decision (likely `git rm -r --cached dist/`) before touching it, since it's a bigger change than the scoped quick-wins task.
- **Not actioned (explicitly deferred):** `@phosphor-icons/web` removal from `package.json` — Silvia to verify usage herself first.

## 2026-09-28

### Bug: broken Vercel preview thumbnail
- **Symptom:** Vercel's production preview showed `!DOCTYPE html>` and a stray `-->` instead of the rendered page.
- **Cause:** `index.html` line 1 was `!DOCTYPE html>` (missing `<`), introduced in `f603db6`. The browser rendered it as text and fell back to quirks mode. `marketing-management.html`, `design-system.html`, `design-system-wip.html` and `token-launch.html` had no DOCTYPE at all.
- **Fix:** `<!DOCTYPE html>` as line 1 of all six pages (`264d7dd`).

### Workflow decisions
- Local working folder is `Portfolio-clean` (Silvia's computer); GitHub repo is `SilvT/Portfolio-2026`; `main` deploys to Vercel.
- All text content must follow `professional-voice-baseline.md` (file not yet in the repo).
- Working rules added to `CLAUDE.md`: avoid overengineering, no assumptions, keep this changelog, check it first when debugging.
- `.claude/settings.json` pre-approves all Bash commands for this project.
- This changelog is committed (not gitignored) so every session can read it.
- Ponytail plugin (`DietrichGebert/ponytail`) reviewed: its hooks don't use the network or run other programs. Silvia installs it locally with `/plugin`. `CLAUDE.md` now requires the ponytail skills for all code work, except minimal cleanup and content creation (writing, images, design).
