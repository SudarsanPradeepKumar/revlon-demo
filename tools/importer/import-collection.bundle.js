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

  // tools/importer/import-collection.js
  var import_collection_exports = {};
  __export(import_collection_exports, {
    default: () => import_collection_default
  });

  // tools/importer/parsers/columns-collection.js
  function parse(element, { document }) {
    const heading = element.querySelector(".copy-area h1") || element.querySelector(".type-banner__text h1") || element.querySelector("h1") || element.querySelector("h2");
    const description = element.querySelector(".metafield-rich_text_field p") || element.querySelector(".copy-area p") || element.querySelector(".type-banner__text p");
    const image = element.querySelector(".custom__item-image-wrapper img") || element.querySelector("image-element img") || element.querySelector(".image-wrap img") || element.querySelector("img");
    const cell1 = [];
    if (heading) {
      cell1.push(heading);
    }
    if (description) {
      cell1.push(description);
    }
    const cell2 = [];
    if (image) {
      cell2.push(image);
    }
    const cells = [
      [cell1, cell2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-collection", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const productItems = element.querySelectorAll(".grid-product");
    const cells = [];
    productItems.forEach((item) => {
      const productLink = item.querySelector("a.grid-product__link");
      if (!productLink) return;
      const href = productLink.getAttribute("href") || "";
      const img = item.querySelector("img.grid-product__image, .grid-product__image-mask img");
      const col1 = [];
      if (img) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        const imgClone = img.cloneNode(true);
        link.appendChild(imgClone);
        col1.push(link);
      }
      const col2 = [];
      const titleEl = item.querySelector(".grid-product__title");
      if (titleEl) {
        const titleP = document.createElement("p");
        titleP.textContent = titleEl.textContent.trim();
        col2.push(titleP);
      }
      const shadesEl = item.querySelector(".grid-product__meta-shades");
      if (shadesEl && shadesEl.textContent.trim()) {
        const shadesP = document.createElement("p");
        shadesP.textContent = shadesEl.textContent.trim();
        col2.push(shadesP);
      }
      const priceEl = item.querySelector(".grid-product__price, .js-product-price");
      if (priceEl) {
        const priceP = document.createElement("p");
        priceP.textContent = priceEl.textContent.trim();
        col2.push(priceP);
      }
      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
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
      const emptyAdditionalInfoSections = element.querySelectorAll('[id*="additional_product_info"]');
      emptyAdditionalInfoSections.forEach((section) => {
        const inner = section.querySelector("section.additional-product-info");
        if (inner && !inner.textContent.trim()) {
          section.remove();
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

  // tools/importer/import-collection.js
  var parsers = {
    "columns-collection": parse,
    "cards-product": parse2
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "collection",
    description: "Collection/PLP page with collection hero and product listing card grid",
    urls: [
      "https://www.revlon.com/collections/new"
    ],
    blocks: [
      {
        name: "columns-collection",
        instances: [
          ".custom-content",
          "[id*='advanced_content'] .custom-content"
        ]
      },
      {
        name: "cards-product",
        instances: [
          ".collection-grid__wrapper",
          "[id*='main-collection'] .collection-grid__wrapper"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-collection-hero",
        name: "Collection Hero",
        selector: [
          "[id*='advanced_content']",
          ".custom-content"
        ],
        style: null,
        blocks: ["columns-collection"],
        defaultContent: []
      },
      {
        id: "section-2-product-grid",
        name: "Product Grid",
        selector: [
          "[id*='main-collection']",
          ".collection-grid__wrapper"
        ],
        style: null,
        blocks: ["cards-product"],
        defaultContent: []
      }
    ]
  };
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
    const matched = /* @__PURE__ */ new Set();
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
                section: blockDef.section || null
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
  var import_collection_default = {
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
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_collection_exports);
})();
