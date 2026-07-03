# Page Models

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

## Concept-behandelpagina

Voorbeelden:

- `behandelingen/*.html`

Huidige status:

- lokaal aanwezig;
- `noindex, nofollow`;
- uitgesloten van Vercel;
- medische review nodig voor publicatie.

Publicatievoorwaarden:

- inhoudelijke review door Matthijs;
- veilige medische claims;
- metadata en canonical goed;
- sitemap-opname;
- registerstatus naar `review_nodig` en daarna pas `geverifieerd` na akkoord.

## Conceptmodule

Voorbeeld:

- `concept-foot-pain-guide.html`

Huidige status:

- lokale interactieve leeswijzer;
- geen diagnosehulp;
- niet publiek vrijgegeven.

## Te valideren

- Of er een expliciet template-document per artikeltype nodig is.
- Of concept-behandelpagina's eerst per cluster of individueel live mogen.
