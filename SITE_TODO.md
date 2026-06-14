# Site todo voor Matthijs

## Medische review concept-behandelpagina's

Deze pagina's staan lokaal als concept in `behandelingen/` en zijn nog niet bedoeld voor livegang.

1. `behandelingen/hallux-rigidus.html`
   - Controleer medische inhoud, toon en indicaties.
   - Let extra op formuleringen rond niet-operatieve opties, cheilectomie en MTP-1 artrodese.
   - Check of de afbeeldingen anatomisch en visueel passend genoeg zijn.

2. `behandelingen/mtp-1-artrodese.html`
   - Controleer medische inhoud, toon en indicaties.
   - Let extra op verwachtingen rond lopen, hardlopen, schoenen, herstel en risico's.
   - Check of het beeldmateriaal niet te technisch of te specifiek is.

3. `behandelingen/hallux-valgus.html`
   - Nog medisch beoordelen nadat het eerste concept is gemaakt.
   - Let extra op het onderscheid tussen schoen-/drukklachten, cosmetiek, operatie-indicatie en recidief/verwachtingen.
   - Check de nieuwe anatomische illustratie op medische juistheid en of het watermark subtiel genoeg is.
   - Check het uitklapstuk over hamerteen/tweede teen en of de uitleg niet te stellig is.

4. `behandelingen/hamerteen-klauwteen.html`
   - Controleer medische inhoud, toon en indicaties.
   - Let extra op uitleg rond tweede teen, andere tenen, huid/wondjes, niet-operatieve opties en operatieverwachtingen.
   - Check de nieuwe hamerteenillustratie op medische juistheid en of het watermark subtiel genoeg is.

## Foot Pain Guide MVP

- Controleer de ingeklapte medische mappingtabel: per pijnzone de kolommen "wel tonen" en "niet tonen in MVP".
- Loop de aanwijszones per aanzicht na met `?debugRegions=1`, vooral voorzijde enkel, achterzijde enkel, hiel, wreef en overlappende middenvoetvlakken.
- Automatische overlapcontrole draait mee in `tools/check_foot_pain_guide.py`; onverwachte grote overlap tussen SVG-vlakken geeft nu een issue.
- Technische browsercontrole op 360, 390 en 430 px is uitgevoerd via lokale preview; geen body-overflow, afbeeldingen laden, aanzichten wisselen en regioselectie werkt met klik en toetsenbord.
- Laat Matthijs de medische koppelingen definitief goedkeuren voordat dit onderdeel buiten conceptstatus komt.

## Voor publicatie van een behandelpagina

- Medische eindreview door Matthijs.
- Geen medisch advies op maat of behandelclaim.
- Officiële zorgkanalen en spoedroute duidelijk.
- Mobiele weergave gecontroleerd.
- Afbeeldingen gecontroleerd op inhoud, rechten, logo/watermerk en metadata.
- Interne links, metadata, canonical, OpenGraph, JSON-LD en sitemap bewust bijgewerkt.

## Redactioneel nog beoordelen

- Past de nieuwe sectietitel `Waar kan je terecht?` beter dan `Zorgroute in de regio Tilburg`?
- Is de formulering breed genoeg, zonder dat patiënten het lezen als directe route naar Matthijs?
- Klopt de balans tussen huisarts/eerste lijn, paramedische zorg, schoentechniek en specialistische beoordeling?
