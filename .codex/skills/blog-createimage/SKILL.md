---
name: blog-createimage
description: Create image concepts, prompts, asset plans, and generated raster image guidance for Future CX blog articles. Use when Codex is asked to create or plan hero images, article thumbnails, Open Graph images, visual directions, prompt variants, or image assets for content/*.html pages about ecommerce, customer experience, enterprise architecture, integration, composable architecture, CRM, data, AI, or technology selection.
---

# Blog Create Image

## Workflow

1. Determine the image purpose: article hero, `content.html` card thumbnail, Open Graph/Twitter preview, inline diagram, or supporting visual.
2. Read the article title, draft, brief, or target `content/*.html` page. If the article page already exists, inspect current image references and nearby article image patterns.
3. Read `.codex/instructions/DESIGN.md` and `references/blog-image-guide.md` before creating or proposing final image assets.
4. Choose a visual direction that fits Future CX: professional, architecture-aware, customer-experience oriented, practical, and not decorative-only.
5. When a new bitmap image is needed, use the system `imagegen` skill/tool. Generate raster imagery rather than SVG unless the request is specifically for a diagram or code-native asset.
6. Propose or use a stable filename under `assets/img/blog/single/`, usually based on the article slug.
7. Plan required variants when the target page template references them, such as base `.webp`, `-m.webp`, and `-s.webp`.
8. Align image usage with `$blog-createhtml`: absolute production URL for `og:image`/`twitter:image`, root-relative `/assets/...` paths in `content/*.html`, and matching `content.html` card image.
9. Report any required post-processing that was not completed, such as conversion to WebP, resizing, compression, or adding responsive variants.
10. Recommend `$validate-page` after adding image references to HTML.

## Visual Direction

- Prefer clear scenes that imply architecture, platforms, journeys, capability maps, integration, product delivery, or ecommerce operations.
- Use professional environments, diagrams on boards, teams working with architecture artifacts, platform maps, retail/customer journey contexts, or abstracted system landscapes.
- Keep brand fit: clean, credible, structured, restrained, and businesslike.
- Avoid generic stock-photo gestures, dark blurry backgrounds, decorative blobs, neon cyberpunk, exaggerated futurism, and visuals unrelated to the article topic.
- Do not include fake UI text, unreadable labels, made-up vendor logos, or copyrighted brand marks unless the user provides them and usage is appropriate.

## Output Shape

For image planning requests, provide:

1. Recommended image concept.
2. Generation prompt.
3. Negative prompt or avoidance notes.
4. Filename and target path.
5. Required dimensions or variants.
6. HTML metadata usage notes.

For generation requests, provide the generated asset path or clearly state what was generated and what still needs manual processing.

## Asset Rules

- Store article images in `assets/img/blog/single/`.
- Use lowercase, hyphenated filenames.
- Prefer `.webp` for final article/OG images when available; keep source `.png` or `.jpg` only when useful.
- Use article slug prefixes where possible, for example `future-state-architecture-platform-map.webp`.
- Do not overwrite an existing image unless the user explicitly asks for replacement.
- Check existing filenames before proposing a new one.
- If the page uses responsive hero preloads, keep variants consistent: base, `-m`, and `-s`.

## References

Read `references/blog-image-guide.md` when creating a new image prompt, selecting image style, naming assets, planning responsive variants, or adding image metadata to article pages.
