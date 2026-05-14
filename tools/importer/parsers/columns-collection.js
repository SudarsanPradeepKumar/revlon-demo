/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-collection
 * Base block: columns
 * Source: https://www.revlon.com/collections/new
 * Generated: 2026-05-13
 *
 * Two-column collection hero: H1 collection name + description paragraph on the left,
 * feature collection image on the right.
 * Selectors: .custom-content, [id*='advanced_content'] .custom-content
 */
export default function parse(element, { document }) {
  // Extract the collection heading (H1) from the copy area
  // Validated selectors from source.html:
  //   .copy-area h1 (line 6: <h1>New</h1>)
  //   Fallback: .type-banner__text h1, h1, h2 (heading level may vary)
  const heading = element.querySelector('.copy-area h1')
    || element.querySelector('.type-banner__text h1')
    || element.querySelector('h1')
    || element.querySelector('h2');

  // Extract the description paragraph from the metafield rich text
  // Validated selectors from source.html:
  //   .metafield-rich_text_field p (line 8: <p>Check out the newest...</p>)
  //   Fallback: .copy-area p, .type-banner__text p (in case markup varies)
  const description = element.querySelector('.metafield-rich_text_field p')
    || element.querySelector('.copy-area p')
    || element.querySelector('.type-banner__text p');

  // Extract the feature image from the image wrapper
  // Validated selectors from source.html:
  //   .custom__item-image-wrapper img (line 19: <img src="..." alt="New">)
  //   Fallback: image-element img, .image-wrap img, img
  const image = element.querySelector('.custom__item-image-wrapper img')
    || element.querySelector('image-element img')
    || element.querySelector('.image-wrap img')
    || element.querySelector('img');

  // Build cells to match library-example.md:
  // Single content row with 2 cells: [heading + description] | [image]
  const cell1 = [];
  if (heading) {
    cell1.push(heading);
  }
  if (description) {
    cell1.push(description);
  }

  const cell2 = [];
  if (image) {
    cell2.push(image);
  }

  const cells = [
    [cell1, cell2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-collection', cells });
  element.replaceWith(block);
}
