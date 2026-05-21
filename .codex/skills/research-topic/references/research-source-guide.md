# Research Source Guide

Use this reference for topic research that feeds fact-checking, trend analysis, writing, SEO, or implementation.

## Source Priority

Prefer:

- Primary sources: official documentation, product announcements, standards bodies, public filings, reports, datasets, and original research.
- High-signal industry sources: reputable analyst reports, platform research, professional associations, conference material, and expert publications.
- Local repo sources: existing datasets, pages, config files, task YAML, and previous research artifacts.

Use with caution:

- Vendor marketing pages that make broad claims without evidence.
- SEO listicles or roundup articles.
- Unsourced social posts.
- Outdated pages for fast-moving topics.

Avoid:

- Broken or inaccessible links.
- Sources that only mention a keyword but do not support the research claim.
- Long quote extraction where a short paraphrase with citation is enough.

## Config YAML Handling

When a config YAML is provided, look for fields such as:

- `topic`
- `title`
- `audience`
- `geography`
- `categories`
- `trusted_sources`
- `excluded_sources`
- `recency_days`
- `output`
- `target_files`
- `constraints`

If config and direct user instructions conflict, the direct user request wins.

## Research Output Example

```markdown
## Research Brief

- Topic: ...
- Scope: ...
- Assumptions: ...

## Key Findings

- Finding with source: [Source title](https://example.com)

## Claims To Fact-Check

- Claim: ...
  - Why it matters: ...
  - Candidate source: https://example.com

## Emerging Themes

- Theme: ...
  - Evidence: ...

## Sources

- https://example.com - Short note on relevance.

## Gaps

- Missing evidence or unresolved questions.
```
