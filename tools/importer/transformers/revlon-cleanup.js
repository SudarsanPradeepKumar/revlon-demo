/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Revlon site-wide cleanup.
 * Removes non-authorable content (header, footer, navigation, drawers, modals,
 * cookie consent, Shopify widgets, Klaviyo popups, tracking iframes, etc.).
 * All selectors verified against captured DOM of https://www.revlon.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent banner (OneTrust) - found at #onetrust-consent-sdk
    // Remove modals that block parsing: external link popup, video modal, photoswipe gallery
    // Remove Klaviyo popup form (the floating signup modal, not the inline newsletter)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#ext_link_popup_hydU8W',
      '#VideoModal',
      '.pswp',
      '.kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .kl-private-reset-css-Xuajs1 > .klaviyo-close-form',
    ]);

    // Remove the floating Klaviyo popup (outside main content, after footer)
    const popupKlaviyo = element.querySelectorAll('.klaviyo-form-version-cid_12');
    popupKlaviyo.forEach((el) => {
      const parent = el.closest('.kl-private-reset-css-Xuajs1');
      if (parent && !parent.closest('#MainContent')) {
        parent.remove();
      }
    });
  }

  if (hookName === H.after) {
    // Remove header group: navigation drawer, site header, search
    // Found at: #shopify-section-sections--18078936826051__header (.shopify-section-group-header-group)
    WebImporter.DOMUtils.remove(element, [
      '.shopify-section-group-header-group',
      '#NavDrawer',
      '#CartDrawer',
    ]);

    // Remove footer group: newsletter section in footer-group and site footer
    // Found at: .shopify-section-group-footer-group
    WebImporter.DOMUtils.remove(element, [
      '.shopify-section-group-footer-group',
      'footer.site-footer',
    ]);

    // Remove skip link
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
    ]);

    // Remove product info modal (non-authorable overlay)
    // Found at: .product-info-modal.js-product-info-modal
    WebImporter.DOMUtils.remove(element, [
      '.product-info-modal',
    ]);

    // Remove Yotpo review widgets (third-party widget, not authorable)
    // Found at: .yotpo-widget-instance
    WebImporter.DOMUtils.remove(element, [
      '.yotpo-widget-instance',
    ]);

    // Remove tracking/analytics iframes and pixel containers
    // Found at: #web-pixels-manager-sandbox-container, doubleclick iframes
    WebImporter.DOMUtils.remove(element, [
      '#web-pixels-manager-sandbox-container',
      'iframe',
    ]);

    // Remove Shopify app blocks (empty or tracking-only)
    // Found at: .shopify-app-block (outside main content sections)
    const appBlocks = element.querySelectorAll('.shopify-app-block');
    appBlocks.forEach((block) => {
      // Only remove if block is empty or contains no visible text content
      if (!block.textContent.trim() || block.querySelector('[id*="social-widget"]')) {
        block.remove();
      }
    });

    // Remove empty additional-product-info placeholder sections (product pages)
    // Found at: #shopify-section-template--18078936301763__additional_product_info_ptAn3c,
    //           #shopify-section-template--18078936301763__additional_product_info_PqWCqd,
    //           #shopify-section-template--18078936301763__additional_product_info_qBNUKA
    // These are empty Shopify sections with no authorable content (just an empty <section> tag)
    const emptyAdditionalInfoSections = element.querySelectorAll('[id*="additional_product_info"]');
    emptyAdditionalInfoSections.forEach((section) => {
      const inner = section.querySelector('section.additional-product-info');
      if (inner && !inner.textContent.trim()) {
        section.remove();
      }
    });

    // Remove template elements (Shopify markup templates for JS rendering)
    // Found at: template#naturalImageMarkup, template#fixedRatioImageMarkup, template#articleImageMarkup
    WebImporter.DOMUtils.remove(element, [
      'template',
    ]);

    // Remove dynamic-react-root (empty Shopify container)
    WebImporter.DOMUtils.remove(element, [
      '#dynamic-react-root',
    ]);

    // Remove shop-cart-sync custom element
    WebImporter.DOMUtils.remove(element, [
      'shop-cart-sync',
    ]);

    // Remove tool-tip custom element
    WebImporter.DOMUtils.remove(element, [
      'tool-tip',
    ]);

    // Remove link elements (stylesheets already processed)
    WebImporter.DOMUtils.remove(element, [
      'link',
    ]);

    // Clean data attributes from all elements (tracking/shopify-specific)
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-aos-easing');
      el.removeAttribute('data-aos-duration');
      el.removeAttribute('data-aos-delay');
      el.removeAttribute('data-disable-animations');
      el.removeAttribute('data-center-text');
      el.removeAttribute('data-button_style');
      el.removeAttribute('data-type_header_capitalize');
      el.removeAttribute('data-type_headers_align_text');
      el.removeAttribute('data-type_product_capitalize');
      el.removeAttribute('data-swatch_style');
    });
  }
}
