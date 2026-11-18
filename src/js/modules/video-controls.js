// Case study autoplay videos: pause/play toggle (WCAG 2.2.2) and no autoplay under reduced motion.
export function initVideoControls() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('video[autoplay]').forEach((video) => {
    // closest(), not parentElement: lightgallery.js may wrap the video in an <a>, and the button must stay outside it
    const wrap = video.closest('.new-slide, .cs-gallery-item, .case-video');
    wrap.classList.add('video-wrap');

    if (reduce) {
      video.removeAttribute('autoplay');
      video.pause();
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-toggle';
    btn.innerHTML = '<i class="iconoir-pause video-icon-pause" aria-hidden="true"></i><i class="iconoir-play video-icon-play" aria-hidden="true"></i>';

    // Track the user's choice, not video.paused: browsers also pause offscreen autoplay videos
    const setState = (paused) => {
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    };
    btn.addEventListener('click', () => {
      const play = btn.getAttribute('aria-pressed') === 'true';
      if (play) video.play().catch(() => {});
      else video.pause();
      setState(!play);
    });
    setState(reduce);

    wrap.append(btn);
  });
}
