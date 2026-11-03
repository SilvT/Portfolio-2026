// ============================================
// MARQUEE SCROLL — GSAP-driven infinite slideshow
// Replaces CSS @keyframes marqueeScroll with a
// controllable GSAP tween per slideshow.
// ============================================

import gsap from 'gsap';

const DESKTOP_DURATION = 45;
const MOBILE_DURATION = 80;
const MOBILE_BREAKPOINT = 768;

// Registry: slideshow DOM element → GSAP tween
const marqueeTweens = new Map();

// Pixels-per-second scroll rate (consistent across all slideshows)
const PX_PER_SEC = 50;

/**
 * Ensures the slideshow strip has enough duplicated content to fill
 * the viewport at all points during the scroll cycle.
 * Returns the pixel width of one "original set" (the loop point).
 */
function ensureFillWidth(slideshow) {
  const originals = slideshow.querySelectorAll('.project-image[data-slide]:not([aria-hidden])');
  if (!originals.length) return 0;

  const gap = parseFloat(getComputedStyle(slideshow).gap) || 0;
  const viewportW = slideshow.parentElement?.clientWidth || window.innerWidth;

  // Measure one original set width
  let oneSetWidth = 0;
  originals.forEach((el) => { oneSetWidth += el.offsetWidth + gap; });
  if (oneSetWidth <= 0) return 0;

  // We need enough total content so that when we scroll by oneSetWidth,
  // the remaining content still covers the viewport.
  // → total needed = oneSetWidth + viewportW
  const totalNeeded = oneSetWidth + viewportW;
  const currentTotal = slideshow.scrollWidth;

  if (currentTotal < totalNeeded) {
    // Clone the original set as many extra times as needed
    const extraSetsNeeded = Math.ceil((totalNeeded - currentTotal) / oneSetWidth);
    for (let i = 0; i < extraSetsNeeded; i++) {
      originals.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('data-slide');
        clone.removeAttribute('loading');
        clone.removeAttribute('fetchpriority');
        slideshow.appendChild(clone);
      });
    }
  }

  // offsetWidth rounds to whole pixels, so the sum above can be off by up to
  // a pixel or two per set: measure the real distance to the first clone so
  // the loop lands exactly on the seam
  const firstClone = slideshow.querySelector('[aria-hidden="true"]');
  if (firstClone) {
    const exact = firstClone.getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
    if (exact > 0) return exact;
  }

  return oneSetWidth;
}

/**
 * Creates a GSAP marquee tween for a slideshow element.
 * Kills any existing tween for this element before creating a new one.
 * Returns null if prefers-reduced-motion is enabled.
 */
export function createMarqueeTween(slideshow, { paused = true } = {}) {
  if (!slideshow) return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  // Kill existing tween if re-creating
  const existing = marqueeTweens.get(slideshow);
  if (existing) {
    existing.kill();
    gsap.set(slideshow, { x: 0, xPercent: 0 });
  }

  // Ensure enough cloned content to fill viewport during scroll
  const oneSetWidth = ensureFillWidth(slideshow);

  // Use pixel offset if measured, otherwise fallback to xPercent
  const tweenVars = oneSetWidth > 0
    ? { x: -oneSetWidth }
    : { xPercent: -50 };

  // Consistent scroll speed: duration = distance / speed
  const scrollDuration = oneSetWidth > 0
    ? oneSetWidth / PX_PER_SEC
    : (window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_DURATION : DESKTOP_DURATION);

  const tween = gsap.to(slideshow, {
    ...tweenVars,
    duration: scrollDuration,
    ease: 'none',
    repeat: -1,
    paused,
  });

  marqueeTweens.set(slideshow, tween);

  // Lazy images have no width until they load, so the loop distance measured
  // above is too short (just the gaps) and the strip snaps back every couple
  // of seconds. Load them now and rebuild once their real widths are known.
  const unloaded = [...slideshow.querySelectorAll('img')].filter((img) => !img.complete);
  if (unloaded.length) {
    unloaded.forEach((img) => { img.loading = 'eager'; });
    Promise.all(unloaded.map((img) => new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    }))).then(() => {
      if (marqueeTweens.get(slideshow) !== tween) return;
      const next = createMarqueeTween(slideshow, { paused: tween.paused() });
      if (next) next.progress(tween.progress());
    });
  }

  // Desktop: pause on hover, resume on leave
  if (!slideshow._marqueeHoverBound && window.innerWidth > MOBILE_BREAKPOINT) {
    slideshow._marqueeHoverBound = true;
    slideshow.addEventListener('mouseenter', () => {
      const t = marqueeTweens.get(slideshow);
      if (t && t.isActive()) t.pause();
    });
    slideshow.addEventListener('mouseleave', () => {
      const t = marqueeTweens.get(slideshow);
      if (t && !t.paused()) return; // already playing
      if (t) t.play();
    });
  }

  return tween;
}

/**
 * Returns the GSAP tween for a given slideshow element, or undefined.
 */
export function getMarqueeTween(slideshow) {
  return marqueeTweens.get(slideshow);
}
