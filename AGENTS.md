# AI Agent Instructions For Future CX.nl

This repository is a static Future CX website published at `https://www.futurecx.nl`. It is based on a customized Silicon Bootstrap template, built locally with NPM, and deployed from GitHub to the production server by GitHub Actions.

## Architecture

- Root `*.html` files are top-level pages such as `index.html`, `content.html`, `cv.html`, and `404.html`.
- `content/*.html` contains article-style pages and interactive content pages.
- `content.html` is the overview page for content items. When adding a new `content/*.html` article, check whether it should be linked there.
- `assets/` contains generated CSS, generated JavaScript, vendor files, fonts, images, favicons, and JSON assets used by the site.
- `src/scss/` and `src/js/` are source files compiled into `assets/`.
- `build/*.js` contains local build, sitemap, date, vendor, style, and script tasks.
- `data/*.json` contains structured site data, including `data/trends.json`.
- `.codex/skills/` contains repo-local Codex skills.
- `.codex/instructions/` contain reference and instruction files.

## Build And Validation

Use the existing NPM scripts:

```bash
npm run validate
npm run build
npm run dev
```

- `npm run validate` runs ESLint for JavaScript and HTML.
- `npm run build` compiles styles/scripts/vendor files, updates dates, and validates.
- `npm run dev` builds minified assets, generates sitemap output, updates dates, and starts watchers plus a local PHP server.
- Run `npm run build` when changing `src/`, `build/`, shared assets, generated assets, or site-wide structure.
- Run `npm run validate` after HTML, JS, JSON-related, or content edits when feasible.

## Deployment

Deployment is handled by `.github/workflows/main.yml` on pushes to `main`.

The workflow:

1. Checks out the latest code.
2. Cleans selected files and directories on the server.
3. Uploads the repo by FTP/SFTP action.
4. Removes development-only files from the server.
5. Purges the Cloudflare cache.

Do not edit deployment secrets. Be careful when changing workflow cleanup paths because they affect production files.

## Other instructions

- for visual design and content related topics refer to `.codex/instructions/design.md`
- for SEO related topics refer to `.codex/instructions/seo-instructions.md`

## Repo Skills

- `$research-topic`: research a general topic, gather credible sources, identify findings, claims, themes, and gaps.
- `$trend-research`: discover and structure new ecommerce, retail, CRM, advertising, data, AI, and software architecture trends.
- `$fact-check`: validate trend research output, sources, duplicate overlap, taxonomy fit, adoption stage, and JSON readiness.
- `$blog-write`: draft, rewrite, structure, and prepare SEO-ready Future CX blog articles and article briefs.
- `$blog-createhtml`: create or update Future CX `content/*.html` article pages from drafts, briefs, or Markdown.
- `$blog-createimage`: create Future CX article image concepts, prompts, generated image plans, and asset guidance.
- `$validate-page`: review static HTML pages for structure, SEO, readability, accessibility, links, assets, JSON-LD, sitemap inclusion, and project conventions.

## Do

- Read surrounding files before editing.
- Preserve unrelated user changes in the worktree.
- Use `rg` for searching.
- Use `apply_patch` for manual edits.
- Run targeted validation when feasible.
- Report any validation command that could not be run.

## Do Not

- Do not mass-update HTML files unless explicitly asked.
- Do not introduce new frameworks or templating systems.
- Do not edit generated `assets/` files when the source change belongs in `src/`, unless the task specifically requires generated output.
- Do not remove analytics, deployment, or Cloudflare-related configuration without explicit instruction.
- Do not invent sources, quotes, statistics, trend evidence, or publication dates.
- Do not revert unrelated changes.
