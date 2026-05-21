---
name: trend-research
description: Scan the internet for emerging market, technology, ecommerce, retail, CRM, advertising, and software architecture trends; validate whether candidate trends are new or materially changing; and return structured trend findings with sources, category, adoption stage, summary, and rationale. Use when Codex is asked to research new trends, refresh trend datasets, find trend opportunities, or add researched trends to files such as trends.json.
---

# Trend Research

## Workflow

1. Clarify the research scope only if the user has not provided enough domain, geography, audience, or output format. Otherwise proceed with reasonable assumptions.
2. Inspect any local trend dataset first when the task is about adding or refreshing trends. Identify existing names, categories, stages, and nearby duplicates before browsing.
3. Browse current sources. Use primary or high-signal sources where possible: vendor research, platform docs, analyst reports, standards bodies, conference announcements, major commerce platforms, and reputable industry publications.
4. Triangulate each candidate trend with at least two independent signals unless the user requests a quick scan or the trend is backed by a primary launch/source.
5. Filter out items that are only products, features, campaigns, or buzzwords unless they represent a broader repeatable market pattern.
6. Normalize names to title case, concise noun phrases, and the taxonomy used by the local dataset.
7. Assign an adoption stage:
   - `Innovators`: visible experimentation, launches, or early vendor positioning, with limited broad adoption.
   - `Early Adopters`: credible production use and growing vendor/customer evidence, but not a default practice.
   - `Early Majority`: common in modern programs, supported by multiple mature tools and use cases.
   - `Late Majority`: established baseline capability or operational hygiene.
8. Produce structured output. For `trends.json`, include `name`, `category`, `stage`, `summary`, and `sources`.
9. Cite source links in the final response whenever web research informed the answer.

## Research Standards

- Prefer recent sources for fast-moving areas. For ecommerce and AI, verify recency before claiming something is current.
- Separate evidence from inference. If a stage or trend label is inferred from multiple sources, say so briefly.
- Avoid duplicate trend inflation. If a new candidate overlaps with an existing trend, either merge, rename to a clearly distinct scope, or call out the overlap.
- Keep summaries one sentence, concrete, and outcome-oriented.
- Use the user's category when it matches the dataset. If the requested category differs by spelling from an existing taxonomy, use the existing taxonomy and mention the normalization.
- Do not add sources that were not inspected or are only loosely related.

## Source Strategy

Read `references/source-strategy.md` when planning a broader scan, choosing sources for a category, or evaluating whether a source is strong enough.
