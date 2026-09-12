# Publicatie en lokale werkversie verduidelijkt

Datum: 10 september 2026. Opdracht: maak in de beheeromgeving intuïtief duidelijk waarom een al gepubliceerd artikel ook een werkversie heeft.

## Resultaat

De artikelkaart, filters en editor onderscheiden de geregistreerde publicatie van de lokale werkversie. Leonie toont **Gepubliceerd · Werkversie ongewijzigd**. Tijdens typen staat **Niet-opgeslagen wijzigingen**; na bewaren **Lokale wijzigingen · nog niet gepubliceerd**. De bestaande pagina heeft een eigen kijklink. De bronuitleg is uitklapbaar.

Opslaan, bekijken, beoordelen, akkoord en herstel benoemen de lokale werkversie. Knop én tab voor de voorvertoning heten bij gewijzigde invoer **Opslaan & bekijken**. Ongewijzigde gepubliceerde inhoud vraagt niet opnieuw om beoordeling. Herstel naar de importinhoud wordt als ongewijzigd herkend, ongeacht het revisienummer; een oud akkoord wordt niet hersteld.

De afgeleide API-velden veranderen geen opgeslagen workflowstatussen. Publicatieregistratie volgt de huidige HTML, sitemap, het register en deploymentuitsluiting; dit is geen nieuwe livecontrole. Alleen noindex en afwezigheid uit de sitemap bewijzen geen ongepubliceerde status. Ontbrekende of tegenstrijdige bronnen geven een onbekende status. Wijzigingen buiten de beheeromgeving blijven een bewuste vergelijking vereisen.

## Controle

- Alle **54 Python-tests** geslaagd. Nieuwe gevallen: gepubliceerde import zonder lokale wijzigingen; lokale kaartwijziging; herstel als revisie 3; lokaal akkoord zonder publicatie; externe pagina-/kaartwijziging; ontbrekende of tegenstrijdige publicatiebronnen; noindex zonder deploymentuitsluiting.
- JavaScript-syntaxis en whitespace gecontroleerd.
- Browserroute in afzonderlijke tijdelijke opslag doorlopen: ongewijzigd → typen → lokaal opslaan → ter beoordeling → testakkoord → herstellen naar oorspronkelijke inhoud. Na herstel staat revisie 3 ongewijzigd en is geen nieuwe beoordeling nodig. Testakkoord staat uitsluitend in de wegwerpopslag.
- Beide previewbedieningen wisselen tijdens typen direct naar **Opslaan & bekijken** en weer terug na ongedaan maken.
- Artikelkaart en editor gecontroleerd op 360, 390 en 430 px: geen horizontale paginaoverloop. Mobiele schermafbeeldingen visueel nagekeken.
- De echte werkdatabase is inhoudelijk ongewijzigd: één artikel, revisie 1, één importgebeurtenis, geen lokaal akkoord. De beheerserver is herstart voor de nieuwe API-velden.
- Publieke artikelinhoud, kaartbron, register, sitemap en publicatie-instellingen zijn door deze wijziging niet aangepast. Geen deployment. De publieke controles zijn niet opnieuw nodig voor deze lokale UI/API-wijziging; de lokale tests omvatten de grens met de publieke site. Geen `package.json` of npm-checks.

## Bestanden en besluit

Gewijzigde beheerdelen: `local-admin/server.py`, nieuwe helper `local-admin/article_status.py`, `local-admin/test_backend.py`, `local-admin/ui/app.js` en `local-admin/ui/app.css`. Gebruik en ontwerp zijn bijgewerkt in `local-admin/README.md` en `docs/site/EDITORIAL_WORKSPACE_DESIGN.md`.

De README-bronversie is uitsluitend voor de bestaande taken `work-admin-expansion` en `work-admin-backup` opnieuw beoordeeld. Hun openstaande vervolgwerk verandert niet; overige bronwaarschuwingen blijven intact.

Past binnen het geaccepteerde ADR-0014. Geen nieuwe ADR of inhoudelijke eigenaarreview nodig voor deze verduidelijking. Publieke medische/professionele inhoud en eerdere eigenaarbesluiten blijven ongewijzigd. Een toekomstige gewijzigde artikelrelease doorloopt nog steeds de afzonderlijke inhoudelijke en publicatiecontrole.
