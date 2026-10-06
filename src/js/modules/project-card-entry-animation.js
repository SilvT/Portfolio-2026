// ============================================
// PROJECT CARD ENTRY ANIMATION
// Single circular mask reveal on scroll into view. mask-image is a single
// radial-gradient layer (no compositing between multiple masks — that's
// what broke before), so it's a reliable, well-supported technique. The
// gradient's two alpha stops (center, edge) are animated independently via
// GSAP, each written as a literal value every tick (no CSS custom properties
// inside the gradient string, which were unreliable to repaint).
// ============================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMarqueeTween, getMarqueeTween } from './marquee-scroll.js';

gsap.registerPlugin(ScrollTrigger);

// Origin point for the circle, as % of the card's own box — anchored near
// where the title sits (upper-left) rather than dead-center, so the reveal
// feels directional instead of a generic iris-out from the middle.
const ORIGIN_X = 20;
const ORIGIN_Y = 25;
// Radius has to clear the diagonal from an off-center origin to the farthest
// corner of a wide card, not just its nearest edges — 150% overshoots safely.
const END_RADIUS = 150;

export function initProjectCardEntryAnimation() {
  const sections = document.querySelectorAll('.section-project');
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  sections.forEach((section) => {
    const screen = section.querySelector('.project-screen');
    const slideshow = section.querySelector('.project-image-wrapper.slideshow');
    if (!screen) return;

    // Create GSAP marquee tween FIRST (may add extra clones via ensureFillWidth)
    createMarqueeTween(slideshow, { paused: true });

    // Mask state, written imperatively every tick so the browser always
    // repaints a fresh gradient string (no var()-in-gradient chain).
    const reveal = { radius: 0, center: 1, edge: 1 };
    function paintMask() {
      const mask =
        `radial-gradient(circle at ${ORIGIN_X}% ${ORIGIN_Y}%, ` +
        `rgba(0,0,0,${reveal.center}) 0%, ` +
        `rgba(0,0,0,${reveal.edge}) ${reveal.radius}%)`;
      screen.style.maskImage = mask;
      screen.style.webkitMaskImage = mask;
    }
    paintMask();

    let marqueeTimer = 0;
    function resetToHidden() {
      reveal.radius = 0;
      reveal.center = 0;
      reveal.edge = 0;
      paintMask();
      clearTimeout(marqueeTimer);
      const tween = getMarqueeTween(slideshow);
      if (tween) { tween.pause().progress(0); }
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Resume marquee scrolling 600ms after the reveal finishes
        const tween = getMarqueeTween(slideshow);
        if (tween) {
          marqueeTimer = setTimeout(() => { tween.play(); }, 600);
        }
      }
    });

    tl.to(reveal, { radius: END_RADIUS, center: 1, edge: 1, duration: 0.9, ease: 'power2.out', onUpdate: paintMask });

    // ScrollTrigger: play on enter (normal speed), faster on scroll-back re-enter
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        resetToHidden();
        tl.timeScale(1); tl.restart();
      },
      onEnterBack: () => { resetToHidden(); tl.timeScale(2.5); tl.restart(); }
    });
  });
}

// ============================================
// SUPERSEDED: staggered 6-group timeline (title → meta → description →
// metrics → slideshow → tags, each independently timed/offset). Kept for
// reference / easy A-B comparison or rollback — not imported anywhere.
// ============================================
//
// export function initProjectCardEntryAnimationStaggered() {
//   const sections = document.querySelectorAll('.section-project');
//   if (!sections.length) return;
//
//   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//   if (prefersReducedMotion) return;
//
//   sections.forEach((section) => {
//     // --- Group 1: Title group ---
//     const projectTitle = section.querySelector('.project-title');
//     const typeLabel = section.querySelector('.type-label');
//     const projectMeta = section.querySelector('.project-meta');
//
//     // --- Group 2: Long content ---
//     const projectDescription = section.querySelector('.project-description');
//     const projectDetails = section.querySelector('.project-details');
//     const metaGroup = section.querySelector('.meta-group');
//
//     // --- Group 3: Metrics ---
//     const metricCards = section.querySelectorAll('.metric-card');
//
//     // --- Group 4: Slideshow + tags ---
//     const slideshow = section.querySelector('.project-image-wrapper.slideshow');
//     const dataTags = section.querySelector('.data-tags');
//     // First 3 original slides (not aria-hidden duplicates)
//     const firstSlides = Array.from(
//       section.querySelectorAll('.project-image[data-slide]:not([aria-hidden])')
//     ).slice(0, 3);
//     const remainingSlides = Array.from(
//       section.querySelectorAll('.project-image[data-slide]:not([aria-hidden])')
//     ).slice(3);
//     // Collect all text elements for initial/reset state
//     const textEls = [projectTitle, typeLabel, projectMeta, projectDescription, projectDetails, metaGroup].filter(Boolean);
//     const fadeEls = [dataTags].filter(Boolean);
//
//     // Create GSAP marquee tween FIRST (may add extra clones via ensureFillWidth)
//     createMarqueeTween(slideshow, { paused: true });
//
//     // Query dupes AFTER createMarqueeTween so dynamically added clones are included
//     const dupeSlides = slideshow
//       ? slideshow.querySelectorAll('.project-image[aria-hidden="true"]')
//       : [];
//
//     // Set initial hidden state
//     gsap.set(textEls, { opacity: 0, y: 20 });
//     gsap.set(metricCards, { opacity: 0, y: 15 });
//     gsap.set(firstSlides, { opacity: 0 });
//     gsap.set(remainingSlides, { opacity: 0 });
//     gsap.set(dupeSlides, { opacity: 0 });
//     gsap.set(fadeEls, { opacity: 0 });
//
//     // Reset helper — re-queries dupes live in case ensureFillWidth added clones
//     let marqueeTimer = 0;
//     function resetToHidden() {
//       const allDupes = slideshow
//         ? slideshow.querySelectorAll('.project-image[aria-hidden="true"]')
//         : [];
//       gsap.set(textEls, { opacity: 0, y: 20 });
//       gsap.set(metricCards, { opacity: 0, y: 15 });
//       gsap.set(firstSlides, { opacity: 0 });
//       gsap.set(remainingSlides, { opacity: 0 });
//       gsap.set(allDupes, { opacity: 0 });
//       gsap.set(fadeEls, { opacity: 0 });
//       // Pause marquee and reset to start
//       clearTimeout(marqueeTimer);
//       const tween = getMarqueeTween(slideshow);
//       if (tween) { tween.pause().progress(0); }
//     }
//
//     // Build paused timeline
//     const tl = gsap.timeline({
//       paused: true,
//       defaults: { ease: 'power2.out' },
//       onComplete: () => {
//         // Resume marquee scrolling 2s after entry animation finishes
//         const tween = getMarqueeTween(slideshow);
//         if (tween) {
//           marqueeTimer = setTimeout(() => { tween.play(); }, 600);
//         }
//       }
//     });
//
//     // ScrollTrigger: play on enter (normal speed), faster on scroll-back re-enter
//     ScrollTrigger.create({
//       trigger: section,
//       start: 'top 80%',
//       onEnter: () => {
//         resetToHidden();
//         tl.timeScale(1); tl.restart();
//       },
//       onEnterBack: () => { resetToHidden(); tl.timeScale(2.5); tl.restart(); }
//     });
//
//     // ── Block 1: Text content (Groups 1→2→3, staggered sequentially) ──
//     let t = 0;
//
//     // Group 1: Title group
//     if (projectTitle) {
//       tl.to(projectTitle, { opacity: 1, y: 0, duration: 0.5 }, t);
//       t += 0.25;
//     }
//     const titleSecondary = [typeLabel, projectMeta].filter(Boolean);
//     if (titleSecondary.length) {
//       tl.to(titleSecondary, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, t);
//       t += 0.3;
//     }
//
//     // Group 2: Long content
//     if (projectDescription) {
//       tl.to(projectDescription, { opacity: 1, y: 0, duration: 0.5 }, t);
//       t += 0.25;
//     }
//     const longSecondary = [projectDetails, metaGroup].filter(Boolean);
//     if (longSecondary.length) {
//       tl.to(longSecondary, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, t);
//       t += 0.3;
//     }
//
//     // Group 3: Metric cards
//     if (metricCards.length) {
//       tl.to(metricCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, onComplete: () => gsap.set(metricCards, { clearProps: 'transform' }) }, t);
//     }
//
//     // ── Block 2: Slideshow + tags (starts at t=0, parallel with Block 1) ──
//     let b = 0;
//
//     // First 3 slides stagger in one by one
//     if (firstSlides.length) {
//       tl.to(firstSlides, { opacity: 1, duration: 0.8, stagger: 0.25, ease: 'power1.inOut' }, b);
//       b += firstSlides.length * 0.25;
//     }
//
//     // Remaining original slides + all duplicates appear together
//     // Use a function-based target for dupes so it picks up dynamically added clones
//     if (remainingSlides.length) {
//       tl.to(remainingSlides, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, b);
//     }
//     if (dupeSlides.length) {
//       tl.to(dupeSlides, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, b);
//     }
//
//     // Tags fade in last
//     if (fadeEls.length) {
//       tl.to(fadeEls, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, b + 0.15);
//     }
//   });
// }
