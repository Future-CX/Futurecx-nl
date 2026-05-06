---
name: grill-me
description: Relentless plan, design, and requirements interrogation. Use when Codex should interview the user to reach shared understanding, pressure-test a proposal, walk a decision tree, uncover assumptions, resolve dependencies between decisions, clarify implementation plans, or challenge drafts before execution. If a question can be answered by inspecting the local codebase, files, docs, tests, or repository history, Codex should explore those artifacts instead of asking the user.
---

# Grill Me

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Operating Loop

1. Restate the plan, artifact, or goal in one compact paragraph.
2. Identify the decision tree: objectives, users, scope, constraints, dependencies, risks, implementation choices, validation, rollout, and success criteria.
3. Separate answerable-from-context questions from user-only questions.
4. Explore the codebase first for answerable questions. Use `rg`, `rg --files`, existing docs, tests, config, package scripts, and nearby implementation patterns before asking.
5. Ask the smallest useful batch of questions, usually 3-7, grouped by dependency order.
6. After each answer, update the shared understanding, close resolved branches, and continue to the next unresolved branch.
7. Stop only when the remaining ambiguity is explicitly accepted, deferred, or converted into concrete assumptions.

## Codebase-First Rule

Before asking the user, inspect the repository when the answer may already exist in:

- existing feature patterns or neighboring files
- project conventions, AGENTS.md, README files, docs, workflows, or skills
- package scripts, build config, linters, tests, fixtures, routes, schemas, or data files
- git history when current files do not explain why a decision exists

Do not ask questions such as "what framework is this?" or "where is this page linked?" if local exploration can answer them. Briefly report what was inspected when it shapes the next questions.

## Question Style

Ask direct questions that expose tradeoffs, missing decisions, and contradictions. Prefer:

- "Which user action should be optimized: first-time comprehension or repeated operation?"
- "What breaks if this runs without JavaScript?"
- "Is this a hard requirement, a preference, or an assumption?"
- "Which existing pattern should this follow: A from `file`, or B from `file`?"

Avoid vague prompts such as "Anything else?" Replace them with a concrete unresolved branch.

## Dependency Ordering

Resolve upstream choices before downstream details:

1. Goal and success criteria
2. Audience or actor
3. Scope and non-goals
4. Data and content sources
5. System boundaries and integration points
6. UX or workflow states
7. Failure handling and edge cases
8. Validation, measurement, and rollout

When a downstream question depends on an unresolved upstream choice, say so and defer it.

## Output During The Interview

Maintain a short running state:

- `Resolved`: decisions already made
- `Open`: questions currently blocking progress
- `Assumptions`: defaults accepted for now
- `Deferred`: decisions intentionally left for later

Keep this state concise. The interview should create clarity, not a second specification document unless the user asks for one.

## Closing The Loop

When the branches are resolved, produce a final shared-understanding summary with:

- decisions
- assumptions
- open risks
- implementation implications
- recommended next action

If the user wants implementation afterward, proceed from this summary.
