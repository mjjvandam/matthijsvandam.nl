---
name: mvd-site-product-steward
description: Product stewardship for MatthijsVanDam.nl. Use before changes, reviews, plans, prompts, content edits, SEO/AI visibility work, internal linking changes, page model changes, publication decisions, foot/ankle pain-guide work, medical content updates, or any task that could affect the site's positioning, content pillars, medical reliability, professional authority, or drift risk. This skill performs a pre-change assessment and must not write code unless the user explicitly asks for implementation afterwards.
---

# MVD Site Product Steward

## Purpose

Use this skill as a pre-change guardrail for `matthijsvandam.nl`. It helps Codex decide whether a proposed change fits the current site, which site layer it affects, what drift risks exist, what must remain untouched, and whether owner validation is needed.

Do not write code, edit content, update metadata, change files, or run implementation steps while using this skill unless the user explicitly asks for implementation after the stewardship pass.

## Required First Reads

Before giving a stewardship recommendation, read the current repo evidence in this order:

1. `AGENTS.md`
2. `docs/site/CURRENT_SITE_STATE.md`
3. `docs/site/SITE_POSITIONING.md`
4. `docs/site/TARGET_AUDIENCES.md`
5. `docs/site/CONTENT_PILLARS.md`
6. `docs/site/PAGE_MODELS.md`
7. `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
8. `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
9. `docs/site/INTERNAL_LINKING_MODEL.md`
10. `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
11. `docs/site/INVARIANTS.md`
12. `docs/site/KNOWN_DRIFT_RISKS.md`

If a file is missing, say which file is missing and continue from available repo evidence. Do not infer a new strategy to fill documentation gaps.

For tasks that only touch one narrow layer, still read `AGENTS.md`, `CURRENT_SITE_STATE.md`, `SITE_POSITIONING.md`, `INVARIANTS.md`, and the directly relevant layer document.

## Stewardship Workflow

### 1. Identify The Affected Site Layer

Classify the request into one or more layers:

- personal positioning and homepage narrative;
- patient information;
- professional/referrer information;
- advice and consultancy;
- content pillars and topic scope;
- page model or template;
- article or project content;
- medical source chain and claim safety;
- SEO, metadata, structured data or AI visibility;
- internal links and user journeys;
- concept versus public publication state;
- `PUBLICATIE_REGISTER.json`, sitemap, robots or canonical logic;
- foot/ankle pain guide and concept treatment pages;
- visual identity, accessibility or mobile UX;
- contact routes, privacy or disclaimer boundaries;
- documentation and governance only.

State the affected layer before recommending anything.

### 2. Compare Against Current State

Summarize what the current repo says. Use concise confidence labels when useful:

- `zeker`: directly stated in `AGENTS.md`, `docs/site`, current HTML/data, register, sitemap or checks.
- `aannemelijk`: follows from current structure but is not explicit.
- `te valideren`: requires Matthijs' decision or live-state confirmation.

Do not convert `te valideren` into a decision.

### 3. Name Drift Risks

Name concrete drift risks for the affected layer. Common risks:

- site becomes a patient portal or advice route;
- patient, professional and consultancy routes blur;
- Matthijs is repositioned beyond current site scope;
- Mobility Clinic, cartilage transplantation, AI or consultancy becomes the homepage narrative;
- SEO snippets become claim-based or commercial;
- concept pages become public accidentally;
- a page becomes indexable without register and owner review;
- Lisfranc or other out-of-scope trauma content reads as treatment offering;
- foot/ankle pain guide becomes a symptom checker, diagnosis tool or triage tool;
- internal links send patients to consultancy or direct e-mail for medical questions;
- project content drifts away from orthopedics, ETZ, region or official care routes;
- visual changes weaken the calm medical identity.

Reference the relevant doc path where possible.

### 4. Say What Must Remain Untouched

Explicitly list what should not be changed for the current task. Typical protected areas:

- application code, HTML/CSS/JS or data files when the user asks for analysis, planning or documentation only;
- site positioning and homepage narrative unless explicitly requested;
- medical claims and public verification status without owner validation;
- `PUBLICATIE_REGISTER.json`, `sitemap.xml`, robots, canonicals and `.vercelignore` unless publication state is in scope;
- concept treatment pages and pain-guide public visibility unless public release is in scope;
- foot/ankle pain guide mapping, result logic and safety copy unless explicitly in scope;
- Lisfranc/out-of-scope trauma boundaries;
- contact routes, privacy/disclaimer boundaries and official care-channel language;
- visual identity and CSS system unless explicitly in scope.

### 5. Decide The Next Action Type

Recommend one of:

- answer only;
- documentation-only update;
- content review before editing;
- SEO/internal-link review before editing;
- medical source-chain review first;
- owner validation first;
- technical validation first;
- implementation only after explicit approval.

If implementation may be needed later, describe the smallest safe implementation path, but do not perform it under this skill unless the user has explicitly asked for code/content changes after the stewardship assessment.

## Output Format

Use this compact structure:

```text
Affected layer:

Current-state basis:

Drift risks:

Do not touch:

Recommended next step:

Needs owner validation:
```

Keep the answer practical. Do not write a new site vision, roadmap, redesign, product strategy or content architecture unless the user explicitly asks for that after the stewardship pass.

## Hard Guards

- Do not herposition MatthijsVanDam.nl without explicit permission.
- Do not turn the site into a patient portal, triage tool or appointment route.
- Do not introduce medical advice on maat, diagnosis claims, treatment claims or recovery guarantees.
- Do not make concept pages public without an explicit publication decision.
- Do not mark medical or professional content as `geverifieerd` without explicit owner approval.
- Do not change sitemap, robots, canonical host, structured data or public indexability as part of stewardship.
- Do not treat the foot/ankle pain guide as a diagnosis or triage tool.
- Do not turn Lisfranc/out-of-scope trauma content into a treatment offering.
- Do not broaden SEO/AI visibility with commercial or claim-based language.
- Do not write code unless the user explicitly requests implementation after the stewardship analysis.
