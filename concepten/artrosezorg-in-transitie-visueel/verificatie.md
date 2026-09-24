# Verificatie — herziene NTvG-uitleg

24 september 2026. Uitgevoerd na de expliciete correctie van Matthijs: geef het NTvG-artikel zelf weer en verbeter de opmaak met afwisselende tekst/beeldplaatsing en minder breedte. Status: uitsluitend lokaal concept, geen publicatie of medische goedkeuring.

## Blocking issues

Geen gevonden voor dit lokale concept. Medische eigenaarreview en afzonderlijk publicatieakkoord blijven open. De scope is een visuele samenvatting van de beschouwing, zonder de zelfstandige Lawford-figuur of NICE-laag uit de eerste versie.

## Non-blocking issues

- De sitekwaliteitscheck meldt dezelfde 32 reeds bestaande problemen met publieke links naar concepten en de homepagekaart voor chronische enkelinstabiliteit. Begin van deze beurt: 34, inclusief twee toen verouderde designsysteembestanden. Geen nieuwe melding door het scrollverhaal.
- De publicatieverificatie meldt nu 49 bestaande publieke pagina’s waarvan de inhoud afwijkt van de eerder vastgelegde verificatie. Die pagina’s hadden bij aanvang al gebruikerswijzigingen en veranderden ook tijdens deze beurt buiten deze opdracht. Ze zijn door deze aanpassing niet geschreven of teruggezet. Dit is geen nieuw publicatieakkoord of release van die wijzigingen.

## Drift-risico's

- Meerdere gelijktijdige wijzigingen in dezelfde werkmap. Alleen het conceptpakket, de reguliere concepttekst en bijbehorende designsysteemdocumentatie zijn voor deze herziening bewerkt. Geen bestaande gebruikerswijzigingen teruggezet.
- De stijlgalerij registreert de actuele lokale bronfingerprints, waaronder gelijktijdige bestaande wijzigingen; dit verleent geen inhoudelijk of medisch akkoord.
- `eerste-versie-*.md` zijn expliciet historische dossiers. Het actuele bronoverzicht en storyboard staan zonder dat voorvoegsel. De oorspronkelijke redactionele nulversie blijft onveranderd.

## Concrete herstelacties

- Alle zes hoofdstukken opnieuw aan de NTvG-PDF gekoppeld; 777 woorden hoofdtekst.
- Nieuw vierde hoofdstuk over het landelijke programma met regionale uitvoering, inclusief eigen nieuwe illustratie. Beweeghuis, financiering, mentaal welzijn en verwachtingen beter vertegenwoordigd.
- Verwijderd uit de pagina: zelfstandige studie-analyse, 100-tekensfiguur, primaire studietabel, NICE-verdieping en bronverschillendiscussie. Interne bronnotities historisch bewaard; betwiste effectcijfers niet opnieuw als feiten opgenomen.
- Maximaal 1140 px canvas en 450 px tekstkolommen; tekst/beeld wisselen zesmaal links-rechts. Iedere figuur heeft een eigen afgerond kader en bijschrift. Sticky gedrag blijft binnen het betreffende hoofdstuk.
- Designsysteemregel, bron-/claimoverzicht, storyboard, publicatievoorstel, Markdown-tekst en SVG/PNG-deelafbeelding mee bijgewerkt.

## Checks uitgevoerd

| Controle | Resultaat |
|---|---|
| PDF versus verhaallijn | Alle vier pagina’s opnieuw gelezen; zes hoofdstukken gekoppeld aan de relevante passages |
| Desktop 1280 × 800 | Opening, afwisselende composities en nieuwe illustratie visueel gecontroleerd; licht en donker |
| Mobiel 360 × 800, 390 × 844, 430 × 844 | Alle drie breedtes visueel bekeken in licht en donker; geen horizontale overloop |
| Links/rechts-afwisseling | DOM-gridcontrole: tekst 1/2/1/2/1/2, figuur 2/1/2/1/2/1 |
| Hoofdstuknavigatie | Nieuwe labels en ankers werken; hoofdstuk 4 gaat naar landelijk-programma |
| Begeleidingsaccenten | Mobiel deel 1 en 2 bij scrollen; desktop PageDown van deel 0 naar 2, PageUp herstelt deel 0, met daadwerkelijk gewijzigde scrollposities |
| Korte/gedraaide viewport | 844 × 390: normale figuurpositie, geen sticky, geen overloop |
| Toetsenbord/leesmodus | Enter schakelt naar gewone figuren; terugschakelen werkt; hoofdstukmenu en link bediend met toetsenbord |
| Geen JavaScript | Lokale QA-fixture met scriptblokkering: alle zes figuren en GLA:D-tekst aanwezig; geen overloop |
| Verminderde beweging | Gesimuleerde matchMedia-voorkeur: has-motion uit, systeemvoorkeur weergegeven; geen OS-instelling gewijzigd |
| Grote tekst | Lokale 200%-fixture op 360 px: 32px rootlettergrootte, has-motion uit, geen overloop |
| Browserconsole | Gewone preview zonder fouten; opzettelijke scriptblokkering alleen in no-JS-test |
| `check_concept.py` | Geslaagd: 777 woorden, zes scènes, NTvG-bronlijn, geen zelfstandige studiefiguur, tekst/HTML, links, SVG en conceptgrens |
| JavaScript-syntax | `node --check story.js`: geslaagd |
| Designsysteem | `--build` en `--check`: geslaagd |
| SEO-basis | Geslaagd; 50 bestaande sitemap-pagina’s, geen concept toegevoegd |
| Sitekwaliteit | 32 bestaande meldingen, geen nieuwe |
| Publicatieverificatie | 49 gewijzigde bestaande publieke pagina’s buiten dit werk; conceptgrens van dit artikel intact |
| `git diff --check` | Geslaagd |
| Npm | Niet beschikbaar; geen package.json |
| Deelafbeelding | Opnieuw gerenderd uit SVG, 1200 × 630, visueel gecontroleerd |

## Niet geverifieerd

- Medische eigenaargoedkeuring, publicatie, live-indexatie en Search Console: niet onderdeel van deze lokale herziening.
- Fysieke telefoons, native OS-reduced-motion en volledige VoiceOver-sessie; hiervoor zijn viewport-, voorkeur- en semantiekcontroles gebruikt.

ADR-check: presentatievariant binnen bestaande artikelenopzet en ADR-0002/0004/0005/0006. Geen nieuwe architectuur, doelgroep of publicatieroute; geen nieuwe ADR nodig. Gedeelde productie-CSS en bestaande publieke pagina’s zijn door deze opdracht niet aangepast.

## Visuele verfijning en scrollgebaren — 24 september 2026

Uitgevoerd op verzoek van Matthijs: vijf geadviseerde ontwerpverbeteringen en subtiele beweging van personen. Bestanden: `build.py`, gegenereerde `index.html` en SVG/PNG-assets, `story.css`, `story.js`, `storyboard.md`; componentregel en gegenereerde designsysteemdocumentatie bijgewerkt. De 777 woorden hoofdtekst in `verhaal.json` bleven gelijk. Geen nieuwe onderzoeksgetallen of medische claims.

- Browser: desktop 1280 × 800 licht/donker; mobiel 360 × 800 en 390 × 844 licht, 430 × 900 donker. Geen horizontale overflow op deze mobiele breedtes. Mobiel programma-overzicht heeft gestapelde tekeningen en leesbare labels.
- Scrollbeweging daadwerkelijk gecontroleerd via veranderende SVG-transformatiematrix (arm) vóór/na scrollen. Alleen beweging bij scrollen; geen timer/lus. Leesmodus verwijdert `has-motion` en toont volledige verbindingen.
- QA-fixture `?qa=reduce`: systeemvoorkeur gesimuleerd, knop uitgeschakeld en geen `has-motion`. Geen echte OS-instelling gewijzigd.
- QA-fixture `?qa=nojs`: alle zes hoofdstukken beschikbaar, geen `has-js`, geen overflow.
- Browserconsole: geen waarschuwingen of fouten. Hoofdstuknavigatie en terug-naar-boven gebruikt; viewport en kleurinstelling na controle hersteld.
- `check_concept.py`, JavaScript-syntax, `design_system.py --check`, SEO-basis en `git diff --check`: geslaagd. Geen package.json, dus geen npm-checks.
- Algemene sitekwaliteitscontrole: 32 bestaande meldingen buiten dit concept (30 publieke links naar concepten en 2 homepagekaartmeldingen). Niet aangepast binnen deze opdracht.
- ADR-check: bestaande pagina-specifieke variant binnen ADR-0005/0006 en invariant 10. Geen nieuwe architectuur of publicatiepoort; geen nieuwe ADR nodig.
- Status: lokaal concept, noindex, buiten sitemap en deployment. Medische eigenaarreview en publicatiebesluit blijven open. Bewegende figuren verbeelden activiteiten en samenwerking, geen bewezen herstel.

## Actuele versie: één doorlopende reis — 24 september 2026

Deze sectie vervangt de ontwerpstatus van eerdere controles hierboven. De huidige pagina bevat acht ongenummerde momenten, 734 woorden hoofdtekst, één sticky SVG-wereld en één reizende hoofdpersoon. Hoofdbronnen: `verhaal.json`, `journey_art.py`, `build.py`, `story.css`, `story.js`; daarnaast acht gegenereerde statische SVG-uitsneden, Markdown-concept en bijgewerkte bron-/ontwerpdocumentatie. Eerdere `scene-*`-illustraties dienen nog de opening/deelafbeelding en zijn geen actieve hoofdstukken.

### Browserbewijs

- Desktop 1280 × 800 in licht en donker: gesprek, zitten, pad, regionaal netwerk en tekstkolom gecontroleerd.
- Mobiel: 360 × 800 licht, 390 × 844 licht/donker, 430 × 900 donker. Geen horizontale overflow; SVG-toneel circa 40% van viewport, leesruimte eronder. 844 × 390 schakelt naar statische leesmodus met acht uitsneden.
- 200%-tekstfixture op 360 px: 32 px rootfont, geen actieve beweging of horizontale overflow. Statische figuur, caption en grote kop bekeken.
- Reduced-motion-fixture: knop uitgeschakeld, geen `has-motion`, acht statische figuren. No-JS-fixture: acht momenten en beelden behouden. Dit zijn browserfixtures, geen echte OS-voorkeur of fysieke telefoon.
- Zit-/opsta-/loopovergang uit vier opeenvolgende scrollposities teruggelezen: eerst persoon op (210,760) met bovenlichaam y=23; daarna dezelfde positie met bovenlichaam y≈−7,8; vervolgens persoon op (490,9;987,3) met bovenlichaam y=−15. Opstaan gebeurt dus vóór verplaatsen.
- Heen/terug naar gespreksanker na snel scrollen levert exact dezelfde persoon-, camera- en beenwaarden op. Herladen op `#uitleg` herstelt scène 2 met persoon (210,760).
- Menu via Enter/Escape gecontroleerd; `aria-expanded=false` na Escape. Leesmodus toont acht figuren; terugschakelen activeert de doorlopende wereld. Browserconsole geen errors/warnings.
- Viewportoverride en kleurinstelling na testen teruggezet; preview op begin klaar.

### Checks en grenzen

`check_concept.py` (acht momenten, 734 woorden, bronlijn, links, SVG, unieke IDs, één reiziger, noindex en uitsluitingen), JS-syntax, designsysteemcontrole, SEO-basis en `git diff --check` geslaagd. Geen package.json of npm-checks. Algemene sitekwaliteit houdt 32 bestaande meldingen buiten deze conceptpagina (30 conceptlinks en 2 homepagekaartmeldingen).

Geen gemeten FPS/CPU-profiel of volledige screenreaderaudit uitgevoerd. Statische beeldcaptions en gewone HTML-tekst blijven beschikbaar. De reis betekent geen voorgeschreven behandelvolgorde of herstelgarantie. Medische eigenaarreview, NTvG-rechtencheck en publicatiebesluit blijven open. Geen commit, push of deployment uitgevoerd. ADR-0005/0006 en invariant 10 blijven de bestaande kaders; geen nieuwe sitearchitectuur of ADR nodig.

## Actuele verfijning: paginabrede wereld en eigen regie per moment

24 september 2026. Deze ronde vervangt de eerdere vaste linker tekstkolom en de eerdere illustratiestijl. Einddoel: acht rijkere momenten met afwisselende tekstplaatsing, logisch lopende hoofdpersoon en een landelijke kaart die overgaat in een regio.

- Paginabreed SVG-toneel; tekst afwisselend links/rechts, maximaal 420 px. Nieuwe perspectivische gebouwen met gevels, glas en entreetreden; verfijnde personen, zittende gesprekspartner en aangehechte armen.
- Alle acht momenten hebben eigen scrollgestuurde accenten. Nederland zoomt naar Maastricht-Heuvelland en gaat over in een schematisch regionaal netwerk. Natural Earth-contour lokaal opgenomen met bronvermelding; stippen zijn geen geregistreerde aanbieders.
- Looprichting volgt de route; bij voortgang naar links kijkt de figuur links. Terugscrollen spoelt dezelfde beweging terug. Tijdens de overgang gemeten: persoon (424,99;549,11), kijkrichting −1. Na snel scrollen en terugkeer naar `hele-persoon` exact dezelfde camera-, persoon- en beenwaarden: persoon (160;830).
- Desktop 1280×800: alle composities via desktop en/of mobiele beelden bekeken; gesprek en kaartfasen Nederland/inzoomen/regionaal netwerk expliciet visueel gecontroleerd. Licht en donker gecontroleerd.
- Mobiel 360×800, 390×844, 430×900: geen horizontale overloop. Tekst staat onder het 40svh-toneel. Kaarttiming op mobiel aangepast zodat de scène bij de volledige Nederlandse kaart begint. De podiumcaption vervangt op mobiel het kleine, overlappende kaartlabel.
- Toetsenbord: Menu met Enter geopend en met Escape gesloten. Console: geen waarschuwingen of fouten in de gewone preview.
- QA-fixtures: reduced-motion schakelt beweging uit en behoudt acht figuren; 200% tekst (32 px root) op 360 px schakelt naar leesmodus zonder overflow; zonder JS blijven alle acht momenten en beelden aanwezig.
- Conceptcheck: geslaagd, 734 woorden, acht momenten, NTvG-bronlijn, unieke IDs, geldige SVG, bron/HTML en lokale publicatiegrens. Hoofdtekst is niet gewijzigd in deze visuele ronde.
- JavaScript-syntax, designsysteem build/check, SEO-basis en git diff whitespacecontrole geslaagd. Algemene sitekwaliteit blijft 32 bestaande meldingen buiten dit concept (30 conceptlinks en twee homepagekaartmeldingen). Geen npm-checks: geen package.json.
- Opening en deelbeeld gebruiken nu de nieuwe wereld; de oude `scene-*`-illustraties zijn historisch en worden niet meer gebruikt. SVG en PNG-deelbeeld bijgewerkt.

Bestanden: conceptbron, SVG-tekenbron, builder, CSS/JS, gegenereerde HTML/beelden, storyboard, bronverantwoording en designsysteemvariant. Geen gedeelde productie-CSS of publieke pagina gewijzigd. ADR-0005/0006 en invariant 10 blijven passend; geen nieuwe structurele afspraak of ADR nodig.

Geen fysieke telefoons, native OS-voorkeur, volledige screenreaderaudit of gemeten FPS-profiel getest. De tests van no-JS, 200%-tekst en verminderde beweging gebruiken lokale fixtures. Medische eigenaarreview, NTvG-rechtencheck en publicatie blijven open. Status: uitsluitend lokaal concept, geen commit/push/deployment.

## Nieuwste controle: onafhankelijke review en reparaties

Zie [review-meerdere-rollen.md](review-meerdere-rollen.md) voor de drie reviewers, gevonden fouten, reparaties en vers browserbewijs. Deze controle vervangt oudere uitspraken over kaartopacity, statische actoridentiteit en tekstomvang: de persoon blijft nu zichtbaar naast de kaart, alle varianten gebruiken dezelfde protagonist en de hoofdtekst telt 741 woorden na één jargonverduidelijking.

## Tilburg en Orthopedisch Centrum ETZ

Op verzoek van Matthijs is alleen het visuele zoomdoel verplaatst naar Tilburg. Bestaand lokaal boomlogo toegevoegd aan de regionale scène; hoofdtekst (741 woorden) blijft ongewijzigd en noemt terecht het Beweeghuis in Maastricht-Heuvelland als artikelvoorbeeld. Bijschrift/bronverantwoording onderscheiden dit van de lokale visuele keuze. Zoomcoördinaten komen nu uit het kaart-element zelf. Desktop 1280×800 en mobiel 390×844 visueel gecontroleerd; logo zichtbaar, verbinding eindigt onder het logo. Concept-, JS-syntax-, designsysteem- en whitespacechecks slagen. De conceptcheck slaat beeld-base64 over bij de controle op verboden oude bronnamen (toevallige letterreeks in binaire data). Geen nieuwe ADR of publicatie; dezelfde lokale variant.

## Strekking aangescherpt na akkoord op bronadvies

De vier geadviseerde accenten zijn verwerkt: urgentie van onvoldoende niet-operatieve begeleiding en verandering van organisatie/vergoeding; mentaal welzijn als beschreven opbrengst; economische argumenten voor investeren in begeleiding; expliciete lokale duiding van Tilburg tijdens de kaartanimatie. Hoofdtekst nu 801 woorden. De bronkoppelingen staan in bronverantwoording.md. Geen nieuwe onderzoeksgetallen, primaire-studielaag of verandering van de plaats van chirurgie.

Bijgewerkt: verhaal.json, story.js, gegenereerde index.html/Markdown en statische captions, README/storyboard/bronverantwoording en gegenereerd designsysteemoverzicht. Desktop 1280×800: economische alinea en leesruimte bekeken. Mobiel 360×800: Tilburg-bijschrift leesbaar zonder horizontale overloop. Conceptcheck (801 woorden), JS-syntax, designsysteem build/check en git diff --check geslaagd. Bestaande lokale presentatievariant, geen nieuwe ADR nodig. Geen publicatie; medische eindbeoordeling en NTvG-rechtencheck blijven open.

## Persoonlijke opening en vier slotblokken

Op verzoek: introductie in de ik-vorm met geverifieerde ETZ-profiellink op Taco Gosens. Afsluiting met eigen sitebijdrage (drie bestaande publieke links), NOV-toolkit, NTvG-bronkaart met alle auteurs/volledige titel/tijdschriftverwijzing en patiëntenroute. Tekst/links staan in verhaal.json en worden ook naar het Markdown-concept geschreven. De acht momenten blijven inhoudelijk gelijk; hoofdtekst inclusief intro nu 802 woorden, aanvullende slotroutes apart.

Desktop 1280×900 donker: 2×2-raster bekeken. Mobiel 360×800 licht visueel bekeken; 390/430×844 gecontroleerd op één kolom en horizontale overloop (geen). Nieuwe intro/profiellink bekeken; console zonder fouten. Overlap ontdekt en hersteld: sticky toneel wordt binnen de reis afgeknipt, zodat de slotkaarten niet worden bedekt. Eindscène heeft minder lege uitloop.

Conceptcheck, designsysteembouw/-controle en git diff --check geslaagd. Alle interne kaartlinks bestaan en stonden al in de sitemap; geen nieuwe publieke link naar een concept toegevoegd. NOV en ETZ extern gelezen; NTvG-shortlink gaf geen leesbare toolrespons, bronvermelding is gebaseerd op de aangeleverde PDF. Geen gedeelde productie-CSS gewijzigd. Bestaande pagina-specifieke variant binnen ADR-0005/0006; geen nieuwe ADR. Concept/noindex, medische eindbeoordeling en rechtencheck ongewijzigd; geen publicatie.

## Compacte start

Op verzoek is de toelichting over de fictieve persoon vóór de reis verwijderd. De eerste desktopscène begint met 4rem bovenruimte en een kortere minimale hoogte, waardoor 'Het dagelijks leven' dichter onder de bedieningslijn staat. Desktop 1280×800 visueel gecontroleerd; hoofdtekst ongewijzigd. Conceptcheck, designsysteembouw/-controle en whitespacecontrole geslaagd. Alleen lokaal concept.
