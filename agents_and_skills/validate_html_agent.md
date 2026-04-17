# Validate-HTML.md

This file defines repo-specific guidance for AI coding assistants working on HTML in this project.

## Instructions

Ask Codex something like:

Review this page against `agents-and-skills/validate-html-agent.md` and list violations.

## Scope

Apply these instructions whenever scanning or editing:

- `*.html` in the repository root
- `content/*.html`

## Project Shape

- This repo is a static website built on a customized Silicon Bootstrap template.
- Root HTML files are top-level pages such as `index.html`, `content.html`, `cv.html`, and `404.html`.
- `content/*.html` contains article-style content pages.
- `content.html` contains an overview of all content pages. If a page from `content/*.html` is missing in `content.html`, please notify me.
- Shared CSS and JS are served from `assets/`.
- Source SCSS and JS live under `src/` and are compiled into `assets/`.

## HTML Editing Rules

- Preserve the existing formatting style:
  - 2-space indentation
  - self-closing void tags such as `<meta ... />`
  - attribute wrapping similar to the surrounding file
- Prefer small, surgical edits. Do not rewrite large sections of a page unless the task requires it.
- Reuse existing components, classes, and patterns already present in nearby pages before introducing new markup.
- Keep Bootstrap-based structure consistent with the rest of the site.
- Do not replace hand-authored HTML with generated abstractions or template syntax.

## Metadata And SEO

When editing article pages in `content/`, check that these stay aligned:

- `<title>`
- canonical URL
- `og:title`
- `og:url`
- `og:image` is an image that is included in the page
- description and keyword fields exists and are relevant
- `article:published_time` and `datePublished` must be the date of the first GIT commit.
- `article:modified_time` and `dateModified` must be the date when the file is last changed (probably today).
- JSON-LD values in `application/ld+json`

For root pages, preserve equivalent website / organization metadata where present.

## URL And Asset Conventions

- Root pages usually reference assets without a leading slash, for example `assets/css/theme.min.css`.
- Pages inside `content/` usually reference assets with a leading slash, for example `/assets/css/theme.min.css`.
- Preserve the convention already used by the file you are editing.
- Canonical URLs and social URLs should use the production domain `https://www.futurecx.nl`.
- Links to external websites should open in a new tab and include `rel="noopener noreferrer"` to prevent referrer leakage

## Content Conventions

- Keep the existing tone: practical, expert, architecture-focused, and direct.
- Preserve the author identity as `Martijn van Deel` / `Future CX` unless the task explicitly changes it.
- Favor semantic HTML and accessible markup.
- If adding images, include meaningful `alt` text unless the image is purely decorative.

## Scripts And Structured Data

- Keep analytics and theme scripts intact unless the task is specifically about them.
- Do not break or partially edit JSON-LD. If you change schema fields, keep the JSON valid.
- Existing inline scripts follow plain JavaScript style; match the local style.

## Sitemap

- Validate the page is included in the Sitemap.xml and the lastMod date must be the date when the file is last changed.

## Validation

After HTML edits, prefer verifying with:

```bash
npm run validate
```

If the change affects generated assets or site structure, also consider:

```bash
npm run build
```

## Change Safety

- Never mass-update all HTML files unless explicitly asked.
- If you notice metadata drift between similar article pages, fix only the files relevant to the task unless the user asks for a broader cleanup.
- Preserve unrelated user changes in the worktree.
