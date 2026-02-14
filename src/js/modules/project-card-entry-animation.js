// ============================================
// PROJECT CARD ENTRY ANIMATION
// Staggers element appearance on scroll into view
// ============================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProjectCardEntryAnimation() {
  const sections = document.querySelectorAll('.section-project');
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  sections.forEach((section) => {
    // --- Group 1: Title group ---
    const projectTitle = section.querySelector('.project-title');
    const typeLabel = section.querySelector('.type-label');
    const projectMeta = section.querySelector('.project-meta');

    // --- Group 2: Long content ---
    const projectDescription = section.querySelector('.project-description');
    const projectDetails = section.querySelector('.project-details');
    const metaGroup = section.querySelector('.meta-group');

    // --- Group 3: Metrics ---
    const metricCards = section.querySelectorAll('.metric-card');

    // --- Group 4: Slideshow + tags ---
    const slideshowContainer = section.querySelector('.slideshow-container');
    const dataTags = section.querySelector('.data-tags');

    // Collect all text elements for initial/reset state
    const textEls = [projectTitle, typeLabel, projectMeta, projectDescription, projectDetails, metaGroup].filter(Boolean);
    const fadeEls = [slideshowContainer, dataTags].filter(Boolean);

    // Set initial hidden state
    gsap.set(textEls, { opacity: 0, y: 20 });
    gsap.set(metricCards, { opacity: 0, y: 15 });
    gsap.set(fadeEls, { opacity: 0 });

    // Reset helper
    function resetToHidden() {
      gsap.set(textEls, { opacity: 0, y: 20 });
      gsap.set(metricCards, { opacity: 0, y: 15 });
      gsap.set(fadeEls, { opacity: 0 });
    }

    // Build paused timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out' }
    });

    // ScrollTrigger: play on enter (normal speed), faster on scroll-back re-enter
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => { resetToHidden(); tl.timeScale(1); tl.restart(); },
      onEnterBack: () => { resetToHidden(); tl.timeScale(2.5); tl.restart(); }
    });

    let t = 0;

    // Group 1: Title group (project-title first, then type-label & project-meta together)
    if (projectTitle) {
      tl.to(projectTitle, { opacity: 1, y: 0, duration: 0.5 }, t);
      t += 0.25;
    }
    const titleSecondary = [typeLabel, projectMeta].filter(Boolean);
    if (titleSecondary.length) {
      tl.to(titleSecondary, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, t);
      t += 0.3;
    }

    // Group 2: Long content (description first, then details & meta-group together)
    if (projectDescription) {
      tl.to(projectDescription, { opacity: 1, y: 0, duration: 0.5 }, t);
      t += 0.25;
    }
    const longSecondary = [projectDetails, metaGroup].filter(Boolean);
    if (longSecondary.length) {
      tl.to(longSecondary, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, t);
      t += 0.3;
    }

    // Group 3: Metric cards (one after another)
    if (metricCards.length) {
      tl.to(metricCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, t);
      t += 0.2 * metricCards.length + 0.1;
    }

    // Group 4: Slideshow + tags (fade in together)
    if (fadeEls.length) {
      tl.to(fadeEls, { opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power1.inOut' }, t);
    }
  });
}
