---
workflow: 'blog-composable-architecture'
topic: 'Composable Architecture'
slug: 'composable-architecture'
blog_title: 'Why Composable Architecture Matters'
filename: 'why-composable-architecture-matters'
primary_keyword: 'composable architecture'
category: 'Enterprise Architecture'
research_report: '.codex/reports/{{ slug }}/research.md'
fact_check_report: '.codex/reports/{{ slug }}/fact-check.md'
blog_draft: '.codex/reports/{{ slug }}/blog-draft.md'
image_path_draft: '.codex/reports/{{ slug }}/{{ filename }}.webp'
image_path: 'assets/img/blog/single/{{ filename }}.webp'
html_page: 'content/{{ filename }}.html'
---

# Writing a Blog on Why Composable Architecture Matters

I am writing a blog on why Composable Architecture matters.

## Variables

- `workflow`: `{{ workflow }}`
- `topic`: `{{ topic }}`
- `blog_title`: `{{ blog_title }}`
- `slug`: `{{ slug }}`
- `filename`: `{{ filename }}`
- `primary_keyword`: `{{ primary_keyword }}`
- `category`: `{{ category }}`
- `research_report`: `{{ research_report }}`
- `fact_check_report`: `{{ fact_check_report }}`
- `blog_draft`: `{{ blog_draft }}`
- `image_path_draft`: `{{ image_path_draft }}`
- `image_path`: `{{ image_path }}`
- `html_page`: `{{ html_page }}`

## Workflow

### Instruction to execute this workflow

Ask Codex to run it via `Run the workflow in .codex/workflows/blog-composable-architecture.md`

### 1. Research the Topic

Before running research:

- Resolve `{{ research_report }}` using `{{ slug }}`.
- Check whether the resolved research report already exists.
- If it exists and its file modification time is less than 24 hours old, skip `$research-topic` and reuse the existing report.
- When reusing the existing report, treat `{{ research_report }}` as read-only: do not modify the file, its report date, its metadata, or its content.
- If it does not exist or is 24 hours old or older, run the research task below.

Use `$research-topic` to research `{{ topic }}` for a Future CX blog article.

Research scope:

- Explain what composable architecture is and why it matters.
- Focus on ecommerce, customer experience platforms, enterprise architecture, integration, delivery speed, and technology selection.
- Gather credible and current sources.
- Prefer primary or high-quality sources over generic SEO listicles.
- Capture practical findings, source-backed claims, open questions, and themes that can support the article.

Output:

- Save the research report to `{{ research_report }}`.
- Only update the research report date when `$research-topic` actually regenerates the report content.
- Include source URLs for every factual claim that depends on external evidence.
- Mark claims that should be checked with `$fact-check` before publication.

### 2. Fact-Check the Research

Before running fact-check:

- Resolve `{{ fact_check_report }}` using `{{ slug }}`.
- Check whether the resolved fact-check report already exists.
- If it exists and its file modification time is less than 24 hours old, skip `$fact-check` and reuse the existing report.
- When reusing the existing report, treat `{{ fact_check_report }}` as read-only: do not modify the file, its report date, its metadata, or its content.
- If it does not exist or is 24 hours old or older, run the fact-check task below.

Use `$fact-check` to validate the research report at `{{ research_report }}` before writing the article.

Fact-check scope:

- Check whether each key finding is supported by the cited source.
- Identify weak, vendor-biased, gated, outdated, or insufficient sources.
- Review claims marked by the research step for publication risk.
- Flag claims about ROI, AI readiness, TCO, speed, adoption, or case-study outcomes that need stronger evidence.
- Check for duplicate or overlapping claims that should be merged before writing.
- Confirm the findings fit the Future CX topic, audience, and `{{ category }}` category.

Output:

- Save the fact-check report to `{{ fact_check_report }}`.
- Only update the fact-check report date when `$fact-check` actually regenerates the report content.
- Classify claims as approved, needs revision, needs stronger source, or reject.
- Include recommended wording changes for claims that are directionally useful but too strong.
- List source gaps that must be resolved before `$blog-write` uses the research.

### 3. Write the Blog Draft

Before writing:

- Resolve `{{ blog_draft }}` using `{{ slug }}`.
- Check whether the resolved blog draft already exists.
- If it exists and its file modification time is less than 24 hours old, skip `$blog-write` and reuse the existing draft.
- When reusing the existing draft, treat `{{ blog_draft }}` as read-only: do not modify the file, its draft date, its metadata, or its content.
- If it does not exist or is 24 hours old or older, run the blog writing task below.

Use `$blog-write` to write a Future CX blog draft titled `{{ blog_title }}` about `{{ topic }}`.

Inputs:

- Blog title: `{{ blog_title }}`
- Filename: `{{ filename }}`
- Research report: `{{ research_report }}`
- Fact-check report: `{{ fact_check_report }}`
- Primary keyword: `{{ primary_keyword }}`
- Category: `{{ category }}`

Writing scope:

- Use the approved findings and themes from the fact-check report.
- Avoid or soften claims rejected or flagged by the fact-check report.
- Write in the Future CX voice: practical, direct, architecture-focused, customer-value oriented, and credible.
- Focus on ecommerce, customer experience platforms, enterprise architecture, integration, delivery speed, and technology selection.
- Include source references for factual claims that depend on external evidence.
- Create a publishable article draft with title, meta description, article body, suggested slug, category, tags, internal links, and image direction.

Output:

- Save the blog draft to `{{ blog_draft }}`.
- Only update the blog draft date when `$blog-write` actually regenerates the draft content.
- Mark any remaining claims that should be checked before HTML publication.
- Include recommended next step for `$blog-createimage` or `$blog-createhtml` using `{{ filename }}`.

### 4. Create the Blog Image

Before creating the image:

- Resolve `{{ image_path }}` using `{{ filename }}`.
- Check whether the resolved image already exists.
- If it exists, skip `$blog-createimage` and reuse the existing image.
- When reusing the existing image, treat `{{ image_path }}` and `{{ image_path_draft }}` as read-only: do not modify, reconvert, rename, overwrite, or refresh either file.
- If it does not exist, run the image creation task below.

Use `$blog-createimage` to create a Future CX article image for `{{ blog_title }}`.

Inputs:

- Blog title: `{{ blog_title }}`
- Topic: `{{ topic }}`
- Blog draft: `{{ blog_draft }}`
- Target filename: `{{ filename }}`
- Target image path: `{{ image_path }}`
- Primary keyword: `{{ primary_keyword }}`
- Category: `{{ category }}`

Image scope:

- Use the blog draft and approved research themes to choose the visual direction.
- Follow the Future CX image guidance and store the final image at `{{ image_path }}`.
- Use a professional composable architecture visual direction that supports ecommerce, customer experience platforms, integration, and delivery speed.
- Do not overwrite an existing image unless explicitly instructed.
- Plan responsive variants if the target article template needs them.

Output:

- Save the final image to `{{ image_path_draft }}` and to `{{ image_path }}`.
- Report any missing post-processing, conversion, compression, or responsive variants.
- Include image usage notes for `$blog-createhtml`.

### 5. Create or Update the HTML Article

Before creating or updating HTML:

- Resolve `{{ html_page }}` using `{{ filename }}`.
- Resolve `{{ image_path }}` using `{{ filename }}`.
- Check whether the resolved image exists at `{{ image_path }}`.
- If the image is missing, stop and run step 4 before creating or updating HTML.
- Check whether the resolved HTML page already exists.
- If it exists, update the existing page from `{{ blog_draft }}` and report the resulting diff.
- If it does not exist, create a new page at `{{ html_page }}` from `{{ blog_draft }}`.

Use `$blog-createhtml` to transform the blog draft at `{{ blog_draft }}` into a publishable Future CX HTML article.

Inputs:

- Blog title: `{{ blog_title }}`
- Topic: `{{ topic }}`
- Blog draft: `{{ blog_draft }}`
- Target HTML page: `{{ html_page }}`
- Target filename: `{{ filename }}`
- Hero image path: `{{ image_path }}`
- Hero image URL: `https://www.futurecx.nl/{{ image_path }}`
- Primary keyword: `{{ primary_keyword }}`
- Category: `{{ category }}`
- Research report: `{{ research_report }}`
- Fact-check report: `{{ fact_check_report }}`

HTML scope:

- Use `content/blog-single.html` as the base template when creating a new page.
- If `{{ html_page }}` already exists, preserve the existing page shell, navigation, analytics, theme scripts, footer, and unrelated content structure while updating the article content and metadata.
- Use `{{ image_path }}` for the hero image, image preload, visible article image/background, and related in-page image references for this article where applicable.
- Use `https://www.futurecx.nl/{{ image_path }}` for `og:image`, `twitter:image`, and JSON-LD `image`.
- Align `<title>`, canonical URL, meta description, Open Graph metadata, Twitter metadata, JSON-LD, breadcrumb, H1, article intro, category badges, keywords, and visible article body with the blog draft.
- Use root-relative internal links and make external source links open in a new tab with `rel="noopener noreferrer"`.
- Check whether `content.html` should be updated so the article overview card uses `{{ html_page }}` and `{{ image_path }}`.

Output:

- Save the created or updated HTML page at `{{ html_page }}`.
- If `{{ html_page }}` already existed, report the diff summary for the page and any other changed files.
- Report whether `content.html` and `sitemap.xml` were updated.
- Run `npm run validate` when feasible and report the result.
- Report any publication blockers, such as missing image variants, unresolved dates, unverified claims, or validation failures.
