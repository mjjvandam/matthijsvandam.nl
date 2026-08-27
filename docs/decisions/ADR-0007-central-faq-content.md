# ADR-0007: Central FAQ Content And Reuse

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-08-26.

## Context

Matthijsvandam.nl uses visible question-and-answer sections on concept treatment pages and, on those pages, a second representation in `FAQPage` JSON-LD. The same medical subject can also return in articles, such as the concept article about the 2026 AAOS guideline for ankle osteoarthritis. Without a shared source, wording, evidence status and review state can drift between pages and between visible HTML and structured data.

The repository snapshot of 2026-08-26 contains:

- 35 treatment pages with a visible FAQ section and `FAQPage` JSON-LD;
- 258 visible questions on those treatment pages;
- one concept article preview with five additional visible questions;
- one confirmed visible/JSON-LD question mismatch;
- 20 groups of literally repeated or normalized-identical question wording and 144 similarity candidates that still require contextual editorial assessment.

Repeated wording does not automatically mean that answers should be merged. A question such as "Wanneer wordt een operatie besproken?" can require a different medical answer for each condition. Reuse is only safe when question, answer, audience, evidence boundary and intended follow-up are materially the same.

Google stopped showing FAQ rich results on 2026-05-07 and removed the FAQ rich-result documentation on 2026-06-15. Google also states that structured data is not required for generative AI search and that no special schema.org markup is needed for those features. FAQ content therefore remains useful primarily because it answers real visitor questions in visible, well-structured, reliable text; `FAQPage` JSON-LD is not treated as a growth mechanism.

Current source basis:

- `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
- `docs/site/PAGE_MODELS.md`
- `docs/site/INTERNAL_LINKING_MODEL.md`
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
- `docs/site/INVARIANTS.md`
- `docs/site/KNOWN_DRIFT_RISKS.md`
- `docs/decisions/ADR-0004-seo-ai-visibility.md`
- `docs/decisions/ADR-0005-medical-content-safety.md`
- `docs/decisions/ADR-0006-publication-governance.md`
- `docs/site/reviews/faq-inventory-2026-08-26.md`
- Google Search Central, `https://developers.google.com/search/updates`
- Google Search Central, `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`

## Decision

### 1. Patient value is the primary purpose

FAQ content is written first for a real visitor question. Search and AI visibility follow from clear, specific, well-sourced and independently understandable answers. Questions must not be added only to capture keyword variants.

Patient-facing answers use this editorial sequence where applicable:

1. direct answer in the opening sentences;
2. concrete explanation;
3. uncertainty or evidence boundary;
4. safe general follow-up and official-care boundary;
5. source and review context for claim-sensitive subjects.

### 2. One central source of truth

FAQ content will be stored outside `content.js` in a dedicated data source. Each reusable FAQ receives at least:

- a stable `id`;
- `question` and visible `answerHtml`;
- `audience` and `topics`;
- a `primaryPage` and stable anchor;
- source references where relevant;
- medical review status and review date;
- publication-scope metadata that cannot override the page's own publication status.

`content.js` remains the source for existing cards, filters and pain-guide data and is not expanded into the FAQ registry.

### 3. Reuse has three explicit modes

- `full`: the complete question and answer on its primary FAQ page.
- `link`: a concise, contextual introduction followed by a deep link to the primary answer.
- `context`: a genuinely page-specific question and answer, for example about the applicability of a new guideline in the Netherlands.

A reusable FAQ has no more than one `full` placement unless a documented editorial exception is approved. Similar wording alone is not enough to centralize answers from different medical contexts.

The term `primaryPage` is an editorial ownership rule and does not change HTML canonical tags.

### 4. Static HTML remains the delivery format

A dependency-free repository generator creates the visible FAQ HTML before review or publication. FAQ answers are not dependent on browser-side JavaScript. Generated blocks receive stable anchors so articles and related pages can link directly to the relevant answer.

Generated sections use existing `<section>`, `<details>` and `<summary>` patterns and preserve the current calm visual identity and accessibility behavior.

### 5. Validation is mandatory

A repository check must fail or warn, as appropriate, for:

- unknown or duplicate FAQ IDs;
- more than one unapproved `full` placement;
- missing primary pages or anchors;
- exact duplicate questions across unrelated records;
- likely near-duplicates that require editorial review;
- visible/schema drift while FAQ schema is retained;
- missing medical review or source state for claim-sensitive answers;
- public links to concept-only primary pages;
- generated output that differs from the checked-in HTML.

Automated similarity findings are review candidates, not automatic medical merge decisions.

### 6. `FAQPage` JSON-LD is transitional, not a growth target

During migration, existing `FAQPage` JSON-LD may remain to avoid an unrelated broad deletion. Where retained, it must be generated from the same record as the visible answer and must match it.

No SEO result, rich result or AI visibility benefit may be claimed from retaining `FAQPage`. Removal of all existing FAQ schema can be considered after the central migration, but it is not silently bundled into the first pilot.

Article pages continue to use the structured-data type appropriate to the page itself. They do not receive `QAPage` merely because they contain author-written questions and answers.

### 7. Migration is cluster-based and preserves meaning

The first pilot is the ankle-osteoarthritis cluster:

- `behandelingen/enkelartrose.html` remains the primary location for evergreen patient questions;
- the AAOS guideline concept article keeps only guideline- and evidence-specific FAQ questions as `context` content;
- overlapping injection questions in the article become contextual prose or `link` placements instead of independently maintained full answers;
- existing user edits are preserved and reviewed before any generated replacement is written.

Further treatment pages migrate by medically coherent cluster. Mechanical migration must not merge, rewrite or medically approve answers by inference.

### 8. Existing publication governance remains unchanged

This ADR does not publish any concept page, alter robots directives, change sitemap entries, change canonical hosts, modify `.vercelignore`, or set a medical/professional page to `geverifieerd`.

Material medical wording changes remain subject to owner review under ADR-0005. Public/concept and `review_nodig`/`geverifieerd` rules remain governed by ADR-0006.

## Consequences

- Patients get fewer repeated FAQ blocks and clearer, condition-specific answers.
- Articles can cover current evidence without becoming competing evergreen answer pages.
- Search engines and AI systems receive visible, static, internally linked and attributable content.
- Medical answers, source status and review dates can be maintained once.
- The repository gains a generation step and a dedicated FAQ validation check.
- The initial migration requires careful comparison with existing user edits and cannot be treated as a purely mechanical rewrite.
- Existing FAQ schema remains maintenance-only during the transition and is not used as a success metric.

## Success criteria

The decision is successfully implemented when:

- the central FAQ registry and placement manifest validate;
- the ankle-osteoarthritis pilot has one maintained full answer per reusable question;
- article-specific FAQ questions remain distinct from evergreen patient questions;
- generated visible FAQ content is static and accessible;
- retained JSON-LD, if any, exactly matches visible questions and answers;
- all existing repository checks and the new FAQ check pass;
- mobile review at 360, 390 and 430 px finds no FAQ regression;
- publication and medical-review statuses remain evidence-backed and unchanged unless explicitly approved;
- the remaining pages have been migrated by reviewed medical cluster, not by uncontrolled global replacement.

## What must not change without a new ADR

- Patient usefulness must remain the primary reason for FAQ content.
- Medical answers must not be merged solely because question wording is similar.
- The central FAQ source must not override publication governance or medical owner review.
- FAQ rendering must not become dependent on client-side JavaScript.
- FAQ schema must not be presented as a guaranteed search or AI visibility mechanism.
- A change from one primary full answer to unrestricted full duplication requires an explicit ADR check.

## Owner validation requested

Acceptance of this ADR authorizes the central registry, placement modes, static generator, validator and ankle-osteoarthritis pilot described above. It does not itself approve new medical wording or release concept pages for publication.
