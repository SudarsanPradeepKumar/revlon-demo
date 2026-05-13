/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-product
 * Base block: columns
 * Source: https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula
 * Generated: 2026-05-12
 *
 * Two-column product hero layout:
 *   Left cell: primary product image
 *   Right cell: product title, price, description, CTA
 */
export default function parse(element, { document }) {
  // --- LEFT COLUMN: Product Image ---
  // Extract the first/primary product image from the slideshow
  // Source HTML has .product-slideshow with multiple .product-main-slide > img.photoswipe__image
  const productImage = element.querySelector('.product-slideshow .photoswipe__image, .product__photos img, .product-image-main img.photoswipe__image');

  // --- RIGHT COLUMN: Product Info ---
  // Product title - Shopify product pages use h1 or .product-single__title
  const title = element.querySelector('h1, h2, .product-single__title, .product__title, [class*="product-title"]');

  // Product price - Shopify uses .product__price or spans with money class
  const priceEl = element.querySelector('.product__price, .price, [class*="product-price"], .money');

  // Product description - may be in .product-single__description or .product__description or .rte
  const description = element.querySelector('.product-single__description, .product__description, .product-single__meta .rte, [class*="description"]');

  // CTA button - add to cart or shop now link
  const ctaButton = element.querySelector('.btn--add-to-cart, .product-form__cart-submit, a.btn[href*="cart"], .product-single__meta a.btn, a[class*="add-to-cart"], .product-form button[type="submit"], .shopify-payment-button button');

  // --- Build cells to match library example ---
  // Library example: | image | title + price + CTA |
  // Single row with two cells (two-column layout)

  // Left cell: product image
  const leftCell = [];
  if (productImage) {
    // Clone the image to avoid side effects
    const img = document.createElement('img');
    img.src = productImage.src || productImage.getAttribute('src') || '';
    img.alt = productImage.alt || productImage.getAttribute('alt') || '';
    leftCell.push(img);
  }

  // Right cell: title + price + CTA
  const rightCell = [];

  if (title) {
    // Wrap title in strong/bold to match library example format
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    rightCell.push(strong);
  }

  if (priceEl) {
    const priceText = document.createTextNode(priceEl.textContent.trim());
    rightCell.push(priceText);
  }

  if (description) {
    const desc = document.createElement('p');
    desc.textContent = description.textContent.trim();
    rightCell.push(desc);
  }

  if (ctaButton) {
    const link = document.createElement('a');
    link.href = ctaButton.href || ctaButton.closest('a')?.href || '#';
    link.textContent = ctaButton.textContent.trim() || 'Shop Now';
    rightCell.push(link);
  }

  // Build cells array - single row with two columns
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product', cells });
  element.replaceWith(block);
}
