# Vervolg nieuwsbrief: bestaande website en Brevo

## Actuele richting — eigenaarbesluit ADR-0013

### Voortgang 8 september 2026

Proefcampagne en correcte afmeldroute:
- Campagne 10 `MVD technische ketenproef - concept - niet verzenden` gemaakt in Brevo met de goedgekeurde vormgeving en expliciete technische plaatsaanduidingen. API-readback: draft, geen geplande datum, geen ontvangerslijsten/segmenten. Niets verzonden.
- Belangrijke correctie: Brevo onderscheidt een openbaar afmeldformulier (eerder gemaakt) van een campagne-afmeldpagina. Daarom werd ID `6a9f8014fd758e360d87d236` terecht door de campagne-API geweigerd. Geen probleem met opslag van het eerdere formulier.
- Juiste campagne-afmeldpagina `6a9f863e2636803b01a6e46c` gemaakt via Settings > Campaigns > Unsubscribe Pages. Titel/tekst/knop Nederlands, native `{email}` behouden. Taal van Brevo's enquête na afmelding op Dutch ingesteld. Geen externe redirect. Met Done opgeslagen.
- Campagne 10 gekoppeld aan deze campagne-afmeldpagina en profielconcept `6a9f1cd5fd758e360d87c8e0`. Zowel API-update geslaagd als de namen na heropenen teruggelezen in Additional settings. Reply-to is mjjvandam@gmail.com. De persoonlijke links worden pas bij de echte proef getest; selectie is geen bewijs van afmelding.
- Bron onderscheid: https://help.brevo.com/hc/en-us/articles/208772629-Customize-an-unsubscribe-page-to-integrate-into-your-email-campaigns . API-specificatie https://developers.brevo.com/reference/create-email-campaign . Payload en statusbewijs lokaal in native/test-campaign*.json; geen sleutels.

Laatste integratiestap:
- `native/build.py` genereert nu vanuit dezelfde markup een netwerkvrije weergave en `native/integration.html` met de native formulieractie en officiële `main.js` uit de volledige Brevo HTML-export. Geen eigen backend of opslag. Deze map blijft uitgesloten van deployment.
- Nederlandse runtime-meldingen, honeypot, expliciete toestemming, naam-/e-mailvalidatie en minimaal één passende onderwerpkeuze opgenomen. Knop blijft uit als de externe runtime niet laadt. Dit gedrag is nog niet met de externe runtime bewezen.
- Native veldcontract gecontroleerd (lijsten 4–8, vereiste namen/e-mail/toestemming, juiste formulieractie en script). JavaScript-syntaxis slaagt. Lokale weergave visueel gezien op 360/390/430 px, inclusief onderwerpkeuzes en naam-/e-mailvelden.
- Matthijs gevraagd uitsluitend te controleren of de knop actief wordt op `http://127.0.0.1:8881/integration.html`, nog niet verzenden. Externe ketenproef staat open door de eerder waargenomen browsertoolbeperking; geen omzeilroute gebruikt.
- Publieke privacyverklaring vermeldt nog dat de nieuwsbrief niet actief is. Bij uiteindelijke vrijgave moet die tekst expliciet worden bijgewerkt; de huidige testcode is geen livevrijgave.

Aanvulling websiteweergave:
- Aanmeldconcept gedupliceerd als formulier `6a9f81effd758e360d87d286` (huidige interne naam begint nog met Copy of). Testlijsten verwijderd; alleen 4, 5, 6, 7 en 8 als expliciete keuzes. Geen achtergrondlijst. Template 9, dubbele bevestiging en Nederlandse meldingen teruggelezen; met Done opgeslagen.
- Brevo Simple HTML-export toont native veld `lists_27[]` met waarden 8/7/5/4/6, FIRSTNAME, LASTNAME, EMAIL en OPT_IN=1. Dit is de bron voor de presentatievelden, niet een zelfbedachte API-koppeling.
- `native/index.html`, `native/style.css`, `native/form.js`: afzonderlijke lokale vormgevingsproef op 127.0.0.1:8881, met doelgroep eerst en passende onderwerpen daarna. Browsercontrole patiënt → voet/enkel aanvinken → professional: patiëntkeuze verdwijnt en wordt gewist; professionele keuzes starten leeg. Geen persoonsgegevens opgeslagen, geen verzending en CSP form-action none. Dit is nog geen verbonden inschrijfformulier.
- De Simple HTML-export waarschuwt dat formuliermeldingen en Brevo-bevestigingspagina's zonder JS niet werken. Daarom nog niet als productie-integratie gebruiken. Volgende implementatiestap: volledige HTML/JS-export gebruiken met behoud van Brevo-meldingen, en een echte proef uitvoeren. Directe sibforms-browsertoegang was eerder door het browserbeleid geblokkeerd; geen alternatieve netwerkroute gebruiken om die proef af te dwingen.
- Desktopvormgeving visueel gecontroleerd. Mobiele breedtes en native integratie nog open. Geen livevrijgave of wijziging aan de publieke site.

- Template 9 geactiveerd als beschikbaar sjabloon en in het bestaande proefformulier geselecteerd; via Settings > Next > Messages > Next > Done opgeslagen. Geen mail aangevraagd.
- Profielconcept `6a9f1cd5fd758e360d87c8e0` aangemaakt en met Done opgeslagen: Mijn nieuwsbriefvoorkeuren, verplichte voornaam/achternaam/e-mail, vijf echte onderwerpen (lijsten 4–8), Opslaan/of/Uitschrijven. Alle onderwerpen worden nu samen getoond; doelgroep-voorselectie nog niet gebouwd. Nederlandse meldingen teruggelezen en native bevestiging template 9 geselecteerd. Niet aan een campagne gekoppeld, geen profielwijziging uitgevoerd.
- Afmeldconcept `6a9f8014fd758e360d87d236` aangemaakt en met Done opgeslagen: Nederlandse titel, uitleg, e-maillabel, knop en succes-/foutmeldingen. Geen follow-upmail. Niet aan een campagne gekoppeld en afmelding nog niet getest.
- Beide formulieren hebben nog de standaard Brevo-opmaak. Website-integratie, definitieve aanmeldkeuzes/doelgroepstap, volledige visuele controle en echte ketenproef blijven open. Geen publieke sitewijziging of verzending uitgevoerd.

Matthijs accepteert het hieronder beschreven oude-linkgedrag en kiest expliciet de eenvoudige native Brevo-route. De conclusie hieronder dat het formulier om die reden niet publiek geïntegreerd mag worden is vervallen; overige tests en afzonderlijke publieke vrijgave blijven wel open. Geen verdere eigen token-/opslagbouw. ADR-0012 is vervangen; de onvoltooide Blob-module is verwijderd. De reeds eerder gebouwde lokale bevestigingsproef blijft uitsluitend historische testcode, geen productieroute.

## Resultaat native proef — 7 september 2026

### Uitvoering vereenvoudiging

- Onvoltooide `blob-confirmation-state.cjs` verwijderd; geen productiecode gebruikte deze module.
- Vercel-projectkoppeling van `mvd-newsletter-confirmation` verwijderd; dashboard bevestigt `No connections yet`. Het lege opslagobject zelf bestaat nog, zonder aansluiting op de website.
- Nieuwe Brevo-template 9 `MVD - native bevestiging - Nederlands` als inactief concept opgeslagen en teruggelezen. Afzender `website@mail.matthijsvandam.nl`, Nederlandse tekst, bestaande groene/crème vormgeving en de native `{{ doubleoptin }}`-link. Bron: `native-confirmation-template.json` en `renderNativeConfirmationMail` in `mail-layout.cjs`.
- Template 9 is nog niet geselecteerd in het proefformulier; bestaande template 5 blijft daar gekoppeld. Geen nieuwe mail verstuurd of publieke nieuwsbrief geactiveerd.
- Volgende stap: template 9 koppelen, definitieve onderwerpen en voorkeuren-/afmeldformulier in Brevo afwerken. De onderstaande oude blokkade is historische testduiding en vervallen volgens ADR-0013.

Deze latere controle vervangt de eerdere status "nog te bewijzen" voor de oude-linkproef. Matthijs heeft de native formulierinzendingen en kliks zelf uitgevoerd. Server-side uitsluitend het eigen testcontact via de Brevo Contacts API gelezen.

1. Voor eerste bevestiging: marketingblokkade actief, eerdere proefnaam ongewijzigd, testlijsten 9/10.
2. Na eerste bevestiging: marketingblokkade opgeheven, fictieve naam Test Nieuwsbrief, uitsluitend testlijst 9.
3. Na tweede aanvraag maar vóór bevestiging: dezelfde bevestigde gegevens en lijst 9 blijven staan.
4. Matthijs meldt opnieuw op de knop in de EERSTE mail te hebben geklikt, terwijl de tweede mail ongebruikt blijft. Daarna toont de API de tweede fictieve naam Test Twee, achternaam test, uitsluitend lijst 10, marketingblokkade uit.

Conclusie: ook deze concrete native formulierroute bindt de gebruikte oude link niet voldoende aan de oorspronkelijke aanvraag voor onze afgesproken eisen. Geen algemene claim over alle Brevo-flows of juridische beoordeling. Native formulier niet publiek integreren. Tweede link niet meer gebruiken. Het testcontact is volgens de laatste controle actief op testlijst 10; niet verwarren met een productieabonnee of een geteste afmeldroute. Twee native bevestigingsmails door de gebruiker aangevraagd; geen extra agent-verzending.

Vervolgonderzoek: zie ADR-0012. Geen nieuwe opslag of gewijzigde bevestigingsroute geactiveerd.

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
