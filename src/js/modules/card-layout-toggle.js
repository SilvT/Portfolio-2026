const STORAGE_KEY = 'card-layout';
const LAYOUTS = ['current', 'experimental'];

export function initCardLayoutToggle() {
  const control = document.querySelector('.segmented-control.card-layout-switch');
  if (!control) return;

  const options = control.querySelectorAll('.segmented-option');

  const applyLayout = (layout) => {
    if (layout === 'current') {
      document.body.removeAttribute('data-card-layout');
    } else {
      document.body.setAttribute('data-card-layout', layout);
    }

    options.forEach((option) => {
      const isActive = option.dataset.layout === layout;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-checked', String(isActive));
    });
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (LAYOUTS.includes(saved)) applyLayout(saved);

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const layout = option.dataset.layout;
      applyLayout(layout);
      localStorage.setItem(STORAGE_KEY, layout);
    });
  });
}
