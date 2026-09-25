# Artrosezorg in transitie — lokaal publicatievoorstel

Open de [preview](http://127.0.0.1:8874/concepten/artrosezorg-in-transitie-visueel/). Geen live publicatie. Als de server niet draait: start vanuit de repository `python3 -m http.server 8874 --bind 127.0.0.1`.

- [Pagina](index.html): het volledige visuele artikel met één doorlopende wereld en acht ongenummerde momenten, NTvG-bronverwijzing en leesmodus.
- [Definitieve concepttekst](../artikelen/2026-09-24-artrosezorg-in-transitie-visueel.md): 802 woorden hoofdtekst.
- [Storyboard](storyboard.md): redactionele en visuele opzet, inspiratiebronnen en ADR-afweging.
- [Bron- en claimoverzicht](bronverantwoording.md): koppeling van de acht momenten aan het NTvG-artikel.
- [Review vanuit meerdere rollen](review-meerdere-rollen.md): nieuwste onafhankelijke bevindingen en reparaties.
- [Verificatie](verificatie.md): uitslagen, bestaande siteproblemen en testbeperkingen.
- [Publicatievoorstel](publicatievoorstel.json): toekomstige metadata, koppelingen en releasevolgorde, nog niet geactiveerd.
- [Deelafbeelding PNG](assets/deelafbeelding.png) en [bewerkbare SVG](assets/deelafbeelding.svg).
- Historische, niet meer gebruikte illustraties: [1](assets/scene-1.svg), [2](assets/scene-2.svg), [3](assets/scene-3.svg), [4](assets/scene-4.svg), [5](assets/scene-5.svg), [6](assets/scene-6.svg).

## Onderhoud

Tekstbron: `verhaal.json`. De doorlopende wereld: `journey_art.py`; paginabouw: `build.py`; route, houdingen en camerastanden: `verhaal.json`. CSS/JS zijn paginaspecifiek; de sitekleuren komen uit `../../styles.css`. Na wijzigingen:

```sh
python3 concepten/artrosezorg-in-transitie-visueel/build.py
python3 concepten/artrosezorg-in-transitie-visueel/check_concept.py
python3 tools/design_system.py --build
python3 tools/design_system.py --check
```

`build.py` schrijft HTML, SVG's en de gewone Markdown-concepttekst opnieuw; het raakt de onveranderlijke nulversie niet. De PNG is met de lokaal beschikbare `sharp`-library uit `assets/deelafbeelding.svg` gerenderd op 1200 × 630 en moet na wijzigingen aan die SVG opnieuw worden gerenderd.

Voor reproduceerbare extra browsercontroles: `python3 concepten/artrosezorg-in-transitie-visueel/qa_server.py`. Poort 8875; gebruik `?qa=nojs`, `?qa=reduce` of `?qa=text`. Deze testfixtures simuleren respectievelijk scriptblokkering, verminderde beweging en 200% tekstvergroting. Ze zijn geen productfuncties.

Het hele pakket blijft onder het bestaande uitgesloten `concepten/`, met `noindex, nofollow`. Medisch akkoord en livegang zijn afzonderlijke beslissingen.

De huidige statische leesversie gebruikt `assets/journey-1.svg` t/m `journey-8.svg`, uitsneden van dezelfde wereld. `story.js` rendert dezelfde scène bij dezelfde scrollpositie, met een rustige leesfase en verplaatsing aan het einde. De NTvG-rechtencheck blijft open vóór enige publicatie.

## Lokale plaatsing op homepage en artikelenhub

`python3 concepten/artrosezorg-in-transitie-visueel/build_integration.py` bouwt de zelfstandige verhaalpagina én twee lokale plaatsingspreviews in `integratie/`. De productiebronnen `index.html`, `artikelen.html` en `content.js` worden alleen gelezen. Tekst en volledige reis komen uit dezelfde verhaalbron. `integratie/integration.css` en `integratie/teaser.js` zijn de handmatig onderhouden plaatsingsbronnen; de overige bestanden daar zijn gegenereerd.

- `integratie/artikelen.html`: drie recente kaarten, standaard maximaal vijf eerdere artikelen; actieve filters tonen alle matches. De volledige reis staat buiten de filtersectie.
- `integratie/index.html#artrose-voorproef`: na de gewone artikelen een korte opening met dezelfde hoofdpersoon; native scroll bestuurt een korte wandeling. Mobiel staat het beeld onder de titel. Zonder JS en bij reduced-motion blijft het beeld stil.
- Alle links zijn voor de lokale HTTP-root opgebouwd. Geen publicatie, sitemapwijziging of eigenaarverificatie. Voor productie-integratie is een afzonderlijke vrijgave nodig.

Homepagevoorproef bijgewerkt: vóór `#locaties`, met twee echte verhaalmomenten tot en met `#hele-persoon`. `integratie/story.js` bedient nu beide previews; `teaser.js` is niet meer aangesloten. De vervolg-link gaat naar `artikelen.html#uitleg`.
