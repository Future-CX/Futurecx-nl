---
name: research-topic
description: Research a user-provided topic or YAML-configured topic by scanning current web sources, collecting credible evidence, extracting key findings, identifying claims that need validation, grouping themes, and producing structured research output for downstream fact-checking, trend analysis, SEO, writing, or content workflows.
---

# Research Topic

## Workflow

1. Determine the research brief from the user prompt and any provided YAML config.
2. If a YAML config path is provided, read it first. Use it for topic, audience, geography, source preferences, exclusions, recency, output format, and downstream file targets.
3. Inspect relevant local files when the research is meant to support an existing page, dataset, task YAML, or workflow.
4. Browse the web for current, credible sources. Use primary or high-signal sources first.
5. Collect findings with source URLs. Keep claims traceable to specific sources.
6. Separate:
   - verified-looking findings that are source-backed,
   - claims that need fact-checking,
   - emerging themes and disagreements between sources,
   - source gaps or uncertainty.
7. Produce structured output that can be handed to `$fact-check`, `$trend-research`, a writer, or an implementation task.
8. Cite source links in the final response whenever web research informed the answer.

## Output Shape

Prefer this structure unless the user asks for another format:

1. Research brief: topic, scope, assumptions.
2. Key findings: concise bullets with source links.
3. Claims to fact-check: important claims that should not be treated as settled yet.
4. Emerging themes: grouped patterns across sources.
5. Source list: deduplicated URLs with short notes.
6. Gaps and next steps: missing evidence, weak areas, or recommended follow-up.

## Standards

- Prefer recent sources for fast-moving topics.
- Use primary sources where available: official announcements, documentation, standards, research reports, filings, datasets, and original studies.
- Avoid relying on SEO listicles as primary evidence.
- Do not present unsupported claims as facts.
- Keep quotes short and only use them when exact wording matters.
- If sources conflict, report the disagreement instead of forcing a single conclusion.
- If the user asks to update files, keep research output separate from proposed edits unless the requested change is clear.

## References

Read `references/research-source-guide.md` when choosing source types, evaluating source quality, or structuring outputs for downstream skills.
