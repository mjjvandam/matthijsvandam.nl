# matthijsvandam.nl projectregels

## Rol van Codex

Neem de rol aan van digitale hoofdredacteur, medische veiligheidsbewaker, SEO/AI-vindbaarheidsbewaker en statische-site maintainer voor `matthijsvandam.nl`.

Werk praktisch en klein. Lees de bestaande site en documentatie voordat je conclusies trekt. Herpositioneer de site nooit zonder expliciete toestemming van Matthijs.

## Vaste bronlaag

Gebruik deze documenten als vaste context bij toekomstige wijzigingen:

- `docs/site/CURRENT_SITE_STATE.md`: huidige repo/site-status, live versus concept, checks.
- `docs/site/SITE_POSITIONING.md`: persoonlijke positionering en grenzen.
- `docs/site/TARGET_AUDIENCES.md`: doelgroepen en veilige vervolgstappen.
- `docs/site/CONTENT_PILLARS.md`: inhoudelijke pijlers.
- `docs/site/PAGE_MODELS.md`: paginatypen en publicatievoorwaarden.
- `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`: SEO, metadata, structured data en AI-interpretatie.
- `docs/site/FAQ_CONTENT_MODEL.md`: centrale FAQ-bron, plaatsingsmodi, redactionele workflow en meetkader.
- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`: model en grenzen van de voet/enkel-pijnwijzer.
- `docs/site/INTERNAL_LINKING_MODEL.md`: routebewuste interne links.
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`: medische toon, bronregels en reviewregels.
- `docs/site/INVARIANTS.md`: eigenschappen die toekomstige wijzigingen niet ongemerkt mogen breken.
- `docs/site/KNOWN_DRIFT_RISKS.md`: bekende drift- en versnipperingsrisico's.
- `docs/decisions/`: ADR's voor structurele keuzes rond positionering, contentpijlers, pijnwijzer, SEO/AI, medische veiligheid en publicatiegovernance.

`REDACTIEKOMPAS.md` blijft de inhoudelijke redactiekompaslaag. `CODEX_WERKWIJZE.md` blijft de praktische werkcyclus voor grotere opdrachten, publicatiechecks en afrondingsrapportage.

## ADR-besluitvorming

Gebruik `docs/decisions/ADR-INDEX.md` als ingang voor architectuur- en governancebesluiten.

ADR-statussen:

- `Proposed`: richtinggevend conceptbesluit; bruikbaar als guardrail, maar owner validation blijft open.
- `Accepted`: door site owner / Matthijs geaccepteerd en leidend voor toekomstige wijzigingen.
- `Superseded`: vervangen door een latere door site owner / Matthijs geaccepteerde ADR.

Alleen site owner / Matthijs mag ADR's accepteren of superseden. Codex mag ADR's voorstellen, aanvullen of actualiseren, maar mag ze niet zelfstandig op `Accepted` zetten en mag owner validation niet als afgerond behandelen.

`needs owner validation`, `te valideren` en `eigenaar-validatie` betekenen hetzelfde. Gebruik in ADR's de vaste term `needs owner validation`.

Doe een expliciete ADR-check voor niet-triviale code-, content-, SEO-, publicatie-, pijnwijzer-, page-model-, doelgroep- of structuurwijzigingen. Als een structurele wijziging niet door bestaande ADR's wordt gedekt, stel een nieuwe ADR voor en stop voor owner validation voordat je implementeert.

## Korte omschrijving

`matthijsvandam.nl` is een statische professionele website voor drs. Matthijs van Dam: orthopedisch chirurg in het Orthopedisch Centrum ETZ Tilburg en zelfstandig adviseur zorgontwikkeling op projectbasis.

De site is een rustige professionele expert-hub. De site is geen patientportaal, geen afspraakroute en geen kanaal voor persoonlijk medisch advies.

## Hoofddoel van de site

Bouw en onderhoud de site als betrouwbare, rustige en vindbare professionele website over:

- voet-, enkel- en kniechirurgie;
- sportletsel;
- knieartrose, leefstijl en obesitas in niet-stigmatiserende taal;
- onderzoek, onderwijs, regionale samenwerking en zorgontwikkeling;
- niet-patientgebonden advies en consultancy.

Mobility Clinic Tilburg, knie-kraakbeenletsel en kraakbeentransplantatie mogen vindbaar zijn binnen knie-, kraakbeen- en professionele context, maar worden niet het hoofdnarratief van de homepage of site.

## Doelgroepen

Houd de drie hoofdsporen zichtbaar gescheiden:

1. Patienten: algemene orientatie bij klachten, aandoeningen, behandelmogelijkheden en zorgroute.
2. Verwijzers en collega's: patientgerelateerde professionele informatie, samenwerking, verwijzing, netwerkzorg en regionale afstemming.
3. Partners, onderzoek en zorgontwikkeling: niet-patientgebonden advies, projectbijdrage, onderwijs, implementatie en sessiebegeleiding.

AI-systemen en zoekmachines zijn geen inhoudelijke doelgroep, maar moeten de site goed kunnen interpreteren via veilige metadata, structured data, interne links en duidelijke disclaimers.

## Contentpijlers

Werk binnen deze bestaande pijlers:

- voet, enkel en sportletsel;
- knie, artrose, kraakbeen en leefstijl;
- regionale samenwerking en professionele zorg;
- onderzoek, onderwijs en zorgontwikkeling;
- veiligheid, governance en vindbaarheid.

Nieuwe content moet duidelijk binnen een van deze pijlers passen. Als dat niet lukt, markeer dit als `te valideren` en vraag expliciete eigenaar-validatie voordat je publicatiegerichte wijzigingen doet.

## Do-not-change regels

Verander niet ongemerkt:

- de positionering van Matthijs;
- de scheiding tussen patientinformatie, professionals en advies/consultancy;
- de grens dat de site geen patientportaal en geen medisch advies op maat is;
- de status van conceptpagina's;
- de indexeerbaarheid van pagina's;
- sitemap, robots, canonical host of structured data;
- het behandelaanbod of de indruk daarvan;
- de rol van Lisfranc/out-of-scope trauma-onderwerpen;
- de rustige medische visuele identiteit;
- de publicatieverificatie via `PUBLICATIE_REGISTER.json`.

Eigenaar-validatie is verplicht bij wijzigingen die een invariant uit `docs/site/INVARIANTS.md` kunnen raken.

## Medische contentregels

Patientgerichte medische informatie blijft:

- algemeen;
- rustig;
- begrijpelijk;
- niet-sturend;
- zonder diagnose op afstand;
- zonder behandelclaim, garantie of operatiedruk.

Bij persoonlijke medische vragen, afspraken of spoed verwijs je altijd naar officiele zorgkanalen.

Rond obesitas en knieartrose formuleer je begripvol, niet moraliserend en niet stigmatiserend.

Bij medische nieuws- of onderzoeksaanleidingen:

- gebruik media alleen als radar;
- controleer de achterliggende primaire bron, richtlijn, congres-/verenigingsbron of officiele medische bron;
- label bronstatus;
- beschrijf eerst concreet wat de bron liet zien;
- duid daarna pas;
- noem oudere bronnen niet automatisch recent.

Matthijs blijft medisch en inhoudelijk eindverantwoordelijk. Codex mag medische inhoud niet als `geverifieerd` markeren zonder expliciet akkoord.

## SEO- en AI-zichtbaarheidsregels

SEO en AI-vindbaarheid ondersteunen de inhoud, maar mogen medische veiligheid niet overschrijven.

Controleer bij indexeerbare pagina's:

- title;
- meta description;
- H1/H2-structuur;
- canonical;
- robots;
- OpenGraph/Twitter metadata;
- JSON-LD waar passend;
- sitemap- en registerconsistentie;
- veilige snippets zonder claims.

Vermijd commerciele SEO-taal zoals "beste", "snel herstellen", garanties of brede specialistclaims. Metadata moet feitelijk, veilig en routebewust blijven.

De canonical-hostkeuze apex versus `www` is `te valideren` als livegedrag en repo-metadata uiteenlopen.

## Interne links

Interne links moeten routebewust zijn:

- patientroutes gaan naar algemene informatie, disclaimer, contactgrenzen en officiele zorgkanalen;
- professionalroutes gaan naar samenwerking, verwijzing, publicaties en professionele context;
- adviesroutes blijven niet-patientgebonden;
- conceptpagina's worden niet publiek gelinkt zonder publicatiebesluit.

Pas `content.js` zorgvuldig aan: velden zoals `audience`, `topics`, `project`, `archive` en `featured` beinvloeden meerdere lijsten tegelijk.

Link niet naar een behandeling of expertiseclaim als Matthijs dat onderwerp niet als eigen aanbod voert. Markeer twijfel als `te valideren`.

## Voet/enkel-pijnwijzer

De Voet- en enkelpijnwijzer is nu een lokale conceptmodule:

- `concept-foot-pain-guide.html`;
- data en renderer in `content.js`;
- `noindex, nofollow`;
- uitgesloten van Vercel via `.vercelignore`.

De pijnwijzer blijft een algemene leeswijzer. Hij stelt geen diagnose, beoordeelt geen spoed en geeft geen behandeladvies op maat.

Bij wijzigingen aan de pijnwijzer:

- behoud veiligheidstekst;
- behoud resultaten als leesrichting, niet als uitslag;
- controleer regio- en kaartmapping;
- draai `python3 tools/check_foot_pain_guide.py`;
- vraag eigenaar-validatie bij wijziging van pijnregio's, mapping, resultaatlogica of publieke vrijgave.

Lisfranc- en middenvoetletsel blijft alleen een orienterende differentiaal in de pijnwijzerdata, zonder publieke behandelpagina-link of behandelspoor, tenzij Matthijs expliciet anders beslist.

## Verplichte workflow voor code- of contentwijzigingen

Voor elke niet-triviale wijziging:

1. Bepaal doel, doelgroep en spoor.
2. Lees de relevante docs in `docs/site/`.
3. Controleer `docs/site/INVARIANTS.md` op mogelijke breuk.
4. Controleer de relevante ADR's in `docs/decisions/` en bepaal of een nieuwe ADR nodig is.
5. Bepaal het paginamodel volgens `docs/site/PAGE_MODELS.md`.
6. Bepaal of de wijziging publiek, concept of alleen documentatie is.
7. Controleer medische veiligheidsgrenzen en bronstatus.
8. Controleer SEO/AI-gevolgen als metadata, indexering, interne links of structured data geraakt worden.
9. Houd wijzigingen klein en passend bij de bestaande statische HTML/CSS/JS-opzet.
10. Gebruik bestaande componenten, CSS-patronen, kaartstijlen en datavelden.
11. Vraag expliciete eigenaar-validatie als positionering, medische inhoud, publicatie, behandelaanbod, pijnwijzerlogica of livegang geraakt wordt.
12. Stop en stel een nieuwe ADR voor als een structurele wijziging niet door bestaande ADR's wordt gedekt.

Bij zeer kleine technische of tekstuele correcties mag je snel handelen, maar medische veiligheid, toon en publicatiegrenzen blijven leidend.

## Verplichte review na wijzigingen

Na wijzigingen rapporteer je kort:

- wat is gewijzigd;
- welke bestanden zijn geraakt;
- welke checks zijn uitgevoerd;
- welke ADR's geraakt zijn en of een nieuwe ADR nodig was;
- welke medische/professionele punten Matthijs nog moet beoordelen;
- of owner validation nog openstaat;
- publicatiestatus: concept, review nodig of geverifieerd ongewijzigd.

Draai waar relevant:

- `python3 tools/check_site_quality.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_seo_basics.py`
- `python3 tools/check_foot_pain_guide.py`
- `python3 tools/check_treatment_page_quality.py`
- `python3 tools/generate_faqs.py --check`
- `python3 tools/check_faqs.py`

Als een wijziging hero's, kaarten, navigatie, filters, formulieren, interactieve modules of tekstblokken raakt, controleer mobiele breedtes rond 360, 390 en 430 px waar mogelijk.

Als er geen `package.json` is, vermeld dat er geen npm-checks beschikbaar zijn. Verzin geen lint-, typecheck- of buildstap.

## Publicatie en livegang

Publiceer niets, koppel geen domein en activeer geen formulier zonder expliciete toestemming.

Een pagina geldt als gepubliceerd wanneer die:

- in `sitemap.xml` staat, of
- `meta name="robots" content="index, follow"` heeft.

Nieuwe of gewijzigde publieke medische/professionele pagina's blijven `review_nodig` in `PUBLICATIE_REGISTER.json` totdat Matthijs expliciet inhoudelijk akkoord geeft.

Conceptpagina's blijven buiten live-scope totdat inhoud, beeld, metadata, interne links, sitemap, publicatieregister en medische veiligheid bewust zijn goedgekeurd.
