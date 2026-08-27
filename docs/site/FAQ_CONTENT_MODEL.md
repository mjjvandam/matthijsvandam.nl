# FAQ Content Model

Status: leidend onder `ADR-0007` (Accepted op 2026-08-26)

## Doel

FAQ's beantwoorden herkenbare patientvragen op de logischste informatiepagina. Vindbaarheid volgt uit heldere, zichtbare en inhoudelijk juiste antwoorden; nieuwe vraagvarianten worden niet toegevoegd om alleen een zoekwoord af te vangen.

## Bron en plaatsing

- `data/faqs.json` is de centrale bron voor vraag, antwoord, onderwerp, primaire pagina, anchor en medische reviewstatus.
- `data/faq-placements.json` bepaalt per pagina welke FAQ-records zichtbaar zijn en in welke modus.
- `tools/generate_faqs.py` schrijft de zichtbare HTML, eventuele markdownbron en het bestaande `FAQPage`-schema.
- `tools/check_faqs.py` controleert bronvelden, plaatsingen, anchors, links, duplicaatclassificatie, zichtbare tekst, schema en gegenereerde output.

## Drie weergavemodi

- `full`: het volledige antwoord staat op de primaire evergreen pagina.
- `context`: een volledig, pagina-specifiek antwoord dat alleen binnen die context nodig is.
- `link`: een korte toelichting met een deep link naar het onderhouden antwoord op de primaire pagina.

Een record heeft precies één volledige primaire plaatsing (`full` of `context`). Andere pagina's verwijzen ernaar met `link`. Generieke vraagteksten met aandoeningsspecifieke antwoorden blijven afzonderlijke records; gelijkluidende woorden zijn niet automatisch dezelfde medische vraag.

## Paginakeuze

- Aandoening-, klacht- en behandelpagina: primaire plek voor tijdloze patientvragen over het onderwerp.
- Nieuws- of richtlijnartikel: alleen vragen die de bron, nieuwe bevinding of Nederlandse toepasbaarheid verduidelijken; voor algemene uitleg wordt naar de primaire pagina gelinkt.
- Publieke pagina: mag niet vanuit een FAQ naar een conceptpagina verwijzen.
- Conceptpagina: blijft `noindex`, buiten sitemap en buiten deployment zolang geen apart publicatiebesluit is genomen.

## Structured data

`FAQPage` blijft voorlopig alleen staan op de 34 behandelpagina's waarvoor `schema: true` in het plaatsingsregister staat. Waar het schema staat, worden zichtbare FAQ en JSON-LD exact uit dezelfde bron gegenereerd. De publieke enkelartrosepagina en het bijbehorende richtlijnartikel gebruiken bewust `schema: false`. Het schema is geen reden om extra of dubbele FAQ's te publiceren en wordt niet als groeimiddel voor Google-rich-results behandeld.

Voor AI-systemen is geen aparte FAQ-kopie nodig. De zichtbare, semantische vraag-antwoordstructuur, interne links, bronstatus en veilige medische formulering zijn leidend.

## Redactionele workflow

1. Bepaal de zoek-/patientvraag en de primaire pagina.
2. Controleer bestaande records op inhoudelijke overlap, niet alleen woordoverlap.
3. Wijzig of voeg het record toe in `data/faqs.json` en leg reviewstatus en eventuele bron vast.
4. Voeg de plaatsing toe in `data/faq-placements.json` met `full`, `context` of `link`.
5. Genereer: `python3 tools/generate_faqs.py --write`.
6. Controleer: `python3 tools/generate_faqs.py --check` en `python3 tools/check_faqs.py`.
7. Draai de overige site-, SEO-, publicatie- en behandelpagina-checks waar relevant.
8. Medische inhoud of een publicatiestatus verandert pas na de vereiste review en owner validation.

Wijzig gegenereerde FAQ-blokken tussen de markers niet handmatig; pas de centrale data aan en genereer opnieuw.

## Meten en bijsturen

Beoordeel per primaire pagina in Search Console, wanneer data beschikbaar is:

- zoekopdrachten en impressies rond de beantwoorde patientvragen;
- organische klikken en doorklikratio;
- landing page en eventuele verschuiving tussen artikel en evergreen pagina;
- nieuwe, inhoudelijk relevante vragen die nog niet goed worden beantwoord.

Gebruik minimaal 8 tot 12 weken als indicatieve observatieperiode wanneer volume en wijzigingen dat toelaten. Voeg geen FAQ toe op basis van één zoekterm zonder duidelijke patientwaarde. Search Console-data is ondersteunend; medische juistheid, leesbaarheid en veilige zorgroute blijven doorslaggevend.
