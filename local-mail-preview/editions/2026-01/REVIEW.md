# Eerste concepteditie — artrose, obesitas en cohort

Status: concept, niet voor verzending vrijgegeven. Geen campagne ingepland.
Drie bestaande artikelkaarten; titels en samenvattingen ongewijzigd uit content.js.
Nieuw geschreven: korte inleiding en editieonderwerp. Fingerprints in editorial-review.json.
De websitegoedkeuring geldt niet als nieuwsbriefdistributie-akkoord; config.json releases blijft leeg.

## Verzendregels

Brevo blijft bron van contacten, toestemming, uitschrijving en verzendhistorie.
Geen abonneedatabase, nieuwe leverancier of eigen bevestigingstokens toegevoegd.
De lokale edition-preflight.cjs rekent uitsluitend met aangeleverde momentopnamen:
- adresseert ieder e-mailadres eenmaal, ook bij overlap tussen lijsten;
- neemt een artikel eenmaal op;
- blokkeert onbevestigde/afgemelde adressen en ontbrekende distributievrijgave;
- blokkeert dezelfde editie bij verzonden, openstaande of onzekere status;
- telt nieuwsbriefcampagnes over alle onderwerpen binnen twaalf voortschrijdende maanden;
- telt sent/delivered-events van dezelfde campagne eenmaal; bevestigings-/contactmails tellen niet mee;
- stopt bij onvolledige/verouderde providerhistorie, tegenstrijdige gegevens en overschreden dagquota.
Tien tests met fictieve adressen slagen. Dit is een read-only proefberekening, geen productie-verzendpoort.
Er is geen eigen productieopslag of automatische verzending gebouwd of geactiveerd.

Voor feitelijke verzending is een actuele complete Brevo-readback nodig en één exclusieve
verzendronde, met nacontrole vóór herhaling. Parallel handmatig verzenden buiten die route
kan een lokale proefberekening omzeilen; zolang providerbegrenzing niet is bewezen blijft
automatische verzending uit. Bestaande RSS-stromen worden niet elk afzonderlijk aangezet.

Bron over native frequentiebewaking (12 september 2026):
https://help.brevo.com/hc/en-us/articles/7428460876690-Limit-your-marketing-pressure-with-sending-cadence-Frequency-cap-and-Email-overload-prevention
Brevo beschrijft een globale marketinglimiet en expliciete inclusie van automations;
de concrete beschikbare periode en accountfunctie moeten in dit account worden gecontroleerd.

## Live artikelcontrole

Webtool kon de drie artikel-URLs niet openen (safe-to-open-blokkade). Geen alternatieve
netwerkroute gebruikt. De lokale artikelen en bestaande sitegoedkeuring zijn beschikbaar;
actuele externe beschikbaarheid is bij deze editiebouw niet bewezen.

## Ketenproef

Gebruiker heeft eerste native aanvraag uitgevoerd. Gmail bevestigt ontvangst van één
bevestigingsmail op 12 september 2026 21:44:49 UTC. Brevo-contact 1 stond vóór bevestiging
op uitsluitend de bestaande lijst #2. Bestaand contact was al email-subscribed;
deze proef bewijst dus specifiek de onderwerpwijziging en niet een geheel nieuw contact.
Bevestigingsklik, nieuwe lijstkeuze, voorkeurwijziging en afmelding nog te controleren.
Budget en mail-ID in test-budget.json. Maximum vijf mails uitsluitend naar het eigen adres.

Aanvullende provider-readback: bevestiging geslaagd (screenshot van Matthijs).
Brevo-contact 1 toont lijst #7 toegevoegd, naast bestaande lijst #2, en de testnaam
van Dam test 1. Aanmelding en onderwerpkeuze voor dit bestaande adres zijn bewezen.
De bevestigingspagina is Engels; Nederlandse afronding blijft een verbeterpunt.
Sending cadence in het huidige account toont Upgrade en een uitgeschakelde,
niet bedienbare Activate frequency cap. Native frequentiebewaking vereist hier een upgrade.
Geen upgrade uitgevoerd. De lokale preflight is dus geen vervanging voor een bewezen
productie-jaargrens; volledig automatische verzending blijft geblokkeerd.

## Stand bij overgang naar 13 september 2026

Mac vergrendeld; CUA meldt dat automatisch ontgrendelen niet lukt. Matthijs gevraagd
handmatig te ontgrendelen. Campagne 10 is teruggelezen als draft zonder ontvangers
of planning; geen testcampagne verzonden. Eerste echte editie staat uitsluitend lokaal
in campaign-draft.json en preview.html, nog niet in Brevo opgeslagen.

Tien preflight-tests geslaagd. Vormgeving gecontroleerd op 360/390/430/900 px:
drie kaarten, geen horizontale overloop. Screenshot op 390 px handmatig bekeken.
Afbeeldingen kwamen bij deze geïsoleerde test uit de lokale assets; geen externe
netwerkverzoeken. Test bevestigt dus geen live afbeeldingen of mailboxweergave.
Git diff --check schoon; local-mail-preview blijft uitgesloten via .vercelignore.

Volgende uitvoerbare stap na ontgrendeling: campagne 10 gebruiken voor één echte
technische proef naar uitsluitend contact 1 / mjjvandam@gmail.com, na exact teruglezen
van de ontvangerselectie. Persoonlijke voorkeur-/afmeldlinks testen, daarna Brevo-readback.
Er zijn vier testmails over; een onzekere verzending eerst onderzoeken, niet opnieuw sturen.
De eerste echte editie alleen als draft opslaan, zonder ontvangers of schema.
Engelse bevestigingspagina nog corrigeren via de bestaande native formulierinstellingen.
Geen nieuwe ADR nodig voor deze test-/conceptscope onder ADR-0008/0013.

## Actuele eindstand 13 september 2026

Mac ontgrendeld; vervolg uitgevoerd. Drie van maximaal vijf testmails ontvangen,
alle uitsluitend mjjvandam@gmail.com. Geen andere ontvangers benaderd.

- Mail 2: campagne 10 via Send Test, ontvangen 22:09:25 UTC. SPF, DKIM en DMARC
  pass; gepersonaliseerde voorkeur- en afmeldlinks aanwezig.
- Voorkeurformulier uit mail 2: achternaam van Dam hersteld, lijst 7 uitgezet,
  lijst 4 gekozen. Mail 3 ontvangen 22:10:32 UTC, bevestiging via ontvangen
  link uitgevoerd. Providerhistorie bevestigt lijst 4 toegevoegd en lijst 7 verwijderd.
- Afmeldlink mail 2 gaf Nederlandse succesmelding. Eerste contact-readback was
  nog Subscribed. Daarna ook de native afmeldroute uit het persoonlijke voorkeurformulier
  voltooid. Definitieve provider-readback: Email campaigns Blocklisted; SMS en
  Transactional emails blijven Subscribed. Historie meldt afmelding campagne 10.
  Door beide routes kort na elkaar is de afzonderlijke werking/timing niet geïsoleerd.
- Eigen testadres blijft afgemeld voor e-mailcampagnes; geen handmatige herinschrijving.
- Campagne 11 staat in Brevo als Draft, naam: Matthijs van Dam 2026-01 — Artrose,
  obesitas en cohort — CONCEPT NIET VERZENDEN. Onderwerp en alle drie volledige
  artikelblokken plus footer teruggelezen. Geen ontvangers, geen schema.
  URL: https://app.brevo.com/marketing-campaign/edit/11
- Browsertekstinvoer bleek aanvankelijk afgekapt; gecorrigeerd met volledig plakken
  en volledige HTML plus opgeslagen preview teruggelezen.

Nog open vóór publieke vrijgave: Nederlandse afronding van bevestigingspagina's
(en Engelse Unsubscribe-knop), eerste inschrijving van een geheel nieuw contact
(nu alleen bestaande eigen contact getest), live artikel-/beeldcontrole, inhoudelijke
verzendgoedkeuring en een uitvoerbare jaarlijkse frequentiecontrole. Native frequency
cap vraagt Upgrade; lokale preflight blijft uitsluitend een geteste droge controle,
geen productiehandhaving. Geen upgrade, automatisering, publieke inschrijving of
verzending van de echte editie geactiveerd. ADR-0008/0013 ongewijzigd.
