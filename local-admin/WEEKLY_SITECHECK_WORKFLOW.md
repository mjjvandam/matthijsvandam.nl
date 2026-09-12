# Weekcheck via het dashboard

Gewenste werkwijze door Matthijs opgedragen op 11 september 2026. Past binnen ADR-0014. De schedulerprompt moet via de Codex-app worden aangepast; dit document wijzigt geen automationconfiguratie.

## Uitvoer per echte controlerun

1. Lees AGENTS.md, de relevante sitekaders, dit bestand, WORK_ITEMS_REVIEW.md, de vorige weekcheck en de actuele taken/terugblik. Respecteer bestaande gebruikerswijzigingen.
2. Voer de weekcheck uit en leg de uitkomst vast in `docs/site/reviews/sitecheck-YYYY-MM-DD.md`. Gebruik `## Prioriteiten` met de regels `- **Kritiek:**`, `- **Belangrijk:**` en `- **Later:**`. Benoem wijzigingen, uitgevoerde controles, beperkingen en expliciete publicatiestatus. Maak geen nieuw sitecheckverslag voor alleen een configuratiewijziging.
3. Werk alleen de wekelijkse routine in `routine-recaps.json` bij: Gedaan, Uitkomst, Vervolg. Koppel de SHA-256 aan het definitieve verslag; dit bevestigt de bronversie, niet medische goedkeuring.
4. Verwerk echte vervolgacties in `work-items.json`. Hergebruik IDs voor hetzelfde werk. Neem concrete volgende stap, prioriteit, status en gecontroleerde bronnen op. Beoordeel bestaande bronnen voordat je hashes bijwerkt. Een leesvinkje is geen afronding. Laat ongewijzigde taken en bronversies intact; wijzig de globale reviewed_at niet voor één taak, omdat daarmee alle leesmarkeringen vervallen. Vermeld de nieuwe peildatum bij een gewijzigde taak in de toelichting. Gebruik `replaces_report: report-latest-sitecheck` alleen wanneer concrete taken de actiepunten uit het actuele verslag daadwerkelijk overnemen.
5. Voeg zo nodig `## Ter kennisname` toe, met één korte melding die Matthijs alleen hoeft te lezen. De dashboardkaart heet **Ter kennisname: laatste sitecheck** en heeft **Bekeken**. Dit is onafhankelijk van concrete actiepunten. Gebruik `Geen nieuwe kennisgeving.` wanneer er niets nieuws te melden is. Houd alle benodigde informatie in maximaal 550 tekens en zet verdere details elders in het verslag. Neem geen correspondentiegegevens of private automationnotities op.
6. Controleer via de dashboard-inventaris dat terugblik, kennisgeving en concrete taken correct worden ingelezen, zonder dubbele of onterecht afgeronde taken. Tests van leesmarkeringen gebruiken uitsluitend tijdelijke opslag; markeer nooit zelf namens Matthijs als gelezen.
7. Meld in Codex kort wanneer er nieuwe belangrijke bevindingen, een kennisgeving, een blokkade of een vereiste beslissing zijn. Herhaal oude punten niet als nieuw. Dashboard is de vaste terugleesplek. Verstuur geen mail en maak geen conceptmail.

## Grenzen

Bekeken betekent alleen gelezen. Medische review, registerverificatie, publicatie en uitvoering blijven afzonderlijk. De beheerinterface leest routineconfiguraties; hij activeert of wijzigt geen routines. Publieke HTML, content.js, deployment en modelkeuze veranderen niet door deze uitvoerroute.

## Frisse blik aanvullen

Door Matthijs op 11 september 2026 opgedragen: controleer bij iedere weekcheck de actuele `ideas.read_ideas(repo, state_dir)`-uitkomst. Bij `replenishment.needed == true` (minder dan drie onbeoordeelde ideeën) voeg je maximaal drie inhoudelijk nieuwe, onderbouwde voorstellen toe aan `ideas-catalog.json`. Bij drie of meer vul je niet aan. Een onleesbare catalogus/keuzeopslag is een blokkade, nooit een lege voorraad.

Lees eerst bewaarde, geselecteerde en afgewezen ideeën, de bestaande taken, actuele sitekaders en de betreffende bronbestanden. Herhaal afgewezen ideeën niet zonder aantoonbaar nieuwe aanleiding. Bewaar bestaande IDs en teksten, wijzig geen persoonlijke keuzes en maak geen dubbele taak. Als er geen zinvolle aanvulling is, leg dat vast; vul geen quota met generieke ideeën. De catalogus ondersteunt maximaal dertig ideeën: archiveer of verwijder bij die grens niets zelfstandig, maar meld de beperking.

Overweeg naast inhoud en gebruiksgemak ook `agent` (terugkerend werk), `skill` (herbruikbare werkwijze) en `simplify` (minder werk, functies of routines). Onderzoek eerst of een bestaande agent/routine/skill kan worden verbeterd of gecombineerd. Benoem concrete meerwaarde, onderhoudslast, kleinste proef en stopcriterium. Beoordeel in iedere aanvulronde expliciet of afschalen nuttiger is dan toevoegen. Geen nieuwe model-, leverancier- of productclaims zonder actuele officiële broncontrole.

Werk de catalogusdatum alleen na echte inhoudelijke aanvulling bij; behoud per bestaand idee de eigen datum en versie. Controleer daarna de volledige catalogus en dat bestaande keuzes onveranderd terugkomen. Noteer de aanvulling in de dashboardterugblik/kennisgeving. Naar Nog te doen selecteert een onderzoekstaak: het maakt geen agent of skill aan, installeert niets en pauzeert/verwijdert geen routines. Aanvulling gebeurt bij een succesvolle weekrun, niet direct bij het aanklikken van Bekeken.

## Search Console

Voer bij iedere weekcheck ook `SEARCH_CONSOLE_WORKFLOW.md` uit. Neem het resultaat op in de bestaande dashboardterugblik en werk de Google-momentopname en concrete vervolgtaak alleen op basis van nieuwe waarnemingen bij.
