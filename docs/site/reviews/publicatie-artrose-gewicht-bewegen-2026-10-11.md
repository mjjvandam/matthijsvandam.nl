# Publicatie artrose, gewicht en bewegen — 11 oktober 2026

Matthijs heeft de samenhangende review afgerond en publicatie van de themapagina, het homepageblok en alle bijbehorende ingangen expliciet vrijgegeven. De huidige versie van Meer dan je BMI is afzonderlijk inhoudelijk beoordeeld en vrijgegeven. ADR-0016 legt dit eigenaarbesluit vast; ADR-0004, 0005, 0006 en 0013 blijven leidend. Geen medische eigenaarreview meer open voor deze versie.

## Begrensd pakket

Release vanaf origin/main `b255554`, in de afzonderlijke checkout `artrose-publicatie`. Nieuwe routes: `artrose-gewicht-bewegen.html` en `meer-dan-je-bmi.html`. De homepage bundelt de eerdere losse cohort-/artroseblokken in het beoordeelde themablok. De bestaande cohortprojectkaart blijft bereikbaar. Relevante uitleg-, artikel-, project- en overzichtspagina’s krijgen contextuele thema-ingangen. Andere lokale medische tekst-, FAQ-, beeld- en prototypewijzigingen zijn niet meegenomen.

Metadata, CollectionPage, sitemap en publicatieregister zijn bijgewerkt. De zelfstandige BMI-tool gebruikt de zes beoordeelde runtimebestanden byte-identiek, met lokale invoer en terug-/disclaimerroute. De navigatiecheck kent hiervoor een expliciete uitzondering. De oorspronkelijke beoordeelde bron en hashes blijven onder concepten bewaard en buiten deployment. Het releasescript is een eenmalige reconstructie vanaf de genoemde basiscommit; niet gebruiken om latere onderhoudswijzigingen te overschrijven.

Het gedeelde designsysteem registreert thema, homepageblok, contextuele ingangen en BMI-tool. Beide nieuwsbriefpagina’s gebruiken dezelfde kleine native verzendindicator; die is verborgen in rust en begrensd tot 1em tijdens verzenden. De algemene siteknoppen blijven verder ongewijzigd.

## Nieuwsbrief en echte ketenproef

Brevo heeft twee aparte lijsten: 13 voor patiënten, 14 voor zorgprofessionals. Het nieuwe native themaformulier `6acbf3d00accffc5587b93e8` bevat uitsluitend deze twee lijsten, met expliciete toestemming en double opt-in. Het algemene inschrijf- en voorkeurenformulier bieden daarnaast alle bestaande onderwerpen. Er is geen automatische migratie van bestaande abonnees.

De eerste expliciet toegestane ketenproef op het algemene formulier liet zien dat het bestaande onderwerpkeuzes kan vervangen. Daarom gebruikt het thema een afzonderlijk formulier. Na afzonderlijke toestemming zijn beide tests opnieuw uitgevoerd: patiëntenmail ontvangen en bevestigd om 20:45 UTC, professionalsmail ontvangen en bevestigd om 20:45 UTC. Na iedere bevestiging is de juiste artroselijst in Brevo teruggelezen, terwijl de bestaande algemene voorkeur behouden bleef. Het testcontact is daarna teruggezet op de oorspronkelijke lijstlidmaatschappen. Geen persoonlijke testgegevens, bevestigingslinks of tokens in dit verslag.

De bevestigingsmail gebruikt de bestaande Nederlandse nieuwsbrieftekst met gekozen onderwerpen, afmeldmogelijkheid en spamadvies. De pagina toont na verzenden een bevestigings- en spamtip. Bestaande ontvangst-/uitschrijfroutes blijven behouden. Artikelselectie vereist doelgroep plus zowel artrose als leefstijl, of het cohortproject. De maandelijkse conceptroutine kent beide nieuwe streams. Campagnedrafts, onderzoeksoproepen en daadwerkelijke nieuwsbriefverzending houden hun afzonderlijke inhoudelijke vrijgave.

## Controle vóór deployment

- Sitekwaliteit: 89 HTML-bestanden, geen structurele issues.
- SEO: 58 publieke sitemaproutes, geen basisissues; concepten blijven uitgesloten.
- Behandelkwaliteit, pijnwijzer en FAQ-generatie: geslaagd.
- Nieuwsbriefselectie en verzendgrenzen: 26 tests geslaagd, waaronder doelgroep, dubbele topicvoorwaarde, ontdubbeling, uitschrijving, ontbrekende vrijgave en twaalf nieuwsbrieven per jaar.
- Formulier: beide echte inschrijvingen ontvangen, bevestigd en in Brevo teruggelezen; bestaande voorkeur behouden. Geen verdere testmails verstuurd.
- Browser: hub en BMI op 360, 390, 430 en 1280 px zonder horizontale pagina-overloop; licht/donker en mobiele formulieruitlijning gecontroleerd. Sticky themarij en ankerbediening werken. BMI 180 cm / 90 kg geeft 27,8 en de beoordeelde uitleg. Geen nieuwe medische logica.
- Geen package.json, dus geen npm-checks beschikbaar.
- Bestaande FAQ-baseline: `behandelingen/peroneus-saltans.html` heeft een FAQ buiten het centrale plaatsingsregister. Pagina, FAQ-register en FAQ-check zijn identiek aan de basisrelease; dit pakket verandert die niet.

Publicatieverificatie wordt na de commit herhaald: vóór commit meldt die terecht de 27 gewijzigde bestaande publieke pagina’s. Deployment, live HTTP-/browserbewijs en Search Console-nacontrole volgen na push; eigenaarreview alleen bewijst geen livegang of indexering.
