# Google Search Console bij siteontwikkeling

Opdracht van Matthijs op 12 september 2026: neem Google-vindbaarheid op in het lokale dashboard en pak Search Console automatisch op bij relevante ontwikkeling. Dit valt onder het lokale dashboard van ADR-0014 en SEO-kader ADR-0004; publicatiegrenzen van ADR-0006 blijven gelden.

## Wanneer uitvoeren

- Bij iedere bestaande wekelijkse sitecheck.
- Bij werkzaamheden aan vindbaarheid, URL's/redirects, canonical, sitemap, robots, navigatie/interne links en voorbereiding of nacontrole van een publieke release.
- Bij nieuwe artikelen of pagina's: gebruik relevante beschikbare zoekgegevens als ondersteunend signaal, zonder medische inhoud of positionering op zoekvolume te baseren.

## Werkwijze

1. Lees de vorige momentopname in `local-admin/state/search-console.json`, de bestaande taak `work-search-setup` en de nieuwste Search Console-controle. Open de bestaande domeinproperty `sc-domain:matthijsvandam.nl` via de beschikbare computerbediening of officiële connector. Maak geen dubbele property of nieuwe toegang aan.
2. Controleer verificatie, sitemapstatus, ontdekte pagina's, indexering en uitsluitingsredenen. Bekijk zo nodig URL-inspectie van betrokken publieke pagina's en prestaties voor een expliciet gekozen periode. Vergelijk perioden alleen als ze dezelfde scope en lengte hebben. Maak van ontbrekende cijfers geen nullen.
3. Noteer zowel het ophaaltijdstip als de Google-rapportdatum. Ververs `local-admin/state/search-console.json` alleen met werkelijk gecontroleerde gegevens; schrijf eerst een tijdelijke JSON en vervang daarna het bestand. De huidige schemaonderdelen staan in `search_console.py`. Behoud onbekende/niet ondersteunde situaties als expliciete beperking in het verslag; vervang nooit een mislukte controle door verzonnen succes.
4. Bewaar een gedateerd bronverslag onder `docs/site/reviews/search-console-YYYY-MM-DD.md`. Leg gewijzigde concrete acties met bestaande IDs en inhoudelijk gecontroleerde bronhashes vast in `work-items.json`. De opname ouder dan zeven dagen heet opnieuw controleren; een schermverversing haalt zelf niets bij Google op.
5. Controleer 404's ook rechtstreeks, zoek de inhoudelijk juiste bestaande bestemming en bereid kleine correcties lokaal voor binnen de opdracht. Geen brede redirect naar de homepage. Controleer queryparameters en bestaande canonicals. Omleidingen en canonieke alternatieven zijn niet automatisch fouten.
6. Binnen bestaande autorisatie mag de al gepubliceerde sitemap worden ingediend en mag indexering van expliciet vrijgegeven publieke pagina's worden aangevraagd. Na een goedgekeurde URL-/hostrelease eerst de live-uitvoer controleren en pas dan de actuele sitemap aanbieden. Geen publieke wijzigingen, nieuwe medische claims, conceptindexering, verwijderingsverzoeken, DNS-/toegangsveranderingen of publicatie zonder de daarvoor vereiste toestemming.
7. Ontbreekt een ingelogde sessie of vraagt Google om menselijke tussenkomst: behoud de laatste geslaagde opname met oorspronkelijke datum, leg de mislukte controle en concrete inlogactie apart vast en ga door met onafhankelijk lokaal werk. Geen verborgen sessie-export of credentialopslag. Meld alleen nieuwe belangrijke bevindingen, relevante veranderingen, echte voltooiing of noodzakelijke gebruikersactie; geen herhaalde ongewijzigde meldingen en geen e-mail.

Dit is automatische opvolging tijdens ontwikkelwerk en de bestaande weekcheck. Het dashboard heeft geen permanente Google-API-koppeling en start zelf geen browser of routine.

## Vaste startselectie vanaf 12 september 2026

Volg bij de weekcheck de publiek beschikbare .html-pagina's voor enkelartrose, enkelprothese en de klachtenhub. Leg per URL de inspectiedatum, indexstatus, laatste crawl en Google-canonical vast, met eventuele indexeringsaanvraagdatum. Vergelijk daarna klikken, vertoningen en relevante zoekopdrachten over dezelfde periode. Ontbrekende data blijven onbekend; rapporteer geen daling door een ontbrekende rij. Inspecteer zo nodig zowel de werkelijk bezochte URL als de aangegeven canonical, zonder de hostkeuze zelfstandig te wijzigen. Herhaal een geaccepteerde indexeringsaanvraag niet als er geen nieuwe aanleiding is.

Controleer daarnaast de bestaande ProfilePage van de homepage: op 11 september 2026 rapporteerde Google één geldig item voor drs. M.J.J. (Matthijs) van Dam op https://www.matthijsvandam.nl/. Behoud deze markering; voeg geen schema toe zonder inhoudelijke aanleiding. Nieuwe problemen worden concrete vervolgacties, een ongewijzigd geldig item geen herhaalde melding.
