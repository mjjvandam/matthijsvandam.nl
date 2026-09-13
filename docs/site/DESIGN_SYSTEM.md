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
