# Changelog

Started from zero on 2026-09-28. Replaces `CLAUDE-LOG.md`, which is no longer updated.
Newest entries first. Each entry notes structural decisions, bugs (symptom, cause, fix), architecture and design choices, and other major changes.

---

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
