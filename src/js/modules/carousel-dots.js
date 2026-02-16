/**
 * Carousel Dots - Syncs dot navigation with GSAP marquee tween
 * Dots update to reflect which slide is currently visible.
 * Clicking a dot pauses the marquee and scrolls to that slide.
 * On mobile, tapping the slideshow opens a GLightbox gallery.
 */

import { getMarqueeTween } from './marquee-scroll.js';

const RESUME_DELAY = 3000; // ms before marquee resumes after dot click
const MOBILE_BREAKPOINT = 768;

export function initCarouselDots() {
  const containers = document.querySelectorAll('.slideshow-container');

  containers.forEach((container, containerIndex) => {
    const slideshow = container.querySelector('.project-image-wrapper.slideshow');
    const dots = container.querySelectorAll('.carousel-dot');
    if (!slideshow || dots.length === 0) return;

    // Get only the original slides (not the aria-hidden duplicates)
    const slides = Array.from(
      slideshow.querySelectorAll('.project-image:not([aria-hidden="true"])')
    );
    const slideCount = slides.length;
    if (slideCount === 0) return;

    let resumeTimer = null;
    let activeDotIndex = 0;

    function setActiveDot(index) {
      if (index === activeDotIndex) return;
      activeDotIndex = index;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    // Track which slide is visible based on GSAP tween progress
    function updateActiveDot() {
      const tween = getMarqueeTween(slideshow);
      if (tween) {
        // progress goes 0→1 for one full -50% cycle
        const progress = tween.progress();
        const index = Math.floor(progress * slideCount) % slideCount;
        setActiveDot(index);
      }
      requestAnimationFrame(updateActiveDot);
    }

    requestAnimationFrame(updateActiveDot);

    // Dot click: pause marquee, jump to slide, resume after delay
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.dataset.slide, 10);
        if (isNaN(targetIndex) || targetIndex >= slideCount) return;

        const tween = getMarqueeTween(slideshow);
        if (!tween) return;

        // Pause and jump to target slide position
        tween.pause();
        tween.progress(targetIndex / slideCount);
        setActiveDot(targetIndex);

        // Resume marquee after delay
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          tween.play();
        }, RESUME_DELAY);
      });
    });

    // Mobile lightbox: tap slideshow to open gallery
    initSlideshowLightbox(container, slides, containerIndex);
  });
}

/**
 * On mobile, tapping the slideshow container opens a GLightbox gallery
 * with all original slides, starting from the currently visible one.
 */
function initSlideshowLightbox(container, slides, containerIndex) {
  let lightbox = null;

  // Build GLightbox elements array from original slides
  function getElements() {
    return slides.map((slide) => {
      const isVideo = slide.tagName === 'VIDEO';
      if (isVideo) {
        return {
          href: slide.src,
          type: 'video',
          source: 'local',
          width: 900,
          description: slide.getAttribute('alt') || '',
        };
      }
      return {
        href: slide.src,
        type: 'image',
        alt: slide.alt || '',
        description: slide.alt || '',
      };
    });
  }

  // Tap handler — load GLightbox on demand, open on mobile
  container.addEventListener('click', async (e) => {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    if (e.target.closest('.carousel-dots')) return;

    if (!lightbox) {
      const { default: GLightbox } = await import('glightbox');
      // Load CSS at runtime to avoid Vite extracting it into all pages
      if (!document.querySelector('link[href*="glightbox"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css';
        document.head.appendChild(link);
      }
      lightbox = GLightbox({
        elements: getElements(),
        touchNavigation: true,
        loop: true,
      });
    }

    const activeDot = container.querySelector('.carousel-dot.active');
    const startIndex = activeDot ? parseInt(activeDot.dataset.slide, 10) : 0;
    lightbox.openAt(startIndex);
  });
}
