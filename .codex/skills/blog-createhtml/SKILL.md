---
name: blog-createhtml
description: Create or update Future CX static blog article HTML pages under content/*.html from article drafts, briefs, Markdown, research output, or existing page requests. Use when Codex is asked to turn blog copy into a publishable HTML page, scaffold a new content article, align SEO/JSON-LD metadata, add an article to content.html, update related links, or prepare a Future CX article page for validation.
---

# Blog Create HTML

## Workflow

1. Determine the source material: finished article copy, `$blog-write` output, Markdown, research notes, YAML config, or an existing page to clone.
2. Use `content/blog-single.html` as the template.
3. Read `.codex/instructions/DESIGN.md`, `.codex/instructions/seo-instructions.md`, and `references/html-article-build-checklist.md` when creating a full page.
4. Define the page basics before editing: title, slug, canonical URL, meta description, category badges, image path, dates, article section, keywords, related articles, and whether `content.html` should link the page.
5. Create or edit the HTML surgically. Preserve Silicon Bootstrap structure, 2-space indentation, self-closing void tags, shared navbar/footer scripts, analytics, theme switcher, and local wrapping style.
6. Align visible content with metadata: `<title>`, canonical URL, Open Graph, Twitter card, JSON-LD, breadcrumb, H1, article intro, image URLs, and related links.
7. Use `/assets/...` paths inside `content/*.html`. Confirm proposed images exist or clearly mark missing image work in the final response.
8. Update `content.html` when the article should appear in the content overview. Match the existing card pattern and summary length.
9. Update `sitemap.xml` only when the repo convention or user request requires a manual sitemap entry; otherwise mention if the build task is expected to generate it.
10. Run `npm run validate` when feasible. Run `npm run build` when changing generated assets, sitemap output, build scripts, or shared structure.
11. Recommend `$validate-page` after substantial page creation or broad metadata changes.

## Scope Boundaries

- Use `$blog-write` first when the article copy itself still needs to be drafted, rewritten, or structured.
- Use `$research-topic` first when the article depends on current facts, trends, statistics, regulations, vendor capabilities, or external evidence.
- Use `$fact-check` before publication when the page includes source-backed claims, trend evidence, or vendor/product assertions.
- Use `$validate-page` for review-only tasks or final publication audits.

## Page Creation Rules

- Keep production URLs under `https://www.futurecx.nl`.
- Preserve author identity as `Martijn van Deel` and publisher identity as `Future CX` unless the user explicitly changes them.
- Use the article slug as the filename: `content/example-topic.html`.
- Keep internal links root-relative, for example `/content/integration-principles.html`.
- Make external links open in a new tab with `rel="noopener noreferrer"`.
- Keep category badges short and consistent with existing content.
- Do not remove analytics, JSON-LD, preloads, theme scripts, or shared footer/navigation unless the request explicitly targets them.
- When the page is new, set the creation date and modified date to the current date. When updating an existing page, preserve the creation date and update the modified date to the current date.
- Do not invent image dimensions, sources, statistics, or publication history.

## Output

For completed page work, report:

1. Created or changed files.
2. Whether `content.html` and `sitemap.xml` were updated.
3. Validation command and result.
4. Any publication blockers such as missing images, unverified claims, or dates that need confirmation.

## References

Read `references/html-article-build-checklist.md` when creating a new article page, converting draft copy to HTML, updating article metadata, adding overview cards, or checking publish readiness.
