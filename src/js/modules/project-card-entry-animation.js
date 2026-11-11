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
    if (!screen) return;

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

    function resetToHidden() {
      reveal.radius = 0;
      reveal.center = 0;
      reveal.edge = 0;
      paintMask();
    }

    const tl = gsap.timeline({ paused: true });

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
