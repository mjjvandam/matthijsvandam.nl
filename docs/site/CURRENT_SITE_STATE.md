# Current Site State

Laatste auditbasis: huidige repo op 2026-08-26.

## Status

`matthijsvandam.nl` is een statische professionele website voor drs. Matthijs van Dam. De site is opgebouwd als rustige expert-hub, niet als patientportaal.

De gepubliceerde laag bestaat uit:

- 35 publieke pagina's in `sitemap.xml`.
- 35 pagina's in `PUBLICATIE_REGISTER.json`: 34 `geverifieerd` en 1 `review_nodig`.
- 17 geverifieerde gepubliceerde artikelen; 1 ander publiek artikel staat nog op `review_nodig`.
- 5 gepubliceerde projectpagina's.
- 1 publieke behandel-/klachtenhub: `behandelingen.html`.
- 2 publieke behandelpagina's: `behandelingen/enkelverzwikking.html` en `behandelingen/enkelartrose.html`.
- 33 lokale concept-behandelpagina's in `behandelingen/`, `noindex, nofollow` en uitgesloten van Vercel via `.vercelignore`.
- 1 lokale conceptmodule: `concept-foot-pain-guide.html`, `noindex, nofollow` en uitgesloten van Vercel.

## Hoofdroutes

- `index.html`: profiel, routes per doelgroep, selectie van behandelingen, projecten, artikelen, publicaties en contactgrenzen.
- `over-mij.html`: biografie en profiel.
- `behandelingen.html`: publieke hub voor klachten, aandoeningen, behandelingen, zorgroute en veilige informatie.
- `professionals.html`: samenwerking met verwijzers en regionale professionals.
- `advies-consultancy.html`: niet-patientgebonden advies, onderwijs, projectbijdrage en sessiebegeleiding.
- `artikelen.html`: artikelen en updates, met filters op doelgroep en thema.
- `projecten.html`: projectoverzicht.
- `publicaties.html`: publicaties en bijdragen.
- `privacy.html` en `disclaimer.html`: juridische en medische veiligheidsgrenzen.

## Technische vorm

- Statische HTML/CSS/JS.
- Dynamische kaartlijsten en filters komen vooral uit `content.js`.
- `styles.css` bevat de bestaande visuele taal.
- `script.js` bevat navigatie, filters, analytics-guard, contact-e-mail-obfuscatie en kaartgedrag.
- Er is geen `package.json`; gebruik de Python-checks als primaire repo-validatie.
- FAQ-content wordt centraal beheerd in `data/faqs.json` en `data/faq-placements.json` en statisch gegenereerd volgens `docs/site/FAQ_CONTENT_MODEL.md` en `ADR-0007`.

## Concept versus publiek

Publiek is wat in `sitemap.xml` staat of `index, follow` heeft. Concept is wat `noindex` heeft, buiten sitemap blijft of via `.vercelignore` niet wordt gedeployed.

Nieuwe of gewijzigde publieke medische/professionele pagina's moeten terug naar `review_nodig` in `PUBLICATIE_REGISTER.json` totdat Matthijs inhoudelijk akkoord geeft.

## Bestaande checks

Gebruik bij relevante taken:

- `python3 tools/check_site_quality.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_seo_basics.py`
- `python3 tools/check_foot_pain_guide.py`
- `python3 tools/check_treatment_page_quality.py` bij behandelpagina's
- `python3 tools/generate_faqs.py --check` bij FAQ-wijzigingen
- `python3 tools/check_faqs.py` bij FAQ-wijzigingen

## Te valideren

- Live canonical-hostkeuze: apex `matthijsvandam.nl` versus `www.matthijsvandam.nl`.
- Of `beeldbank/` publiek direct bereikbaar mag blijven.
- Definitieve medische review van alle concept-behandelpagina's.
- Definitieve medische review van de Voet- en enkelpijnwijzer voordat die publiek wordt.
