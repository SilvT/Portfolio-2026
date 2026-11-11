// Tools grid: clicking a tool card opens a native <dialog> with that card's details.
// <dialog>.showModal() gives Escape, focus trap, focus return and an inert page for free.
// Backdrop click and the X button close it. Tap on touch devices opens it the same way.
export function initToolCardDetail() {
  const dialog = document.querySelector('.tool-dialog');
  const cards = document.querySelectorAll('.tool-card[data-tool-row]');
  if (!dialog || !cards.length) return;

  const $ = (selector) => dialog.querySelector(selector);

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // keep "open in new tab" on links
      e.preventDefault();

      // Accent colours live on the card's modifier class, so copy the resolved values
      const style = getComputedStyle(card);
      ['--card-accent', '--card-accent-hover'].forEach((name) => {
        dialog.style.setProperty(name, style.getPropertyValue(name));
      });

      const detail = card.querySelector('.tool-card-detail') ?? card.querySelector('.tool-card-description');
      const cta = $('.tool-dialog__cta');

      $('.tool-dialog__img').src = card.querySelector('.tool-card-bg')?.src ?? '';
      $('.tool-dialog__tag').replaceChildren(card.querySelector('.tool-card-tag').cloneNode(true));
      $('.tool-dialog__title').textContent = card.querySelector('.tool-card-title').textContent;
      $('.tool-dialog__text').innerHTML = detail.innerHTML;
      cta.hidden = !card.href;
      if (card.href) cta.href = card.href;

      dialog.showModal();
    });
  });

  // Clicking the backdrop targets the <dialog> itself (the panel has no padding)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-tool-dialog-close]')) dialog.close();
  });
}
