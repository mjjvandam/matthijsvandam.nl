# Doorlopende reis door artrosezorg

Doel: één fictieve persoon volgen door acht ruimtelijk verbonden plekken, zodat dagelijks leven, begeleiding en zorgorganisatie als één samenhangend verhaal worden begrepen. Vrij scrollen; geen hoofdstuknummers, kaartenreeks of verplichte behandelvolgorde.

## Verhaal en wereld

De tekstbron bevat 802 woorden. De acht momenten zijn: dagelijks leven, hele persoon, uitleg, samen bewegen, passende begeleiding, regionaal netwerk, landelijke randvoorwaarden en terug naar dagelijks leven. Zie `bronverantwoording.md` voor de koppeling aan het NTvG-artikel. Inspiratie voor ruimtelijke continuïteit: https://pudding.cool/2026/03/ivf/ ; de illustraties zijn oorspronkelijk gemaakt voor deze pagina. De Nederlandse kaartcontour komt uit Natural Earth (publiek domein).

`journey_art.py` tekent één wereld met een licht isometrisch pad, bordessen, korte trap, gesprek, oefenplek en regionale omgevingen. `verhaal.json` bevat acht stations, camerazoom en houdingen. De route verbindt alle stations; de persoon blijft dezelfde. Een trap betekent geen betere gezondheid of zwaardere behandeling. De laatste huiselijke plek is geen genezingsfinale.

## Regie en techniek

Eén sticky SVG-toneel, met gewone documenttekst ernaast. Desktop wisselt maximaal 420 px tekst links en rechts af. De persoon en camera verplaatsen zich over het paginabrede toneel; naburige plekken blijven deels in beeld. Mobiel neemt het toneel 40svh bovenaan in, gevolgd door leesruimte. Elke scène heeft ongeveer twee derde rustige leesfase en een laatste derde verplaatsing. Camera en persoon volgen vaste routepunten; kijkrichting volgt het pad en terugscrollen spoelt de beweging terug; benen gebruiken geometrische voet-/knieposities. In het gesprek zit de persoon en bij vertrek staat hij weer op. Geen timers, scrollblokkering of externe bibliotheek.

No-JS, leesmodus, reduced-motion, 200% tekst en lage schermen tonen de acht statische uitsneden van dezelfde wereld. De volledige tekst blijft beschikbaar. Onderhoud bouwt bronbestanden met een inhoudshash voor CSS/JS zodat previews geen vorige animatiebron blijven tonen.

## Governance

Pagina-specifieke lokale variant binnen bestaande artikelvorm, invariant 10 en ADR-0005/0006. Expliciete opdracht voor deze visuele herbouw; geen wijziging van sitearchitectuur, productiecomponenten, positionering of publicatiepoort. Geen nieuwe ADR nodig. Noindex en deployment-uitsluiting blijven behouden. Medische eigenaarreview, NTvG-rechtencheck en publicatiebesluit staan open.

## Verfijning per moment

Einddoel van de tweede visuele ronde: acht herkenbare plekken met eigen ontwikkeling binnen één moderne wereld, waarbij de persoon logisch door het beeld loopt en de tekstcompositie afwisselt.

| Moment | Ontwikkeling tijdens scrollen |
|---|---|
| Dagelijks leven | Huis met kleine entreetrap; vloerroute en dagelijkse activiteiten verschijnen. |
| Hele persoon | Camera komt iets dichterbij; lichaam, welzijn en verwachtingen verschijnen na elkaar; klein gespreksgebaar. |
| Uitleg | Twee zittende personen, gedeelde tafel en gesprek; de hoofdpersoon staat op vóór vertrek. |
| Samen bewegen | Andere deelnemers, stapbeweging en getekende bewegingslijn. |
| Passende begeleiding | Twee afstemmingsroutes tekenen zich af, met vragen over wat lukt en helpt. |
| Regionaal netwerk | Camera trekt iets terug; verbindingen, afstemming en randvoorwaarden verschijnen. |
| Landelijk programma | Nederland met schematische stippen → Tilburg met het Orthopedisch Centrum ETZ uitgelicht → regionaal netwerk. Geen registratie van aanbieders. |
| Terug naar het leven | Huis en dagelijkse plek; de verbinding eromheen wordt zichtbaar zonder hersteluitkomst. |

Gebouwen hebben perspectivische gevels, glas, dakvlakken en subtiele schaduw. Personen delen dezelfde tekenstijl; de hoofdpersoon blijft herkenbaar aan kleding en haar. SVG, CSS en gewone browserscroll; geen nieuwe animatiebibliotheek.

## Reviewverfijningen

Opening, animatie en stilstaande beelden gebruiken dezelfde protagonistbron. De landelijke scène houdt de persoon naast de kaart in beeld via een eigen actor-routepunt; de camera blijft op de kaart gericht. De statische landelijke compositie toont Nederland én regio. Kleine SVG-pillen zijn op mobiel vervangen door een leesbaar HTML-bijschrift. Het zichtbare kaartbijschrift vermeldt schematische spreiding. Bij wijziging van venster of leesmodus blijft het laatste zichtbare tekstanker behouden.
