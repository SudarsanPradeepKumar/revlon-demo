/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-article
 * Base block: columns
 * Source: https://www.revlon.com/blogs/makeup/trending-prom-makeup-looks
 * Generated: 2026-05-09
 *
 * Two-column article hero: article title (h2) on the left, featured image on the right.
 * Selector: .custom-content
 */
export default function parse(element, { document }) {
  // Extract the article title heading from the copy area
  // Validated selectors from source.html:
  //   .custom__item--copy-area_wrapper .copy-area h2
  //   Fallback: h2, h1 (in case heading level varies across articles)
  const heading = element.querySelector('.copy-area h2')
    || element.querySelector('.type-banner__text h2')
    || element.querySelector('h2')
    || element.querySelector('h1');

  // Extract the featured image from the image wrapper
  // Validated selectors from source.html:
  //   .custom__item-image-wrapper image-element img
  //   Fallback: .image-wrap img, img (in case markup varies)
  const image = element.querySelector('.custom__item-image-wrapper img')
    || element.querySelector('image-element img')
    || element.querySelector('.image-wrap img')
    || element.querySelector('img');

  // Build cells to match library-example.md:
  // Single content row with 2 cells: heading | image
  const cell1 = [];
  if (heading) {
    cell1.push(heading);
  }

  const cell2 = [];
  if (image) {
    cell2.push(image);
  }

  const cells = [
    [cell1, cell2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
