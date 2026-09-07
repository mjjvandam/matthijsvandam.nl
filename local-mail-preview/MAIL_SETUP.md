# Mailkoppeling — voorbereid, niet actief

Gewenste ontvanger: mjjvandam@gmail.com.
In Brevo ingestelde vaste afzender: Matthijs van Dam <website@mail.matthijsvandam.nl>.
Reply-To: gevalideerd adres van de formulierinzender.

## Actueel gecontroleerd

Op 2026-09-06 gebruikt matthijsvandam.nl de nameservers van TransIP. Voor de configuratie had mail.matthijsvandam.nl geen TXT-, MX- of CNAME-record. Het bestaande hoofddomein heeft DMARC `v=DMARC1; p=none;`. Bestaande website-, MX- en hoofddomeinrecords blijven behouden.

Na expliciete toestemming van Matthijs zijn op 2026-09-06 de vier onderstaande records opgeslagen bij TransIP, met TTL 1 uur. TransIP bevestigt de wijziging. Een directe DNS-controle bij ns0.transip.net bevestigt alle vier waarden. De bestaande acht DNS-records en nameservers zijn behouden.

Na aanvullende expliciete toestemming is de rua-tag opgeslagen en bevestigd via ns0.transip.net. Brevo bevestigt alle vier records en meldt in het domeinenoverzicht Authenticated. De afzender Matthijs van Dam <website@mail.matthijsvandam.nl> is succesvol toegevoegd. API-sleutel `matthijsvandam.nl-contact-nieuwsbrief` is na expliciete toestemming aangemaakt (vervaldatum 2027-09-06; Brevo vermeldt ook verval na 90 dagen inactiviteit). Eén afgesproken contacttest naar mjjvandam@gmail.com is door Brevo geaccepteerd. Matthijs heeft de daadwerkelijke inboxontvangst bevestigd. Het publieke formulier is niet actief.

## Opgeslagen DNS-records

Relatieve namen voor de DNS-zone matthijsvandam.nl:

| Type | Naam | Waarde |
| --- | --- | --- |
| TXT | mail | brevo-code:af86c636c7e6a850e6783161e72aeb41 |
| CNAME | brevo1._domainkey.mail | b1.mail-matthijsvandam-nl.dkim.brevo.com |
| CNAME | brevo2._domainkey.mail | b2.mail-matthijsvandam-nl.dkim.brevo.com |
| TXT | _dmarc.mail | v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com |

Brevo verlangt aanvullend `rua=mailto:rua@dmarc.brevo.com`. Dit stuurt geaggregeerde authenticatierapporten aan Brevo. De oorspronkelijk gekozen variant zonder rapportage wordt door deze wizard niet geaccepteerd. Het bestaande hoofddomein-DMARC blijft ongewijzigd.

## Volgorde resterend

1. DNS-records, domeinauthenticatie en afzender zijn ingesteld; geen branded tracking-subdomein toegevoegd.
2. Sleutel staat tijdelijk buiten de repository in een afgeschermde directory onder /private/tmp/mvd-brevo-secret-W04RFd (directory 0700, bestand 0600). Dit is geen duurzame hostingconfiguratie. Veilig overbrengen naar hosting-secrets voordat tijdelijke opslag vervalt; sleutel nooit in chat, Git of terminaloutput. Hostingproject en pakket eerst verifiëren.
3. Testmail met onderwerp `Websitecontact: Technische test contactformulier` is eenmalig via de bestaande brevo.cjs-adapter verstuurd en geaccepteerd. Inboxontvangst door Matthijs bevestigd; geen automatische herhaling.
4. Publiek formulier blijft uit totdat productiebeveiliging en privacy zijn afgerond en livegang is vrijgegeven.


## Hostingvervolg 2026-09-06

Via de Vercel-connector bevestigd: team `team_RJJkAbUwRFarYUBsXSSkRG05`, project `prj_qAfVBP3ySuvlwxNovO9CGgQdgMp6` (`matthijsvandam-nl`), gekoppeld aan mjjvandam/matthijsvandam.nl; Node 24.x; pakket Hobby. Browserinstellingen vereisen nog inloggen. Geen hosting-secrets of firewallregels gewijzigd; geen deployment uitgevoerd.

Kostenvoorwaarde open: Vercel Hobby is volgens https://vercel.com/docs/plans/hobby beperkt tot persoonlijk/niet-commercieel gebruik. De site bevat zelfstandige adviesactiviteiten, dus geschiktheid moet worden opgehelderd voordat deze hosting als gratis productieroute wordt bevestigd. Geen betaald pakket aangezet.

`api/contact.js` is lokaal omgezet naar Brevo. De route gebruikt vaste afzender/ontvanger, strikte JSON- en veldvalidatie, originecontrole, een requestlimiet van 24 KiB, time-out en provider-idempotentie. `script.js` verstuurt expliciete boolean-toestemming en een UUID; blokkeert dubbel klikken en herhaling bij onzekere ontvangst; bewaart invoer bij fouten. De lokale demo op poort 8879 blijft de aparte simulatie, geen live-proef van deze nieuwe endpoint.

Voor hosting vereist:
- `BREVO_API_KEY`: geheim; alleen server-side.
- `CONTACT_FORM_ENABLED=false` tijdens inrichting.
- `CONTACT_EDGE_RATE_LIMIT_VERIFIED=false` tot externe verificatie. Dit is alleen een releasevlag, geen bescherming op zichzelf.
- Eerst gedeelde edge-spamlimiet instellen: alleen POST /api/contact, aanvankelijk maximaal 5 verzoeken per minuut per IP, blokkeren met 429. Controleren op apex, www en eventuele direct toegankelijke deploymenthosts. Onderzoek quota-bescherming tegen meerdere IP-adressen voordat publiek activeren.
- Daarna met veilige tests aantonen dat geblokkeerde verzoeken de mailprovider niet bereiken; pas dan vlag true. De in-memory Map is verwijderd, niet als afdoende bescherming hernoemd.

Brevo beschrijft provider-idempotentie via `headers.idempotencyKey` op https://developers.brevo.com/docs/heterogenous-versions-batch-emails (actuele documentatie noemt 30 minuten). Het HMAC-gebaseerde UUID bindt request-ID en berichtinhoud. Dit is aanvullende bescherming binnen de providertijdslimiet; geen permanente deduplicatie. De echte provider-deduplicatietest staat nog open. Tests gebruiken mocks en bevestigen geen werking van de externe firewall of idempotentie.

Resterend: hostingtoegang, geschiktheid pakket, duurzame sleutelopslag, echte spam-/quotabescherming, publieke formulierplaatsing en privacyafstemming, ketentest en expliciete livevrijgave. ADR-0008 dekt de technische voorbereiding; geen nieuw architectuurbesluit genomen.


## Hostinginrichting — vervolg na aanmelding

Matthijs is ingelogd bij Vercel. Project had geen omgevingsvariabelen. Variabele BREVO_API_KEY voorbereid als Secret, uitsluitend Production; waarde nog niet overgedragen of opgeslagen, concrete toestemming gevraagd voor opslag bij Vercel.

Firewallregel `rule_contactformulier_maximaal_5_per_minuut_cme2lo` aangemaakt en gepubliceerd: Request Path starts with /api/contact, alle methoden, Fixed Window 60 seconden, 5 verzoeken per IP, actie 429. Geen overige regels of botinstellingen gewijzigd. De padprefix omvat ook suffixvarianten. De regel geldt nu, onafhankelijk van deployment; het formulier is niet geactiveerd.

Veilige GET-proef (geen mail): www.matthijsvandam.nl/api/contact gaf 405 voor verzoek 1–5, daarna 429 voor 6–7. Daarna gaf matthijsvandam-nl.vercel.app/api/contact eveneens 429 voor dezelfde client. Dit toont een actieve gedeelde limiet op beide routes; apex en POST/verschillende edge-regio's moeten nog worden gecontroleerd voor vrijgave. Een per-IP-limiet voorkomt geen verspreide quota-uitputting door meerdere IP-adressen. CONTACT_EDGE_RATE_LIMIT_VERIFIED blijft voorlopig niet ingesteld.


## Brevo-secret opgeslagen bij Vercel

Na concrete toestemming van Matthijs is BREVO_API_KEY succesvol opgeslagen als Secret, uitsluitend in Production van matthijsvandam-nl. Vercel bevestigt de opslag en vermeldt dat een nieuwe deployment nodig is om deze te gebruiken. CONTACT_FORM_ENABLED is als Production Config op false opgeslagen. Geen redeployment of formulieractivering uitgevoerd. De lokale tijdelijke sleutelkopie is nog afgeschermd aanwezig; deze kan na de definitieve ketentest worden verwijderd.


## Ketentest en resterende beslissingen

Nieuwe lokale browsertest op 2026-09-06: script.js → api/contact.js → echte Brevo-API → vaste Gmail-ontvanger. Alleen één vast technisch testbericht toegestaan door de lokale testserver. Brevo gaf 200/accepted, het formulier reset en toont succes; geen browserconsolefouten. Onderwerp: Websitecontact: Ketentest Brevo contactformulier. De browser-Origin wordt uitsluitend in de afgeschermde fixture vertaald naar de productie-Origin; dit is uitdrukkelijk geen volledige gehoste productietest. Inboxontvangst van deze tweede test is nog niet door Matthijs bevestigd. De eerste test is wel bevestigd.

Aanvullende veilige POST-proef met leeg object tegen de nog inactieve publieke endpoint: apex gaf vijfmaal 308 en daarna 429; www gaf vervolgens 429. De apex-redirect is dus zichtbaar vóór de nog niet gedeployde handler, maar de limiet blokkeert ook daar. Geen formulierinhoud of nieuwe mail verstuurd door deze firewallproef. Cross-regiongedrag en bescherming tegen meerdere IP-adressen blijven open.

Privacyconcept: local-mail-preview/PRIVACY_CONCEPT.md. Verantwoordelijke en bewaartermijn gevraagd aan Matthijs, nog onbeantwoord. Gewone Gmail heeft volgens Google geen DPA. Brevo-logretentie en individuele tracking moeten vóór livegang worden vastgesteld en passend ingericht. Geen privacycontract geaccepteerd of bestaande data verwijderd.

Hostingkeuze uitgewerkt in docs/decisions/ADR-0009-hosting-mail-production.md, status Proposed. Geen migratie gestart. Vercel Hobby is geen bevestigde passende route voor het adviesaanbod; gratis alternatieven hebben eigen grenzen. Publieke privacy.html blijft ongewijzigd.


## Vervolgkeuze 2026-09-06

Matthijs: “werk nog even door onder hobby”. De technische voorbereiding gaat verder op het bestaande Vercel Hobby-pakket. Migratievoorstel geparkeerd; geen upgrade, verhuizing of publiek activeringsbesluit. ADR-0009 blijft Proposed.

Brevo: aparte map `matthijsvandam.nl nieuwsbrief` met vijf lege lijsten aangemaakt en via GET teruggelezen. IDs en servermapping staan in `brevo-lists.json`; transport blijft uit. Geen contacten geïmporteerd, campagnes ingesteld of mails verstuurd. Bestaande lijst ongewijzigd. Bron voor inrichting: https://developers.brevo.com/reference/create-list en https://developers.brevo.com/reference/create-folder.

Servervalidatie controleert nu de doelgroep én alle gekozen onderwerpen gezamenlijk; een gemanipuleerd verzoek kan geen patiënten- en professionalkeuzes combineren. Algemeen is beschikbaar voor beide doelgroepen. Voornaam en achternaam blijven verplicht. Brevo heeft FIRSTNAME/LASTNAME-attributen; doorgifte en verificatie bij bestaande contacten blijven onderdeel van de nog uit te voeren bevestigingstest. De koppeling verstuurt namen dus nog niet.

Volgende technische stap: bevestigingssjabloon en afgeschermde double-opt-in-ketentest inclusief bestaande/uitgeschreven adressen. Ook de gezamenlijke bovengrens van twaalf nieuwsbrieven per abonnee moet nog worden afgedwongen voordat automatische verzending aan mag. Publieke privacyafstemming en livevrijgave blijven open. Deze voorbereiding valt onder ADR-0008; geen nieuw besluit nodig voor lijstinrichting en validatie.


## Bevestigingsmail en inschrijfcontrole — uitgewerkt 2026-09-06

Brevo-sjabloon 3 aangemaakt, inactief en teruggelezen. Bron: templates/confirm-subscription.html. brevo-lists.json verwijst ernaar, enabled=false, doiVerified=false en redirectUrl=null. FIRSTNAME/LASTNAME nu voorbereid in het DOI-verzoek; nooit via een voorafgaande contactupdate. De eerdere notitie dat namen ontbreken is hiermee vervangen voor de lokale adapter; echte verzending blijft uit.

Lokale proeflogica afgesplitst naar preview-flow.cjs: doelgebonden eenmalige tokens, geen wijziging vóór bevestiging, toevoeging aan bestaande voorkeuren, oude aanvragen ongeldig na bevestiging/uitschrijving. Oude geldige uitschrijflink blijft bruikbaar. Dit zijn lokale eisen en tests, geen bewijs van Brevo-gedrag. Uitvoering echte proef: DOI_ACCEPTANCE.md. Toestemming voor maximaal drie testmails gevraagd, nog niet ontvangen.

Checks: 27 Node-tests geslaagd; lokale browserketen aanmelden → bevestigen → afmelden geslaagd zonder pageerrors. Bevestigingsmail gecontroleerd op 360/390/430 px, geen horizontale overflow, 390px screenshot visueel beoordeeld. Dit is een browserweergave, nog geen Gmail/Outlook-rendercheck. Publicatiecheck: 39 publieke pagina's, 39 geverifieerd, 0 review nodig. Geen npm-script beschikbaar. ADR-0008 dekt deze voorbereiding. Geen deployment, nieuwe medische inhoud of publieke activering.


## Echte DOI-proef na expliciet akkoord

Matthijs heeft de maximaal drie testmails goedgekeurd; uitgevoerd en ontvangst via Gmail bevestigd. De eerdere wachtstatus is vervallen. Gedetailleerde resultaten in DOI_ACCEPTANCE.md. Nieuwe en bestaande inschrijving slagen tot de controle op oude links: de oude link uit mail 2 activeerde de nieuwste openstaande aanvraag 3 en hief de testblokkade op. Daarom doiVerified=false; deze adapter niet vrijgeven. Testcontact weer geblokkeerd en testtemplate 4 uitgezet. Productielijsten blijven leeg.

Individuele tracking voor transactionele mail uitgeschakeld via Anonymous email tracking=Yes, opslagbevestiging zichtbaar. Dit laat anonieme pixels/klikstatistiek bestaan; marketinginstelling nog open. Nieuw architectuurvoorstel ADR-0010: eigen eenmalige aanvraagbevestiging met tijdelijke gedeelde opslag. Proposed; nog geen opslagprovider of endpoint geïmplementeerd. Vercel blijft Hobby, geen upgrade of deployment.


## ADR-0010 geaccepteerd en lokaal gebouwd

Matthijs gaf akkoord op de lokale alternatieve bevestigingsroute en vroeg de vormgeving op de website te laten aansluiten. De lokale bouw is uitgevoerd: eigen aanvraaggebonden tokens, atomaire claim in testopslag, bewuste POST-bevestiging, onzekere status zonder automatische retry, afmelding met voorrang, gedeelde e-mailstijl en nieuwsbriefvoorbeeld. Details in CONFIRMATION_IMPLEMENTATION.md. 39 tests en de lokale browserketen slagen. De nieuwe module verstuurt geen echte mail; geen Vercel-upgrade, nieuwe externe store of deployment. De oude Brevo DOI kan niet meer via flags worden geactiveerd. De bestaande Brevo-templates/lijsten zijn in deze bouw niet gewijzigd.
