// Builds public/Silvia-Travieso_Portfolio-2026.pdf from the case study pages: `npm run pdf`
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { PDFDocument, PDFName } from 'pdf-lib';
import { writeFileSync } from 'fs';

// Same order as the landing page and the issue numbers 01 to 04
const pages = ['library-freeze', 'marketing-management', 'design-system', 'energy-tracker'];
const hiddenCaseStudies = ['marketing-management', 'energy-tracker']; // temporarily left out of the PDF (their landing page display pages stay)
const out = process.argv[2] || 'public/Silvia-Travieso_Portfolio-2026.pdf';

// PDF-only replacement for a cover's .project-details copy, keyed by section id
const coverInfo = pages; // covers that get the case study's info sidebar (copied from its page) under the long content
const projectTypes = { 'marketing-management': 'B2B · Desktop App', 'design-system': 'Library / Repo' }; // PDF-only Project Type wording
const coverDescriptions = { // PDF-only replacement for a cover's .project-description heading
  'design-system': 'No file naming conventions, no libraries, no precedents and no one at the company who yet believed in design systems.',
};
const coverDetails = {
  'design-system': 'Built a production-ready design system from scratch as a solo mid-level designer in an engineer-first startup. Worked around an unusual stack, a non-web environment, a fully async front-end relationship and CEO resistance. The result came with a 4-level token architecture, an experimental, prototype-like use of Variable modes, and a personalised Figma-to-code pipeline via Token Studio + GitHub Actions, auto-triggered in cascade. This system became the go-to example, triggering a promotion and an educational and onboarding process for the other 7 designers in the department.',
  'energy-tracker': "A well-known pain point for users in the UK's energy market, and an unclear journey. After hunting down backend engineers to map a process no one fully understood, I built a customer-facing tracker that replaced reactive 'we'll email you' communication with proactive self-service, saving Customer Service from a lot of anxious phone calls. The UI is now connected to the backend, so it always shows the most up-to-date information, ready to consume visually. Clear steps, hints of the whole journey and a progress bar, while keeping the quirky and fun brand elements of the energy company.",
  'marketing-management': 'Desktop App, built from scratch to unify fragmented marketing operations across 4 departments, replacing manual Excel workflows with real-time data visibility. Custom-made for an electrical company client and their particular flows. A lean team of one back-end engineer, one front-end engineer and me as the solo designer achieved an MVP in 1 year. This led me to quickly grow into product co-owner and product designer, and later Lead of Design Systems with 7 designers under my supervision.',
};

// Print-only tweaks, injected here so the site CSS stays untouched
const css = `
  .case-title-block { break-inside: avoid; }
  .cs-block-gallery { display: none !important; } /* last block of marketing-management and energy-tracker */
  *,*::before, *::after { animation: none !important; transition: none !important; }
  .skip-link, .case-tldr-cta, .case-masthead, .case-project-nav, .side-nav, .case-tldr-mascot, .case-tldr-panel,
  .scroll-to-top, .case-scroll-top, .swiper-button-prev, .swiper-button-next, .swiper-pagination { display: none !important; }
  .swiper-wrapper { display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 1rem; transform: none !important; height: auto !important; }
  .new-slide { box-shadow: none !important; } /* the soft blue shadows overlapped in the grid gaps and drew a cross */
  .swiper-slide { width: auto !important; height: auto !important; margin: 0 !important; break-inside: avoid; }
  .case-carousel-panel, .case-carousel-panel * { color: #202020 !important; }
  video, .case-carousel-panel:has(video) { display: none !important; }
  .case-title-block { grid-template-columns: 1fr 17vw !important; }
  .case-title-main h1 { width: 70% !important; }
  .case-title-image { position: absolute !important; top: 0; right: 0; width: auto !important; max-height: 23vw !important; margin: 0 !important; }
  figure, img, h2, h3, .milestone { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  .case-article { padding-bottom: 0 !important; }
`;

const server = await createServer({ server: { port: 4173, open: false } });
await server.listen();
const base = server.resolvedUrls.local[0]; // the port can change if 4173 is taken
const browser = await chromium.launch();
const merged = await PDFDocument.create();
// A4 proportions, wider than the 1024px tablet breakpoint so the desktop two-column layouts apply
const W = 1100, H = 1556;
const size = { width: `${W}px`, height: `${H}px`, printBackground: true };

// Cover: first screen of the landing page, nav and skip link hidden because they are dead in a PDF
const cover = await browser.newPage({ viewport: { width: W, height: H } });
await cover.emulateMedia({ reducedMotion: 'reduce' });
await cover.goto(`${base}index.html`, { waitUntil: 'networkidle' });
await cover.addStyleTag({ content: '.top-nav, .skip-link { display: none !important; } .section-about .ellipse-decor svg { width: 100%; height: 100%; }' });
await cover.evaluate(() => document.querySelector('.section-about .ellipse-decor svg').setAttribute('preserveAspectRatio', 'xMidYMid slice')); // the circles are a 4:3 SVG; stretch it over the taller page without distorting
await cover.waitForTimeout(3000); // let the entry animations settle
const coverDoc = await PDFDocument.load(await cover.pdf({ ...size, pageRanges: '1' }));
(await merged.copyPages(coverDoc, [0])).forEach(p => merged.addPage(p));

// Page 2: the About panel stacked on top of the contact footer
await cover.reload({ waitUntil: 'networkidle' });
await cover.addStyleTag({ content: `
  body > *:not(dialog):not(footer) { display: none !important; }
  html, body, footer, .section-contact, .about-modal__panel { background: #edf1f3 !important; } /* $color-blue-100 */
  body { margin: 0; height: 100vh; display: flex !important; flex-direction: column; justify-content: center; } /* centres the content vertically on the page */
  .about-modal { position: static !important; display: block !important; height: auto !important; width: 100% !important; }
  .about-modal__backdrop, .about-modal__close, .ellipse-decor, .meta-group, .web, #cv-download-btn, #pdf-download-btn, footer [data-name=email] { display: none !important; }
  .about-modal__entry:has(.iconoir-crown) { display: none !important; } /* "What I value" block, PDF only */
  .about-modal__panel { transform: none !important; opacity: 1 !important; margin: 0 auto !important; width: 70% !important; max-width: 70% !important; max-height: none !important; border-radius: 0 !important; box-shadow: none !important; }
  footer, .section-contact { display: block; height: auto !important; min-height: 0 !important; }
  .contact__inner { height: auto !important; width: 100% !important; justify-content: center !important; }
  .social-link { flex-direction: column; align-items: flex-start; width: auto !important; white-space: normal; }
  .contact__content, .socials { flex-direction: row !important; flex-wrap: nowrap; gap: 24px !important; align-items: flex-start !important; height: auto !important; width: auto !important; justify-content: center !important; }
  .contact__content { padding: 4rem 0 !important; margin: 0 auto !important; }
` });
await cover.evaluate(() => {
  const dialog = document.querySelector('.about-modal');
  document.body.prepend(dialog); // it lives inside the about section, which is hidden above
  dialog.setAttribute('open', '');
  // PDF-only copy: show the full URLs, since links are not always clickable on paper
  document.querySelector('[data-name=linkedin] p').textContent = 'linkedin.com/in/silvia-travieso-gonzalez/';
  document.querySelector('[data-name=git-repo] p').textContent = 'https://github.com/SilvT';
  // PDF-only: the "Systems, systems..." entry keeps its header but holds the work history instead of its copy, styled as the case studies' phase rail, and moves under "My kind of vibe"
  const roles = [
    ['Senior Design System Strategist | Nateevo (VASS)', '2026 – present', 'Client: CaixaBank (Fintech). Bridging design-dev on a multi-brand design system and building design ops processes and tools.'],
    ['Product Designer | Tomato Energy', '2025', 'B2C interfaces for onboarding energy customer via a microsite with real-time status, magic-link access and a self-diagnosis tool, replacing reactive email updates and reducing anxious support calls.'],
    ['Product Designer (promoted to Design Systems Lead) | Senapt', '2024 – 2025', 'B2B SaaS product for marketing teams on energy companies, leading end-to-end design across multiple products from discovery through MVP.'],
  ];
  const rail = document.createElement('div');
  rail.className = 'case-phase-rail';
  rail.style.cssText = 'margin-top: 0.75rem; border-top: none;';
  // index hidden; title and meta share the first line, the outcome sits full width under them
  rail.innerHTML = roles.map(([title, meta, outcome]) => `<div class="case-phase-row" style="grid-template-columns: 1fr auto; row-gap: 6px;"><p class="case-phase-row__index" style="display: none;"></p><p class="case-phase-row__title">${title}</p><p class="case-phase-row__meta">${meta}</p><p class="case-phase-row__outcome" style="grid-column: 1 / -1; margin: 0;">${outcome}</p></div>`).join('');
  const systems = document.querySelector('.about-modal__entry:has(.iconoir-ruler-combine)');
  const body = systems.querySelector('.about-modal__body');
  body.querySelectorAll(':scope > :not(h2)').forEach(el => el.remove());
  body.querySelector('h2').lastChild.textContent = 'Experience'; // keeps the icon, swaps the label
  rail.lastElementChild.style.borderBottom = 'none';
  systems.style.borderBottom = 'none'; // the entry's own divider would otherwise remain as the last line
  body.append(rail);
  // outcome: lighter ink ($color-case-ink-soft, #6b6b6b, still AA on the blue page) at 0.9x; meta at 0.7x
  const scale = (sel, k) => rail.querySelectorAll(sel).forEach(el => { el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * k}px`; });
  rail.querySelectorAll('.case-phase-row__outcome').forEach(el => { el.style.color = '#6b6b6b'; });
  scale('.case-phase-row__outcome', 0.9);
  scale('.case-phase-row__meta', 0.7);
  document.querySelector('.about-modal__entry:has(.iconoir-bright-star)').after(systems);
});
await cover.waitForTimeout(3000);
const aboutDoc = await PDFDocument.load(await cover.pdf({ ...size, pageRanges: '1' }));
(await merged.copyPages(aboutDoc, [0])).forEach(p => merged.addPage(p));
await cover.close();

// "Read Case Study" buttons on the covers become links to the case study's first page in this PDF
const coverLinks = []; // { name, cover: page index, box: button rect in px }
const caseStart = {};  // name -> page index where the case study starts

// Landing page full-screen project sections (the "covers"), one page each
async function addCovers(names) {
  const showcase = await browser.newPage({ viewport: { width: W, height: H } });
  await showcase.emulateMedia({ reducedMotion: 'reduce' });
  await showcase.goto(`${base}index.html`, { waitUntil: 'networkidle' });
  await showcase.addStyleTag({ content: `
    .top-nav, .skip-link, #tools, footer, .section-about, .scroll-hint { display: none !important; }
    .carousel-dots, video { display: none !important; }
    #marketing-management .cta-button, #energy-tracker .cta-button { display: none !important; } /* their case studies are left out of the PDF */
    .text-content { flex-direction: column !important; gap: 3rem !important; } /* long content stacks under the title group, with room between */
    .case-info--row { display: flex; gap: 1.5rem; flex-wrap: wrap; width: 0; min-width: 100%; } .case-info--row dl { flex: 1 1 0; min-width: 0; margin: 0; padding: 0; border: 0; } .case-info--row .case-info-label { flex-basis: 100%; margin: 0 0 -0.5rem; } /* PDF-only horizontal take on the case study info sidebar */
    .project-image-wrapper.slideshow img { height: auto; max-height: none !important; } /* height is set per page in the fit loop below */
    .project-image-wrapper.slideshow { width: 100% !important; flex-wrap: wrap !important; transform: none !important; justify-content: center; gap: 0.75rem !important; } /* marquee becomes wrapped rows, gaps halved from 1.5rem */
    .project-image-wrapper.slideshow img[aria-hidden=true] { display: none !important; } /* loop duplicates */
    .slideshow-container { width: 100% !important; height: auto !important; max-height: none !important; overflow: visible !important; flex: 1; display: flex; align-items: center; }
    .project-image-wrapper.slideshow { height: auto !important; } /* image area takes the free height */
    .section-project, .section-project .contentbox, .section-project .project-screen { height: ${H}px !important; box-sizing: border-box; } /* content spreads over the full page */
    .section-project .project-screen { display: flex; flex-direction: column; }
    .section-project .project-content { flex: 1; min-height: 0; justify-content: space-between !important; padding-bottom: 3rem; }
    .section-project .project-content { position: relative; }
    .section-project .data-tags { position: absolute !important; left: 0; right: 0; bottom: 1.5rem; z-index: 5; display: flex; justify-content: center; } /* tags float over the images, inside the page */
  ` });
  await showcase.waitForTimeout(3000);
  for (const name of names) {
    // Before the fit loop (it reads aspect ratios): swap the repeated slide and trim the slide images, PDF only
    await showcase.evaluate(async ({ id, text, heading, info, type }) => {
      if (heading) document.querySelector(`#${id} .project-description`).textContent = heading;
      if (text) document.querySelector(`#${id} .project-details`).textContent = text;
      if (info) {
        const html = await (await fetch(`/${id}.html`)).text();
        const aside = new DOMParser().parseFromString(html, 'text/html').querySelector('.case-info');
        aside.querySelector('.case-issue-number')?.remove(); // the PDF numbers its issues differently
        aside.classList.add('case-info--row');
        // PDF shows Project Type, Role, Team and Stack only; Company and Timeline are dropped
        aside.querySelectorAll('dt').forEach(dt => {
          if (['Company', 'Timeline'].includes(dt.textContent.trim())) { dt.nextElementSibling.remove(); dt.remove(); }
          else if (type && dt.textContent.trim() === 'Project Type') dt.nextElementSibling.textContent = type;
        });
        aside.querySelectorAll('dl:not(:has(dt))').forEach(dl => dl.remove());
        document.querySelector(`#${id} .text-content`).append(aside);
      }
      document.querySelectorAll('.section-project').forEach(s => { s.style.display = s.id === id ? '' : 'none'; });
      // The last microsite slide repeats the one before it, so it shows mock-1.png instead
      const dup = id === 'energy-tracker' && document.querySelector('#energy-tracker img[data-slide="6"]');
      if (dup) dup.src = '/microsite/mock-1.png';
      // Two marketing management slides are left out of the PDF so the rest print larger
      if (id === 'marketing-management') document.querySelectorAll('#marketing-management img[src*="Look-and-feel-first-screen"], #marketing-management img[src*="UI-interactions-inbox"]').forEach(i => i.remove());
      // Two tall design system slides are left out of the PDF so the wide ones print larger
      if (id === 'design-system') {
        document.querySelectorAll('#design-system img[src*="ds-color-display"], #design-system img[src*="UIKIT"]').forEach(i => i.remove());
        // tokens-export replaces the handoff image and goes last
        document.querySelectorAll('#design-system img[src*="handoff-pieces"]').forEach(i => { i.srcset = ''; i.src = '/ds/tokens-export.png'; i.parentElement.append(i); });
        // ds-hero replaces last-version-color-specs, in the same position
        document.querySelectorAll('#design-system img[src*="last-version-color"]').forEach(i => { i.srcset = ''; i.src = '/ds/ds-hero.webp'; });
        // architecture is left out; annotations-1 is added at the end (a copy of a slide, new src)
        document.querySelectorAll('#design-system img[src*="architecture"]').forEach(i => i.remove());
        const last = [...document.querySelectorAll('#design-system .slideshow img:not([aria-hidden=true])')].pop();
        const extra = last.cloneNode();
        extra.srcset = '';
        extra.src = '/ds/annotations-1.png';
        extra.alt = 'Component states and edge cases annotated for handoff';
        last.after(extra);
      }
      if (id === 'library-freeze') return; // its images are already tight crops
      // Trim the white/transparent margins baked into the images so the content fills the slide
      const imgs = [...document.querySelectorAll(`#${id} .project-image-wrapper.slideshow img[data-slide]`)];
      for (const img of imgs) {
        img.loading = 'eager';
        await new Promise(r => (img.complete && img.naturalWidth ? r() : img.addEventListener('load', r, { once: true })));
        if (img.src.endsWith('.svg')) continue;
        const k = Math.min(1, 2000 / img.naturalWidth);
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k);
        c.height = Math.round(img.naturalHeight * k);
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const px = ctx.getImageData(0, 0, c.width, c.height).data;
        let x0 = c.width, x1 = -1, y0 = c.height, y1 = -1, transparent = false;
        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4;
            if (px[i + 3] < 255) transparent = true;
            if (px[i + 3] < 16 || (px[i] > 245 && px[i + 1] > 245 && px[i + 2] > 245)) continue;
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
        if (x1 < 0) continue;
        const pad = 12;
        x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
        x1 = Math.min(c.width - 1, x1 + pad); y1 = Math.min(c.height - 1, y1 + pad);
        const out = document.createElement('canvas');
        out.width = x1 - x0 + 1;
        out.height = y1 - y0 + 1;
        out.getContext('2d').drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
        img.srcset = '';
        img.src = transparent ? out.toDataURL('image/png') : out.toDataURL('image/jpeg', 0.85);
        await img.decode().catch(() => {});
      }
    }, { id: name, text: coverDetails[name], heading: coverDescriptions[name], info: coverInfo.includes(name), type: projectTypes[name] });
    await showcase.evaluate(id => {
      document.querySelectorAll('.section-project').forEach(s => { s.style.display = s.id === id ? '' : 'none'; });
      // Theme background on the whole page, not just the section
      const bg = getComputedStyle(document.getElementById(id)).backgroundColor;
      document.documentElement.style.setProperty('background-color', bg, 'important');
      document.body.style.setProperty('background-color', bg, 'important');
      // Largest marquee image height at which the (max two) rows fit in the page without being cut
      const content = document.querySelector(`#${id} .project-content`);
      const imgs = [...document.querySelectorAll(`#${id} .slideshow img:not([aria-hidden=true])`)];
      // Two rows of similar width (same order), so the images can grow instead of leaving the second row short
      const ar = imgs.map(i => i.naturalWidth / i.naturalHeight);
      let split = 1, best = Infinity;
      for (let k = 1; k < imgs.length; k++) {
        const worst = Math.max(ar.slice(0, k).reduce((x, y) => x + y, 0), ar.slice(k).reduce((x, y) => x + y, 0));
        if (worst < best) { best = worst; split = k; }
      }
      const wrapper = imgs[0].parentElement;
      wrapper.querySelectorAll('.row-break').forEach(el => el.remove());
      if (imgs.length > 1) {
        const br = document.createElement('span');
        br.className = 'row-break';
        br.style.cssText = 'flex-basis: 100%; height: 0;';
        imgs[split].before(br);
      }
      let h = 700; // image height in px, start big and shrink to the largest that fits
      const setH = () => imgs.forEach(i => i.style.setProperty('height', `${h}px`, 'important'));
      const tags = document.querySelector(`#${id} .data-tags`); // absolutely positioned at the page bottom, so the images must end above it
      const overflows = () => content.scrollHeight > content.clientHeight + 1 || (tags && Math.max(...imgs.map(i => i.getBoundingClientRect().bottom)) > tags.getBoundingClientRect().top - 16) || content.getBoundingClientRect().bottom > innerHeight + 1 || new Set(imgs.map(i => i.offsetTop)).size > 2;
      setH();
      while (overflows() && h > 100) { h -= 10; setH(); }
    }, name);
    await showcase.waitForTimeout(500);
    // Drop the web href (it would become a dead URL on paper); the internal link is added at the end
    const box = await showcase.evaluate(id => {
      const a = document.querySelector(`#${id} .cta-button`);
      if (!a || !a.offsetParent) return null;
      a.removeAttribute('href');
      const r = a.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    }, name);
    if (box) coverLinks.push({ name, cover: merged.getPageCount(), box });
    const doc = await PDFDocument.load(await showcase.pdf({ ...size, pageRanges: '1' }));
    (await merged.copyPages(doc, [0])).forEach(p => merged.addPage(p));
  }
  await showcase.close();
}

// Right under the About page: all four covers, in landing page order
await addCovers(pages);

// Right under the covers: the tools grid from the landing page, descriptions always visible (no hover on paper)
const tools = await browser.newPage({ viewport: { width: W, height: H } });
await tools.emulateMedia({ reducedMotion: 'reduce' });
await tools.goto(`${base}index.html`, { waitUntil: 'networkidle' });
await tools.addStyleTag({ content: `
  body > *:not(#tools) { display: none !important; }
  #tools { justify-content: center; }
  .services-grid { flex: none !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; grid-template-rows: none !important; }
  .service-card { min-height: 22rem; }
  .service-card--preview { display: none !important; }
  .service-card-description { max-height: none !important; opacity: 1 !important; margin-top: 0.5rem; }
  .service-card-preview-img { position: static !important; display: block; width: 100% !important; height: auto !important; opacity: 1 !important; border-radius: 8px; }
` });
// Cover images go in a second grid row, each under its own card (same order as the cards)
await tools.evaluate(() => {
  // PDF-only copy: new headline plus a detail paragraph styled like the covers' .project-details (styles read from a cover, not hardcoded)
  document.querySelector('.services-headline').textContent = 'Custom tools, self-developed.';
  const ref = getComputedStyle(document.querySelector('.project-details'));
  const detail = document.createElement('p');
  detail.textContent = 'Small tools built to solve specific design-system frictions that have expanded beyond their original scope and are now widely available for consumption on Figma Community.';
  Object.assign(detail.style, { color: ref.color, fontSize: ref.fontSize, lineHeight: ref.lineHeight, fontVariationSettings: ref.fontVariationSettings, margin: '1rem 0 0' });
  document.querySelector('.services-headline').after(detail);
  const grid = document.querySelector('.services-grid');
  const imgs = [...grid.querySelectorAll('.service-card-preview-img')].sort((a, b) => a.dataset.previewRow - b.dataset.previewRow);
  imgs.forEach(i => { i.loading = 'eager'; grid.append(i); });
});
await tools.waitForTimeout(1000);
const toolsDoc = await PDFDocument.load(await tools.pdf({ ...size, pageRanges: '1' }));
(await merged.copyPages(toolsDoc, [0])).forEach(p => merged.addPage(p));
await tools.close();

for (const name of pages) {
  if (hiddenCaseStudies.includes(name)) continue;
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}${name}.html`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: css });
  if (name === 'design-system') await page.evaluate(() => { document.querySelector('.case-issue-number').textContent = '02'; }); // PDF only: Marketing Management (02) is left out, so Design System is the second issue here
  if (name === 'library-freeze') await page.addStyleTag({ content: '.case-image-block { display: none !important; } .case-index-grid--3-col { margin-top: 8px !important; } .case-index-grid__cell__image { height: 180px !important; } .case-index-grid--3-col { row-gap: 16px !important; } .case-footer-grid { margin-top: 24px !important; } .case-section-heading:has(+ .case-index-grid--3-col) { break-before: page; }' }); // PDF only: skip the full-bleed image; tighter gap under "The Plugin: Functionalities" so the grid stays on one page
  if (name === 'marketing-management') {
    // Milestone accordions sit side by side, two per row, wrapping onto new rows
    await page.addStyleTag({ content: '.milestones { max-width: none !important; } .milestones > .cs-block { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 1.25rem; align-items: flex-start; margin: 0 !important; padding: 0 !important; } .milestones .milestone { flex: 1 1 calc(50% - 1.25rem) !important; min-width: 0; margin-bottom: 0 !important; }' });
  }
  if (name === 'design-system') {
    // Carousel becomes a plain vertical stack: no panel background, header or divider
    await page.addStyleTag({ content: '.case-carousel-panel { background: none !important; padding: 0 !important; } .case-carousel-panel__header, .case-carousel-panel__divider { display: none !important; } .swiper-wrapper { display: flex !important; flex-direction: column; gap: 1rem; } .case-index-grid { grid-template-columns: repeat(2, 1fr) !important; }' });
  }
  if (name === 'design-system') {
    // "Quirks and Outcomes" and Learnings continue in the right column under the stacked images instead of starting a new page
    await page.evaluate(() => {
      const heading = [...document.querySelectorAll('.case-section-heading')].find(h => h.textContent.includes('Quirks'));
      const row = heading.nextElementSibling;
      const target = document.querySelector('.case-carousel-panel').closest('.case-pairing-row').querySelector('.case-pairing-row__right');
      target.append(heading, ...row.querySelector('.case-pairing-row__right').children);
      row.remove();
      // Learnings stacks under it too
      const footer = document.querySelector('.case-footer-grid');
      target.append(...footer.querySelector('.case-pairing-row__right').children);
      footer.remove();
    });
  }
  await page.evaluate(async (stack) => {
    document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager'));
    document.querySelectorAll('.milestone').forEach(m => { m.classList.add('is-open'); m.setAttribute('open', ''); });
    document.querySelectorAll('.cs-line-breaker.accordion').forEach(a => {
      a.classList.add('is-open');
      a.querySelector('.accordion-content')?.style.setProperty('display', 'block', 'important');
    });
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    // Carousel panels keep their theme colour at 50% opacity; text goes dark ($color-case-ink) so it stays readable on the lighter tint
    document.querySelectorAll('.case-carousel-panel').forEach(el => {
      const [r, g, b] = getComputedStyle(el).backgroundColor.match(/\d+/g);
      if (!stack) el.style.setProperty('background-color', `rgba(${r}, ${g}, ${b}, 0.5)`, 'important');
    });
    // Images that fill their container print at 70% width (carousel slides already sit in a 2-column grid)
    for (const img of document.images) {
      if (img.closest('.swiper-slide, .case-title-block')) continue;
      const box = img.parentElement.getBoundingClientRect().width;
      if (img.getBoundingClientRect().width >= box * 0.9) img.style.setProperty('width', '70%', 'important');
    }
    // Shrink: opaque images become JPEGs at 2x their printed width; transparent ones stay PNG, just downscaled
    for (const img of document.images) {
      const w = Math.min(img.naturalWidth, Math.round(img.clientWidth * 2));
      if (!w || img.src.endsWith('.svg') || img.src.startsWith('data:')) continue;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = Math.round((img.naturalHeight * w) / img.naturalWidth);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const px = ctx.getImageData(0, 0, c.width, c.height).data;
      let opaque = true;
      for (let i = 3; i < px.length; i += 4) if (px[i] < 255) { opaque = false; break; }
      img.srcset = '';
      img.src = opaque ? c.toDataURL('image/jpeg', 0.82) : c.toDataURL('image/png');
      await img.decode().catch(() => {});
    }
  }, name === 'design-system');
  const pdf = await page.pdf(size);
  caseStart[name] = merged.getPageCount();
  console.log(`${name} starts on page ${merged.getPageCount() + 1}`);
  const doc = await PDFDocument.load(pdf);
  (await merged.copyPages(doc, doc.getPageIndices())).forEach(p => merged.addPage(p));
  await page.close();
}


// Last page: thank-you, styled like the About page, with the contact links and the animated-icon drawing
const thanks = await browser.newPage({ viewport: { width: W, height: H } });
await thanks.emulateMedia({ reducedMotion: 'reduce' });
await thanks.goto(`${base}index.html`, { waitUntil: 'networkidle' });
await thanks.addStyleTag({ content: `
  body > *:not(footer) { display: none !important; }
  html, body, footer, .section-contact { background: #edf1f3 !important; } /* $color-blue-100 */
  body { margin: 0; height: 100vh; box-sizing: border-box; padding-bottom: 7vh; display: flex !important; flex-direction: column; justify-content: flex-end; } /* everything sits at the bottom, 7vh up from the edge */
  .ellipse-decor, #cv-download-btn, .web-tooltip, .web a span p:first-child { display: none !important; } /* drops "Designed and Built by", keeps the name and year */
  footer, .section-contact { display: block; height: auto !important; min-height: 0 !important; }
  .contact__inner { height: auto !important; width: 100% !important; justify-content: center !important; }
  .social-link { flex-direction: column; align-items: flex-start; width: auto !important; white-space: normal; }
  .contact__content { flex-direction: column !important; gap: 4rem !important; align-items: center !important; height: auto !important; width: auto !important; margin: 0 auto !important; }
  .socials { flex-direction: row !important; flex-wrap: nowrap; gap: 24px !important; align-items: flex-start !important; height: auto !important; width: auto !important; justify-content: center !important; }
  .web { display: flex !important; flex-direction: column; align-items: center; gap: 1.5rem; position: static !important; }
  .icon-animation { width: 228px; height: auto; display: block; margin: 0 auto; }
  .thanks { font-family: inherit; font-size: 2.8rem; text-align: center; margin: 0 0 2rem; }
` });
await thanks.evaluate(() => {
  // PDF-only: the usual footer links give way to the web portfolio link and the email link
  document.querySelector('.socials').innerHTML = '<a href="https://www.silviatravieso.com" class="social-link" data-name="web-portfolio"><span class="icon" style="text-transform: none;">www.</span><div class="social-link__text"><p>www.silviatravieso.com</p></div></a><a href="mailto:silvia.travieso.g@gmail.com" class="social-link" data-name="email"><span class="icon">@·</span><div class="social-link__text"><p>silvia.travieso.g@gmail.com</p></div></a>';
  const h = document.createElement('h2');
  h.className = 'thanks';
  h.textContent = 'Thanks for your time';
  document.querySelector('.contact__content').prepend(h);
});
await thanks.waitForTimeout(1000);
const thanksDoc = await PDFDocument.load(await thanks.pdf({ ...size, pageRanges: '1' }));
(await merged.copyPages(thanksDoc, [0])).forEach(p => merged.addPage(p));
await thanks.close();

// Internal links: px → PDF points (0.75), y flipped from the page top
for (const { name, cover, box } of coverLinks) {
  if (caseStart[name] === undefined) continue;
  const page = merged.getPage(cover);
  const h = page.getHeight();
  const link = merged.context.register(merged.context.obj({
    Type: 'Annot', Subtype: 'Link', Border: [0, 0, 0],
    Rect: [box.x * 0.75, h - (box.y + box.h) * 0.75, (box.x + box.w) * 0.75, h - box.y * 0.75],
    Dest: [merged.getPage(caseStart[name]).ref, PDFName.of('Fit')],
  }));
  page.node.set(PDFName.of('Annots'), merged.context.obj([...(page.node.Annots()?.asArray() ?? []), link]));
}

writeFileSync(out, await merged.save());
await browser.close();
await server.close();
console.log(`Wrote ${out} (${merged.getPageCount()} pages)`);
