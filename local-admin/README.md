# Lokale beheeromgeving

Een werkende lokale artikelenpilot onder het door Matthijs op 9 september 2026 geaccepteerde [ADR-0014](../docs/decisions/ADR-0014-editorial-workspace.md). Geen nieuwe dienst of abonnement.

## Openen

Dubbelklik op `Start beheer.command`, of vraag Codex: **“Open de lokale beheeromgeving.”** Het venster van de lokale server moet geopend blijven. Afsluiten stopt de server, maar bewaart de opgeslagen teksten. Starten kan ook vanaf de projectmap:

```sh
python3 local-admin/server.py serve --port 8878 --open
```

Gebruik Python 3.9 of nieuwer; de toepassing is op deze Mac getest met Python 3.9.6. De toepassing gebruikt alleen de standaardbibliotheek; er is geen npm-installatie of buildstap. Het lokale adres is `http://127.0.0.1:8878/`. Dit werkt op deze computer. De browser van iemand anders of een telefoon heeft hiermee geen toegang.

## Wat de knoppen doen

- **Lokaal opslaan** legt de tekst duurzaam vast in de lokale database, met een nieuwe versie. Bij een gelijktijdige wijziging blijft je invoer behouden en volgt een vergelijking.
- **Werkversie bekijken** toont de opgeslagen versie in de bestaande artikelvormgeving. Bij onopgeslagen wijzigingen heten zowel knop als tab **Opslaan & bekijken**; ze slaan dan eerst lokaal op.
- **Wijzigingen ter beoordeling** legt de versie en de gebruikte weergavebestanden vast. Matthijs kan die versie goedkeuren of met toelichting terugsturen.
- **Herstellen** maakt van een oudere tekst een nieuwe versie. Het hergebruikt geen oud akkoord.
- **Lokaal publicatiepakket maken** schrijft uitsluitend een lokaal ZIP-bestand met uitvoer en controlemanifest. Pak dat voor een releasecontrole buiten de websiteprojectmap uit: de HTML erin bevat de beoogde publieke metadata. Een pakket is geen publicatie en geen vervanging van de bestaande sitechecks.
- **Bekeken** bij een taak is een persoonlijke leesmarkering met optionele notitie. Dat verandert geen medische verificatie of publicatiestatus. Als de bron wijzigt, wordt de taak opnieuw opengezet.

De eerste bewerkbare pagina is een geïsoleerde kopie van het bestaande nieuwsbericht over Leonie Meihuizen. Het artikel kan volledig binnen zijn bestaande tekststructuur worden bewerkt. Extra tekstblokken, afbeeldingkeuze, andere artikeltemplates en nieuwe artikelen vereisen een volgende gecontroleerde importstap. De bestaande publieke HTML en `content.js` blijven voor de website de publicatiebron totdat de overgang bewust wordt vrijgegeven.

## Gepubliceerd artikel en werkversie

De artikelkaart en editor tonen afzonderlijk de publicatiestatus en de stand van je lokale werkversie. **Gepubliceerd · Werkversie ongewijzigd** betekent dat je dezelfde artikelinhoud voor je hebt; het is geen tweede conceptartikel dat nog gepubliceerd moet worden. Na bewerken zie je eerst **Niet-opgeslagen wijzigingen** en na opslaan **Lokale wijzigingen · nog niet gepubliceerd**. De gepubliceerde pagina blijft via een aparte link bereikbaar.

De publicatiestatus volgt de actuele sitebestanden en publicatieregistratie; dit is geen automatische controle van de livewebsite. De werkversie wordt inhoudelijk vergeleken met de oorspronkelijke import, inclusief de artikelkaart. Terugzetten naar die inhoud wordt daarom ook bij een hoger versienummer als ongewijzigd herkend. Een gewijzigde externe bron vraagt om vergelijking; ontbrekend of tegenstrijdig bewijs wordt niet als zeker gepubliceerd of ongewijzigd weergegeven.

Beoordelen en goedkeuren gaan over de lokale wijzigingen. Een al gepubliceerd artikel zonder lokale wijzigingen vraagt niet opnieuw om akkoord. Opslaan, een akkoord en een uitvoerpakket veranderen de publicatiestatus niet. Dit onderscheid verandert geen opgeslagen workflowstatus, medische verificatie of eerder eigenaarbesluit.

De pagina's over aandoeningen en behandelingen staan in **Nog te doen**, met hun actuele status en een lokale leesweergave. De vier al gepubliceerde pagina's worden niet uit verouderde todo's opnieuw aan de medische reviewlijst toegevoegd. Lisfranc staat afzonderlijk buiten het normale publicatiespoor.

De werklijst bevat ook contact, nieuwsbrief, redactionele concepten, techniek, vindbaarheid en beheer. Vier categorieknoppen en filters voor openstaande punten, wachten, later, afgerond en bekeken houden het overzicht compact. Iedere aanvullende werktaak toont een volgende stap en een peildatum. **Bekeken** haalt zo'n werktaak niet uit de open lijst; afronding volgt pas uit gecontroleerd bewijs. De medische leeslijst behoudt de eigen bestaande werkwijze.

Deze aanvullende taken worden onderhouden in `work-items.json`, met bronpaden en gecontroleerde inhoudsversies. Wijzigt of ontbreekt een bron, dan vraagt de taak opnieuw om statuscontrole en vervalt een oude leesmarkering. Werk de betreffende taak pas na herbeoordeling bij. Dubbele algemene verslagtaken worden alleen vervangen zolang de concrete taken bij het actuele verslag horen. Zie [de inventaris en onderhoudsafspraken](WORK_ITEMS_REVIEW.md).

## Frisse blik

**Frisse blik** toont één verbeteridee tegelijk, vanuit bijvoorbeeld een ondernemer, ICT'er, arts/verwijzer, patiënt of redacteur/ontwerper. De eerste verzameling is door Codex samengesteld voor deze site. Ook grotere mogelijkheden, zoals geavanceerdere bezoekersanalyse, een zoekfunctie, een brongebonden AI-leesassistent en advertentieruimte, mogen als onderzoeksidee worden voorgesteld. Per idee staan het voorstel, de mogelijke waarde, een eerste stap, de inspanning, een afweging en een manier om het te toetsen.

- **Ander idee** bladert door de beschikbare verzameling. Het start geen nieuwe AI-run.
- **Bewaren als idee** bewaart je keuze lokaal, zodat je het idee later terugvindt.
- **Naar Nog te doen** voegt één onderzoekstaak toe aan de bestaande werklijst. Het geeft geen opdracht om een dienst aan te schaffen, code uit te rollen of het voorstel publiek te activeren.
- **Past niet bij mij** haalt het voorstel uit de nieuwe ideeën. De keuze blijft terug te vinden en kan worden teruggedraaid.

De datum bij de verzameling geeft aan wanneer Codex de ideeën inhoudelijk heeft samengesteld. Vernieuwen leest die verzameling opnieuw. Er is geen nieuwe automatische routine of modelverbinding ingericht. Je kunt Codex vragen om nieuwe ideeën te maken; eerder bewaarde en afgewezen ideeën geven daarbij concrete feedback. Dit is geen voorspelling van opbrengst of aangetoonde behoefte van echte patiënten.

De verzameling staat in `ideas-catalog.json`; je keuzes staan privé in `state/ideas.json`. Nieuwe tekst bij een bestaand idee wordt niet stilzwijgend dezelfde gekozen taak. De opslag controleert de versie van zowel het idee als je keuze. Bij gelijktijdige wijzigingen volgt een melding en wordt een oudere keuze niet stil overschreven. Een taak verdwijnt weer uit **Nog te doen** wanneer je het idee uit die selectie haalt.

Lees bij aanvullen eerst de actuele site, de bestaande taken en de keuzes. Gebruik de perspectieven als denkrichtingen, onderbouw bestaande mogelijkheden met primaire bronnen, vermeld onzekerheden en begin grotere ideeën met een kleine toets. Voeg iets toe dat verder gaat dan een al bekende onderhoudstaak. Bewaar stabiele ID's voor hetzelfde idee, wijzig de inhoudsdatum pas na een echte herbeoordeling en controleer gewijzigde leveranciersmogelijkheden opnieuw. Alleen een lokaal idee vastleggen verandert de sitepositionering niet; uitvoering blijft een eigen concrete opdracht.

## Agents, routines en bezoekers

**Agents & routines** leest de vier bestaande lokale automationconfiguraties bij het ophalen van het dashboard. De interface toont ritme, ingeschakeld/gepauzeerd, laatste aantoonbare verslag en aandachtspunt. Een volgende run wordt niet uit een onbekend scheduleranker berekend. De configuraties worden niet gewijzigd en er worden geen taken gestart.

Per routine staat de laatste beschikbare terugblik direct in beeld: **Gedaan**, **Uitkomst** en **Vervolg**, met verslagdatum. Het startdashboard toont daarvan één korte regel. Een terugblik beschrijft het gedateerde verslag; actuele opvolging staat bij **Nog te doen**. De weekcheck en maandelijkse APK hebben een leesversie van hun bronverslag, zonder correspondentiegegevens. De originele private automationnotities worden niet aangeboden. Ontbrekend uitvoeringsbewijs wordt als ontbrekend gemeld.

De korte terugblikken staan in `routine-recaps.json`. Ze zijn gekoppeld aan de exacte inhoud van het nieuwste verslag of de nieuwste gedateerde runnotitie; een eventuele latere eigenaaruitkomst heeft een aanvullende bronverwijzing. Bij een nieuw of gewijzigd verslag worden oude samenvattingsregels niet als nieuwe uitkomst getoond. Lees het nieuwe verslag, schrijf maximaal drie korte regels, controleer eventuele latere afhandeling en werk pas daarna de betreffende bronversies bij. Deze weergave start of wijzigt geen routine.

Codex-taken zijn een gedateerde momentopname, aangeleverd via de Codex-app. **Vernieuwen** leest de beschikbare momentopname opnieuw; het maakt een oudere opname niet actueel. Bij opnieuw ophalen wordt een opname ouder dan vijf minuten als verouderd gemarkeerd. Er draait geen verborgen monitor.

**Bezoekers** toont een gecontroleerde momentopname van de bestaande Vercel-statistieken en een link naar het actuele dashboard. Periode, productieomgeving en tijdstip blijven zichtbaar. Onbekende cijfers worden niet als nul getoond. De huidige connector biedt hier geen permanente analytics-API-toegang; de ingelogde browser wordt niet omgezet in een verborgen credential. Een toekomstige automatische koppeling gebruikt een afzonderlijke servercredential binnen de bestaande Vercel-accountcontext. De [officiële API](https://vercel.com/docs/analytics/web-analytics-api) ondersteunt tellingen en aggregaties, maar die koppeling is nog niet ingericht.

Het startdashboard toont de vijf best bezochte pagina's uit die opname; **Bezoekers** toont de volledige beschikbare ranglijst. Paginanamen komen uit het bestaande publicatieregister. Sortering volgt het aantal bezoekers; afzonderlijke homepageadressen worden niet opgeteld. De twee hoofdtellers hebben een korte uitleg en een absolute periode. Het optionele `period_label` is alleen een leesbaar label bij de ongewijzigde providerperiode; het wijzigt geen aantallen of vastlegtijdstip. Zie [de bezoekerscontrole](../docs/site/reviews/analytics-dashboard-2026-09-10.md).

## Codex en de editor gebruiken dezelfde bron

Voor dit pilotartikel mag Codex de publieke HTML niet naast de beheerbron gaan aanpassen. De vaste ID is `leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort`.

```sh
python3 local-admin/server.py list
python3 local-admin/server.py export leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort --out /private/tmp/mvd-artikel.json
```

`export` meldt de basisversie. Wijzig de gewenste velden in het geëxporteerde document en sla via dezelfde opslaglaag terug, met dat exacte versienummer:

```sh
python3 local-admin/server.py save leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort --input /private/tmp/mvd-artikel.json --base-revision 1
```

Het nummer `1` is alleen een voorbeeld: neem altijd de gemelde actuele basisversie. Een inmiddels verouderde versie wordt geweigerd. De CLI registreert de actor als Codex. Een expliciet eigenaarakkoord wordt in het lokale eigenaarscherm vastgelegd; de CLI kan geen akkoord namens Matthijs geven. Voor niet-geïmporteerde pagina's blijft de gewone bestaande redactieroute gelden.

## Lokale staat en toegang

`state/editorial.sqlite3` bevat revisies en actielog. `state/task_checks.json` bevat persoonlijke leesmarkeringen. `state/agents.json` en `state/analytics.json` bevatten alleen samengevatte momentopnamen. Staat en uitvoer zijn uitgesloten van Git; heel `local-admin/` is uitgesloten van Vercel. Bewaar de hele `state/`-map in een eigen lokale back-up wanneer er belangrijke nieuwe teksten in staan; uitsluiten van Git is geen back-up.

De server luistert alleen op loopback. Sessiecookies, oorsprongcontrole en een wijzigingstoken weren verzoeken van andere websites. De gebruikersaccount van deze computer is de eigenaarsgrens. Dit is geen bewezen login- of rollenmodel voor meerdere mensen; wie dezelfde computeraccount beheert, kan de lokale staat aanpassen.

## Controle

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s local-admin -p 'test_*.py' -v
python3 tools/check_site_quality.py
python3 tools/check_publication_verification.py
python3 tools/check_seo_basics.py
git diff --check
```

Tests gebruiken tijdelijke opslag. Testgoedkeuringen zijn geen medische eigenaarbesluiten en mogen niet in de echte werkdatabase blijven staan. Zie het bijgewerkte ontwerpdocument voor de daadwerkelijk uitgevoerde controles en resterende stappen.

## Vindbaarheid in Google

Overzicht en Bezoekers tonen de gedateerde Search Console-opname uit `state/search-console.json`: verificatie, sitemapverwerking en indexering met eigen rapportdatum. Zeven dagen na ophalen wordt opnieuw controleren getoond. Een schermverversing leest de opgeslagen opname. De bestaande weekcheck en relevante ontwikkeltaken volgen `SEARCH_CONSOLE_WORKFLOW.md`; toegang via de ingelogde browser blijft nodig. Dezelfde vervolgtaak staat bij Nog te doen, zonder dubbele werklijst.
