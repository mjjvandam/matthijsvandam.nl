# ADR-0006: Publication Governance

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03.

## Context

The current repo uses a strict distinction between public and concept content. This distinction is spread across `AGENTS.md`, `docs/site/CURRENT_SITE_STATE.md`, `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`, `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`, `docs/site/INVARIANTS.md`, `docs/site/KNOWN_DRIFT_RISKS.md`, `PUBLICATIE_REGISTER.json`, `sitemap.xml`, robots metadata, canonicals, `.vercelignore` and validation scripts.

The current public layer has 29 sitemap pages and 29 entries in `PUBLICATIE_REGISTER.json`, all marked `geverifieerd` at the last documented audit. Local concept treatment pages and `concept-foot-pain-guide.html` remain `noindex, nofollow` and outside deployment scope.

Uncertainties:

- Canonical host choice between apex and `www`: needs owner validation.
- Whether `beeldbank/` is technically shielded enough if it remains internal: needs owner validation.
- Medical review of concept treatment pages before publication: needs owner validation.
- Medical review and public placement of the foot/ankle pain guide before publication: needs owner validation.

## Decision

Publication status is governed by these definitions:

- `Public`: a page is public when it is in `sitemap.xml` or has `meta name="robots" content="index, follow"`.
- `Concept`: a page or module is concept when it is `noindex`, outside `sitemap.xml`, or excluded from deployment through `.vercelignore`.
- `review_nodig`: a public medical/professional page or materially changed public medical/professional page is waiting for owner review.
- `geverifieerd`: owner-approved public page. Codex must not set or treat this status as complete without explicit owner approval.

`PUBLICATIE_REGISTER.json` is the human publication-governance register for public pages. `sitemap.xml`, robots metadata, canonical host choices and `.vercelignore` are publication-scope controls and must stay consistent with the register and current concept/public boundaries.

Codex may propose publication-status changes, but must not independently publish concept content, change verification status to `geverifieerd`, change indexability, or alter sitemap/robots/canonical/deployment scope for medical or professional content without owner validation.

## Consequences

Before a page or module becomes public, the relevant content, metadata, internal links, sitemap/register state and medical safety boundaries must be reviewed together.

For public medical/professional pages, material changes must return the page to `review_nodig` until Matthijs explicitly approves it.

Relevant checks include:

- `python3 tools/check_site_quality.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_seo_basics.py`
- `python3 tools/check_foot_pain_guide.py` when the foot/ankle pain guide or its mappings are touched.
- `python3 tools/check_treatment_page_quality.py` when treatment pages are touched.

## What must not change without a new ADR

- The definition of `Public`, `Concept`, `review_nodig` or `geverifieerd`.
- The role of `PUBLICATIE_REGISTER.json` as publication-governance register.
- The rule that Codex may not mark medical/professional content `geverifieerd` without explicit owner approval.
- The rule that concept/noindex/deployment-excluded content stays outside public scope until deliberately released.
- The relationship between `sitemap.xml`, robots metadata, canonical host, `.vercelignore`, register status and publication checks.
- Any change that makes concept treatment pages, the foot/ankle pain guide or other medical/professional concept content public.
