# Technische release — 12 september 2026

Status: door Matthijs expliciet goedgekeurd voor publicatie; livegang geblokkeerd door ontbrekende GitHub-schrijftoegang. Niet gepubliceerd.
Opdracht: Matthijs vroeg “regel punt 2”: menu afronden, conceptbescherming en websiteadres gelijkzetten.

## Concreet resultaat

De release staat in `/private/tmp/mvd-technical-release-20260912`, op branch `codex/technical-release-20260912`, vanaf productiecommit `bfdf87d99b08bfa85a6fda7ea0cfe2ea434bdc2b`.
De bestaande hoofdwerkmap is behouden, inclusief alle eerdere wijzigingen en de oorspronkelijke bron van de Leonie-beheerpilot. Er is geen database, revisie, bronhash of eigenaarakkoord aangepast.

- Bestaande menufix meegenomen: ankerlinks krijgen niet allemaal `aria-current=page`; lichte actieve/hovertekst gebruikt de bestaande donkere inktkleur.
- Alle 77 reguliere HTML-bestanden gebruiken de www-host voor bestaande absolute site-URL's en verse CSS/JS-cacheversies. De sitemap houdt dezelfde 40 pagina's. Robots verwijst naar dezelfde sitemap op www. SEO/publicatiechecks en de bestaande behandelpagina-generator volgen die host.
- Een exacte vergelijking met de oorspronkelijke 77 HTML-bestanden bewijst dat alleen site-URL's en CSS/JS-cacheversies veranderen. Medische teksten, robotsstatussen, kaarten, afbeeldingen en externe medische bronnen zijn inhoudelijk ongewijzigd.
- `.vercelignore` sluit de volledige map `concepten/`, het losse conceptartikel `artikelen/na-verzwikte-enkel-instabiel-blijven.html` en interne redactie-/controlebestanden uit. Bestaande uitsluitingen voor de pijnwijzer, conceptbehandelingen, mailpilot en beheerpilot blijven behouden.
- De beeldbank als geheel is niet afgeschermd: dat is een afzonderlijk bestaand eigenaarbesluit. Interne Markdownbestanden vallen wel onder de algemene documentatie-uitsluiting.
- Een nieuwe lokale controle `tools/check_deployment_boundary.py` toetst uitsluitingen tegen publieke pagina's, assets, API, data en concepten met Git-ignoresemantiek in tijdelijke opslag. Geen wijzigingen aan de echte Git-index.
- De niet-gerelateerde lokale verkorting van de contactbevestiging is niet in deze release opgenomen.

## Live vastgesteld

De Vercel-connector meldt productie `dpl_GZUYPk2EtZAB2RhFrDpS5Bj7xjqP`, bron Git, commit `bfdf87d99b08bfa85a6fda7ea0cfe2ea434bdc2b`. De browser bevestigt de redirect van apex naar www.
Op 12 september om circa 22:28 CEST gaven beide onderstaande bestaande concept-URL's HTTP 200:

- `/concepten/previews/2026-06-21-knieartrose-geen-beste-oefening.html`
- `/artikelen/na-verzwikte-enkel-instabiel-blijven.html`

Daarom is alleen `noindex` hier onvoldoende. De nieuwe uitsluitingen zijn nog niet live toegepast. De controle bewijst lokale configuratie; zij bewijst niet de inhoud van een toekomstige Vercel-deployment.

## Checks uitgevoerd

- Site quality, SEO basics, navigatiecontract, pijnwijzer, behandelpagina-kwaliteit, FAQ-generatie `--check`, FAQ-validatie en deploymentgrens: geslaagd in de afzonderlijke releasewerkmap.
- Twee bestaande, door Git genegeerde beelden van de conceptpagina MTP-1-artrodese zijn lokaal meegekopieerd om de bestaande volledige sitecheck te kunnen uitvoeren. Niet toegevoegd aan Git en geen publicatiebesluit voor de conceptpagina.
- Definitieve release in browser op poort 8789: Professionals op 360, 390 en 430 px, alle menulinks binnen beeld, geen horizontale overloop, exact één actieve paginalink, Escape sluit menu, geen gelogde consolefouten.
- Eerdere browsercontrole van dezelfde menufix op poort 8788: homepage zonder onterechte actieve sectieankers, klik naar Professionals, licht/donker menu, zichtbare toetsenbordfocus en desktop op 1440 px.
- Definitieve Professionals-canonical in de browser: `https://www.matthijsvandam.nl/professionals.html`.
- Hoofdwerkmap: publicatiecheck opnieuw geslaagd, 40 geverifieerd en 0 review nodig. Dit bevestigt behoud van de oorspronkelijke registratie; geen nieuw inhoudelijk akkoord.
- Geen `package.json`; geen npm-checks beschikbaar.

## Blocking issues

- Livegangakkoord staat open. In de afzonderlijke release staan de 40 aangepaste publieke pagina's op `review_nodig`, met hun oorspronkelijke goedkeuringsdata en notities behouden. De publicatievalidator blokkeert dus bewust; deze controle is niet als geslaagd gerapporteerd. Dit vraagt akkoord op de technische verschillen, geen verzonnen nieuwe medische review.
- Na eventuele productieplaatsing moeten beide concept-URL's onbereikbaar zijn en moeten redirect, canonical, sitemap en de versiegebonden CSS/JS opnieuw live worden gecontroleerd.

## Non-blocking issues

- Search Console/Bing-accountstatus en beeldbanktoegang zijn niet gewijzigd; zij vallen buiten deze concrete technische release.

## Drift-risico's

- De beheerpilot bindt zijn revisies aan de oorspronkelijke HTML. Daarom is het releasewerk geïsoleerd. Bij een latere bronovergang blijft een bewuste vergelijking van het Leonie-artikel nodig; geen automatische databasecorrectie of herimport. De actieve pilot is in deze opdracht niet geblokkeerd of gewijzigd.
- Een `.vercelignore` beschermt geen bestanden die elders, bijvoorbeeld in GitHub of een oudere deployment, beschikbaar zijn. Er is niets verwijderd uit Git of oudere deployments.

## Concrete herstelacties / releasevolgorde

1. Matthijs beoordeelt en geeft eventueel één expliciet akkoord op het technische pakket, inclusief www-normalisatie en het niet meer publiek aanbieden van concepten.
2. Leg dat releaseakkoord in het register vast; behoud historische inhoudelijke goedkeuringen. Geen akkoord afleiden uit testresultaten.
3. Publiceer uitsluitend de geïsoleerde technische branch, na controle van het diff. Neem geen overige wijzigingen uit de hoofdwerkmap mee.
4. Controleer de werkelijke productie-uitvoer en genoemde URL's. Werk pas daarna de werklijst bij naar afgerond.
5. Behandel een eventuele latere overgang van de actieve beheerbron afzonderlijk en met behoud van alle revisies.

## ADR-check en niet geverifieerd

ADR-0004 (consistente SEO-signalen), ADR-0006 (concept/publicatiegrens) en ADR-0014 (versiegebonden beheer) zijn toegepast. Dit is technische consistentie binnen bestaande kaders, geen nieuw paginamodel, medische inhoud of publicatiestrategie. Geen nieuwe ADR nodig; geen bestaande ADR zelfstandig geaccepteerd of vervangen. De www-inrichting is een concreet lokaal releasevoorstel onder de opdracht, geen reeds uitgevoerd domeinbesluit.

Geen deployment, domeinwijziging, formulierverzending of medische bronreview uitgevoerd. Geen volledige WCAG-audit.

Bron voor de bestaande Vercel-domeinroute: https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting (geraadpleegd 12 september 2026).

## Vastgelegde eindstand

Technische branch vastgelegd in commit `143e5a0`. Werkmap is schoon. Acht technische validators slagen; de publicatiecheck heeft uitsluitend de 40 verwachte `published_page_not_verified`-meldingen. De tien tests voor de hoofdwerkmap-werklijst slagen. De bestaande hoofdwerkmap is bytegewijs met de vooraf gemaakte momentopname vergeleken.

## Publicatiepoging na expliciet akkoord

Matthijs gaf op 12 september 2026 expliciet “ja” op de vraag dit technische pakket te publiceren. Dat akkoord is in de afzonderlijke releasebranch vastgelegd in commit `0a4a120`, bovenop `143e5a0`. De publicatievalidator slaagt: 40 geverifieerd, 0 review nodig. Dit vraagt geen nieuw publicatieakkoord.

GitHub-productietak en Vercel stonden vooraf nog op `bfdf87d99b08bfa85a6fda7ea0cfe2ea434bdc2b`. `git push origin HEAD:main` faalt met ontbrekende GitHub-aanmelding; dezelfde opdracht buiten de sandbox geeft dezelfde fout. De gekoppelde GitHub-API weigert het maken van een tree met HTTP 403 “Resource not accessible by integration”. Die mislukte poging veranderde geen branch. De bestaande GitHub Desktop-interface kon wel worden gelezen, maar bediening van de werkmap werkte niet. Geen credentials uitgelezen of gewijzigd.

Vervolg: een werkende GitHub-schrijfverbinding voor `mjjvandam/matthijsvandam.nl` herstellen, vervolgens uitsluitend de vrijgegeven release uit `/private/tmp/mvd-technical-release-20260912` fast-forward publiceren en alle voorgenomen livecontroles uitvoeren. Het akkoord blijft geldig. De twee concept-URL's zijn nog niet afgeschermd door deze release. Hoofdwerkmap en beheerpilot blijven behouden.
