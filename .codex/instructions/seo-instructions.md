## Metadata And SEO

For `content/*.html` article pages, keep these aligned:

- `<title>`
- canonical URL
- meta description and keywords where present
- `og:title`
- `og:url`
- `og:image`
- `article:published_time`
- `article:modified_time`
- JSON-LD fields such as `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, and `publisher`

Use production URLs under `https://www.futurecx.nl`. Preserve the author identity as `Martijn van Deel` / `Future CX` unless the user explicitly changes it.

When dates matter:

- `datePublished` / `article:published_time` should reflect the file creation date for the page when available.
- `dateModified` / `article:modified_time` should reflect the latest relevant file change date.
- Check `sitemap.xml` lastmod values when adding or updating published pages.
