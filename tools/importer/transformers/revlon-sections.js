/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Revlon section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Uses section selectors from payload.template.sections (page-templates.json).
 * All selectors verified against captured DOM of https://www.revlon.com/
 *
 * Sections (from page-templates.json):
 * 1. Hero Promo: #shopify-section-template--18078934728899__promo_grid_tNppGd (no style)
 * 2. Best Sellers: #shopify-section-template--18078934728899__featured_collection_zxqLjV (no style)
 * 3. Spring Lip Fling: #shopify-section-template--18078934728899__promo_grid_bxaKpX (no style)
 * 4. New Arrivals: #shopify-section-template--18078934728899__featured_collection_eycLYD (no style)
 * 5. Divider: #shopify-section-template--18078934728899__section_divider_XNg7MK (no style)
 * 6. Featured Categories: #shopify-section-template--18078934728899__featured_categories_carousel_XP8c9X (no style)
 * 7. Newsletter: #shopify-section-sections--18078936793283__187f0ef1-a332-4e4a-8a0c-8079fac83a6b (style: dark)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Handle selector as string or array (array selectors join as comma-separated CSS)
      const selector = Array.isArray(section.selector)
        ? section.selector.join(',')
        : section.selector;
      const sectionEl = element.querySelector(selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before non-first sections to create section breaks
      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
