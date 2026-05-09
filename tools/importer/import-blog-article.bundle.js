/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/columns-article.js
  function parse(element, { document }) {
    const heading = element.querySelector(".copy-area h2") || element.querySelector(".type-banner__text h2") || element.querySelector("h2") || element.querySelector("h1");
    const image = element.querySelector(".custom__item-image-wrapper img") || element.querySelector("image-element img") || element.querySelector(".image-wrap img") || element.querySelector("img");
    const cell1 = [];
    if (heading) {
      cell1.push(heading);
    }
    const cell2 = [];
    if (image) {
      cell2.push(image);
    }
    const cells = [
      [cell1, cell2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/revlon-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#ext_link_popup_hydU8W",
        "#VideoModal",
        ".pswp",
        ".kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .klaviyo-close-form"
      ]);
      const popupKlaviyo = element.querySelectorAll(".klaviyo-form-version-cid_12");
      popupKlaviyo.forEach((el) => {
        const parent = el.closest(".kl-private-reset-css-Xuajs1");
        if (parent && !parent.closest("#MainContent")) {
          parent.remove();
        }
      });
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".shopify-section-group-header-group",
        "#NavDrawer",
        "#CartDrawer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".shopify-section-group-footer-group",
        "footer.site-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".product-info-modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".yotpo-widget-instance"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#web-pixels-manager-sandbox-container",
        "iframe"
      ]);
      const appBlocks = element.querySelectorAll(".shopify-app-block");
      appBlocks.forEach((block) => {
        if (!block.textContent.trim() || block.querySelector('[id*="social-widget"]')) {
          block.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "template"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#dynamic-react-root"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "shop-cart-sync"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "tool-tip"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-aos-easing");
        el.removeAttribute("data-aos-duration");
        el.removeAttribute("data-aos-delay");
        el.removeAttribute("data-disable-animations");
        el.removeAttribute("data-center-text");
        el.removeAttribute("data-button_style");
        el.removeAttribute("data-type_header_capitalize");
        el.removeAttribute("data-type_headers_align_text");
        el.removeAttribute("data-type_product_capitalize");
        el.removeAttribute("data-swatch_style");
      });
    }
  }

  // tools/importer/transformers/revlon-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selector = Array.isArray(section.selector) ? section.selector.join(",") : section.selector;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        const isFirst = sections.indexOf(section) === 0;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-blog-article.js
  var parsers = {
    "columns-article": parse
  };
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "Blog article page with article hero, body content, and back navigation.",
    urls: ["https://www.revlon.com/blogs/makeup/trending-prom-makeup-looks"],
    blocks: [
      {
        name: "columns-article",
        instances: [".custom-content"]
      }
    ],
    sections: [
      {
        id: "section-1-article-hero",
        name: "Article Hero",
        selector: [".custom-content", "[class*='advanced_content']"],
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-2-article-body",
        name: "Article Body",
        selector: [".article__body", "[id*='__main']"],
        style: null,
        blocks: [],
        defaultContent: [".article__body"]
      },
      {
        id: "section-3-back-nav",
        name: "Back Navigation",
        selector: ".article__back-to-blog",
        style: null,
        blocks: [],
        defaultContent: [".article__back-to-blog a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_article_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_article_exports);
})();
