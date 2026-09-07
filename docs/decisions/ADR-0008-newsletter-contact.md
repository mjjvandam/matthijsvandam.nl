# ADR-0008: Nieuwsbriefinschrijving, contactformulier en artikelverzending

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs gaf op 2026-09-06 expliciet akkoord op ADR-0008 voor lokale bouw. Dit akkoord omvat geen livegang of echte verzending.

Datum: 2026-09-06

## Context

Matthijs wil de technische bouw van een nieuwsbriefsysteem combineren met een professioneel contactformulier, met zo weinig mogelijk handmatige bediening en EUR 0 extra terugkerende kosten als uitgangspunt. Nieuwsbrieven moeten bestaande artikelen kunnen selecteren op doelgroep, thema en project. Nieuwe redactionele inhoud of AI-generatie is geen onderdeel van deze bouw.

De site bevat artikelmetadata in `content.js`, een nog niet zichtbaar contactformulier met frontendlogica in `script.js` en een voorbereide Resend-route in `api/contact.js`. `privacy.html` vermeldt dat contactformulier en nieuwsbrief niet actief zijn. Een actieve maildienst, hostingabonnement, DNS-toegang of Brevo-account is niet vastgesteld.

ADR-0001, ADR-0002, ADR-0004, ADR-0005 en ADR-0006 blijven leidend. Deze ADR voegt de gegevensverwerking en distributieregels toe die de bestaande besluiten nog niet concreet dekken. Zij vervangt geen bestaande ADR.

## Voorgesteld besluit

### Twee gescheiden formulieren

- Nieuwsbrief: alleen e-mailadres, expliciete toestemming en vrijwillige voorkeuren voor redactionele stromen. Geen vragen over klachten, diagnoses of behandelgeschiedenis. Brevo beheert abonnees en toestemming; geen kopie van de adressenlijst in Git of AI-context.
- Contact: naam, e-mailadres, type professionele vraag, onderwerp en bericht. Geen bijlagen. Duidelijke grens voor medische vragen, spoed, afspraken en patiëntgegevens; daarvoor gelden officiële zorgkanalen.
- Contactberichten schrijven nooit automatisch in voor de nieuwsbrief. De afzender krijgt geen automatische kopie van het vrije tekstbericht; dat voorkomt extra verspreiding van mogelijk gevoelige informatie en onnodige mail.
- Nieuwsbriefvoorkeuren worden pas actief na bevestiging. Het invoeren van een bestaand adres mag geen voorkeuren wijzigen of een uitschrijving ongedaan maken zonder verificatie van de mailbox.

### Dienst en kosten

- Voorkeur: Brevo Free voor abonneebeheer, bevestigingsmails, nieuwsbriefcampagnes en doorsturen van contactberichten, onder voorbehoud van accountcontrole.
- Bestaande Resend-route blijft intact totdat migratie expliciet is vrijgegeven en getest. Geen dubbele bezorging via twee diensten.
- Geen betaald AI-gebruik, betaalde add-ons, abonnementen of automatische upgrades. Bij ongeschiktheid van Free blijft activering uit en volgt een onderbouwd alternatief.
- EUR 0 extra is pas bevestigd als gratis beschikbaarheid van formulieren, voorkeurenbeheer, RSS-campagnes, transactionele mail en passende hosting aantoonbaar is.
- Dagquota omvat alle mailstromen. Voor de proef maximaal 200 nieuwsbriefbezorgingen per dag als operationele bovengrens, met ruimte binnen de gedocumenteerde 300 voor contact en bevestiging. Dit is geen garantie tegen quota-uitputting: grensbewaking en foutafhandeling moeten worden getest.

### Artikelselectie en automatische verzending

- Begin met een beperkt aantal benoemde stromen. Iedere stroom definieert toegestane doelgroepen en optioneel thema's/projecten, rechtstreeks gekoppeld aan de bestaande IDs uit `content.js`.
- Matchregel: doelgroep moet passen; daarnaast moet ten minste één ingesteld thema of project passen. Zonder thema/projectfilter geldt alleen de doelgroep. Onbekende IDs geven een controlefout.
- Voorkeuren zijn keuzes voor te lezen inhoud, geen vaststelling dat iemand patiënt is of een aandoening heeft. Geen afgeleide gezondheidsprofielen of individuele kliktracking.
- Gebruik statisch gegenereerde RSS-feeds per stroom en Brevo RSS-campagnes als kleinste route, mits gratis beschikbaarheid aantoonbaar is. Formulieren mogen providerformulieren gebruiken als die de stijl-, toegankelijkheids- en privacycriteria halen; een maatwerkkoppeling is geen doel op zich.
- Bij meerdere gekozen stromen kan iemand meerdere mails ontvangen. Een enkele persoonlijke digest met deduplicatie over alle stromen is een afzonderlijke uitbreiding, niet een stilzwijgende belofte van de RSS-route.
- Alleen expliciet voor nieuwsbrief vrijgegeven, geverifieerde en daadwerkelijk live beschikbare artikelen worden geëxporteerd. Een aparte distributieregistratie koppelt artikel-ID, bronversie, goedgekeurde titel/samenvatting, vrijgavedatum en stromen.
- `archive` en `featured` zijn geen nieuwsbriefvrijgave. `content.js` bevat ook recente artikelen met `archive: true`.
- Bij publicatie kan Matthijs artikel en nieuwsbriefsamenvatting samen goedkeuren. Daarna mag exact die versie automatisch volgens de goedgekeurde stroomregels worden verzonden. Geen AI-herschrijving of nieuwe claims tijdens verzending.
- Wijziging van titel, samenvatting, URL, doelgroep of artikelinhoud maakt distributievrijgave ongeldig totdat opnieuw akkoord is gegeven.
- Bestaande artikelen worden bij start niet automatisch als achterstallige nieuwsbrief verzonden. Gebruik stabiele artikelidentificatie en een expliciete startgrens.
- Standaard maandelijkse controle; geen nieuwe vrijgegeven inhoud betekent geen verzending. Eerste proef maximaal vijf nieuwe items per stroom; achterstand en providerlimieten moeten zichtbaar worden gemaakt, niet stilzwijgend afgeknipt.
- Start met conceptcampagnes. Automatische verzending krijgt een apart expliciet activeringsakkoord na een geslaagde ketentest. Bij onzekere verzendstatus eerst providerstatus controleren; nooit blind opnieuw sturen.

### Beveiliging en privacy

- Sleutels uitsluitend server-side in de hostingomgeving; niet in frontend, Git, logs of documentatie.
- Server-side veldvalidatie, maximale requestgrootte, time-outs, vaste ontvanger en afzender; bezoekersadres alleen als gevalideerd Reply-To.
- Bevestiging van 'geen medische gegevens' strikt valideren. Deze verklaring voorkomt niet technisch dat iemand toch gevoelige inhoud typt; privacyproces en beperkte toegang blijven nodig.
- Spamcontrole moet ook bij meerdere serverinstanties werken. De huidige in-memory `Map` is daarvoor onvoldoende. Gebruik providerbescherming of een aantoonbaar gratis passende oplossing; geen onbewezen bescherming activeren.
- Geen openbare API om abonneelidmaatschap op te vragen. Generieke aanmeldmeldingen; verificatie voor voorkeurwijziging, uitschrijving direct verwerken.
- Privacyverklaring, verwerkersafspraken, subverwerkers/doorgiften, bewaartermijnen en verwijderroute worden vóór livegang afgestemd op de gekozen implementatie. Geen aanname dat een Europese leverancier automatisch alle gegevens uitsluitend in de EU verwerkt.
- Geen individuele open-/kliktracking of nieuwe advertentietrackers. Geen vrije contactinhoud in analytics of technische foutlogs.
- DNS-inrichting op basis van actuele providerinstructies; bestaande mailrecords niet vervangen zonder controle.

## Consequenties en implementatiegrens

- Eerst dit besluit valideren; daarna lokale implementatie. Lokale concepten moeten aantoonbaar buiten deployment staan, niet alleen `noindex` krijgen.
- Geen activering van formulieren, DNS-wijzigingen, verzending, deployment of wijziging van bestaande medische verificatiestatus op grond van alleen een geslaagde technische test.
- De inschrijfpagina is een nieuw functioneel paginamodel. Contact blijft binnen het professionele samenwerkingsspoor. Details van plaatsing en privacytekst worden in de lokale preview beoordeeld.
- Publieke pagina's die veranderen volgen de normale register- en publicatiecontrole. Canonical-hostkeuze blijft ongewijzigd.
- Uitvoering en acceptatiecriteria: `docs/site/NEWSLETTER_CONTACT_BUILD_PLAN.md`.

## Wat niet zonder nieuw besluit mag veranderen

- Budget van EUR 0 extra, automatische upgrades en betaalde afhankelijkheden.
- Scheiding van contact en nieuwsbrief, medische contactgrenzen en uitsluitingen voor patiëntgegevens.
- Expliciete distributievrijgave, ongewijzigde goedgekeurde inhoud, aparte activering van automatisch verzenden.
- Tracking, profilering, import van bestaande contacten of verbreding van gegevensverwerking.
- Overgang van vaste stromen naar persoonlijke digests of een eigen abonneedatabase.


## Uitvoeringsnotitie 2026-09-06

Na de lokale bouw heeft Matthijs afzonderlijk toestemming gegeven voor DNS-authenticatie, DMARC-rapportage, API-sleutel en één contacttest. Ontvangst op mjjvandam@gmail.com is bevestigd. Zijn opdracht om de volgende stappen te regelen autoriseert voorbereiding van de hostingkoppeling en lokale Brevo-migratie van api/contact.js. Publieke activering en automatische nieuwsbrieven blijven afzonderlijke besluiten. Geen wijziging van de Accepted-status of ruimere interpretatie van het oorspronkelijke liveakkoord.

## Eigenaarbesluit 2026-09-07: korte aanleiding bij contact (lokale uitwerking)

Matthijs heeft expliciet gevraagd dat bezoekers kort de aanleiding voor een contactvraag mogen noemen, ook wanneer die over hun eigen gezondheid gaat. Hij heeft de nieuwe uitleg en de bevestiging dat dit formulier geen persoonlijk medisch advies of afspraak biedt goedgekeurd, zonder voorbeeld van een aandoening. Dit wijzigt voor de lokale contactpreview de eerdere absolute verklaring “geen medische gegevens”. Het is geen verruiming van de nieuwsbrief of toestemming voor medische beoordeling via deze website.

De lokale preview gebruikt hiervoor `contactgrenzen_begrepen`; deze verklaring mag niet als `geen_medische_gegevens` naar de bestaande productiehandler worden vertaald. De productiehandler en publieke teksten zijn in deze wijziging niet aangepast. Overname op de live site vereist samenhangende aanpassing van handler, mailtekst en privacytekst, beoordeling van de verwerking van eventueel genoemde gezondheidsgegevens en afzonderlijke release. Deze productie-uitwerking blijft needs owner validation. De Accepted-status van het oorspronkelijke besluit blijft ongewijzigd.

## Eigenaarvrijgave contactformulier 7 september 2026

Na vrijgave van de mailopmaak heeft Matthijs expliciet ook de aangepaste formuliertekst en verzendbevestiging voor livegang goedgekeurd. De homepage, servervalidatie (`contactgrenzen_begrepen`) en privacyuitleg worden samen overgenomen. De privacytekst vermeldt dat vrijwillig genoemde eigen gezondheidsinformatie onderdeel van hetzelfde contactbericht is en via dezelfde diensten wordt verwerkt. De grens voor persoonlijk medisch advies, afspraken, spoed en lopende zorg blijft staan. Dit vervangt de bovenstaande lokale uitvoeringsgrens voor deze concrete contactwijziging; geen toestemming voor AI-verwerking of automatische antwoorden.
