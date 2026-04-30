# Future CX Article Writing Checklist

Use this checklist for Future CX blog articles, content briefs, and HTML-ready article copy.

## Audience

- Primary readers: solution architects, enterprise architects, digital product owners, ecommerce leaders, technology selectors, and customer experience teams.
- Reader goal: understand a practical architecture or CX technology topic well enough to make better delivery, platform, or roadmap decisions.
- Assume the reader is capable but busy. Start with the decision or problem, then explain the architecture implications.

## Voice

- Practical, direct, and credible.
- Architecture-aware without becoming academic.
- Customer-value oriented without becoming generic marketing.
- Confident where evidence is strong; careful where claims are emerging or source-dependent.

## Preferred Content Patterns

- Problem -> architecture impact -> decision criteria -> practical implementation guidance.
- Current state -> target state -> transition approach.
- Principle -> why it matters -> how to apply it -> common failure mode.
- Capability map or checklist for topics involving ecommerce, composable architecture, integration, CRM, data, or AI.
- Tradeoff tables only when comparison improves clarity.

## Article Sections

A strong article usually includes:

1. Clear title focused on the topic, not a clever phrase.
2. Short introduction that names the business or architecture problem.
3. Definition of key concepts when needed.
4. Practical sections with H2 headings.
5. Concrete examples or decision criteria.
6. Risks, pitfalls, or anti-patterns.
7. Short conclusion with the main takeaway.

Avoid long generic introductions such as "In today's rapidly changing digital landscape" unless the sentence says something specific.

## SEO

- Title: describe the article topic directly and include the primary keyword naturally.
- Meta description: 140-160 characters when possible; state what the reader will learn.
- Slug: lowercase, hyphenated, short, and stable.
- Keywords: include the primary topic, architecture terms, and related CX/ecommerce terms only when relevant.
- Internal links: prefer existing Future CX articles on related architecture, ecommerce, integration, composable architecture, RFP, and technology selection topics.
- External links: cite primary or high-quality sources when making evidence-based claims.

## Source And Fact Standards

- Do not invent sources, quotes, numbers, publication dates, trend evidence, or vendor capabilities.
- Use current web research for recent trends, market claims, vendor/product facts, regulation, standards, or statistics.
- Prefer primary sources: official docs, standards bodies, research reports, original announcements, reputable analyst reports, filings, and vendor documentation for vendor-specific facts.
- Treat SEO listicles and unsourced blog posts as weak supporting material, not proof.
- Use `$fact-check` before publication when an article depends on external evidence.

## Future CX Style

Prefer terms and themes already used on the site:

- customer-first solutions
- future state architecture
- composable architecture
- integration principles
- integration patterns
- ecommerce transformation
- marketplace design
- technology selection
- RFP context and open questions
- business capability modelling
- product ownership and DevOps delivery

Avoid:

- hype-heavy AI or transformation claims
- unsupported "best", "leading", or "revolutionary" phrasing
- vague recommendations that do not help a reader make a decision
- overly playful or casual language

## HTML Readiness

For `content/*.html` output, check:

- H1, metadata, JSON-LD headline, Open Graph title, and visible title describe the same article.
- Meta description, JSON-LD description, and overview-card summary are consistent but do not need to be identical.
- Article dates are present and correctly formatted when publishing.
- Hero or article image path exists or is clearly marked as a proposed asset.
- Breadcrumb and category badges match existing site patterns.
- Links are root-relative for internal content pages.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Generated HTML uses 2-space indentation and preserves local formatting style.
