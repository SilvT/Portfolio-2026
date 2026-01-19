import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

/**
 * Initialize lightGallery on Swiper carousels, standalone images, and gallery grids
 */
export function initLightGallery() {
  initCarouselGalleries();
  initStandaloneImages();
  initGalleryGrid();
  initAccordionImages();
}

/**
 * Initialize lightGallery on all Swiper carousels
 * Each carousel becomes its own gallery
 */
function initCarouselGalleries() {
  const carousels = document.querySelectorAll('.new-carousel.swiper');

  carousels.forEach((carousel) => {
    // Get shared figcaption if present
    const figcaption = carousel.querySelector('.cs-image-caption');
    const sharedCaption = figcaption ? figcaption.textContent.trim() : '';

    // Add data-sub-html to each image combining alt + figcaption
    const images = carousel.querySelectorAll('.cs-carousel-img');
    images.forEach((img) => {
      const altText = img.alt || '';
      const caption = altText && sharedCaption
        ? `<p class="alt-content">${altText}</p><p class="lg-figcaption">${sharedCaption}</p>`
        : altText ? `<p class="alt-content">${altText}</p>` : sharedCaption;
      img.setAttribute('data-sub-html', caption);
    });

    lightGallery(carousel, {
      selector: '.cs-carousel-img',
      download: false,
      counter: true,
    });
  });
}

/**
 * Initialize lightGallery on standalone figure.cs-column-image elements
 */
function initStandaloneImages() {
  const figures = document.querySelectorAll('figure.cs-column-image');

  figures.forEach((figure) => {
    const img = figure.querySelector('img');
    if (!img) return;

    // Get figcaption if present
    const figcaption = figure.querySelector('.cs-image-caption');
    const sharedCaption = figcaption ? figcaption.textContent.trim() : '';

    // Build caption from alt + figcaption
    const altText = img.alt || '';
    const caption = altText && sharedCaption
      ? `<p class="alt-content">${altText}</p><p class="lg-figcaption">${sharedCaption}</p>`
      : altText ? `<p class="alt-content">${altText}</p>` : sharedCaption;

    // Add data attributes to image
    img.setAttribute('data-src', img.src);
    img.setAttribute('data-sub-html', caption);
    img.classList.add('lg-item');

    lightGallery(figure, {
      selector: '.lg-item',
      download: false,
      counter: false,
    });
  });
}

/**
 * Initialize lightGallery on gallery grid - all items as one group
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
      const subHtml = altText && captionText
        ? `<p class="alt-content">${altText}</p><p class="lg-figcaption">${captionText}</p>`
        : altText ? `<p class="alt-content">${altText}</p>` : captionText;

      img.setAttribute('data-src', img.src);
      img.setAttribute('data-sub-html', subHtml);
      img.classList.add('lg-gallery-item');
    }

    if (video) {
      const altText = video.getAttribute('aria-label') || '';
      const subHtml = altText && captionText
        ? `<p class="alt-content">${altText}</p><p class="lg-figcaption">${captionText}</p>`
        : altText ? `<p class="alt-content">${altText}</p>` : captionText;

      // For HTML5 videos, use data-video attribute with source object
      const videoSrc = video.src || video.querySelector('source')?.src;
      video.setAttribute('data-video', JSON.stringify({
        source: [{ src: videoSrc, type: 'video/mp4' }],
        attributes: { preload: 'none', controls: true, playsinline: true }
      }));
      video.setAttribute('data-sub-html', subHtml);
      video.classList.add('lg-gallery-item');
    }
  });

  lightGallery(galleryGrid, {
    selector: '.lg-gallery-item',
    download: false,
    counter: true,
    plugins: [lgVideo],
    videojs: false,
  });
}

/**
 * Initialize lightGallery on accordion images as a group
 */
function initAccordionImages() {
  const accordion = document.querySelector('.accordion .cs-three-column-grid');
  if (!accordion) return;

  const images = accordion.querySelectorAll('.cs-images-wrapper img');
  images.forEach((img) => {
    const altText = img.alt || '';
    const subHtml = altText ? `<p class="alt-content">${altText}</p>` : '';

    img.setAttribute('data-src', img.src);
    img.setAttribute('data-sub-html', subHtml);
    img.classList.add('lg-accordion-item');
  });

  lightGallery(accordion, {
    selector: '.lg-accordion-item',
    download: false,
    counter: true,
  });
}
