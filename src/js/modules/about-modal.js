// ============================================
// ABOUT MODAL — slide-in panel
// Opens via <dialog>.showModal(), closes via X / Escape / backdrop click
// Trigger: any element with [data-open-about-modal]
// URL: sets hash to #about on open, clears on close
// Animations driven by .is-open class (not [open]) for reliable transitions
// ============================================

const CLOSE_DURATION = 450; // ms — matches CSS transition

export function initAboutModal() {
  const dialog = document.querySelector('.about-modal');
  if (!dialog) return;

  const triggers = document.querySelectorAll('[data-open-about-modal]');
  const closeBtns = dialog.querySelectorAll('[data-close-about-modal]');
  let isClosing = false;

  function openModal() {
    if (dialog.open || isClosing) return;
    dialog.showModal();
    // Add .is-open next frame so the browser sees the "before" state first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dialog.classList.add('is-open');
      });
    });
    history.replaceState(null, '', '#about');
  }

  function closeModal() {
    if (!dialog.open || isClosing) return;
    isClosing = true;

    // Remove .is-open to trigger CSS exit transition
    dialog.classList.remove('is-open');

    // Wait for animation to finish, then actually close
    setTimeout(() => {
      dialog.close();
      isClosing = false;
    }, CLOSE_DURATION);

    // Clear hash
    if (window.location.hash === '#about') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  // Open — all triggers
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close — X button and backdrop
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  // Intercept Escape so we can animate out instead of instant close
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal();
  });

  // Open on page load if hash is #about
  if (window.location.hash === '#about') {
    requestAnimationFrame(() => openModal());
  }
}
