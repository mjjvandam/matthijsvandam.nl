# ADR-0002: Content Pillars

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03.

## Context

The current site content is organized around a limited set of recurring themes. These themes appear across the homepage, `behandelingen.html`, articles, projects, publications, professional pages, concept treatment pages and governance documents.

Current source basis:

- `docs/site/CONTENT_PILLARS.md`
- `docs/site/CURRENT_SITE_STATE.md`
- `docs/site/SITE_POSITIONING.md`
- `docs/site/PAGE_MODELS.md`
- `docs/site/INTERNAL_LINKING_MODEL.md`
- `docs/site/KNOWN_DRIFT_RISKS.md`

Uncertainties:

- Whether knee conditions later need patient-facing detail pages comparable to foot/ankle pages: needs owner validation.
- Whether projects and publications later need stronger thematic links to treatment and professional pages: needs owner validation.

## Decision

The site keeps five content pillars:

- foot, ankle and sports injury;
- knee, osteoarthritis, cartilage and lifestyle;
- regional collaboration and professional care;
- research, education and care development;
- safety, governance and visibility.

New content must clearly fit one or more of these pillars. If the fit is unclear, it must be marked as `needs owner validation` before publication-oriented work continues.

## Consequences

The pillars provide a stability check for future articles, project pages, treatment pages, internal links and SEO work.

Foot/ankle remains the most developed patient-information cluster, including concept treatment pages and the foot/ankle pain guide. Knee, cartilage, osteoarthritis and lifestyle remain present but must not be expanded into a new public detail-page cluster without explicit review.

Project, AI, digital-care and consultancy content must stay connected to orthopaedics, ETZ context, regional care, research, education or concrete care-development work.

## What must not change without a new ADR

- New broad pillars must not be added silently.
- A single topic must not become the dominant site narrative without owner approval.
- Project or consultancy content must not drift away from orthopaedics, regional care or care development.
- Patient-facing and professional content must not be mixed into one generic content stream.
- A new content pillar, removed content pillar, target-audience shift, page-model change, navigation-level topic cluster, homepage emphasis change, public-page cluster or SEO cluster requires an explicit ADR check.
- If such a content-pillar or scope change is not already covered by an Accepted ADR, Codex must propose a new ADR and stop for owner validation before implementation.
