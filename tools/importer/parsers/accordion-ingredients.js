/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-ingredients
 * Base block: accordion
 * Source: https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula
 * Selector: #shopify-section-template--18078936301763__ingredients_NziJzt
 * Generated: 2026-05-12
 *
 * Extracts product ingredients from an expandable accordion section.
 * Heading serves as the accordion trigger, full ingredients text as collapsible content.
 */
export default function parse(element, { document }) {
  // Extract heading (accordion trigger)
  const heading = element.querySelector('h2.ingredients-section__header, h2, h3, [class*="header"]');

  // Extract full ingredients content (prefer full over truncated)
  const fullContent = element.querySelector('.ingredients-section__content--full, .js-ingredients-content-section-full, [class*="content--full"]');
  const truncatedContent = element.querySelector('.ingredients-section__content--truncated, .js-ingredients-content-section-truncated, [class*="content--truncated"]');

  // Use full content if available, fall back to truncated
  const ingredientsContent = fullContent || truncatedContent;

  // Build cells to match block library structure:
  // Row 1: [heading trigger] | [collapsible content]
  const cells = [];

  const headingCell = [];
  if (heading) {
    headingCell.push(heading);
  }

  const contentCell = [];
  if (ingredientsContent) {
    // Create a paragraph with the text content to produce clean output
    const p = document.createElement('p');
    p.textContent = ingredientsContent.textContent.trim();
    contentCell.push(p);
  }

  cells.push([headingCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-ingredients', cells });
  element.replaceWith(block);
}
