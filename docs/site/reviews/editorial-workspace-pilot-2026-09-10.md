# Controle lokale beheerpilot — 10 september 2026

Scope: de geaccepteerde lokale pilot uit ADR-0014. Eén bestaande artikelkopie, duurzame opslag, vergelijking en beoordeling, taken, bestaande routines en gedateerde bezoekersinformatie. Dit verslag is geen vrijgave van een nieuwe publieke bron of gedeelde beheeromgeving.

## Blocking issues

- Geen gevonden binnen de lokale pilotscope. De echte werkdatabase bevat uitsluitend de oorspronkelijke Leonie-kopie op versie 1, als Concept, zonder testakkoord of testwijzigingen.

## Non-blocking issues

- De editor ondersteunt één gecontroleerde artikelstructuur. Andere artikeltemplates, nieuwe artikelen, extra tekstblokken en afbeeldingkeuze zijn nog niet beschikbaar. De aandoeningenlijst biedt lezen en persoonlijke notities, geen medische goedkeuringsfunctie.
- Agentstatussen en bezoekerscijfers zijn gedateerde momentopnamen. De knop Vernieuwen leest de beschikbare gegevens; hij haalt geen nieuwe Codex- of Vercel-momentopname op.

## Drift-risico's

- Publieke HTML en beheerbron kunnen uiteenlopen als een geïmporteerd artikel buiten de vaste Codex-opslagroute wordt gewijzigd. De pilot blokkeert aanbieden, akkoord en pakketvoorbereiding bij gewijzigde oorspronkelijke bronnen. AGENTS.md beschrijft de juiste bewerkroute.
- Een taakmarkering Bekeken is geen medische verificatie. De markering vervalt bij gewijzigde bron. De vier gepubliceerde behandelpagina's blijven als geverifieerd herkenbaar; Lisfranc blijft geparkeerd.
- De lokale computeraccount is de eigenaarsgrens. Deze proef bewijst geen afzonderlijke gebruikersrechten of gezamenlijk online werken.

## Concrete herstelacties

- Geen resterende herstelactie binnen deze pilot. Voor uitbreiding: per artikeltemplate de volledige invoer/uitvoer vergelijken voordat die als bewerkbaar wordt aangeboden.
- Voor echte gedeelde toegang: eerst de concrete account-, opslag-, toegangs- en publicatie-inrichting ter besluitvorming voorleggen. Daarna met afzonderlijke accounts testen. De pilot maakt geen nieuwe accounts of kosten.
- Voor een publieke bronovergang: het goedgekeurde pakket buiten de projectmap uitpakken, bestaande sitecontroles uitvoeren, inhoud en uiteindelijke uitvoer beoordelen en de overgang afzonderlijk laten vrijgeven.

## Checks uitgevoerd

- 29 geautomatiseerde controles geslaagd op 10 september: verliesloze artikel-/kaartomzetting, invoergrenzen, duurzame revisies, conflicten, herstel, versie- en afhankelijkheidsgebonden akkoord, lokale toegangsgrenzen, ZIP-uitvoer, actuele taken/routines, brongebonden markeringen, bezoekersgegevens en uitsluiting van lokale beheerschermen bij publieke sitevalidatie.
- Browserroute in afzonderlijke tijdelijke opslag: opslaan, volledig paginavoorbeeld, vergelijken, aanbieden, expliciet testakkoord, wijziging na akkoord, conflict tussen browser en Codex met behoud van invoer, herstellen als nieuwe versie en behoud na herstart. Testakkoord is uitsluitend technische testdata.
- Takenlijst: Bekeken opgeslagen en na opnieuw openen teruggevonden. De medische reviewstatus bleef bestaan. Lokale leesweergave en ankers gecontroleerd.
- Mobiel: routines op 360 px, editor op 390 px en bezoekers op 430 px zonder horizontale overloop; navigatie en de vier editortabs zichtbaar. Ook desktop en de aandoeningenlijst visueel bekeken.
- Schone gebruikersomgeving opnieuw geopend: 34 open aandachtspunten, vier bestaande routines, geen artikelen ter beoordeling. Het oorspronkelijke pilotartikel staat op versie 1. De server blijft lokaal bereikbaar zolang het serverproces draait.
- `check_site_quality.py`: 77 HTML-bestanden, geen structurele issues. `check_publication_verification.py`: 40 publieke pagina's, alle 40 geverifieerd. `check_seo_basics.py`: 40 sitemap-pagina's, geen basisissues. `git diff --check`: geslaagd.
- JavaScript-syntaxis en de startlauncher gecontroleerd. Er is geen `package.json`; er zijn geen npm-checks. FAQ-, pijnwijzer- en behandelinhoud zijn door dit werk niet aangepast; de specifieke inhoudschecks daarvan zijn niet opnieuw uitgevoerd.
- De publieke artikel-HTML, `content.js`, sitemap en het publicatieregister zijn door deze pilot niet gewijzigd. Heel `local-admin/` is uitgesloten van deployment; lokale staat en uitvoer zijn ook uitgesloten van Git.

## Niet geverifieerd

- Nieuwe of gewijzigde medische inhoud: geen inhoudelijk akkoord gegeven en niets gepubliceerd. Beoordeling daarvan blijft bij Matthijs.
- Echte afzonderlijke accounts, gedeelde opslag, toegang intrekken en online besloten preview: niet ingericht binnen deze lokale pilot.
- Automatische verversing via de analytics-API, een live agentmonitor en toekomstige scheduleruitvoering: niet ingericht of bewezen.
- Volledige toegankelijkheidsaudit en volledige consolecontrole: niet uitgevoerd. Het gemeten mobiele gedrag en de geteste bedieningsroutes bewijzen geen volledige WCAG-conformiteit.
- Back-upherstel van de echte gebruikersdatabase en live deployment: niet uitgevoerd. Herstel van artikelrevisies en herstart met testopslag zijn wel gecontroleerd.
