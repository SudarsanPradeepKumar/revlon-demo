/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product.
 * Base block: cards.
 * Source: https://www.revlon.com/collections/new
 * Generated: 2026-05-13
 *
 * Extracts product cards from a collection grid (.collection-grid__wrapper).
 * Each product card contains a linked product image, product title,
 * optional shade count, and price.
 *
 * Source selectors (validated against live page):
 * - Container: .collection-grid__wrapper
 * - Product items: .grid-product (15 items on live page)
 * - Product link: a.grid-product__link
 * - Product image: img.grid-product__image
 * - Product title: .grid-product__title
 * - Shade count: .grid-product__meta-shades (optional, not all products have shades)
 * - Price: .grid-product__price
 *
 * Target table: Cards Product
 *   One row per product: [linked image | title + shade count + price]
 */
export default function parse(element, { document }) {
  // Find all product card items in the grid
  const productItems = element.querySelectorAll('.grid-product');

  const cells = [];

  productItems.forEach((item) => {
    // Extract the product link (wraps image and meta)
    const productLink = item.querySelector('a.grid-product__link');
    if (!productLink) return;

    const href = productLink.getAttribute('href') || '';

    // Column 1: Product image wrapped in a link to the product page
    const img = item.querySelector('img.grid-product__image, .grid-product__image-mask img');
    const col1 = [];
    if (img) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      const imgClone = img.cloneNode(true);
      link.appendChild(imgClone);
      col1.push(link);
    }

    // Column 2: Product title, shade count (optional), and price as text lines
    const col2 = [];

    const titleEl = item.querySelector('.grid-product__title');
    if (titleEl) {
      const titleP = document.createElement('p');
      titleP.textContent = titleEl.textContent.trim();
      col2.push(titleP);
    }

    // Shade count is optional (e.g. single-SKU products like conditioner don't have it)
    const shadesEl = item.querySelector('.grid-product__meta-shades');
    if (shadesEl && shadesEl.textContent.trim()) {
      const shadesP = document.createElement('p');
      shadesP.textContent = shadesEl.textContent.trim();
      col2.push(shadesP);
    }

    const priceEl = item.querySelector('.grid-product__price, .js-product-price');
    if (priceEl) {
      const priceP = document.createElement('p');
      priceP.textContent = priceEl.textContent.trim();
      col2.push(priceP);
    }

    // Only add the row if we have meaningful content
    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
