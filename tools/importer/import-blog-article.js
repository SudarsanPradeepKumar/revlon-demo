/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsArticleParser from './parsers/columns-article.js';

// TRANSFORMER IMPORTS
import revlonCleanupTransformer from './transformers/revlon-cleanup.js';
import revlonSectionsTransformer from './transformers/revlon-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-article': columnsArticleParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'Blog article page with article hero, body content, and back navigation.',
  urls: ['https://www.revlon.com/blogs/makeup/trending-prom-makeup-looks'],
  blocks: [
    {
      name: 'columns-article',
      instances: ['.custom-content'],
    },
  ],
  sections: [
    {
      id: 'section-1-article-hero',
      name: 'Article Hero',
      selector: ['.custom-content', "[class*='advanced_content']"],
      style: null,
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'section-2-article-body',
      name: 'Article Body',
      selector: ['.article__body', "[id*='__main']"],
      style: null,
      blocks: [],
      defaultContent: ['.article__body'],
    },
    {
      id: 'section-3-back-nav',
      name: 'Back Navigation',
      selector: '.article__back-to-blog',
      style: null,
      blocks: [],
      defaultContent: ['.article__back-to-blog a'],
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
