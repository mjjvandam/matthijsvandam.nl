# Review vanuit meerdere rollen — 24 september 2026

## Scope en bewijsbasis

Drie onafhankelijke reviewers: bron/redactie, techniek/toegankelijkheid en ontwerp/vertelvorm. Zij bekeken bronbestanden read-only. De hoofdagent voerde de browsercontrole en reparaties uit. Eén lokale conceptpagina; geen sitebrede herpositionering, publicatie of medische goedkeuring.

## Blocking issues

Geen resterende blokkade gevonden voor deze lokale conceptvariant. Medische eigenaarreview, NTvG-rechtencheck en publicatiebesluit blijven open.

## Concrete herstelacties

- De hoofdpersoon in opening, animatie, statische beelden en deelbeeld komt nu uit dezelfde SVG-bron. Haar, gezicht en kleding blijven herkenbaar.
- De persoon verdwijnt niet meer bij de landkaart. Een apart actor-routepunt houdt hem naast de kaart, terwijl de camera de landkaart volgt.
- De extra uitzoom van de regionale scène wordt vóór de volgende scène teruggebracht naar de aansluitende camerastand. De eerdere sprong van circa 11% is verwijderd.
- Kleine mobiele SVG-pillen zijn vervangen door gewone HTML-bijschriften van 12 px. Een rustige achtergrond houdt die leesbaar waar het pad erachter langsloopt.
- Het landelijke bijschrift vermeldt direct 'schematische spreiding'; de regio wordt als schematisch netwerk gelabeld. De stippen worden niet als geregistreerde aanbieders gepresenteerd.
- De statische landelijke illustratie toont zowel Nederland als het regionale netwerk. Fragmenten van labels van aangrenzende stations worden in statische beelden verborgen.
- Lazy geladen illustraties reserveren vooraf hun verhouding met width/height en aspect-ratio.
- Het laatste zichtbare tekstanker wordt vóór een venster-/moduswisseling bewaard. De eerste versie van die fix werd tijdens de browsertest afgekeurd omdat het anker te laat werd gelezen; dit is hersteld en opnieuw getest.
- 'Het sociale domein' is vervangen door 'organisaties voor welzijn en ondersteuning in het dagelijks leven'. De hoofdtekst bevat nu 741 woorden. Geen nieuwe onderzoeksgetallen, claims of bronlaag toegevoegd.

## Checks uitgevoerd

- NTvG: de bronreviewer heeft alle vier PDF-pagina's opnieuw uitgelezen en vergeleken met de tekst. Geen wezenlijke medische fout gevonden; nationale aanpak blijft een auteursvoorstel en chirurgie houdt haar plaats. Dit is broncontrole, geen medische eigenaargoedkeuring.
- Desktop: 1024×768 en 1280×800. Opening, kaart, statische landelijke compositie en scèneovergang visueel bekeken. Deelbeeld opnieuw gerenderd en bekeken.
- Continuïteit: vlak vóór grens regionaal→landelijk cameraschaal 0,999823; vlak erna 1,000000. Actoropacity blijft aan beide kanten 1.
- Leesanker: kop van 'Samen bewegen' op y=290,734 vóór verkleinen naar 1024×550; y=290,609 in leesmodus; na vergroten terug y=290,734. Dezelfde passage blijft zichtbaar.
- Mobiel: 360×800, 390×844, 430×900; licht/donker en nationale/regiofase bekeken. Geen horizontale overflow; bijschrift 12 px.
- Lokale QA-fixtures: reduced-motion schakelt animatie uit en behoudt acht afbeeldingen met gereserveerde hoogte; 200%-tekst op 360 px geeft 32px rootfont, leesmodus en geen overflow; zonder JavaScript blijven acht momenten beschikbaar zonder overflow.
- Gewone browserpreview: geen errors/warnings in de console.
- `check_concept.py`, JS-syntax, designsysteem build/check, SEO-basis en `git diff --check`: geslaagd.
- Geen package.json; geen npm-checks beschikbaar.

## Non-blocking issues

Algemene sitekwaliteit houdt 32 bestaande meldingen buiten dit concept: 30 publieke conceptlinks en twee homepagekaartmeldingen. Niet gewijzigd in deze opdracht.

## Drift-risico's

Er bestaan andere gelijktijdige wijzigingen in onder meer local-admin en een beeldasset. Die zijn niet aangeraakt. De stylesysteemvariant is alleen voor dit concept bijgewerkt; gegenereerde stijlgids en gebruikslijst lopen gelijk. Historische verificaties blijven bewaard en zijn geen bewijs voor de huidige versie.

## Niet geverifieerd

Geen fysieke telefoons, volledige VoiceOver-audit of gemeten FPS/CPU-profiel. De tests voor verminderde beweging, grote tekst en geen JavaScript zijn browserfixtures. Publieke inhoudsverificatie/register, Search Console en livegang zijn niet opnieuw beoordeeld omdat geen publieke route verandert.

ADR-check: pagina-specifieke verfijningen binnen ADR-0005/0006 en invariant 10; geen nieuwe structuur of ADR nodig. Bestanden: conceptbron, tekenbron, builder, CSS/JS, gegenereerde HTML/beelden/Markdown, documentatie en designsysteemvariant. Geen gedeelde productiecomponent of publicatiestatus gewijzigd. Lokaal concept, noindex en deployment-uitsluiting behouden.
