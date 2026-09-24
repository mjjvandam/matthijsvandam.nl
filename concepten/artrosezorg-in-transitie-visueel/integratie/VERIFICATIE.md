# Plaatsingspreview — 24 september 2026

Gebouwd uit huidige sitepagina’s en dezelfde verhaalbron. Geen productiepagina of gedeelde renderer gewijzigd.

Browsercontrole:
- Default: drie kaarten en vijf compacte eerdere artikelen. Artrosefilter: drie kaarten en zeven compacte matches. Reset: weer vijf. Visueel verhaal blijft aanwezig buiten de filtercontainer.
- Volledige reis gebruikt één scrollende documentpagina, geen iframe of interne scrollbar. Eerste scène gecontroleerd op desktop en 360/430 px; voorproef op desktop en 390/430 px. Geen horizontale overflow in gemeten toestanden.
- Homepagebeweging bij scroll zichtbaar gemeten: translate(44.47, -21.34) naar translate(102.12, -49.02). Reduced-motion-fixture: beide scrollposities translate(0, 0).
- Licht/donker gecontroleerd op de geïntegreerde reis. Mobiele voorproef toont illustratie tussen titel en tekst.
- Geen consolefouten in gecontroleerde previewtoestanden.
- Conceptcheck (802 woorden/8 momenten), JS-syntaxchecks, designsysteem build/check en git diff --check geslaagd. Geen package.json of npm-checks.

Bestanden: build_integration.py, integratie/*, QA-server voor fixtures, designsysteemregel en gegenereerde stijlgids/gebruikslijst. Bestaande build.py genereert de zelfstandige bron opnieuw.
ADR: bestaande 0001/0004/0005/0006 dekken deze lokale plaatsingsvariant; geen nieuw structureel besluit. Medische eigenaarreview en NTvG-rechtencheck blijven voorwaarden voor publicatie. Niets gedeployed.

## Vervolg: homepage tot en met ‘Meer dan het gewricht’

Op verzoek verplaatst vóór `#locaties`. De inleiding is behouden; de homepage gebruikt nu twee echte hoofdstukken, met dezelfde renderer en broninhoud. Latere stations en de kaart zijn uit het homepage-toneel verwijderd. Desktop en 390 px visueel gecontroleerd: twee momenten, geen horizontale overflow, geen consolefouten. De vervolg-link navigeert naar de volledige reis op `#uitleg`. Concept-, syntax- en designsysteemchecks geslaagd. Alleen lokale preview; productie ongewijzigd.

Homepagebord geïntegreerd in de bestaande scène: één #traveller, geen #farewell-traveller; eindpositie van het bord translate(245 810). Desktop en 390 px visueel gecontroleerd, mobiele klik bereikt artikelen.html#uitleg. Geen tweede afsluitillustratie. JS-syntax en designsysteemchecks geslaagd; alleen lokale wijziging.

## Slotroute, 24 september 2026
- Dezelfde hoofdpersoon loopt over het slotbordes langs uitleg, dieet/bewegen en het netwerk. De eindmarkering is het slot van het verhaal.
- Desktop en mobiele breedtes 360, 390 en 430 px bekeken; statische leesversie in donkere modus bekeken. Vooruit/achteruit bewegen laat positie en verschijning teruglopen. Geen browserfouten waargenomen.
- Bron-/conceptcheck (833 woorden), beide JavaScript-syntaxchecks, designsysteemcheck en diff-whitespacecheck slagen. Geen npm-project.
- Impact handmatig bepaald: lokale volledige versie, artikelenplaatsing en gedeelde gegenereerde assets; homepage gebruikt alleen scènes 0–1. Geen nieuwe ADR nodig binnen bestaande conceptafspraken. Geen publicatie; medische eindbeoordeling en rechtencheck blijven open.
