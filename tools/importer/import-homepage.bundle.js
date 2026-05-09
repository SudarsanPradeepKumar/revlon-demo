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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-promo.js
  function parse(element, { document }) {
    const gridItems = element.querySelectorAll(".flex-grid__item--50");
    const leftCol = gridItems[0];
    const mediaCell = [];
    if (leftCol) {
      const video = leftCol.querySelector("video");
      const img = leftCol.querySelector("img");
      if (video) {
        const source = video.querySelector("source");
        if (source && source.getAttribute("src")) {
          let videoSrc = source.getAttribute("src");
          if (videoSrc.startsWith("//")) {
            videoSrc = `https:${videoSrc}`;
          }
          const videoLink = document.createElement("a");
          videoLink.href = videoSrc;
          videoLink.textContent = videoSrc;
          mediaCell.push(videoLink);
        }
        const posterImg = video.querySelector("img");
        if (posterImg) {
          mediaCell.push(posterImg);
        }
      } else if (img) {
        mediaCell.push(img);
      }
    }
    const rightCol = gridItems[1];
    const contentCell = [];
    if (rightCol) {
      const bgImage = rightCol.querySelector(".promo-grid__bg img:not(.promo-grid__bg-image--mobile), .promo-grid__bg img");
      if (bgImage) {
        contentCell.push(bgImage);
      }
      const eyebrow = rightCol.querySelector(".subheading");
      if (eyebrow) {
        const strong = document.createElement("strong");
        strong.textContent = eyebrow.textContent.trim();
        contentCell.push(strong);
      }
      const heading = rightCol.querySelector("h2, .heading");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.innerHTML = heading.innerHTML;
        contentCell.push(h2);
      }
      const bodyText = rightCol.querySelector(".textarea, .rte--block.textarea");
      if (bodyText) {
        const p = document.createElement("p");
        p.innerHTML = bodyText.innerHTML;
        contentCell.push(p);
      }
      const ctaLinks = rightCol.querySelectorAll("a.btn, a.btn--primary, .promo-grid__content a[href]");
      ctaLinks.forEach((link) => {
        if (link.textContent.trim()) {
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href");
          a.textContent = link.textContent.trim();
          contentCell.push(a);
        }
      });
    }
    const cells = [
      [mediaCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/cards-category.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".featured-categories-carousel__item");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector(".featured-categories-carousel__item-link");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const img = item.querySelector(".featured-categories-carousel__item-image");
      const titleEl = item.querySelector(".featured-categories-carousel__item-title");
      const titleP = titleEl ? titleEl.querySelector("p") : null;
      const titleText = titleP ? titleP.textContent.trim() : titleEl ? titleEl.textContent.trim() : "";
      const imageCell = [];
      if (img) {
        const imgClone = img.cloneNode(true);
        imageCell.push(imgClone);
      }
      const linkEl = document.createElement("a");
      linkEl.setAttribute("href", href);
      linkEl.textContent = titleText;
      cells.push([imageCell, linkEl]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
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
        const sectionEl = element.querySelector(section.selector);
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

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-promo": parse,
    "carousel-product": parse2,
    "cards-category": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Revlon homepage with hero promo, product carousels, category cards, and newsletter signup",
    urls: ["https://www.revlon.com/"],
    blocks: [
      {
        name: "columns-promo",
        instances: [
          "#shopify-section-template--18078934728899__promo_grid_tNppGd .promo-grid",
          "#shopify-section-template--18078934728899__promo_grid_bxaKpX .promo-grid"
        ]
      },
      {
        name: "carousel-product",
        instances: [
          "#CollectionSection-template--18078934728899__featured_collection_zxqLjV",
          "#CollectionSection-template--18078934728899__featured_collection_eycLYD"
        ]
      },
      {
        name: "cards-category",
        instances: [
          "#template--18078934728899__featured_categories_carousel_XP8c9X"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero-promo",
        name: "Hero Promo",
        selector: "#shopify-section-template--18078934728899__promo_grid_tNppGd",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-2-best-sellers",
        name: "Best Sellers",
        selector: "#shopify-section-template--18078934728899__featured_collection_zxqLjV",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: [
          "#CollectionSection-template--18078934728899__featured_collection_zxqLjV .section-header__title",
          "#CollectionSection-template--18078934728899__featured_collection_zxqLjV .section-header .rte"
        ]
      },
      {
        id: "section-3-spring-lip-fling",
        name: "Spring Lip Fling Promo",
        selector: "#shopify-section-template--18078934728899__promo_grid_bxaKpX",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-4-new-arrivals",
        name: "New Arrivals",
        selector: "#shopify-section-template--18078934728899__featured_collection_eycLYD",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: [
          "#CollectionSection-template--18078934728899__featured_collection_eycLYD .section-header__title",
          "#CollectionSection-template--18078934728899__featured_collection_eycLYD .section-header .rte",
          "#shopify-section-template--18078934728899__featured_collection_eycLYD a.btn"
        ]
      },
      {
        id: "section-5-divider",
        name: "Divider",
        selector: "#shopify-section-template--18078934728899__section_divider_XNg7MK",
        style: null,
        blocks: [],
        defaultContent: [".section-divider hr"]
      },
      {
        id: "section-6-featured-categories",
        name: "Featured Categories",
        selector: "#shopify-section-template--18078934728899__featured_categories_carousel_XP8c9X",
        style: null,
        blocks: ["cards-category"],
        defaultContent: []
      },
      {
        id: "section-7-newsletter",
        name: "Newsletter Signup",
        selector: "#shopify-section-sections--18078936793283__187f0ef1-a332-4e4a-8a0c-8079fac83a6b",
        style: "dark",
        blocks: [],
        defaultContent: [".newsletter-section .klaviyo-form-UY4rbm"]
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
