/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category variant.
 * Base block: cards
 * Source: https://www.revlon.com/
 * Generated: 2026-05-09
 *
 * Extracts category navigation cards from a featured categories carousel.
 * Each card has an image and a linked category name.
 * Target table: one row per category with 2 cells [image | linked name].
 */
export default function parse(element, { document }) {
  // Select all category items from the carousel
  const items = element.querySelectorAll('.featured-categories-carousel__item');

  const cells = [];

  items.forEach((item) => {
    // Extract the link wrapping the item
    const link = item.querySelector('.featured-categories-carousel__item-link');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // Extract the category image
    const img = item.querySelector('.featured-categories-carousel__item-image');

    // Extract the category title text from the title span
    // Prefer the <p> inside the title span (consistent pattern), fall back to full text
    const titleEl = item.querySelector('.featured-categories-carousel__item-title');
    const titleP = titleEl ? titleEl.querySelector('p') : null;
    const titleText = titleP ? titleP.textContent.trim() : (titleEl ? titleEl.textContent.trim() : '');

    // Build image cell - clone the image element if present
    const imageCell = [];
    if (img) {
      const imgClone = img.cloneNode(true);
      imageCell.push(imgClone);
    }

    // Build link cell - create an anchor with the category name
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', href);
    linkEl.textContent = titleText;

    // Each row has 2 cells: [image, linked category name]
    cells.push([imageCell, linkEl]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
