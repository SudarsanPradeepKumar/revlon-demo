# Product Page Migration Plan

**Source URL:** https://www.revlon.com/products/super-lustrous-lipstick-with-moisturizing-formula  
**Target:** AEM Edge Delivery Services (Document-based authoring)  
**Project Type:** doc  
**Date:** 2026-05-13

## Context

This is the first product page migration for the Revlon project. The project already has migrated templates for:
- Homepage (columns-promo, carousel-product, cards-category blocks)
- Blog listing (hero-banner, cards-blog blocks)
- Blog articles (columns-article block)

A product page is a new template type requiring new block variants and import infrastructure.

## Migration Steps

### Phase 1: Page Analysis
Analyze the product page to understand its structure, sections, blocks, and content patterns. This will produce:
- Page screenshot and cleaned HTML
- Section/block identification (e.g., product hero, variant swatches, description, reviews, related products)
- Authoring analysis JSON

### Phase 2: Block Mapping
Map identified content areas to EDS blocks. Likely blocks for a product page:
- **Product hero** — product images, title, price, variant selector, add-to-cart
- **Product details/description** — tabs or accordion with ingredients, description
- **Product swatches** — color variant grid
- **Related products carousel** — reuse existing `carousel-product` block
- **Reviews section** — customer reviews

New block variants will be created as needed; existing blocks (like `carousel-product`) will be reused where possible.

### Phase 3: Import Infrastructure
Generate the import tooling:
- Block parsers for each new block variant
- Page transformer (cleanup + sections) for product pages
- Update `page-templates.json` with the new `product` template

### Phase 4: Content Import
- Generate and bundle the import script
- Run the import against the source URL
- Verify imported HTML content renders correctly

### Phase 5: Design & Styling
- Extract design tokens from the original page (fonts, colors, spacing)
- Write CSS for each new block to match the original Revlon product page
- Verify visual fidelity in the local preview

### Phase 6: Verification
- Compare migrated page against original for visual accuracy
- Test responsive behavior (mobile, tablet, desktop)
- Run linting (`npm run lint`)
- Confirm page renders correctly in local dev server

## Checklist

- [ ] 1. Analyze the product page structure and identify sections/blocks
- [ ] 2. Map page content to EDS blocks (reuse existing + create new variants)
- [ ] 3. Create block parsers for new product page blocks
- [ ] 4. Create page transformer for product template
- [ ] 5. Update `page-templates.json` with product template definition
- [ ] 6. Generate and bundle the import script
- [ ] 7. Run content import for the product page URL
- [ ] 8. Verify imported content renders in preview
- [ ] 9. Style new blocks to match original Revlon product page design
- [ ] 10. Visual comparison and final QA

## Artifacts (Expected)

| Artifact | Path |
|----------|------|
| Page analysis | `migration-work/` (screenshots, cleaned HTML, JSON) |
| Page templates | `tools/importer/page-templates.json` (updated) |
| Block parsers | `tools/importer/parsers/*.js` (new product blocks) |
| Page transformer | `tools/importer/transformers/revlon-*.js` (updated) |
| Import script | `tools/importer/import-product.js` |
| Imported content | `content/products/super-lustrous-lipstick-with-moisturizing-formula.html` |
| Block CSS/JS | `blocks/<new-blocks>/*.css`, `*.js` |

## Notes

- This migration requires **Execute mode** to proceed with implementation.
- The product page is likely the most complex template on the Revlon site due to variant selectors, image galleries, and dynamic pricing — some interactive features may need to be simplified for static EDS authoring.
