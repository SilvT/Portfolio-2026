import { track } from '@vercel/analytics';

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

  // ── Read Case Study buttons ──
  document.querySelectorAll('.cta-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Derive project name from the section id (e.g. "marketing-management")
      const section = btn.closest('section[id]');
      const project = section ? section.id : 'unknown';
      track('read_case_study', { project });
    });
  });

  // ── Footer social links ──
  document.querySelectorAll('.social-link[data-name]').forEach((link) => {
    link.addEventListener('click', () => {
      track('footer_click', { item: link.dataset.name });
    });
  });
}
