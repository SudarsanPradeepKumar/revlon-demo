/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsProductParser from './parsers/columns-product.js';
import columnsDetailParser from './parsers/columns-detail.js';
import accordionIngredientsParser from './parsers/accordion-ingredients.js';
import carouselProductParser from './parsers/carousel-product.js';
import embedReviewsParser from './parsers/embed-reviews.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/revlon-cleanup.js';
import sectionsTransformer from './transformers/revlon-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-product': columnsProductParser,
  'columns-detail': columnsDetailParser,
  'accordion-ingredients': accordionIngredientsParser,
  'carousel-product': carouselProductParser,
  'embed-reviews': embedReviewsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product',
  description: 'Product detail page with product hero, description/details/how-to-use columns, ingredients accordion, product recommendations carousel, and reviews embed',
  urls: [
    'https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula',
  ],
  blocks: [
    {
      name: 'columns-product',
      instances: [
        '#ProductSection-template--18078936301763__main-8040991654083',
        '.product-section',
      ],
    },
    {
      name: 'columns-detail',
      instances: [
        '#shopify-section-template--18078936301763__btf_content_YyaQbK .additional-product-info',
        '#shopify-section-template--18078936301763__btf_content_kQbx6N .additional-product-info',
        '#shopify-section-template--18078936301763__btf_content_rVygkD .additional-product-info',
        '.additional-product-info',
      ],
    },
    {
      name: 'accordion-ingredients',
      instances: [
        '#shopify-section-template--18078936301763__ingredients_NziJzt',
        '.ingredients-section',
      ],
    },
    {
      name: 'carousel-product',
      instances: [
        '#shopify-section-template--18078936301763__revlon_product_recommendations_TayqKA',
        '.product-recommendations',
      ],
    },
    {
      name: 'embed-reviews',
      instances: [
        '#shopify-section-template--18078936301763__17744660681e8ee571',
        '[class*="yotpo-main-widget"]',
        '[class*="yotpo-reviews"]',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-product-hero',
      name: 'Product Hero',
      selector: '#shopify-section-template--18078936301763__main',
      style: null,
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'section-2-description',
      name: 'Description',
      selector: '#shopify-section-template--18078936301763__btf_content_YyaQbK',
      style: null,
      blocks: ['columns-detail'],
      defaultContent: [],
    },
    {
      id: 'section-3-details',
      name: 'Details',
      selector: '#shopify-section-template--18078936301763__btf_content_kQbx6N',
      style: null,
      blocks: ['columns-detail'],
      defaultContent: [],
    },
    {
      id: 'section-4-how-to-use',
      name: 'How To Use',
      selector: '#shopify-section-template--18078936301763__btf_content_rVygkD',
      style: null,
      blocks: ['columns-detail'],
      defaultContent: [],
    },
    {
      id: 'section-5-ingredients',
      name: 'Ingredients',
      selector: '#shopify-section-template--18078936301763__ingredients_NziJzt',
      style: null,
      blocks: ['accordion-ingredients'],
      defaultContent: [],
    },
    {
      id: 'section-6-recommendations',
      name: 'Recommendations',
      selector: '#shopify-section-template--18078936301763__revlon_product_recommendations_TayqKA',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-7-reviews',
      name: 'Reviews',
      selector: '#shopify-section-template--18078936301763__17744660681e8ee571',
      style: null,
      blocks: ['embed-reviews'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const matched = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          const key = element.tagName + element.className + element.id;
          if (!matched.has(key)) {
            matched.add(key);
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null,
            });
          }
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
