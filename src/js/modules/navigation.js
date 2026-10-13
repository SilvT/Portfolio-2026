/**
 * Navigation Module
 * Handles active nav item states based on current section in viewport
 */

/**
 * Initialize navigation active states
 */
export function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const topNav = document.querySelector('.top-nav');

  if (navItems.length === 0) {
    return;
  }

  // Map sections to their corresponding nav items. About has no entry here
  // on purpose — it shouldn't show as "active" while on the hero section.
  const sectionNavMap = [
    {
      selector: '.section-project',
      navIndex: 1, // Second nav-item (works) - matches any project section
    },
    {
      selector: '.section-contact, footer',
      navIndex: 3, // Fourth nav-item (contact)
    }
  ];

  /**
   * Update active nav item. activeIndex of null clears all (e.g. while
   * still on the About/hero section).
   */
  function updateActiveNav(activeIndex) {
    navItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Check which section is currently in view
   */
  function checkActiveSection() {
    const windowHeight = window.innerHeight;

    // At the bottom of the page, the contact/footer section may be
    // shorter than the viewport, so the geometry check below can fail
    // even though contact is clearly the active section.
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      updateActiveNav(3);
      return;
    }

    // Check each section to see which one is most visible
    for (let i = 0; i < sectionNavMap.length; i++) {
      const { selector, navIndex } = sectionNavMap[i];
      const elements = document.querySelectorAll(selector);

      for (let element of elements) {
        const rect = element.getBoundingClientRect();

        // Section is considered active if its top is near the top of viewport
        // This works well with scroll-snap
        const isActive = rect.top <= 100 && rect.bottom >= windowHeight * 0.3;

        if (isActive) {
          updateActiveNav(navIndex);
          return;
        }
      }
    }

    // No section matched (still on About) — clear active state
    updateActiveNav(null);
  }

  /**
   * Toggle shrunk nav state once the page has scrolled past the top
   */
  function checkScrolled() {
    if (!topNav) return;
    topNav.classList.toggle('scrolled', window.scrollY > 0);
  }

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      checkActiveSection();
      checkScrolled();
    }, 10);
  }, { passive: true });

  // Initial check
  setTimeout(checkActiveSection, 100);

  // Also update on hash change (for direct navigation)
  window.addEventListener('hashchange', () => {
    setTimeout(checkActiveSection, 300);
  });
}
