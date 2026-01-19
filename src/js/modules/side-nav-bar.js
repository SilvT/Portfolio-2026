/**
 * Side Navigation Bar Module
 * Creates a fixed side navigation that tracks scroll position
 * and highlights the current section in view
 */

/**
 * Initialize the side navigation bar
 * Collects sections with data-section-title and builds the nav dynamically
 */
export function initSideNavBar() {
  // Find all sections with data-section-title attribute
  const sections = document.querySelectorAll('[data-section-title]');

  if (sections.length === 0) return;

  // Build the navigation
  const nav = buildNavigation(sections);
  document.body.appendChild(nav);

  // Setup intersection observer to track active section
  setupScrollTracking(sections, nav);

  // Setup click handlers for smooth scrolling
  setupClickHandlers(nav);

  // Show nav after a brief delay (allows page to settle)
  setTimeout(() => {
    nav.classList.add('is-visible');
  }, 300);
}

/**
 * Build the navigation HTML from sections
 * @param {NodeList} sections - Elements with data-section-title
 * @returns {HTMLElement} The nav element
 */
function buildNavigation(sections) {
  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.setAttribute('aria-label', 'Case study sections');

  const list = document.createElement('ul');
  list.className = 'side-nav__list';

  // Add indicator element
  const indicator = document.createElement('div');
  indicator.className = 'side-nav__indicator';
  list.appendChild(indicator);

  sections.forEach((section, index) => {
    const title = section.getAttribute('data-section-title');
    const sectionId = section.id || `section-${index + 1}`;

    // Ensure section has an ID for anchor links
    if (!section.id) {
      section.id = sectionId;
    }

    const item = document.createElement('li');
    item.className = 'side-nav__item';

    const link = document.createElement('a');
    link.className = 'side-nav__link';
    link.href = `#${sectionId}`;
    link.setAttribute('data-section-index', index);

    const number = document.createElement('span');
    number.className = 'side-nav__number';
    number.textContent = String(index + 1).padStart(2, '0');

    const label = document.createElement('span');
    label.className = 'side-nav__label';
    label.textContent = title;

    link.appendChild(number);
    link.appendChild(label);
    item.appendChild(link);
    list.appendChild(item);
  });

  nav.appendChild(list);
  return nav;
}

/**
 * Setup Intersection Observer to track which section is in view
 * @param {NodeList} sections - The sections to observe
 * @param {HTMLElement} nav - The navigation element
 */
function setupScrollTracking(sections, nav) {
  const links = nav.querySelectorAll('.side-nav__link');
  const indicator = nav.querySelector('.side-nav__indicator');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in upper-middle viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionIndex = Array.from(sections).indexOf(entry.target);
        updateActiveLink(links, indicator, sectionIndex);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Update the active link and move the indicator
 * @param {NodeList} links - All nav links
 * @param {HTMLElement} indicator - The sliding indicator
 * @param {number} activeIndex - Index of the active section
 */
function updateActiveLink(links, indicator, activeIndex) {
  links.forEach((link, index) => {
    if (index === activeIndex) {
      link.classList.add('is-active');
      // Move indicator to this link's position
      const linkRect = link.getBoundingClientRect();
      const listRect = link.closest('.side-nav__list').getBoundingClientRect();
      const offset = linkRect.top - listRect.top;
      indicator.style.transform = `translateY(${offset}px)`;
    } else {
      link.classList.remove('is-active');
    }
  });
}

/**
 * Setup click handlers for smooth scrolling
 * @param {HTMLElement} nav - The navigation element
 */
function setupClickHandlers(nav) {
  const links = nav.querySelectorAll('.side-nav__link');

  // Offset for sticky nav bar at top
  const NAV_OFFSET = 80;

  links.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}
