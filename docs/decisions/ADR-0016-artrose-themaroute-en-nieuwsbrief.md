# ADR-0016: Artrose-themaroute en onderwerpgerichte nieuwsbrief

Status: Accepted

Decision owner: site owner / Matthijs

Owner validation: Matthijs heeft op 11 oktober 2026 de samenhangende review afgerond en expliciet publicatie van de themapagina met alle ingangen vrijgegeven. Hij heeft de huidige BMI-tool afzonderlijk inhoudelijk beoordeeld en expliciet vrijgegeven. Dit legt zijn besluit vast; technische ketenproef en liveverificatie blijven afzonderlijke stappen.

## Aanleiding

Matthijs vraagt de bestaande uitleg, artikelen, projecten en BMI-tool samen een herkenbare plaats te geven, inclusief homepageblok en alle benodigde ingangen elders. Het formulier binnen dit thema moet alleen onderscheid maken tussen patiënten en zorgprofessionals, zonder Algemeen of Voet/enkel als extra keuzes.

## Besluit voor publieke invoering

- Eén thematische hub `artrose-gewicht-bewegen.html` binnen de bestaande pijler knie/artrose/leefstijl; geen nieuwe hoofdnavigatieroute of behandelaanbod.
- Vier inhoudelijke delen: algemene uitleg; Meer dan je BMI; artikelen; onderzoek en samenwerking. De nieuwsbrief is een zelfstandig, duidelijk herkenbaar blok na deze vier delen, bereikbaar vanuit de intro, vaste themanavigatie en onderzoeksoproep.
- Eén homepage-ingang na de doelgroepband vervangt de losse cohort-uitlichting en het artrose-scrollverhaal op de homepage. De volledige bestemmingspagina’s blijven bestaan. De cohortkaart keert terug in de reguliere homepage-projectselectie; geen gedupliceerd eigen blok.
- Contextuele ingangen op de in het lokale manifest benoemde bestaande pagina’s. Patiënten blijven bij algemene informatie; professionals kunnen naar het afzonderlijke onderzoeksdeel en officiële overleg-/verwijsroutes.
- Themaformulier met zichtbaar vast onderwerp en expliciete doelgroep/toestemming; verplichte voornaam, achternaam, e-mail, native Brevo double opt-in, profielwijziging en uitschrijving behouden.
- Twee afzonderlijke nieuwe Brevo-lijsten voor dit bredere thema. Bestaande cohortlijsten 7/8 worden niet stilzwijgend verbreed; geen automatische migratie van bestaande voorkeuren. Eén gecombineerde editie per adres, maximaal twaalf per jaar en geen verzending zonder aparte vrijgave.
- De nieuwsbrief kan naast artikelen concrete oproepen bevatten voor patiënten die willen bijdragen aan onderzoek. Elke oproep krijgt afzonderlijk vrijgegeven onderzoeksuitleg en een eigen aanmeldroute. Nieuwsbriefinschrijving is geen onderzoeksaanmelding of toestemming voor deelname; geen deelnemersregistratie of gezondheidsvragen via dit formulier. Matthijs vroeg op 11 oktober 2026 om deze route lokaal uit te werken; publieke invoering is door Matthijs vrijgegeven.
- De algemene nieuwsbriefpagina behoudt haar keuzes en krijgt een thematische ingang. Geen diagnose, triage of gegevensoverdracht vanuit de BMI-tool naar nieuwsbrief of analyse.

## Grenzen en consequenties

ADR-0001/0002 blijven de positionering en pijlers bewaken; ADR-0004/0005/0006 gelden voor veilige links, medische review en publicatie. ADR-0008/0013 blijven leidend voor inschrijvingen. Deze ADR legt de nieuwe expliciete themaroute en nieuwsbriefscope vast; zij is na de samenhangende eigenaarreview door Matthijs geaccepteerd.

De publieke calculator blijft de beoordeelde zelfstandige pagina, met een teruglink naar het thema en een disclaimerlink. Zij laadt uitsluitend lokale calculatorbestanden, zonder site-analytics, feedback of gegevensopslag. De navigatiecheck controleert deze twee routes als expliciete uitzondering op de volledige siteshell.

## Uitvoering en verificatie

De gecontroleerde release bouwt voort op origin/main b255554. Bestaande medische pagina’s krijgen alleen de beoordeelde thema-ingangen; andere lokale wijzigingen blijven uitgesloten. De twee nieuwe Brevo-lijsten zijn 13 (patiënten) en 14 (zorgprofessionals). Native double opt-in, voorkeuren en uitschrijving blijven leidend. Campagnedrafts en verzending vereisen afzonderlijke vrijgave.

De medische eigenaarreview en livevrijgave zijn gegeven. Technische ketenproef, deployment en livebewijs worden afzonderlijk vastgelegd in het releaseverslag. Trouw krijgt pas een inhoudelijke kaart na beschikbaarheid van de exacte bron; het ontbreken ervan blokkeert de overige themaroute niet.
