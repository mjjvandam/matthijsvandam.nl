# Bevestigingsmail en inschrijfcontrole

Status 2026-09-06: lokaal uitgewerkt, Brevo-sjabloon 3 als inactief concept opgeslagen en teruggelezen. Echte proef gestart na expliciete toestemming. Vercel blijft Hobby.

## Concrete mail

Onderwerp: **Bevestig je inschrijving voor mijn nieuwsbrief**.
Afzender: Matthijs van Dam <website@mail.matthijsvandam.nl>.
Bron: `templates/confirm-subscription.html`.
Eén knop: **Bevestig mijn inschrijving**, met Brevo-placeholder `{{ params.DOIurl }}`. Geen afbeeldingen, trackingpixels of externe lettertypen in het eigen sjabloon. Dit bewijst nog niet dat Brevo geen tracking toevoegt; providerinstelling en ontvangen bron moeten worden gecontroleerd.

De tekst noemt maximaal twaalf nieuwsbrieven per jaar. Die gezamenlijke verzendgrens is nog een productievoorwaarde, geen al bewezen eigenschap van de losse RSS-stromen.

## Implementatie

`brevo.cjs` stuurt FIRSTNAME en LASTNAME uitsluitend mee binnen het DOI-verzoek. Geen aparte PUT naar een contact, geen directe lijsttoevoeging en geen unblock. `enabled=false` én `doiVerified=false` houden echte verzending uit. De nieuwe vlag mag pas aan na providerproeven; mocks zijn daarvoor geen bewijs. `redirectUrl` blijft leeg totdat er een echte goedgekeurde bevestigingspagina is; geen fictieve publieke succes-URL instellen.

`preview-flow.cjs` modelleert uitsluitend het gewenste gedrag in lokaal werkgeheugen. Geen eigen productie-abonneedatabase. Tokens hebben een doel, zijn eenmalig en verlopen in de demo na vijftien minuten. De Brevo-vervaltermijn is daarmee niet vastgesteld. Bevestigde voorkeuren worden aangevuld; uitschrijven verwijdert alle proefvoorkeuren. Een nieuwe bevestiging maakt oudere aanvragen ongeldig. Een uitschrijflink uit een eerdere bevestigde aanvraag blijft bruikbaar tot de proefvervaltermijn.

## Echte providerproef: nog uit te voeren

Er is toestemming gevraagd voor maximaal drie bevestigingsmails naar `mjjvandam+nieuwsbrief-test@gmail.com`, met fictieve naamgegevens en aparte lege testlijsten. Matthijs heeft deze proef expliciet goedgekeurd. Geen bestaand abonneecontact aanpassen of echte nieuwsbrief versturen.

1. **Nieuw adres:** controleer eerst dat het testadres niet bestaat. Vraag inschrijving aan met testnaam en testlijst A. Controleer vóór klikken dat naam/voorkeuren niet actief zijn. Na de klik: juiste naam en uitsluitend testlijst A.
2. **Bestaand adres:** vraag testlijst B en gewijzigde fictieve naam aan. Vóór klikken moeten bestaande naam en lidmaatschap intact blijven. Na de klik mogen alleen de aangevraagde wijzigingen zijn verwerkt, zonder verlies van A.
3. **Uitgeschreven adres:** schrijf uitsluitend het testcontact uit. Een nieuwe aanvraag mag de blokkade niet opheffen vóór bevestiging. Een oude bevestigingslink mag niet opnieuw inschrijven. Na een bewuste nieuwe bevestiging controleer de daadwerkelijke Brevo-uitkomst; resubscribe nooit afdwingen via PUT als de DOI-route dit niet ondersteunt.

Controleer ook verlopen/hergebruikte links, gelijktijdige aanvragen en providerfouten. Bewaar alleen ja/nee-uitkomsten, template-/lijst-ID's en tijden; geen sleutel, mailboxinhoud of bevestigingstokens in Git/logs. Controleer ontvangstbron op ongewenste open-/kliktracking. De test mag een providerbeperking opleveren: dan blijft `doiVerified=false` en volgt een aangepast voorstel voor de route.

Bronnen:
- https://developers.brevo.com/reference/create-doi-contact
- https://developers.brevo.com/reference/create-smtp-template

De API-documentatie bevestigt attributen, lijsten en DOI-placeholder, maar beschrijft het bovenstaande bestaande-contact- en blokkeergedrag niet volledig.

## Vrijgave

ADR-0008 dekt deze voorbereiding. Geen nieuwe ADR nodig; medische inhoud en publieke pagina's blijven ongewijzigd. Nodig vóór publieke activering: bewezen providerbevestiging, misbruikbescherming voor inschrijving, geschikte bevestigingspagina, privacyafstemming en expliciete livevrijgave. Automatische nieuwsbriefverzending blijft een aparte stap.


## Eerste echte aanvraag

Afzonderlijke testlijsten 9/10 en testtemplate 4 aangemaakt. Twee aanvragen werden met HTTP 400 afgewezen: “An active DOI template does not exist”. Na toevoegen van tag `optin` rapporteert de template doiTemplate=true. De volgende aanvraag gaf HTTP 201. Alleen deze geaccepteerde aanvraag telt als eerste mogelijke mail; geen herhaling na onzekere status.

Direct na de geaccepteerde aanvraag: testcontact GET geeft 404. Het adres is dus nog niet toegevoegd vóór de bevestiging. Mailboxontvangst en klik worden hierna gecontroleerd. Productieconcept 3 heeft nu eveneens tag optin en blijft inactief. De test-redirect gaat alleen naar de bestaande homepage en is geen nieuwe publieke bevestigingspagina.


## Eindresultaat echte proef

**Niet vrijgegeven.** Alle drie toegestane mails zijn aantoonbaar in de Gmail-inbox ontvangen. De eerste mail heeft SPF, DKIM en DMARC pass. Namen correct na bevestiging; lijst A daarna A+B correct; vóór de tweede bevestiging naam en lijsten ongewijzigd. Marketinguitschrijving is voor de proef via `emailBlacklisted=true` op uitsluitend het eigen testcontact ingesteld; de publieke unsubscribe-link is hiermee nog niet getest.

Na aanvraag 3 bleef de blokkade aanvankelijk true en de naam van aanvraag 2 intact. Het openen van de oude, reeds gebruikte link uit mail 2 activeerde vervolgens de naam van aanvraag 3 en maakte emailBlacklisted=false. Na opnieuw blokkeren en nogmaals openen van diezelfde oude link, zonder nieuwe aanvraag, bleef emailBlacklisted=true. De derde mail is ontvangen, maar haar eigen knop hoefde niet meer te worden gebruikt: de oude link had de nieuwste aanvraag al geactiveerd. Dit is een mislukte test, geen geslaagde herinschrijving. De vervaltermijn en gelijktijdige aanvragen zijn nog niet getest.

Bevestigingslinks zijn vanuit de ontvangen testmails door Codex geopend als onderdeel van de geautoriseerde proef. De redirect naar de bestaande homepage is in de browser zichtbaar. Geen conclusie over Gmail/Outlook visuele rendering; lokale HTML op mobiel wel gecontroleerd.

Brevo voegde openpixels en klikomleidingen toe. Instelling Transactional emails → Tracking → Anonymous email tracking=Yes opgeslagen; succesmelding bevestigd. De derde ontvangen mail bevat nog een pixel: anonieme tracking is dus niet hetzelfde als pixelvrije mail. Volgens Brevo zijn toekomstige open-/klikgebeurtenissen bij deze instelling niet aan individuele contacten gekoppeld. Marketinginstelling niet gewijzigd; blijft vóór publieke campagneactivering te controleren.

Afsluiting: testtemplate 4 inactief; productieconcept 3 inactief; testcontact geblokkeerd; alle vijf productielijsten 0 abonnees. Testlijsten 9/10 blijven bestaan als geïsoleerde proefadministratie. Geen vierde mail verstuurd. Voorstel alternatieve bevestigingsarchitectuur: ADR-0010, Proposed, needs owner validation.
