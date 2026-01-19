// js/ Visual Effects

import { initFlipBoardAnimation } from './modules/flipBoardAnimation.js';
import { initScrollHint } from './modules/scroll-hinter.js';
import { initNavigation } from './modules/navigation.js';
import { initLightGallery } from './modules/lightgallery.js';

/**
 * Initializes passive / visual-only effects.
 * No navigation, no input, no stateful logic.
 */
export function initVisualEffects() {
  initFlipBoardAnimation();
  initScrollHint();
  initLazyLoading();
}
/**
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Core features first
  initNavigation();

  // UI features
  initVisualEffects();

  // Lightbox for galleries
  initLightGallery();
});


/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Add loaded class for any additional styling
        img.classList.add('loaded');

        // Stop observing this image
        imageObserver.unobserve(img);
      }
    });
  }, observerOptions);

  // Observe all project images
  document.querySelectorAll('.project-image').forEach((img) => {
    imageObserver.observe(img);
  });
}