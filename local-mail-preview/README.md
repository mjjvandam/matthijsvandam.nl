# Lokale contact- en nieuwsbriefbouw

Deze hele map is uitgesloten van Vercel via `.vercelignore`. Geen publieke route, mailing of abonnee-import is geactiveerd. De bestaande `api/contact.js` is inmiddels lokaal naar Brevo gemigreerd, standaard uit en nog niet gedeployed.

## Starten

Met Node.js 22 of hoger:

```sh
node local-mail-preview/server.cjs
node --test local-mail-preview/test.cjs
node local-mail-preview/generate-feeds.cjs
node local-mail-preview/generate-feeds.cjs --check
```

Op deze Mac staat de beschikbare Node-runtime op `/Users/matthijsvandam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`. Gebruik dat pad in plaats van `node` wanneer Node niet in PATH staat.

Open http://127.0.0.1:8879. De server luistert uitsluitend op loopback, controleert Host en Origin, serveert alleen een vaste bestandslijst en verstuurt nooit externe mail. `MVD_PREVIEW_PORT` kan een andere lokale poort instellen.

## Onderdelen

- `index.html`, `preview.css`, `app.js`: lokale formulierpreview met bestaande CSS-tokens. Voorbeeldstromen zijn inhoudelijke keuzes ter beoordeling, geen goedgekeurde mailinglijsten.
- `core.cjs`: strikte veldvalidatie, selectie op bestaande doelgroep/thema/project-IDs, bronfingerprint en RSS-escaping.
- `server.cjs`: lokale simulatie van contact, bevestigen en afmelden. Tijdelijke testgegevens staan uitsluitend in werkgeheugen. Geen productie-abonneedatabase en geen bewijs van Brevo-bezorging.
- `brevo.cjs`: afzonderlijke transportadapter voor contactmail en double opt-in. Standaard uit. Niet geïmporteerd door de previewserver. Gemockt getest tegen het gedocumenteerde requestformaat; op 2026-09-06 ook gebruikt voor één toegestane echte contacttest; Brevo accepteerde het bericht.
- `config.json`: voorbeeldstromen, lege vrijgavelijst, geen startdatum. Artikelen op de preview zijn slechts kandidaten. Niemand heeft ze voor distributie goedgekeurd.
- `generate-feeds.cjs`: genereert alleen lokaal en kan verouderde uitvoer signaleren. Alle huidige feeds zijn leeg.

## Grenzen van deze bouw

Productie vereist nog een publieke endpointintegratie met aantoonbare spamcontrole over serverinstanties, persistente bescherming tegen dubbele verzoeken en een quota-/storingsprocedure. De lokale proeflimiet is geen productiebeveiliging. Het transport doet bij onzekerheid geen retry, maar garandeert zelf geen exactly-once verzending.

De Brevo double-opt-in- en afmeldsemantiek bij bestaande adressen moet nog met expliciet toegestane testadressen worden bewezen. Daarom gebruiken we geen directe contactupdates of het opheffen van blokkades. Providerbevestiging betekent slechts acceptatie, geen inboxbezorging.

Een artikelvrijgave bevat `articleId`, `approvedBy` (Matthijs van Dam), `fingerprint`, `releasedAt` en `streams`. De fingerprint bindt titel, samenvatting, URL, datum, doelgroep, thema's, project en alle HTML-bytes. De generator weigert gewijzigde of niet-geverifieerde versies en ongeldige doelgroepen. Hij controleert niet zelfstandig of een pagina werkelijk live staat: dat is een verplichte releasecontrole vóór aansluiting op Brevo. Conceptfeeds blijven buiten deployment.

Een formulier voor beveiligde voorkeurwijzigingen, providerlijsten, bevestigingstemplate, DNS, privacybewaartermijnen en uiteindelijke RSS-planning zijn nog in te richten. Er worden geen echte nieuwsbriefteksten geschreven. De lokale privacytekst beschrijft uitsluitend de proef en vervangt de publieke privacyverklaring niet.

## Gecontroleerd op 2026-09-06

- 11 Node-tests: validatie, bron-/doelgroepgates, RSS en nagebootste Brevo-requests.
- Browser: contact controleren; inschrijven, bevestigen en afmelden met fictief adres.
- 360, 390 en 430 pixels: geen horizontale overflow; donkere mobiele weergave visueel gecontroleerd.
- Sitekwaliteit, publicatieverificatie en SEO-basis: geslaagd na toevoeging van het bestaande navigatiecontract aan de preview.
- Geen `package.json`: geen npm-checks beschikbaar.

## Bijgestelde keuzes van Matthijs

Vijf voorkeurstromen: Algemeen, Voet en enkel voor patiënten/zorgprofessionals en Transmuraal Tilburg Cohort voor patiënten/zorgprofessionals. Onderzoek vervalt als afzonderlijke keuze. Algemeen matcht beide bestaande doelgroepen zonder onderwerpfilter. Dit vraagt beoordeling van de daadwerkelijke inhoud voor die algemene stroom vóór vrijgave.

De gewenste inschrijftekst belooft maximaal twaalf nieuwsbrieven per abonnee per jaar, over alle voorkeuren samen. De configuratie legt dit vast, maar losse RSS-campagnes handhaven die gezamenlijke grens nog niet. Productieactivering blijft geblokkeerd totdat bundeling of een gezamenlijke frequentiebeperking is ontworpen, goedgekeurd en getest. De huidige preview verstuurt niets.

Nieuwsbriefnamen: op verzoek van Matthijs zijn verplichte voornaam en achternaam toegevoegd aan de lokale preview, met servervalidatie (niet leeg, maximaal 120 tekens per veld). Dit verruimt het oorspronkelijke e-mail-only formulier op expliciet verzoek. De Brevo-adapter verstuurt deze namen nog niet; veldmapping en het moment van opslaan moeten samen met double opt-in en privacy worden gecontroleerd vóór activering.

## Ontvangstadres contact

Matthijs heeft mjjvandam@gmail.com expliciet aangewezen als ontvanger van professionele contactberichten. Dit staat als contactRecipient in config.json. De lokale proefserver verstuurt nog steeds niets; de productiekoppeling moet dit adres server-side als vaste ontvanger gebruiken. Het bezoekersadres wordt uitsluitend Reply-To. De verzendidentiteit is geverifieerd en Brevo heeft één echte contacttest geaccepteerd. Inboxontvangst is door Matthijs bevestigd; duurzame hostingconfiguratie staat nog open; zie MAIL_SETUP.md.


Bevestigingsmail: `templates/confirm-subscription.html` (Brevo concept 3).
Scenario's en echte acceptatieproef: `DOI_ACCEPTANCE.md`.
Aanvullende lokale tests: `node --test local-mail-preview/test.cjs local-mail-preview/contact-api.test.cjs local-mail-preview/preview-flow.test.cjs` vanaf de repo-root. De mockserver bewijst geen providergedrag. Names staan uitsluitend in DOI-payload; `doiVerified=false` houdt deze route uit totdat de echte proef slaagt.


## Actieve route na akkoord op ADR-0010

De lokale server gebruikt nu confirmation-service.cjs met confirmation-store.cjs en een fake mailprovider. De Brevo DOI-route is permanent afgekeurd in de adapter. Zie CONFIRMATION_IMPLEMENTATION.md voor architectuur, checks en grenzen. De vormgeving staat op http://127.0.0.1:8879/nieuwsbriefvoorbeeld. Een fictieve inschrijving maakt een lokale proefmail met een aanvraaggebonden link naar de nieuwe bevestigingspagina. Er is geen nieuwe echte mailversturing aangesloten.

Volledige tests: node --test local-mail-preview/test.cjs local-mail-preview/contact-api.test.cjs local-mail-preview/preview-flow.test.cjs local-mail-preview/confirmation-service.test.cjs (39 tests). REGRESSION_REVIEW.md bevat de beoordeling en zes lokale navigatiemeldingen uit de algemene sitecheck.
