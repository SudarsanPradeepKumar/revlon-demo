/* eslint-disable */
/* global WebImporter */

import columnsCollectionParser from './parsers/columns-collection.js';
import cardsProductParser from './parsers/cards-product.js';

import cleanupTransformer from './transformers/revlon-cleanup.js';
import sectionsTransformer from './transformers/revlon-sections.js';

const parsers = {
  'columns-collection': columnsCollectionParser,
  'cards-product': cardsProductParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'collection',
  description: 'Collection/PLP page with collection hero and product listing card grid',
  urls: [
    'https://www.revlon.com/collections/new',
  ],
  blocks: [
    {
      name: 'columns-collection',
      instances: [
        '.custom-content',
        "[id*='advanced_content'] .custom-content",
      ],
    },
    {
      name: 'cards-product',
      instances: [
        '.collection-grid__wrapper',
        "[id*='main-collection'] .collection-grid__wrapper",
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-collection-hero',
      name: 'Collection Hero',
      selector: [
        "[id*='advanced_content']",
        '.custom-content',
      ],
      style: null,
      blocks: ['columns-collection'],
      defaultContent: [],
    },
    {
      id: 'section-2-product-grid',
      name: 'Product Grid',
      selector: [
        "[id*='main-collection']",
        '.collection-grid__wrapper',
      ],
      style: null,
      blocks: ['cards-product'],
      defaultContent: [],
    },
  ],
};

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
