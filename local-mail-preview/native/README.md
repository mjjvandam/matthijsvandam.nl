# Native Brevo website-integratie — voorbereiding

Status: lokale integratiecode, nog niet publiek of end-to-end bewezen.

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

De eerstvolgende noodzakelijke externe controle is het laden van `integration.html` in de browser van Matthijs. Matthijs meldde met een screenshot dat de oude versie bleef laden. De lokale laadcontrole is inmiddels hersteld en getest; de vernieuwde versie moet nog met de echte provider worden gecontroleerd. Dezelfde browsertoolbeperking is tijdens opeenvolgende vervolgrondes blijven gelden; geen alternatieve route gebruikt. De lokale URL geeft HTTP 200, maar dat bewijst niet dat het externe Brevo-script werkt.

Daarna volgen: één afgesproken echte testaanmelding en bevestigingsmail, controle van gekozen lijsten, wijziging/verwijdering van voorkeuren en uitschrijving via de proefcampagne. Pas na die resultaten de integratie corrigeren waar nodig, publieke privacytekst afwerken en livevrijgave vragen. Automatische nieuwsbrieven, frequentiecontrole en subtiele website-uitnodigingen blijven vervolgwerk; niets hiervan als voltooid aanmerken.

## Herbouwen / lokaal openen

`python3 local-mail-preview/native/build.py`

`python3 -m http.server 8881 --bind 127.0.0.1 --directory local-mail-preview/native`

Websitevrijgave is een afzonderlijke laatste stap. Deze map staat onder de bestaande uitgesloten `local-mail-preview/`-map. Geen publieke bestanden gewijzigd.
