# Vervolg nieuwsbrief: bestaande website en Brevo

## Besluit van Matthijs — 7 september 2026

"ok ga door maar dan dus zonder nog weer extra diensten"

Gebruik uitsluitend de bestaande website/Vercel en Brevo. Geen Neon, Upstash, andere database, nieuwe integratiedienst of betaald pakket. ADR-0011 is niet gekozen en mag niet worden uitgevoerd. Native providerformulieren en RSS-conceptcampagnes passen binnen ADR-0008. De eigen bevestigingsdienst uit ADR-0010 blijft een lokale proef en wordt niet naar productie gebracht.

## In het account voorbereid

- Brevo-formulier `MVD nieuwsbrief - native proef - niet publiceren`, ID `6a9f136efd758e360d87c7a9`.
- Uitsluitend bestaande testlijsten 9 en 10 als keuze; geen automatische toevoeging aan een andere lijst.
- Voornaam, achternaam, e-mailadres en onderwerpkeuze verplicht; expliciete toestemmingscheckbox.
- Native dubbele bevestiging met `Default Template Double opt-in confirmation`; extra eindbevestigingsmail uit.
- Nederlandse aanvraag-/foutmeldingen. Aanvraagmelding zegt dat mailboxbevestiging nog moet volgen.
- Brevo geeft een eigen formulier-URL uit. Deze staat niet op de website en wordt niet publiek gedeeld. Geen testmail verzonden in deze ronde.
- Dit is een technische proef met testkeuzes, geen afgerond bezoekersformulier. Doelgroepkeuze, definitieve kleuren, privacyverwijzing en aangepaste native bevestigingsmail volgen pas nadat de bevestigingsroute is bewezen.

## Nog te bewijzen

1. Native dubbele opt-in afzonderlijk testen. De eerdere fout met oude links betrof de API-route; native formulieren zijn niet bewezen veilig of onveilig. Controleer nieuwe aanvraag, gewijzigde gegevens, reeds gebruikte link, afmelding en herinschrijving. Stop bij heractivering zonder de juiste nieuwe bevestiging; geen beveiligingseis stilzwijgend verlagen.
2. Native profielwijzigingsformulier voor namen en lijstkeuzes; testen of ook verwijderen van keuzes klopt. Geen onbeveiligde openbare lookup van bestaande abonnees.
3. Spamcontrole zonder nieuwe dienst: Brevo adviseert reCAPTCHA en biedt ook Turnstile. Beide brengen een andere partij in de bezoekersketen; niet toevoegen op grond van dit akkoord. Native bescherming/honeypot en limieten onderzoeken en testen. Een Vercel-limiet beschermt niet automatisch een rechtstreeks bereikbaar Brevo-formulieradres.
4. Automatische inhoud blijft voorlopig conceptvorming. Native RSS ondersteunt één ontvangerslijst per integratie en geen nieuwe feeditems betekent geen campagne. Losse maandelijkse campagnes per onderwerp garanderen niet maximaal twaalf bezorgingen per persoon. Die mogen dus niet automatisch verzenden.
5. Onderzoek één gezamenlijke editie met voorwaardelijke artikelblokken of strikt gescheiden doelgroep-/voorkeursegmenten binnen Brevo. Alleen bouwen als de accountfunctie en noodzakelijke selectie aantoonbaar beschikbaar zijn. Geen persoonlijke bundeling of volledig automatische frequentiebewaking beloven voordat bewezen.
6. Eerste werkbare vrijgave kan uit automatisch gemaakte conceptcampagnes bestaan die vóór verzending gezamenlijk worden gecontroleerd op overlap, eerdere verzending en twaalf-per-jaar. Dit is geen vervanging van het gewenste einddoel van automatische verzending: die beperking expliciet bespreken zodra de native mogelijkheden zijn vastgesteld.

## Bronnen, gecontroleerd op 7 september 2026

- [Native aanmeldformulier](https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo): dubbele bevestiging, multi-list-keuze, verplichte velden en CAPTCHA-opties.
- [Profielwijzigingsformulier](https://help.brevo.com/hc/en-us/articles/360003644360-Update-your-contacts-details-and-preferences-profile-update-form): voorkeuren/lijsten en contactgebonden links. De werking voor bestaande/afgemelde contacten blijft een echte acceptatieproef.
- [RSS-campagnes](https://help.brevo.com/hc/en-us/articles/360013130059-RSS-Campaign-integration-Automatically-share-your-blog-posts-with-your-subscribers): één lijst per integratie, maximaal tien feedartikelen, maandelijkse controle en conceptmodus. Eigen grens blijft vijf items, fout in plaats van afkappen.

## Status

Geen externe opslag toegevoegd, geen websitewijziging of nieuwsbriefverzending. De goedgekeurde nieuwsbriefvormgeving blijft behouden. Echte testmails vereisen nieuwe toestemming; het eerdere budget van drie DOI-mails is al gebruikt.

Verificatie: het formulier is na `Done` zichtbaar in Brevo > Forms met dezelfde naam en ID. Opgeslagen ontwerp toont Voornaam, Achternaam, E-mailadres, Kies je onderwerpen, Nederlandse toestemming en Inschrijven. De aanvraag-/foutmeldingen zijn na heropenen gecontroleerd. Beide testlijsten zijn keuzelijsten; er is geen verplichte achtergrondlijst geselecteerd. De vormgeving is nog de eenvoudige native proef, niet de definitieve website-integratie.

Blokkade bij ketentest: de browsertool weigert het uitgegeven `sibforms.com`-formulieradres op grond van zijn URL-beveiligingsbeleid. Niet via andere browsertools, HTTP-verzoeken of indirecte formulierinzending omzeilen. De Brevo-beheerpagina blijft bereikbaar. De gebruiker moet het formulier voor de echte proef zelf openen; ontvangen mails en providerstatus kunnen daarna binnen de bestaande toegangsrechten worden gecontroleerd. Er is een vraag gesteld voor maximaal drie nieuwe testmails, maar geen toestemming ontvangen of mail verstuurd op het moment van deze notitie. Zelfs een akkoord op die mails heft de URL-blokkade niet op.
