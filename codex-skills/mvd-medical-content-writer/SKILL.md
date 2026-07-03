---
name: mvd-medical-content-writer
description: Dutch patient-facing medical content writing and improvement for MatthijsVanDam.nl. Use when Codex needs to draft, rewrite, structure, review, or improve patient-oriented pages, treatment explanations, condition text, FAQs, summaries, meta text, or related internal-link suggestions for the site. The skill enforces calm Dutch language, no remote diagnosis, no unproven claims, no commercial tone, SEO/AI-suitable structure, internal link proposals, and explicit medical owner-validation notes.
---

# MVD Medical Content Writer

## Purpose

Use this skill to create or improve Dutch patient-facing medical content for `matthijsvandam.nl` while preserving the site's positioning, medical safety, SEO/AI readability and publication workflow.

This skill may draft or revise text. It must not mark content as medically verified, publish pages, alter public status, or change application code unless the user explicitly asks for implementation and the local workflow permits it.

## Required First Reads

Before writing or revising patient-facing medical content, read:

1. `AGENTS.md`
2. `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
3. `docs/site/PAGE_MODELS.md`
4. `docs/site/INTERNAL_LINKING_MODEL.md`
5. `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
6. `docs/site/SITE_POSITIONING.md`
7. `docs/site/INVARIANTS.md`

For foot/ankle pain-guide or treatment-page work, also read:

- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
- `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md` when concept treatment pages are involved.

If the request is based on a specific existing page, read that page before writing. If the user provides source material, use that source as the evidence boundary. If a medical claim needs a source and none is available, mark it as `te valideren` instead of inventing support.

## Writing Workflow

### 1. Define Scope

Before drafting, state or infer:

- target page or artifact;
- patient question or search intent;
- content type: condition page, treatment explanation, hub intro, FAQ, article section, summary, meta text or link suggestions;
- publication status: concept, existing public page or draft-only text.

If the request could change positioning, treatment scope, public indexability or foot/ankle pain-guide behavior, use `$mvd-site-product-steward` first or explicitly flag owner validation before proceeding.

### 2. Write In The Site Voice

Write in Dutch:

- helder;
- rustig;
- concreet;
- patiëntgericht;
- menselijk;
- niet-commercieel;
- niet-stigmatiserend;
- terughoudend bij onzekerheid.

Prefer plain language over specialist jargon. When a medical term is useful, explain it briefly in ordinary Dutch.

Avoid:

- "de beste behandeling";
- "u heeft waarschijnlijk";
- "u moet";
- guaranteed outcomes;
- funnel or appointment pressure;
- promotional superlatives;
- overconfident reassurance;
- AI-like abstract filler.

### 3. Preserve Medical Safety

Always keep these boundaries:

- no diagnosis at a distance;
- no individualized treatment advice;
- no unproven or unsupported claims;
- no recovery guarantees;
- no medication advice on maat;
- no replacement of GP, ETZ, emergency care or official care routes;
- no patient data collection via the website.

Use safe formulations:

- "kan passen bij";
- "kan een rol spelen";
- "de beoordeling hangt af van...";
- "dit is algemene informatie";
- "bij persoonlijke medische vragen loopt de route via de huisarts, behandelend arts of het ETZ";
- "bij spoed of alarmsignalen: volg de officiële spoedroute".

### 4. Use SEO And AI-Friendly Structure

Structure content so a patient, search engine and AI summary can identify:

- what the complaint or condition is;
- what symptoms or situations can be relevant;
- what else can resemble it;
- how assessment usually works in general terms;
- what broad treatment directions exist;
- what the limits of the page are;
- what safe next step fits the site.

Good patient-page sections:

- Korte samenvatting
- Wat is het?
- Welke klachten kunnen erbij passen?
- Waardoor kan het komen?
- Wat kan erop lijken?
- Hoe wordt het beoordeeld?
- Welke behandelmogelijkheden zijn er in grote lijnen?
- Wanneer contact opnemen via officiële zorgkanalen?
- Veelgestelde vragen
- Gerelateerde informatie

Use only the sections that fit the requested artifact. Do not force all sections into short copy.

For metadata, propose:

- `<title>`: factual, specific, not claim-based;
- meta description: patient search intent plus safety boundary;
- H1: clear complaint or condition name;
- H2s: descriptive and scannable.

### 5. Propose Internal Links

Always include internal link suggestions. Classify them as:

- primary patient route;
- related condition or treatment context;
- related article;
- safety/legal route;
- professional route only if relevant.

Use existing route patterns:

- `behandelingen.html`
- relevant `behandelingen/*.html` only if concept/public status is appropriate;
- `artikelen.html` or relevant article paths;
- `professionals.html` only for professional context;
- `disclaimer.html`
- `privacy.html`
- `index.html#contact` only for general contact context, not patient triage.

If an internal link points to a concept/noindex page, mark it as `alleen concept / niet publiek linken zonder publicatiebesluit`.

### 6. Owner Validation

Always end with a section:

```text
Medische eigenaar-validatie nodig:
- ...
```

Use `geen nieuwe medische claims` only when the task truly only restructures or shortens existing approved text without adding meaning.

Owner validation is required for:

- new medical explanations;
- altered treatment indications;
- claims about outcomes, risks, recovery or diagnosis;
- differential diagnosis lists;
- safety/alarm-signal text;
- content that may imply treatment scope;
- public release of concept content;
- foot/ankle pain-guide mapping or result text.

## Output Format

For drafting tasks:

```text
Doel en doelgroep:

Concepttekst:

SEO/AI-structuur:

Interne links:

Medische eigenaar-validatie nodig:
```

For improvement/rewrite tasks:

```text
Wat ik heb aangepast:

Herziene tekst:

Interne links:

SEO/AI-aandachtspunten:

Medische eigenaar-validatie nodig:
```

For page-ready content, include concise metadata suggestions before the final validation section.

## Hard Guards

- Do not diagnose the reader.
- Do not recommend a treatment for the reader personally.
- Do not make unverified claims.
- Do not use commercial SEO tone.
- Do not turn patient information into a referral funnel.
- Do not make out-of-scope topics look like Matthijs' treatment offering.
- Do not publish, index, or mark content as verified.
- Do not change code or files unless the user explicitly asks for implementation after the draft/review.
