---
name: mvd-foot-pain-guide
description: Build and improve the visual foot/ankle pain guide for MatthijsVanDam.nl. Use when Codex works on concept-foot-pain-guide.html, painRegions, footPainConditions, footPainTreatmentTopics, region mapping, SVG hotspots, mobile/touch interaction, keyboard accessibility, guide safety copy, card linking, planned condition/treatment pages, or related checks. The skill keeps the guide a visual navigation aid, not a diagnosis wizard or medical triage tool.
---

# MVD Foot Pain Guide

## Purpose

Use this skill to build, review or improve the Voet- en enkelpijnwijzer for `matthijsvandam.nl`.

The pain guide is a visual navigation aid for general orientation. It is not a diagnosis wizard, triage tool, treatment selector or patient portal. Do not write or edit code/content unless the user explicitly asks for implementation after the review.

## Required First Reads

Before making recommendations or edits, read:

1. `AGENTS.md`
2. `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
3. `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
4. `docs/site/INTERNAL_LINKING_MODEL.md`
5. `docs/site/INVARIANTS.md`
6. `docs/site/PAGE_MODELS.md`
7. `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md` when concept condition/treatment pages are involved.

For implementation work, also read the relevant current files before changing anything:

- `concept-foot-pain-guide.html`
- `content.js`
- `styles.css`
- `script.js`
- `tools/check_foot_pain_guide.py`

If a required file is missing or contradicts another source, say so and mark the affected decision as `te valideren`.

## Core Model

Preserve the current model unless Matthijs explicitly approves a change:

- The module is `concept-foot-pain-guide.html`.
- Data and rendering live in `content.js`.
- Current public status is concept/noindex and excluded from deployment.
- The guide is a leeswijzer: results are reading directions, not medical conclusions.
- The current structure has 6 views, 17 pain regions, 35 content cards and separate treatment topic handling.
- Every region should link to existing or planned condition/treatment information, or carry a clear no-public-link explanation.
- Out-of-scope trauma topics may exist as orientation/differential data only when medically useful.
- `lisfranc-middenvoetletsel` stays differential-only: no public treatment card, no public treatment-page link and no treatment-offer signal unless Matthijs explicitly changes that scope.

## Layer Classification

At the start of every review, state which guide layer is touched:

- visual body map, view, SVG or hotspot;
- pain region definition;
- region-to-card mapping;
- condition/complaint card;
- treatment topic;
- internal link or planned page link;
- safety/disclaimer text;
- mobile/touch/keyboard interaction;
- metadata/publication/indexability;
- validation tooling.

Then name what must stay untouched. Examples: no public status change, no new treatment-scope signal, no change to Lisfranc boundary, no redesign of the site identity, no route from patient questions to consultancy.

## Medical Writing Rules

Write in Dutch, calmly and concretely.

Prefer formulations such as:

- "mogelijke oorzaken"
- "past bij klachten zoals"
- "kan passen bij"
- "algemene informatie"
- "leesrichting"
- "bespreek persoonlijke vragen via de officiele zorgroute"

Avoid:

- "u heeft"
- "uw diagnose"
- "dit betekent waarschijnlijk"
- "u moet"
- direct treatment advice from a selected pain spot;
- reassurance, urgency or referral advice based only on the guide interaction;
- claims that a treatment is best, fast, certain or personally suitable.

Safety warnings may be present, but keep them general and route visitors to official care channels for trauma, acute worsening, infection signs, severe pain, loss of function, personal questions or emergencies.

## Mapping Workflow

Use this workflow for region or card changes:

1. Identify the affected view, region id, card id and page URL.
2. Confirm the item type: general information, complaint, condition, injury, posture issue, tendon complaint, treatment topic or exclusion.
3. Check reciprocal consistency between `painRegions`, condition cards and any review/mapping table.
4. Confirm each region resolves to readable information or a clear planned/no-public-link state.
5. Do not make treatment topics appear as outcome cards unless the existing model and owner decision support that.
6. Keep concept links concept-only until publication is explicitly approved.
7. Mark new or changed medical mapping as needing owner validation.
8. Run `python3 tools/check_foot_pain_guide.py` after implementation.

## Interaction And Mobile Rules

Click/tap is the primary interaction. Hover may only add extra convenience.

Check or preserve:

- tap targets that work on mobile;
- no hover-only access to guide results;
- visible active region and selected view states;
- keyboard/focus access where applicable;
- a clear reset or back path;
- no body overflow or clipped text at narrow widths;
- mobile layouts around 360, 390 and 430 px when UI is touched;
- no overlapping hotspots that make common taps unreliable.

## SEO, Links And Publication

Do not change indexability, sitemap, robots, canonical, structured data, `.vercelignore` or `PUBLICATIE_REGISTER.json` for the guide unless the user explicitly asks for a publication-oriented change.

For internal links:

- patient-facing links should stay within general patient information and safe care-route context;
- concept treatment pages remain concept/noindex until reviewed;
- every region should point to an existing or planned page where appropriate;
- out-of-scope topics need a no-public-link explanation instead of a treatment-page link;
- no link may imply Matthijs treats a topic outside the current scope.

## Checks

For implementation work, run the smallest relevant set:

- `python3 tools/check_foot_pain_guide.py` for any pain-guide data, mapping or UI change.
- `python3 tools/check_site_quality.py` for HTML/CSS/JS changes.
- `python3 tools/check_publication_verification.py` and `python3 tools/check_seo_basics.py` if public status, metadata, sitemap, register or indexable pages are touched.
- Browser/mobile checks when visual regions, layout or interactions are touched.

If no `package.json` exists, do not invent npm lint/build steps.

## Output Format

Use this compact format for audits, plans or recommendations:

```text
Affected guide layer:
Current-state basis:
Proposed change:
Do not touch:
Safety wording:
Region/page links:
Interaction/mobile notes:
Drift risks:
Checks to run:
Owner validation needed:
```

For completed implementation, add:

```text
Files changed:
Checks run:
Public status:
Remaining validation:
```

## Owner Validation

Owner validation is required for:

- new or changed pain regions;
- medical mapping between regions and cards;
- result logic or ranking;
- safety/disclaimer wording;
- adding/removing public links to condition or treatment pages;
- Lisfranc or other out-of-scope trauma boundaries;
- making the concept guide public;
- any wording that changes treatment scope, expertise claims or medical meaning.

Purely technical fixes that preserve meaning still require a short note explaining that medical content and public status were not changed.

## Hard Guards

- Do not turn the guide into a diagnosis wizard.
- Do not automate triage or urgency decisions.
- Do not provide personalized treatment advice.
- Do not use definitive diagnosis language.
- Do not rely on hover as the only interaction.
- Do not publish or index the guide without explicit approval.
- Do not create public treatment signals for out-of-scope topics.
- Do not redesign the site or visual identity while improving the guide.
