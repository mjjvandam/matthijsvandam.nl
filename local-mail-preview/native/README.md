# Native Brevo website-integratie — voorbereiding

Status: lokale integratie, nog niet publiek. Aanmelding, voorkeurwijziging en afmelding met het bestaande eigen testcontact gecontroleerd; zie actuele status hieronder.

## Bestand en gedrag

- `build.py` maakt `index.html` (geen netwerk/verzending) en `integration.html` (echte native Brevo-runtime en formulieractie).
- Beide gebruiken dezelfde formuliermarkup en lokale vormgeving. De integratie heeft geen eigen backend, API-sleutel, opslag of bevestigingstokens.
- `form.js` kiest patiënt/professional, wist niet-passende onderwerpen en controleert minstens één keuze, geldige e-mail, niet-lege namen en toestemming voordat Brevo de aanvraag verwerkt.
- `brevo-settings.js` bevat uitsluitend publieke Nederlandse meldingen en de officiële runtime-instellingen uit de HTML-export.
- `enable-native.js` registreert vóór het deferred Brevo-script rechtstreeks load/error-listeners. Succesvol laden maakt verzenden mogelijk. Bij een laadfout of na 15 seconden wachten blijft de knop uit met een expliciete foutmelding; een later alsnog geslaagde download herstelt de knop.
- De honeypot `email_address_check` uit Brevo is behouden. Dit is geen bewijs van voldoende provider-rate-limiting.
- De doelgroep is een leeskeuze; de gekoppelde onderwerp-lijst bepaalt de doelgroep van artikelen. Geen medische gegevens invullen.

## Providerbron

Brevo-formulier: `6a9f81effd758e360d87d286`.
HTML-export op 8 september 2026 gelezen via Brevo > Share > HTML.
Velden: FIRSTNAME, LASTNAME, EMAIL, OPT_IN=1, lists_27[], email_address_check, locale.
Lijsten: 4 voet/enkel professionals; 5 voet/enkel patiënten; 6 algemeen; 7 cohort professionals; 8 cohort patiënten.
Native script: https://sibforms.com/forms/end-form/build/main.js.
Template 9 voor dubbele bevestiging staat in het formulier geselecteerd. Geen automatische achtergrondlijst.

## Huidige controle

- 12 september, laadherstel: het blijven hangen is gereproduceerd met een lokaal scriptfixture in de werkelijk gegenereerde HTML. De oude window-listener liet de knop ook na een succesvolle download uit. Directe scriptlisteners herstellen dit; alle acht geïsoleerde browsertests slagen, inclusief succesvolle en mislukte download. Het fixture bevat geen Brevo-code; echte providerverwerking blijft afzonderlijk te controleren. Matthijs heeft inmiddels met een screenshot bevestigd dat de eerdere integratie bleef laden. Vernieuwen met deze reparatie is de volgende controle.

- 12 september: zes geïsoleerde Chromium-tests geslaagd (`form.test.cjs`). Alle netwerkverzoeken afgebroken; uitsluitend onze lokale invoercontrole getest. Dekt ontbrekende doelgroep, minimaal één onderwerp, wissen/uitsluiten van niet-passende lijsten, namen met alleen spaties, geldige veldgegevens en ontbrekende provider-load. Een gevonden focus-/change-fout is hersteld: de naamfoutmelding blijft nu zichtbaar bij focusverplaatsing. Dit is geen bewijs van native Brevo-verwerking of bezorging.
- Voor deze machine gebruikt de test de gebundelde Playwright-installatie; de beschikbare headless-browser is via `MVD_TEST_BROWSER` ingesteld op `/Users/matthijsvandam/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`. Tests liepen buiten de macOS-sandbox na toolgoedkeuring. Geen nieuwe software geïnstalleerd.

- Gegenereerde HTML en JavaScript-syntaxis gecontroleerd.
- De netwerkvrije versie in browser gezien op 360, 390 en 430 px, inclusief doelgroepkeuze; bovenste formuliergedeelte zonder zichtbare clipping.
- De externe Brevo-runtime en echte verzending zijn niet door deze controle bewezen. Eerder blokkeerde de browsertool toegang tot sibforms; niet via een alternatieve netwerkroute omzeilen.
- Eerst moet Matthijs in zijn browser vaststellen of `integration.html` goed laadt. Daarna een expliciet afgesproken testaanmelding, ontvangen mail/klik, API-readback, voorkeurwijziging en afmelding controleren.
- Formulierberichten, runtime-foutgedrag, mobiele onderzijde, bevestigingspagina en provider-spamcontrole blijven te controleren.
- Proefcampagne 10 is opgeslagen als draft zonder ontvangers of geplande verzending. Het profielconcept en de juiste campagne-afmeldpagina zijn gekoppeld en na heropenen in Brevo teruggelezen. Afmeldpagina-ID: `6a9f863e2636803b01a6e46c`; het eerder gemaakte losse website-afmeldformulier is hiervoor niet geschikt. Beide persoonlijke links moeten nog echt worden getest.

## Openstaande vrijgave

Actuele stand op 13 september 2026: Matthijs bevestigt ook in deze taak dat de
herstelde websiteaanmelding werkt. Het verslag `../editions/2026-01/REVIEW.md`
bevat daarnaast de ontvangen testmail, bevestigde lijstwijziging en uiteindelijke
campagne-afmelding van het bestaande eigen testcontact. Deze tests niet herhalen
alsof ze nog ontbreken. De twee afmeldroutes zijn kort na elkaar gebruikt; hun
afzonderlijke timing is daarmee niet bewezen.

Nog open: eerste aanmelding van een geheel nieuw contact, Nederlandse afronding,
live artikel-/beeldcontrole, distributieakkoord en jaarlijkse frequentiebewaking.
Automatische verzending blijft uit; een inschrijfformulier live zetten en een
campagne versturen zijn afzonderlijke vrijgaven.

Brevo-instellingen opnieuw gelezen op 13 september: template “MVD - native
bevestiging - Nederlands” staat geselecteerd; dubbele bevestiging blijft aan.
De optionele pagina na de bevestigingsklik biedt alleen “Default Thank You Page”
of een eigen URL. Er is geen Nederlandse pagina in die keuzelijst. Het onderzochte
vinkje teruggezet op de oorspronkelijke uitstand; geen wijziging opgeslagen.
Voor een eigen Nederlandse afronding moet een bereikbare pagina worden voorbereid
en bij de afzonderlijke websitevrijgave worden gekoppeld. Geen localhost-URL in
Brevo instellen. Het voorkeurformulier toont de bijgewerkte doelgroepteksten en
“Opslaan”; de eerder gemelde Engelse afmeldknop is niet in deze ontwerpweergave
zichtbaar en nog niet als vertaald aangemerkt.

## Herbouwen / lokaal openen

`python3 local-mail-preview/native/build.py`

`python3 -m http.server 8881 --bind 127.0.0.1 --directory local-mail-preview/native`

Websitevrijgave is een afzonderlijke laatste stap. Deze map staat onder de bestaande uitgesloten `local-mail-preview/`-map. Geen publieke bestanden gewijzigd.

## Aanvulling 12/13 september 2026: eerste verbonden proef

De nieuwere resultaten staan in ../editions/2026-01/REVIEW.md. Matthijs heeft de
websiteaanmelding en bevestigingsklik uitgevoerd. Eén Nederlandse bevestigingsmail
ontvangen in Gmail, en na bevestiging lijst #7 bij bestaand Brevo-contact 1 teruggelezen.
De aanmeldketen voor dit bestaande adres is dus bewezen; eerdere notities over een geheel
onbewezen providerketen zijn voor dit onderdeel achterhaald. Bevestigingspagina nog Engels.
Voorkeuren, afmelding en de technische campagne staan nog open; Mac is vergrendeld.
Native frequentiecap vraagt Upgrade in het huidige account. Geen upgrade of activering.

## Doelgroepwoorden — 13 september 2026

Op verzoek van Matthijs gebruikt de lokale aanmeldproef nu “Ik ben patiënt” en
“Ik werk in de zorg”, onder “Wat past bij jou?”. Generator, beide HTML-uitvoeren
en de begeleidende keuzezin zijn aangepast; technische audience-waarden en lijst-IDs
blijven gelijk. Gerenderde labels gecontroleerd in de lokale browser.
Brevo-voorkeurformulier toont nog de oude gecombineerde labels; bewerking van die
tekst is niet opgeslagen doordat native computerbediening noWindowsAvailable meldt.
Volgende wijziging: zichtbare suffixen “voor patiënten” naar “ik ben patiënt” en
“voor zorgprofessionals” naar “ik werk in de zorg” in beide native formulieren,
zonder lijst-IDs of inschrijvingen te wijzigen. Geen mails verstuurd of publieke
inschrijving geactiveerd.

### Afgerond in Brevo — 13 september 2026

Na aanmelding door Matthijs in de ingebouwde browser zijn de vier zichtbare
doelgroeplabels aangepast en opgeslagen in het native aanmeldformulier
6a9f81effd758e360d87d286 en voorkeurformulier 6a9f1cd5fd758e360d87c8e0.
De keuzes luiden nu per onderwerp “Ik ben patiënt” en “Ik werk in de zorg”.
Voorkeurformulier opnieuw geopend en alle vier labels teruggelezen.
Alleen zichtbare formulierteksten gewijzigd; interne lijstnamen, lijstkeuzes,
bevestiging en inschrijvingen ongewijzigd. Geen testmail of publieke activering.
Het eerdere openstaande punt over deze labels is hiermee afgehandeld.

## Nederlandse afronding voorbereid — 13 september 2026

`bevestigd.html` is een lokale, statische voorbeeldpagina voor uitsluitend de
succesvolle Brevo-bevestigingsklik. Geen tokens, contactgegevens, scripts, API of
wijzigingen aan inschrijvingen. De pagina zelf verifieert geen inschrijving en
mag pas na een succesvolle provideractie als afronding worden gebruikt.
Bij vrijgave: lokale voorbeeldmelding verwijderen, definitieve publieke URL
controleren en die bij beide toepasselijke Brevo-formulieren koppelen. Niet naar
localhost verwijzen en geen fout-/verlopen-linkroute naar deze pagina leiden.

Ontwerpimpact: geen catalogusmatch op native/style.css; handmatig vastgesteld dat
alleen de bestaande uitgesloten native-proefstijl wordt hergebruikt. Geen CSS of
publieke component gewijzigd. Bewuste bestaande uitzondering: deze nieuwsbriefproef
blijft licht, ook bij donkere systeemvoorkeur, passend bij de goedgekeurde mailstijl.
Gecontroleerd op 360/390/430/1000 px, lichte en donkere voorkeur, zonder horizontale
overloop; screenshot op 390 px visueel bekeken. Designsysteemcontrole slaagt.
ADR-0013 dekt deze lokale voorbereiding; geen nieuwe ADR of medische review nodig.
Publieke vrijgave en koppeling blijven open. Geen nieuwe mail verzonden.

## Eigen bevestigingspagina uitgewerkt — 19 september 2026

De publieke bron is nu voorbereid als `../../nieuwsbrief-bevestigd.html`. Deze
Nederlandstalige pagina hergebruikt de gewone siteheader, vormtaal en de drie
recentste geverifieerde artikelkaarten uit `content.js`. De pagina verwerkt of
toont geen abonneegegevens en blijft `noindex, follow`; hij staat niet in de
sitemap. De eerdere `bevestigd.html` in deze map blijft alleen het historische
lokale voorbeeld en is niet de bron voor vrijgave.

Lokale browsercontrole van de nieuwe bron slaagt op 360, 390, 430 en 1200 px,
in lichte en donkere kleurvoorkeur, zonder horizontale overloop of JavaScript-
fouten. Brevo is nog niet gewijzigd. Eerst de nieuwe pagina deployen en de
publieke URL controleren; pas daarna kan in het native aanmeldformulier de
bevestigingspagina na de validatieklik worden gekoppeld. Een lokale pagina of
geslaagde controle is geen livebewijs.

## Livegang en Brevo-koppeling afgerond — 19 september 2026

De bevestigingspagina is via pull request 1 samengevoegd naar `main`. Vercel-
productiedeployment `dpl_BDGGWFCk1sHyukT6mZX35StVoPJi` is `READY`; de publieke
URL `https://www.matthijsvandam.nl/nieuwsbrief-bevestigd.html` geeft HTTP 200 en
toont de Nederlandse bevestiging en drie recente artikelen. De pagina blijft
`noindex, follow` en staat niet in de sitemap.

In Brevo-formulier `6a9f81effd758e360d87d286` is na de validatieklik de eigen
publieke bevestigings-URL ingesteld en opgeslagen. Daarna is de instelling
opnieuw geopend en teruggelezen: dubbele bevestiging en template
`MVD - native bevestiging - Nederlands` zijn actief en de opgeslagen URL is
exact `https://www.matthijsvandam.nl/nieuwsbrief-bevestigd.html`. Er is geen
testmail verstuurd en geen nieuwe inschrijving aangemaakt.
