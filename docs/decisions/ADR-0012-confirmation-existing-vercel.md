# ADR-0012: Bevestigingsopslag binnen bestaande Vercel-hosting

Status: Superseded

Vervangen op expliciet besluit van Matthijs: "ja maak die ingewikkelde route ongedaan en werk verder met brevo". Zie ADR-0013. Onderstaande tekst is historische context en mag niet als actuele bouwopdracht worden gebruikt. De onvoltooide lokale Blob-module is verwijderd; geen live endpoint heeft deze gebruikt.

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs gaf na uitleg van dit voorstel expliciet akkoord: "ik snap niet precies wat t probleem is , maar klink goed. ga hier mee door". Dit akkoord omvat private Vercel-opslag en de bouw/proef binnen het bestaande Hobby-account, zonder betaald pakket. Publieke activering en echte nieuwsbriefverzending blijven afzonderlijk vrij te geven.

Datum: 2026-09-07

## Aanleiding en opdrachtgrens

Zowel de geteste Brevo DOI-API als het native proefformulier lieten een eerder gebruikte link een latere aanvraag activeren. De native proef staat in `local-mail-preview/BREVO_NATIVE_ROUTE.md`. Matthijs vraagt onderzoek naar een oplossing binnen Brevo en de bestaande website, zonder extra diensten. Dit document is dat onderzoek, geen toestemming voor provisioning of implementatie.

## Onderzochte opties

- Brevo native formulier: de concrete proef faalt op de afgesproken oude-linkeis.
- Eigen ondertekende link zonder blijvende status: kan de oorspronkelijke inhoud vastleggen, maar bewijst niet dat een link nog de actuele aanvraag is of inmiddels is ingetrokken. Daarom onvoldoende voor de bestaande eisen.
- Brevo-contactattributen gebruiken als tokenopslag: de onderzochte Contacts API documenteert lezen en wijzigen, maar ik heb daarin geen voorwaardelijke atomaire update gevonden waarmee twee serverinstanties hetzelfde token niet beide kunnen verwerken. Een voorafgaande GET gevolgd door PUT is geen bewezen eenmalige claim. Niet als veilige databasevervanger implementeren.
- Vercel private Blob: mogelijke technische kandidaat bij de bestaande leverancier. De actuele documentatie beschrijft private opslag en `ifMatch`/ETag voor voorwaardelijke wijzigingen. Dat kan een bouwsteen zijn voor de gedeelde aanvraagstatus uit ADR-0010. Het is wel een extra opslagproduct/resource en krijgt dus niet automatisch toestemming op basis van "geen extra diensten".

## Kleinste voorstel, alleen na eigenaarbesluit

Behoud Brevo voor mail en bevestigde abonnees. Gebruik de bestaande eigen bevestigingspagina en serverroute; bewaar aanvraagstatus in een private Vercel Blob-store. Geen Neon, Upstash of nieuwe leverancier/account. Geen betaalde upgrade.

Per e-mailadres een niet omkeerbaar benoemd record met HMAC-identificatie en wisselende revisie. Bewaar daarin de huidige aanvraag, tokenhash, vervaltijd en afmeld-/verwerkingsstatus. De aanvraaggegevens verdwijnen uiterlijk na 24 uur via een dagelijkse opruimtaak; bij verlopen token nooit verwerken, ook als opruimen vertraagd is. Niet claimen dat Blob een automatische TTL heeft. Bevestigde abonneegegevens blijven bij Brevo. Onzekere verwerkingen en afmeldblokkades vragen afzonderlijke minimale retentie en gecontroleerd herstel.

Gebruik voor iedere statusovergang een voorwaardelijke write op exact de gelezen revisie. Initieel aanmaken moet aantoonbaar eenmalig zijn. Geen los `head()` plus een anders gecachte payload combineren. Cachegedrag, gelijktijdige requests, maximaal schrijfritme per pad, initialisatieconflicten en provider-time-outs zijn nog te beproeven. CAS is een bouwsteen, geen bewijs van een volledig veilig protocol.

Een afmelding moet een lopende bevestiging kunnen intrekken zonder dat een vertraagde Brevo-update ongemerkt opnieuw activeert. Houd bij onzekerheid de eigen verzendpoort gesloten. De huidige geheugenadapter met proceslokale locks is niet geschikt voor productie en kan niet simpelweg door losse Blob-aanroepen worden vervangen.

## Kosten en werking bij uitval

Volgens de op 7 september 2026 geraadpleegde Vercel-documentatie is Blob op Hobby gratis binnen 1 GB opslag, 10.000 simpele en 2.000 geavanceerde operaties, met 10 GB dataverkeer. Private opslag heeft dezelfde opslag-/operatietarieven. Bij overschrijding wordt toegang geblokkeerd, zonder meerkosten op Hobby; hervatting kan 30 dagen wachten. Geen gratis capaciteitsgarantie voor een onbeperkt aantal aanmeldingen. Ontwerp eerst een operatieraming inclusief opruimen, retries, misbruik en monitoring.

Bij onbereikbare opslag: geen bevestiging, heractivering of nieuwsbriefverzending. Afmelden bij Brevo moet zo veel mogelijk rechtstreeks mogelijk blijven; een mislukte lokale synchronisatie mag niet als afgerond worden gemeld. Contactformulier blijft onafhankelijk.

## Vereiste proef voordat dit een oplossing heet

1. Account: private store beschikbaar op bestaande Hobby, daadwerkelijke gratis limieten en passende regio; geen contract of toegang stilzwijgend uitbreiden.
2. Met uitsluitend fictieve data: twee onafhankelijke instanties, één atomaire claim, oude/verlopen links, gelijktijdige aanvraag en afmelding, cacheconflicten en opslaguitval.
3. Echte Brevo-keten: bevestiging, voorkeurwijziging, afmelding, heraanmelding en vertraagde providerupdate. Afzonderlijk testmailakkoord waar nodig.
4. Privacy, bewaartermijnen, misbruiklimieten, geen gevoelige logs; concrete livevrijgave.

Deze beslissing lost niet automatisch de bundeling en maximaal twaalf nieuwsbriefbezorgingen op. Dat blijft een apart, expliciet te testen onderdeel binnen dezelfde gekozen leveranciers.

## Bronnen

- https://developers.brevo.com/reference/update-contact — gewone contactupdates; geen aangetroffen CAS-contract.
- https://vercel.com/docs/vercel-blob — conditional writes met `ifMatch`.
- https://vercel.com/docs/vercel-blob/using-blob-sdk — private reads en ETag-opties; details in technische proef te toetsen.
- https://vercel.com/docs/vercel-blob/usage-and-pricing — Hobby-ruimte en blokkade bij overschrijding.

## Uitvoeringsstatus

Na het bovenstaande eigenaarakkoord is `mvd-newsletter-confirmation` aangemaakt: private Blob-store `store_ks1LwSBx4FbE6C0Y`, regio FRA1, binnen het bestaande Hobby-team en gekoppeld aan `matthijsvandam-nl`. Dashboard toont de inbegrepen ruimte van 1 GB, 10k simpele en 2k geavanceerde operaties, 10 GB verkeer. Prefix `NEWSLETTER`, geen optionele vaste read-write-token toegevoegd. Geen nieuwsbriefendpoint of verzending geactiveerd. ADR-0010 blijft Accepted voor de eerdere lokale scope; ADR-0011 blijft niet gekozen.
