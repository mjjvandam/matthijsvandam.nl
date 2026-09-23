# Nederlandse bevestiging bij voorkeurenwijziging — 23 september 2026

## Bevinding en wijziging

Matthijs meldt een Engelse eindmelding na het bevestigen van gewijzigde nieuwsbriefvoorkeuren vanuit de mail. In de ingelogde Brevo-editor van profielwijzigingsformulier `6a9f1cd5fd758e360d87c8e0` stond de Nederlandse mailtemplate geselecteerd, maar geen eindpagina na de validatielink.

De optie “Confirmation page after clicking on the validation link in the email” ingeschakeld met URL `https://www.matthijsvandam.nl/nieuwsbrief-bevestigd.html`. Via Next, Next, Done opgeslagen. Na heropenen de geselecteerde optie en exacte URL teruggelezen. Double confirmation email en Nederlandse template behouden; extra eindbevestigingsmail blijft uit. Nederlandstalige aanvraag- en foutmeldingen ongewijzigd.

## Controles en beperkingen

- De bestaande publieke Nederlandse bestemming rechtstreeks in de browser gecontroleerd: “Je inschrijving is bevestigd”, gekozen onderwerpen, maximaal 12 keer per jaar, voorkeuren-/afmeldverwijzing.
- Geen nieuwe mail verzonden, geen abonnement of voorkeur van een contact gewijzigd.
- Geen volledige ketentest vanuit een nieuwe bevestigingsmail uitgevoerd. Bestaande werktaak blijft open voor die nacontrole en eerdere overige testpunten.
- Bestaande bevestigingspagina hergebruikt; titel spreekt over inschrijving, niet afzonderlijk over een voorkeurenwijziging.
- Alleen bestaande native Brevo-configuratie aangepast binnen ADR-0013. Geen nieuwe ADR, websitepublicatie, medische inhoud of medische goedkeuring.

## Ter kennisname

De ontbrekende Nederlandse eindbestemming voor voorkeurenwijzigingen is gekoppeld. De opgeslagen configuratie is gecontroleerd; daadwerkelijke aankomst na een nieuwe mailbevestiging blijft open.
