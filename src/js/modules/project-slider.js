// Autoplay slider with prev / next / pause controls (project cards, index.html).
// Scroll-snap does the sliding; JS only picks the slide and runs the timer.

const INTERVAL = 5000;
const FIRST_DELAY = 1500; // first slide change after the slider scrolls into view

// Autoplay waits while the about modal is open (the cards behind it shouldn't move)
const aboutOpen = () => document.querySelector('.about-modal')?.open === true;

export function initProjectSliders() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = [...track.children];
    const toggle = slider.querySelector('[data-slider-toggle]');
    const count = slider.querySelector('[data-slider-count]');
    let index = 0;
    let timer = 0;
    let paused = reduceMotion; // reduced motion: no autoplay, controls still work
    let inView = false;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    // Keep index + counter in sync when the user swipes
    const sync = () => {
      index = Math.round(track.scrollLeft / track.clientWidth);
      count.textContent = `${index + 1} / ${slides.length}`;
    };
    track.addEventListener('scroll', sync, { passive: true });

    const stop = () => clearTimeout(timer);
    const start = (delay = INTERVAL) => {
      stop();
      if (paused || !inView) return;
      timer = setTimeout(() => {
        if (!aboutOpen()) show(index + 1);
        start();
      }, delay);
    };

    const setPaused = (value) => {
      paused = value;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Start autoplay' : 'Pause autoplay');
      start();
    };

    slider.querySelector('[data-slider-prev]').addEventListener('click', () => { show(index - 1); start(); });
    slider.querySelector('[data-slider-next]').addEventListener('click', () => { show(index + 1); start(); });
    toggle.addEventListener('click', () => setPaused(!paused));

    // Pause while hovered or focused so it never moves under the user
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', () => start());
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', () => start());

    // Only run while on screen
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start(FIRST_DELAY);
    }).observe(slider);

    setPaused(paused);
  });
}
