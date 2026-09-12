# Bezoekers en best bezochte pagina's — 10 september 2026

Lokale verbetering op verzoek van Matthijs, binnen ADR-0014. De bezoekerspagina heeft korte definities, een compacte periode/datumregel en een ranglijst. Het startdashboard toont de eerste vijf regels uit dezelfde rangschikking. Gewijzigd: `local-admin/analytics.py`, `test_analytics.py`, `ui/app.js`, `ui/app.css` en `README.md`. In de lokale analyticsopname is uitsluitend een leesbaar periodelabel toegevoegd; de README-bronversie bij twee beheertaken is na deze documentatiecorrectie bijgewerkt.

## Blocking issues

Geen gevonden.

## Non-blocking issues

De cijfers zijn nog de opgeslagen Vercel-opname van 9 september: 36 bezoekers, 94 paginaweergaven en zeven zichtbare toppagina's over 2–9 september 2026. De oorspronkelijke providerperiode en het exacte vastlegtijdstip blijven in de opname bewaard. Nieuwe cijfers worden niet automatisch opgehaald; dit staat zichtbaar in het scherm. De knop voor actuele cijfers opent het bestaande Vercel-dashboard.

## Drift-risico's

- Paginabezoekers zijn niet optelbaar tot sitebezoekers. `/` en `/index.html` blijven afzonderlijke providerregels met herkenbare titels; er wordt geen onbewijsbaar totaal van gemaakt.
- De top vijf is een selectie uit de beschikbare opname, geen claim over de huidige week. Ontbrekende cijfers verschijnen als Onbekend.
- De [Vercel-meetwijze](https://vercel.com/docs/analytics) gebruikt een identificatie die per dag vervalt. Het scherm legt uit dat dezelfde persoon op verschillende dagen opnieuw kan meetellen; bezoekers zijn dus geen exact aantal verschillende personen over de hele periode.

## Concrete herstelacties

Onleesbare URL-titels vervangen door titels uit het publicatieregister. De rangschikking sorteert op bezoekers en behoudt bij gelijke aantallen de oorspronkelijke volgorde. Niet-geregistreerde paden worden niet getoond; dubbele tellerregels worden geweigerd. Balkjes vergelijken aantallen met de grootste paginateller en suggereren geen percentages van het sitebezoek. De knop voor opnieuw laden heet nu Opgeslagen cijfers herladen.

## Checks uitgevoerd

- Alle 41 lokale beheertests geslaagd, met tijdelijke testopslag. Nieuwe controles dekken titelherkomst, sortering, afzonderlijke homepageadressen, dubbele regels en ongeldige gegevens.
- Browser: bezoekerspagina op desktop en 360/430 px; startdashboard op 390 px. Geen horizontale overflow, leesbare cijfers en afbrekende lange paginatitels.
- De knop Alle bezoekcijfers opent het volledige overzicht met zeven rijen.
- JavaScript-syntax en `git diff --check` geslaagd. Geen npm-checks in deze statische site.

## Niet geverifieerd

Geen nieuwe provideropname, automatische analyticskoppeling of tijdreeks toegevoegd. Medische inhoud, publieke bronbestanden, registerstatus en automatiseringen zijn ongewijzigd. Geen nieuwe ADR of medische eigenaarreview nodig voor deze lokale weergaveverbetering; publicatiestatus geverifieerd ongewijzigd.
