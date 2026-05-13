/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-detail
 * Base block: columns
 * Source: https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula
 * Generated: 2026-05-12
 *
 * Two-column layout: left has heading + text/list content, right has supporting image.
 * Used for product description, details, and how-to-use sections.
 *
 * Source structure:
 *   section.additional-product-info
 *     h2.additional-product-info__block (heading)
 *     div.additional-product-info__split-layout
 *       div.additional-product-info__content (text/list content)
 *       div.additional-product-info__image > img
 */
export default function parse(element, { document }) {
  // Extract heading - h2 with class additional-product-info__block
  const heading = element.querySelector('h2.additional-product-info__block, h2[class*="header"], h2, h3');

  // Extract text/list content from the left column
  const contentContainer = element.querySelector('.additional-product-info__content, .additional-product-info__split-layout > div:first-child');

  // Extract image from the right column
  const imageContainer = element.querySelector('.additional-product-info__image img, .additional-product-info__split-layout img');

  // Build left cell: heading + content elements
  const leftCell = [];

  if (heading) {
    // Create an h2 element for the block table
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    leftCell.push(h2);
  }

  if (contentContainer) {
    // Get all direct children of the content container (ul, p, div elements)
    const contentChildren = contentContainer.children;
    for (let i = 0; i < contentChildren.length; i++) {
      leftCell.push(contentChildren[i]);
    }
  }

  // Build right cell: image
  const rightCell = [];
  if (imageContainer) {
    rightCell.push(imageContainer);
  }

  // Build cells array: single row with two columns [left content | right image]
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-detail', cells });
  element.replaceWith(block);
}
