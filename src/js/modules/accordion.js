/**
 * Accordion Module
 * Handles accordion interactions for case study pages
 */

/**
 * Initialize standard accordions
 */
export function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('active');

        // Close all other accordions (optional - remove if you want multiple open)
        document.querySelectorAll('.accordion.active').forEach(item => {
          if (item !== accordion) {
            item.classList.remove('active');
          }
        });

        // Toggle current accordion
        accordion.classList.toggle('active');
      });
    }
  });
}

/**
 * Initialize case study specific accordions
 */
export function initCaseStudyAccordions() {
  const csAccordions = document.querySelectorAll('.cs-accordion');

  csAccordions.forEach(accordion => {
    const trigger = accordion.querySelector('.cs-accordion-trigger');
    const content = accordion.querySelector('.cs-accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        accordion.classList.toggle('open');
      });
    }
  });
}
