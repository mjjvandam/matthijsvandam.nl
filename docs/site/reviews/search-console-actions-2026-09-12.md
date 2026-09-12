# Search Console: uitvoering punten 1, 3 en 4

Opdracht: Matthijs vroeg op 12 september 2026 uitvoering van 404-herstel, volgen van belangrijke inhoudelijke pagina's en behoud van de geldige profielmarkering. Punt 2, hostnormalisatie, is niet onderdeel van deze opdracht.

## Vijf redirects voorbereid

Alleen `vercel.json` is in de publieke configuratielaag gewijzigd. Vijf exacte permanente redirects (308), met relatieve bestemmingen op dezelfde host:

| Van | Naar |
| --- | --- |
| /behandelingen | /behandelingen.html |
| /artikelen/artrosezorg-transitie-professionals | /artikelen/artrosezorg-transitie-professionals.html |
| /artikelen/artrosezorg-transitie-patienten | /artikelen/artrosezorg-transitie-patienten.html |
| /privacy | /privacy.html |
| /projecten/we-walk | /projecten/we-walk.html |

De vijf bestemmingen zijn rechtstreeks live gecontroleerd: HTTP 200 en index, follow; ze staan in het bestaande publicatieregister. `topic=voorvoet` blijft volgens het gedocumenteerde Vercel-redirectgedrag behouden; de bestemming met deze query geeft HTTP 200. Er is geen algemene wildcard, geen redirectloop, geen hostwijziging en geen wijziging van andere Vercel-instellingen. De werkelijke 308 en querydoorgifte moeten na geautoriseerde deployment nog op Vercel worden gecontroleerd. Een lokale Python-webserver voert vercel.json niet uit.

Referenties: https://vercel.com/docs/project-configuration/vercel-json en https://vercel.com/kb/guide/how-do-i-perform-vercel-redirects-based-on-query-strings (12 september 2026 geraadpleegd).

Status: lokaal voorbereid; niet gepubliceerd. Afzonderlijk toepasbare patch: /private/tmp/mvd-five-redirects-20260912.patch. Herstelkopie: /private/tmp/mvd-vercel-before-404-20260912.json. Geen overige wijzigingen uit de vuile werkmap meenemen bij deployment. De eerder voorbereide www-release is een apart voorstel en wordt niet automatisch meegepubliceerd.

## Drie pagina's volgen

Geïnspecteerde adressen op de bestaande live www-host:

- https://www.matthijsvandam.nl/behandelingen/enkelartrose.html
- https://www.matthijsvandam.nl/behandelingen/enkelprothese.html
- https://www.matthijsvandam.nl/behandelingen.html

Alle drie melden in URL-inspectie: URL is onbekend bij Google, geen laatste crawl en geen door Google geselecteerde canonical. Dit betreft de exacte www-adressen; de varianten zonder www zijn niet afzonderlijk geïnspecteerd. Rechtstreeks geven alle drie HTTP 200 en index, follow; hun huidige HTML-canonical wijst nog naar het adres zonder www. Dat wordt hier niet veranderd.

Indexering voor alle drie (enkelartrose, enkelprothese en de klachtenhub) is aangevraagd en door Google bevestigd: toegevoegd aan prioriteitscrawlwachtrij. De aanvraag is geen bewijs van indexering of ranking. De vaste weekcheck volgt deze drie adressen en hun eventuele Google-canonical volgens SEARCH_CONSOLE_WORKFLOW.md; geen herhaald indienen zonder nieuwe aanleiding.

## Profielmarkering

Google rapporteert op 11-09-2026 één geldig item, nul ongeldige items en geen kritieke problemen. De detailweergave identificeert https://www.matthijsvandam.nl/ met itemnaam drs. M.J.J. (Matthijs) van Dam. Geen schemawijziging nodig of uitgevoerd. De weekcheck blijft dit controleren.

## Controles en grenzen

Vijf exacte unieke redirects, bestaande publieke bestemmingen, geen loops en behoud overige Vercel-configuratie gecontroleerd. Sitekwaliteit, publicatieverificatie, SEO-basis en git diff --check slagen. Geen HTML, CSS of zichtbare pagina-inhoud gewijzigd; geen nieuwe mobiele layoutcheck nodig voor deze configuratiestap. Geen package.json en geen npm-checks beschikbaar.

ADR-0004 (vindbaarheid), ADR-0006 (publieke vrijgave) en ADR-0014 (dashboard/opvolging) zijn toegepast. Geen nieuwe ADR nodig voor exact herstel van oude adressen naar bestaande publieke pagina's. Geen medische inhoud of verificatiestatus gewijzigd. Expliciete toestemming voor livegang van de vijf redirects en de daaropvolgende livecontrole staan open.
