# Foot Ankle Pain Guide Model

## Huidige status

De Voet- en enkelpijnwijzer is een lokale conceptmodule:

- bestand: `concept-foot-pain-guide.html`;
- data en renderer: `content.js`;
- status: `noindex, nofollow`;
- deployment: uitgesloten via `.vercelignore`;
- check: `python3 tools/check_foot_pain_guide.py`.

De pijnwijzer is een algemene leeswijzer. Hij stelt geen diagnose, beoordeelt geen spoed en vervangt geen consult.

## Structuur

De huidige data bevat:

- 6 aanzichten: bovenaanzicht, voorkant, onderzijde, binnenzijde, buitenzijde, hiel/achterzijde.
- 17 pijnregio's.
- 35 inhoudelijke voet/enkel-kaarten.
- 1 apart behandelonderwerp: `mtp-1-artrodese`.
- Reviewtabel voor medische mapping.
- Uitsluitingen voor onderwerpen die bewust niet in de MVP worden getoond.

## Pijnregio's

De pijnregio's omvatten onder meer:

- grote teen en teengewricht;
- kleine tenen;
- bovenkant voorvoet;
- bovenkant middenvoet;
- wreef;
- onder de bal van de voet;
- onder de middenvoet;
- onder de hiel;
- binnenkant voetboog;
- binnenkant enkel;
- buitenkant voet;
- buitenkant enkel;
- voorkant enkel;
- achterkant enkel;
- achterkant hiel;
- achillespees;
- meerdere of onduidelijke plekken.

## Kaarttypes

Kaarten kunnen zijn:

- algemene informatie;
- klacht;
- aandoening;
- letsel;
- standafwijking;
- peesklacht;
- behandeling.

Behandelonderwerpen kunnen aan een pijnregio gekoppeld zijn, maar hoeven niet als uitkomstkaart zichtbaar te zijn.

## Lisfranc-regel

`lisfranc-middenvoetletsel` blijft alleen als orienterende differentiaal in de pijnwijzerdata.

Regel:

- geen publieke behandelkaart;
- geen publieke behandelpagina-link;
- wel een zichtbare uitleg dat dit alleen algemene herkenningsrichting is;
- niet positioneren als behandelspoor van Matthijs, omdat hij niet primair trauma-orthopeed is.

## Publicatievoorwaarden

Voor publieke vrijgave zijn minimaal nodig:

- medische review van mapping per pijnregio;
- review van alle kaartteksten;
- controle dat veiligheidstekst zichtbaar blijft;
- mobiele check rond 360, 390 en 430 px;
- toetsenbord- en touchcontrole;
- register- en sitemapbesluit;
- beslissing of de pijnwijzer zelfstandig publiek wordt of onderdeel van `behandelingen.html`.

## Niet doen

- Geen diagnose-uitslag geven.
- Geen urgentie-inschatting automatiseren.
- Geen behandeladvies personaliseren.
- Geen out-of-scope trauma-onderwerpen als aanbod tonen.
- Geen conceptstatus verwijderen zonder expliciet publicatiebesluit.

## Te valideren

- Definitieve medische mapping per pijnzone.
- Of alle 35 concept-landingspagina's tegelijk of gefaseerd aan de pijnwijzer worden gekoppeld.
- Of de naam "Voet- en enkelpijnwijzer" publiek behouden blijft.
