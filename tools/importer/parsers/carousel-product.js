/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product variant.
 * Base block: carousel
 * Source: https://www.revlon.com/ (Revlon homepage product carousels)
 * Generated: 2026-05-09
 *
 * Extracts product cards from a Shopify featured-collection carousel (Flickity slider)
 * and outputs a Carousel block table with one row per product.
 * Each row has 2 cells: product image | product name + price + link.
 */
export default function parse(element, { document }) {
  // Find all product card items in the flickity slider or grid
  const productCards = Array.from(
    element.querySelectorAll('.grid-product, [class*="grid-product"][class*="product-grid-with-color"]')
  );

  const cells = [];

  productCards.forEach((card) => {
    // Extract the product link element (wraps image and meta)
    const productLink = card.querySelector('a.grid-product__link');
    if (!productLink) return;

    const href = productLink.getAttribute('href') || '';

    // Extract the primary product image
    const img = card.querySelector('img.grid-product__image, .grid-product__image-mask img');
    if (!img) return;

    // Clone the image for the first cell
    const imgEl = document.createElement('img');
    imgEl.src = img.getAttribute('src') || '';
    imgEl.alt = (img.getAttribute('alt') || '').replace(/^#color_/, '');

    // Extract product title
    const titleEl = card.querySelector('.grid-product__title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Extract product price
    const priceEl = card.querySelector('.grid-product__price, .js-product-price');
    const price = priceEl ? priceEl.textContent.trim() : '';

    // Build the details cell: product name, price, and link
    const detailsContainer = document.createElement('div');

    if (title) {
      const titleNode = document.createElement('p');
      titleNode.textContent = title;
      detailsContainer.appendChild(titleNode);
    }

    if (price) {
      const priceNode = document.createElement('p');
      priceNode.textContent = price;
      detailsContainer.appendChild(priceNode);
    }

    // Create the "Shop Now" link pointing to the product page
    if (href) {
      const linkEl = document.createElement('a');
      linkEl.href = href;
      linkEl.textContent = 'Shop Now';
      detailsContainer.appendChild(linkEl);
    }

    // Each row: [image cell, details cell]
    cells.push([imgEl, detailsContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
