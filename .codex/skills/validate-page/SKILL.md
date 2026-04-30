---
name: validate-page
description: Review static HTML pages for this Future CX website for structure, SEO metadata, readability, accessibility, links, assets, JSON-LD, sitemap inclusion, and project conventions. Use when Codex is asked to validate, review, audit, improve, or edit HTML pages such as root *.html files or content/*.html article pages.
---

# Validate Page

## Workflow

1. Identify the page type:
   - Root page: `index.html`, `content.html`, `cv.html`, `404.html`, or another root `*.html`.
   - Content page: `content/*.html`.
2. Read the target HTML and nearby comparable pages before recommending structural changes.
3. Check page quality against `references/html-page-checklist.md`.
4. For review-only requests, report findings first, ordered by severity, with file and line references.
5. For edit requests, make small, surgical changes that preserve the existing Silicon Bootstrap structure, formatting, and asset conventions.
6. Validate after edits with `npm run validate` when available. Run `npm run build` when the change affects generated assets or site structure.
7. Mention any validation command that could not be run and why.

## Project Rules

- Preserve 2-space indentation, self-closing void tags such as `<meta ... />`, and local attribute wrapping style.
- Reuse existing Bootstrap/template components and nearby page patterns before introducing new markup.
- Do not replace hand-authored HTML with generated abstractions or template syntax.
- Keep analytics, theme scripts, JSON-LD, and existing JavaScript intact unless the task explicitly targets them.
- Preserve author identity as `Martijn van Deel` / `Future CX` unless the user asks for a change.
- Keep edits scoped to the requested page unless the user asks for a broader cleanup.

## Output

For reviews, use this shape:

1. Findings with severity and clickable file references.
2. Open questions or assumptions.
3. Short validation summary.

For edits, summarize the changed files and validation result.
