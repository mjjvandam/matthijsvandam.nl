# ADR-0003: Foot And Ankle Pain Guide

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03.

## Context

The Voet- en enkelpijnwijzer is currently a local concept module:

- `concept-foot-pain-guide.html`
- data and renderer in `content.js`
- `noindex, nofollow`
- excluded from deployment through `.vercelignore`
- checked with `python3 tools/check_foot_pain_guide.py`

The current model contains 6 views, 17 pain regions, 35 foot/ankle cards, one separate treatment topic and a review/mapping layer. It is intended as a general reading guide, not as a diagnosis or triage tool.

Current source basis:

- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
- `docs/site/INTERNAL_LINKING_MODEL.md`
- `docs/site/INVARIANTS.md`
- `docs/site/KNOWN_DRIFT_RISKS.md`
- `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md`

Uncertainties:

- Final medical mapping per pain region: needs owner validation.
- Whether all 35 concept landing pages should be connected at once or phased: needs owner validation.
- Whether the public name remains "Voet- en enkelpijnwijzer": needs owner validation.
- Whether the guide becomes standalone public content or part of `behandelingen.html`: needs owner validation.

## Decision

The foot/ankle pain guide remains a visual navigation aid and general reading guide.

It must not diagnose, triage, rank urgency, replace a consultation or recommend treatment for an individual situation. Results must be framed as reading directions, using language such as "mogelijke oorzaken", "past bij klachten zoals" and "kan passen bij".

Click/tap is the primary interaction model. Hover may only be supplementary. Mobile usability around 360, 390 and 430 px must be checked before public release.

Each pain region should connect to existing or planned condition/treatment information, or carry a clear no-public-link explanation. Out-of-scope trauma topics may remain as orientation/differential data only when medically useful.

`lisfranc-middenvoetletsel` remains differential-only: no public treatment card, no public treatment-page link and no treatment-offer signal unless Matthijs explicitly decides otherwise.

## Consequences

Any change to pain regions, card mapping, result logic, safety text or public status requires owner validation.

Publication requires medical review of the mapping and card texts, visible safety text, mobile/touch/keyboard checks, register and sitemap decisions, and a clear public placement decision.

Concept treatment pages may support the guide locally, but must not be treated as public content until reviewed and explicitly released.

## What must not change without a new ADR

- The guide must not become a diagnosis wizard, symptom checker or triage tool.
- The guide must not give personalized treatment advice.
- Results must not be presented as medical conclusions.
- Concept/noindex/deployment-exclusion status must not be removed without a publication decision.
- Lisfranc or other out-of-scope trauma topics must not become public treatment offerings.
- A change in guide purpose, public name, public placement, concept/public status, pain-region model, card mapping, result logic, safety text, medical meaning or treatment-scope interpretation requires an explicit ADR check.
- If such a foot/ankle pain-guide change is not already covered by an Accepted ADR, Codex must propose a new ADR and stop for owner validation before implementation.
