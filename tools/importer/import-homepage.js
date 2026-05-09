/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsPromoParser from './parsers/columns-promo.js';
import carouselProductParser from './parsers/carousel-product.js';
import cardsCategoryParser from './parsers/cards-category.js';

// TRANSFORMER IMPORTS
import revlonCleanupTransformer from './transformers/revlon-cleanup.js';
import revlonSectionsTransformer from './transformers/revlon-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-promo': columnsPromoParser,
  'carousel-product': carouselProductParser,
  'cards-category': cardsCategoryParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Revlon homepage with hero promo, product carousels, category cards, and newsletter signup',
  urls: ['https://www.revlon.com/'],
  blocks: [
    {
      name: 'columns-promo',
      instances: [
        '#shopify-section-template--18078934728899__promo_grid_tNppGd .promo-grid',
        '#shopify-section-template--18078934728899__promo_grid_bxaKpX .promo-grid',
      ],
    },
    {
      name: 'carousel-product',
      instances: [
        '#CollectionSection-template--18078934728899__featured_collection_zxqLjV',
        '#CollectionSection-template--18078934728899__featured_collection_eycLYD',
      ],
    },
    {
      name: 'cards-category',
      instances: [
        '#template--18078934728899__featured_categories_carousel_XP8c9X',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero-promo',
      name: 'Hero Promo',
      selector: '#shopify-section-template--18078934728899__promo_grid_tNppGd',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2-best-sellers',
      name: 'Best Sellers',
      selector: '#shopify-section-template--18078934728899__featured_collection_zxqLjV',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [
        '#CollectionSection-template--18078934728899__featured_collection_zxqLjV .section-header__title',
        '#CollectionSection-template--18078934728899__featured_collection_zxqLjV .section-header .rte',
      ],
    },
    {
      id: 'section-3-spring-lip-fling',
      name: 'Spring Lip Fling Promo',
      selector: '#shopify-section-template--18078934728899__promo_grid_bxaKpX',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4-new-arrivals',
      name: 'New Arrivals',
      selector: '#shopify-section-template--18078934728899__featured_collection_eycLYD',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [
        '#CollectionSection-template--18078934728899__featured_collection_eycLYD .section-header__title',
        '#CollectionSection-template--18078934728899__featured_collection_eycLYD .section-header .rte',
        '#shopify-section-template--18078934728899__featured_collection_eycLYD a.btn',
      ],
    },
    {
      id: 'section-5-divider',
      name: 'Divider',
      selector: '#shopify-section-template--18078934728899__section_divider_XNg7MK',
      style: null,
      blocks: [],
      defaultContent: ['.section-divider hr'],
    },
    {
      id: 'section-6-featured-categories',
      name: 'Featured Categories',
      selector: '#shopify-section-template--18078934728899__featured_categories_carousel_XP8c9X',
      style: null,
      blocks: ['cards-category'],
      defaultContent: [],
    },
    {
      id: 'section-7-newsletter',
      name: 'Newsletter Signup',
      selector: '#shopify-section-sections--18078936793283__187f0ef1-a332-4e4a-8a0c-8079fac83a6b',
      style: 'dark',
      blocks: [],
      defaultContent: ['.newsletter-section .klaviyo-form-UY4rbm'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  revlonCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [revlonSectionsTransformer] : []),
];

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

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

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

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
