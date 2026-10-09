import GLightbox from 'glightbox';

/**
 * Load GLightbox's CSS at runtime (not bundled) so pages that don't need it
 * don't ship the ~14KB. Every caller of GLightbox on this site should go
 * through this instead of injecting the link tag itself.
 */
export function ensureGLightboxCSS() {
  if (document.querySelector('link[href*="glightbox"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css';
  document.head.appendChild(link);
}

/**
 * Initialize GLightbox on Swiper carousels, standalone images, and gallery grids
 */
export function initLightGallery() {
  ensureGLightboxCSS();
  initCarouselGalleries();
  initStandaloneImages();
  initGalleryGrid();
  initAccordionImages();
  initIndexGridImages();
}

/**
 * Initialize GLightbox on all Swiper carousels
 * Each carousel becomes its own gallery
 */
function initCarouselGalleries() {
  const carousels = document.querySelectorAll('.new-carousel.swiper');

  carousels.forEach((carousel, index) => {
    const galleryName = `carousel-${index}`;

    // Get shared figcaption if present
    const figcaption = carousel.querySelector('.cs-image-caption');
    const sharedCaption = figcaption ? figcaption.textContent.trim() : '';

    // Add data attributes to each image
    const images = carousel.querySelectorAll('.cs-carousel-img');
    images.forEach((img) => {
      const altText = img.alt || '';
      const description = buildDescription(altText, sharedCaption);

      img.setAttribute('data-gallery', galleryName);
      img.setAttribute('data-glightbox', `description: ${description}`);
      img.classList.add('glightbox');
    });

    // Wrap each video in an anchor so GLightbox can open it (same gallery group)
    const videos = carousel.querySelectorAll('.cs-carousel-video');
    videos.forEach((video) => {
      const altText = video.getAttribute('aria-label') || '';
      const description = buildDescription(altText, sharedCaption);
      const videoSrc = video.src || video.querySelector('source')?.src;

      const anchor = document.createElement('a');
      anchor.href = videoSrc;
      anchor.className = 'glightbox';
      anchor.setAttribute('data-gallery', galleryName);
      anchor.setAttribute('data-glightbox', `description: ${description}`);
      video.parentNode.insertBefore(anchor, video);
      anchor.appendChild(video);
    });

    // Initialize GLightbox for this carousel
    GLightbox({
      selector: `.new-carousel.swiper:nth-of-type(${index + 1}) .glightbox`,
      touchNavigation: true,
      loop: true,
    });
  });

  // Re-initialize with proper selector after all carousels are processed
  if (carousels.length > 0) {
    // Initialize separate galleries for each carousel using data-gallery attribute
    const uniqueGalleries = [...new Set([...document.querySelectorAll('.new-carousel.swiper .glightbox')].map(el => el.dataset.gallery))];
    uniqueGalleries.forEach(galleryName => {
      GLightbox({
        selector: `[data-gallery="${galleryName}"]`,
        touchNavigation: true,
        loop: true,
      });
    });
  }
}

/**
 * Initialize GLightbox on standalone figure.cs-column-image elements, and on
 * bare <img> + sibling .case-caption pairs inside .case-pairing-row__left
 * (same visual pattern, different markup — case study pages use both).
 */
function initStandaloneImages() {
  const figures = document.querySelectorAll('figure.cs-column-image');

  figures.forEach((figure) => {
    const img = figure.querySelector('img');
    if (!img) return;

    // Get figcaption if present
    const figcaption = figure.querySelector('.cs-image-caption');
    const sharedCaption = figcaption ? figcaption.textContent.trim() : '';

    // Build description from alt + figcaption
    const altText = img.alt || '';
    const description = buildDescription(altText, sharedCaption);

    // Build description for anchor wrapper
    // Note: Don't add glightbox class to img, only to the anchor wrapper

    // Wrap image in anchor for GLightbox
    const anchor = document.createElement('a');
    anchor.href = img.src;
    anchor.className = 'glightbox-standalone';
    anchor.setAttribute('data-glightbox', `description: ${description}`);
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  });

  const pairingImages = document.querySelectorAll('.case-pairing-row__left > img');

  pairingImages.forEach((img) => {
    const caption = img.parentNode.querySelector('.case-caption');
    const sharedCaption = caption ? caption.textContent.trim() : '';

    const altText = img.alt || '';
    const description = buildDescription(altText, sharedCaption);

    const anchor = document.createElement('a');
    anchor.href = img.src;
    anchor.className = 'glightbox-standalone';
    anchor.setAttribute('data-glightbox', `description: ${description}`);
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  });

  // Initialize GLightbox for standalone images (each opens individually)
  GLightbox({
    selector: '.glightbox-standalone',
    touchNavigation: true,
  });
}

/**
 * Initialize GLightbox on gallery grid - all items as one group
 */
function initGalleryGrid() {
  const galleryGrid = document.querySelector('.cs-gallery-grid');
  if (!galleryGrid) return;

  // Process all gallery items (images and videos)
  const items = galleryGrid.querySelectorAll('.cs-gallery-item');
  items.forEach((item) => {
    const img = item.querySelector('img.cs-gallery-image');
    const video = item.querySelector('video.cs-gallery-image');
    const caption = item.querySelector('.cs-gallery-caption');
    const captionText = caption ? caption.textContent.trim() : '';

    if (img) {
      const altText = img.alt || '';
      const description = buildDescription(altText, captionText);

      img.setAttribute('data-glightbox', `description: ${description}`);
      img.setAttribute('data-gallery', 'gallery-grid');
      img.classList.add('glightbox-gallery');

      // Wrap in anchor
      const anchor = document.createElement('a');
      anchor.href = img.src;
      anchor.className = 'glightbox-gallery';
      anchor.setAttribute('data-gallery', 'gallery-grid');
      anchor.setAttribute('data-glightbox', `description: ${description}`);
      img.parentNode.insertBefore(anchor, img);
      anchor.appendChild(img);
    }

    if (video) {
      const altText = video.getAttribute('aria-label') || '';
      const description = buildDescription(altText, captionText);
      const videoSrc = video.src || video.querySelector('source')?.src;

      // Wrap video in anchor for GLightbox
      const anchor = document.createElement('a');
      anchor.href = videoSrc;
      anchor.className = 'glightbox-gallery';
      anchor.setAttribute('data-gallery', 'gallery-grid');
      anchor.setAttribute('data-glightbox', `description: ${description}`);
      video.parentNode.insertBefore(anchor, video);
      anchor.appendChild(video);
    }
  });

  // Initialize GLightbox for gallery grid
  GLightbox({
    selector: '.glightbox-gallery',
    touchNavigation: true,
    loop: true,
  });
}

/**
 * Initialize GLightbox on accordion images as a group
 */
function initAccordionImages() {
  const accordion = document.querySelector('.accordion .cs-three-column-grid');
  if (!accordion) return;

  const images = accordion.querySelectorAll('.cs-images-wrapper img');
  images.forEach((img) => {
    const altText = img.alt || '';
    const description = altText ? `<p class="alt-content">${altText}</p>` : '';

    // Wrap in anchor
    const anchor = document.createElement('a');
    anchor.href = img.src;
    anchor.className = 'glightbox-accordion';
    anchor.setAttribute('data-gallery', 'accordion-gallery');
    anchor.setAttribute('data-glightbox', `description: ${description}`);
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  });

  // Initialize GLightbox for accordion
  GLightbox({
    selector: '.glightbox-accordion',
    touchNavigation: true,
    loop: true,
  });
}

/**
 * Initialize GLightbox on .case-index-grid cell images as one group
 */
function initIndexGridImages() {
  const grid = document.querySelector('.case-index-grid');
  if (!grid) return;

  const wrappers = grid.querySelectorAll('.case-index-grid__cell__image');
  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector('img');
    if (!img) return;

    // Wrapper was decorative (aria-hidden) when the image wasn't interactive;
    // it now contains a focusable link, so the label belongs on the image.
    wrapper.removeAttribute('aria-hidden');

    const altText = img.alt || '';
    const description = buildDescription(altText, '');

    const anchor = document.createElement('a');
    anchor.href = img.src;
    anchor.className = 'glightbox-index-grid';
    anchor.setAttribute('data-gallery', 'index-grid');
    anchor.setAttribute('data-glightbox', `description: ${description}`);
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  });

  GLightbox({
    selector: '.glightbox-index-grid',
    touchNavigation: true,
    loop: true,
  });
}

/**
 * Build HTML description from alt text and caption
 */
function buildDescription(altText, captionText) {
  if (altText && captionText) {
    return `<p class="alt-content">${altText}</p><p class="lg-figcaption">${captionText}</p>`;
  } else if (altText) {
    return `<p class="alt-content">${altText}</p>`;
  } else if (captionText) {
    return captionText;
  }
  return '';
}
