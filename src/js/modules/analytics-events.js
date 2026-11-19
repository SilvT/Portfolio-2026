import { track } from './track.js';

/**
 * Attaches Vercel Analytics custom-event listeners
 * for key portfolio interactions.
 */
export function initAnalyticsEvents() {
  // ── Navbar: About ──
  const aboutNav = document.querySelector('.nav-item[data-open-about-modal]');
  if (aboutNav) {
    aboutNav.addEventListener('click', () => {
      track('nav_click', { item: 'about' });
    });
  }

  // ── Navbar: Contact ──
  const contactNav = document.querySelector('.nav-item[href="#contact"]');
  if (contactNav) {
    contactNav.addEventListener('click', () => {
      track('nav_click', { item: 'contact' });
    });
  }

  // ── Read Case Study buttons (links to a case study page; not the prototype or Reach out buttons) ──
  // Project name comes from the section id (e.g. "marketing-management")
  document.querySelectorAll('a.cta-button[href$=".html"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.closest('section[id]');
      track('read_case_study', { project: section ? section.id : 'unknown' });
    });
  });

  // ── Prototype buttons (outline CTA under a project card) ──
  document.querySelectorAll('a.cta-button--outline').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.closest('section[id]');
      track('prototype_click', { project: section ? section.id : 'unknown' });
    });
  });

  // ── Footer social links ──
  document.querySelectorAll('.social-link[data-name]').forEach((link) => {
    link.addEventListener('click', () => {
      track('footer_click', { item: link.dataset.name });
    });
  });
}
