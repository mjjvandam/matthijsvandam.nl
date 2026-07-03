# ADR-0004: SEO And AI Visibility

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03.

## Context

The current site uses SEO and structured content to support findability for person search, local professional context, complaint-oriented orientation, professional expertise, projects, research, education and care development.

Current SEO/AI building blocks include:

- `sitemap.xml` with 29 public URLs;
- `robots.txt` with sitemap reference and blocks for `beeldbank/` and `concept-foot-pain-guide.html`;
- canonical URLs on public pages;
- meta descriptions;
- OpenGraph and Twitter metadata;
- JSON-LD on core pages, articles and projects;
- clear H1/H2 structure;
- internal links between hubs, articles, projects, publications and disclaimer;
- `PUBLICATIE_REGISTER.json` as human publication governance.

Current source basis:

- `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
- `docs/site/INTERNAL_LINKING_MODEL.md`
- `docs/site/CURRENT_SITE_STATE.md`
- `docs/site/KNOWN_DRIFT_RISKS.md`

Uncertainties:

- Canonical host choice between apex and `www`: needs owner validation.
- Whether every future article needs its own structured data or current patterns are sufficient: needs owner validation.
- Whether `beeldbank/` is technically shielded enough if it remains internal: needs owner validation.

## Decision

SEO and AI visibility must support the current site positioning and medical reliability. They must not override safety, expand treatment scope or introduce commercial medical language.

Titles, descriptions, headings, schema and snippets should help search engines and AI systems understand:

- who Matthijs is;
- where he works;
- the relevant expertise areas;
- which routes are meant for patients, professionals and non-patient-bound partners;
- that the site gives general information, not personal medical advice.

Indexable pages must remain consistent with sitemap, robots, canonical and `PUBLICATIE_REGISTER.json`.

## Consequences

SEO work must be route-aware and medically conservative. It should answer real search intent without turning pages into generic encyclopedia text or marketing pages.

New public pages or material changes to public medical/professional pages require register review. Concept pages stay `noindex`, outside sitemap and outside public deployment until explicitly released.

AI-readable content should use clear, citeable paragraphs and visible disclaimers, but not claim-based summaries.

## What must not change without a new ADR

- SEO must not introduce words such as "beste", "snel herstellen", guarantees or broad specialist claims.
- Metadata and schema must not imply treatment scope, services or verification beyond visible reviewed content.
- Concept pages must not become indexable without publication approval.
- Sitemap, robots, canonical host, structured data strategy or public indexability must not change silently.
- Medical safety must remain stronger than search optimization.
- A change in SEO strategy, AI-visibility strategy, publication/indexation rules, sitemap/robots/canonical policy, schema.org meaning, public metadata model or snippet-safety rules requires an explicit ADR check.
- If such an SEO, AI-visibility or indexation change is not already covered by an Accepted ADR, Codex must propose a new ADR and stop for owner validation before implementation.
