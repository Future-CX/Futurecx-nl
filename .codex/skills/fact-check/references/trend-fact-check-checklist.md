# Trend Fact-Check Checklist

Use this checklist to validate trend research outputs and `trends.json` entries.

## Trend Identity

- Name is concise, title case, and not just a vendor product or campaign.
- Name is materially distinct from existing trends.
- Scope is neither too broad to be useful nor too narrow to be a one-off feature.
- Category matches the repository taxonomy:
  - `Data & AI`
  - `Advertising & Promotion`
  - `Content & Experience`
  - `CRM & Analytics`
  - `Commerce & Sales`
  - `Software Architecture`

## Duplicate And Overlap Check

- Search `data/trends.json` for exact and fuzzy matches.
- Compare summary and sources with nearby trends.
- If overlap exists, prefer one of:
  - Rename the candidate to a clearly distinct scope.
  - Merge evidence into the existing trend.
  - Reject the candidate as duplicate.

## Source Quality

Strong sources include:

- Primary platform, vendor, or standards documentation.
- Research reports from credible commerce, payments, CRM, data, or advertising organizations.
- Official product/feature announcements when validating an emerging capability.
- Reputable industry analysis when paired with primary evidence.

Weak sources include:

- SEO listicles with no original evidence.
- Generic vendor landing pages that do not discuss the trend.
- Sources that only mention a keyword but do not support the summary.
- Broken pages, inaccessible pages, or pages with unclear dates for fast-moving claims.

## Claim Support

- Each summary should be supported by the cited sources.
- The sources should support the claimed domain, not only a generic technical concept.
- If a source only supports part of the summary, narrow the summary or add a better source.
- Avoid unsupported benefits such as "improves conversion" unless the source provides evidence or the wording is softened.

## Adoption Stage

- `Innovators`: early experiments, announcements, pilots, limited examples.
- `Early Adopters`: production use exists, evidence is credible, adoption is growing but not standard.
- `Early Majority`: mature tooling and common use in modern ecommerce or enterprise programs.
- `Late Majority`: established baseline practice or operational hygiene.

Check that the stage aligns with source evidence and local dataset patterns.

## JSON Readiness

- Object includes `name`, `category`, `stage`, `summary`, and `sources`.
- `sources` is a non-empty array of clean URLs.
- JSON syntax is valid.
- Summary is one sentence, concrete, and does not contain unverifiable hype.
- Category spelling exactly matches the repository taxonomy.

## Verdict Guidance

- `Pass`: no blocking issues.
- `Revise`: trend is plausible but needs better evidence, clearer wording, taxonomy correction, or deduplication.
- `Reject`: unsupported, duplicate, misleading, too narrow, or outside scope.
