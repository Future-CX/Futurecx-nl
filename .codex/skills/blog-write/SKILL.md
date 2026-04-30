---
name: blog-write
description: Draft, rewrite, expand, or structure Future CX blog articles and article briefs for content/*.html pages. Use when Codex is asked to write blog content, create article outlines, turn research into publishable Future CX prose, improve article readability, prepare SEO titles/descriptions, or produce article copy for ecommerce, customer experience, enterprise architecture, integration, composable architecture, CRM, data, AI, or technology selection topics.
---

# Blog Write

## Workflow

1. Determine the requested output: outline, draft article, rewritten section, SEO metadata, HTML-ready article body, or content brief.
2. Read `.codex/instructions/DESIGN.md` for Future CX visual, content, tone, layout, image, and component guidance.
3. Read `.codex/instructions/seo-instructions.md` for article metadata, production URL, author identity, and date handling rules.
4. Read the provided topic, notes, sources, YAML config, research output, fact-check output, or existing page before writing.
5. If the request depends on current market facts, recent trends, statistics, legal/regulatory details, vendor claims, or source-backed evidence, use web research or `$research-topic` first. Do not invent sources, dates, quotes, numbers, or adoption claims.
6. Write in the Future CX voice: practical, direct, architecture-focused, customer-value oriented, and credible.
7. Structure the article for scanning: clear H1/H2/H3 hierarchy, short paragraphs, concrete examples, and practical guidance.
8. Align SEO metadata with the article promise: title, meta description, slug suggestion, keywords, category, and summary where requested.
9. If producing or editing HTML, preserve the site's Silicon Bootstrap structure, metadata conventions, author identity, asset path rules, and shared navigation/footer patterns.
10. For publishable or HTML-ready work, check against `references/article-writing-checklist.md`.
11. Recommend `$fact-check` before publication when the article uses external evidence, trend claims, vendor claims, statistics, or research summaries.
12. If files are edited, run `npm run validate` when feasible and report the result.

## Writing Standards

- Connect technology choices to customer experience, business value, delivery risk, and architecture tradeoffs.
- Prefer concrete verbs and specific nouns over generic transformation language.
- Explain architecture concepts without oversimplifying them.
- Use examples from ecommerce, composable platforms, integration, marketplaces, CRM, data, AI, and product delivery when relevant.
- Keep claims proportional to evidence. Mark uncertain or emerging claims as such.
- Avoid unsupported superlatives, hype, filler introductions, and vague recommendations.
- Preserve British English where nearby content uses it, but do not rewrite established page titles solely for spelling consistency.

## Article Shape

Use this structure unless the user provides another format:

1. Working title and SEO title.
2. Short meta description.
3. One-paragraph introduction that states the practical problem.
4. Main sections that explain the concept, decisions, tradeoffs, and implementation guidance.
5. Practical checklist, principles, or decision criteria where useful.
6. Conclusion with a clear takeaway, not a sales pitch.
7. Suggested category, tags, slug, internal links, and image direction when requested.

## HTML Page Guidance

When creating or editing `content/*.html`:

- Reuse an existing article page as the structural template.
- Keep production URLs under `https://www.futurecx.nl`.
- Preserve `Martijn van Deel` as author and `Future CX` as publisher unless the user asks otherwise.
- Align `<title>`, canonical URL, meta description, Open Graph fields, Twitter fields, JSON-LD, breadcrumbs, article heading, and visible article summary.
- Use `/assets/...` paths inside `content/*.html`.
- Add meaningful article categories as badges and preserve existing category wording where possible.
- Check whether `content.html`, `sitemap.xml`, and related article links should be updated.

## References

Always read:

- `.codex/instructions/DESIGN.md` before writing or revising article content, article structure, image direction, page sections, or HTML-ready copy.
- `.codex/instructions/seo-instructions.md` before preparing titles, descriptions, metadata, dates, canonical URLs, JSON-LD guidance, or HTML-ready copy.

Read `references/article-writing-checklist.md` when producing a full article, revising a page for publication, preparing SEO metadata, or converting research into publishable copy.
