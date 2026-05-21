---
name: fact-check
description: Validate trend research outputs, proposed trends, source lists, and trends.json changes for factual support, source quality, duplicate overlap, taxonomy fit, adoption-stage evidence, summary accuracy, and JSON readiness. Use after trend-research or whenever Codex is asked to fact-check, verify, audit, approve, reject, or improve trend findings before publication.
---

# Fact Checker

## Workflow

1. Identify the artifact to validate: research notes, proposed trend objects, a `trends.json` diff, source list, or published page.
2. Inspect local context first:
   - Read `data/trends.json` when validating new trend candidates.
   - Read any provided config YAML for topic, categories, geography, source rules, or output requirements.
   - Compare against nearby existing trends to detect duplicates and category drift.
3. Verify each trend against its cited sources. Browse the internet when source content, recency, or claims must be checked.
4. Apply `references/trend-fact-check-checklist.md`.
5. Classify each candidate:
   - `Pass`: supported, distinct, well-categorized, and JSON-ready.
   - `Revise`: valid direction but needs name, category, stage, summary, or source changes.
   - `Reject`: unsupported, duplicate, too narrow, vendor-only, stale, or misleading.
6. For edits, patch only the validated fields. Do not invent sources or retain sources that do not support the claim.
7. Validate JSON after changing `data/trends.json`.

## Evidence Rules

- Prefer primary or high-signal sources over summaries and listicles.
- Require at least two independent source signals unless a trend is explicitly based on a primary launch or standard.
- Treat adoption stage as an inference. It must be defensible from the evidence.
- Flag claims that sources imply but do not directly support.
- Do not use inaccessible, irrelevant, stale, or marketing-only pages as sole support for broad trend claims.

## Output

For review-only work, return:

1. Verdict table: trend, verdict, reason, required change.
2. Source issues: broken, weak, duplicate, stale, or mismatched links.
3. Suggested corrected trend objects when useful.
4. Residual risks or assumptions.

For file edits, summarize changed files and validation results.
