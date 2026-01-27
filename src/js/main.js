// js/ Visual Effects

import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { initFlipBoardAnimation } from './modules/flipBoardAnimation.js';
import { initScrollHint } from './modules/scroll-hinter.js';
import { initNavigation } from './modules/navigation.js';
import { initLightGallery } from './modules/lightgallery.js';
import { initIconAnimation } from "./modules/icon-animation.js";
import { initCarouselDots } from "./modules/carousel-dots.js";

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

  // UI features
  initVisualEffects();

  // Lightbox for galleries
  initLightGallery();

  // Carousel dot navigation
  initCarouselDots();
});



// Initialize icon-animation
document.addEventListener("DOMContentLoaded", () => {
  initIconAnimation();
});
