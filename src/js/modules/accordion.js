/**
 * Accordion Module
 * Ensures only one accordion can be open at a time using class switching
 */

/**
 * Initialize accordion behavior for milestone details elements
 */
export function initAccordions() {
  const milestones = document.querySelectorAll('.milestone');

  if (milestones.length === 0) return;

  milestones.forEach(accordion => {
    const header = accordion.querySelector('.milestone-header');

    if (!header) return;

    header.addEventListener('click', (event) => {
      event.preventDefault();

      const isCurrentlyOpen = accordion.classList.contains('is-open');

      // Close all accordions
      milestones.forEach(item => {
        item.classList.remove('is-open');
        item.removeAttribute('open');
      });

      // If this one wasn't open, open it
      if (!isCurrentlyOpen) {
        accordion.classList.add('is-open');
        accordion.setAttribute('open', '');
      }
    });
  });
}

/**
 * Initialize generic accordion behavior for case study sections
 * Uses .accordion class and .accordion-content for expandable content
 */
export function initCaseStudyAccordions() {
  const accordions = document.querySelectorAll('.cs-line-breaker.accordion');

  if (accordions.length === 0) return;

  accordions.forEach(accordion => {
    const content = accordion.querySelector('.accordion-content');

    if (!content) return;

    // Initially hide the content
    content.style.display = 'none';

    // Make the whole accordion clickable
    accordion.style.cursor = 'pointer';

    accordion.addEventListener('click', (event) => {
      event.preventDefault();

      const isCurrentlyOpen = accordion.classList.contains('is-open');

      // Close all case study accordions
      accordions.forEach(item => {
        const itemContent = item.querySelector('.accordion-content');
        if (itemContent) {
          itemContent.style.display = 'none';
        }
        item.classList.remove('is-open');
      });

      // If this one wasn't open, open it
      if (!isCurrentlyOpen) {
        content.style.display = 'block';
        accordion.classList.add('is-open');
      }
    });
  });
}
