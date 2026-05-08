# Future CX Blog Image Guide

Use this guide for Future CX article hero images, overview thumbnails, Open Graph images, and supporting article visuals.

## Site Patterns

- Main article images live in `assets/img/blog/single/`.
- Use article-slug-based names for the filename.
- The primary website image should be `.webp` when available.
- Also keep or export a same-basename `.png` or `.jpg` version for LinkedIn and similar social posting workflows.
- Some hero templates preload responsive variants:
  - `example-s.webp`
  - `example-m.webp`
  - `example.webp`
- Article pages use `/assets/img/blog/single/...` paths.
- Open Graph and Twitter metadata use absolute URLs under `https://www.futurecx.nl/assets/img/blog/single/...`.

## Recommended Dimensions

- Open Graph / social preview: 1200 x 630.
- LinkedIn/social posting export: 1200 x 630 `.png` or `.jpg`, using the same crop as the article Open Graph image where possible.
- Article hero source: at least 1200 px wide; 1920 px wide is useful for full-width hero pages.
- Overview card image: crop-safe around 4:3 or 16:9, depending on the existing card layout.
- Responsive variants, when needed:
  - small: approximately 480 px wide
  - medium: approximately 800 px wide
  - base/large: 1200-1920 px wide

Do not invent exact image dimensions in metadata if they are not known. Inspect the file or use a reliable tool before adding width/height claims.

## Future CX Visual Themes

Good directions:

- solution architect reviewing a capability map
- ecommerce platform landscape on a wall or board
- customer journey and technology architecture connected visually
- integration flows between systems shown as clean abstract lines
- composable architecture as modular platform blocks
- product team planning a roadmap with architecture context
- marketplace ecosystem with partners, products, and customer touchpoints
- data/AI orchestration shown as structured operational flows

Use realistic or polished editorial styles. Keep the composition bright enough for article cards and social previews.

## Prompt Pattern

Use this prompt structure for generated bitmap images:

```text
Create a professional editorial image for a Future CX article about [topic].
Scene: [specific business/architecture/customer experience scene].
Composition: [wide 16:9 or 1200x630 crop-safe], clear focal point, room for headline-safe cropping, no embedded readable text.
Style: credible consulting website, clean modern workspace, structured architecture artifacts, warm neutral lighting, restrained color palette with subtle yellow accents.
Avoid: logos, brand names, fake UI text, unreadable text, exaggerated futurism, neon cyberpunk, decorative blobs, stock-photo clichés.
```

Adjust the scene to the article. The prompt should make the actual topic visible, not just create a generic technology mood.

## Negative Guidance

Avoid:

- generic glowing network backgrounds
- fake dashboards with unreadable text
- humanoid robots unless the article is explicitly about robotics
- oversized abstract AI brains
- random city skylines
- pure gradients or decorative shapes as the main image
- dark, low-contrast images that obscure the subject
- vendor logos, trademarks, or screenshots unless provided and approved

## Naming

Use clear filenames:

- `article-slug.webp`
- `article-slug.png` or `article-slug.jpg` for social posting
- `article-slug-s.webp`
- `article-slug-m.webp`
- `article-slug-diagram.png`

Examples:

- `composable-commerce-capability-map.webp`
- `integration-principles-system-flow.webp`
- `rfp-open-questions-context.webp`

## HTML Integration Checklist

When the image is used in an article page:

- Update `og:image` and `twitter:image` to the absolute production URL.
- Update preloads if the template uses image preload tags.
- Update inline hero/background image CSS if present.
- Update visible `<img>` `src` and `alt` text when image tags are used.
- Update `content.html` overview card background image if the page is listed there.
- Keep `og:image:width` and `og:image:height` accurate if present.
- Check dark mode readability if text overlays the image.

## Post-Processing Notes

This repo does not define a dedicated image conversion NPM script. If conversion, resizing, or compression is required, use available local tools only when present and approved by the environment. Otherwise report the needed asset work clearly.

Do not claim conversion or optimization happened unless it was actually performed.

For newly generated article hero images, the expected output set is:

- Main website image: `assets/img/blog/single/article-slug.webp`
- Optional responsive website variants when the template needs them: `article-slug-m.webp` and `article-slug-s.webp`
- Social sharing export: `assets/img/blog/single/article-slug.png` or `assets/img/blog/single/article-slug.jpg`
