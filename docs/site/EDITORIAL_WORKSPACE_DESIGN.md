# Ontwerp voor een redactieomgeving

Datum: 2026-09-09

Status: lokale pilot onder [ADR-0014](../decisions/ADR-0014-editorial-workspace.md), door Matthijs geaccepteerd op 9 september 2026 met “ja akkoord” en “akkoord met werkpakket”. Publieke activering en gedeelde toegang zijn niet vrijgegeven.

De lokale pilot is gebouwd en gecontroleerd op 10 september 2026. Zie het [controleverslag](reviews/editorial-workspace-pilot-2026-09-10.md) voor de 29 geslaagde tests, browserroutes, mobiele controle, schone werkdatabase en nog niet ingerichte vervolgstappen. De eerdere demonstratie en het bredere toekomstontwerp worden hieronder afzonderlijk beschreven.

## Doel

Artikelen en projectupdates gemakkelijk voorbereiden, bekijken en beoordelen binnen de bestaande website van Matthijs van Dam. De beheeromgeving helpt bij het redactionele werk; de bestaande persoonlijke uitstraling, medische verantwoordelijkheid en publicatieafspraken blijven leidend.

Het ROETZ-beheer is inspiratie voor de overzichtelijke collectie- en formulierweergave. De MVD-omgeving krijgt een echte voorvertoning in de bestaande sitevormgeving, een duidelijke vergelijking van wijzigingen en een afzonderlijk akkoordmoment voor Matthijs.

## Wat er nu is

| Onderdeel | Huidige status |
| --- | --- |
| Bestaande MVD-website | Statische HTML/CSS/JS; ongewijzigd door deze ontwerpstap |
| Dit document en ADR-0014 | Lokale pilotscope inclusief dashboard geaccepteerd door Matthijs |
| Demonstratie in de conversatie | Geïsoleerd interactief scherm; titel, inleiding, drie tekstsecties, afbeelding-alttekst en kaartomschrijving tijdelijk bewerkbaar |
| Vergelijken en beoordelen in de demonstratie | Vergelijking per veld; goedkeuren, terugsturen en akkoord laten vervallen zijn uitsluitend simulaties |
| Preview in de demonstratie | Artikelinhoud en stijl worden benaderd; navigatie, gerelateerde kaarten en interne tekstlinks zijn geen exacte volledige paginaweergave; geen SEO-rendering |
| Afbeelding kiezen of nieuw artikel maken | Niet gebouwd |
| Opslaan voor later | Lokale Python/SQLite-backend in `local-admin/`; revisies, actielog, conflicten en herstel als nieuwe versie |
| Opslaan voor collega's | Gedeelde toegang en echte afzonderlijke accounts nog niet ingericht |
| Accounts, rollen en beveiligde preview | Niet ingericht of getest voor MVD |
| Paginageneratie vanuit nieuwe artikelbron | Geïsoleerde kopie van één bestaand artikel; bestaande template en kaart behouden; publieke bron niet overgezet |
| Goedkeuren vanuit beheer | Versiegebonden registratie binnen de lokale eigenaarsomgeving; geen akkoord namens Matthijs bij technische tests |
| Publiceren vanuit beheer | Alleen een lokaal pakket voorbereiden; geen livegangfunctie |
| Dashboard en taken | Register, bestanden en launch-inventaris worden opnieuw gelezen; leesmarkering vervalt bij bronwijziging |
| Agents & routines | Vier bestaande routineconfiguraties, verslagbewijs en gedateerde Codex-taakmomentopname; geen start/pauze- of monitorfunctie |
| Bezoekers | Gecontroleerde Vercel-momentopname en toegang naar actuele statistieken; geen automatische API-koppeling |

De eerdere [lokale demonstratie](/Users/matthijsvandam/.codex/visualizations/2026/09/09/01a08459-21f4-7713-9789-4ee18917da6b/redactie-ontwerp.html) blijft een los ontwerp zonder blijvende opslag. De nieuwe, werkelijk werkende lokale pilot staat in [`local-admin/`](../../local-admin/README.md). Die heeft een eigen server en duurzame lokale opslag; alleen het oude demonstratiescherm verliest zijn tijdelijke invoer bij sluiten of herladen.

## Dashboard in de lokale pilot

- **Overzicht:** open werk, artikelrevisies en routines; aantallen worden uit ingelezen gegevens berekend.
- **Artikelen:** de gecontroleerde Leonie-artikelkopie bewerken, opslaan, bekijken, vergelijken, beoordelen en herstellen. Titel, inleiding, bestaande tekstblokken, afbeeldingstekst en afzonderlijke kaart-/zoek-/deelteksten zijn bewerkbaar. Nieuwe templates en extra tekstblokken zijn nog geen onderdeel van de importer.
- **Publicatie en werkversie:** sinds 10 september staan deze afzonderlijk op de artikelkaart en in de editor. De bestaande publicatie wordt uit de actuele sitebestanden en het register afgeleid, met een uitleg van die bewijsbasis. Een ongewijzigde import van een gepubliceerd artikel heet geen nieuw concept en vraagt niet opnieuw om beoordeling. Lokale wijzigingen, onopgeslagen invoer en een noodzakelijke bronvergelijking hebben elk een eigen aanduiding. Herstel naar dezelfde inhoud geldt als ongewijzigd, ook bij een hoger revisienummer. Dit is een verduidelijking binnen ADR-0014; opgeslagen workflowstatussen en publicatiepoorten blijven intact.
- **Nog te doen:** de 30 conceptpagina's met expliciete medische-reviewstatus, twee pagina's waarvan de status eerst moet worden vastgesteld en afzonderlijke overige aandachtspunten. De vier gepubliceerde behandelpagina's zijn al geverifieerd volgens het register. Lisfranc blijft afzonderlijk geparkeerd. Een leesmarkering is geen medische verificatie.
- **Agents & routines:** weekcheck op woensdag 19:30; artikelroutine om de twee weken op zondag 19:30; APK op de eerste maandag om 20:00; bewaartermijncontrole op de eerste dag van de maand om 09:00. Dit zijn de aangetroffen lokale planningen, geen bewezen volgende uitvoering. De bestanden hebben geen expliciet tijdzoneveld; de weergave volgt Europe/Amsterdam. Sinds 10 september staat per routine ook een korte, brongebonden terugblik met gedaan/uitkomst/vervolg; het startdashboard toont één samenvattende regel. Een nieuwe of gewijzigde verslagbron trekt de oude samenvatting in. De bewaartermijnroutine heeft nog geen gevonden uitvoeringsverslag. Leesversies van de weekcheck en APK laten correspondentiegegevens weg.
- **Bezoekers:** de ingelogde Vercel-weergave toonde op 9 september 2026 36 bezoekers en 94 paginaweergaven bij Production / Last 7 Days (2 september 22:00 tot 9 september 22:59). De zeven zichtbare toppagina's zijn overgenomen. De gedateerde opname ververst niet automatisch; per-paginabezoekers zijn niet optelbaar tot unieke sitebezoekers.
- **Frisse blik:** op 10 september vroeg Matthijs expliciet om een adviesblok met ideeën vanuit uiteenlopende perspectieven, inclusief geavanceerde hulpmiddelen, bezoekersanalyse en advertentieruimte. De lokale uitbreiding toont een gedateerde, door Codex samengestelde verzameling, met één voorstel op het startdashboard en een apart ideeënarchief. Bewaren, afwijzen en omzetten naar een onderzoekstaak zijn lokale keuzes met versiecontrole. Een voorstel is geen uitvoering, aangetoonde marktvraag of publieke beleidswijziging. Deze uitbreiding valt onder het lokale dashboard van ADR-0014; activering van tracking, AI-diensten, advertentieruimte of gewijzigde publieke routes is hiermee niet uitgevoerd.

De lokale omgeving maakt geen accounts aan, wijzigt geen automation en start geen externe agent. Browser en Codex gebruiken dezelfde lokale revisiebron. Conceptpagina's en private gegevens worden alleen achter de lokale sessie gelezen. De volledige beheermap is uitgesloten van deployment.

## Controle van het ontwerp op 9 september 2026

- In de browser bevestigd: een titelwijziging verschijnt direct in de paginavoorvertoning; de vergelijking toont oud en nieuw per gewijzigd veld.
- De voorbeeldroute doorlopen: bewaren/aanbieden, goedkeuren, wijzigen na akkoord (akkoord vervalt) en terugsturen met toelichting. Dit test uitsluitend de tijdelijke demonstratie, geen echte bevoegdheden of opslag.
- Bewerken bekeken op 390 px; paginavoorbeeld op 360 px; vergelijking op 430 px. Op 360 en 430 px geen horizontale overloop gevonden. Het artikeloverzicht is op 736 en 360 px bekeken; de lichte desktopweergave op 1024 px.
- Lichte en donkere vormgeving visueel bekeken. De bezochte voorbeeldschermen gaven geen browserwaarschuwingen of -fouten.
- JavaScript-syntaxis en whitespace gecontroleerd. Het zelfstandige fragment is circa 153 kB inclusief een verkleinde kopie van het bestaande beeld; het bevat geen externe opslag- of netwerkcode.
- Geen publieke HTML, artikelbron, metadata, register, sitemap of deploymentinstelling gewijzigd door deze ontwerpstap. Alleen dit ontwerpdocument, het voorgestelde ADR en de ADR-index zijn in de repository aangepast. De demonstratie staat buiten de websiteprojectmap.
- De productie-sitechecks zijn niet opnieuw uitgevoerd: de wijzigingen zijn documentatie en een afzonderlijk schermontwerp. Er is geen `package.json` voor npm-checks in de huidige site.

## Eerste scope

De eerste bruikbare versie richt zich op **artikelen en nieuwsberichten**, waaronder projectupdates in artikelvorm. De lokale technische pilot begint met een geïsoleerde kopie van één bestaande pagina om broninvoer, renderer, voorvertoning, vergelijking en publicatievoorwaarden te testen. De bestaande publicatiebron blijft daarbij leidend voor de publieke website.

Daarna kunnen volledige projectpagina's en publicaties worden overwogen. FAQ-beheer is een latere uitbreiding die de huidige centrale FAQ-bron respecteert. Behandelpagina's, pijnwijzer, hoofdnavigatie, contact, nieuwsbrief en vrije pagina-indeling vallen buiten de pilot.

## De schermen

Hieronder staat het bredere ontwerp. De werkende lokale scope en de beperkingen staan hierboven en in `local-admin/README.md`.

### Overzicht

Een rustige lijst met titel, inhoudstype, laatst gewijzigde datum, verantwoordelijke redacteur en revisiestatus. Filters: alle artikelen, mijn concepten en ter beoordeling. De publieke versie en een lopende revisie worden apart herkenbaar getoond, bijvoorbeeld: “Gepubliceerd · nieuwe versie ter beoordeling”.

### Bewerken en bekijken

Links staan herkenbare redactionele velden. Rechts staat de voorvertoning van de volledige pagina, met een schakelaar voor een smalle en brede weergave.

Voorgestelde velden:

- Titel, inleiding en hoofdtekst met tussenkoppen.
- Afbeelding, alternatieve tekst en eventueel onderschrift/bron.
- Auteur, datum, doelgroep, thema en eventueel gekoppeld project.
- Bronnen en relevante interne links.
- Afzonderlijke kaarttitel, kaartomschrijving of zoekomschrijving wanneer de redactie bewust een andere tekst wil gebruiken.

Technische waarden zoals canonical, robots, scriptcode, registerstatus en deploymentinstellingen zijn geen vrije redacteurvelden. De invoer biedt alleen ondersteunde tekstopmaak en links; willekeurige scripts of pagina-HTML horen niet bij het bronmodel.

Afwijkende kaart- of metadatateksten krijgen een duidelijke aanduiding van hun bestemming. Een hoofdtekstwijziging mag zo'n bewuste redactionele variant niet ongemerkt aanpassen. De voorvertoning toont naast de pagina ook de kaart en relevante titel/omschrijving, zodat het bereik van een wijziging zichtbaar is.

### Beoordelen

De beoordelaar ziet welke versie is aangeboden, wat is gewijzigd ten opzichte van de huidige publieke versie of vorige beoordeelde versie, waar de inhoud verschijnt en welke controles klaarstaan of aandacht vragen. Inhoudelijke aandachtspunten blijven onderscheiden van technische fouten.

Beschikbare beslissingen voor Matthijs: terugsturen met toelichting of deze exacte versie voor publicatie goedkeuren. De interface mag een redacteur geen eigenaarakkoord laten vastleggen via een zelf in te vullen checkbox of naamveld.

### Publicatiestatus

Voorgestelde werkvolgorde:

`Concept → Ter beoordeling → Goedgekeurd voor publicatie → Gepubliceerd`

Dit zijn revisie-/proceslabels. De bestaande waarden en betekenis van `PUBLICATIE_REGISTER.json` blijven intact. “Gepubliceerd” verschijnt pas nadat de goedgekeurde uitvoer daadwerkelijk is vrijgegeven en de publieke versie is gecontroleerd. Een geslaagde opslag, een preview of een goedkeuring alleen is daarvoor onvoldoende.

Bij wijziging na goedkeuring moet opnieuw worden beoordeeld. De oude publieke versie blijft tijdens het voorbereiden en beoordelen van een revisie beschikbaar.

## Inhoud en techniek achter de schermen

Acceptatie van ADR-0014 autoriseert het kiezen en lokaal uitwerken van één onderhoudbare bron voor de artikelenpilot, met een stabiel artikel-ID en behoud van de bestaande URL. Uit de artikelkopie in de proef volgen detailpagina, kaartgegevens en metadata. Expliciete redactionele varianten staan in diezelfde bron. Gegenereerde HTML is uitvoer; losse wijzigingen daarin worden niet daarnaast als tweede waarheid onderhouden.

De bestaande site laat zien waarom die koppeling nodig is: `content.js` bevat kaartgegevens, terwijl `artikelen/*.html` de volledige tekst en metadata bevat. De migratie moet beide vergelijken en bewust overnemen. FAQ's blijven in `data/faqs.json` en `data/faq-placements.json` en worden alleen via hun vaste IDs/plaatsingen gekoppeld.

De technische proef moet aantonen dat de bestaande URL, zichtbare tekst, afbeeldingen, interne links, metadata, kaartplaatsingen en vormgeving bij omzetting van de artikelkopie behouden blijven. Codex mag bronformaat, renderer en tests binnen de geaccepteerde pilotscope uitwerken en corrigeren. De proefresultaten en eventuele verschillen worden concreet voorgelegd voordat de nieuwe bron voor werkelijk gepubliceerde inhoud leidend wordt. Tot dat besluit blijft de bestaande inhoud via de huidige werkwijze onderhouden.

## Samenwerken en goedkeuren

- Elke opgeslagen wijziging vermeldt auteur, tijdstip, basisversie en nieuwe versie.
- Bij een verouderde basisversie verschijnt een vergelijking; geen stille overschrijving van andermans werk.
- Matthijs' goedkeuring verwijst naar de exacte bronversie én de gecontroleerde uitvoer en relevante afhankelijkheden, zoals afbeeldingen, FAQ-records en templates.
- Een wijziging aan die invoer maakt het akkoord ongeldig voor nieuw gegenereerde uitvoer. Alleen identieke, controleerbare invoer en uitvoer kunnen dezelfde goedkeuring behouden.
- Goedkeuring en het recht om te publiceren worden buiten de gewone inhoudsvelden afgedwongen en geregistreerd.
- Herstel van een oudere versie maakt een nieuwe, beoordeelde bronwijziging. Ook die doorloopt actuele controles en expliciete vrijgave.

Matthijs is inhoudelijk eigenaar. Een redacteur mag toegewezen inhoud voorbereiden en aanbieden. De publicatie-uitvoerder mag alleen de goedgekeurde versie vrijgeven en kan geen medisch akkoord namens Matthijs verlenen. In de eerste pilot kan Matthijs beide laatste rollen vervullen.

## Toegang en oplossingskeuze

Decap CMS is een mogelijke editor. Er is nog geen productkeuze, account, hostingwissel of nieuwe dienst voor MVD vastgelegd. Eerst moet worden onderzocht hoe dit aansluit op de bestaande repository en hosting.

Een beheerinterface alleen bewijst geen beperkte schrijfrechten. Met name bij een GitHub-backend moeten directe repository-/API-rechten en branchregels worden meegenomen. Als iemand via Git of een API alsnog andermans pagina, een goedkeuringsrecord of de publicatieroute kan wijzigen, is een verborgen veld of collectie in het scherm onvoldoende.

Test de beoogde rechten met afzonderlijke echte accounts: eigen inhoud bewerken, niet-toegewezen inhoud proberen te wijzigen, goedkeuring proberen te vervalsen, direct publiceren proberen en toegang intrekken. Productdocumentatie en de werkelijke accountconfiguratie bepalen wat haalbaar is; gewenste rollen worden niet als bestaande eigenschap aangenomen.

Een toekomstige preview van ongepubliceerde inhoud moet beschermd zijn met daadwerkelijke toegangscontrole, inclusief de bijbehorende gegevens en assets. Alleen `noindex`, geen navigatielink of een onbekende URL volstaat niet. De huidige demonstratie is geen bewijs van zo'n previewdienst.

## Bestaande kwaliteitsroute

Leidend blijven `REDACTIEKOMPAS.md`, `CODEX_WERKWIJZE.md`, `docs/site/PAGE_MODELS.md`, `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`, `docs/site/INVARIANTS.md`, `docs/site/FAQ_CONTENT_MODEL.md` en ADR-0004, ADR-0005, ADR-0006 en ADR-0007.

Bij de technische proef en latere relevante releases horen:

- De bestaande site-, publicatie- en SEO-checks.
- FAQ-generatorcontrole en FAQ-validatie wanneer FAQ-bronnen of plaatsingen worden geraakt.
- Controle van interne links, afbeeldingen, metadata, kaartplaatsingen en de uiteindelijke pagina.
- Mobiele controle rond 360, 390 en 430 px en controle van toetsenbordbediening.
- Een aantoonbaar geldige goedkeuring voor de aangeboden releaseversie.

Er is in de huidige site geen `package.json`; verzin geen bestaande npm-build- of lintstap. Als later nieuwe beheeronderdelen eigen controles krijgen, worden die apart van de huidige sitechecks beschreven.

`docs/site/ARTICLE_EDITORIAL_PROFILE.md` en de redactionele leerlus blijven van toepassing. Lees vóór nieuwe volledige conceptartikelen het profiel, de vereiste vier volledig geredigeerde leerdossiers en twee passende gepubliceerde voorbeelden. Leg de eerste volledige conceptversie onmiddellijk vast met de bestaande `editorial_learning.py start`-route. Bewerk daarna alleen het reguliere concept; `first-concept.md` blijft onaangeroerd. Definitieve leerversies volgen via de bestaande finalize-route na expliciet eigenaarakkoord. Import van een oud artikel creëert geen verzonnen historisch eerste concept. De leerdossiers blijven buiten publieke uitvoer en buiten gewone redacteurstoegang.

## Vervolg na de geaccepteerde lokale pilot

1. Matthijs heeft het schermconcept, ADR-0014 en het uitgebreide werkpakket geaccepteerd. Dit besluit is vastgelegd; de status is `Accepted`.
2. De lokale technische pilot wordt uitgevoerd en gecontroleerd: bronformaat, renderer, opslag, vergelijking, akkoordregistratie, conflict-/herstelroute en dashboard. Gewone correcties en verdere gecontroleerde artikelimports binnen deze lokale scope vragen geen nieuw architectuurbesluit.
3. Leg de resultaten voor, samen met de concrete inrichting die voor echte accounts, gedeelde toegang, besloten preview en publicatie nodig is. Nieuwe externe accounts, gewijzigde toegangsrechten en eventuele kosten vragen een afzonderlijk besluit. Een lokale simulatie geldt niet als bewijs van echte meergebruikersbeveiliging; na geautoriseerde inrichting volgen de accounttests.
4. Leg het daadwerkelijk overzetten van de publicatiebron en de publieke activering als concrete, beoordeelbare stappen voor. De bestaande goedgekeurde publieke versie blijft beschikbaar totdat die overgang expliciet is vrijgegeven.

De lokale pilot maakt de nieuwe bron nog niet leidend voor de publieke site, maakt geen externe account aan en publiceert niets. Verdere werkzaamheden binnen de geaccepteerde lokale scope kunnen zonder aanvullende tussenpoorten worden uitgevoerd.

## Uitbreiding werklijst op 10 september 2026

Op verzoek van Matthijs omvat **Nog te doen** ook contact, nieuwsbrief, bestaande artikelconcepten en technische vervolgstappen. De broninventaris bevat 19 aanvullende werkpunten: 18 open en de oorspronkelijke contactlivegang als afgerond. Samen met de bestaande medische leeslijst staan er 56 punten, waarvan 50 open. Twee algemene verslagtaken zijn vervangen door de bijbehorende concrete vervolgacties.

Vier categorieën, voortgangsfilters, zoeken en een ingeklapte lijst met aandoeningen houden het overzicht behapbaar. Elke aanvullende taak bevat een volgende stap, peildatum en herleidbare bronnen. Een leesvinkje voltooit geen werktaak. Gewijzigde broninhoud vraagt opnieuw om statuscontrole; een nieuwe rapportage blijft zichtbaar totdat de concrete taken opnieuw zijn beoordeeld. De inventaris activeert geen routines en voert de opgesomde taken niet uit.

De uitbreiding valt binnen ADR-0014. Zie [de controle van de werklijst](reviews/work-items-2026-09-10.md) voor de uitgevoerde tests en de grens tussen huidige waarneming en nog te controleren werking.
