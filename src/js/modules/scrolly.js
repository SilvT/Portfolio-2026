/**
 * Scroll-story module
 * Pins one side (the stage, see case-scrolly.scss) and swaps its active panel
 * when the matching step on the scrolling side reaches the middle of the viewport.
 * Each step's left and right are siblings inside .case-scrolly__step.
 */
// Same cut-off as the SCSS: pinning only above the 1024px tablet breakpoint.
const desktop = window.matchMedia('(min-width: 1025px)');

export function initScrolly() {
  document.querySelectorAll('.case-scrolly').forEach((root) => {
    const steps = [...root.querySelectorAll('.case-scrolly__step')];
    // Default: left is the pinned stage, right text triggers the swap.
    // --flip: right is the pinned stage, left scrolls and triggers the swap.
    const flip = root.classList.contains('case-scrolly--flip');
    const stageSel = flip ? '.case-scrolly__right' : '.case-scrolly__left';
    const triggerSel = flip ? '.case-scrolly__left' : '.case-scrolly__right';
    const lefts = steps.map((s) => s.querySelector(stageSel));
    let current = 0;

    const render = () => {
      root.classList.toggle('is-pinned', desktop.matches);
      lefts.forEach((left, i) => {
        const hidden = desktop.matches && i !== current;
        left.classList.toggle('is-active', i === current);
        // Inactive panels stay in the DOM but leave the tab order and the a11y tree
        left.toggleAttribute('inert', hidden);
        hidden ? left.setAttribute('aria-hidden', 'true') : left.removeAttribute('aria-hidden');
      });
    };

    // A thin band between 35% and 50% down the viewport: the chunk crossing it is current.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        current = steps.indexOf(entry.target.closest('.case-scrolly__step'));
        render();
      });
    }, { rootMargin: '-35% 0px -50% 0px' });

    steps.forEach((s) => observer.observe(s.querySelector(triggerSel)));
    desktop.addEventListener('change', render);
    render();
  });
}
