// js/ Visual Effects

import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { initFlipBoardAnimation } from './modules/flipBoardAnimation.js';
import { initScrollHint } from './modules/scroll-hinter.js';
import { initNavigation } from './modules/navigation.js';
// GLightbox loaded dynamically — only needed on case study pages
// import { initLightGallery } from './modules/lightgallery.js';
import { initIconAnimation } from "./modules/icon-animation.js";
import { initCarouselDots } from "./modules/carousel-dots.js";
import { initAboutEntryAnimation } from "./modules/about-entry-animation.js";
import { initAboutModal } from "./modules/about-modal.js";
import { initProjectCardEntryAnimation } from "./modules/project-card-entry-animation.js";
import { initAnalyticsEvents } from "./modules/analytics-events.js";

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

  // Project card entry stagger
  initProjectCardEntryAnimation();

  // UI features
  initVisualEffects();

  // Lightbox for galleries — dynamic import, only loads on case study pages
  if (document.querySelector('.new-carousel.swiper, .cs-column-image, .cs-gallery-grid')) {
    // Load GLightbox CSS at runtime (not bundled) to avoid 3MB on pages that don't need it
    if (!document.querySelector('link[href*="glightbox"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css';
      document.head.appendChild(link);
    }
    import('./modules/lightgallery.js').then(({ initLightGallery }) => {
      initLightGallery();
    });
  }

  // Carousel dot navigation
  initCarouselDots();

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
