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

- `sitemap.xml` met 29 publieke URL's.
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

## Niet doen

- Geen commerciele SEO-taal.
- Geen behandelclaims in snippets.
- Geen nieuwe pagina indexeerbaar maken zonder register en review.
- Geen bronloze medische nieuwsduiding publiceren.

## Te valideren

- Canonical-hostkeuze: apex of `www`.
- Of elk toekomstig artikel eigen structured data nodig heeft of bestaande patronen volstaan.
- Of `beeldbank/` technisch genoeg is afgeschermd als die intern moet blijven.
