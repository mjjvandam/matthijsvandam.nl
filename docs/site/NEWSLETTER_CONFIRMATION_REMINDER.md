# Beheer bevestigingsherinnering

Actief vanaf 9 oktober 2026, alleen voor nieuwe native Brevo-aanmeldingen.
ADR-0015 is de beperkte uitzondering op de opslagkeuze uit ADR-0013.

## Bron en werking

Onderhouden bron: `lib/newsletter-reminders/`, drie
`api/newsletter-reminder-*.js`-handlers en `tests/newsletter-reminders-*.test.cjs`.
`local-mail-preview/reminders/` is de historische lokale bouwproef, geen tweede
productiebron. Publieke bevestiging en voorkeuren blijven native Brevo.

De geauthenticeerde Brevo-webhook 2241179 verwerkt `request` voor template 9.
Private Blob `mvd-doi-reminders` (store_8Ki4gfTGFQXONGlJ) en Queue staan in
Frankfurt. Alleen de drie herinneringsfuncties worden expliciet in fra1 geplaatst.
De Blob-koppeling gebruikt OIDC; er is geen langlevend read-write-token aangemaakt.

De eerste aanvraag per adres bepaalt de deadline: exact 48 uur later. Alleen
nieuwe aanvragen vanaf `DOI_REMINDER_START_AT`. Geen historische inhaalronde.
Een bestaand contact, afmelding, klacht, blokkade of ontbrekende bezorging
onderdrukt verzending. Onzekere providerstatus stopt de verwerking. Er zijn twee
contactcontroles, waarvan één direct vóór verzending. Er wordt niet op opens of
kliks beslist. De herinnering verwijst naar de oorspronkelijke bevestigingsmail.

De Queue bevat alleen een HMAC-sleutel. Private pending-data bevat e-mailadres,
bericht-ID en tijden. Na afhandeling wordt pending-data verwijderd. Dagelijkse
opruiming om 03:17 UTC verwijdert achterblijvers na zeven dagen; receipts zonder
adres na dertig dagen. De privacyverklaring beschrijft deze verwerking.

## Instellingen

Alleen Production heeft `BREVO_API_KEY`, `DOI_REMINDER_WEBHOOK_SECRET`,
`DOI_REMINDER_HASH_SECRET`, `CRON_SECRET`, `DOI_REMINDER_ENABLED` en
`DOI_REMINDER_START_AT`. Geheimen zijn sensitive. Store-ID en OIDC worden door
Vercel beheerd. Zet geen geheimen, adressen of bevestigingslinks in Git/logs.

Pauzeren: `DOI_REMINDER_ENABLED=false` instellen en opnieuw deployen; webhook
zo nodig uitschakelen in Brevo. Een onzekere SMTP-poging wordt nooit opnieuw
verzonden. Een atomair receipt bewaakt maximaal één poging, ook bij retries.
Een gemiste herinnering bij een crash of timeout is mogelijk. Een bevestiging
in het laatste netwerkinterval kan niet atomair met SMTP worden gecontroleerd.

## Controle

`npm run test:newsletter-reminders`: 17 tests voor timing, idempotentie,
concurrency, bevestiging, blokkades, providerfouten en opslagfouten.

Op 9 oktober zijn native formulier, echte Queue/Blob en Brevo samen getest:
herinnering bij onbevestigd en onderdrukking bij bevestigd. Alleen in die proef
is het tijdsverloop versneld. Een nieuwe live aanvraag gaf webhook 204 en een
private registratie met exact 48 uur tussen aanmeldtijd en deadline.
Proefcontacten en proefregistraties zijn na verificatie verwijderd.

Controleer operationeel de webhookstatus, Queue-fouten en het veilige
`doi_reminder_outcome`-log. Dit log bevat geen adres of aanvraag-ID. Meld een
verzendpoging niet automatisch als afgeleverd: bezorging volgt uit Brevo-log.
De oorspronkelijke bevestigingsmail bevat de uitleg over spam en veilige afzenders.
