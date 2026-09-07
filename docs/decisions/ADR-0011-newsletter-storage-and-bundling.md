# ADR-0011: Gedeelde nieuwsbriefopslag en bundeling per ontvanger

Status: Proposed

Uitvoeringsstatus 2026-09-07: niet gekozen; niet uitvoeren. Matthijs heeft expliciet bepaald dat er geen extra diensten bijkomen. Neon is niet ingericht. Dit voorstel blijft uitsluitend als historische afweging bewaard. De vervolgroute gebruikt de bestaande website/Vercel en Brevo, zie `local-mail-preview/BREVO_NATIVE_ROUTE.md`.

Decision owner: site owner / Matthijs

Owner validation: needs owner validation

Datum: 2026-09-07

## Doel en besluitgrens

Matthijs wil de nieuwsbriefbouw hervatten, met de goedgekeurde vormgeving en maximaal twaalf nieuwsbrieven per jaar. ADR-0010 dekt lokale bevestigingsbouw, maar sluit een nieuwe opslagprovider en persoonlijke digests uit. Dit voorstel breidt die grens uit. Het verandert de live contactroute niet. Geen account, betaalde dienst of nieuwsbriefverzending is hiermee geactiveerd.

## Voorgestelde keuze

Brevo blijft de maildienst en bron van bevestigde abonnees. Voeg Neon Postgres Free toe voor gedeelde aanvraagstatus en een minimaal verzendregister. Kies AWS Frankfurt bij inrichting. Gebruik waar mogelijk de Vercel Marketplace; controleer daar het daadwerkelijk aangeboden gratis pakket voordat er een resource wordt aangemaakt. Geen betaalde upgrade of betaalmethode toevoegen. Als de gratis variant daar ontbreekt, niet stilzwijgend een betaald alternatief kiezen.

Neon is hier een voorstel omdat SQL-transacties en unieke sleutels passen bij eenmalige bevestiging, uitschrijvingsvolgorde en verzendreserveringen. Dit is nog geen bewezen productie-implementatie: transacties, verbindingsgedrag en gelijktijdigheid moeten tegen de echte database worden getest.

## Gegevens en bewaartermijnen

- Openstaande aanvraag: tokenhash, e-mail, voornaam, achternaam, exacte voorkeuren, toestemmingstekstversie en tijdstippen. Link standaard dertig minuten geldig; aanvraaggegevens uiterlijk na 24 uur verwijderen met een geplande opruimtaak. Verlopen aanvragen worden ook zonder succesvolle opruimtaak direct geweigerd.
- Bevestigde abonneegegevens blijven bij Brevo. Geen tweede volledig adressenbestand in Neon.
- Verzendregister: HMAC-identificatie van ontvanger, editie-ID, artikel-ID's en inhoudsvingerafdrukken, reserverings-/verzendtijdstip, status en providerreferentie. Geen namen, berichtinhoud of e-mailadressen. HMAC-identificaties blijven persoonsgegevens; geen claim van anonimiteit.
- Register minimaal lang genoeg voor de grens over twaalf voortschrijdende maanden; voorstel dertien maanden voor afgeronde registraties. Geen dubbel artikel binnen deze periode. Na deze periode bepaalt de expliciete editie-inhoud wat opnieuw aangeboden wordt.
- Afmeldblokkades en onzekere verwerkingen worden niet automatisch vrijgegeven door het verstrijken van een aanvraag. Bewaar hiervoor uitsluitend noodzakelijke identificatie/status tot gecontroleerde afhandeling of geldige herinschrijving. Opruimen mag geen heractivering veroorzaken.
- Privacytekst, verwerkersafspraken, back-upretentie en feitelijke gegevensstromen controleren vóór externe persoonsgegevensverwerking. Een database in Frankfurt betekent niet dat de gehele Vercel/Brevo-keten uitsluitend in de EU verwerkt.

## Eén editie met de gekozen onderwerpen

Per ontvanger maximaal één mail per editie. Combineer de gekozen onderwerpen binnen diens doelgroep; verwijder dubbele artikelen. Alleen expliciet vrijgegeven, ongewijzigde artikelen uit het publicatieregister komen in aanmerking. Geen passende nieuwe artikelen betekent geen mail.

Gebruik de goedgekeurde vormgeving, naam, artikelafbeeldingen en onderwerpen in de intro. Een eigen titel en intro per editie blijven mogelijk. Jaar en editienummer horen bij de editie. Publicatievrijgave omvat de gebruikte tekst en afbeelding; afbeeldingen krijgen absolute publieke URL's en veilige alt-tekst.

Een wijziging van voorkeuren moet ook onderwerpen kunnen verwijderen: een bevestigde voorkeurwijziging vervangt de gekozen set binnen de gekozen doelgroep. Dit vergt een expliciete wijzigingsroute; de huidige lokale proef voegt keuzes samen en is hiervoor nog onvoldoende.

## Verzendbewaking

Controleer onmiddellijk vóór verzending de actuele toestemming, afmelding en artikelvrijgave. Reserveer ontvanger plus editie atomair en tel ook openstaande/onzekere reserveringen mee bij maximaal twaalf in twaalf voortschrijdende maanden. Bevestigingsmails vallen buiten dit nieuwsbriefmaximum en krijgen afzonderlijke misbruiklimieten.

Een providertime-out is geen bewijs van mislukte bezorging: registreer onzeker, houd de reservering vast en controleer de providerstatus voordat opnieuw verzonden mag worden. Geen claim van gegarandeerd precies-eenmaal-bezorging. Authenticatie, deduplicatie en volgorde van Brevo-webhooks worden onderdeel van de acceptatieproef. Uitschrijven gaat vóór openstaande verzendingen; reeds aan de provider overgedragen mail kan niet gegarandeerd worden teruggehaald.

## Uitvoering na akkoord

1. Opslaginterface asynchroon maken; atomair claimen, afmelden en herstel testen tegen gedeelde SQL-opslag, inclusief meerdere serverinstanties en database-uitval.
2. Brevo-adapter en aparte voorkeur-/uitschrijfroutes bouwen. Afmeldlinks in ontvangen nieuwsbrieven blijven bruikbaar; het lokale token met 24 uur geldigheid is geen productieoplossing voor blijvende afmelding.
3. Editievoorbereiding, bundeling en reserveringsregister bouwen; limieten, lege selectie, dubbele artikelen, gewijzigde beelden en onzekere verzending testen.
4. Met afzonderlijke toestemming echte proefmails sturen, ontvangen mail controleren, voorkeuren wijzigen en afmelden. Daarna expliciete publieke vrijgave vragen voor formulier, verwijzingen, subtiele blokjes en eventueel de eenmalige pop-up.

## Kosten en bronnen

Op 7 september 2026 vermeldt [Neon pricing](https://neon.com/pricing) Free zonder creditcard, 0,5 GB opslag, 100 CU-uren en 5 GB uitgaand verkeer per project per maand. Bij het bereiken van gratis limieten wordt compute opgeschort; niet automatisch upgraden. Dit is ruim genoeg als startaanname, geen capaciteitsgarantie. Brevo- en Vercel-limieten blijven daarnaast gelden en moeten vóór activering opnieuw worden gecontroleerd.

[Neon regions](https://neon.com/docs/introduction/regions) vermeldt AWS Frankfurt. Bronpagina's tijdens deze voorbereiding gelezen; actuele inrichting, voorwaarden en beschikbare regio nog controleren in het account.

## Verificatie van bestaande basis

De vier lokale testbestanden `test.cjs`, `contact-api.test.cjs`, `preview-flow.test.cjs` en `confirmation-service.test.cjs` slagen op 7 september 2026: 39/39. Dit bewijst uitsluitend de bestaande lokale basis, niet de voorgestelde externe opslag of echte nieuwsbriefverzending. Geen productiecode of publieke pagina aangepast voor dit voorstel.
