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

  // tools/importer/import-product.js
  var import_product_exports = {};
  __export(import_product_exports, {
    default: () => import_product_default
  });

  // tools/importer/parsers/columns-product.js
  function parse(element, { document }) {
    var _a;
    const productImage = element.querySelector(".product-slideshow .photoswipe__image, .product__photos img, .product-image-main img.photoswipe__image");
    const title = element.querySelector('h1, h2, .product-single__title, .product__title, [class*="product-title"]');
    const priceEl = element.querySelector('.product__price, .price, [class*="product-price"], .money');
    const description = element.querySelector('.product-single__description, .product__description, .product-single__meta .rte, [class*="description"]');
    const ctaButton = element.querySelector('.btn--add-to-cart, .product-form__cart-submit, a.btn[href*="cart"], .product-single__meta a.btn, a[class*="add-to-cart"], .product-form button[type="submit"], .shopify-payment-button button');
    const leftCell = [];
    if (productImage) {
      const img = document.createElement("img");
      img.src = productImage.src || productImage.getAttribute("src") || "";
      img.alt = productImage.alt || productImage.getAttribute("alt") || "";
      leftCell.push(img);
    }
    const rightCell = [];
    if (title) {
      const strong = document.createElement("strong");
      strong.textContent = title.textContent.trim();
      rightCell.push(strong);
    }
    if (priceEl) {
      const priceText = document.createTextNode(priceEl.textContent.trim());
      rightCell.push(priceText);
    }
    if (description) {
      const desc = document.createElement("p");
      desc.textContent = description.textContent.trim();
      rightCell.push(desc);
    }
    if (ctaButton) {
      const link = document.createElement("a");
      link.href = ctaButton.href || ((_a = ctaButton.closest("a")) == null ? void 0 : _a.href) || "#";
      link.textContent = ctaButton.textContent.trim() || "Shop Now";
      rightCell.push(link);
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-detail.js
  function parse2(element, { document }) {
    const heading = element.querySelector('h2.additional-product-info__block, h2[class*="header"], h2, h3');
    const contentContainer = element.querySelector(".additional-product-info__content, .additional-product-info__split-layout > div:first-child");
    const imageContainer = element.querySelector(".additional-product-info__image img, .additional-product-info__split-layout img");
    const leftCell = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      leftCell.push(h2);
    }
    if (contentContainer) {
      const contentChildren = contentContainer.children;
      for (let i = 0; i < contentChildren.length; i++) {
        leftCell.push(contentChildren[i]);
      }
    }
    const rightCell = [];
    if (imageContainer) {
      rightCell.push(imageContainer);
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-detail", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-ingredients.js
  function parse3(element, { document }) {
    const heading = element.querySelector('h2.ingredients-section__header, h2, h3, [class*="header"]');
    const fullContent = element.querySelector('.ingredients-section__content--full, .js-ingredients-content-section-full, [class*="content--full"]');
    const truncatedContent = element.querySelector('.ingredients-section__content--truncated, .js-ingredients-content-section-truncated, [class*="content--truncated"]');
    const ingredientsContent = fullContent || truncatedContent;
    const cells = [];
    const headingCell = [];
    if (heading) {
      headingCell.push(heading);
    }
    const contentCell = [];
    if (ingredientsContent) {
      const p = document.createElement("p");
      p.textContent = ingredientsContent.textContent.trim();
      contentCell.push(p);
    }
    cells.push([headingCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-ingredients", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse4(element, { document }) {
    const productCards = Array.from(
      element.querySelectorAll('.grid-product, [class*="grid-product"][class*="product-grid-with-color"]')
    );
    const cells = [];
    productCards.forEach((card) => {
      const productLink = card.querySelector("a.grid-product__link");
      if (!productLink) return;
      const href = productLink.getAttribute("href") || "";
      const img = card.querySelector("img.grid-product__image, .grid-product__image-mask img");
      if (!img) return;
      const imgEl = document.createElement("img");
      imgEl.src = img.getAttribute("src") || "";
      imgEl.alt = (img.getAttribute("alt") || "").replace(/^#color_/, "");
      const titleEl = card.querySelector(".grid-product__title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const priceEl = card.querySelector(".grid-product__price, .js-product-price");
      const price = priceEl ? priceEl.textContent.trim() : "";
      const detailsContainer = document.createElement("div");
      if (title) {
        const titleNode = document.createElement("p");
        titleNode.textContent = title;
        detailsContainer.appendChild(titleNode);
      }
      if (price) {
        const priceNode = document.createElement("p");
        priceNode.textContent = price;
        detailsContainer.appendChild(priceNode);
      }
      if (href) {
        const linkEl = document.createElement("a");
        linkEl.href = href;
        linkEl.textContent = "Shop Now";
        detailsContainer.appendChild(linkEl);
      }
      cells.push([imgEl, detailsContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-reviews.js
  function parse5(element, { document }) {
    const yotpoWidget = element.querySelector(
      '[class*="yotpo-reviews"], [id*="yotpo-reviews"], [class*="yotpo"][class*="widget"], .yotpo'
    );
    const embedUrl = "https://yotpo.com/widget/product-reviews";
    const link = document.createElement("a");
    link.href = embedUrl;
    link.textContent = embedUrl;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-reviews", cells });
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

  // tools/importer/import-product.js
  var parsers = {
    "columns-product": parse,
    "columns-detail": parse2,
    "accordion-ingredients": parse3,
    "carousel-product": parse4,
    "embed-reviews": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "product",
    description: "Product detail page with product hero, description/details/how-to-use columns, ingredients accordion, product recommendations carousel, and reviews embed",
    urls: [
      "https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula"
    ],
    blocks: [
      {
        name: "columns-product",
        instances: [
          "#ProductSection-template--18078936301763__main-8040991654083",
          ".product-section"
        ]
      },
      {
        name: "columns-detail",
        instances: [
          "#shopify-section-template--18078936301763__btf_content_YyaQbK .additional-product-info",
          "#shopify-section-template--18078936301763__btf_content_kQbx6N .additional-product-info",
          "#shopify-section-template--18078936301763__btf_content_rVygkD .additional-product-info",
          ".additional-product-info"
        ]
      },
      {
        name: "accordion-ingredients",
        instances: [
          "#shopify-section-template--18078936301763__ingredients_NziJzt",
          ".ingredients-section"
        ]
      },
      {
        name: "carousel-product",
        instances: [
          "#shopify-section-template--18078936301763__revlon_product_recommendations_TayqKA",
          ".product-recommendations"
        ]
      },
      {
        name: "embed-reviews",
        instances: [
          "#shopify-section-template--18078936301763__17744660681e8ee571",
          '[class*="yotpo-main-widget"]',
          '[class*="yotpo-reviews"]'
        ]
      }
    ],
    sections: [
      {
        id: "section-1-product-hero",
        name: "Product Hero",
        selector: "#shopify-section-template--18078936301763__main",
        style: null,
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "section-2-description",
        name: "Description",
        selector: "#shopify-section-template--18078936301763__btf_content_YyaQbK",
        style: null,
        blocks: ["columns-detail"],
        defaultContent: []
      },
      {
        id: "section-3-details",
        name: "Details",
        selector: "#shopify-section-template--18078936301763__btf_content_kQbx6N",
        style: null,
        blocks: ["columns-detail"],
        defaultContent: []
      },
      {
        id: "section-4-how-to-use",
        name: "How To Use",
        selector: "#shopify-section-template--18078936301763__btf_content_rVygkD",
        style: null,
        blocks: ["columns-detail"],
        defaultContent: []
      },
      {
        id: "section-5-ingredients",
        name: "Ingredients",
        selector: "#shopify-section-template--18078936301763__ingredients_NziJzt",
        style: null,
        blocks: ["accordion-ingredients"],
        defaultContent: []
      },
      {
        id: "section-6-recommendations",
        name: "Recommendations",
        selector: "#shopify-section-template--18078936301763__revlon_product_recommendations_TayqKA",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-7-reviews",
        name: "Reviews",
        selector: "#shopify-section-template--18078936301763__17744660681e8ee571",
        style: null,
        blocks: ["embed-reviews"],
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
  var import_product_default = {
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
  return __toCommonJS(import_product_exports);
})();
