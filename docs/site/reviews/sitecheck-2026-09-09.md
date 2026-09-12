# Wekelijkse hoofdredactiecheck — 9 september 2026

## Prioriteiten
- **Kritiek:** geen gevonden binnen de gecontroleerde scope.
- **Belangrijk:** lokale menufixes visueel nacontroleren met verse CSS/JS vóór eventuele publicatie. Browser toonde oude assets; verse lokale browsercontrole op poort 8788 werd geweigerd op basis van afgewezen toestemming. Geen omweg gebruikt.
- **Later:** bestaande canonical-hostkeuze en beeldbankbereikbaarheid valideren. Conceptbehandelpagina’s en pijnwijzer behouden medische review/publicatiepoort. Actualiseer oudere tellingen in Known Drift Risks bij een documentatieronde.

## Ter kennisname
De controle van 9 september is afgerond: acht validators slagen en 40 publieke pagina’s zijn geverifieerd. De menuaanpassingen zijn alleen lokaal aangebracht en vragen nog een visuele nacontrole. Die actie staat afzonderlijk op de to-dolijst; Bekeken markeert uitsluitend deze samenvatting als gelezen.

## Gedaan en gewijzigd
- `tools/check_navigation_contract.py`: niet-publieke bestanden onder local-mail-preview hebben geen sitemenu nodig. Sitemap- of robots-indexbestanden blijven gecontroleerd. Dit verwijdert 18 foutpositieve meldingen uit zes mailvoorbeelden, ook in de site-qualitycheck.
- `script.js`: sectieankers worden niet meer allemaal als aria-current=page gemarkeerd; op homepage werden vijf sectielinks tegelijk als huidige pagina aangegeven.
- `styles.css`: hover/actieve navigatietekst op lichte menupanelen gebruikt bestaande --ink-kleur. Oude gemeten combinatie #c49a46 op #dce8df had contrast circa 2,07:1. Donkere themaregels blijven bestaan.
- Alleen deze drie bestaande codebestanden plus dit verslag zijn in deze run gewijzigd. Bestaande gebruikerswijzigingen in ADR/documentatie en mailpreview zijn behouden.

## Checks uitgevoerd
- Acht validators slagen: site quality, publication verification, SEO basics, foot pain guide, treatment page quality, navigation contract, FAQ generatie --check, FAQ validatie.
- 40 publieke pagina’s, 40 geverifieerd, 0 review_nodig; 53 overige HTML-bestanden buiten publieke registerscope. Registerstatus is niet veranderd.
- Tijdelijke fixturecontrole bewijst dat niet-publieke mail wordt overgeslagen maar sitemap/robots-indexmail navigatiecontrole houdt.
- Extra statisch: 85 HTML-bestanden (zonder mailpreview/beeldbank), 142 JSON-LD-blokken; geen ontbrekende lokale verwijzingen, kapotte anchors of JSON-parsefouten.
- Browser vóór menufixes: homepage, behandelhub, professionals, advies, hallux rigidus, bariatrieartikel, obesitasmedicatieartikel en conceptpijnwijzer op 360/390/430 px. Geen horizontale overloop, defecte geladen afbeeldingen, ontbrekende H1/main of consolefouten. Lazy images niet allemaal door scrollen afgedwongen; lokale assetbestanden wel statisch gecontroleerd.
- Contactformulier en menu visueel bekeken; gelabelde velden, zichtbare focus en rustige bestaande vormtaal. Menufouten hierboven gevonden.
- Lokale HTTP 200 voor homepage, professionals, advies, robots en sitemap. git diff --check schoon. Geen package.json; geen npm-checks.

## Redactie en veiligheid
De homepage onderscheidt patiëntoriëntatie, verwijzers/collega’s en advies voor organisaties. Professionals verwijst patiëntdossiers/verwijzing naar officiële routes; advies sluit patiëntvragen en medische gegevens uit. Contacttekst maakt grenzen en afwezigheid van automatische nieuwsbriefinschrijving zichtbaar. Het recente bariatrieartikel benoemt onzekerheid, niet-gerandomiseerde vergelijking en individuele afweging, met gelabelde bronsoorten. Dit is een beoordeling van tekst en veiligheidsgrenzen, geen nieuwe medische bronverificatie of inhoudelijke goedkeuring.

## Niet geverifieerd en menselijke review
Geen volledige WCAG-audit, live deployment/canonicalcontrole, nieuwe medische factcheck of end-to-end formulierverzending uitgevoerd. Browsernacontrole van nieuwe menu-CSS/JS niet geslaagd wegens oude assets en geweigerde verse lokale test; niet als geslaagd gerapporteerd. Cacheversies in HTML nog niet aangepast: verwerken bij een eventuele expliciet goedgekeurde release.

Menselijke review nodig: ja voor visuele nacontrole en eventueel livegangakkoord; geen nieuwe medische claims. ADR-0004, 0005 en 0006 blijven leidend; geen structurele wijziging of nieuw ADR nodig. Publicatiestatus: lokale technische wijzigingen, niet gepubliceerd; geverifieerde publieke inhoud blijft ongewijzigd.

## Mailstatus
Directe verzending geweigerd: MCP vereist approval terwijl runpolicy never is. Gmail-concept aangemaakt voor Mjjvandam@gmail.com met exact onderwerp Wekelijkse hoofdredactie sitecheck matthijsvandam.nl. Draft r-9063333114419996124; message 1a087a0b530e1cfa. Niet verzonden.

Afgerond: 2026-09-09 21:25 CEST
