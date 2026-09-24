# Current Site State

Laatste auditbasis: huidige repo op 2026-09-23.

## Status

`matthijsvandam.nl` is een statische professionele website voor drs. Matthijs van Dam. De site is opgebouwd als rustige expert-hub, niet als patientportaal.

De gepubliceerde laag bestaat uit:

- 48 unieke publieke pagina's in `sitemap.xml` (49 URL-regels; Freiberg staat dubbel, zie weekverslag).
- 48 pagina's in `PUBLICATIE_REGISTER.json`: 41 `geverifieerd` en 7 `review_nodig`.
- 21 gepubliceerde artikelen: 20 `geverifieerd`; `artikelen/kuitspier-en-voetpijn.html` staat op `review_nodig`.
- 6 gepubliceerde projectpagina's.
- 1 publieke behandel-/klachtenhub: `behandelingen.html`.
- 10 publieke behandelpagina's; de eerste vijf zijn: `behandelingen/enkelverzwikking.html`, `behandelingen/enkelartrose.html`, `behandelingen/enkelprothese.html`, `behandelingen/hallux-rigidus.html` en `behandelingen/metatarsalgie.html`. Ook Achillespeesklachten, MTP-1-artrodese, hallux valgus, hamerteen/klauwteen en ziekte van Freiberg zijn publiek; hallux valgus en Freiberg houden hun bestaande `review_nodig`.
- 28 lokale concept-behandelpagina's in `behandelingen/`, `noindex, nofollow` en uitgesloten van Vercel via `.vercelignore`.
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

Aanvulling 2026-09-09: onder het door Matthijs geaccepteerde ADR-0014 is een lokale beheerpilot toegevoegd in `local-admin/`. Die bevat blijvende opslag en versiebeheer voor een geïsoleerde kopie van het Leonie-artikel, een takenoverzicht, bestaande routines/agentmomentopnamen en een Vercel-bezoekersmomentopname. De publieke artikelbron is niet overgezet. De beheeromgeving is uitsluitend lokaal en geheel uitgesloten van deployment; gegevens staan buiten Git. Zie `local-admin/README.md` en `docs/site/EDITORIAL_WORKSPACE_DESIGN.md` voor gebruik, toetsing en beperkingen.

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

- Google-herverwerking van oudere apex-canonicals; de www-release is op 12 september goedgekeurd en live gecontroleerd. Zie de technische release en Search Console-controle van 23 september.
- Of `beeldbank/` publiek direct bereikbaar mag blijven.
- Definitieve medische review van alle concept-behandelpagina's.
- Definitieve medische review van de Voet- en enkelpijnwijzer voordat die publiek wordt.

## Tijdelijke websitefeedback — 24 september 2026

De goedgekeurde feedbackkaart is publiek op de bestaande pagina's. Zij verschijnt na vijf verschillende publieke pagina's in één tabblad of via de kleine footerknop, vraagt één keuze en optioneel een korte toelichting, en gebruikt de bestaande Brevo-mailroute. De bestaande Vercel-limietregel omvat `/api/contact` en `/api/feedback`; een productieproef is in de bestaande Gmail-inbox ontvangen. De campagne sluit automatisch na 24 oktober 2026. Zie `docs/site/FEEDBACK_CAMPAIGN.md` voor de technische grens, privacy en verificatie. Dit wijzigt geen medische reviewstatus of indexeringsinstellingen.

## Lokale stijlgids — 13 september 2026

De bestaande vormgeving is beschreven in `docs/site/DESIGN_SYSTEM.md`. De lokale voorbeeldpagina `docs/design-system/index.html` toont echte siteonderdelen; `components.json` en de gegenereerde `usage.json` leggen regels en afnemers vast. `tools/design_system.py` bouwt en controleert deze koppeling. De gewone sitekwaliteitscheck bewaakt de synchronisatie. Dit voegt geen livepagina of nieuwe medische/publicatiegoedkeuring toe.
