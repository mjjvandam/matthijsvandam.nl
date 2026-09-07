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

## Livegang 7 september 2026

Contactrelease fe86903 naar origin/main gepusht via GitHub Desktop. Vercel productie dpl_3K6ehxvWYKaJmhDEHmAvj6dZjZaC READY en domeinen gekoppeld. CONTACT_FORM_ENABLED=true en CONTACT_EDGE_RATE_LIMIT_VERIFIED=true in Production opgeslagen. Beveiligingsproef vóór activering: vijf ongeldige POSTs 503, daarna 429 op verzoeken zes en zeven; na deployment ongeldig verzoek 400. De limiet is per IP, geen garantie tegen verspreide quota-uitputting.

Live homepage en privacy.html HTTP 200; formulier en nieuwe privacytekst aanwezig; lokale preview HTTP 404. Geen AOdK of Codex in deze publieke pagina’s. Mobiel 360/390/430 px zonder overflow. Matthijs gaf apart akkoord voor één live testmail; browserformulier toont na verzending succes. Inboxcontrole volgt. Publicatiecheck 40/40 geslaagd, SEO-check geslaagd; zeven contacttests geslaagd en zes bekende lokale navigatiemeldingen blijven. Newsletter blijft uit en de vier vervolgpunten blijven geparkeerd.

Inboxontvangst onafhankelijk bevestigd via Gmail: exact één testbericht met onderwerp Websitecontact: Livecontrole contactformulier 7 september 2026, ontvanger mjjvandam@gmail.com en label INBOX. Geen herhaling verstuurd.

## Lokale tekst- en bevestigingsreview 7 september 2026

Op expliciet verzoek van Matthijs is alleen `/contactvoorbeeld` aangepast: bezoekers mogen kort de aanleiding noemen, zonder aandoeningsvoorbeeld. De checkbox bevestigt de grens voor persoonlijk medisch advies en afspraken. Het veld heet nu `contactgrenzen_begrepen`, zodat de preview geen onjuiste verklaring “geen medische gegevens” verstuurt. Zie het aanvullende eigenaarbesluit bij ADR-0008. De bestaande publieke handler accepteert dit nieuwe veld nog niet; deze preview is dus geen direct inzetbare productiekopie.

Na gesimuleerde succesvolle verzending verschijnt een contrastrijk bevestigingsvlak met focus. Invoer verdwijnt uit beeld maar wordt pas gewist bij “Nieuw bericht schrijven”. Bij fouten blijft de invoer zichtbaar. De lokale endpoint blijft uitgeschakeld; succes wordt uitsluitend met een browsermock gecontroleerd. Geen echte verzending of deployment in deze review. Privacy, productiehandler en publieke formulierteksten moeten samen worden aangepast voor overname op de live site.

Validatie van deze lokale wijziging: browsercontrole op 360/390/430/1200 px, licht en donker, geslaagd. Getest: uitgeschakelde endpoint met behoud van invoer, gesimuleerd succes, focus op bevestiging, nieuw bericht, onzekere status met geblokkeerde herhaling en geen horizontale overflow of JavaScriptfouten. Bevestiging visueel gecontroleerd; tekstcontrast 10,98:1. Sitekwaliteit: uitsluitend de zes bestaande navigatiemeldingen in twee andere lokale mailpagina's. `git diff --check` geslaagd. Geen package.json, dus geen npm-checks.

## Contactmailopmaak — lokale uitwerking 7 september 2026

Op verzoek van Matthijs bevat `api/contact.js` nu een HTML-contactmail met groene kop, categorie, onderwerp, afzender en leesbaar bericht. De onderwerpregel is `[Website · categorie] onderwerp`. Gewoon Beantwoorden blijft naar de gevalideerde inzender gaan. De platte-tekstvariant blijft beschikbaar; bezoekersinhoud wordt voor HTML ge-escaped en regeleinden blijven behouden. Geen externe afbeeldingen of tracking toegevoegd. De formuliercriteria en ontvanger zijn ongewijzigd.

Fictief voorbeeld: `local-mail-preview/contact-mail-example.html`, rechtstreeks gegenereerd met dezelfde renderer als de handler. Acht contacttests slagen, inclusief HTML-escaping, vaste ontvanger/Reply-To en bescherming bij fouten. Browsercontrole op 360/390/430/900 px slaagt, ook met maximale veldlengtes; mobiele screenshot visueel beoordeeld. `git diff --check` slaagt. Geen package.json of npm-checks. Niet getest in echte Gmail/Outlook-weergave; geen echte mail verstuurd.

ADR-check: opmaak en onderwerpregel vallen onder ADR-0008; geen nieuw besluit nodig. Alleen lokaal geïmplementeerd, niet gedeployed. Een automatisch conceptantwoord is nog niet ingebouwd en vraagt een afzonderlijke keuze voor inhoud en verwerking.

## Conceptantwoord in de contactmail

Matthijs heeft het afzonderlijke blok “Conceptantwoord — eerst controleren” goedgekeurd. Lokaal toegevoegd aan HTML en platte tekst: vaste aanhef met de opgegeven naam, dankregel met onderwerp, expliciete invulplek voor de inhoudelijke reactie en ondertekening. Dit is een basisopzet, geen inhoudelijk door AI opgesteld antwoord. Geen extra dienst, externe verwerking, Gmail-concept of automatische reactie toegevoegd. ADR-0008 dekt deze sjabloonuitbreiding; AI-verwerking is geen onderdeel van deze wijziging. Niet gedeployed.

## Mailopmaak live — 7 september 2026

Na expliciet akkoord voor livegang en toevoeging van een kleine disclaimer onder Matthijs' naam in het conceptantwoord: commits 46bacb0 en 4984873 gepusht via GitHub Desktop. Productie dpl_2fJg52itLbTFSgGWfd6Yz4VsbroA is READY en gekoppeld aan apex en www; Git SHA 49848738492e99265199cd9293cc279753b543a5. Homepage HTTP 200; GET contact-API correct 405. Acht contacttests en browsercontrole 360/390/430/900 px slagen; publicatieverificatie 40/40. Geen echte testmail verstuurd: inboxweergave van deze versie is nog niet gecontroleerd.

Deze release bevat uitsluitend de mailrenderer, bijbehorende tests en uitgesloten voorbeeldmail. De eerder gewijzigde contactformuliertekst en duidelijkere verzendbevestiging blijven lokale preview en zijn niet mee gedeployed. Disclaimer in het conceptantwoord: “Voor persoonlijk medisch advies, afspraken of spoed gebruik je de officiële zorgkanalen.” Geen automatische antwoorden of AI-verwerking.

## Formulieraanpassingen live — 7 september 2026

Na afzonderlijk expliciet akkoord ook voor deze livegang is 81edcfc0009339f5d2aaf3a12cbce31ac1118898 gepusht. Deployment dpl_6BitXnDybAzu2H9rikerXiTS9Dy3 READY, apex en www gekoppeld. Homepage en privacy.html via HTTPS opgehaald en bytegelijk aan de release. Contactgrenzen, nieuwe checkbox, servercontrole en contrastrijke succesbevestiging zijn nu publiek. Script/styles cacheversie vernieuwd voor homepage en privacy.

Acht contacttests geslaagd; server weigert ook ontbrekende/false bevestiging en uitsluitend de oude veldnaam. Lokale homepage op 360/390/430/1200 px in licht/donker gecontroleerd. Live browsercontrole op 390 px licht/donker met uitsluitend gemockte POSTs geslaagd: succes, fouten, onzekere status, behoud invoer, focus, nieuw bericht en geen overflow. Geen echte mail verstuurd. Publicatiecheck 40/40 en SEO-check geslaagd; sitekwaliteit meldt negen navigatiepunten in drie uitgesloten lokale mailvoorbeelden, geen publieke pagina. Geen package.json of npm-checks. ADR-0008 bijgewerkt met eigenaarvrijgave.
