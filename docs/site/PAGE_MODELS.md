# Page Models

Gebruik dit document samen met `docs/site/LINK_MATRIX.md`.

`PAGE_MODELS.md` beschrijft het type pagina en de minimale structuur. `LINK_MATRIX.md` bewaakt de route, minimale interne links, concept/public-status, reviewstatus en sitemapregel. Geen paginamodel is op zichzelf een publicatiebesluit.

Bij nieuwe of gewijzigde hubpagina's, aandoeningen-/klachtenpagina's, behandelpagina's of voetpijnwijzerkoppelingen moet eerst worden gecontroleerd:

- welk paginamodel geldt;
- welke minimale links volgens `LINK_MATRIX.md` nodig zijn;
- of de pagina concept, publiek, `review_nodig` of `geverifieerd` is;
- welke ADR's geraakt worden;
- welke owner validation open blijft.

## Homepage

Model: profiel- en routepagina.

Functie:

- positioneert Matthijs;
- verdeelt bezoekers naar patient, professional en advies/samenwerking;
- toont selectie van aandachtsgebieden, projecten, artikelen, publicaties en contactgrenzen.

Niet doen:

- geen extra brede hero- of redesignrichting toevoegen zonder opdracht;
- geen patientportaalfunctie toevoegen.

## Hubpagina's

Voorbeelden:

- `behandelingen.html`
- `artikelen.html`
- `projecten.html`
- `publicaties.html`

Functie:

- overzicht geven;
- filteren of clusteren;
- veilige routes naar detailinformatie bieden.

Modelregels:

- duidelijke H1;
- beschrijvende meta description;
- interne links naar relevante vervolgpagina's;
- minimale interne links volgen `docs/site/LINK_MATRIX.md`;
- conceptpagina's worden niet als publieke vervolgstap gelinkt zonder publicatiebesluit;
- geen claimende kaartteksten;
- filters mogen helpen, maar niet diagnosticeren.

## Profielpagina

Voorbeeld:

- `over-mij.html`

Functie:

- professionele biografie;
- context rond ETZ, opleiding, expertise, onderwijs, onderzoek en advies;
- vertrouwen opbouwen zonder marketingclaim.

## Professionals-pagina

Voorbeeld:

- `professionals.html`

Functie:

- patientgerelateerde samenwerking beschrijven;
- verwijzers en regionale professionals bedienen;
- contactgrenzen en officiele routes benoemen.

## Advies- en consultancypagina

Voorbeeld:

- `advies-consultancy.html`

Functie:

- niet-patientgebonden opdrachten uitleggen;
- projectadvies, implementatie, onderwijs en sessiebegeleiding afbakenen;
- patientvragen uitsluiten.

## Artikelpagina

Voorbeelden:

- patientgerichte artikelen;
- professionele artikelen;
- projectupdates;
- onderwijs- en publicatieberichten.

Modelregels:

- doelgroep expliciet houden;
- bronstatus bewaken bij medische of nieuwsaanleidingen;
- eerst bron of gebeurtenis concreet uitleggen, daarna duiden;
- byline, datum en bronnen/links consistent houden waar relevant.
- FAQ's beperken tot artikel- of broncontext; algemene patientvragen linken naar de primaire evergreen pagina volgens `docs/site/FAQ_CONTENT_MODEL.md`.

## Projectpagina

Voorbeelden:

- `projecten/transmuraal-tilburg-cohort.html`
- `projecten/leefstijlgerichte-kansen-orthopedie.html`
- `projecten/we-walk.html`
- `projecten/vrxoa-immersive-experiences-artrose.html`
- `projecten/3d-planning-voet-enkel.html`

Functie:

- projectdoel, rol, partners en status uitleggen;
- koppelen aan zorgontwikkeling, onderzoek of onderwijs;
- geen patientgebonden adviesroute suggereren.

## Concept-aandoeningen-, klachten- en behandelpagina's

Voorbeelden:

- `behandelingen/*.html`

Huidige status:

- 32 pagina's zijn lokaal concept, `noindex, nofollow`, uitgesloten van Vercel en medisch te reviewen voor publicatie;
- `enkelverzwikking.html`, `enkelartrose.html` en `enkelprothese.html` zijn publiek en vallen onder de normale publicatie- en herverificatieregels.

Modelsubtypes:

- Aandoening of letsel: algemene uitleg over een mogelijk onderwerp binnen voet/enkel, zonder diagnose op afstand.
- Klacht of symptoom: algemene orientatie rond klachtenpatroon, zonder te suggereren dat de pagina een diagnose stelt.
- Behandeling: algemene uitleg over een behandelonderwerp, zonder persoonlijke indicatie, uitkomstclaim of operatiedruk.

Modelregels:

- doelgroep en spoor expliciet houden: patientinformatie, geen patientportaal;
- teruglink naar `behandelingen.html`;
- medische veiligheidscontext of `disclaimer.html` bereikbaar houden;
- verwante links volgen `docs/site/LINK_MATRIX.md`;
- voetpijnwijzerkoppelingen blijven leesrichting, geen diagnose-uitkomst;
- out-of-scope onderwerpen, zoals Lisfranc/middenvoetletsel, niet als behandelaanbod of publieke behandelpagina-link presenteren zonder expliciete eigenaar-validatie.
- tijdloze FAQ-antwoorden primair op deze pagina onderhouden; hergebruik en contextlinks volgen `docs/site/FAQ_CONTENT_MODEL.md`.

Publicatievoorwaarden:

- inhoudelijke review door Matthijs;
- veilige medische claims;
- metadata en canonical goed;
- minimale interne links volgens `docs/site/LINK_MATRIX.md`;
- sitemap-opname;
- registerstatus naar `review_nodig` en daarna pas `geverifieerd` na akkoord.

## Conceptmodule

Voorbeeld:

- `concept-foot-pain-guide.html`

Huidige status:

- lokale interactieve leeswijzer;
- geen diagnosehulp;
- niet publiek vrijgegeven.

Modelregels:

- bron voor regio's en mapping blijft `content.js`;
- governance en linkregels volgen `docs/site/LINK_MATRIX.md`;
- resultaten blijven mogelijke leesrichtingen, geen diagnose, triage of behandeladvies;
- publicatie vraagt aparte review van medische mapping, veiligheidstekst, mobiele werking, sitemap/register en eigenaar-validatie.

## Te valideren

- Of er een expliciet template-document per artikeltype nodig is.
- Of concept-behandelpagina's eerst per cluster of individueel live mogen.
- Definitieve medische mapping en publieke plaatsing van de Voet- en enkelpijnwijzer.
