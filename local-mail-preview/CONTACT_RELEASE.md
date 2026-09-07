# Contactformulier — voorbereiding 7 september 2026

Matthijs vraagt het contactformulier eerst live te zetten; nieuwsbrief volgt later. Deze opdracht geeft toestemming voor die contactlivegang, geen betaalde upgrade of nieuwsbriefactivering. Nog niet gedeployed: onderstaande privacygegevens en productiecontrole zijn niet afgerond.

## Uitgewerkt

Homepagecontactkop wordt Contact. Formulier met naam, e-mail, vraagtype, onderwerp, bericht en verplichte bevestiging geen medische gegevens. Geen bijlagen of automatische nieuwsbriefinschrijving. Tip voor de website is toegevoegd in beide previews, homepage en beide validators. Ontvanger blijft mjjvandam@gmail.com; bezoekersadres uitsluitend Reply-To.

Lokale losse preview: http://127.0.0.1:8879/contactvoorbeeld. Gebruikt een kopie van de echte submit-handler; lokale endpoint antwoordt altijd 503 en verstuurt niets. De huidige publieke privacy.html is nog niet aangepast. De homepage staat lokaal review_nodig; medische inhoud is verder ongewijzigd. ADR-0008 dekt dit contactwerk, geen nieuw architectuurvoorstel. ADR-0009 blijft geparkeerd; geen hostingmigratie of upgrade.

## Actueel gelezen instellingen

Vercel Production bevat BREVO_API_KEY als Secret en CONTACT_FORM_ENABLED als Config. CONTACT_EDGE_RATE_LIMIT_VERIFIED ontbreekt. Firewallregel Contactformulier — maximaal 5 per minuut is actief (429, IP/60s/padvarianten). Geen instellingen aangepast en geen nieuwe mail verstuurd.

Brevo Retention rules toont alle afzenders, 1 maand logs, Never store previews geselecteerd. Alleen gelezen, niet opgeslagen of gewijzigd. Deze huidige UI wijkt af van de eerdere onbevestigde standaardretentie in PRIVACY_CONCEPT.md. Voor activering opnieuw de werkelijk toegepaste instellingen vaststellen; niet stellen dat oude inhoud al verwijderd is.

## Nog af te ronden

- Vraag aan Matthijs staat open: persoonlijke verantwoordelijke of onderneming, en voorstel 12 maanden na afhandeling voor gewone correspondentie. Geen fictieve bedrijfsidentiteit of automatische mailboxverwijdering claimen.
- Privacytekst voor uitsluitend contact, daadwerkelijke mailbox-/leveranciersafspraken en uitvoerbare bewaartermijnen afronden. Gewone Gmail niet als Workspace met verwerkersovereenkomst presenteren.
- Productiehandler/deployment en rate-limit-keten controleren; eerdere lokale Brevo-test is geen gehoste ketentest. Een eventuele echte contacttest apart concreet afspreken; eerdere nieuwsbriefproeftoestemming geldt niet onbeperkt.
- Alleen contactrelease deployen, geen concepten/nieuwsbrief meepubliceren. Script/styles cacheversie bij release actualiseren. Daarna echte livepagina en mailontvangst vaststellen.

## Validatie

21 bestaande Node-tests geslaagd. Contactpreview op 360/390/430 px zonder horizontale overflow; lokale verzendpoging toont correct uitgeschakeld en bewaart tekst. SEO-check slaagt voor 40 publieke pagina's. Sitekwaliteit geeft uitsluitend de zes reeds bekende navigatiemeldingen van lokale mails/bevestigingspagina. Publicatiecontrole blokkeert de nog niet afgeronde homepagewijziging terecht. Geen package.json of npm-checks. Niet-gelijktijdig werk in AGENTS.md en tools/editorial_learning.py ongemoeid gelaten.

## Herinnering na contactlivegang

1. Nieuwsbriefinschrijving, bevestiging, voorkeuren en uitschrijving met echte opslag/Brevo afronden.
2. Vrijgegeven artikelen persoonlijk samenstellen met beelden en introductie; duplicaten en maximaal twaalf per jaar bewaken.
3. Volledige ketentest van aanmelden tot ontvangen en uitschrijven.
4. Na akkoord nieuwsbrief live met subtiele inschrijfmogelijkheden op de site.

## Eigenaarbesluit

Matthijs bevestigt persoonlijke verantwoordelijkheid; ETZ is niet betrokken of verantwoordelijk. AOdK en Codex mogen niet in publieke websitetekst worden genoemd. Gewone contactberichten twaalf maanden na afhandeling; maandelijkse mailboxcontrole gewenst. De eerdere open vragen over verantwoordelijke en termijn zijn hiermee beantwoord. Maandelijkse controle signaleert verwijderkandidaten, geen blinde verwijdering op ontvangstdatum. Publieke privacytekst lokaal voorbereid; nog niet gedeployed. De vier nieuwsbriefstappen blijven geparkeerd.
