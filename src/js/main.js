// js/ Visual Effects

import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { initFlipBoardAnimation } from './modules/flipBoardAnimation.js';
import { initScrollHint } from './modules/scroll-hinter.js';
import { initNavigation } from './modules/navigation.js';
// GLightbox loaded dynamically — only needed on case study pages
// import { initLightGallery } from './modules/lightgallery.js';
import { initIconAnimation } from "./modules/icon-animation.js";
import { initAboutEntryAnimation } from "./modules/about-entry-animation.js";
import { initAboutModal } from "./modules/about-modal.js";
import { initProjectCardEntryAnimation } from "./modules/project-card-entry-animation.js";
import { initAnalyticsEvents } from "./modules/analytics-events.js";
import { initToolCardsPreview } from "./modules/tool-cards-preview.js";
import { initToolCardDetail } from "./modules/tool-card-detail.js";
import { initAboutDeck } from "./modules/about-deck.js";
import { initProjectSliders } from "./modules/project-slider.js";
import { initPhaseRailAccordion } from "./modules/phase-rail-accordion.js";

// Vercel Analytics & Speed Insights
inject();
injectSpeedInsights();


/**
 * Initializes passive / visual-only effects.
 * No navigation, no input, no stateful logic.
 */
export function initVisualEffects() {
  initFlipBoardAnimation();
  initScrollHint();
}
/**
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Core features first
  initNavigation();

  // About section entry stagger
  initAboutEntryAnimation();

  // About modal slide-in panel
  initAboutModal();
  initAboutDeck();

  // Project card entry stagger
  initProjectCardEntryAnimation();

  // Tools grid: preview card shows whichever card is hovered/focused
  initToolCardsPreview();
  initToolCardDetail();

  // UI features
  initVisualEffects();

  // Lightbox for galleries — dynamic import, only loads on case study pages
  if (document.querySelector('.new-carousel.swiper, .cs-column-image, .cs-gallery-grid')) {
    import('./modules/lightgallery.js').then(({ initLightGallery }) => {
      initLightGallery();
    });
  }


  // Autoplay sliders (split project cards on index.html)
  initProjectSliders();

  // Analytics custom events
  initAnalyticsEvents();

  // Lazy-play videos when their section enters viewport
  const videos = document.querySelectorAll('video[preload="none"]');
  if (videos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    }, { rootMargin: '200px' });
    videos.forEach((video) => videoObserver.observe(video));
  }
});



// Initialize icon-animation
document.addEventListener("DOMContentLoaded", () => {
  initIconAnimation();
});
