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

## Conceptmail

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

Lokaal gebouwd onder `local-mail-preview/reminders/`, buiten deployment.
Zeventien lokale tests geslaagd. Nog niet actief; geen herinneringsmail verzonden.
Voor activering
moeten ten minste de volgende situaties slagen: onbevestigd na 48 uur,
bevestigd vóór de deadline, bevestiging tijdens de wachttijd, dubbele aanvraag,
afgemeld contact en mislukte verzending zonder dubbele retry. Een eventuele
nieuwe bevestigingslink vraagt een afzonderlijke ketentest. De huidige mail
verwijst naar de oorspronkelijke bevestigingsmail en maakt geen nieuwe link.

De Vercel-connector gaf 403 bij omgevingsinstellingen en Blob-aanmaak. Via het
dashboard is een ongekoppelde oude Blob-resource zichtbaar, waarvan private
toegang nog niet is geverifieerd. Niet zonder controle hergebruiken. Opslagrechten,
geheimen, webhook en provider-ketentest blijven open. De browser vereist een
actiegebonden bevestiging vóór het verlenen van nieuwe opslagrechten.

Een bevestiging tussen de laatste Brevo-controle en SMTP-aanvraag kan niet
atomair worden uitgesloten. Onzekerheid bij verzenden wordt niet opnieuw
verzonden: maximaal één verzendpoging, ten koste van mogelijk gemiste herinnering.
