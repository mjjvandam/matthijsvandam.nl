# ADR-0015: Eén bevestigingsherinnering na 48 uur

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs gaf op 9 oktober 2026 expliciet "akkoord" nadat aanvullende aanvraagregistratie en verzendplanning binnen de bestaande websiteomgeving waren voorgelegd. Dit accepteert de onderstaande beperkte uitzondering op ADR-0013; het is geen bewijs van livewerking.

## Context

Op 9 oktober 2026 vroeg Matthijs om één automatische herinnering wanneer een
nieuwe aanmelding na twee dagen nog niet via de bevestigingsmail is bevestigd.
Deze functionele opdracht is expliciet; zij is geen stilzwijgende keuze voor een
andere technische inschrijfroute. ADR-0013 kiest native Brevo en sluit eigen
bevestigingsopslag uit.

Brevo documenteert dat onbevestigde native aanmeldingen uitsluitend in event-
en transactionele logs staan, niet in de contactlijst. De bestaande actieve
workflow is `MVD - melding bevestigde inschrijving` (ID 1). De geraadpleegde
native-documentatie biedt geen kant-en-klare bevestigingsherinnering; een
werkende uitvoering via gewone contactautomatisering is niet aangetoond.

Bron, geraadpleegd 9 oktober 2026:
https://help.brevo.com/hc/en-us/articles/208733449-Double-opt-in-DOI-What-it-is-and-how-to-track-user-sign-ups

## Besluit

- Eenmalige, zakelijke herinnering 48 uur na de oorspronkelijke aanmelding.
- Meteen vóór verzenden daadwerkelijk controleren of bevestiging ontbreekt.
- Niet afgaan op openen of kliktracking; succesvolle DOI-bevestiging is bepalend.
- Geen herinnering na bevestiging, afmelding, klacht of definitieve bezorgfout.
- Dubbele formulieraanvragen mogen geen parallelle herinneringen veroorzaken.
- Alleen nieuwe aanmeldingen vanaf activering, geen historische inhaalverzending.
- Native bevestiging en expliciete onderwerpkeuzes behouden; geen automatische inschrijving.

## Afgebakende uitzondering op ADR-0013

Aanvullende tijdelijke registratie en planning binnen Vercel zijn toegestaan
voor deze eenmalige herinnering. De native Brevo-inschrijving blijft leidend.
Geen eigen bevestigingstokens, automatische bevestiging, nieuwe leverancier of
betaald pakket. ADR-0013 blijft voor alle overige onderdelen leidend.

De lokale uitvoering gebruikt een private Blob-opslag en Vercel Queues met
48 uur vertraging. Alleen e-mailadres, oorspronkelijke bericht-ID en tijden
staan tijdelijk in private opslag; de wachtrij bevat uitsluitend een HMAC-sleutel.
Na afhandeling wordt het e-mailadres verwijderd. Dagelijkse opruiming verwijdert
achtergebleven aanvragen na zeven dagen en deduplicatiereceipts na dertig dagen.
Geen bevestigingslinks, geheimen of persoonsgegevens opnemen in Git.

## Herinneringsmail

Onderwerp: Bevestig je inschrijving voor mijn nieuwsbrief

Je hebt je twee dagen geleden aangemeld voor mijn nieuwsbrief. Je inschrijving
is nog niet bevestigd.

Wil je de nieuwsbrief ontvangen? Open dan de eerdere bevestigingsmail en klik
op ‘Bevestig mijn inschrijving’. Kijk ook in je spammap. Vind je het bericht daar,
markeer het dan als ‘Geen spam’ en verplaats het naar je inbox. Je kunt
website@mail.matthijsvandam.nl toevoegen aan je contacten of veilige afzenders.

Wil je de nieuwsbrief toch niet ontvangen of heb je je niet zelf aangemeld?
Dan hoef je niets te doen. Dit is de enige herinnering.

Hartelijke groet,
Matthijs van Dam

## Verificatie en status

Actief sinds 9 oktober 2026. Productiecode: commit `bc49f60`, geïntegreerd in
`8c0cac0`. Eerste live deployment: `dpl_3LV1LFmtgGdgGuvndNSc58woYKuq`.
De native Brevo-webhook (ID 2241179) ontvangt uitsluitend transactionele `request`-
gebeurtenissen en gebruikt bearer-authenticatie. Alleen template 9 wordt verwerkt.

Private opslag `mvd-doi-reminders` staat in Frankfurt. De huidige Blob-SDK gebruikt
Vercel OIDC met `BLOB_STORE_ID`; er is geen langlevend Blob-read-write-token gemaakt.
Brevo-, HMAC-, webhook- en cron-geheimen staan als sensitive productievariabelen.

Bewijs van 9 oktober 2026:
- 17 lokale tests slagen, inclusief 48 uur, deduplicatie/concurrency, afmelding,
  blokkade, onbekende providerstatus en onzekere verzendpoging.
- Twee eigen native formulieraanmeldingen: een onbevestigde proef kreeg via de
  echte Queue en Brevo één herinnering; een bevestigde proef werd onderdrukt.
  Alleen voor deze gecontroleerde proef is de verstreken tijd gesimuleerd.
- Een derde nieuwe live formulieraanmelding kwam via de echte webhook (HTTP 204)
  in private opslag. `dueAt - at` was exact 48 uur; wachtrijpublicatie slaagde.
- Spam-uitleg staat in de actieve oorspronkelijke bevestigingsmail en is ook
  in de ontvangen proefmail gecontroleerd.
- Ongeauthenticeerde webhook geeft 401; tijdelijke testfunctie bestaat niet op
  de publieke website (404); live privacytekst komt exact overeen met de release.
- Sitekwaliteit, publicatieverificatie en deploymentgrens slagen in de geïsoleerde
  release. De al publieke bevestigingspagina is als supportbestand herkend.

Proefcontacten en proefregistraties zijn na de controle verwijderd. De echte
48 uur is niet in deze chat afgewacht. Dat tijdsverloop wordt door de duurzame
Queue uitgevoerd; de eigenlijke productiecode is niet versneld.

Een bevestiging tussen de laatste Brevo-controle en SMTP-aanvraag kan niet
atomair worden uitgesloten. Onzekerheid bij verzenden wordt niet opnieuw
verzonden: maximaal één verzendpoging, ten koste van mogelijk gemiste herinnering.
Geen nieuwe medische inhoud, indexeringswijziging of automatische inschrijving.
