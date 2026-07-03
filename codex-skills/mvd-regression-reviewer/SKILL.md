---
name: mvd-regression-reviewer
description: Regression review for MatthijsVanDam.nl after code, content, SEO, internal-link, page-template, pain-guide, metadata, publication, accessibility, mobile, or documentation changes. Use when Codex must verify that the site remains strategically positioned, medically safe, technically intact, SEO/AI-safe, internally linked, mobile-usable, and aligned with existing MVD site governance. Reports blocking issues, non-blocking issues, drift risks, and concrete recovery actions.
---

# MVD Regression Reviewer

## Purpose

Use this skill after changes to `matthijsvandam.nl` to check whether the site is still intact across content, strategy, medical safety, SEO/AI visibility, internal links, templates, mobile behavior and validation checks.

This is a review skill. Do not fix files, rewrite content, change metadata, publish concept pages, or update registers unless the user explicitly asks for remediation after the regression review.

## Required First Reads

Always read:

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

Then read the changed files and any directly related source files:

- `git diff --name-only` or the user-provided file list;
- touched HTML/CSS/JS/data files;
- related entries in `content.js`;
- related concept/public pages;
- `PUBLICATIE_REGISTER.json`, `sitemap.xml`, robots/canonical files, or `.vercelignore` when publication/indexability may be affected.

If a required source is missing, state that in the review and reduce confidence for that layer.

## Review Scope

Classify the touched layers before judging the change:

- positioning, homepage narrative or professional authority;
- patient information or medical claims;
- referrer/professional information;
- advice/consultancy route;
- foot/ankle pain guide;
- page model or template;
- SEO, metadata, schema, sitemap, robots or canonical;
- internal links and user journey;
- visual identity, accessibility or mobile behavior;
- publication register or concept/public boundary;
- validation tooling only;
- documentation/governance only.

## Regression Checks

### 1. Positioning

Check that the change does not silently reposition Matthijs or the site.

Blocking examples:

- the site becomes a patient portal, appointment route or personal medical advice channel;
- consultancy, AI, Mobility Clinic or cartilage transplantation becomes the main site narrative without explicit approval;
- patient, professional and advice routes blur;
- new expertise or treatment-scope claims appear without owner validation.

### 2. Medical Claims

Check patient-facing and professional medical wording.

Blocking examples:

- diagnosis at distance;
- individualized treatment advice;
- recovery guarantees or outcome claims;
- operation pressure or commercial funnel language;
- unsafe handling of emergency, trauma, infection, severe pain or personal questions;
- public medical/professional content marked verified without Matthijs' explicit approval.

### 3. Foot Pain Guide

If `concept-foot-pain-guide.html`, `content.js`, pain-region data, guide copy, mapping, result logic or concept treatment links changed, check:

- the guide is still a visual leeswijzer, not a diagnosis wizard;
- results remain "mogelijke oorzaken", "past bij klachten zoals" or equivalent safe reading directions;
- there is no triage or urgency automation;
- click/tap works and hover is only supplementary;
- mobile widths around 360, 390 and 430 px remain usable where possible;
- every region maps to existing/planned condition information or a clear no-public-link note;
- Lisfranc/out-of-scope trauma remains differential-only with no public treatment-page signal unless explicitly approved.

### 4. SEO And AI Visibility

Check that SEO changes improve clarity without becoming spammy or medically unsafe.

Blocking examples:

- titles/descriptions/H1s use "beste", "snel herstellen", guarantees or broad specialist claims;
- schema.org or metadata claims services, verification, expertise or treatment scope not visible on the page;
- concept/noindex pages become indexable without publication approval;
- sitemap, robots, canonicals or register state diverge.

### 5. Internal Links

Check whether internal links are preserved or improved:

- patient routes stay within general patient information, disclaimer/contact boundaries and official care routes;
- professional routes go to professional/referrer/publication/project context;
- advice/consultancy remains non-patient-bound;
- concept links are not made public without approval;
- no broken anchors or missing local pages are introduced;
- no link implies a treatment offering outside current scope.

### 6. Pages, Templates And Data

Check existing pages/templates were not broken unintentionally:

- visible navigation and core routes still load;
- shared card, filter, article, project and treatment patterns still render;
- `content.js` fields such as `audience`, `topics`, `project`, `archive`, `featured`, guide mappings and URLs remain consistent;
- no page loses essential metadata, heading structure, accessibility labels or disclaimers;
- no unrelated redesign or CSS-system drift is introduced.

### 7. Mobile And Accessibility

For changes to hero sections, cards, navigation, filters, forms, interactive modules or text blocks, verify or request verification around 360, 390 and 430 px.

Check:

- no clipped text or overlapping content;
- focus states remain visible;
- buttons/links/forms are usable by keyboard and touch;
- contrast is still adequate;
- interaction does not rely on hover only.

### 8. Build, Lint And Tests

Run or report the relevant checks:

- `python3 tools/check_site_quality.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_seo_basics.py`
- `python3 tools/check_foot_pain_guide.py` when the pain guide or treatment mappings are touched.
- `python3 tools/check_treatment_page_quality.py` when treatment pages are touched.

If `package.json` exists, run the available lint, typecheck, test and build scripts that fit the change. If there is no `package.json`, state that no npm checks are available.

If browser/mobile checks are blocked by environment limits, say exactly what was not verified and what fallback evidence was used.

## Severity Rules

Classify as `Blocking issues` when a problem could:

- change positioning or treatment scope;
- introduce unsafe medical advice or claims;
- make concept content public;
- break published pages, navigation, rendering, or key interactions;
- make the foot pain guide diagnose or triage;
- create spammy or misleading SEO/AI signals;
- invalidate publication verification.

Classify as `Non-blocking issues` when the problem is real but does not block local completion or publication safety, such as minor copy consistency, small layout polish, non-critical link-context improvements, missing optional metadata, or follow-up documentation cleanup.

Classify as `Drift-risico's` when no hard bug is proven yet, but the change creates a route toward future fragmentation or strategy drift.

## Output Format

Use this exact structure:

```text
Blocking issues
- [severity/code if useful] File/path: what is wrong, why it matters, evidence.

Non-blocking issues
- File/path: what can be improved, why it matters.

Drift-risico's
- Risk: what could drift, affected layer, what to watch.

Concrete herstelacties
- Action: smallest safe fix or validation step.

Checks uitgevoerd
- Check: result.

Niet geverifieerd
- Item: why it was not verified, if applicable.
```

If there are no issues in a section, write `Geen gevonden`.

## Hard Guards

- Do not rewrite or fix files during the review unless the user explicitly asks for fixes.
- Do not treat a missing automated check as passed.
- Do not treat `review_nodig` as a technical failure when it is the intended human-review state.
- Do not approve medical content, publication status or owner decisions yourself.
- Do not hide uncertainty; mark it as `te valideren`.
- Do not make the report longer than needed. Lead with blocking issues.
