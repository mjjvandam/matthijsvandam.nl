# Search Console — 23 september 2026

Echte accountcontrole via de ingelogde browser, domeinproperty `sc-domain:matthijsvandam.nl`. Ophaaltijd staat exact in `local-admin/state/search-console.json` (23 september, 19:37:40 CEST); dit is geen schermverversing van oude cijfers. Instellingen bevestigt: geverifieerde eigenaar, robots.txt-bestanden geldig. Geen accountinstellingen, sitemap of indexeringsaanvragen gewijzigd.

## Indexering en sitemap

Google-rapportdatum 21 september: 20 geïndexeerd, 40 niet geïndexeerd. Redenen: 29 gevonden maar momenteel niet geïndexeerd, 5 omleidingen, 5 niet gevonden (404), 1 alternatief met correcte canonical, 0 gecrawld maar momenteel niet geïndexeerd. Deze URL-telling is niet hetzelfde als het aantal unieke publieke pagina's.

Sitemap `https://matthijsvandam.nl/sitemap.xml`: verzonden 21 september, laatst gelezen 23 september, Succesvol, 49 ontdekte pagina's. Niet opnieuw ingediend. Lokaal bevat de sitemap 49 regels maar 48 unieke URL's: Freiberg staat dubbel. De oude opname van 13 september (Google-rapport 4 september) bevatte 4 geïndexeerd en 40 ontdekt; geen procentuele groeiclaim op basis van deze verschillende URL-verzamelingen.

## Vaste URL-selectie

Alle inspecties op 23 september, www-host, indexstatus **geïndexeerd**. Google-canonical is telkens de gecontroleerde www-URL. De crawls tonen nog een door de site opgegeven apex-canonical; de latere www-release is niet teruggedraaid.

| Pagina | Laatste crawl volgens Google | Aanvullend |
| --- | --- | --- |
| `/behandelingen/enkelartrose.html` | 12 september 2026 22:50:03 | Geen verwijzende sitemap gevonden; verwijzende homepage |
| `/behandelingen/enkelprothese.html` | 12 september 2026 22:52:03 | Sitemap: tijdelijke verwerkingsfout; wel geïndexeerd |
| `/behandelingen.html` | 12 september 2026 22:52:03 | Geen verwijzende sitemap gevonden; homepage en oude voorvoetfilter als verwijzers |

Geen herhaalde indexeringsaanvraag gedaan. De tijdelijke melding bij enkelprothese is niet vertaald naar een mislukte volledige sitemap; het sitemaprapport meldt Succesvol. Google-herverwerking blijft te volgen.

ProfilePage-rapport van 22 september: 2 geldig, 0 ongeldig. Homepage met drs. M.J.J. (Matthijs) van Dam laatst gedetecteerd 21 september; over-mij.html 14 september. Geen schemawijziging nodig.

## Prestaties met gelijke perioden

Zoektype Web, gehele domeinproperty, 25 augustus–21 september tegenover 28 juli–24 augustus 2026 (beide 28 dagen). Rapport: 6,5 uur geleden bijgewerkt. Exacte perioden gecontroleerd in de datumdialoog; de toegankelijke grafiektekst toonde ten onrechte Invalid Date/1970 en is niet als datumbewijs gebruikt.

| Maat | 25 aug–21 sep | 28 jul–24 aug |
| --- | ---: | ---: |
| Klikken | 58 | 15 |
| Vertoningen | 1,18K (afgerond in UI) | 539 |
| CTR | 4,9% | 2,8% |
| Gemiddelde positie | 18 | 16,3 |

In dezelfde paginatabel: enkelprothese 6 versus 0 klikken, 140 versus 0 vertoningen; klachtenhub 2 versus 0 klikken, 168 versus 0 vertoningen; enkelartrose 0 versus 0 klikken, 81 versus 0 vertoningen. Dit waren expliciete nulwaarden in zichtbare rijen, geen ingevulde ontbrekende gegevens.

Relevante propertybrede zoekopdrachten: orthopedisch schoenmaker tilburg 49 versus 45 vertoningen, tilburg orthopedische schoenen 36 versus 20; beide 0 klikken in beide perioden. Geen bewijs dat deze vertoningen naar professionals.html gingen; query-paginatoewijzing blijft open. Bereik neemt in deze vergelijking toe, maar gemiddeld positiegetal is hoger: geen algemene claim dat alle SEO verbeterde.

## Vijf oude 404-adressen rechtstreeks gecontroleerd

Alle vijf geven nu een redirect naar een inhoudelijk passende .html-bestemming en daarna HTTP 200, met `curl -L` bevestigd:

- `/behandelingen?topic=voorvoet` → `/behandelingen.html?topic=voorvoet` (parameter behouden).
- `/artikelen/artrosezorg-transitie-professionals` → gelijknamige `.html`.
- `/artikelen/artrosezorg-transitie-patienten` → gelijknamige `.html`.
- `/privacy` → `/privacy.html`.
- `/projecten/we-walk` → gelijknamige `.html`.

Google-validatie staat al op Gestart, 21 september. Geen nieuwe redirects of herhaalde validatie gestart. Nieuwe 404's vanuit conceptlinks op behandelpagina's staan afzonderlijk in de weekcheck; dit zijn andere URL's.

## Dashboard en vervolg

Opname atomisch ververst met werkelijk waargenomen gegevens. De oude lezer wees zowel `Succesvol` als een vierde uitsluitingsreden af. Kleine lokale reparatie accepteert deze bestaande Google-uitvoer, bewaakt de totaalsom en toont de nieuwe redenen in dezelfde dashboardcomponent. Geen API-koppeling of nieuwe routine. Bestaande taak `work-search-setup` bijgewerkt; indexeringsherverwerking en Bing blijven open.

## Aanvulling prestaties per pagina — 23 september 2026

De bestaande Search Console-account is opnieuw zichtbaar gecontroleerd. Prestatieperiode 25 augustus–21 september 2026 (28 dagen), vergeleken met 28 juli–24 augustus (28 dagen): propertybreed 58 klikken, circa 1,18K vertoningen, CTR 4,9%, gemiddelde positie 18. De paginatabel rangschikt op klikken: homepage 45 klikken/770 vertoningen; enkelprothese 6/140; behandelingenhub 2/168; over-mij 2/48; cohortartikel 2/11; artikel knieprothese/bariatrische chirurgie 1/17; publicaties 1/9; enkelartrose 0/81. Dit zijn gerapporteerde rijwaarden; de lijst kan niet volledig optellen tot propertytotalen.

De overzichtsaanbeveling van Google meldde voor `behandelingen.html` 381% meer vertoningen dan gewoonlijk. De bijbehorende weekvergelijking is 14–20 september tegenover 7–13 september: 125 tegenover 26 vertoningen, 1 klik, CTR 0,8% en gemiddelde positie 31,3. Een stijging in vertoningen is geen bewijs van meer bezoekers of conversie. Bruikbare vervolgstap is de zoekintentie en zichtbare snippet controleren; wijzig medische inhoud of claims niet op basis van deze cijfers.

De waarneming is als aparte `performance.captured_at` opgeslagen in `local-admin/state/search-console.json`. Deze aanvulling vervangt de bestaande indexerings- en sitemaprapportdatum niet. De dashboardtip combineert deze Google-data met de laatste Vercel-momentopname, maar houdt perioden en meeteenheden nadrukkelijk gescheiden.
