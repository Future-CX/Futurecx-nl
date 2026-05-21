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
live_url: 'https://www.futurecx.nl/content/{{ filename }}.html'
lighthouse_report_dir: '.codex/reports/{{ slug }}/lighthouse'
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
- `live_url`: `{{ live_url }}`
- `lighthouse_report_dir`: `{{ lighthouse_report_dir }}`

## Workflow

### Instruction to execute this workflow

Ask Codex to run it via `Run the workflow in .codex/workflows/blog-composable-architecture.md`

### 1. Align on What to Research

Before running research, use `$grill-me` to ensure we have the same understanding of what should be researched for `{{ blog_title }}`.

Alignment scope:

- Clarify the intended audience, business angle, and practical purpose of the article.
- Confirm what `{{ topic }}` should and should not cover in this Future CX context.
- Walk through the research decision tree: objectives, scope, sources, claims to investigate, claims to avoid, and publication risks.
- Resolve dependencies between research choices before starting `$research-topic`.
- If a question can be answered by exploring this codebase, existing articles, workflows, skills, or site conventions, inspect those files instead of asking the user.
- Ask the user only for decisions that cannot be answered from repository context.

Output:

- Produce a short shared-understanding summary for the research task.
- List resolved decisions, assumptions, deferred questions, and any source or claim risks to watch during research.
- Use this summary as input for step 2.

### 2. Research the Topic

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

### 3. Fact-Check the Research

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

### 4. Write the Blog Draft

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

### 5. Create the Blog Image

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

### 6. Create or Update the HTML Article

Before creating or updating HTML:

- Resolve `{{ html_page }}` using `{{ filename }}`.
- Resolve `{{ image_path }}` using `{{ filename }}`.
- Check whether the resolved image exists at `{{ image_path }}`.
- If the image is missing, stop and run step 5 before creating or updating HTML.
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

### 7. Validate the Generated Page

Before validating:

- Resolve `{{ html_page }}` using `{{ filename }}`.
- Check whether the resolved HTML page exists.
- If it does not exist, stop and report that step 6 must create the page first.

Use `$validate-page` to validate the generated or updated article page at `{{ html_page }}`.

Validation scope:

- Check page structure, SEO metadata, Open Graph metadata, Twitter metadata, JSON-LD, canonical URL, dates, breadcrumbs, category badges, article image references, source links, internal links, `content.html` inclusion, sitemap inclusion, accessibility, and project conventions.
- Confirm `{{ image_path }}` is used consistently for the hero image, `og:image`, `twitter:image`, JSON-LD `image`, and overview card where applicable.
- Confirm external links open in a new tab with `rel="noopener noreferrer"`.
- Confirm dates are aligned across `article:published_time`, `article:modified_time`, visible article metadata, JSON-LD, and `sitemap.xml`.
- Run targeted validation for `{{ html_page }}` when feasible, and run `npm run validate` if the final publication check requires the full repo validation.

Output:

- Report findings ordered by severity with file and line references.
- Report whether `{{ html_page }}`, `content.html`, `sitemap.xml`, and `{{ image_path }}` passed validation.
- Report validation commands run and their results.
- Report any remaining publication blockers.

### 8. Check the HTML Page in Chrome DevTools MCP

Before checking in Chrome DevTools MCP:

- Resolve `{{ html_page }}` using `{{ filename }}`.
- Resolve `{{ lighthouse_report_dir }}` using `{{ slug }}`.
- Check whether the resolved HTML page exists.
- Create `{{ lighthouse_report_dir }}` if Lighthouse artifacts will be written.
- Check whether the site is available through a local web server.
- Record whether the local web server was already running before this step.
- If no local server is running, start the project with `npm run dev` and record that this workflow step started it.
- If a local server was already running before this step, reuse it and do not stop it after validation.
- Use the local Google Chrome executable when launching Chrome DevTools MCP on macOS: `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.
- If Codex runs inside a sandbox that cannot launch or reach its own browser, connect Chrome DevTools MCP to a running debuggable local Chrome instance instead.
- To start a debuggable local Chrome instance on macOS, close other Chrome instances first, then run:

  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable
  ```

- Configure Chrome DevTools MCP to connect to that running Chrome instance with `--browser-url=http://127.0.0.1:9222` (also accepted as `--browserUrl` or `-u`), for example:

  ```json
  {
    "mcpServers": {
      "chrome-devtools": {
        "command": "npx",
        "args": ["chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
      }
    }
  }
  ```

- Treat the remote debugging port as sensitive: use a temporary `--user-data-dir`, avoid browsing sensitive sites in that Chrome instance, and stop the browser after validation.
- Use the local URL for the generated page, for example `http://localhost:3000/{{ html_page }}` or the actual URL reported by the local server.
- If Chrome DevTools MCP is unavailable in the current Codex session, report that clearly and include the static validation results from step 7 instead of inventing browser findings.

Use Chrome DevTools MCP to inspect the generated or updated article page at `{{ html_page }}`.

Browser validation scope:

- Open the generated page in Chrome through DevTools MCP.
- Confirm the page renders without a blank screen, broken layout, visible template artifacts, overlapping text, or missing hero imagery.
- Check desktop and mobile viewport widths.
- Inspect the console for JavaScript errors, failed asset loads, network 404s, mixed-content warnings, and CSP/security warnings.
- Confirm the hero image, article metadata area, table of contents, related articles, footer, theme switcher, and share controls render as expected.
- Confirm external links and internal links are present in the DOM with the expected `href`, `target`, and `rel` attributes.
- Capture screenshots or describe the inspected viewport state when the MCP tooling supports it.

Lighthouse validation scope:

- Run Lighthouse MCP audits for accessibility, SEO, best practices, and agentic browsing when available. Save Lighthouse reports under `{{ lighthouse_report_dir }}`.
- Do not run local performance traces or report local Core Web Vitals metrics from `localhost`; those numbers are not representative of the live site.
- If performance or Core Web Vitals evidence is needed, use a separate production check against the live URL instead of this local page validation step.
- Treat local development-only noise separately from publication blockers, especially BrowserSync requests, analytics calls, cache state, and localhost-only network conditions.

Output:

- Start with a compact status summary table using these visual identifiers:
  - `PASS` for checks that completed successfully.
  - `WARN` for checks that passed with caveats or local-development noise.
  - `FAIL` for checks that found a defect.
  - `BLOCKED` for checks that could not run.
- Include the check name, status, evidence, and recommended next action in the status summary table.
- Report the local URL used for browser validation.
- Report the artifact directory used for Lighthouse outputs.
- Report Chrome DevTools MCP findings ordered by severity with page section or DOM reference where possible.
- Report whether desktop and mobile viewport checks passed.
- Report any console errors, failed network requests, missing assets, layout issues, or interaction issues.
- Report Lighthouse MCP audit scores or findings when available, and state which audit modes/devices were used.
- Report whether Chrome DevTools MCP was unavailable, blocked, or only partially completed.
- Report any remaining publication blockers after combining Chrome DevTools MCP findings with step 7 validation results.
- Report whether the local server was already running or started by this step.
- Stop the local server only when this workflow step started it. Do not stop a server that was already running before step 8 began.

### 9. Check Live Page Web Vitals with PageSpeed Insights API

Use this step only after the article is published or when `{{ live_url }}` already exists.

Before running the live performance check:

- Resolve `{{ live_url }}` using `{{ filename }}`.
- Resolve `{{ lighthouse_report_dir }}` using `{{ slug }}`.
- Check whether the live URL exists with an HTTP request before calling the PageSpeed Insights API.
- Treat `2xx` responses as available. Treat `3xx` responses as available only when the redirect target resolves to the expected canonical live page. Treat `4xx`, `5xx`, DNS failures, TLS failures, and timeouts as `BLOCKED`.
- Do not use `localhost` for this step.
- Do not start or stop the local development server for this step.
- Use the PageSpeed Insights API v5 endpoint: `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed`.
- Use `category=PERFORMANCE` and run both `strategy=mobile` and `strategy=desktop` unless the workflow executor is explicitly asked to run only one strategy.
- Use an API key only when available in the environment as `PAGESPEED_API_KEY`; otherwise call the public endpoint without a key and report any quota or captcha blockers.
- When this workflow is executed by Codex through chat, check whether `PAGESPEED_API_KEY` is already available in the command environment.
- If `PAGESPEED_API_KEY` is not available and a repo-local `.env` file exists, load `.env` for the PageSpeed API commands only, without printing the key, committing it, copying it into reports, or exposing it in command output.
- When loading `.env` from a shell command, source it in the same command invocation that runs the PageSpeed API requests so the variable is available to Codex-run commands, for example:

  ```bash
  set -a
  source .env
  set +a
  ```

- Include `key=$PAGESPEED_API_KEY` in the PageSpeed API request only after confirming the variable is non-empty.

Live Web Vitals validation scope:

- Call PageSpeed Insights API for the live URL with `strategy=mobile`.
- Call PageSpeed Insights API for the live URL with `strategy=desktop`.
- Save the raw mobile JSON response as `{{ lighthouse_report_dir }}/pagespeed-mobile.json`.
- Save the raw desktop JSON response as `{{ lighthouse_report_dir }}/pagespeed-desktop.json`.
- Extract Lighthouse lab performance data from `lighthouseResult`, including Performance score, LCP, CLS, Total Blocking Time, Speed Index, First Contentful Paint, and major opportunity or diagnostic audits.
- Extract field Web Vitals from `loadingExperience` and `originLoadingExperience` when present, including LCP, CLS, INP, FCP, TTFB, and overall category.
- Prefer page-level field data from `loadingExperience`. If only origin-level data is available through `originLoadingExperience`, label it clearly as origin fallback, not page-specific data.
- If field data is missing, report field Web Vitals as `BLOCKED` or `WARN` and use Lighthouse lab data as lab evidence only.
- Save a human-readable live Web Vitals report as `{{ lighthouse_report_dir }}/web-vitals-report.html`.
- Save a machine-readable summary as `{{ lighthouse_report_dir }}/web-vitals-summary.json`.
- The HTML report must include:
  - The tested live URL and timestamp.
  - A compact status summary table using `PASS`, `WARN`, `FAIL`, and `BLOCKED`.
  - Separate sections for mobile and desktop Lighthouse lab results.
  - Separate sections for page-level and origin-level field Web Vitals when available.
  - Clear labels for lab data versus field data.
  - The top performance opportunities or diagnostics from Lighthouse, ordered by likely user impact.
  - Any PageSpeed API blockers, warnings, runtime errors, quota errors, or missing field-data caveats.
  - Links to `pagespeed-mobile.json`, `pagespeed-desktop.json`, and `web-vitals-summary.json`.
- The HTML report `<head>` must include this favicon link:

  ```html
  <link rel="icon" href='data:image/svg+xml;utf8,<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m14 7 10-7 10 7v10h5v7h-5l5 24H9l5-24H9v-7h5V7Z" fill="%23F63"/><path d="M31.561 24H14l-1.689 8.105L31.561 24ZM18.983 48H9l1.022-4.907L35.723 32.27l1.663 7.98L18.983 48Z" fill="%23FFA385"/><path fill="%23FF3" d="M20.5 10h7v7h-7z"/></svg>'>
  ```

Output:

- Start with a compact status summary table using `PASS`, `WARN`, `FAIL`, and `BLOCKED`.
- Report whether `{{ live_url }}` exists and which final URL was tested.
- Report `{{ lighthouse_report_dir }}` as the artifact directory used for PageSpeed and Web Vitals outputs.
- Report mobile and desktop Lighthouse Performance scores and key lab metrics.
- Report page-level field Web Vitals when available, and origin-level field Web Vitals when page-level data is unavailable.
- Report whether each Web Vital is field data, origin fallback data, or lab data.
- Report the top performance findings ordered by likely user impact.
- Report whether the Web Vitals HTML report and JSON summary were written.
- Report any blocked checks and the concrete reason they were blocked.
