# Link Matrix

Status: Accepted as governance work document

Owner acceptance: Accepted by Matthijs van Dam on 2026-07-03

Belangrijke nuance: deze acceptatie valideert de structuur en werkroute van deze linkmatrix, maar niet automatisch medische inhoud, definitieve pijnwijzer-mapping, publicatiestatus, canonical host of sitemap/register-wijzigingen. Open needs owner validation-punten blijven leidend.

Dit document is geen publicatiebesluit, geen nieuwe patientcontent en geen vervanging van `PUBLICATIE_REGISTER.json`, `sitemap.xml`, robots/canonical-instellingen of `content.js`.

## Doel

Deze matrix voorkomt dat hubs, aandoeningenpagina's, behandelpagina's, voetpijnwijzerregio's, conceptstatus, verificatiestatus en sitemap uit elkaar gaan lopen.

Gebruik deze matrix voor:

- interne linkkeuzes;
- controle van concept versus publiek;
- controle of sitemap/register/robots bij elkaar passen;
- review van voetpijnwijzerkoppelingen;
- ADR-checks bij structurele wijzigingen.

## Bronnen

Verplicht raadplegen bij wijziging van links, pagina's, publicatiestatus of pijnwijzerkoppelingen:

- `AGENTS.md`;
- `docs/site/CURRENT_SITE_STATE.md`;
- `docs/site/SITE_POSITIONING.md`;
- `docs/site/TARGET_AUDIENCES.md`;
- `docs/site/CONTENT_PILLARS.md`;
- `docs/site/PAGE_MODELS.md`;
- `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`;
- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`;
- `docs/site/INTERNAL_LINKING_MODEL.md`;
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`;
- `docs/site/INVARIANTS.md`;
- `docs/site/KNOWN_DRIFT_RISKS.md`;
- `docs/decisions/ADR-0001-site-positioning.md`;
- `docs/decisions/ADR-0002-content-pillars.md`;
- `docs/decisions/ADR-0003-foot-pain-guide.md`;
- `docs/decisions/ADR-0004-seo-ai-visibility.md`;
- `docs/decisions/ADR-0005-medical-content-safety.md`;
- `docs/decisions/ADR-0006-publication-governance.md`;
- `PUBLICATIE_REGISTER.json`;
- `sitemap.xml`;
- `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md`;
- `content.js`.

## Publicatie- en reviewregels

| Status | Betekenis | Link- en sitemapregel | ADR's |
| --- | --- | --- | --- |
| Publiek | Staat in `sitemap.xml` of heeft `index, follow` | Moet in `PUBLICATIE_REGISTER.json` staan en consistent intern gelinkt zijn | ADR-0004, ADR-0006 |
| Concept | `noindex`, buiten sitemap of uitgesloten van deployment | Mag niet als publieke vervolgstap worden gelinkt | ADR-0003, ADR-0004, ADR-0006 |
| `review_nodig` | Publiceerbare of publieke medisch/professionele inhoud wacht op eigenaar-review | Geen statusverhoging of extra zichtbaarheid zonder eigenaar-validatie | ADR-0005, ADR-0006 |
| `geverifieerd` | Door Matthijs geaccepteerde publieke pagina | Status niet door Codex invullen of wijzigen zonder expliciete eigenaar-acceptatie | ADR-0005, ADR-0006 |

## Hoofd-hubs en bestaande publieke pagina's

| Onderdeel | Route | Laag | Status nu | Minimale interne links | Sitemapregel | ADR's |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | `index.html` | algemeen | publiek, `geverifieerd` | Naar hoofd-hubs: behandelingen, professionals, advies, projecten, artikelen, publicaties, over/contact | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0002, ADR-0004, ADR-0006 |
| Over | `over-mij.html` | profiel/autoriteit | publiek, `geverifieerd` | Naar professionele context, publicaties, relevante contactgrenzen | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0004, ADR-0006 |
| Klachten en behandelingen | `behandelingen.html` | patienthub | publiek, `geverifieerd` | Naar veilige patientartikelen, disclaimer/contactgrenzen; niet naar conceptbehandelpagina's als publieke stap | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0002, ADR-0004, ADR-0005, ADR-0006 |
| Professionals | `professionals.html` | verwijzers/collega's | publiek, `geverifieerd` | Naar professionele artikelen, publicaties, passende zorgkanalen | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0002, ADR-0004, ADR-0006 |
| Advies/consultancy | `advies-consultancy.html` | partners/zorgontwikkeling | publiek, `geverifieerd` | Naar projecten, onderwijs/onderzoek en niet-patientgebonden contactroute | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0002, ADR-0004, ADR-0006 |
| Projecten | `projecten.html` | projectenhub | publiek, `geverifieerd` | Naar projectdetailpagina's en relevante artikelen | In sitemap zolang register `geverifieerd` blijft | ADR-0002, ADR-0004, ADR-0006 |
| Artikelen | `artikelen.html` | artikelhub | publiek, `geverifieerd` | Naar gepubliceerde artikelen; artikelkaarten volgen doelgroep en onderwerp | In sitemap zolang register `geverifieerd` blijft | ADR-0002, ADR-0004, ADR-0006 |
| Publicaties | `publicaties.html` | professionele autoriteit | publiek, `geverifieerd` | Naar profiel, professionals en relevante project-/artikelcontext | In sitemap zolang register `geverifieerd` blijft | ADR-0001, ADR-0004, ADR-0006 |
| Privacy | `privacy.html` | juridisch | publiek, `geverifieerd` | Vanuit footer, formulieren/contactcontext en veiligheidslinks | In sitemap zolang register `geverifieerd` blijft | ADR-0005, ADR-0006 |
| Disclaimer | `disclaimer.html` | medisch/juridisch | publiek, `geverifieerd` | Vanuit patientinformatie, voetpijnwijzer, artikelen en footer | In sitemap zolang register `geverifieerd` blijft | ADR-0005, ADR-0006 |
| Artikeldetailpagina's | `artikelen/*.html` | patient/professioneel/projectcontext | publiek, `geverifieerd` volgens register | Terug naar `artikelen.html`, relevante hub, bron-/veiligheidscontext en disclaimer waar passend | Alleen in sitemap als registerstatus klopt | ADR-0002, ADR-0004, ADR-0005, ADR-0006 |
| Projectdetailpagina's | `projecten/*.html` | project/zorgontwikkeling | publiek, `geverifieerd` volgens register | Terug naar `projecten.html`, advies/professionals en relevante artikelen | Alleen in sitemap als registerstatus klopt | ADR-0002, ADR-0004, ADR-0006 |

## Conceptmodule

| Onderdeel | Route | Huidige status | Minimale interne links | Niet in sitemap zolang concept | ADR's |
| --- | --- | --- | --- | --- | --- |
| Voet- en enkelpijnwijzer | `concept-foot-pain-guide.html` | concept, `noindex,nofollow`, uitgesloten van deployment | Naar `behandelingen.html`, `disclaimer.html` en alleen naar toegestane concept/publieke onderwerpen volgens `content.js` | Ja | ADR-0003, ADR-0004, ADR-0005, ADR-0006 |

## Geplande aandoeningen- en klachtenpagina's

De meeste onderstaande routes staan lokaal in `behandelingen/` en blijven concept totdat medische review, linkcontrole, sitemap/registerbesluit en eigenaar-validatie expliciet zijn afgerond. `enkelverzwikking.html`, `enkelartrose.html` en `enkelprothese.html` zijn inmiddels afzonderlijk gepubliceerd en geverifieerd.

| Type | Routes | Status nu | Minimale interne links voor publicatie | Sitemapregel | ADR's |
| --- | --- | --- | --- | --- | --- |
| Voorvoet/grote teen/tenen | `hallux-valgus.html`, `hallux-rigidus.html`, `hamerteen-klauwteen.html`, `metatarsalgie.html`, `morton-neuroom.html`, `mtp-plantaire-plaatklachten.html`, `tailors-bunion.html`, `sesamoidklachten.html` | concept, medische review nodig | Terug naar `behandelingen.html`, relevante patientartikelen indien publiek, `disclaimer.html`; onderlinge links alleen als medisch veilig en routezuiver | Niet opnemen zolang concept | ADR-0002, ADR-0003, ADR-0005, ADR-0006 |
| Enkel, publiek | `enkelverzwikking.html`, `enkelartrose.html`, `enkelprothese.html` | publiek en `geverifieerd` | Terug naar `behandelingen.html`, veilige publieke verdieping en `disclaimer.html`; geen diagnose- of triagelinks | Opgenomen | ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006 |
| Enkel, concept | `chronische-enkelinstabiliteit.html`, `anterieur-enkel-impingement.html`, `posterieur-enkel-impingement.html`, `ganglion-enkel.html`, `peroneuspeesklachten.html`, `sinus-tarsi-klachten.html`, `os-trigonum.html`, `kraakbeenletsel-enkel.html`, `corpus-liberum-enkel.html` | concept, medische review nodig | Terug naar `behandelingen.html`, veilige verwante onderwerpen, `disclaimer.html`; geen publieke links vanaf geverifieerde pagina's zolang deze routes concept zijn | Niet opnemen zolang concept | ADR-0002, ADR-0003, ADR-0005, ADR-0006 |
| Achtervoet/voetstand/hiel | `platvoet-volwassen.html`, `tibialis-posterior-peesklachten.html`, `holvoet-cavovarus.html`, `achillespeesklachten.html`, `hielpijn.html`, `peesplaatklachten-hielspoor.html`, `vetkussen-hielklachten.html`, `haglund-retrocalcaneaire-klachten.html` | concept, medische review nodig | Terug naar `behandelingen.html`, relevante verwante concept/publieke pagina's, `disclaimer.html` | Niet opnemen zolang concept | ADR-0002, ADR-0003, ADR-0005, ADR-0006 |
| Middenvoet/complexe restklachten | `tarsal-boss.html`, `ganglion-middenvoet.html`, `stressreactie-stressfractuur.html`, `artrose-na-breuk.html`, `revisie-artrodese.html` | concept, medische review nodig | Terug naar `behandelingen.html`, relevante pijnwijzercontext, `disclaimer.html`; extra alert op trauma-/scopegrens | Niet opnemen zolang concept | ADR-0002, ADR-0003, ADR-0005, ADR-0006 |
| Lisfranc/middenvoetletsel | geen publieke behandelpagina-link in pijnwijzer; lokaal bestand bestaat als concept | alleen orienterende differentiaal; niet als aanbod of behandelspoor | Alleen als algemene herkenningsrichting in pijnwijzerdata; geen publieke behandelpagina-link | Niet opnemen zolang out-of-scope/orienterend | ADR-0001, ADR-0003, ADR-0005, ADR-0006 |

## Geplande behandelpagina's

| Behandelonderwerp | Route | Huidige rol | Minimale interne links voor publicatie | Pijnwijzerregel | ADR's |
| --- | --- | --- | --- | --- | --- |
| Voorvoetcorrectie | `behandelingen/voorvoetcorrectie.html` | concept behandelpagina, medische review nodig | Terug naar `behandelingen.html`, relevante voorvoetonderwerpen, `disclaimer.html` | Niet als automatische diagnose-uitkomst; alleen als verwant behandelonderwerp waar medisch gevalideerd | ADR-0003, ADR-0005, ADR-0006 |
| MTP-1 artrodese | `behandelingen/mtp-1-artrodese.html` | apart behandelonderwerp, medische review nodig | Terug naar `behandelingen.html`, `hallux-rigidus.html` wanneer publiek/gevalideerd, `disclaimer.html` | `showInPainGuide: false`; geen pijnwijzeruitkomst | ADR-0003, ADR-0005, ADR-0006 |
| Revisie na artrodese | `behandelingen/revisie-artrodese.html` | concept, in data als behandeling met beperkte zichtbaarheid | Terug naar `behandelingen.html`, relevante restklachtencontext, `disclaimer.html` | `showInPainGuide: false`; niet als brede aanbodkaart tonen zonder eigenaar-validatie | ADR-0003, ADR-0005, ADR-0006 |

## Voetpijnwijzerregio's

Bron voor regio's en mappings blijft `content.js`. Deze matrix bewaakt de governance-laag; wijzig medische mapping alleen met eigenaar-validatie.

| Regio | Huidige rol | Linkregel | ADR's |
| --- | --- | --- | --- |
| Grote teen en teengewricht | pijnregio | Mag alleen leiden naar mogelijke onderwerpen, niet naar diagnose-uitkomst | ADR-0003, ADR-0005, ADR-0006 |
| Kleine tenen | pijnregio | Idem; behandelonderwerpen alleen als verwant en gevalideerd | ADR-0003, ADR-0005, ADR-0006 |
| Bovenkant voorvoet | pijnregio | Linkset volgt `content.js`; publicatie pas na review | ADR-0003, ADR-0005, ADR-0006 |
| Bovenkant middenvoet | pijnregio | Extra bewaking op Lisfranc/trauma als orienterende differentiaal | ADR-0001, ADR-0003, ADR-0005, ADR-0006 |
| Wreef | pijnregio | Linkset volgt `content.js`; geen behandelclaim | ADR-0003, ADR-0005, ADR-0006 |
| Onder de bal van de voet | pijnregio | Mogelijke oorzaken formuleren als leesrichting | ADR-0003, ADR-0005, ADR-0006 |
| Onder de middenvoet | pijnregio | Extra bewaking op Lisfranc/trauma als orienterende differentiaal | ADR-0001, ADR-0003, ADR-0005, ADR-0006 |
| Onder de hiel | pijnregio | Geen diagnose of triage; veiligheidslink behouden | ADR-0003, ADR-0005, ADR-0006 |
| Binnenkant voetboog | pijnregio | Linkset volgt `content.js`; geen persoonlijke behandelroute | ADR-0003, ADR-0005, ADR-0006 |
| Binnenkant enkel | pijnregio | Linkset volgt `content.js`; geen spoed-/triage-inschatting | ADR-0003, ADR-0005, ADR-0006 |
| Buitenkant voet | pijnregio | Linkset volgt `content.js`; geen diagnoseclaim | ADR-0003, ADR-0005, ADR-0006 |
| Buitenkant enkel | pijnregio | Extra alert op letsel/sportcontext en officiele zorgkanalen | ADR-0003, ADR-0005, ADR-0006 |
| Voorkant enkel | pijnregio | Linkset volgt `content.js`; geen automatische indicatie | ADR-0003, ADR-0005, ADR-0006 |
| Achterkant enkel | pijnregio | Linkset volgt `content.js`; geen diagnose-uitkomst | ADR-0003, ADR-0005, ADR-0006 |
| Achterkant hiel | pijnregio | Linkset volgt `content.js`; veiligheidstekst behouden | ADR-0003, ADR-0005, ADR-0006 |
| Achillespees | pijnregio | Linkset volgt `content.js`; geen behandeladvies personaliseren | ADR-0003, ADR-0005, ADR-0006 |
| Meerdere of onduidelijke plekken | algemene richting | Moet naar algemene informatie/veiligheidscontext kunnen; geen brede diagnosemix | ADR-0003, ADR-0005, ADR-0006 |

## Pagina's die niet in sitemap mogen zolang ze concept zijn

- `concept-foot-pain-guide.html`;
- alle niet-gepubliceerde `behandelingen/*.html`; `enkelverzwikking.html`, `enkelartrose.html` en `enkelprothese.html` zijn uitzonderingen;
- elke toekomstige detailpagina die `noindex,nofollow`, `review_nodig` of conceptstatus heeft;
- elk onderwerp zonder publieke behandelpagina-link, inclusief Lisfranc/middenvoetletsel zolang dit alleen orienterende differentiaal is.

## Minimale interne linkregels

- Elke publieke hub moet vanaf de homepage en/of hoofdnavigatie bereikbaar blijven.
- Elke publieke detailpagina moet teruglinken naar de passende hub.
- Patientinformatie linkt niet direct naar consultancy als patientvervolgstap.
- Professionele pagina's mogen naar publicaties, professionele artikelen en passende zorgkanalen linken.
- Project- en adviespagina's blijven niet-patientgebonden.
- Conceptpagina's mogen lokaal onderling linken, maar niet als publieke vervolgstap verschijnen.
- Medische pagina's en interactieve modules moeten naar `disclaimer.html` of gelijkwaardige veiligheidscontext kunnen verwijzen.
- Pijnwijzerlinks gebruiken formuleringen als mogelijke richting, niet als diagnose of behandeladvies.

## Open needs owner validation

- Definitieve medische mapping per voetpijnwijzerregio.
- Of alle conceptbehandelpagina's tegelijk of gefaseerd publiek mogen worden gekoppeld.
- Publieke naam en plaatsing van de voet- en enkelpijnwijzer.
- Medische review van alle conceptbehandelpagina's.
- Besluit of Lisfranc/middenvoetletsel alleen in data blijft of ook als conceptpagina zichtbaar mag blijven; geen publieke behandelpagina-link zonder nieuwe eigenaar-validatie.
- Canonical hostkeuze.
- Technische en governance-afbakening van interne beeldbank/bestanden.
- Acceptatie van deze linkmatrix als werkdocument voor toekomstige publicatie- en linkbesluiten.

## Wanneer ADR-check verplicht is

Doe een expliciete ADR-check en stel zo nodig een nieuwe ADR voor bij:

- nieuwe of gewijzigde positionering;
- nieuwe doelgroep of doelgroepverschuiving;
- nieuwe contentpijler;
- wijziging in page model;
- wijziging in medische veiligheidsregels;
- wijziging in SEO, publicatie, indexatie, sitemap, robots, canonical of deployment-scope;
- wijziging in voetpijnwijzerdoel, mapping, naam, plaatsing of medische betekenis;
- wijziging in concept/public-status of verificatiestatus;
- structurele wijziging in interne linkstrategie tussen patient-, professional- en adviesroutes.
