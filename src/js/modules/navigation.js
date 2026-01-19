/**
 * Navigation Module
 * Handles active nav item states based on current section in viewport
 */

/**
 * Initialize navigation active states
 */
export function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  if (navItems.length === 0) {
    return;
  }

  // Map sections to their corresponding nav items
  const sectionNavMap = [
    {
      selector: '.section-about',
      navIndex: 0, // First nav-item (About)
    },
    {
      selector: '.section-project',
      navIndex: 1, // Second nav-item (works) - matches any project section
    },
    {
      selector: '.section-contact, footer',
      navIndex: 2, // Third nav-item (contact)
    }
  ];

  /**
   * Update active nav item
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
    const scrollTop = window.scrollY;

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
  }

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkActiveSection, 10);
  }, { passive: true });

  // Initial check
  setTimeout(checkActiveSection, 100);

  // Also update on hash change (for direct navigation)
  window.addEventListener('hashchange', () => {
    setTimeout(checkActiveSection, 300);
  });
}
