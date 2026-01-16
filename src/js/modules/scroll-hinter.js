/**
 * Scroll Hint Animation Module
 * Ripple animation with "scroll" text
 */

/**
 * Initialize scroll hint animation
 */
export function initScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  const scrollHinter = document.querySelector('.scroll-hinter');

  // Handle old scroll-hint if it exists
  if (scrollHint) {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      scrollHint.style.display = 'none';
    } else {
      // Add hover cursor pointer
      scrollHint.style.cursor = 'pointer';

      // Add click handler to scroll to first project with smooth scroll
      scrollHint.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const firstProject = document.querySelector('#marketing-management');

        if (firstProject) {
          // Calculate the target scroll position (center in viewport)
          const targetY = firstProject.offsetTop - (window.innerHeight / 2) + (firstProject.offsetHeight / 2);

          // Use native smooth scroll
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      });

      // Show scroll hint when About section is in view
      showScrollHint();
    }
  }

  // Handle new scroll-hinter
  if (scrollHinter) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      scrollHinter.style.display = 'none';
    } else {
      showScrollHinter();
    }
  }
}

/**
 * Show scroll hint when About section is in view
 */
function showScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  const landingSection = document.querySelector('#about-landing');

  if (!scrollHint || !landingSection) {
    return;
  }

  // Show hint when About section is visible in viewport
  const checkVisibility = () => {
    const rect = landingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if About section is visible in viewport (centered or near center)
    const isVisible = rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;

    if (isVisible) {
      scrollHint.classList.remove('hidden');
    } else {
      scrollHint.classList.add('hidden');
    }
  };

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkVisibility, 10);
  }, { passive: true });

  // Initial check with small delay
  setTimeout(checkVisibility, 100);
}

/**
 * Show scroll-hinter when About section is in view
 */
function showScrollHinter() {
  const scrollHinter = document.querySelector('.scroll-hinter');
  const landingSection = document.querySelector('#about-landing');

  if (!scrollHinter || !landingSection) {
    return;
  }

  // Show hinter when About section is visible in viewport
  const checkVisibility = () => {
    const rect = landingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if About section is visible in viewport (centered or near center)
    const isVisible = rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;

    if (isVisible) {
      scrollHinter.style.opacity = '1';
      scrollHinter.style.visibility = 'visible';
    } else {
      scrollHinter.style.opacity = '0';
      scrollHinter.style.visibility = 'hidden';
    }
  };

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkVisibility, 10);
  }, { passive: true });

  // Initial check with small delay
  setTimeout(checkVisibility, 100);
}
