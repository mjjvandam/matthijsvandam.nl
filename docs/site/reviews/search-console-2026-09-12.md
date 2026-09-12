# Search Console — 12 september 2026

Bron: ingelogde Google Search Console-domeinproperty `sc-domain:matthijsvandam.nl`, in deze Codex-taak via computerbediening uitgelezen. Dit verslag betreft Google-inrichting en de lokale dashboarduitbreiding; geen publieke siterelease.

- Eigendom via TransIP-DNS geverifieerd na expliciet akkoord van Matthijs. Alleen het Google-TXT-record toegevoegd; bestaande records behouden. De autoritatieve DNS bevestigde het record.
- `https://matthijsvandam.nl/sitemap.xml` ingediend. Google bevestigt **Sitemap is verwerkt**, laatst gelezen 12-09-2026, **40 ontdekte pagina's**. De kortstondige eerste melding Kan niet ophalen was bij openen van het detailrapport vervangen door deze geslaagde verwerking.
- Indexeringsrapport: laatste update **04-09-2026**, **4 geïndexeerd**, **9 niet geïndexeerd**: 5 niet gevonden, 3 omleidingen, 1 alternatief met correcte canonieke tag.
- De overzichtsteller van 37 klikken is niet in het dashboard opgenomen: de bijbehorende periode is niet vastgesteld.

## Actuele 404-adressen

Op 12 september rechtstreeks gecontroleerd; alle vijf gaven HTTP 404:

- https://www.matthijsvandam.nl/behandelingen?topic=voorvoet
- https://www.matthijsvandam.nl/artikelen/artrosezorg-transitie-professionals
- https://www.matthijsvandam.nl/artikelen/artrosezorg-transitie-patienten
- https://www.matthijsvandam.nl/privacy
- https://www.matthijsvandam.nl/projecten/we-walk

Correcte bestaande .html-bestemmingen en querybehoud moeten bij een technische correctie worden gecontroleerd. Herstel en livevalidatie zijn nog niet uitgevoerd. De bestaande technische www-release heeft nog afzonderlijk livegangakkoord nodig; zie technical-release-2026-09-12.md. Bing is niet gecontroleerd.

## Dashboard en opvolging

De gecontroleerde Google-momentopname staat privé in `local-admin/state/search-console.json`, buiten Git. Overzicht en Bezoekers tonen de verificatie, sitemap en de afzonderlijke Google-rapportdatum. De bestaande taak work-search-setup behoudt haar ID. AGENTS.md en SEARCH_CONSOLE_WORKFLOW.md beschrijven automatische opvolging bij relevante ontwikkeling; de bestaande weekcheck blijft de terugkerende uitvoerder. Geen permanente API-verbinding of achtergrondmonitor in het dashboard.

ADR-check: ADR-0014 (lokale dashboardopname), ADR-0004 (vindbaarheid), ADR-0006 (publicatiegrenzen). Geen nieuwe ADR nodig voor deze lokale uitbreiding. Geen nieuwe medische inhoud of publieke bestanden gewijzigd; publicatiestatus ongewijzigd.

## Uitgevoerde controles dashboard

- Alle 66 bestaande local-admin-unittests geslaagd; aanvullende checks op ontbrekende, geldige, verouderde en ongeldige Google-opnamen geslaagd. Precies één bestaande zoekmachinetaak ingelezen.
- JavaScript-syntaxis, sitekwaliteit, publicatieverificatie, SEO-basis en whitespace gecontroleerd: geslaagd. Geen package.json; geen npm-checks beschikbaar.
- Lokaal dashboard daadwerkelijk geopend op 8878. Google-blok en vervolgknop naar de bestaande taak zichtbaar gecontroleerd; 360 px visueel bekeken, geen horizontale overloop op 360/390/430 px.
- Bestaande weekcheck via automation_update aangepast. Exacte prompt teruggelezen en gelijk aan weekly-sitecheck-prompt.txt; alle overige opgeslagen velden behalve updated_at ongewijzigd. Actief, woensdag 19:30. Een toekomstige automatische Google-run is hiermee ingesteld, nog niet uitgevoerd.
- Vooraf herstelkopie van local-admin en AGENTS.md en een Git-diff in /private/tmp gemaakt. Bestaande werkmapwijzigingen, artikelrevisies en leesmarkeringen behouden.
