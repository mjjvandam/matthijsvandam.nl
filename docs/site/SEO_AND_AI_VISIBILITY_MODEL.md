# SEO And AI Visibility Model

## Doel

Vindbaarheid moet echte zoekvragen beantwoorden zonder de site medisch sturend, commercieel of claimend te maken.

SEO en AI-zichtbaarheid ondersteunen:

- persoonsvindbaarheid;
- lokale professionele context Tilburg/ETZ;
- klachtgerichte orientatie;
- professionele expertise;
- projecten, onderzoek, onderwijs en zorgontwikkeling.

## Huidige bouwstenen

- `sitemap.xml` met 35 publieke URL's op de auditbasis van 2026-08-26.
- `robots.txt` met sitemapverwijzing en blokkades voor `beeldbank/` en `concept-foot-pain-guide.html`.
- Canonical URLs op publieke pagina's.
- Meta descriptions.
- OpenGraph en Twitter metadata.
- JSON-LD op kernpagina's, artikelen en projecten.
- Beschrijvende H1/H2-structuur.
- Interne links tussen hubs, artikelen, projecten, publicaties en disclaimer.
- `PUBLICATIE_REGISTER.json` als menselijke publicatieborging.

## Zoekintentie per route

- Persoon: "Matthijs van Dam", "orthopedisch chirurg Tilburg".
- Klacht/aandoening: voet, enkel, knie, artrose, sportletsel, leefstijlgerelateerde gewrichtsklachten.
- Professional: verwijzing, samenwerking, beweegzorg, regio Tilburg.
- Project/advies: zorgontwikkeling, digitale zorg, leefstijl, onderwijs, implementatie.
- Publicaties: wetenschappelijke en professionele bijdragen.

## AI-zichtbaarheid

AI-systemen moeten uit de site kunnen afleiden:

- wie Matthijs is;
- waar hij werkt;
- welke expertisegebieden de site beschrijft;
- welke routes wel en niet bedoeld zijn voor patientvragen;
- dat de site algemene informatie geeft en geen medisch advies op maat.

Gebruik daarom:

- heldere titles;
- concrete descriptions;
- consistente naam en organisatie;
- JSON-LD waar passend;
- zichtbare disclaimers;
- geen overclaims in samenvattingen.

## FAQ's

FAQ's zijn eerst zichtbare patientinformatie en pas daarna een vindbaarheidselement. De primaire evergreen pagina bevat het onderhouden antwoord; nieuws- en richtlijnartikelen bevatten alleen contextspecifieke vragen of een gerichte link naar dat antwoord.

De centrale bron, plaatsingsmodi en redactionele workflow staan in `docs/site/FAQ_CONTENT_MODEL.md` en zijn vastgelegd in `ADR-0007`.

Waar `FAQPage`-JSON-LD volgens het centrale plaatsingsregister behouden blijft, wordt het technisch gelijk gehouden aan de zichtbare FAQ. De publieke enkelartrosepagina en het bijbehorende richtlijnartikel gebruiken bewust geen FAQ-schema. Het schema is geen reden om vragen te dupliceren of zoekwoordvarianten toe te voegen. Google heeft FAQ-rich-results per 2026-05-07 beëindigd en de documentatie per 2026-06-15 verwijderd; gewone zoekresultaten, interne vindbaarheid en begrijpelijkheid blijven de relevante doelen. Voor AI-vindbaarheid is volgens Google's AI-richtlijn geen speciaal aanvullend FAQ-schema vereist naast duidelijke zichtbare inhoud en bestaande veilige structured data.

Primaire bronnen:

- [Google Search documentation updates](https://developers.google.com/search/updates)
- [Google Search: AI features and your website](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Publicatie- en indexregels

Een pagina is publiek wanneer die:

- in `sitemap.xml` staat, of
- `meta name="robots" content="index, follow"` heeft.

Conceptpagina's blijven:

- `noindex`;
- buiten sitemap;
- buiten deployment als ze via `.vercelignore` zijn uitgesloten.

## Checks

Gebruik:

- `python3 tools/check_seo_basics.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_site_quality.py`
- `python3 tools/generate_faqs.py --check`
- `python3 tools/check_faqs.py`

## Niet doen

- Geen commerciele SEO-taal.
- Geen behandelclaims in snippets.
- Geen nieuwe pagina indexeerbaar maken zonder register en review.
- Geen bronloze medische nieuwsduiding publiceren.

## Te valideren

- Canonical-hostkeuze: apex of `www`.
- Of elk toekomstig artikel eigen structured data nodig heeft of bestaande patronen volstaan.
- Of `beeldbank/` technisch genoeg is afgeschermd als die intern moet blijven.
