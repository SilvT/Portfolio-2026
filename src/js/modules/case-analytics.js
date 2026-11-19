import { inject } from '@vercel/analytics';
import { track } from './track.js';

/**
 * Vercel Analytics for case study pages (they don't load main.js):
 * page views, `tldr_open` and `case_study_scroll_depth` (25/50/75/100, once each),
 * both with the project name (the page's file name).
 */
export function initCaseAnalytics() {
  inject();

  const project = location.pathname.split('/').pop().replace(/\.html$/, '') || 'unknown';

  const tldr = document.querySelector('.case-tldr-cta');
  tldr?.addEventListener('click', () => {
    // The button toggles the panel and the page's own handler runs separately: wait for it, then count only openings
    setTimeout(() => {
      if (tldr.getAttribute('aria-expanded') === 'true') track('tldr_open', { project });
    });
  });

  const marks = [25, 50, 75, 100];
  const onScroll = () => {
    const root = document.documentElement;
    const depth = ((window.scrollY + window.innerHeight) / root.scrollHeight) * 100;
    while (marks.length && depth >= marks[0]) track('case_study_scroll_depth', { project, depth: marks.shift() });
    if (!marks.length) window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
