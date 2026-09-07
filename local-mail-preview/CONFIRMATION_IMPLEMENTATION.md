# Aanvraaggebonden bevestiging — lokale implementatie

Status: lokale bouw volgens door Matthijs geaccepteerde ADR-0010. Geen publieke endpoint, deployment, externe opslag of nieuwe echte mail. Vercel blijft Hobby.

## Bekijken

- Formulier: http://127.0.0.1:8879/
- Nieuwsbriefvormgeving: http://127.0.0.1:8879/nieuwsbriefvoorbeeld
- Na een fictieve inschrijving: open de lokale proefmail en volg de knop naar de bevestigingspagina. Alleen de volgende bewuste klik bevestigt.

## Bestanden

- `confirmation-service.cjs`: validatie, tokenuitgifte, bevestiging, afmelding, time-outs en afhandelstatus.
- `confirmation-store.cjs`: lokale geheugenadapter en contract voor atomaire opslagbewerkingen.
- `mail-layout.cjs`: gedeelde e-mailvormgeving, bevestigingsmail en nieuwsbriefvoorbeeld.
- `confirmation.html`, `.css`, `.js`: lokale bevestigingspagina; browserfragment direct verwijderen, geen automatische POST.
- `server.cjs`, `app.js`, `index.html`, `preview.css`: lokale formulier/mailbox-proef en links naar voorbeelden.
- `confirmation-service.test.cjs`: twaalf nieuwe protocol- en foutscenario's.
- `brevo.cjs`: oude Brevo DOI-route onvoorwaardelijk afgekeurd. Ook oude enabled/doiVerified-vlaggen kunnen deze niet aanzetten.

`templates/confirm-subscription.html` en Brevo-template 3 zijn het eerdere inactieve sjabloon. De nieuwe vormgeving komt uit `mail-layout.cjs`, is nog niet naar Brevo overgezet en gebruikt nooit params.DOIurl. `preview-flow.cjs` blijft alleen als oudere testreferentie bestaan; de actieve lokale server gebruikt de nieuwe service.

## Verwerking

De server maakt een willekeurig 256-bits geheim en bewaart alleen SHA-256 van dat geheim bij de aanvraag. De ruwe link bevindt zich in de mail; de lokale mockmailbox houdt die mail maximaal dertig minuten in geheugen. Dit is nodig om een mailbox na te bootsen en is geen productieopslag van ruwe tokens. Het adres wordt voor de interne sleutel met een aparte HMAC-sleutel gepseudonimiseerd. De noodzakelijke naam, het e-mailadres, de exacte stromen en de toestemmingstekstversie staan tijdelijk bij de aanvraag.

Nieuwe aanvraag: eerdere openstaande aanvraag vervalt. Link geldig dertig minuten; alle aanvraaggegevens worden uiterlijk na 24 uur opgeschoond, bij afgeronde/vervangen/afgemelde aanvragen eerder. Server doet iedere minuut cleanup. Lopende providerbewerkingen zijn begrensd met een achtseconden-time-out. Afmeld-/herstelblokkades blijven voor de duur van de demo in geheugen, zonder naam of adres in die blokkadekaart.

GET /bevestigen toont uitsluitend een pagina. Het geheim staat in een URL-fragment, niet in de query/path, en wordt meteen met history.replaceState verwijderd. POST /confirm verbruikt het token atomair, controleert de nog actuele aanvraag en verwerkt alleen de servergegevens. Dat voorkomt dat de bij Brevo gevonden oude-link/nieuwe-aanvraag-fout in dit lokale protocol kan optreden. Het beschermt tegen normale GET-linkscanners; geen garantie tegen scanners die zelfstandig op knoppen klikken.

Providerfout/timeout: geen automatische herhaling, geen succesmelding, token blijft verbruikt en verdere inschrijving voor dat adres wordt geblokkeerd voor controle. Een time-out bewijst niet dat een externe bewerking is gestopt. Het lokale suppressiesignaal blijft daarom ook na een late provideruitkomst gesloten. Een latere correcte provideropslag en herstelprocedure zijn noodzakelijk voor productie.

Afmelding invalideert de openstaande aanvraag voordat deze op de uitvoeringslock wacht. Na een eventuele al lopende wijziging wordt de lokale provider weer geblokkeerd. Bij onzekere provideruitkomst blijft de aanvraag onder controle in plaats van een gegarandeerde voltooiing te melden. Uitschrijven gebruikt in deze demo een aparte, eenmalige token met 24 uur geldigheid. Dit is geen definitief publiek afmeldbeleid.

## Opslag- en providercontract voor vervolg

`put`, `claim`, `withdraw`, `complete` en de vergelijking met de huidige aanvraag moeten op de productieopslag atomair werken. `withLock` in de geheugenadapter werkt uitsluitend voor service-instanties die hetzelfde geheugenobject delen. Een echte implementatie vereist gedeelde locks/versies die ook bij procesuitval veilig blijven; een simpele kopie van deze Map naar Vercel voldoet niet.

De providerinterface kent `sendConfirmation`, `applyConfirmed` en `block`. De nieuwe service heeft nu uitsluitend een fake provider. `applyConfirmed` ontvangt een vaste operationId voor latere idempotentie/controle; er is nog geen Brevo-productieadapter voor deze route. `receiveVerifiedWithdrawal` is uitsluitend een interne ingang voor tests, zonder publieke HTTP-route. Een echte webhook moet eerst authenticatie, herhaling en volgorde van gebeurtenissen valideren.

`isDeliverySuppressed` is een lokaal verbodssignaal, geen bewijs van inschrijving en geen garantie dat zelfstandig geplande Brevo-campagnes het controleren. In productie moet iedere verzendroute dat signaal respecteren. Onzekere late updates en afmelding bij een onafhankelijk versturende provider blijven te bewijzen voordat livegang mogelijk is.

## Vormgeving

De e-mails gebruiken de websitekleuren #244c3d, #f7f4ed, #fffdf8 en #17201c, rustige typografie met e-mailveilige fallback, een herkenbare naamskop en artikelblokken. Geen externe fonts, scripts, afbeeldingen of trackingpixels in de nieuwe renderer. Dat bewijst nog niet dat een mailprovider geen tracking toevoegt. Het nieuwsbriefvoorbeeld bevat uitsluitend plaatsaanduidingen.

## Validatie en grens

39 Node-tests geslaagd. Twee service-instanties met dezelfde lokale store verwerken dezelfde bevestiging één keer. Onder meer vervallen/vervangen links, wijziging van voorkeuren, afmelding tijdens verwerking, providerfouten en late uitkomsten getest. Geen echte processen/regio's of duurzame store getest.

Browserketen formulier → proefmail → bevestigingspagina → uitschrijven geslaagd, zonder browserfouten. Het token verdwijnt uit de adresbalk vóór bevestigen. Mail, pagina en nieuwsbriefvoorbeeld op 360/390/430 px zonder horizontale overflow. Geen actuele Gmail/Outlook-rendercontrole van de nieuwe versie; er zijn in deze bouw geen echte mails verstuurd.

SEO- en publicatiecontrole slagen: 39 publieke pagina's, 39 geverifieerd. De algemene sitekwaliteitscheck rapporteert zes navigatiemeldingen: de lokale bevestigingspagina en het oude e-mailsjabloon hebben geen volledige siteheader/nav-toggle. Dit zijn geen gewijzigde publieke pagina's. Ze blijven uitgesloten door local-mail-preview/ in .vercelignore. Geen npm-scripts beschikbaar.

Nog vóór productie: gedeelde opslag en kosten/privacykeuze, echte provideradapter, geauthenticeerde afmelding en herstelroute, misbruik-/quotabescherming, nieuwe ketentest, jaarlimiet en privacyafstemming, expliciete livevrijgave. Lokale bouwacceptatie is geen publieke vrijgave.


### Vormgevingsaanpassing

Op verzoek van Matthijs: herkenbare gekoppelde naamskop MatthijsvanDam.nl in zowel bevestigingsmail als nieuwsbrief. Nieuwsbriefvoorbeeld toont Nieuwsbrief · 2026 · nr. 1; jaar en nummer zijn expliciete renderparameters. Dit is voorbeeldmetadata, geen al uitgegeven nieuwsbrief of gerealiseerde automatische jaarwisseling. Nummering bij echte verzending moet uit het verzendregister komen en elk kalenderjaar opnieuw beginnen. Geen andere technische of publieke wijziging; bestaande ADR-0010 volstaat.

### Artikelafbeeldingen in lokaal voorbeeld

Twee bestaande websiteafbeeldingen boven de artikeltitels toegevoegd in mail-layout.cjs. server.cjs serveert uitsluitend deze twee voorbeeldbestanden via een vaste lijst; afbeeldingen blijven lokaal. Titels en introducties blijven plaatsaanduidingen. Voor echte verzending moeten de afbeeldingen via absolute publieke HTTPS-URLs uit de goedgekeurde artikelgegevens komen. Geen verzending of livegang uitgevoerd.

Beide afbeeldingen laden, behouden hun verhouding en hebben alternatieve tekst. Browsercontrole op 360, 390 en 430 px: geen horizontale overflow. De bestaande 12 bevestigingsservice-/mailtests slagen. ADR-0010 blijft van toepassing; geen nieuwe ADR of medische inhoudswijziging. Gmail/Outlook-weergave en productie-integratie blijven nog te controleren.
