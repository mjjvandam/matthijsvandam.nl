# Designsysteem MatthijsVanDam.nl

Vastgelegd op verzoek van Matthijs, 13 september 2026. Dit is de onderhoudsafspraak voor de bestaande vormgeving. De lokale stijlgids is geen publicatie- of medisch akkoord.

## Eén bestaande bron

- `styles.css`: kleuren, lettertypen, afstanden, componentvormen, responsive regels, licht/donker en focus.
- Bestaande HTML: structuur en paginacontext; `content.js`: kaart- en lijstweergave; `script.js` en de bestaande pagina-scripts: gedrag.
- `docs/design-system/components.json`: herkenbare onderdelen, gebruiksregels, bronpagina, selector en zoekkenmerken.
- `docs/design-system/index.html`: gegenereerde lokale stijlgids. Laadt echte pagina’s met dezelfde CSS en scripts. Geen los nagetekende componentbibliotheek.
- `docs/design-system/usage.json`: gegenereerde kandidatenlijst per onderdeel en vingerafdrukken van de bronnen.

Open via de lokale server: `/docs/design-system/index.html`. De hele map `docs/` blijft buiten deployment. Genereer met `python3 tools/design_system.py --build`; controleer met `python3 tools/design_system.py --check`. De gewone sitekwaliteitscheck neemt deze controle mee.

## Ontwerpafspraken

### Basis

Behoud de rustige crème/groene identiteit. Kleuren komen uit de bestaande CSS-variabelen (`--paper`, `--ink`, `--muted`, `--green`, `--line`, enzovoort). De stijlgids leest die waarden live. Gebruik de bestaande Inter/system-stack voor lopende tekst en bediening; Georgia voor bestaande redactionele koppen. Kaartkoppen behouden hun bestaande sans-serif variant. Geen nieuwe lettertypen of kleurbetekenissen zonder bewuste ontwerpkeuze.

Afstanden zijn contextgebonden. `section-kicker` bij een redactionele sectie is niet hetzelfde als een label binnen een kaart. De lokaal aangepaste project-context gebruikt 8 px tussen label en kop. Neem die afstand niet automatisch over op alle H2-koppen; controleer ook de algemene `.legal-page h2`-regel en de CSS-specificiteit. Voeg niet telkens een nieuwe pagina-uitzondering onderaan de CSS toe als dezelfde component bedoeld wordt.

### Onderdelen

De catalogus beschrijft navigatie, projectcontext, artikeloverzicht, artikelkaarten/titellijsten, toelichtingspanelen, knoppen/links en FAQ. De daadwerkelijke pagina blijft het voorbeeld, inclusief haar huidige lokale staat. Niet alle lokale pagina’s zijn live; de gebruikslijst onderscheidt registerpagina’s en concepten. `registered` betekent alleen opgenomen in het publicatieregister, niet dat de actuele lokale versie is goedgekeurd.

- Een gewone overzichtstitel is betekenisvol en zichtbaar tenzij Matthijs bewust kiest voor een onzichtbare H1, zoals bij Artikelen. Gebruik dan `visually-hidden`, geen `display:none` of `aria-hidden`.
- Artikeloverzicht: filters links op desktop; doelgroepknoppen altijd zichtbaar met alleen een toegankelijk groepslabel “Voor wie”, onderwerp uitklapbaar op mobiel. Op mobiel staan de groepen onder elkaar om de langere ik-labels ruimte te geven. De keuzes zijn “Ik ben patiënt” en “Ik werk in de zorg”; medewerkers vallen onder zorgprofessionals. Keuze aan/uit met dezelfde knop, `aria-pressed`, alleen geldige combinaties, herstel van conflicterende oude URL’s. Geen automatische uitbreiding van dit filtermodel naar de pijnwijzer of andere zorglogica.
- Artikelkaarten en korte titellijsten: gebruik de bestaande renderer en paginamodellen. Controleer ook de afnemers van dynamisch gemaakte HTML, niet uitsluitend letterlijk aanwezige kaartklassen.
- Navigatie: één actieve route, toetsenbordbediening, Escape, zichtbare focus. Een aangekleurde menulink vervangt niet overal de paginatitel.
- Links zijn navigatie; knoppen zijn acties. Toelichtingen en medische grenzen mogen niet verdwijnen bij compacter maken.
- FAQ blijft onder het centrale FAQ-model. De stijlgids beheert geen kopie van de vragen of antwoorden.
- Het gedeelde updatepaneel op Professionals en Advies gebruikt één compacte LinkedIn-tekstlink met klein icoon en een korte nieuwsbriefverwijzing eronder. De professionalspagina gebruikt daarnaast een eigen twee-kolomsopbouw voor samenwerkingsvragen, met het schoenmakersspreekuur als brede praktijknotitie. Dit zijn varianten binnen de bestaande rustige vormtaal, geen nieuw algemeen kaartmodel.

### Lokale variant: visueel artroseartikel

`concepten/artrosezorg-in-transitie-visueel/` is een pagina-specifieke visuele uitleg van de NTvG-beschouwing, op expliciet verzoek uitgewerkt als één doorlopende reis. Acht ongenummerde momenten delen één SVG-wereld met één hoofdpersoon en een scrollgestuurde camera. De illustratie heeft een licht isometrisch pad; de trap is een dagelijks element, geen behandelhiërarchie. Desktop wisselt maximaal 420 px tekst links en rechts af, met een paginabreed toneel; mobiel blijft het toneel in de bovenste 40svh. Gewone browserscroll blijft leidend. Loopbeweging volgt afgelegde afstand, met geometrisch geplaatste voeten; zitten/opstaan en camerastanden zijn herleidbaar tot dezelfde scrollpositie. Bij stilstaan geen animatielus. Zonder JS, in leesmodus, bij reduced-motion, tekst groter dan 20 px of vensters lager dan 600 px verschijnt dezelfde tekst met statische uitsneden van dezelfde wereld. Het bewegende toneel volgt de lichte/donkere pagina-achtergrond. Statische illustraties houden hun lichte ondergrond. Elk moment heeft scrollgestuurde accenten; de landelijke kaart zoomt naar Tilburg en gaat over in een schematisch netwerk. Kaartcontour van Natural Earth (publiek domein); stippen tonen geen aangesloten zorgverleners. Bronnen: `verhaal.json`, `journey_art.py`, `build.py`, `story.css` en `story.js`. Eén protagonistbron houdt de persoon herkenbaar in opening, animatie en leesversie. Op mobiel vervangen leesbare HTML-captions de kleine SVG-pillen. De figuur blijft naast de landkaart zichtbaar; stilstaande beelden reserveren hun beeldverhouding en moduswisselingen bewaren het leesanker. Alleen dit lokale concept is afnemer. Geen gedeelde productie-CSS, indexering of publicatiepoort gewijzigd. Medische eigenaarreview en de NTvG-rechtencheck blijven apart.

### Controle van breedtes en kleurmodi

Controleer wijzigingen op 360, 390 en 430 px en een desktopbreedte, in licht én donker. Controleer lange titels, focus, actieve/lege filterstaat, afbeeldingen en horizontale overflow. Gebruik de breedte- en kleurkeuze in de stijlgids als hulpmiddel en controleer minstens één echte bronpagina buiten het iframe. Een groene technische check bewijst geen prettige vormgeving of volledige toegankelijkheid.

## Verplichte route bij een volgend wijzigingsverzoek

1. Lees deze afspraak en bepaal het onderdeel. Voer bijvoorbeeld `python3 tools/design_system.py --impact project-context` uit, of `--impact styles.css` / een paginapad.
2. Bepaal of het een **gedeelde componentwijziging**, een **bestaande variant** of een **bewust pagina-specifieke uitzondering** is. Een wijziging van een gedeeld onderdeel geldt standaard voor alle relevante afnemers. Leg uitzonderingen met reden vast; verander geen medische inhoud of patiënt/professional-route als neveneffect.
3. Pas de bestaande bron aan. Bij een gedeeld patroon pas je alle relevante pagina’s/afnemers mee aan; kopieer geen losse stijl per pagina. Is alleen die ene pagina bedoeld, leg de beperkte scope vast.
4. Werk de regel in de catalogus en deze gids bij als betekenis, gedrag of gebruik verandert. Voeg een nieuw herkenbaar onderdeel toe wanneer de catalogus het nog niet dekt. De impactlijst is conservatief: inline styles, nieuwe selectors en indirecte JS-afnemers vereisen handmatige controle.
5. Genereer de stijlgids/gebruikslijst opnieuw. Dit synchroniseert bronnen en voorbeelden, maar verleent geen akkoord. Controleer de echte getroffen pagina’s, inclusief relevante concepten zonder hun status te wijzigen.
6. Voer sitekwaliteit en passende functie-/SEO-/publicatiechecks uit. Leg in de oplevering vast: gewijzigde component, bijgewerkte regel, getroffen pagina’s, gemotiveerde uitzonderingen, visuele controles en lokale/live-status.
7. Bij vrijgegeven publicatie: zorg voor verse CSS/JS-cacheversies op alle getroffen publieke afnemers. Voer de bestaande Search Console-workflow uit waar relevant. Publiceer alleen het expliciet goedgekeurde pakket.

Codex moet deze route zelfstandig meenemen; Matthijs hoeft niet opnieuw om synchronisatie te vragen. De route borgt toekomstige werkwijze en maakt bronwijzigingen detecteerbaar. Zij garandeert niet dat een toekomstige agent nooit een regel overslaat; daarom blijven diff- en visuele controle nodig.

## Borging en grenzen

`tools/check_site_quality.py` roept de designsysteemcontrole aan. Veranderde bronbestanden, nieuwe/veranderde afnemers of ontbrekende voorbeelden geven een fout totdat de catalogus opnieuw is beoordeeld en gegenereerd. Een ontbrekende catalogusmatch moet handmatig worden onderzocht; een lege impactlijst betekent niet dat er geen effect is.

De checker controleert synchronisatie en afnemers, niet alle CSS-semantiek. De voorbeeldpagina haalt op elke herlaadactie de echte lokale pagina op. Voor een gewijzigde stijlregel blijft controle van de berekende stijl en visuele pagina noodzakelijk.

ADR-check: documentatie en verificatie van bestaande vormgeving binnen INVARIANTS §10, bestaande paginamodellen en ADR-0004/0006. Geen nieuwe productiearchitectuur, inhoudspijler, renderer of publicatiepoort; geen nieuwe ADR nodig voor deze vastlegging. Een latere herpositionering, vervangende componentarchitectuur of nieuw visueel systeem vraagt opnieuw de bestaande ADR-beoordeling.

De lokale artrosevariant sluit af met vier vervolgroutes in een 2×2-raster (één kolom onder 850 px). De kaarten hebben afzonderlijke koppen en beschrijvende tekstlinks; het bronanker staat op de NTvG-kaart. De sticky wereld blijft afgeknipt binnen de verhaalcontainer. Deze afsluiting heeft alleen het lokale concept als afnemer.
De eerste desktopscène van het lokale artroseverhaal sluit compacter aan op de bedieningslijn (4rem bovenruimte, tekst bovenaan); de algemene toelichtingsregel vóór de reis is op verzoek verwijderd.

De lokale plaatsingspreviews in `concepten/artrosezorg-in-transitie-visueel/integratie/` worden met `build_integration.py` uit de huidige homepage, artikelhub en verhaalbron opgebouwd. De artikelhub toont standaard drie kaarten en vijf eerdere titels; een actief doelgroep-, onderwerp- of projectfilter toont alle passende artikelen. Het volledige scrollverhaal staat daarna als zelfstandige sectie buiten het filter. De homepage toont na de gewone artikelen een korte voorproef met dezelfde SVG-persoon; alleen scrollen beweegt de benen en de persoon. Op mobiel volgt het beeld direct op de titel. Reduced-motion en grote tekst houden de figuur stil. Verhaal-CSS is met `@scope` geïsoleerd; eigen sectieklassen veranderen de productiestijlen niet. Dit is een lokale plaatsingsvariant binnen ADR-0001/0004/0005/0006; publieke navigatie, medische vrijgave en publicatie blijven afzonderlijk.

De homepageplaatsingspreview is uitgebreid: vóór het vakgroepblok staan de bestaande inleiding en de echte eerste twee momenten van het scrollverhaal. Na ‘Meer dan het gewricht’ volgt een link naar ‘Uitleg en begrijpen’ in de volledige versie. Dezelfde renderer en tekstbron verzorgen animatie en statische leesmodus; de eerdere losse teaseranimatie is niet meer in gebruik.

De homepagevoorproef sluit af met dezelfde hoofdpersoon die een bord ‘Lees verder’ neerzet. De SVG-link heeft een beschrijvende toegankelijke naam en zichtbare focus. De plaatsbeweging volgt scroll; zonder JS of bij reduced-motion staat het bord op de grond. Dit vervangt de losse slotvraag en onderstreepte tekstlink. Alleen de lokale homepagevariant is afnemer.

Correctie homepagebord: gebruik dezelfde reiziger in `world-camera`; geen apart afsluitbeeld of tweede hoofdpersoon. Het bord beweegt met die wereld en krijgt pointer-/toetsenbordtoegang zonder een aria-hidden voorouder. Alleen decoratieve SVG-elementen zijn verborgen voor hulptechnologie. Statische leesmodus biedt een gewone vervolg-link. `farewell.js` is niet meer aangesloten.

De homepage-inleiding bij de lokale artrosevoorproef gebruikt nu één compacte tekstkolom over de contentbreedte, zonder introductieafbeelding. De titel heeft geen geforceerde regelafbreking. De eerste geanimeerde scène sluit met beperkte bovenruimte aan; de volledige artikelopening blijft ongewijzigd.

Het homepagebord wordt geleidelijk vanuit de broekzak uitgepakt: eerst klein, vervolgens ontvouwen onder borsthoogte en lager naast de persoon neergezet. De arm volgt de beweging; klik- en tabbediening worden pas na het neerzetten actief. Alle tussenstanden volgen de scrollpositie, ook achteruit.

De aansluiting op ‘Het dagelijks leven’ is op de homepage compacter: desktop 0,5rem bovenruimte aan moment en tekst; mobiel 42svh, inclusief het gereserveerde 40svh-beeld. Zo blijft de tekst vrij van het scrolltoneel.

De homepagecamera begint op desktop hoger (42% van de toneelhoogte, geleidelijk naar 52% in de tweede scène). De eerste scène gebruikt minimaal 105svh en 12vh onderruimte; de tweede tekst begint bovenaan met 8vh ruimte. Dit beperkt de lege overgang zonder de mobiele camerastand of volledige artikelreis te wijzigen.

De hogere openingscamera geldt ook voor het volledige lokale verhaal en de artikelenplaatsing: desktop 42% in scène 1, vloeiend naar 52% in scène 2 en vervolgens 64% in scène 3. Latere scènes en mobiel behouden hun camerastand. Dit voorkomt het lege vlak boven de illustratie tijdens de eerste overgang.

De afsluitkaart ‘Zo probeer ik bij te dragen’ bevat in het lokale artroseconcept een gecentreerde nieuwsbriefuitnodiging tussen de lopende tekst en projectlinks. Gebruik een zachte okertint gemengd met de bestaande kaartkleur en een beschrijvende tekstlink naar de bestaande nieuwsbriefpagina. Geen nieuw formulier of inschrijfproces; kleurvariabelen volgen licht/donker.

Ook de volledige lokale artikelopening is compact en zonder introductieafbeelding: titel zonder geforceerde regelafbreking, brede inleiding en geen minimale herohoogte. De eerste illustratie staat in het scrolltoneel. Dezelfde bron voedt de zelfstandige pagina en artikelenplaatsing; de homepage houdt haar eigen korte inleiding.

In de eerste scène tekent een warme terracottalijn van linksonder naar rechtsboven over het verbindingspad. Het bijschrift ‘Meer mensen met artrose’ koppelt dit aan de verwachte groei in de tekst; de lijn heeft geen schaal of numerieke betekenis. Ze wordt tijdens de leesfase getekend en vervaagt vóór de loopbeweging begint. Vooruit/achteruit scrollen bepaalt de tussenstand. De lijn is decoratief en wordt in de statische leesuitsneden weggelaten; de inhoudelijke uitleg blijft identiek.

De laatste scène van het lokale artroseverhaal heeft een doorlopend slotbordes. Dezelfde hoofdpersoon loopt vanaf een startmarkering langs uitleg, leefstijlbegeleiding naar het netwerk rond de persoon. Drie korte loopstukken wisselen af met rust; scrollpositie bepaalt ook achteruit de volledige toestand. De slotmarkering beëindigt het verhaal en suggereert geen genezing of verplichte behandelvolgorde. De statische leesversie toont de complete compositie en dezelfde betekenis in het bijschrift. Alleen het volledige concept en de artikelenplaatsing gebruiken deze afsluiting; de homepagevoorproef blijft bij de eerste twee scènes.

In het slotbeeld heet de begeleiding ‘Leefstijlbegeleiding’. Twee personen verbeelden persoonlijke ondersteuning; het losse voedingssymbool is verwijderd om leefstijl niet tot eten en bewegen te beperken. Tekst, beeldlabel en statisch bijschrift gebruiken dezelfde term.

De lokale artikelen- en homepageplaatsingen behouden het sitemenu via een sticky header. De gemeten headerhoogte bepaalt de bovenrand van het scrolltoneel; desktop gebruikt de resterende vensterhoogte en mobiel houdt een beeldstrook van 40svh onder het menu. Hoofdstukankers houden rekening met deze bovenruimte. De gedeelde productieheader blijft ongewijzigd.
