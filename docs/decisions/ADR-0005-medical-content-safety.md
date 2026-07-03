# ADR-0005: Medical Content Safety

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03.

## Context

The site gives general medical and professional information. It is not a patient portal, not a place for personal medical advice and not a route for sharing patient data.

Matthijs remains medically and content-wise responsible. Codex may support structure, tone, technical quality, findability and safety boundaries, but must not mark medical content as verified without explicit owner approval.

Current source basis:

- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
- `docs/site/SITE_POSITIONING.md`
- `docs/site/TARGET_AUDIENCES.md`
- `docs/site/PAGE_MODELS.md`
- `docs/site/INVARIANTS.md`
- `PUBLICATIE_REGISTER.json`

Uncertainties:

- Whether a new or changed medical page has been sufficiently reviewed by Matthijs: needs owner validation.
- Whether external partner or project claims remain current: needs owner validation.
- Whether a source is current enough for publication-oriented interpretation: needs owner validation.

## Decision

Medical content remains general, calm, concrete, human and non-stigmatizing.

The site must not:

- diagnose through text, filters or interactive modules;
- recommend treatment for an individual situation;
- give guarantees about recovery, surgery, effect or outcome;
- apply pressure toward appointments, referrals, operations or consultancy;
- give personalized medication advice;
- invite patient data sharing through the site.

For personal medical questions, appointments and emergencies, the site must point to official care channels.

Medical news or research-based content must use media only as a signal. The underlying primary source, guideline, conference/society source or official medical source must be checked and its status described plainly.

For obesity and knee osteoarthritis, wording must be understanding, non-moralizing, non-stigmatizing and attentive to load, context and suitable support.

## Consequences

New or materially changed public medical/professional pages must be set to `review_nodig` until Matthijs explicitly approves them.

Interactive tools such as the foot/ankle pain guide must state clearly that they are not diagnostic, must not automate triage and must present outcomes as reading directions.

SEO, internal links and page templates must preserve medical boundaries, not create funnel pressure or imply personal suitability.

## What must not change without a new ADR

- The site must not provide personal medical advice.
- The site must not diagnose, triage or recommend individual treatment.
- Public medical content must not be marked `geverifieerd` without explicit owner approval.
- Medical claims, treatment scope, safety wording and publication status require owner validation.
- Research/news content must not be published from media coverage alone.
- The patient/professional/consultancy separation must not be weakened by medical content changes.
- A change in medical safety rules, source-chain rules, review responsibility, owner-validation requirements, claim policy, treatment-scope interpretation, diagnosis/triage boundary or publication verification rule requires an explicit ADR check.
- If such a medical content safety change is not already covered by an Accepted ADR, Codex must propose a new ADR and stop for owner validation before implementation.
