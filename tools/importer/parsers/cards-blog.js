/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blog variant.
 * Base block: cards
 * Source: https://www.revlon.com/blogs/news, https://www.revlon.com/blogs/makeup
 * Selector: .grid.grid--uniform
 *
 * Source DOM structure:
 *   div.grid.grid--uniform
 *     > div.grid__item.medium-up--one-third  (repeated per article)
 *         > div.grid
 *             > div.grid__item.small--one-third
 *                 > a.article__grid-image > .image-wrap > .grid__image-ratio > image-element > img
 *             > div.grid__item.small--two-thirds
 *                 > div.article__grid-meta
 *                     > a.article__title (linked title)
 *                     > div.article__excerpt (optional, not used in output)
 *
 * Target table: Cards Blog
 *   Row per article: [ image, linked title ]
 */
export default function parse(element, { document }) {
  // Select all article grid items (direct children of the uniform grid)
  const articleItems = element.querySelectorAll(':scope > .grid__item');

  const cells = [];

  articleItems.forEach((item) => {
    // Extract the article image
    const imgEl = item.querySelector('a.article__grid-image img, .article__grid-image img, img');

    // Extract the article title link
    const titleLink = item.querySelector('a.article__title, .article__grid-meta a');

    if (!titleLink) return; // skip items without a title link

    // Build image cell: clone the image or create a placeholder
    const imageCell = [];
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.push(img);
    }

    // Build title cell: create a link with the article title
    const link = document.createElement('a');
    link.href = titleLink.href;
    link.textContent = titleLink.textContent.trim();
    const titleCell = [link];

    cells.push([imageCell, titleCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
