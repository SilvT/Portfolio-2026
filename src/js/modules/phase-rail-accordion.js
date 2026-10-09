/**
 * Phase Rail Accordion Module
 * Mutually exclusive expand/collapse for .case-phase-rail--accordion rows
 */
// detail's own scrollHeight is pinned to 0 by max-height while collapsed,
// so sum each child's margin box instead (offsetHeight excludes margins).
const measure = (detail) => Array.from(detail.children)
  .reduce((sum, child) => {
    const { marginTop, marginBottom } = getComputedStyle(child);
    return sum + child.offsetHeight + parseFloat(marginTop) + parseFloat(marginBottom);
  }, 0) + 20;

export function initPhaseRailAccordion() {
  const rails = document.querySelectorAll('.case-phase-rail--accordion');

  rails.forEach(rail => {
    const rows = rail.querySelectorAll('.case-phase-row');
    let openDetail = null;

    rows.forEach(row => {
      const detail = row.querySelector('.case-phase-row__detail');
      const toggle = row.querySelector('.case-phase-row__toggle');

      if (!detail || !toggle) return;

      const isOpen = detail.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        detail.style.setProperty('--case-phase-row-detail-height', `${measure(detail)}px`);
        openDetail = detail;
      }

      const close = (r, d) => {
        r.classList.remove('is-open');
        d.classList.remove('is-open');
        d.querySelector('.case-phase-row__toggle')?.setAttribute('aria-expanded', 'false');
      };

      const open = (r, d, t) => {
        r.classList.add('is-open');
        d.style.setProperty('--case-phase-row-detail-height', `${measure(d)}px`);
        d.classList.add('is-open');
        t.setAttribute('aria-expanded', 'true');
        openDetail = d;
      };

      // Listen on the row, not just the button, so the whole header row is
      // the click/tap target (button clicks bubble up to this naturally,
      // keeping the button as the keyboard-focusable control).
      row.addEventListener('click', (event) => {
        // Let links/interactions inside the open detail panel work normally.
        if (event.target.closest('.case-phase-row__detail')) return;

        event.preventDefault();

        const isCurrentlyOpen = row.classList.contains('is-open');

        rows.forEach(item => {
          close(item, item.querySelector('.case-phase-row__detail'));
        });
        openDetail = null;

        if (!isCurrentlyOpen) {
          open(row, detail, toggle);
        }
      });
    });

    // Recompute the open row's height on viewport resize (e.g. rotation,
    // or dev tools reflow) — text wraps differently at other widths.
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (openDetail) {
          openDetail.style.setProperty('--case-phase-row-detail-height', `${measure(openDetail)}px`);
        }
      }, 100);
    });
  });
}
