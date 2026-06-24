Aan: Mjjvandam@gmail.com
Onderwerp: Wekelijkse hoofdredactie sitecheck matthijsvandam.nl

Korte samenvatting
De wekelijkse hoofdredactie-sitecheck op de lokale statische site is uitgevoerd. De algemene technische basis bleef schoon, maar acht gepubliceerde pagina's blijken lokaal gewijzigd sinds hun laatste menselijke verificatie en zijn daarom teruggezet naar `review_nodig` in het publicatieregister.

Uitgevoerde wijzigingen
- `tools/check_publication_verification.py` uitgebreid zodat lokaal gewijzigde gepubliceerde pagina's voortaan automatisch worden gesignaleerd.
- `PUBLICATIE_REGISTER.json` bijgewerkt: acht lokaal gewijzigde gepubliceerde pagina's staan nu op `review_nodig`.

Belangrijkste aandachtspunten
- Acht gepubliceerde pagina's vragen opnieuw menselijke review voordat een volgende publicatieronde verantwoord is:
  - `professionals.html`
  - `advies-consultancy.html`
  - `artikelen/vaillant-fonds-digitaal-zorgpad.html`
  - `artikelen/probleemgeorienteerd-denken-orthopedie-boekbijdrage.html`
  - `artikelen/mobility-clinic-tilburg-patienten.html`
  - `artikelen/mobility-clinic-tilburg-professionals.html`
  - `projecten/we-walk.html`
  - `projecten/3d-planning-voet-enkel.html`
- Op meerdere van deze pagina's wijkt de huidige `<title>` af van de titel in het publicatieregister.
- Volledige visuele mobiele audit en browser-consolecontrole konden in deze run niet worden afgerond door lokale poort/WebDriver-beperkingen.

Menselijke review nodig
Ja.

Eventuele vervolgstappen
- Loop de acht gemarkeerde pagina's inhoudelijk en metadata-technisch na.
- Beslis per pagina of het bestand of het publicatieregister leidend moet zijn voor titel/positionering.
- Herhaal daarna de publicatieverificatie en een visuele mobiele check.
