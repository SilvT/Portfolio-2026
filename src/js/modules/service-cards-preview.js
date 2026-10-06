// Experimental tools grid: the preview card has no content of its own — it
// shows whichever of the other cards is currently hovered/focused,
// crossfading between their images (data-service-row <-> data-preview-row).
export function initServiceCardsPreview() {
  const cards = document.querySelectorAll('.service-card[data-service-row]');
  const images = document.querySelectorAll('.service-card-preview-img');
  if (!cards.length || !images.length) return;

  const showRow = (row) => {
    images.forEach((img) => {
      img.classList.toggle('is-active', img.dataset.previewRow === row);
    });
  };

  cards.forEach((card) => {
    const row = card.dataset.serviceRow;
    card.addEventListener('mouseenter', () => showRow(row));
    card.addEventListener('focus', () => showRow(row));
  });
}
