# Artrose-scrollverhaal — release 24 september 2026

Matthijs heeft expliciet publicatieakkoord gegeven voor het volledig beoordeelde verhaal op de artikelenpagina en de voorproef op de homepage. Dit is de oorspronkelijke tekstsamenvatting met eigen illustraties; het NTvG-PDF wordt niet gehost. Het publicatieakkoord is geen verklaring over een uitgeversovereenkomst of afzonderlijke juridische vrijgave.

## Scope
- index.html: voorproef vóór de vakgroep, twee momenten, dezelfde persoon met een linkbord naar het volledige verhaal.
- artikelen.html: volledige acht momenten buiten de filters, met vier afsluitkaarten en NTvG-bronvermelding.
- content.js: standaard vijf oudere titels, bij actieve filters alle passende titels.
- assets/artrose-story: gedeelde begrensde CSS, scrollrenderer en statische alternatieven. CSS/JS hebben inhoudsafhankelijke bestandsnamen.
- Productiepagina's behouden bestaande metadata, canonicals, robots, feedbackscripts en overige inhoud. Geen nieuwe URL, sitemapwijziging, formulier of nieuwsbriefverzending.
- Conceptbronnen blijven onder concepten en buiten deployment. tools/build_artrose_release.py zet alleen de goedgekeurde onderdelen over.

## Verificatie vóór publicatie
- Concept-/broncheck geslaagd: 831 woorden en acht momenten.
- SEO-check, designsysteemcheck en whitespacecheck geslaagd. Geen npm-project.
- Browser: desktop/donker; mobiel 360, 390 en 430 px zonder horizontale overflow. Menu onderrand en toneelbovenrand zijn op mobiel beide 80 px. Geen browserfouten.
- Artikelfilter gecontroleerd: vijf compacte titels zonder filter; twaalf bij zorgprofessionals. Verhaal blijft onafhankelijk zichtbaar.
- Homepage: twee momenten vóór vakgroep; geen ontbrekende afbeeldingen; bordlink opent artikelen.html#artrose-in-beeld nadat het bord is neergezet.
- Brede sitecheck: bestaande 32 publieke meldingen (30 bestaande conceptlinks op behandelpagina's, twee bestaande kaartmeldingen over chronische enkelinstabiliteit). Daarnaast 16 meldingen over absolute links in lokale plaatsingspreviews; die previews worden niet gedeployed. Geen nieuwe publieke meldingen door deze release.
- ADR-0001/0004/0005/0006 toegepast; expliciet eigenaarakkoord voor deze presentatie. Geen nieuwe structurele afspraak nodig.

## Search Console
De bestaande ingelogde domeinproperty is op 24 september opnieuw geopend. Het overzicht toont 20 geïndexeerde en 40 niet-geïndexeerde pagina's, 2 geldige profielpagina-items en 0 ongeldige items. Dit zijn bestaande Google-rapportgegevens, geen indexeringsbewijs voor deze release. De huidige pagina-URL's, sitemap en canonicals blijven gelijk.

## Status
Voorbereid op origin/main d78dd7e in geïsoleerde releasewerkmap, zodat andere lopende lokale wijzigingen niet worden meegenomen. Liveverificatie volgt na deployment.
