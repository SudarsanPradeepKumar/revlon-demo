/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://www.revlon.com/blogs/news
 * Selector: .background-media-text
 *
 * Extracts a full-width decorative banner image from the source DOM.
 * No text content or CTA — image only.
 *
 * Target table structure (from block library):
 *   | Hero Banner |
 *   | --- |
 *   | ![Campaign banner image](/media/banner.png) |
 */
export default function parse(element, { document }) {
  // Extract the desktop banner image (prefer display-desktop, fall back to first img)
  const bannerImage = element.querySelector(
    'img.display-desktop, img.background-media-text__image, image-element img'
  );

  const cells = [];

  if (bannerImage) {
    // Single row: the banner image
    cells.push([bannerImage]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-banner',
    cells,
  });

  element.replaceWith(block);
}
