# ADR-0013: Native Brevo-route zonder eigen bevestigingsopslag

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs vroeg na uitleg van het oude-linkgedrag expliciet: "ja maak die ingewikkelde route ongedaan en werk verder met brevo".

## Besluit

Brevo verzorgt aanmelden, dubbele bevestiging, voorkeurwijziging en uitschrijving. De native proef liet zien dat een oude bevestigingslink een latere aanvraag voor hetzelfde adres kan bevestigen. Matthijs accepteert deze beperking voor de praktische nieuwsbriefroute. Dit is geen bewijs dat de overige controles of de afmeldroute al slagen. Geen algemene uitspraak dat dit gedrag in alle situaties veilig is.

De extra eis van een strikt aanvraaggebonden eigen token vervalt voor deze native route. ADR-0012 wordt hiermee Superseded; de lokale proef uit ADR-0010 wordt niet verder naar productie gebracht. ADR-0010 blijft historische lokale testdocumentatie. Geen Blob-/databasekoppeling voor de nieuwsbrief. De onvoltooide Blob-module verwijderen en de ongebruikte Vercel-resource ontkoppelen/opruimen.

## Behouden voorwaarden

- Native dubbele bevestiging blijft aan; geen single opt-in als sluiproute.
- Verplichte voornaam, achternaam, e-mailadres en expliciete onderwerpkeuze/toestemming.
- Voorkeurwijziging via Brevo's contactgebonden profielroute; zichtbare uitschrijflink in iedere nieuwsbrief.
- Doelgroep en onderwerp blijven afzonderlijke keuzes. De huidige testlijsten zijn geen productieformulier.
- Maximaal twaalf nieuwsbrieven per ontvanger per jaar. Losse RSS-stromen mogen die afspraak niet ongemerkt vermenigvuldigen. Eerst conceptcampagnes, gezamenlijke controle; automatisering pas na aantoonbare frequentiebewaking.
- Goedgekeurde nieuwsbriefvormgeving behouden. Geen medische inhoud automatisch vrijgeven.
- Geen nieuwe leverancier, betaald pakket of publieke activering op grond van dit besluit. De laatste stap blijft een echte proef en afzonderlijke livevrijgave.

## Vervolg

Maak eerst de native bevestigingsmail Nederlandstalig en herkenbaar. Bereid productie-aanmeldkeuzes, profielwijzigingsformulier en uitschrijving voor. Test normale aanmelding, voorkeurwijziging en afmelding; de inmiddels geaccepteerde oude-linkbeperking is geen nieuwe blokkade voor de bouw.
