# FAQ Inventory 2026-08-26

Status: implementatie- en verificatiedossier voor ADR-0007

## Scope

De nulmeting en nameting omvatten zichtbare `.treatment-faq`-secties en JSON-LD-vraagrecords in:

- `behandelingen/*.html`
- `artikelen/*.html`
- `concepten/previews/*.html`

De FAQ-generator wijzigt geen page metadata, publicatiestatus, sitemap, robots, canonicals, `.vercelignore` of `PUBLICATIE_REGISTER.json`. Tijdens de afronding verschenen parallelle publicatiewijzigingen in de working tree; die vallen buiten deze migratie en zijn niet door de FAQ-tools aangepast.

De working tree bevatte vooraf gebruikerswijzigingen in de enkelartrose-behandelpagina, artikelbron, artikelpreview en het researchdossier. Die actuele versie vormde het uitgangspunt; alleen de FAQ-blokken in behandelpagina, artikelbron en preview zijn door de centrale generator beheerd. Het researchdossier is niet gewijzigd door de FAQ-migratie.

## Counts

| Meting | Voor migratie | Na migratie |
| --- | ---: | ---: |
| Behandelpagina's met zichtbare FAQ | 35 | 35 |
| Zichtbare volledige vragen op behandelpagina's | 258 | 258 |
| Behandelpagina's met `FAQPage`-JSON-LD | 35 | 34 |
| Vraagrecords in behandelpagina-JSON-LD | 258 | 245 |
| Artikelpagina's met FAQ zonder FAQ-schema | 1 conceptpreview | 1 publieke pagina |
| Zichtbare volledige artikelvragen | 5 | 3 |
| Zichtbare contextlink-items in artikel | 0 | 1 |
| Totaal zichtbare FAQ-plaatsingen | 263 | 262 |
| Centrale records | n.v.t. | 261 |
| Bevestigde afwijkingen tussen zichtbaar en JSON-LD | 1 | 0 |
| Exact/genormaliseerd gelijke vraaggroepen | 20 | 19 |
| Sterke bijna-dubbelparen bij drempel 0,88 | niet geclassificeerd | 42, geclassificeerd |

De 19 exacte groepen en 42 sterke bijna-dubbelparen zijn inhoudelijk beoordeeld. Ze blijven pagina-specifiek omdat dezelfde algemene formulering aandoeningsspecifieke diagnostiek, behandeling of verwachtingen kan verhullen. Deze classificatie is in de centrale records vastgelegd, zodat de validator nieuwe onbeoordeelde overlap signaleert.

## Confirmed technical drift

De nulmeting vond in `behandelingen/stressreactie-stressfractuur.html` verschillende bewoording voor één zichtbare en één JSON-LD-vraag:

- visible: `Wanneer is de naviculare anders?`
- JSON-LD: `Wanneer is de naviculare een risicoplek?`

Beide sets telden acht vragen, waardoor een telling alleen deze drift niet vond. De centrale generatie heeft de zichtbare versie als bron behouden en het schema daarmee gelijkgetrokken. De nameting vindt geen afwijking meer.

## Repeated wording patterns

Examples that require editorial classification before reuse:

- `Wat kan erop lijken?` occurs on multiple condition pages. The question is generic, but each answer is condition-specific and should not be globally merged.
- `Wanneer wordt een operatie besproken?` occurs across multiple treatment topics. The indications and uncertainty differ per condition.
- `Is beeldvorming altijd nodig?` occurs across several pages. The modality and diagnostic question differ.
- Ganglion questions on the ankle and midfoot are stronger reuse candidates because subject, answer and follow-up may materially overlap.
- The question about movement after MTP-1 arthrodesis occurs on both the hallux-rigidus and MTP-1-arthrodesis pages and is a strong primary-page/link candidate.

## Ankle-osteoarthritis pilot

Behandelpagina na migratie:

- 13 visible questions;
- 13 JSON-LD questions;
- visible and schema question order and wording match in the current working tree.

AAOS-richtlijnartikel na migratie:

- drie volledige contextvragen en één link-item;
- no `FAQPage` JSON-LD;
- algemene vragen over cortison, hyaluronzuur en PRP zijn niet meer volledig herhaald;
- het link-item verwijst naar `behandelingen/enkelartrose.html#vragen` voor de onderhouden algemene antwoorden;
- de drie volledige vragen gaan over oefentherapie/fysiotherapie, brace/schoenaanpassing en operatie.

Uitgevoerde pilotclassificatie:

| Question area | Primary handling |
| --- | --- |
| Cortisone injection | full on `behandelingen/enkelartrose.html`; contextual link in article |
| Hyaluronic acid | full on `behandelingen/enkelartrose.html`; contextual link in article |
| PRP | full on `behandelingen/enkelartrose.html`; contextual link in article |
| Oefentherapie/fysiotherapie | article-specific `context` FAQ |
| Brace/schoenaanpassing | article-specific `context` FAQ |
| Operatie | article-specific `context` FAQ |

## Proposed migration clusters

1. Ankle osteoarthritis, post-traumatic osteoarthritis and revision arthrodesis.
2. Ankle sprain, chronic instability, sinus tarsi and peroneal-tendon complaints.
3. Cartilage injury, loose body and anterior/posterior impingement.
4. Achilles, Haglund and heel complaints.
5. Adult flatfoot, cavovarus and tibialis-posterior complaints.
6. Forefoot, hallux, toe and MTP-related pages.
7. Ganglion and dorsal midfoot complaints.
8. Stress injury and remaining differential topics.

Lisfranc remains an out-of-scope, concept-only differential and cannot become a public treatment route through FAQ migration.

## Ingebouwde verificatie

- exact equality between visible question/answer and retained schema;
- stable deep-link anchors and existing link targets;
- no public FAQ link to a concept-only primary page;
- one primary full/context placement per record;
- required metadata and medical review state per answer;
- warnings for unclassified exact and strong near duplicates;
- generated HTML and markdown must match the central data.

## Review- en publicatiestatus

- De actuele working tree bevat 33 behandelpagina's met `noindex, nofollow` en twee publieke pagina's met `index, follow`: enkelverzwikking en enkelartrose.
- Het AAOS-richtlijnartikel is tijdens de afronding parallel gepubliceerd en in het register als door Matthijs geverifieerd opgenomen. De oude conceptpreview bevat geen aparte FAQ-kopie meer; de markdownbron blijft de onderhouden redactionele bron.
- De FAQ-generator heeft de publieke enkelartrosepagina na die registerverificatie technisch opnieuw gegenereerd. `check_publication_verification.py` meldt deze pagina daarom terecht als gewijzigd sinds verificatie; herverificatie blijft open.
- De medische akkoordstatus van bestaande records is behouden waar die al was vastgelegd; centralisatie geeft geen nieuw medisch akkoord.
- ADR-0007 is op 2026-08-26 door Matthijs geaccepteerd.

## Afrondende checks

De afrondende run omvat:

- `python3 tools/check_site_quality.py`;
- `python3 tools/check_publication_verification.py`;
- `python3 tools/check_seo_basics.py`;
- `python3 tools/generate_faqs.py --check`;
- `python3 tools/check_faqs.py`;
- `python3 tools/check_foot_pain_guide.py` when mappings or guide links are touched;
- `python3 tools/check_treatment_page_quality.py`;
- `python3 tools/check_navigation_contract.py`;
- mobile FAQ review at 360, 390 and 430 px;
- `git diff --check`.

Resultaat op 2026-08-26:

- FAQ-generator en FAQ-validator: geslaagd voor 261 records, 36 pagina's en 262 plaatsingen;
- sitekwaliteit, SEO-basis, behandelpagina-kwaliteit, navigatiecontract en voet/enkel-pijnwijzer: geslaagd;
- mobiele browseraudit: 108 combinaties (36 pagina's op 360, 390 en 430 px), zonder overflow, runtimefouten of defect uitklapgedrag;
- zichtbare FAQ-inhoud van de 34 niet-pilot-behandelpagina's is gelijk aan de versie voor migratie;
- `git diff --check`: geslaagd;
- publicatieverificatie: niet volledig groen door één bestaand artikel op `review_nodig` en drie publieke pagina's die in de gezamenlijke working tree sinds hun verificatie zijn gewijzigd, waaronder de technisch opnieuw gegenereerde enkelartrosepagina;
- er is geen `package.json`, dus er zijn geen npm-checks beschikbaar.
