# TBD tasks

## SEO / sharing
- [x] Check `og-image.jpg` crop looks right when shared (LinkedIn Post Inspector, Slack). Currently a Playwright screenshot of the hero (1200x630, 2026-10-15); replace with a designed image later if wanted.
- [x] Domain: `www.silviatravieso.com` is the canonical one (Vercel already redirects the non-www to it). Canonical, OG and Twitter tags in `index.html` and `energy-tracker.html` now use `www`.
- [ ] In Vercel (Project > Settings > Domains), change the `silviatravieso.com` redirect to `www` from 307 (temporary) to 308 (permanent). Cannot be done from the repo.
- [ ] Update `.claude/CLAUDE.md` "Live:" URL to the `www` version.
- [x] `energy-tracker.html` JSON-LD `image` now uses `/microsite/tomato microsite screens.png`, the same image as og:image (the old `/energy/` folder was renamed to `/microsite/`).
- [ ] Check the other HTML pages for the same meta tags as `index.html` (title, description, OG, canonical).
- [ ] Add JSON-LD `Person` structured data to `index.html`.

## Pages
- [ ] 404 page: draft built (`404.html`). Still to decide: flip-board headline (needs `flipBoardAnimation.js` to accept custom titles), copy review, and a `vercel.json` check that Vercel serves it (remove the no-op `rewrites` block).
- [ ] When `marketing-management.html` and `energy-tracker.html` are finished: remove `noindex`, add them back to `sitemap.xml`, and add OG/Twitter tags to `marketing-management.html` (energy-tracker already has them).
- [ ] Check link previews of `design-system.html` and `library-freeze.html` after deploy (LinkedIn Post Inspector).

## Accessibility / polish
- [x] Skip-to-content link, `theme-color` meta and apple-touch-icon added to index, 404 and the four case study pages (not `case-energy-tracker.html`, a local working file).
- [ ] `favicon.ico` 404s in the browser console (browsers request it by default). Optional: add a `/favicon.ico` or ignore.
- [ ] Check a print stylesheet (hiring managers sometimes print or save as PDF).
