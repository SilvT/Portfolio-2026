// About modal card deck (index.html): scrolling the modal content swaps the
// top card. Native scroll drives it (wheel, touch, scrollbar, keys); the dots
// on the right show where you are and scroll to a card when clicked.
// Each card gets --d (0 = on top, 1+ = underneath, <0 = sent away).

export function initAboutDeck() {
  const content = document.querySelector('.about-modal__content');
  const deck = content?.querySelector('.about-deck');
  if (!deck) return;

  const cards = [...deck.children];
  const dots = [...content.querySelectorAll('[data-deck-dot]')];
  const VISIBLE_DEPTH = 3;
  let active = -1;

  const render = (index) => {
    if (index === active) return;
    active = index;
    cards.forEach((card, i) => {
      const d = i - index;
      card.style.setProperty('--d', Math.max(d, 0));
      card.dataset.state = d < 0 ? 'gone' : d > VISIBLE_DEPTH ? 'hidden' : 'shown';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const maxScroll = () => content.scrollHeight - content.clientHeight;
  const indexFromScroll = () => {
    const max = maxScroll();
    return max > 0 ? Math.round((content.scrollTop / max) * (cards.length - 1)) : 0;
  };
  const scrollToCard = (index) => {
    content.scrollTo({ top: (maxScroll() * index) / (cards.length - 1) });
  };

  content.addEventListener('scroll', () => render(indexFromScroll()), { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToCard(i));
    // Up / down arrows move between dots, like a vertical tab list
    dot.addEventListener('keydown', (e) => {
      const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null;
      if (next === null || !dots[next]) return;
      e.preventDefault();
      dots[next].focus();
      scrollToCard(next);
    });
  });

  // Tabbing to a card underneath (e.g. the Reach Out link) brings it to the top
  deck.addEventListener('focusin', (e) => {
    const index = cards.findIndex((card) => card.contains(e.target));
    if (index !== -1 && index !== active) scrollToCard(index);
  });

  // Start from the first card every time the modal opens
  document.querySelector('.about-modal')?.addEventListener('close', () => {
    content.scrollTop = 0;
    render(0);
  });

  render(0);
}
