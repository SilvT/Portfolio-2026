// ============================================
// ABOUT SECTION ENTRY ANIMATION
// Staggers element appearance on scroll into view
// ============================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAboutEntryAnimation() {
  const section = document.querySelector('.section-about');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Elements in stagger order
  const circles = section.querySelectorAll('.ellipse-decor circle');
  const firstLetter = section.querySelector('.first-letter');
  const restName = section.querySelector('.rest-name');
  const jobTitle = section.querySelector('.dynamic-job-title');
  const bioBold = section.querySelector('.bio .bold');
  const bioContent = section.querySelector('.bio .content');
  const scrollHinter = document.querySelector('.scroll-hinter');

  // Set initial hidden state — info grid elements
  gsap.set([firstLetter, restName, jobTitle, bioBold, bioContent].filter(Boolean), {
    opacity: 0,
    y: 20
  });

  // Scroll hinter needs visibility too (scroll-hinter.js uses inline visibility)
  if (scrollHinter) {
    gsap.set(scrollHinter, { opacity: 0, y: 20, visibility: 'hidden' });
  }

  // Set initial hidden state — individual circles
  gsap.set(circles, {
    opacity: 0,
    scale: 0.8,
    transformOrigin: 'center center'
  });

  // Helper: reset all elements to hidden state
  const gridEls = [firstLetter, restName, jobTitle, bioBold, bioContent].filter(Boolean);
  function resetToHidden() {
    gsap.set(gridEls, { opacity: 0, y: 20 });
    if (scrollHinter) gsap.set(scrollHinter, { opacity: 0, y: 20, visibility: 'hidden' });
    gsap.set(circles, { opacity: 0, scale: 0.8 });
  }

  // Build the staggered timeline (paused — triggered manually)
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power2.out'
    }
  });

  // ScrollTrigger: play on enter, reset on leave
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    onEnter: () => { resetToHidden(); tl.restart(); },
    onEnterBack: () => { resetToHidden(); tl.restart(); }
  });

  // 1st — Circles stagger in one by one
  if (circles.length) {
    tl.to(circles, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    }, 0);
  }

  // 2nd — Info grid elements stagger in order (0.25s apart)
  const gridElements = [firstLetter, restName, jobTitle, bioBold, bioContent].filter(Boolean);
  gridElements.forEach((el, i) => {
    tl.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, 0.5 + i * 0.25);
  });

  // 3rd — Scroll hinter fades in last
  if (scrollHinter) {
    tl.to(scrollHinter, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 0.5
    }, 0.5 + gridElements.length * 0.25 + 0.6);
  }
}
