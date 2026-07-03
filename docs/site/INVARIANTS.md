# Site Invariants

Doel: vastleggen welke eigenschappen van MatthijsVanDam.nl bij toekomstige ontwikkeling behouden moeten blijven. Gebruik dit document als toets voordat nieuwe content, pagina's, modules, SEO-wijzigingen of publicatiestappen worden uitgevoerd.

## 1. De site blijft een professionele expert-hub, geen patientportaal

Wat moet behouden blijven:

- De site geeft algemene informatie en professionele context.
- De site is geen plek voor persoonlijke medische vragen, afspraken, dossierinformatie of spoed.
- Contactroutes blijven begrensd en verwijzen bij patientgebonden vragen naar officiele zorgkanalen.

Waarom dit belangrijk is:

- Het voorkomt verwarring over medische verantwoordelijkheid, privacy en bereikbaarheid.
- Het beschermt de rol van ETZ, huisarts, ZorgDomein en andere officiele zorgkanalen.

Wat kan dit breken:

- Een zichtbaar contactformulier zonder duidelijke patientgrens.
- Teksten die bezoekers uitnodigen om medische gegevens te sturen.
- CTA's die op afspraakplanning, triage of consultaanvraag via de site lijken.

Eigenaar-validatie nodig:

- Altijd bij nieuwe contactmogelijkheden, formulieren, patientroutes of teksten over verwijzing en spoed.

## 2. De drie hoofdsporen blijven gescheiden

Wat moet behouden blijven:

- Patientgerichte uitleg.
- Patientgerelateerde informatie voor professionals.
- Niet-patientgebonden advies en consultancy.

Waarom dit belangrijk is:

- Bezoekers moeten direct begrijpen welke route voor hen bedoeld is.
- Het voorkomt dat advies/consultancy wordt verward met patientenzorg.

Wat kan dit breken:

- Een artikel of kaart die tegelijk patientadvies, verwijzersinformatie en consultancy-aanbod probeert te zijn.
- Interne links die patienten naar advies/consultancy sturen als vervolgstap voor medische vragen.
- Projectpagina's die patientgebonden zorgroute en niet-patientgebonden projectadvies vermengen.

Eigenaar-validatie nodig:

- Bij nieuwe hoofdpagina's, nieuwe navigatie, nieuwe doelgroepteksten en grotere wijzigingen aan homepage, `professionals.html` of `advies-consultancy.html`.

## 3. De persoonlijke positionering blijft herkenbaar en begrensd

Wat moet behouden blijven:

- Matthijs wordt gepositioneerd als orthopedisch chirurg in het Orthopedisch Centrum ETZ Tilburg.
- Zijn aandachtsgebieden blijven voet, enkel, knie, sportletsel, knieartrose, leefstijlgerelateerde gewrichtsklachten, onderzoek, onderwijs en zorgontwikkeling.
- Zijn zelfstandige adviesrol blijft niet-patientgebonden en projectmatig.

Waarom dit belangrijk is:

- De site moet persoonlijk zijn, maar niet loskomen van vakgroep, ETZ, regio en officiele zorgkanalen.
- Nieuwe content mag geen breder medisch of commercieel profiel suggereren dan de huidige site draagt.

Wat kan dit breken:

- Nieuwe claims over specialismen of behandelaanbod die niet uit de huidige site volgen.
- Consultancytaal die de medische rol overschaduwt.
- Homepagewijzigingen die Mobility Clinic, kraakbeentransplantatie, AI of consultancy als hoofdnarratief maken.

Eigenaar-validatie nodig:

- Bij elke wijziging aan kernbio, homepage-hero, structured data over persoon/organisatie, hoofdnavigatie of nieuwe expertiseclaims.

## 4. Patientinformatie blijft algemeen, rustig en niet-sturend

Wat moet behouden blijven:

- Patientteksten leggen klachten, aandoeningen, behandelrichtingen en zorgroute algemeen uit.
- Ze stellen geen diagnose en geven geen advies voor een individuele situatie.
- De toon blijft begrijpelijk, concreet, niet-angstig en niet-wervend.

Waarom dit belangrijk is:

- Patientinformatie moet helpen orienteren zonder medische beoordeling te vervangen.
- De site moet betrouwbaar blijven en geen operatiedruk oproepen.

Wat kan dit breken:

- Formuleringen zoals "u heeft", "u moet", "de beste behandeling is" of "na deze ingreep kunt u weer".
- Te stellige geruststelling.
- Behandelopties zonder context, onzekerheid, risico's of officiele zorgroute.

Eigenaar-validatie nodig:

- Altijd bij nieuwe of substantieel gewijzigde medische patientinformatie.
- Altijd voordat concept-behandelpagina's publiek worden.

## 5. Medische betrouwbaarheid gaat voor vindbaarheid

Wat moet behouden blijven:

- SEO, AI-zichtbaarheid en snippets mogen geen behandelclaims, diagnoseclaims of commerciele taal introduceren.
- Titles, descriptions, H1's en structured data blijven feitelijk en veilig.
- Medische nieuws- of onderzoekscontent gebruikt media alleen als radar en controleert de bronketen.

Waarom dit belangrijk is:

- Zoekmachines en AI-systemen kunnen metadata en samenvattingen uitvergroten.
- Vindbaarheid mag niet ten koste gaan van medische voorzichtigheid.

Wat kan dit breken:

- SEO-teksten met "beste", "snel herstellen", "specialist voor elke klacht" of vergelijkbare claimtaal.
- AI-gerichte samenvattingen die behandeling als aanbod presenteren terwijl het alleen context is.
- Bronloze duiding van medisch nieuws.

Eigenaar-validatie nodig:

- Bij nieuwe indexeerbare medische pagina's.
- Bij wijzigingen aan title, description, JSON-LD of OpenGraph voor medische/professionele pagina's.
- Bij artikelen op basis van actuele medische bronnen of nieuwsaanleidingen.

## 6. Concept en publiek blijven strikt gescheiden

Wat moet behouden blijven:

- Conceptpagina's blijven `noindex` en buiten sitemap.
- Concept-behandelpagina's in `behandelingen/` blijven buiten deployment zolang ze niet expliciet zijn vrijgegeven.
- Gepubliceerde pagina's staan in `PUBLICATIE_REGISTER.json`.

Waarom dit belangrijk is:

- De repo bevat veel nuttige conceptcontent die nog niet medisch of publicatietechnisch vrijgegeven is.
- Onbedoelde livegang kan medische en SEO-risico's geven.

Wat kan dit breken:

- Aanpassen van `.vercelignore`, robots-tags, sitemap of canonicals zonder publicatiebesluit.
- Publieke links naar conceptpagina's.
- Nieuwe `index, follow` op een pagina zonder registerstatus.

Eigenaar-validatie nodig:

- Altijd bij het publiek maken van conceptpagina's.
- Altijd bij wijzigingen aan `.vercelignore`, `sitemap.xml`, robots-tags of publicatieregister.

## 7. De Voet- en enkelpijnwijzer blijft een leeswijzer

Wat moet behouden blijven:

- De pijnwijzer helpt algemene informatie vinden op basis van pijnplek.
- De pijnwijzer stelt geen diagnose, beoordeelt geen spoed en geeft geen behandeladvies op maat.
- Resultaten blijven leesrichtingen, geen uitslagen.

Waarom dit belangrijk is:

- Interactie kan snel aanvoelen als symptoomchecker of triagetool.
- Medische veiligheid vraagt dat kaartkoppelingen voorzichtig en gevalideerd blijven.

Wat kan dit breken:

- Teksten zoals "dit betekent waarschijnlijk", "uw diagnose" of "u moet naar".
- Urgentie- of triagelogica.
- Persoonlijke vragenlijsten die individuele beoordeling suggereren.
- Directe behandeladviezen vanuit een geselecteerde pijnplek.

Eigenaar-validatie nodig:

- Altijd bij wijziging van pijnregio's, kaartmapping, veiligheidstekst, resultatenlogica of publieke vrijgave.

## 8. Out-of-scope onderwerpen blijven veilig afgebakend

Wat moet behouden blijven:

- Onderwerpen buiten het eigen behandelaanbod mogen alleen als orientatie of differentiaal worden gebruikt wanneer dat medisch nuttig is.
- Lisfranc- en middenvoetletsel blijft in de pijnwijzer alleen herkenningsrichting, zonder publieke behandelpagina-link of behandelspoor.

Waarom dit belangrijk is:

- De site mag niet suggereren dat Matthijs een onderwerp behandelt wanneer dat niet past bij zijn rol of scope.
- Differentiaalinformatie kan nuttig zijn, maar moet niet als aanbod of expertiseclaim lezen.

Wat kan dit breken:

- Een publieke kaart of landingspagina voor een out-of-scope trauma-onderwerp.
- Interne links die out-of-scope onderwerpen naast reguliere behandelonderwerpen zetten.
- Metadata die zo'n onderwerp als specialisme of behandelaanbod presenteert.

Eigenaar-validatie nodig:

- Altijd bij out-of-scope aandoeningen, trauma-onderwerpen of twijfel over behandelaanbod.

## 9. Professionele autoriteit blijft ingebed in praktijk, regio en bronnen

Wat moet behouden blijven:

- Professionele teksten blijven verbonden met ETZ, vakgroep, regio Tilburg, onderwijs, onderzoek of concrete projectervaring.
- Persoonlijke toon mag, maar blijft professioneel en onderbouwd.
- Publicaties en projecten ondersteunen autoriteit zonder losse zelfpromotie.

Waarom dit belangrijk is:

- De site moet vertrouwen opbouwen door inhoud en context, niet door marketingtaal.
- Verwijzers en partners moeten de rol en grenzen van Matthijs goed kunnen plaatsen.

Wat kan dit breken:

- Algemeen consultancy- of thought-leadership-jargon zonder orthopedische context.
- Claims over autoriteit zonder bron, publicatie, project of praktijkcontext.
- Projectteksten die te ver van patientenzorg, orthopedie of zorgontwikkeling afraken.

Eigenaar-validatie nodig:

- Bij nieuwe projectpagina's, professionele artikelen, publicatieclaims, partnerclaims of adviesproposities.

## 10. De rustige medische vormtaal blijft behouden

Wat moet behouden blijven:

- Premium, rustige, medische en professionele uitstraling.
- Bestaande componenten, spacing, kaartstijlen, typografie en CSS-patronen blijven leidend.
- Mobiele leesbaarheid en toegankelijkheid blijven basisvoorwaarden.

Waarom dit belangrijk is:

- De vormtaal ondersteunt betrouwbaarheid en rust.
- Visuele drift kan de site commercieler, drukker of minder medisch laten voelen.

Wat kan dit breken:

- Redesigns zonder opdracht.
- Nieuwe kleuren, gradients, hero-patronen of kaartstijlen buiten bestaande stijl.
- UI-elementen die op mobiel overlappen of tekst onleesbaar maken.
- Contrast- of focus-state regressies.

Eigenaar-validatie nodig:

- Bij redesigns, nieuwe visuele systemen, homepagewijzigingen, nieuwe interactieve modules of brede CSS-wijzigingen.

## 11. Interne links blijven routebewust

Wat moet behouden blijven:

- Interne links helpen bezoekers naar de juiste vervolgstap voor hun doelgroep.
- Patientroutes leiden naar algemene informatie en officiele zorgkanalen.
- Professionalroutes leiden naar samenwerking, verwijzing, publicaties en professionele context.
- Adviesroutes blijven niet-patientgebonden.

Waarom dit belangrijk is:

- Links bepalen hoe bezoekers de site interpreteren.
- Verkeerde links kunnen doelgroepen mengen of conceptcontent publiek maken.

Wat kan dit breken:

- Patientartikelen die naar consultancy of directe e-mail als medische route verwijzen.
- Projectpagina's die naar patientzorg lijken te leiden.
- Publieke links naar noindex-conceptpagina's zonder publicatiebesluit.

Eigenaar-validatie nodig:

- Bij navigatiewijzigingen, homepage-routewijzigingen, publicatie van behandelpagina's en nieuwe prominente linkblokken.

## 12. Publicatie blijft expliciet en auditeerbaar

Wat moet behouden blijven:

- Publicatiestatus volgt `PUBLICATIE_REGISTER.json` en de bestaande checks.
- Nieuwe of gewijzigde publieke medische/professionele pagina's krijgen `review_nodig` totdat Matthijs akkoord geeft.
- Afrondingen benoemen wat is gewijzigd, welke checks zijn gedaan en wat medisch nog beoordeeld moet worden.

Waarom dit belangrijk is:

- De site bevat medische en professionele informatie waarvoor menselijke eindverantwoordelijkheid nodig blijft.
- Auditeerbaarheid voorkomt dat wijzigingen ongemerkt als geverifieerd worden behandeld.

Wat kan dit breken:

- Een pagina live zetten zonder registerupdate.
- Registerstatus aanpassen naar `geverifieerd` zonder expliciet akkoord.
- Alleen technische checks draaien en medische review overslaan.

Eigenaar-validatie nodig:

- Altijd bij publicatie of herpublicatie van medische/professionele pagina's.
- Altijd bij wijziging van de definitie van "gepubliceerd".
