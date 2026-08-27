# Beeldbank matthijsvandam.nl

Interne beeldbank voor referenties, goedgekeurde stijlvoorbeelden, afgekeurde richtingen en prompts.
Deze map is bedoeld als werkmateriaal voor nieuwe afbeeldingen, niet als publieke websitepagina.

## Mappen

- `referenties/`: voorbeelden die Matthijs aanlevert. Bewaar hier ook broninformatie of licentie als die relevant is.
- `goedgekeurd/`: beelden die qua stijl, toon of medische betrouwbaarheid als richting mogen dienen.
- `afgekeurd/`: voorbeelden van wat niet opnieuw gemaakt moet worden.
- `prompts/`: vaste promptblokken en controlelijsten per beeldtype.

## Werkwijze

1. Bepaal eerst het beeldtype: behandeltegel, artikelbeeld, medische illustratie, projectbeeld of hero.
2. Kies een passend voorbeeld uit `goedgekeurd/`.
3. Controleer of er een waarschuwing of vergelijkbaar foutvoorbeeld in `afgekeurd/` staat.
4. Gebruik het promptbestand in `prompts/` als basis.
5. Plaats alleen definitieve websitebeelden in `assets/`.

## Belangrijkste regels

- Anatomie moet kloppen: bij voeten vijf tenen en plausibele middenvoetsbeentjes; bij knie correcte verhouding tussen femur, tibia, fibula en patella.
- Geen ETZ-logo in eigen websitebeelden, behalve wanneer het bewust om ETZ-context gaat.
- Bij medische uitlegbeelden geen los logovlak in de compositie; de definitieve websitekopie krijgt
  via de beeldworkflow een kleine copyrightregel rechtsonder.
- Site-eigen artikel-, project- en aandoeningsbeelden krijgen voor publicatie ook bronmetadata via
  `../tools/watermark_site_images.py`. De rechtenstatus en schone bron staan in
  `../data/site-image-rights.json`.
- Kleurtoon: warm wit, diep groen, zacht salie, rustig teal en subtiel clay/ochre.
- Geen abstracte medische symboliek als de bezoeker een herkenbare klacht of behandeling verwacht.
- Geen behandelclaims, voor/na-beelden, operatiebeelden, bloed of dramatische pijnbeelden.
- Bij twijfel over anatomie: niet gebruiken als medische uitleg. Kies dan een eenvoudiger schema.

Voor uitgebreide medische beeldregels: zie `../EXPERTISE_IMAGE_PROMPTS.md`.

## Huidige goedgekeurde richtingen

- `goedgekeurd/voorvoet-hallux-klinisch.jpg`: hallux valgus / hallux rigidus / grote teen.
- `goedgekeurd/voorvoetpijn-bal-voet.jpg`: metatarsalgie, Morton neuroom, hamertenen en tailor's bunion.
- `goedgekeurd/knie-kraakbeen-medische-illustratie-mvd.jpg`: medische illustratie met eigen logo.
- `goedgekeurd/knie-kraakbeenceltransplantatie-stappen.svg`: schematische uitleg van kraakbeenceltransplantatie in eigen stijl.
- `goedgekeurd/knie-model-editorial.jpg`: rustige kniecontext zonder schoenen of vreemde objecten.
- `goedgekeurd/enkel-kraakbeen-editorial.jpg`: enkel/kraakbeen in rustige klinische stijl.
- `goedgekeurd/achtervoet-standsafwijking-editorial.jpg`: achtervoet/standafwijking.
- `goedgekeurd/leefstijl-artrose-editorial.jpg`: leefstijl/artrose zonder stigmatisering.
