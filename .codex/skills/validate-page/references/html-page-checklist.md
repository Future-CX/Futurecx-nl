# HTML Page Checklist

Use this checklist for Future CX static HTML pages.

## Structure

- Use semantic HTML where practical: clear headings, landmarks, lists, and article sections.
- Keep heading order logical; avoid skipping levels for visual styling alone.
- Preserve existing Silicon Bootstrap layout patterns.
- Avoid malformed nesting, duplicate IDs, orphaned closing tags, and broken JSON/script blocks.

## SEO Metadata

- Check `<title>` is specific, concise, and aligned with the page topic.
- Check `description` and `keywords` exist where the page pattern uses them and are relevant.
- Check canonical URL uses `https://www.futurecx.nl`.
- For article pages, align these fields:
  - canonical URL
  - `og:title`
  - `og:url`
  - `og:image`
  - `article:published_time`
  - `article:modified_time`
  - JSON-LD `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, and `publisher`
- `article:published_time` and JSON-LD `datePublished` should match the first Git commit date for that file when available.
- `article:modified_time` and JSON-LD `dateModified` should match the latest relevant file change date.
- For root pages, preserve equivalent website or organization metadata where present.

## Social Preview

- `og:image` should point to an image that exists and is relevant.
- Social title and description should read naturally outside the page context.
- Twitter metadata should stay aligned when present.

## Readability

- Prefer practical, expert, architecture-focused, direct language.
- Keep paragraphs scannable and avoid dense walls of text.
- Make link text descriptive; avoid repeated vague labels such as "click here".
- Keep claims concrete. Flag unsupported, stale, or exaggerated claims.

## Accessibility

- Images need meaningful `alt` text unless decorative.
- Interactive controls need accessible labels or visible text.
- Link purpose should be clear from text or immediate context.
- Avoid empty headings, duplicate visible labels with different destinations, and icon-only controls without labels.

## Links And Assets

- Root pages usually reference assets without a leading slash, for example `assets/css/theme.min.css`.
- `content/*.html` pages usually reference assets with a leading slash, for example `/assets/css/theme.min.css`.
- Preserve the convention already used by the file.
- External links should open in a new tab and include `rel="noopener noreferrer"`.
- Check local links, image paths, CSS paths, JS paths, and canonical URLs for obvious drift.

## Sitemap And Index Pages

- For `content/*.html`, check the page is represented in `content.html` when that overview is expected to list it.
- Check `sitemap.xml` includes the page and that `lastmod` matches the latest relevant file change date.

## Validation Commands

Prefer:

```bash
npm run validate
```

Also consider:

```bash
npm run build
```

Run build when the change affects generated assets, source SCSS/JS, or shared site structure.
