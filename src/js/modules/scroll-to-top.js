// Mobile-only "scroll to top" button, placed right before the footer
// project nav on case study pages.
export function initScrollToTop() {
  const button = document.querySelector('.case-scroll-top');
  if (!button) return;

  button.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
