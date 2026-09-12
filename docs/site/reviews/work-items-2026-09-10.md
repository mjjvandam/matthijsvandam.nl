# Controle uitbreiding Nog te doen — 10 september 2026

## Resultaat en scope

De lokale beheeromgeving bevat 19 aanvullende werkpunten: 18 open en de contactlivegang als afgerond. Inclusief de bestaande medische leeslijst zijn er 56 punten, waarvan 50 open. De categorieën tellen respectievelijk 5 open punten voor contact/nieuwsbrief, 37 voor inhoud/redactie, 5 voor techniek/vindbaarheid en 3 voor beheer/routines. Twee algemene verslagtaken zijn vervangen door concrete taken die naar hetzelfde actuele verslag verwijzen.

Gewijzigd: `local-admin/work-items.json`, `WORK_ITEMS_REVIEW.md`, `inventory.py`, `server.py`, `test_work_items.py`, `ui/app.js`, `ui/app.css` en `README.md`; daarnaast actuele verwijzingen in `SITE_TODO.md`, `NEWSLETTER_CONTACT_BUILD_PLAN.md` en `EDITORIAL_WORKSPACE_DESIGN.md`. De inventaris en het ontwerp vallen binnen het geaccepteerde ADR-0014. Geen nieuwe ADR nodig.

De publieke HTML, `content.js`, medische teksten, metadata, sitemap, publicatieregister, providerinstellingen en automatiseringen zijn door deze uitbreiding niet gewijzigd. Reeds aanwezige wijzigingen buiten de beheerscope zijn behouden.

## Blocking issues

Geen gevonden binnen deze lokale uitbreiding.

## Non-blocking issues

Het contactformulier is op de huidige publieke homepage zichtbaar. Het releaseverslag documenteert de livegang en eerste ontvangen mail op 7 september. De ontvangst en opmaak van de later gewijzigde contactmail zijn vandaag niet opnieuw getest: daarvoor staat een afzonderlijke taak open. Er is geen formulier verzonden en geen mail verstuurd.

De nieuwsbrief is gedeeltelijk voorbereid. Voorbereide Brevo-onderdelen gelden niet als bewijs van de volledige aanmeld-, bevestigings-, voorkeuren-, afmeld- en verzendketen. De open taken onderscheiden die stappen en de uiteindelijke publicatiebeslissing. Accountinrichting, hostingvoorwaarden, back-updekking en werkelijke deploymentinhoud zijn niet volledig live gecontroleerd; de bijbehorende taken vragen om statuscontrole en stellen een gebrek niet als feit vast.

## Drift-risico's

Aanvullende taken zijn een gedateerde inventaris. Bronhashes signaleren gewijzigde of ontbrekende stukken. Een oude leesmarkering vervalt dan, en ook een afgeronde taak vraagt opnieuw om controle. Een nieuwe algemene rapportage wordt niet stil onderdrukt door taken over een ouder verslag. Alleen na inhoudelijke herbeoordeling mogen de betrokken bronversies en taakstatus worden bijgewerkt.

## Concrete herstelacties

Een fout waarbij aan-/uitvinken een bestaande notitie kon wissen is hersteld. Een ontbrekend notitieveld bewaart de notitie zolang de bronversie gelijk is. Expliciet leeg opslaan wist de notitie; `null` wordt geweigerd. De browser neemt na opslaan de volledige bevestigde taakrespons over.

## Checks uitgevoerd

- Alle 39 lokale beheertests geslaagd, met afzonderlijke tijdelijke opslag. Daaronder validatie van het werkcatalogusbestand, bronwijziging, rapportvervanging en een HTTP-test van notitiebehoud, leegwissen en ongeldige invoer.
- Browsercontrole op 360, 390 en 430 px: geen horizontale overflow, categorieën en filters leesbaar. Desktopweergave gecontroleerd.
- Categorie- en voortgangskeuze blijven behouden bij navigatie en Vernieuwen. Het filter Afgerond toont de contactlivegang zonder leesvinkje.
- Werkelijke browserproef in tijdelijke opslag op poort 8890: notitie opgeslagen, taak aan- en uitgevinkt, pagina herladen en dezelfde notitie teruggelezen. De werktaak blijft open. Geen testmarkeringen in de echte werkopslag.
- Sitekwaliteit: 77 HTML-bestanden, geen structurele issues.
- Publicatiecontrole: 94 HTML-bestanden, 40 gepubliceerd en geverifieerd, 0 review nodig, 54 overige bestanden.
- SEO-basis: 40 sitemap-pagina's, geen issues.
- JavaScript-syntax en `git diff --check` geslaagd. Geen `package.json` of npm-checks in deze statische site.

## Niet geverifieerd

Geen nieuwe mailontvangst, nieuwsbriefverzending, providerwijziging, publicatie of medische eigenaarreview uitgevoerd. De nieuwe taken zijn geregistreerd, niet automatisch uitgevoerd. Medische inhoud en toekomstige externe vrijgaven blijven afzonderlijke eigenaarbesluiten. Publicatiestatus van de bestaande site: geverifieerd ongewijzigd; deze uitbreiding is uitsluitend lokaal beheer.
