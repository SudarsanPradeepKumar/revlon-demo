/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsBlogParser from './parsers/cards-blog.js';

// TRANSFORMER IMPORTS
import revlonCleanupTransformer from './transformers/revlon-cleanup.js';
import revlonSectionsTransformer from './transformers/revlon-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-blog': cardsBlogParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'blog-listing',
  description: 'Blog listing page with hero banner, intro text, and article cards grid. Used for /blogs/* pages.',
  urls: [
    'https://www.revlon.com/blogs/news',
    'https://www.revlon.com/blogs/makeup',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.background-media-text'],
    },
    {
      name: 'cards-blog',
      instances: ['.grid.grid--uniform'],
    },
  ],
  sections: [
    {
      id: 'section-1-page-title',
      name: 'Page Title',
      selector: '.section-primary-heading',
      style: null,
      blocks: [],
      defaultContent: ['.section-primary-heading__heading'],
    },
    {
      id: 'section-2-hero-banner',
      name: 'Hero Banner',
      selector: ['.background-media-text', "[class*='background_image_text']"],
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-3-intro-text',
      name: 'Intro Text',
      selector: ['.richtext-top-margin', "[class*='rich_text']"],
      style: null,
      blocks: [],
      defaultContent: ['.rte .enlarge-text p'],
    },
    {
      id: 'section-4-article-grid',
      name: 'Article Grid',
      selector: ['.grid.grid--uniform', "[id*='__main']"],
      style: null,
      blocks: ['cards-blog'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  revlonCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [revlonSectionsTransformer] : []),
];

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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
