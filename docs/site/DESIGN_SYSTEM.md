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
- Artikelkaarten en korte titellijsten: gebruik de bestaande renderer en paginamodellen. Controleer ook de afnemers van dynamisch gemaakte HTML, niet uitsluitend letterlijk aanwezige kaartklassen. De homepage is een compacte variant met alleen drie recente kaarten; gekoppelde patiënt- en professionalversies van hetzelfde onderwerp rouleren dagelijks en tellen als één onderwerp.
- Navigatie: één actieve route, toetsenbordbediening, Escape, zichtbare focus. Een header die sticky in de normale paginastroom staat, gebruikt vanaf het begin de contrasterende papier/inkt-variant; witte navigatietekst is alleen bedoeld als overlay boven een donker beeld. Een aangekleurde menulink vervangt niet overal de paginatitel.
- Het nieuwsbriefblok op de homepage gebruikt in lichte modus de rustige crème/groene band en in donkere modus een echt donkere groen/papier-gradient. Combineer geen lichte halftransparante achtergrond met de lichte donkere-modustekst.
- Links zijn navigatie; knoppen zijn acties. Toelichtingen en medische grenzen mogen niet verdwijnen bij compacter maken.
- FAQ blijft onder het centrale FAQ-model. De stijlgids beheert geen kopie van de vragen of antwoorden.
- Het gedeelde updatepaneel op Professionals en Advies gebruikt één compacte LinkedIn-tekstlink met klein icoon en een korte nieuwsbriefverwijzing eronder. De professionalspagina gebruikt daarvoor een eigen scrollverhaal: Nederland, Midden-Brabant, Tilburg, het netwerk en vier praktische pijlers. De kaart is schematisch; de intro houdt een directe route naar overleg/verwijzing zichtbaar. Doctolib, ZorgDomein, artikelen en updates blijven gewone functionele onderdelen buiten het verhaal. Zonder JavaScript en bij verminderde beweging blijft alle tekst leesbaar. Dit is een pagina-specifieke variant binnen de rustige vormtaal, geen nieuw algemeen kaartmodel.

- De tijdelijke feedbackvraag wordt door `feedback.js` op geregistreerde publieke pagina's toegevoegd en gebruikt uitsluitend de bestaande kleurvariabelen. `feedback.css` begrenst de kaart op mobiele schermen en lage vensters. Na vijf verschillende pagina's verschijnt zij hoogstens eenmaal per campagne; via de kleine footerlink kan iemand haar zelf openen. De kaart vraagt geen naam of e-mailadres en mag geen medische contactroute suggereren. De lokale stijlgids toont de footerafnemers; controleer de geopende kaart ook op een echte pagina. Deze toevoeging volgt de bestaande formulier- en publicatiegrenzen van ADR-0008 en ADR-0006; voor livegang blijft eigenaar-validatie open.

### Mobiel en kleurmodi

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

## Artrosezorg in beeld — vrijgegeven 24 september 2026
De goedgekeurde scrollvertelling staat op artikelen.html buiten de filters. Zonder actieve filters blijven vijf oudere titels zichtbaar; met een filter komen alle passende titels terug. De homepage toont vóór de vakgroep de eerste twee momenten. Eén gedeelde SVG-wereld en renderer verzorgen de eigen illustraties, loopbeweging, bordlink en afsluiting rond leefstijlbegeleiding en netwerkzorg. Statische illustraties behouden de inhoud bij verminderde beweging, grote tekst en zonder JavaScript. Het sitemenu blijft sticky; de gemeten hoogte reserveert ruimte erboven. CSS blijft begrensd tot het verhaal, met lokale uitzonderingen voor de twee headers. De publieke bron wordt opgebouwd via tools/build_artrose_release.py uit het beoordeelde concept; de conceptmap blijft uitgesloten van deployment.

Onder de laatste alinea van de tweede homepage-scène staat ook een gewone tekstlink naar het volledige verhaal. Die neemt lettertype en grootte van de lopende tekst over, is onderstreept en heeft zichtbare toetsenbordfocus. De getekende bordlink blijft daarnaast bestaan.

## Loopverhaal — lokaal concept, 25 september 2026

`concepten/voet-enkel-loopverhaal/` heeft op expliciet verzoek een eigen koelwitte/diepblauwe vormgeving. De gedeelde crème/groene site blijft ongewijzigd. Eén SVG-toneel naast echte HTML-tekst, met dezelfde renderer voor stilstaande beelden; mobiel staat een beperkt hoog toneel boven de tekst. Bij verminderde beweging, lage vensters of zonder JavaScript is de leesversie standaard. De pagina gebruikt geen externe animatiebibliotheek of fontdownload. De bronbestanden en het skelet blijven lokaal; medische/anatomische eigenaarreview en publicatie zijn afzonderlijk. ADR-0002/0005/0006 dekken deze conceptuitwerking; geen nieuwe structurele afspraak.
