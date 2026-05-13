/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-reviews
 * Base block: embed
 * Source: https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula
 * Generated: 2026-05-12
 *
 * Extracts the Yotpo reviews widget reference from the product page and creates
 * an Embed block with the Yotpo widget URL for customer reviews integration.
 */
export default function parse(element, { document }) {
  // Detect the Yotpo reviews widget by known selectors
  const yotpoWidget = element.querySelector(
    '[class*="yotpo-reviews"], [id*="yotpo-reviews"], [class*="yotpo"][class*="widget"], .yotpo'
  );

  // Build the embed URL reference for the Yotpo reviews widget
  // The source HTML is a rendered widget; we output the canonical embed URL
  const embedUrl = 'https://yotpo.com/widget/product-reviews';

  // Create a link element for the embed cell (preserves semantic HTML)
  const link = document.createElement('a');
  link.href = embedUrl;
  link.textContent = embedUrl;

  // Build cells matching library example: single row with the embed URL
  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-reviews', cells });
  element.replaceWith(block);
}
