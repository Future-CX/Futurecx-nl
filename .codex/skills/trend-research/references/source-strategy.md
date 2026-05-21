# Source Strategy

Use this reference to guide internet scans for trend discovery.

## Strong Source Types

- Primary platform announcements: Shopify, Salesforce, Adobe, Google, Meta, TikTok, Amazon, Stripe, Snowflake, Databricks, Vercel, Cloudflare, commercetools, Contentful, Akeneo, Braze, Segment.
- Industry and market reports: JP Morgan payments reports, DHL ecommerce reports, Salesforce State of Commerce, Shopify commerce trends, Adobe commerce resources, Worldpay reports.
- Ecosystem and standards sources: MACH Alliance, W3C, MDN, web.dev, CNCF, Apache Kafka, Confluent, OpenTelemetry, OWASP.
- Retail media and advertising sources: Criteo, The Trade Desk, IAB, Google Merchant Center, TikTok business/newsroom, Meta business, Pinterest newsroom.
- Customer experience and operations sources: Zendesk, Gorgias, Narvar, FedEx, DHL, AfterShip.

## Category Hints

- `Data & AI`: AI search, agents, data platforms, streaming, governance, fraud, analytics infrastructure, model evaluation.
- `CRM & Analytics`: customer profiles, segmentation, consent, lifecycle orchestration, experimentation, decision intelligence, dashboards, retention, CLV.
- `Commerce & Sales`: checkout, payments, selling channels, subscriptions, marketplaces, conversational or agentic buying, localization.
- `Advertising & Promotion`: retail media, audiences, measurement, server-side tracking, creator commerce, sponsored placements.
- `Content & Experience`: product content, storefront UX, support, returns, mobile, live/video shopping, performance where user-facing.
- `Software Architecture`: composable commerce, headless, APIs, event-driven integration, observability, security, platform architecture.

## Candidate Evaluation

Ask:

- Is the trend broader than one vendor feature?
- Is there evidence from more than one credible source?
- Is there a clear business or technical driver?
- Is adoption stage supportable from the available evidence?
- Does it duplicate an existing trend name or summary?

## Output Pattern

For a new trend object:

```json
{
  "name": "Trend Name",
  "category": "Category",
  "stage": "Early Adopters",
  "summary": "One concrete sentence explaining what it is, where it applies, and why it matters.",
  "sources": ["https://example.com/source-one", "https://example.com/source-two"]
}
```
