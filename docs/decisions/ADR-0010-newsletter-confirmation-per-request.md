# ADR-0010: Nieuwsbriefbevestiging per afzonderlijke aanvraag

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs gaf expliciet akkoord op de lokale bouw na het voorstel in deze taak. Dit omvat geen nieuwe opslagprovider, betaald pakket of publieke activering.

Datum: 2026-09-06

## Aanleiding

Tijdens de door Matthijs goedgekeurde Brevo-proef ontvingen we drie bevestigingsmails op één eigen testadres, met fictieve namen en uitsluitend testlijsten 9/10. Nieuwe inschrijving en wijziging van naam/lijst werkten pas na de bevestiging. Bij opnieuw aanmelden na een via de API ingestelde marketingblokkade bleef die blokkade aanvankelijk intact. Hergebruik van de al gebruikte bevestigingslink uit mail 2 activeerde echter de naam uit aanvraag 3 en hief de blokkade op. Na opnieuw blokkeren, zonder nieuwe aanvraag, had nogmaals dezelfde link openen geen effect. Dit wijst op een link die niet uitsluitend aan de oorspronkelijke aanvraag gebonden is.

Dit resultaat voldoet niet aan onze vereiste dat een oude bevestigingslink geen nieuwe aanvraag of uitschrijving mag wijzigen. Geen claim over alle Brevo-producten of native formulieren; deze specifieke API-route is beproefd. De testcontactstatus is weer geblokkeerd, template 4 is inactief, productieconcept 3 blijft inactief en de vijf productielijsten blijven leeg. `doiVerified=false` blijft verplicht.

## Voorstel

Gebruik Brevo voor mailbezorging en bevestigde abonnees. Laat de eigen server de bevestiging van elke individuele aanvraag bewaken, met kortstondige gedeelde opslag voor uitsluitend openstaande aanvragen en verwerkingsstatus. Geen permanente eigen abonneedatabase en geen persoonlijke nieuwsbriefdigests.

- Iedere aanvraag krijgt een cryptografisch willekeurig geheim; server bewaart uitsluitend de hash als tokenidentificatie, plus de strikt noodzakelijke aanvraaggegevens. Korte vastgelegde bewaartermijn, automatische verwijdering/TTL.
- Token is gebonden aan één e-mailadres, naam, exacte voorkeuren, toestemmingstekstversie en vervaltijd. Een nieuwe aanvraag vervangt de eerdere openstaande aanvraag voor hetzelfde adres.
- Openen van een link toont eerst de bevestiging; pas een bewuste POST verwerkt de aanvraag. Zo activeert een mailscanner die alleen links opent niet direct een inschrijving.
- Bevestiging wordt atomair één keer verbruikt. De gegevens zijn server-side vastgelegd; de bezoeker kan de payload niet aanpassen via de URL.
- Pas na geldige bevestiging mag de server de vastgelegde wijziging aan Brevo aanbieden. Providerfouten en onzekere resultaten leiden tot een afgeschermde herstelstatus, niet tot blind opnieuw uitvoeren.
- Uitschrijven heeft voorrang op openstaande aanvragen en verwerkingen. Dit vraagt een betrouwbaar, geauthenticeerd afmeldsignaal, idempotentie en tests van races tussen bevestigen en afmelden. Herinschrijven vereist een nieuwe expliciete aanvraag en bevestiging na de afmelding.
- Geen tokens, namen, e-mails of bevestigings-URL's in technische logs, analytics of Git. Geen contactinhoud in de tijdelijke opslag.

## Kosten en hosting

Vercel Hobby blijft de gekozen ontwikkelomgeving. Lokale implementatie krijgt eerst een opslaginterface en testopslag. Productie vereist een gedeelde store met atomaire bewerkingen en TTL; process memory en het tijdelijke Vercel-filesysteem voldoen niet. Een concrete provider, gratis limieten, gegevenslocatie, verwerkersafspraken en quota moeten vooraf worden vastgesteld. Geen betaalde afhankelijkheid, automatische upgrade of nieuw account op grond van dit voorstel.

## Acceptatieproeven

- Bestaande 27 checks behouden, plus atomair eenmalig verbruik over meerdere instanties.
- Oude bevestigingslink na nieuwe aanvraag, afmelding en heraanmelding doet niets.
- Linkscanner/GET doet niets; gewijzigde of verlopen token doet niets.
- Gelijktijdige bevestigingen, afmelding tijdens verwerking en provider-time-out veroorzaken geen dubbele of ongewenste inschrijving.
- Nieuwe naam en voorkeuren wijzigen niet vóór de juiste bevestiging.
- Geen individueel open-/klikprofiel; providertrackinginstelling en ontvangen mailbron controleren.
- Echte providerproef na lokale checks; geen publieke activering zonder afzonderlijk akkoord.

## Besluitgrens

Dit verandert de bevestigingsarchitectuur uit ADR-0008 en voegt tijdelijke persoonsgegevensopslag toe. De lokale bouw is door Matthijs goedgekeurd. De implementatie gebruikt uitsluitend lokale testopslag; er wordt geen externe opslagprovider ingericht. Privacytekst, bewaartermijn, providerkeuze, productievrijgave en twaalf-per-jaar-grens blijven afzonderlijk te controleren. ADR-0008 wordt hiermee niet automatisch Superseded.
