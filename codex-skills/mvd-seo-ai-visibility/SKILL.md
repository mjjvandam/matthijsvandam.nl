---
name: mvd-seo-ai-visibility
description: SEO, structured content and AI visibility optimization for MatthijsVanDam.nl. Use when Codex needs to audit, improve, draft, or review page titles, meta descriptions, H1/H2 structure, question-answer blocks, internal links, author/expertise signals, citeable paragraphs, schema.org/JSON-LD suggestions, search intent, snippets, or AI-summary readiness while preserving medical reliability and avoiding generic encyclopedia-style or commercial medical content.
---

# MVD SEO AI Visibility

## Purpose

Use this skill to improve `matthijsvandam.nl` for search engines and AI systems without weakening medical reliability, patient safety, professional positioning or publication governance.

This skill may propose SEO/content changes. Do not edit files, change indexability, add schema, update sitemap, or alter public status unless the user explicitly asks for implementation after the SEO/AI review.

## Required First Reads

Before auditing or optimizing a page, read:

1. `AGENTS.md`
2. `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
3. `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
4. `docs/site/INTERNAL_LINKING_MODEL.md`
5. `docs/site/PAGE_MODELS.md`
6. `docs/site/SITE_POSITIONING.md`
7. `docs/site/INVARIANTS.md`

For foot/ankle pages, pain-guide content or treatment pages, also read:

- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
- `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md` when concept treatment pages are involved.

If reviewing an existing page, read that HTML/content file and any relevant `content.js` entry before recommending changes. If a source or medical claim is not available, mark the item as `te valideren`.

## Core Principle

Optimize for findability by making the page more specific, better structured, more attributable and easier to summarize. Do not make the page more claim-based, commercial, directive or encyclopedic.

Good MVD SEO answers real questions in Matthijs' context:

- who is this page for;
- what question does it answer;
- what is generally known or explained;
- what remains uncertain;
- which safe next step fits the site;
- why Matthijs/ETZ/regio/project context is relevant.

## Review Workflow

### 1. Identify Page Intent

Classify the page:

- profile/person page;
- patient condition or treatment information;
- treatment/complaint hub;
- professional/referrer page;
- project page;
- article/update;
- publication overview;
- legal/safety page;
- concept page.

State the primary search intent:

- person search;
- complaint/condition question;
- treatment orientation;
- professional referral/samenwerking;
- project/research/education;
- publication/expertise;
- safety/legal.

### 2. Check The Required SEO/AI Elements

Evaluate or propose:

- `<title>`: specific, factual, not claim-based.
- Meta description: concrete page value plus safe boundary.
- H1: clear page topic.
- H2s: descriptive sections that can be summarized independently.
- Question-answer blocks: useful only when they answer real visitor questions safely.
- Internal links: route-aware and not pushing patient questions to consultancy.
- Author signals: name, role, ETZ/professional context, date/byline where appropriate.
- Expertise/experience signals: concrete projects, publications, education, ETZ/regional context, not vague authority.
- Citeable paragraphs: short, standalone paragraphs that AI/search snippets can quote or summarize without losing safety context.
- Schema.org: suggest only when it fits the page type and current site patterns.
- Publication/index status: no index changes without register and owner review.

### 3. Avoid Generic Encyclopedia Text

A page should not become a generic medical encyclopedia article. Keep it specific to:

- Matthijs' role and scope;
- ETZ/Tilburg/regional context where relevant;
- the site's three routes: patient, professional, advice;
- safe general information rather than exhaustive medical textbook coverage;
- practical search intent and user journey.

If a proposed section could appear unchanged on any hospital website, improve it by adding a concrete MVD-relevant angle, route boundary, project context, patient-safety nuance or internal-link purpose.

### 4. Preserve Medical Reliability

Do not improve SEO by adding:

- "beste", "snel", "effectief", "gespecialiseerd in elke..." claim language;
- diagnosis certainty;
- treatment recommendations for the reader;
- recovery guarantees;
- unverified outcome claims;
- overconfident FAQ answers;
- broad schema claims unsupported by the page;
- patient funnel language.

For medical pages and snippets, prefer:

- "kan passen bij";
- "algemene informatie";
- "de beoordeling hangt af van";
- "bespreek persoonlijke vragen via de officiële zorgroute";
- "dit vervangt geen medisch consult".

### 5. Schema.org Guidance

Suggest schema only when useful and consistent with current patterns:

- `Person` / `ProfilePage` for profile and homepage context.
- `MedicalWebPage` for patient-facing medical hubs or pages.
- `WebPage` for professional, advice and project pages.
- `Article` / `NewsArticle` only when article structure and source/date are clear.
- `FAQPage` only when visible FAQ content exists and answers are medically safe.
- `BreadcrumbList` may be useful if breadcrumb navigation is visible or implemented.

Do not add schema that makes concept/noindex pages look public or verified. Do not use schema to claim services, outcomes or treatment scope beyond the visible page.

### 6. Internal Link Rules

Always propose internal links. Classify each link:

- primary route;
- related patient information;
- related article/project;
- professional context;
- safety/legal;
- concept-only.

Use route-aware links:

- `behandelingen.html` for patient orientation;
- `professionals.html` for referrer/professional context;
- `advies-consultancy.html` only for non-patient advice;
- `artikelen.html` and relevant article paths for deeper context;
- `projecten.html` and relevant project paths for research/innovation context;
- `publicaties.html` for academic/professional authority;
- `disclaimer.html` and `privacy.html` for safety and data boundaries.

Flag concept/noindex links as not public until publication is approved.

## Output Format

For an SEO/AI audit:

```text
Page intent:

Current strengths:

SEO/AI gaps:

Suggested title/meta/H1-H2 changes:

Question-answer opportunities:

Internal link suggestions:

Author/expertise signals:

Citeable paragraph suggestions:

Schema.org suggestions:

Medical reliability risks:

Owner validation needed:
```

For implementation-ready recommendations, add:

```text
Do not touch:

Smallest safe change set:

Checks to run:
```

## Owner Validation

Owner validation is required when recommendations affect:

- medical claims;
- treatment indications or scope;
- public indexability;
- schema.org medical meaning;
- title/meta language for medical pages;
- author/expertise claims;
- concept page publication;
- canonical host decisions;
- out-of-scope topics such as Lisfranc/trauma boundaries.

If the change is purely structural and does not alter meaning, say: `Geen nieuwe medische claims, maar publicatiecontext blijft controleren.`

## Hard Guards

- Do not herposition the site for SEO.
- Do not turn pages into generic encyclopedia text.
- Do not add claim-based or commercial snippets.
- Do not imply diagnosis or treatment advice.
- Do not use schema.org to overstate expertise, treatment scope or verification.
- Do not make concept/noindex pages public.
- Do not change code or files unless explicitly asked after the review.
