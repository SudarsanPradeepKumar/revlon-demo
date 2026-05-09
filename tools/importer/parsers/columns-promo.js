/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo variant.
 * Base block: columns
 * Source: https://www.revlon.com/ (promo-grid sections)
 * Generated: 2026-05-09
 *
 * Extracts a 50/50 two-panel promotional layout:
 * - Left column: video or image media
 * - Right column: background image with overlaid text (eyebrow, heading, body, CTA)
 */
export default function parse(element, { document }) {
  // Find the two grid columns
  const gridItems = element.querySelectorAll('.flex-grid__item--50');

  // --- Left column (media: video or image) ---
  const leftCol = gridItems[0];
  const mediaCell = [];

  if (leftCol) {
    const video = leftCol.querySelector('video');
    const img = leftCol.querySelector('img');

    if (video) {
      // Get the video source URL
      const source = video.querySelector('source');
      if (source && source.getAttribute('src')) {
        let videoSrc = source.getAttribute('src');
        // Ensure protocol
        if (videoSrc.startsWith('//')) {
          videoSrc = `https:${videoSrc}`;
        }
        const videoLink = document.createElement('a');
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        mediaCell.push(videoLink);
      }
      // Also include the fallback poster image if available
      const posterImg = video.querySelector('img');
      if (posterImg) {
        mediaCell.push(posterImg);
      }
    } else if (img) {
      mediaCell.push(img);
    }
  }

  // --- Right column (promo content with background image) ---
  const rightCol = gridItems[1];
  const contentCell = [];

  if (rightCol) {
    // Background image (desktop version preferred)
    const bgImage = rightCol.querySelector('.promo-grid__bg img:not(.promo-grid__bg-image--mobile), .promo-grid__bg img');
    if (bgImage) {
      contentCell.push(bgImage);
    }

    // Eyebrow / subheading text
    const eyebrow = rightCol.querySelector('.subheading');
    if (eyebrow) {
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      contentCell.push(strong);
    }

    // Heading (h2)
    const heading = rightCol.querySelector('h2, .heading');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      contentCell.push(h2);
    }

    // Body text
    const bodyText = rightCol.querySelector('.textarea, .rte--block.textarea');
    if (bodyText) {
      const p = document.createElement('p');
      p.innerHTML = bodyText.innerHTML;
      contentCell.push(p);
    }

    // CTA button/link
    const ctaLinks = rightCol.querySelectorAll('a.btn, a.btn--primary, .promo-grid__content a[href]');
    ctaLinks.forEach((link) => {
      // Avoid the empty slide-link anchor
      if (link.textContent.trim()) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = link.textContent.trim();
        contentCell.push(a);
      }
    });
  }

  // Build cells: single row with two columns
  const cells = [
    [mediaCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
