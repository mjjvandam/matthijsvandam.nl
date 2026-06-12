# matthijsvandam.nl projectregels

## Projectdoel

Bouw matthijsvandam.nl uit tot een moderne professionele website voor Matthijs van Dam:
orthopedisch chirurg in Tilburg en zelfstandig adviseur zorgontwikkeling, met focus op voet/enkel/sportletsel,
knieartrose met begripvolle aandacht voor leefstijl en obesitas, onderzoek, onderwijs en
zorgontwikkeling. Laat verwijzingen naar kraakbeentransplantaties of Mobility Clinic Tilburg
voorlopig achterwege totdat Matthijs expliciet vraagt om die weer toe te voegen.

## Toon en inhoud

- Deskundig, rustig, modern, menselijk en niet-stigmatiserend.
- Geen patiëntportaal.
- Geen medisch advies op maat.
- Geen behandelclaims, garanties of funnelachtige druk naar afspraken.
- Bij persoonlijke medische vragen, afspraken of spoed altijd verwijzen naar officiële zorgkanalen.
- Rond obesitas en knieartrose: begripvol formuleren, niet moraliserend, niet discriminerend.

## Techniek

- Dit is nu een lokale statische conceptsite.
- Publiceer niets en koppel geen domein zonder expliciete toestemming.
- Controleer na wijzigingen: layout, mobiele weergave, interne links, consolefouten en medische veiligheidsgrenzen.
- Houd de site toegankelijk: goede headingstructuur, labels bij formulieren, duidelijke focus-states en zinvolle metadata.
- Bewaar de bestaande rustige, premium, medisch-professionele vormtaal. Geen redesign, nieuwe kleurtaal of brede visuele koerswijziging zonder expliciete vraag.
- Prioriteer mobiele leesbaarheid: controleer in elk geval smalle breedtes rond 360, 390 en 430 px bij wijzigingen aan hero's, kaarten, navigatie, filters, formulieren of tekstblokken.
- Hergebruik bestaande componenten, CSS-variabelen, spacing, radius, kaartstijlen en typografie. Voeg alleen nieuwe CSS toe als een bestaand patroon niet volstaat.
- Vermijd brede refactors. Houd wijzigingen klein, herleidbaar en passend bij de bestaande statische HTML/CSS/JS-opzet.
- Let extra op contrast: geen lichte tekst op lichte achtergronden, tekst over beelden alleen met voldoende overlay/tint, en focus-states moeten zichtbaar blijven.
- Controleer waar mogelijk na wijzigingen: interne links en anchors, ontbrekende afbeeldingen, consolefouten, metadata/canonical/robots, JSON-LD en sitemap-consistentie.
- Als er een `package.json` aanwezig is, draai de beschikbare checks zoals lint, typecheck, tests en build. Als die ontbreekt, vermeld dat expliciet.

## Livegang-voorwerk

Voor livegang moeten minimaal klaarstaan:

- metadata, canonical, OpenGraph en social preview;
- favicon/logo;
- robots.txt en sitemap.xml;
- privacy- en disclaimerpagina;
- duidelijke medische disclaimer;
- laatste menselijke review van medische/professionele claims.
