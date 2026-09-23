# Wekelijkse hoofdredactie-sitecheck — 23 september 2026

Lokale kwaliteitscontrole, met gerichte live-HTTP- en Search Console-controle. Geen publicatie, e-mail, conceptmail, formulierverzending of medische goedkeuring uitgevoerd.

## Prioriteiten

- **Kritiek:** geen nieuwe acute medische veiligheidsfout vastgesteld binnen de beschreven scope. Dit is geen volledige medische factcheck.
- **Belangrijk:** 17 links op drie publieke behandelpagina's verwijzen naar niet-vrijgegeven conceptpagina's; drie doelbestemmingen zijn live als 404 bevestigd. Herstel voorbereiden binnen de bestaande conceptgrens. Daarnaast: zes behandelcheckmeldingen door achterlopende inventaris en een dubbele sitemapregel voor Freiberg. Zeven bestaande registerreviews en twee versieverschillen blijven open; niet als nieuw medisch akkoord behandelen.
- **Later:** Google-herverwerking volgen; query-paginatoewijzing voor professionals en Bing controleren. Actuele beheerserver op de gebruikelijke poort herstarten om de dashboardreparatie te laden. Bestaande beeldbank-, nieuwsbriefketen- en conceptreviewtaken blijven afzonderlijk; geen dubbele taken toegevoegd.

## Ter kennisname

Google toont 20 geïndexeerde pagina’s; enkelartrose, enkelprothese en de klachtenhub zijn geïndexeerd. De sitemap is vandaag succesvol gelezen. De vijf oude Google-404’s leiden nu correct door. Vercel toont voor 16–23 september 69 bezoekers, 272 paginaweergaven en 43% bounce; 88% kwam uit Nederland en 50% gebruikte desktop. Google Search Console toont over 25 augustus–21 september de meeste klikken voor de homepage (45) en daarna enkelprothese (6). De behandelingenhub kreeg 125 vertoningen tegenover 26 in de vergelijkingsweek, maar 1 klik. De actuele uitsplitsingen en brongebonden dashboardtip zijn lokaal zichtbaar op poort 8880. Dit voegt geen cookies, tracking of cookiebanner toe. De vaste poort 8879 serveert nog oude code en vraagt een normale herstart. Negen ideeën onbeoordeeld; niets toegevoegd.

## Aanvulling: bezoekersinzichten — 23 september 2026

De bestaande Vercel Web Analytics-weergave is handmatig gecontroleerd op Production, Last 7 Days. Er waren 69 bezoekers, 272 paginaweergaven en een bouncepercentage van 43%. De bezoekersuitsplitsingen tonen 88% Nederland, desktop 50%, mobiel 47%, tablet 3%; als herkende verwijzers staan google.com (31) en google.nl (1). Browser- en besturingssysteemverdeling, plus beschikbare toppagina’s, staan in de brongebonden lokale opname en het aanvullende verslag [analytics-extra-insights-2026-09-23.md](analytics-extra-insights-2026-09-23.md). Percentages zijn afgerond; verwijzers verklaren niet noodzakelijk al het verkeer. Dit identificeert geen individuele bezoekers en meet eigenaarbezoeken niet apart.

Het lokale dashboard rendert deze gegevens correct op `http://127.0.0.1:8880/#bezoekers`; de bestaande server op 8879 serveert nog de eerdere moduleversie. Bestaande taak `work-admin-server-restart` blijft open: sluit de oude server normaal af en start `Start beheer.command` opnieuw om de vaste route bij te werken. Geen accountplan, tracking, cookies, publieke code of privacytekst aangepast. Vercel documenteert Web Analytics als cookie-vrij en geaggregeerd ([Vercel](https://vercel.com/docs/analytics)); de AP maakt onderscheid tussen beperkte analytics en trackingcookies ([AP](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/cookies)). Voor de huidige onveranderde inrichting is geen cookiebanner nodig; bij een andere meetmethode moet privacy/toestemming opnieuw worden beoordeeld. Events zijn in de getoonde Vercel-accountweergave Pro-afgeschermd; niet ingeschakeld.

## Aanvulling: Google-paginaresultaten en overzichtstip

Na de eerdere indexeringscontrole is de ingelogde Search Console-property opnieuw geopend en zijn de performanceperioden en volledige paginatabel zichtbaar gecontroleerd. In 25 augustus–21 september 2026: homepage 45 klikken (770 vertoningen), enkelprothese 6 (140), behandelingenhub 2 (168), over-mij 2 (48), cohortartikel 2 (11), artikel knieprothese/bariatrische chirurgie 1 (17), publicaties 1 (9), enkelartrose 0 (81). Propertytotaal is 58 klikken en circa 1,18K vertoningen; individuele zichtbare URL-rijen kunnen door Google-rapportagegedrag niet zonder meer optellen tot het totaal.

De Google-dashboardaanbeveling licht de behandelingenhub uit: 125 vertoningen tegenover 26 in de voorgaande week, 1 klik, CTR 0,8%, gemiddelde positie 31,3. De lokale startpagina toont dit naast de afzonderlijke Vercel- en Search Console-perioden als controlehint: bekijk zoekintentie en zichtbare snippet, wijzig medische tekst niet automatisch. Er zijn negen nieuwe ideeën in Frisse blik; het bestaande bewaarde idee ‘Meten of de website bezoekers verder helpt’ wordt gelinkt. Geen nieuw idee of werktaak toegevoegd. Zie [de Search Console-controle](search-console-2026-09-23.md) voor bronperioden.

## Basis en scope

Laatste aantoonbaar uitgevoerde inhoudelijke weekverslag: 9 september 2026. Voor het geplande moment 16 september is geen verslag aangetroffen; een scheduler-tijdstip is geen controleresultaat. Een exacte basiscommit voor de weekcheck van 9 september is niet vastgelegd. Vergelijking aangevuld met technische release 12 september (`66201d3`), website-release 13 september (`0b01f4a`), Search Console-verslagen 12/13/19 september, Git-historie vanaf 9 september en actuele bronnen. Huidige HEAD `583a67263cf289b3a49fe23e277ab56e2d5335e3`.

Bij start bestonden wijzigingen aan advies-consultancy.html, professionals.html, styles.css en vier designsysteembestanden. Deze zijn gelezen en behouden; deze run heeft ze niet aangepast. Toetsing betrof drie doelgroepsporen, recente publicaties en hun verwijzingen, contact, metadata, conceptgrens, browserweergave en lokaal beheer.

## Wijzigingen en samenhang

| Aanleiding | Gecontroleerde bronnen/routes | Bevinding en vervolg |
| --- | --- | --- |
| Recente behandelreleases | Git-releasecommits 19–21 september, register, sitemap, .vercelignore, index.html, behandelingen.html en Achilles/hamerteen/Freiberg | Publieke bronpagina's geven live 200. 17 links gaan naar concepten: 10 bij Achilles, 4 bij hamerteen, 3 bij Freiberg. Technische validator vangt dit al; geen extra routine nodig. Bestaande work-concept-protection heropend voor de nieuwe uitgaande links, eerdere afscherming blijft als historisch afgerond vermeld. |
| Nieuwe publieke status versus inventaris | FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md, tools/check_treatment_page_quality.py, register en robots van hallux valgus, hamerteen, Freiberg en Achilles | Inventaris noemt concept/medisch akkoord terwijl robots publiek zijn. Daardoor vier onterechte noindexverwachtingen en twee eisen aan concept-pijnwijzersecties. Niet oplossen door indexering of medische status te veranderen; bronstatus eerst gelijk trekken met vastgelegde besluiten. |
| Sitemapgroei | sitemap.xml, register, SEO-check, Google-sitemaprapport | 49 URL-regels, 48 unieke publieke pagina's; Freiberg dubbel. Geen sitemap aangepast in deze run. Samen met inventaris opvolgen in work-treatment-release-consistency. |
| Contactformulier als algemene route | Sitebrede zoekactie naar mailto, data-professional-email, mailhandlers, per e-mail/e-mailroute; index, advies, professionals, project- en artikelpagina's, privacy, script.js/content.js | Advies-contactlink werkelijk aangeklikt: index.html#contact. Uitleg sluit persoonlijk advies, afspraken, spoed en lopende zorg uit; officiële ETZ/Doctolib/ZorgDomein-routes blijven zichtbaar. Geen actief data-professional-email-attribuut in reguliere HTML. Oude handler in script.js is ongebruikt. Bewuste uitzondering: privacy.html heeft een mailto voor privacyrechten. Nieuwsbriefverwijzingen ‘per e-mail’ zijn geen algemene contactuitnodiging. Geen bericht ingestuurd. |
| Nieuwe samenwerkings- en adviesinhoud | professionals.html, advies-consultancy.html, relevante projectverwijzingen, metadata en bestaande registerstatus | Drie sporen herkenbaar gescheiden. Schoenmakersspreekuur en FOOTprint op locatie zijn eigenaargebonden inhoud en blijven onder de bestaande review_nodig; geen nieuwe expertise/claim door deze run toegevoegd. |
| Gesloten oproep en centrale FAQ | patientpanelartikel, content.js, data/faqs.json, data/faq-placements.json en generatiecheck | Geen technische FAQ-drift; het gesloten oproepartikel is niet als nieuwe oproep behandeld. Geen nieuwe volledige medische bronverificatie. |
| www-release en Google | Technisch releaseverslag 12 september, actuele canonicals, Search Console 23 september | www-keuze is al vrijgegeven; oude apex-canonical in Google betreft crawl van 12 september. CURRENT_SITE_STATE corrigeert het verouderde ‘hostbesluit open’. Geen hostwijziging. |
| Dashboardroute en Frisse blik | Opgeslagen automation.toml read-only, actuele prompt, ideas.read_ideas, taken en terugblik | Dashboardopdracht en geen-mailgrens staan opgeslagen en zijn in deze run gebruikt. work-weekly-dashboard-routing afgerond op basis van readback; geen routine gewijzigd. Negen new-ideeën, keuzes leesbaar. Catalogus en keuzes ongewijzigd; bestaande agent-, skill- en afschaalvoorstellen blijven beschikbaar. |

### Concrete conceptlinks

- Achilles: Haglund/retrocalcaneaire klachten, posterieur enkelimpingement, os trigonum, hielpijn, peesplaatklachten/hielspoor en stressreactie/-fractuur (sommige zowel tekst als kaart).
- Hamerteen: Morton-neuroom, plantaire plaat, tailor's bunion en voorvoetcorrectie.
- Freiberg: plantaire plaat (tweemaal) en stressreactie/-fractuur.

Rechtstreeks live gecontroleerd: Haglund, plantaire plaat en Morton geven 404; Achilles bevat de Haglund-link ook in live-HTML. Overige doel-URL's zijn als concept vastgesteld, niet allemaal afzonderlijk live opgevraagd. Lokale bestanden bestaan, dus een gewone bestandslinkcheck mist dit probleem. Herstel vraagt geen publicatie van de concepten: behoud uitleg, verwijder uitsluitend de klikmogelijkheid of gebruik een inhoudelijk passende bestaande publieke route. De exacte publieke correctie en release blijven open in de taak; register en medische tekst zijn hier behouden.

## Uitgevoerde controles

| Controle | Uitkomst |
| --- | --- |
| check_site_quality.py | Niet geslaagd: 17 public_link_to_concept, geen andere gemelde issues; 81 HTML-bestanden |
| check_navigation_contract.py | Dezelfde 17 conceptlinks, geen afzonderlijke 17 extra fouten |
| check_publication_verification.py | 103 HTML, 48 publiek, 41 geverifieerd, 7 review_nodig, 55 buiten scope; twee changed_since_verification voor advies/professionals |
| check_seo_basics.py | Geslaagd; 49 sitemapregels |
| check_foot_pain_guide.py | Geslaagd; mapping niet gewijzigd |
| check_treatment_page_quality.py | Niet geslaagd: 4 noindexverwachtingen en 2 conceptsectie-eisen door inventarisverschil |
| generate_faqs.py --check | Geslaagd |
| check_faqs.py | Geslaagd: 270 records, 37 pagina's, 271 plaatsingen |
| design_system.py --check | Geslaagd vóór en na dashboardwijziging |
| Extra HTML-parser | 81 reguliere HTML, 147 JSON-LD-blokken; geen ontbrekende lokale href/src-bestanden, ontbrekende lokale anchors of JSON-parsefouten |
| Lokale beheertests | 70 tests geslaagd, inclusief drie nieuwe tests voor Google-status, extra uitsluitingsredenen, oude opnamen en ongeldige totalen; uitsluitend tijdelijke testopslag |
| git diff --check | Geslaagd |
| check_deployment_boundary.py | Afgebroken na langdurig wachten in git check-ignore; exit 130, geen inhoudelijk resultaat. Niet als geslaagd beschouwd. Gerichte live- en broncontrole wel uitgevoerd. |

Geen package.json; geen npm-checks beschikbaar. De zeven bestaande review_nodig-pagina's zijn advies-consultancy.html, professionals.html, behandelingen.html, nieuwsbrief.html, artikelen/kuitspier-en-voetpijn.html, behandelingen/hallux-valgus.html en behandelingen/ziekte-van-freiberg.html. Reviewstatus is geen bewijs van ontbrekende Google-indexering.

## Browser, toegankelijkheid en vormtaal

Echte lokale browser op homepage, professionals, advies, behandelhub, Achilles, hamerteen en Freiberg bij 360×844, 390×844 en 430×844: 21 metingen, geen horizontale overloop, steeds één H1/main, geen defecte reeds geladen afbeeldingen. Console bevatte geen waarschuwingen of fouten. Lazy beelden zijn niet allemaal door scrollen geladen; bronbestanden zijn aanvullend statisch gecontroleerd.

Visuele steekproef homepage en professionals mobiel; open menu op 390 px volledig in beeld en actieve pagina herkenbaar. Escape sluit menu. Professionals donker thema visueel bekeken en daarna licht hersteld. Advies → contactformulier aangeklikt en bestemming plus gelabelde velden/veiligheidstekst in DOM gecontroleerd. Geen volledige WCAG-audit, volledige toetsenbordronde of alle pagina's in alle thema's. Tijdelijke viewport hersteld.

Dashboard: wijziging betreft bestaande tekstweergave, geen CSS/lay-outwijziging. design_system --impact local-admin/ui/app.js heeft geen catalogusmatch; handmatig vastgesteld dat alleen de bestaande Google-component op Overzicht en Bezoekers afnemer is. Lokale beheer-UI blijft buiten publieke stijlgids/deployment, beschreven in README. Browserreadback op 8879 bevestigt de actuele terugblik, kennisgeving met afzonderlijk Bekeken-vakje en Google-opname. Op Bezoekers bij 360/390/430 px geen overloop of consolemeldingen.

## Google Search Console

Echte accountcontrole afgerond. Zie search-console-2026-09-23.md voor rapportdata, alle drie URL-inspecties, ProfilePage, 404-readback en gelijke 28-dagenvergelijking. Opname atomisch bijgewerkt: 20 geïndexeerd, 40 niet geïndexeerd, 49 ontdekt; sitemap vandaag gelezen. Klikken 58 tegenover 15 in de voorgaande gelijke periode; geen oorzakelijke claim over een specifieke wijziging. De vijf oude Google-404's geven nu passende redirects en HTTP 200. Bestaande validatie loopt sinds 21 september; geen nieuwe aanvragen gedaan.

## Wijzigingen in deze run

- local-admin/search_console.py: waargenomen Succesvol-status accepteren, twee aanvullende uitsluitingsredenen valideren, totaalsom bewaken; oudere opnamen blijven bruikbaar.
- local-admin/ui/app.js: dezelfde Google-component toont alleen werkelijk aanwezige aanvullende redenen.
- local-admin/test_search_console.py: regressietests voor de nieuwe waarnemingen en afwijzen van ongeldige totalen/typen/statussen.
- local-admin/state/search-console.json: nieuwe echte momentopname, buiten Git.
- local-admin/README.md en docs/site/CURRENT_SITE_STATE.md: onderhoudsuitleg, actuele tellingen en reeds afgeronde hostkeuze gecorrigeerd.
- Twee gedateerde verslagen, wekelijkse terugblik en gerichte werktaken bijgewerkt. Andere routinesamenvattingen en persoonlijke lees-/ideekeuzes behouden.

## Grenzen, besluitvorming en open controles

Bestaande ADR-0004/0005/0006 en ADR-0014 dekken SEO-controle, medische grenzen en lokaal dashboardonderhoud. Geen nieuwe structuur of ADR nodig; geen ADR-status gewijzigd. Geen medische claims, publieke HTML/CSS/JS, sitemap, robots, .vercelignore of PUBLICATIE_REGISTER aangepast. Bestaande gebruikerswijzigingen blijven behouden.

Publicatiestatus: uitsluitend lokale beheer-/documentatieverbeteringen; niets gepubliceerd. Owner validation blijft open voor bestaande inhoudelijke reviews en eventuele publieke correcties. Nieuwe medische bronactualiteit, volledige live-assets/deploymentvergelijking, volledige WCAG, nieuwsbriefketen, Bing en alle 29 niet-geïndexeerde URL's afzonderlijk niet onderzocht.

De bestaande beheerserver op 8878 houdt de oude Python-module in geheugen. Herstartpoging is door OS-procesrechten geweigerd (operation not permitted); geen verdere procesingreep. De bijgewerkte server is gestart op http://127.0.0.1:8879/ met dezelfde bestaande opslag. Voor de vaste poort later de eigen beheerserver normaal sluiten en opnieuw openen; geen databewerking vereist.

## Dashboardreadback

De echte inventaris toont een actuele brongebonden wekelijkse terugblik, één kennisgeving, unieke taak-IDs en geen onleesbare werkcatalogus. Gewijzigde taken hebben evidence_changed=false; alleen de bewezen routineprompt-taak is afgerond. De generieke verslagtaak wordt door concrete vervolgacties vervangen. Bekeken-markeringen en persoonlijke ideekeuzes zijn niet gewijzigd. Browser op 8879 toont dezelfde uitkomst; de vaste server op 8878 vereist nog de beschreven herstart.

Afgerond: 2026-09-23 19:44 CEST
