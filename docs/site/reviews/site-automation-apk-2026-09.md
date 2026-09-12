# SITE_AUTOMATISERINGS_APK_STATUS

AANDACHT_NODIG

Alle drie vereiste automations bestaan, staan ACTIVE en verwijzen naar de juiste lokale workspace. Er is geen ontbrekende automation, verkeerde workspace of expliciete autonome publicatieopdracht gevonden. Wel vragen promptverankering, documentatiedrift, deploymentafscherming van conceptdossiers en de scope van de sitekwaliteitsvalidator aandacht. De uitvoering op het exacte geplande tijdstip is niet bewezen.

# MAAND

2026-09. Diagnostische beoordeling op 7 september 2026, circa 21:55–22:05 CEST, in `/Users/matthijsvandam/Documents/GitHub/matthijsvandam.nl`.

Vergelijkingsbasis: het APK-rapport van augustus en de drie automation-memorybestanden. De werkboom bevatte bij aanvang al wijzigingen en verwijderingen, waaronder contactfunctionaliteit, publicatieregister en leerdossiers. Deze bestaande werkzaamheden zijn door deze APK niet gewijzigd of hersteld. De afsluitende git-status verschilde van de beginstatus en bevatte onder meer een nieuwe ADR-0012 buiten deze opdracht. De werkboom is dus tijdens de audit elders veranderd; de bevindingen zijn leesmomentopnamen, geen bevroren eindversie van al het lopende werk.

# GEVONDEN_SITE_AUTOMATIONS

| Automation-ID | Bestaat | Status | Workspace |
| --- | --- | --- | --- |
| wekelijkse-hoofdredactie-sitecheck-matthijsvandam-nl | Ja | ACTIVE | Juist |
| tweewekelijkse-artikelkansen-matthijsvandam-nl | Ja | ACTIVE | Juist |
| maandelijkse-site-automatiserings-apk-matthijsvandam-nl | Ja | ACTIVE | Juist |

Bron: de respectieve `automation.toml`-bestanden onder `/Users/matthijsvandam/.codex/automations/`. Alle drie bevatten dezelfde `cwds`-waarde voor deze repository en dezelfde projectreferentie `local-806f86333c4393555bc130df19683b65`; execution environment is lokaal.

Een beperkte scan van automationconfigs op de sitenaam vond daarnaast `bewaartermijn-websitecontact-controleren`: ACTIVE heartbeat, eerste dag van de maand 09:00, gericht op contactcorrespondentie. De prompt verbiedt websitewijzigingen en vraagt akkoord vóór verwijderen. Alleen de scope is gelezen; deze mailcontrole is niet uitgevoerd en niet toegevoegd aan de drie vaste APK-routines. Er is geen andere expliciete verwijzing naar deze site gevonden in de gescande configs. Indirecte verwijzingen of externe schedulers zijn niet uitgesloten.

# CONFIG_EN_RITME_STATUS

| Routine | Ingesteld ritme, lokale interpretatie Europe/Amsterdam | Uitvoeringsbewijs en beperking |
| --- | --- | --- |
| Wekelijkse sitecheck | Woensdag 19:30 | Memory beschrijft controles rond 5, 12/13, 19 en 26 augustus en 2 september. Laatste afronding 2 september 21:17 CEST. Past bij een wekelijkse reeks; notitietijden zijn geen scheduler-starttijden. |
| Artikelkansen | Om de twee weken, zondag 19:30 | Runs vastgelegd op 23 augustus en 6 september: 14 dagen verschil. Op 23 augustus is ook een dubbele aanroep genoteerd, waarbij geen tweede artikel of mail is gemaakt. Het geheugen bevat tussen 26 juli en 23 augustus geen aparte augustus-9-run; ontbreken van een notitie bewijst geen schedulerstoring. |
| APK | Eerste maandag van de maand 20:00 | 7 september is de eerste maandag. De vorige aanroep heeft last-runmetadata 3 augustus 22:02 CEST; het verslag werd op 5 augustus 21:22 afgerond. Huidige beoordeling vindt later dan 20:00 plaats. Geen bewijs dat de scheduler zelf te laat startte. |

De frequenties passen bij hun doel. De configs bevatten geen expliciet tijdzoneveld; bovenstaande tijden volgen de lokale taakcontext. Geen schedulerdatabase, uitvoeringslog, volgende-triggerwaarde, tijdzone-/zomertijdtest of modelbeschikbaarheidstest uitgevoerd. ACTIVE is configuratiestatus, geen garantie op succesvolle uitvoering. De wekelijkse routine en APK vermelden `gpt-5-codex`; artikelkansen vermeldt `gpt-5.6-sol`. Deze waarden zijn niet aangepast of als defect bestempeld.

# PROMPT_EN_DOC_DRIFT

De verplichte bronlaag is gelezen: AGENTS.md, CODEX_WERKWIJZE.md, REDACTIEKOMPAS.md, de in het canonieke APK-document genoemde site-documenten, ADR-index, register, sitemap, robots, deploymentuitsluitingen en automationconfigs/memories. Aanvullend zijn ARTICLE_EDITORIAL_PROFILE.md, SITE_TODO.md, vercel.json en relevante fragmenten van content.js en ADR-0008 bekeken.

- **Wekelijkse sitecheck:** expliciete dekking van medische grenzen, drie doelgroepsporen, metadata, sitemap/robots/canonical/JSON-LD, mobiele leesbaarheid en rustige medische vormtaal. AGENTS.md is verplicht gesteld; concept/public, register en menselijke verificatie worden daardoor indirect geborgd. De prompt noemt CODEX_WERKWIJZE.md, REDACTIEKOMPAS.md, ADR-index, register en `review_nodig` niet rechtstreeks. Dit was ook in augustus een aandachtspunt. Kleine veilige verbeteringen zijn toegestaan binnen de projectregels; dat is geen toestemming om publicatiepoorten te omzeilen.
- **Artikelkansen:** stevige bronketen verplicht, media alleen radar, bronstatus en ouderdom expliciet, eerst bronuitleg dan duiding, geen volledig artikel bij onvoldoende bronbasis. Publieke HTML, sitemap, content.js en navigatie blijven buiten de conceptopdracht; geen publicatie of domeinkoppeling. De prompt bevat geen expliciete koppeling naar de volledige projectbronlaag of verbod op zelfstandig verifiëren; de geldende AGENTS-regels bieden die grens wel.
- **Nieuwe leerlus:** AGENTS.md en ARTICLE_EDITORIAL_PROFILE.md eisen nu profiellezing, vier volledig geredigeerde leerdossiers, twee voorbeelden, een onveranderlijke eerste versie en finalisatie na expliciet akkoord. De opgeslagen artikelprompt noemt deze aanvullende stappen niet en gaat van eerste concept rechtstreeks naar de tweede redactieronde. Dit is een ontbrekende expliciete verankering, geen toestemming om AGENTS.md over te slaan. Naleving bij een volgende nieuwe conceptversie is in deze APK niet getest.
- **APK:** opgeslagen prompt verwijst rechtstreeks naar het canonieke document en bevat de rapportage- en mutatiegrenzen, inclusief de governancebetekenis van `review_nodig`. Geen promptafwijking gevonden.
- **Documentatie:** CURRENT_SITE_STATE.md en PAGE_MODELS.md beschrijven vier publieke behandelpagina's en 31 concepten. KNOWN_DRIFT_RISKS.md noemt nog drie uitzonderingen en 32 concepten. SITE_TODO.md noemt nog acht publieke reviewpunten, hallux rigidus als concept en een ongeconfigureerde Resend-contactroute; dat strookt niet met het actuele register en de contactbesluiten. Historische aantallen in ADR-context en de gedateerde SEO-auditbasis zijn geen actuele tellingen.
- **Contactgrenzen:** de eigenaarvrijgave van 7 september onderaan ADR-0008 staat een korte eigen gezondheidsaanleiding toe met duidelijke zorggrenzen. Oudere algemene documenten zeggen absoluut dat geen patiëntgegevens via de site mogen worden gedeeld. Laat die bronlaag aansluiten op het specifieke besluit; deze APK neemt geen nieuw medisch/privacybesluit en verifieert geen live formulier.

ADR-check: ADR-0004, ADR-0005 en ADR-0006 zijn gecontroleerd en Accepted. Er is geen nieuwe ADR nodig voor deze diagnostische rapportage zolang SEO/AI-definities, medische veiligheid en publicatiegovernance ongewijzigd blijven. ADR-statussen en owner validation zijn niet aangepast.

# PUBLICATIE_EN_MEDISCHE_GRENZEN

De validator vindt 40 publieke pagina's, 40 geregistreerd als geverifieerd en 0 `review_nodig`. Dit rapporteert de bestaande registertoestand, geen nieuwe medische goedkeuring door Codex. De patiëntpanelafwijking uit augustus wordt nu niet meer gemeld. De oude eigenaaractie daarvoor wordt niet herhaald.

| Bekend driftpunt | Maandstatus en reikwijdte |
| --- | --- |
| Canonical host | Apex in repo en sitemap; live redirect/hostkeuze niet gecontroleerd. Bestaand validatiepunt blijft open. |
| Concept versus publiek | Pijnwijzer en 31 behandelconcepten afgeschermd volgens lokale regels; vier behandeluitzonderingen consistent. Acht artikelpreviews bevatten noindex. `.vercelignore` sluit binnen concepten alleen editorial-learning expliciet uit; research/artikelen/previews hebben geen expliciete mapuitsluiting. Geen andere bescherming gevonden in .gitignore of vercel.json. Deploymentinhoud en directe live bereikbaarheid niet gecontroleerd; noindex is geen toegangs- of deploymentblokkade. |
| Register versus todo | Concrete documentatiedrift: todo noemt acht reviews en hallux rigidus als concept; actueel register heeft nul reviews en hallux rigidus geverifieerd. |
| Lisfranc | content.js bevat lege url en verklarende guideNote. Niet in sitemap; pijnwijzercheck slaagt. Geen publiek behandelspoor aangemaakt. |
| Contentclusters | Behandelstatus/inventaris en publicatie-/SEO-checks consistent. Geen volledige semantische review van alle koppelingen gedaan. |
| Projectcontent | Zes projectpagina's geregistreerd; prompts bewaken de drie sporen. Inhoudelijke actualiteit van partners/projecten niet integraal herbeoordeeld. |
| SEO-claimtaal | Bron- en claimgrenzen in prompts aanwezig; SEO-basischeck slaagt. Geen volledige handmatige medische snippetreview gedaan. |
| Beeldbank | Robots-disallow en noindex/noarchive-headerconfig aanwezig, geen uitsluiting van de map in .vercelignore. Directe live bereikbaarheid en gewenste afscherming niet vastgesteld. |
| Contactformulier | Concrete eigenaarvrijgave vastgelegd in ADR-0008 en register; oudere bronlaag/todo loopt achter. Geen formulier geactiveerd, ingestuurd of live getest. |
| Tijdgebonden artikelen | Patiëntpanel staat archive:true en publicatiecheck meldt geen afwijking meer. Overige deadlines, subsidie- en projectstatussen niet volledig inhoudelijk getoetst. |

Aanvullende driftpunten 11 en 12 uit KNOWN_DRIFT_RISKS.md: FAQ-generatie/schema en contrast in avondmodus zijn niet getest in deze APK. De wekelijkse memory beschrijft FAQ-checks op 2 september; dat is geen testresultaat van vandaag.

# TECHNISCHE_CHECKS

Alle vijf toegestane diagnostische validators zijn uitgevoerd met `PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache`.

| Check | Exit | Resultaat |
| --- | --- | --- |
| tools/check_site_quality.py | 1 | 77 HTML-bestanden; 9 issues: header, nav en toggle ontbreken elk in drie lokale mailtemplates. |
| tools/check_publication_verification.py | 0 | 90 HTML-bestanden; 40 publiek, 40 geverifieerd, 0 review_nodig, 50 concept/noindex volgens de check. |
| tools/check_seo_basics.py | 0 | 40 sitemap-pagina's; geen SEO-basisissues. |
| tools/check_foot_pain_guide.py | 0 | Geen structurele issues. |
| tools/check_treatment_page_quality.py | 0 | Inventaris en paginastatus consistent. |

De negen sitekwaliteitsmeldingen betreffen `local-mail-preview/confirmation.html`, `local-mail-preview/contact-mail-example.html` en `local-mail-preview/templates/confirm-subscription.html`. Deze map is uitgesloten in .vercelignore. De meldingen wijzen op een scopevraag voor de validator bij mail-/bevestigingstemplates; ze bewijzen geen kapot publiek menu. De check is desondanks niet groen verklaard. De artikelmemory van 6 september noemde alleen de drie meldingen in het abonnementstemplate; nu zijn het negen.

Er is geen package.json; geen npm-, lint-, typecheck- of buildstap beschikbaar of uitgevoerd. Een eerste poging om configs met Python tomllib te lezen mislukte omdat die module ontbreekt; de configs zijn vervolgens als tekst gelezen en de relevante velden gecontroleerd. Dit blokkeerde de audit niet.

# RISICO_TOP_5

1. Conceptdossiers: geen expliciete deploymentuitsluiting voor artikelpreviews, conceptartikelen en research; noindex alleen borgt niet dat bestanden lokaal blijven.
2. Governancebronlaag: contactvrijgave, todo en conceptaantallen lopen uiteen en kunnen een volgende routine op verouderde instructies laten handelen.
3. Artikelroutine: nieuwe leerlus ontbreekt in de opgeslagen uitvoeringsvolgorde; beide inhoudelijke prompts missen expliciete actuele documentverankering.
4. Validatorruis: negen navigatieafwijkingen in uitgesloten mailtemplates kunnen ten onrechte tot een reparatie van templates of een onjuist groen oordeel leiden.
5. Niet bewezen operationele grenzen: stipte scheduleruitvoering, canonical redirect en directe bereikbaarheid van beeldbank/conceptdossiers zijn niet vastgesteld.

# ACTIES_VOOR_EIGENAAR

- `technische fix nodig`: laat de deploymentafscherming van concepten/research, concepten/artikelen en concepten/previews gericht borgen; controleer eerst de werkelijke deploymentinhoud. Geen publicatie-instellingen in deze APK gewijzigd.
- `documentatie bijwerken`: breng SITE_TODO.md, KNOWN_DRIFT_RISKS.md en de algemene contactregels in lijn met het actuele register en het vastgelegde eigenaarbesluit, zonder nieuwe medische toestemming te veronderstellen.
- `automation-update nodig`: veranker de actuele bronlaag in beide inhoudelijke prompts en de leerlus in de artikelroutine; behoud bron-, concept-, review- en publicatiegrenzen.
- `technische fix nodig`: laat de validator onderscheid maken tussen sitepagina's en lokale mailtemplates, met behoud van navigatiecontrole voor echte sitepagina's.
- `needs owner validation`: neem bij de afzonderlijke hostingbeoordeling de canonical-hostkeuze en gewenste directe bereikbaarheid van beeldbank mee; laat bij twijfel ook schedulerhistorie/tijdzone read-only controleren.

# NIET_GEDAAN

Geen automations, prompts, scripts, sitecode, publieke HTML, JSON-data, registerstatussen, sitemap, robots, canonicals, .vercelignore of publicatiecriteria gewijzigd. Geen artikelrun, sitecheckautomation of herstelactie gestart. Geen commit, push, deployment, publicatie, domeinkoppeling of formulieractivering uitgevoerd. Geen mail verstuurd of conceptmail gemaakt.

Geen live HTTP-, browser-, mobiele-, console-, visuele-, FAQ-, avondmodus-, provider-, formulier-, Gmail- of schedulerlogcheck uitgevoerd. Geen nieuwe medische verificatie, volledige bronhercontrole of bewijs van ontvangersbezorging geleverd. Eerdere run- en mailuitkomsten zijn alleen gelezen als memoryverslagen en niet opnieuw extern geverifieerd.

Binnen de repository is alleen dit maandrapport geschreven. Buiten de repository is uitsluitend de verplichte APK-runmemory aangevuld; geen algemene projectmemories aangepast.
