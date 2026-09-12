# Laatste routineverslagen in het dashboard — 10 september 2026

Op verzoek van Matthijs tonen routinekaarten direct de verslagdatum en maximaal drie korte regels: Gedaan, Uitkomst en Vervolg. Het startdashboard bevat per routine één terugblikregel. De weekcheck en APK hebben een lokale leesversie van het verslag.

Gewijzigd: `local-admin/inventory.py`, `server.py`, `ui/app.js`, `ui/app.css`, `README.md`; toegevoegd: `routine-recaps.json` en `test_routine_recaps.py`. Het ontwerpdocument is aangevuld. De README-bronversies van de twee betrokken beheertaken zijn na herbeoordeling bijgewerkt. Deze lokale uitbreiding valt onder het geaccepteerde ADR-0014; geen nieuw besluit nodig.

## Blocking issues

Geen gevonden.

## Non-blocking issues

De bewaartermijnroutine heeft geen gevonden uitvoeringsverslag en toont daarom geen verzonnen resultaat. De artikelroutine heeft alleen een gedateerde private runnotitie, geen volledig runverslag in de repository; deze notitie wordt niet integraal aangeboden.

## Drift-risico's

Terugblikken beschrijven het gedateerde verslag. De artikelrun van 6 september vroeg nog review; de samenvatting verwijst ook naar Matthijs' latere akkoord van 7 september in het register. De APK-samenvatting presenteert inmiddels opgeloste validatorruis niet opnieuw als actuele fout. Actuele vervolgacties blijven bij Nog te doen.

De drie terugblikken zijn gebonden aan de exacte inhoud van het nieuwste verslag of runblok. Bij gewijzigde of nieuwe broninhoud verdwijnen oude samenvattingsregels en verschijnt een melding dat de terugblik moet worden bijgewerkt. Aanvullende bronnen, zoals het register voor later akkoord, worden eveneens gecontroleerd. Nieuwe samenvattingen vragen herlezing van de bron; er is geen autonome tekstgenerator of gewijzigde automation toegevoegd.

## Concrete herstelacties

De oude uitklapsectie met alleen datum en technische toelichting is vervangen door een direct zichtbare terugblik. Toelichting op de planning blijft ingeklapt. De bronleesroute accepteert uitsluitend de twee bekende verslagroutines, vereist een lokale sessie, leest alleen het nieuwste toegestane repositoryverslag, ontsmet de HTML-weergave en laat correspondentiegegevens en private technische gegevens weg. Er is geen leesroute voor automation-memorybestanden of willekeurige paden.

## Checks uitgevoerd

- Alle 49 lokale beheertests geslaagd, waaronder acht nieuwe controles voor actuele/verouderde/ontbrekende terugblikken, aanvullende bronnen, toegestane verslagroutes, sessievereiste, HTML-escaping, persoonlijke gegevens en padgrenzen.
- Actuele data teruggelezen: weekcheck, artikelroutine en APK hebben ieder drie regels; de bewaartermijnroutine heeft geen uitvoeringsverslag.
- Browser: terugblikken zichtbaar zonder openklappen; één regel per routine op het startdashboard. Weekverslag als leesbare lokale pagina geopend.
- Mobiel: routinekaart op 360 en 430 px, startdashboard op 390 px; geen horizontale overloop. Verslagleesversie op 360 px zonder horizontale overloop. Normale browserweergave ook visueel gecontroleerd.
- JavaScript-syntax en `git diff --check` geslaagd. Er is geen npm-check in deze statische site.

## Niet geverifieerd

Geen nieuwe routine uitgevoerd, planning of automation gewijzigd, mail verzonden, publieke inhoud aangepast of gepubliceerd. Scheduleruitvoering en nieuwe bronuitkomsten zijn hiermee niet bewezen. Medische/professionele inhoud en bestaande publicatiestatus blijven ongewijzigd; geen nieuwe medische eigenaarreview nodig voor deze lokale dashboardwijziging.
