/**
 * Carousel Dots - Syncs dot navigation with marquee animation
 * Dots update to reflect which slide is currently visible.
 * Clicking a dot pauses the marquee and scrolls to that slide.
 * On mobile, tapping the slideshow opens a GLightbox gallery.
 */

import GLightbox from 'glightbox';

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

    // Track which slide is visible based on marquee transform
    function updateActiveDot() {
      const computed = getComputedStyle(slideshow);
      const matrix = new DOMMatrixReadOnly(computed.transform);
      const translateX = Math.abs(matrix.m41);

      // Total width of the original slides (half the full strip)
      const totalWidth = slideshow.scrollWidth / 2;
      // Wrap translateX into the original half
      const wrapped = translateX % totalWidth;
      // Determine which slide is at the left edge
      const slideWidth = totalWidth / slideCount;
      const index = Math.round(wrapped / slideWidth) % slideCount;

      setActiveDot(index);
      requestAnimationFrame(updateActiveDot);
    }

    requestAnimationFrame(updateActiveDot);

    // Dot click: pause marquee, jump to slide, resume after delay
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.dataset.slide, 10);
        if (isNaN(targetIndex) || targetIndex >= slideCount) return;

        // Pause the animation
        slideshow.style.animationPlayState = 'paused';

        // Calculate position to show the target slide
        const totalWidth = slideshow.scrollWidth / 2;
        const slideWidth = totalWidth / slideCount;
        const targetX = slideWidth * targetIndex;

        // Jump to that position
        slideshow.style.animation = 'none';
        slideshow.offsetHeight; // force reflow
        slideshow.style.transform = `translateX(-${targetX}px)`;

        setActiveDot(targetIndex);

        // Resume marquee after delay
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          // Calculate the equivalent progress percentage for the animation
          const progress = targetX / totalWidth;
          slideshow.style.transform = '';
          slideshow.style.animation = '';
          slideshow.style.animationDelay = `-${progress * 30}s`;
          slideshow.style.animationPlayState = '';
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
  const galleryName = `slideshow-${containerIndex}`;

  // Build GLightbox elements array from original slides
  const elements = slides.map((slide) => {
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

  const lightbox = GLightbox({
    elements,
    touchNavigation: true,
    loop: true,
  });

  // Tap handler — open lightbox on mobile, ignore dot clicks
  container.addEventListener('click', (e) => {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    // Don't trigger lightbox when clicking dots
    if (e.target.closest('.carousel-dots')) return;

    // Determine which slide to start from based on current active dot
    const activeDot = container.querySelector('.carousel-dot.active');
    const startIndex = activeDot ? parseInt(activeDot.dataset.slide, 10) : 0;

    lightbox.openAt(startIndex);
  });
}
