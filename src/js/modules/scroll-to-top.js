// "Scroll to top" buttons on case study pages:
//  .case-scroll-top  mobile-only, placed right before the footer project nav
//  .case-top-cta     fixed bottom right, shown once the page is scrolled; created here on every case study page
export function initScrollToTop() {
  // Every case study page (this module only loads on those) gets the floating button automatically (no per-page markup)
  if (!document.querySelector('.case-top-cta')) {
    const cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'case-top-cta';
    cta.setAttribute('aria-label', 'Back to top');
    cta.textContent = '↑ Top';
    document.body.append(cta);
  }

  const buttons = document.querySelectorAll('.case-scroll-top, .case-top-cta');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const cta = document.querySelector('.case-top-cta');
  if (cta) {
    const toggle = () => cta.classList.toggle('is-visible', window.scrollY > window.innerHeight / 2);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }
}
