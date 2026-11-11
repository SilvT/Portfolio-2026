// Experimental tools grid: the preview card has no content of its own — it
// shows whichever of the other cards is currently hovered/focused,
// crossfading between their images (data-tool-row <-> data-preview-row).
export function initToolCardsPreview() {
  const cards = document.querySelectorAll('.tool-card[data-tool-row]');
  const images = document.querySelectorAll('.tool-card-preview-img');
  if (!cards.length || !images.length) return;

  const showRow = (row) => {
    images.forEach((img) => {
      img.classList.toggle('is-active', img.dataset.previewRow === row);
    });
  };

  cards.forEach((card) => {
    const row = card.dataset.toolRow;
    card.addEventListener('mouseenter', () => showRow(row));
    card.addEventListener('focus', () => showRow(row));
  });
}
