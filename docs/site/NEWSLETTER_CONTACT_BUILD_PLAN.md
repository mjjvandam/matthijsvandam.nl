# Bouwdossier nieuwsbrief en contact

Datum: 2026-09-06

Actualisatie 10 september 2026: dit dossier bevat de oorspronkelijke bouwvolgorde en historische tussenstanden. Het contactformulier is inmiddels live; daarvoor is `local-mail-preview/CONTACT_RELEASE.md` leidend. Voor de nieuwsbrief geldt de later geaccepteerde native Brevo-route uit ADR-0013 en `local-mail-preview/BREVO_NATIVE_ROUTE.md`. De samengevoegde actuele vervolgtaken staan bij Nog te doen in de lokale beheeromgeving; oude Resend-, opslag- of contactblokkades hieronder zijn geen nieuwe opdrachten.

Status: lokale implementatie en proef gereed; geen livegang. ADR-0008 is op 2026-09-06 expliciet door Matthijs goedgekeurd voor lokale bouw. Zie `local-mail-preview/README.md` voor uitgevoerde tests en resterende productievoorwaarden.

## Uitkomst haalbaarheidscheck

Technisch passend bij de huidige statische site. Matthijs heeft een Brevo-account aangemaakt. De ingelogde accountcontrole op 2026-09-06 bevestigt Free en 300 gedeelde marketing-/transactionele e-mails per dag. Formulieren en de RSS-configuratiestart zijn toegankelijk zonder getoonde upgrade-eis. EUR 0 voor de volledige werkende keten is nog niet bewezen: RSS is nog niet geconfigureerd/getest, transactionele onboarding is niet afgerond en hostingvoorwaarden zijn nog niet gecontroleerd. Codex heeft geen betaald abonnement aangeschaft, geen API-sleutel aangemaakt en geen bericht verstuurd.

| Onderdeel | Gecontroleerd | Open punt |
| --- | --- | --- |
| Artikelmetadata | `audience`, `topics`, `project`, datum en URL bestaan in `content.js` | Concrete stromen en aparte distributievrijgave |
| Contactbackend | `api/contact.js` gebruikt Resend; standaard uit bij ontbrekende configuratie | Actuele hostingconfiguratie en eventuele Resend-account niet vastgesteld |
| Contactfrontend | Submit-handler aanwezig in `script.js`; formulier niet zichtbaar op homepage | Toegankelijke lokale formulierpreview |
| Spamcontrole | Honeypot en in-memory limiet aanwezig | Limiet werkt niet betrouwbaar over meerdere serverinstanties |
| Validatie | Lengtelimieten, HTML escaping en vraagtypecontrole aanwezig | Strikte checkboxvalidatie, requestgrootte, array/object-body afwijzen, time-out en herhaald klikken |
| Brevo | Account usage toont Free plan, 300 gedeelde Marketing & Transactional emails per dag; merkvermelding verwijderen is betaald | Werkende verzending, quota-afhandeling en transactionele activering testen |
| Formulieren in account | Sign-up, Unsubscribe en Profile update zijn zichtbaar; een standaard profielwijzigingsformulier bestaat | Volledige configuratie, bevestiging, voorkeuren en afmelding nog testen |
| RSS in account | RSS campaign gevonden; startscherm met integratienaam en Create integration toegankelijk zonder upgrade-eis | Geen integratie aangemaakt; uiteindelijke activatie en werking nog niet bewezen |
| Transactionele mail | Configuration / Welcome to SMTP met SMTP- en API-instellingen toegankelijk | Onboarding en verification nog niet afgerond; domein en testverzending open |
| Browser | Ingelogd account van Matthijs bevestigd | Geen loginactie meer nodig voor deze browsersessie |
| Hosting | Vercelconfiguratie aanwezig; geen `.vercel/project.json` | Team, plan, kostenruimte en toegestane professionele toepassing |
| DNS | README noemt TransIP | Actuele DNS-provider, rechten en bestaande mailrecords |

## Bouwvolgorde

1. Account en kosten controleren: Free daadwerkelijk actief; RSS, formulieren, voorkeuren en transactionele mail beschikbaar zonder upgrade. Hostinggebruik en beperkingen controleren. Bij extra kosten niet activeren.
2. ADR-0008 is gevalideerd voor lokale bouw. Daarna conceptpagina's buiten deployment bouwen, met gedeelde formulierstijl en foutmeldingen. Voorstel pagina's: `contact.html`, `nieuwsbrief.html`; vóór vrijgave expliciet uitgesloten van deployment en publieke links.
3. Beveiligde mailroute aansluiten. Brevo als enkele leverancier heeft voorkeur, maar pas migreren na bewijs dat contactmail daar werkt. API-sleutel alleen in secrets/configuratie, niet via chat delen.
4. Abonneestromen en providerformulieren voor bevestiging en voorkeurwijziging instellen. Contact heeft geen nieuwsbriefcheckbox of andere automatische abonnementskoppeling.
5. Een aparte distributieconfiguratie en generator bouwen. Metadata uit `content.js` blijft bron; geverifieerde status alleen is onvoldoende voor nieuwsbriefvrijgave. Genereren van feeds wordt onderdeel van de publicatiecontrole, met controle op verouderde feeds.
6. RSS-template met ongewijzigde goedgekeurde titel, samenvatting en leeslink bouwen. Eerst conceptmodus; geen oude artikelen automatisch importeren. Contactmail en bevestiging zijn technische templates, geen redactionele nieuwsbriefgeneratie.
7. Testen, concrete preview tonen en pas na vrijgave publiceren/activeren. Regels voor automatische distributie vastleggen bij de bestaande publicatiewerkwijze.

## Formuliercontract

Contact: naam, e-mailadres, type vraag, onderwerp, bericht; vaste professionele ontvanger. Geen bijlagen, geen gezondheidsvragen. Geen belofte over responstijd. Een browsermelding bevestigt pas provideracceptatie; zij bewijst geen inboxbezorging.

Nieuwsbrief: e-mailadres en expliciete instemming met gekozen stromen. Voorkeuren zijn optioneel; geen selectie krijgt een duidelijke keuzevraag of vooraf beschreven algemene stroom, nooit een stilzwijgende inschrijving voor alles. Wijziging via beveiligde providerroute. Uitschrijven zonder account of wachtwoord. Aanmeldbevestiging is geen bewijs van actieve inschrijving; alleen voltooide bevestiging telt.

## Tests vóór ingebruikname

- Ongeconfigureerde en uitgeschakelde routes verwerken geen externe mail.
- Geen mail bij ontbrekende/ongeldige velden, te grote requests, ongeldige checkbox, honeypot of spamblokkade.
- Bezoekers kunnen ontvanger, afzender, template-ID of toegestane lijst-IDs niet manipuleren.
- HTML/script-invoer wordt veilig weergegeven; geen headers injecteerbaar via onderwerp of e-mail.
- Providerfout/time-out toont geen succes, lekt geen sleutel en veroorzaakt geen blinde automatische herhaling.
- Meervoudig klikken en herladen veroorzaken geen dubbele verzending; gedrag bij onzekere provideracceptatie is vastgelegd.
- Onbevestigde inschrijving ontvangt geen campagne. Bestaand of uitgeschreven adres wordt niet opnieuw actief zonder mailboxbevestiging.
- Voorkeuren wijzigen vereist verificatie; afmelding onderdrukt toekomstige mail, ook bij geplande campagnes.
- Stroomselectie: doelgroepvoorwaarde blijft gelden als thema/project matcht. Een artikel met meerdere passende kenmerken verschijnt eenmaal binnen dezelfde stroom.
- Geen conceptpagina, niet-vrijgegeven artikel, gewijzigde bronversie of oude startachterstand komt in de feed.
- RSS stabiele IDs, tijdzone, XML escaping, linkbereikbaarheid en omgang met meer dan vijf nieuwe items zijn gecontroleerd.
- Geen nieuwe items geeft geen verzending; herhaalde polling geeft geen dubbele editie. Een ingetrokken artikel wordt ook uit een nog niet verzonden concept verwijderd.
- Quota-uitputting wordt zichtbaar; geen upgrade of betaalde fallback. Contact- en bevestigingsmail worden in totale capaciteit meegenomen.
- Test met expliciet toegestane testadressen: bevestigen, campagne ontvangen, afmelden. Providerstatus en daadwerkelijke ontvangst onderscheiden.
- Toetsenbord, labels, focus, foutmelding en leesbaarheid op 360/390/430 px; lichte en donkere weergave.
- SPF/DKIM/DMARC volgens de gekozen provider verifiëren zonder bestaande mail te breken; geen garantie op inboxplaatsing.
- Privacytekst en gegevensstromen komen overeen, tracking staat uit, logs bevatten geen formulierinhoud of adressen.
- Na implementatie relevante site-, publicatie- en SEO-checks draaien. Geen `package.json` aanwezig; momenteel geen npm-checks.

## Nog benodigde toegang en besluiten

- Brevo-account is door Matthijs aangemaakt en de ingelogde Free-status is gecontroleerd. Voor technische koppeling nog veilige API-toegang en domeinconfiguratie regelen; geen sleutels via chat delen.
- Hostingplan en facturatie-instellingen controleren met geautoriseerde toegang; geen upgrade.
- Ontvangstadres voor professionele contactberichten en geverifieerde verzendidentiteit vaststellen vóór testmail.
- Akkoord ADR-0008 is ontvangen. Exacte voorkeurstromen, bewaartermijnen en publieke tekst blijven te beoordelen.
- Pas na succesvolle tests: aparte vrijgave voor live formulieren, DNS en automatische nieuwsbriefverzending.

## Aanvullend ontwerp: eenmalige nieuwsbriefuitnodiging

Matthijs stemde op 2026-09-06 in met het volgende ontwerpvoorstel. Dit akkoord is geen opdracht tot publieke activering. Implementatie en livegang blijven afzonderlijke stappen.

- Kop: **Nieuwe artikelen per e-mail**.
- Tekst: Ontvang mijn nieuwsbrief over orthopedie, onderzoek en zorgontwikkeling. Kies zelf welke onderwerpen je volgt.
- Frequentietekst: **Maximaal 12 keer per jaar. Je kunt je altijd afmelden.** Redactioneel streven: ongeveer zes edities.
- Acties: **Inschrijven**, **Nee, bedankt**, duidelijk sluitknopje.
- Alleen op homepage en artikelpagina's, na minimaal 30 seconden én enig scrollen. Niet tijdens formuliergebruik of op contact-, inschrijf- en privacypagina's.
- Eenmalig per browser/apparaat: sla het tonen direct lokaal op, niet pas het sluiten. Geen herhaalde automatische uitnodiging bij een volgend bezoek. Gewone inschrijflinks blijven bereikbaar.
- Bij gewiste browsergegevens kan de uitnodiging opnieuw verschijnen. Bij onbeschikbare lokale opslag de automatische uitnodiging overslaan, zodat herhaald tonen wordt voorkomen.
- Op mobiel een compact paneel onderaan. Toetsenbordbediening, Escape, zichtbare focus en passende focusafhandeling; geen vooraf aangevinkte toestemming. Geen persoonsgericht volgen.
- Lokale opslag en doel daarvan opnemen in de privacy-uitwerking vóór activering.

### Frequentie geldt voor de abonnee, niet voor iedere stroom

Maximaal twaalf nieuwsbriefbezorgingen per abonnee in een voortschrijdende periode van twaalf maanden, over alle thema's en projecten samen. Contact- en noodzakelijke bevestigingsmails vallen niet onder deze redactionele frequentiebelofte.

De huidige losse RSS-stromen bewijzen die grens niet. Vóór automatische verzending moet bundeling of een gezamenlijke verzendlimiet aantoonbaar werken, inclusief overlappende voorkeuren, fouten en herhaalde uitvoer. Tot die tijd de frequentiebelofte niet publiek gebruiken en de losse campagnes niet automatisch activeren.

Dit is een aanvulling op het ontwerp, geen stilzwijgende wijziging van de geaccepteerde implementatiearchitectuur van ADR-0008. Als bundeling een persoonlijke digest of aanvullende opslag vereist, eerst de benodigde besluitaanvulling uitwerken volgens ADR-0008. De lokale proef bevat nog geen pop-up of gezamenlijke frequentiebewaking.

## Geraadpleegde bronnen

Op 2026-09-06 geraadpleegde officiële documentatie. Productdocumentatie bewijst geen toegang binnen een specifiek account.

- Brevo gratis pakket en limieten: https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
- Brevo pakketten (inclusief transactionele mail): https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans
- RSS-integratie, één lijst per integratie, planning en conceptmodus: https://help.brevo.com/hc/en-us/articles/360013130059-RSS-Campaign-integration-Automatically-share-your-blog-posts-with-your-subscribers
- Meerdere abonnementslijsten en voorkeurformulier: https://help.brevo.com/hc/en-us/articles/360000545200-Enable-your-contacts-to-subscribe-or-unsubscribe-from-specific-lists-using-a-form-multi-list-subscriptions
- Bevestigde inschrijving via API: https://developers.brevo.com/reference/create-doi-contact
- Vercel Hobby is voor persoonlijk niet-commercieel gebruik; toepasbaarheid en huidig plan niet vastgesteld: https://vercel.com/docs/plans/hobby

## Aanpassing voorkeuren en frequentie op verzoek van Matthijs

De lokale preview biedt Algemeen, Voet en enkel voor patiënten en zorgprofessionals, en Transmuraal Tilburg Cohort voor patiënten en zorgprofessionals. Onderzoek als aparte keuze vervalt. De gewenste publieksbelofte is maximaal twaalf nieuwsbrieven per jaar per abonnee over alle stromen samen. Dit is nog geen geïmplementeerde verzendlimiet. Losse RSS-stromen mogen niet automatisch worden geactiveerd voordat deze gezamenlijke grens aantoonbaar wordt gehandhaafd. Een eventuele overgang naar persoonlijke digests valt onder de besluitregel van ADR-0008.


## Vervolgcontrole contactkoppeling — 2026-09-06

Domein en afzender geverifieerd bij Brevo. Eén testmail is door Brevo geaccepteerd én door Matthijs ontvangen. API-sleutel bestaat en staat tijdelijk afgeschermd buiten Git; duurzame hostingconfiguratie ontbreekt nog.

Vercel-connector bevestigt het bestaande project matthijsvandam-nl op Hobby. Geschiktheid voor de adviesactiviteiten is niet bevestigd; gratis productiehosting kan daarom nog niet worden toegezegd. Geen upgrade, hostingmutatie of deployment uitgevoerd. Browser staat klaar voor Vercel-aanmelding.

api/contact.js en script.js zijn lokaal voorbereid voor Brevo en striktere verwerking. Releasevlaggen blokkeren verzending tot hosting-spamcontrole is ingesteld en bewezen. 19 Node-tests geslaagd, inclusief foutafhandeling en dubbele browserinzending. Sitekwaliteit, SEO en publicatieverificatie geslaagd. Geen package.json; geen npm-checks. De nieuwe handler is nog niet via een echte gehoste formulierketen getest. Details en resterende stappen: local-mail-preview/MAIL_SETUP.md.
