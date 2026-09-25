# Van literatuur naar een goed visueel artikel

25 september 2026 · vervolgstappen, geen publicatieopdracht.

## Beslissing op basis van het onderzoek

Dit onderwerp is geschikt voor scrollytelling. Het visuele voordeel zit in het zichtbaar maken van tijd en samenwerking: contact met de grond, lichaamsbeweging, voetgewrichten en verschillende weefsels. Daarvoor is een inhoudelijk opgebouwde animatie nodig. De bestaande grove sfeerproef is daarvoor geen goede bewegingsbron.

Een helder 2D-zijaanzicht kan voldoende zijn. Een volledige 3D-simulatie van spieren is niet nodig en zou juist veel aannames toevoegen. De kern is een goede hoofdbeweging met beperkte anatomische verdieping, niet maximale technische complexiteit.

## Stap 1 — Onderzoeks- en tekstbasis

Nu opgeleverd: gerichte literatuurverkenning, geselecteerde bronnen met leesstatus en beperkingen, datasetverkenning, anatomisch/motion-draaiboek en volledige eerste artikeltekst.

Het dossier maakt duidelijk onderscheid tussen primaire metingen, modeluitkomsten, klinische informatie en ontwerpkeuzes. Brononderzoek levert geen garantie op dat de toekomstige illustratie klopt; de volgende stappen zijn daarom afzonderlijk toetsbaar.

## Stap 2 — Kale bewegingstest

Doel: één consistente loopcyclus zonder illustratieve aankleding.

1. Download een geschikte openbare opname en bijbehorende kalibratie/metadata uit de beschreven dataset. Behoud datasetversie en attributie.
2. Controleer units, looprichting, assen, linker/rechterzijde, ontbrekende data en bruikbare volledige cyclus.
3. Leg de gekozen gebeurtenissen vast op basis van de aangeleverde eventinformatie en waar nodig kracht-/markerdata. Beschrijf de detectiecriteria en beperkingen.
4. Bouw skeletlijnen met vaste segmentlengten. Als gemeten markerafstanden variëren, modelleer dat bewust; plak ruwe huidmarkers niet rechtstreeks op botuiteinden.
5. Maak negen stilstaande controlebeelden plus één scrollbare cyclus. Toon contactankers en de grond als debuglaag.
6. Vergelijk de beweging met de brondata. Documenteer retargeting, contactcorrecties en andere bewerkingen. Een vereenvoudigde rig wordt niet als exacte reconstructie van de proefpersoon gepresenteerd.

Gereed wanneer beide benen, grondcontact en overgang naar een volgende cyclus overtuigend kloppen. Als dat niet lukt, eerst de rig corrigeren; niet camerapanning of uitsnedes gebruiken om de fout te verbergen.

Nog open: selectie en analyse van echte loopdata. Er zijn in deze onderzoeksfase geen numerieke hoeken of patiëntspecifieke keyframes gefabriceerd.

## Stap 3 — Anatomische tekenlaag

Maak eerst drie hoogwaardige stilstaande aanzichten: hele been, enkel/voet mediaal en de twee kuitspieren. Beoordeel botvormen, aanhechtingen, dieptelagen en kleurlegenda. Pas daarna op de bewegingsrig plaatsen.

Voeg boog- en teenbeweging als afzonderlijke schematische laag toe, met de beperkingen uit B10–B13. Laat spierlengte niet automatisch uit het draaien van de enkel volgen. Geen meetcurves voor signalen die niet in de gekozen bron staan.

Gereed wanneer Matthijs de anatomie en betekenis kan beoordelen in stilstaande beelden, voordat scroll en effecten de aandacht opeisen. Aanvullende beoordeling door iemand met ervaring in klinische loopanalyse is wenselijk voor de uiteindelijke bewegingsversie; dit is een inhoudelijk advies, geen claim dat die review al heeft plaatsgevonden.

## Stap 4 — Complete verhaallijn

Verbind de acht scènes uit het draaiboek aan de concepttekst. Houd fasevoortgang en scrollvoortgang apart. Meet de tekstblokken om de leesruimte te bepalen; vermijd een lang leeg traject. Toon één biomechanisch inzicht tegelijk.

Gebruik een pagina-eigen blauw/witte variant binnen bestaande typografie en navigatie. Leg de uitzondering bij daadwerkelijke bouw vast in het designsysteem. Geen algemene herstyling van de site en geen nieuwe animatiebibliotheek tenzij een concreet probleem dat rechtvaardigt.

Gereed wanneer de lezer zonder bedieningstraining begrijpt wat beweegt en waarom. De scrollversie en statische leesversie moeten dezelfde inhoud overbrengen.

## Stap 5 — Redactie en verificatie

### Inhoud

- Elke medische zin en elk betekenisvol visueel element heeft een bron of is herkenbaar als ontwerpkeuze.
- Hoofdtekst gebruikt geen diagnose, causale overclaim of belofte over behandeling.
- Onderzoekspopulaties blijven onderscheiden: wandelen versus rennen; volwassenen versus kinderen; meting versus simulatie.
- Bij overname van brondata kloppen attributie, versie en bewerkingen.
- Tekstredactie opnieuw uitvoeren na het werkende beeld: dat beeld kan uitleg overbodig maken of een extra nuance nodig maken.

### Beweging

- Beoordeel stilstaande ijkpunten en vloeiende overgang afzonderlijk.
- Bekijk minstens begincontact, voet vlak, hiellift, dubbelcontact, teen-los en zwaai op normale en lage afspeelsnelheid.
- Controleer geen glijden, penetratie, omklappende gewrichten of veranderende botlengten.
- Test terugscrollen en springen naar iedere sectie zonder afhankelijkheid van eerder afspelen.

### Toegankelijkheid en site

- Desktop, 360/390/430 px, lage vensters, 200% tekst, toetsenbord, reduced motion en JavaScript uit.
- Tekst blijft echte HTML, labels blijven leesbaar, menu bedekt geen uitleg, kleur is niet de enige informatiedrager.
- Statische alternatieven tonen contact en richting met eigen beschrijvingen.
- Bij uitvoering: `git diff --check`, toepasselijke bron-/conceptchecks en `design_system.py --build`/`--check`; alleen relevante sitechecks verbreden.

## Stap 6 — Publicatievoorbereiding, later

Pas na beoordeling van inhoud én beeld: publieke plaatsing kiezen, metadata en bronvermelding afmaken, register, interne links en benodigde sitechecks controleren. Medische goedkeuring en publicatie blijven expliciete afzonderlijke stappen. Dit onderzoekswerk heeft geen publicatiestatus gewijzigd.

## Toetsbaar eindresultaat

Een bezoeker kan na het verhaal in gewone woorden uitleggen:

1. Waarom de voet niet alleen om de enkel draait tijdens lopen.
2. Waarom de kuit ook vóór de afzet een rol heeft.
3. Waarom een loopanalyse verschillende soorten informatie combineert.
4. Waarom een bewegingsverschil niet automatisch verklaart waar pijn vandaan komt.

Het beeld moet deze inzichten daadwerkelijk laten zien; een fraai lopend poppetje alleen is onvoldoende.
