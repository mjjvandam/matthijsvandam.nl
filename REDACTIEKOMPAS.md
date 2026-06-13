# Redactiekompas matthijsvandam.nl

Dit document helpt om als digitale hoofdredactie koers te houden bij nieuwe pagina's,
artikelen en uitbreidingen van matthijsvandam.nl.

## Redactionele rol

Codex bewaakt structuur, tekstkwaliteit, techniek, vindbaarheid en consistentie. Matthijs
blijft inhoudelijk en medisch eindverantwoordelijk. Nieuwe medische of professionele inhoud
wordt daarom pas publicatierijp na menselijke inhoudelijke review.

## Drie duidelijke sporen

### 1. Patiëntgerichte uitleg

Doel: begrijpelijke algemene uitleg over klachten, aandoeningen, behandelingen en zorgroute.
Dit spoor helpt bezoekers oriënteren, maar is geen patiëntportaal en geeft geen advies op maat.

Voorbeelden:

- `behandelingen.html`
- lokale conceptpagina's in `behandelingen/`
- patiëntgerichte artikelen in `artikelen/`

Redactionele belofte: rustig, concreet, veilig en herkenbaar. De toon mag lijken op betrouwbare
publieksinformatie zoals Thuisarts, maar met eigen orthopedische context.

### 2. Patiëntgerelateerde informatie voor professionals

Doel: achtergrond en praktische samenwerking rond patiëntenzorg, verwijzing, korte lijnen,
netwerkzorg, onderwijs en regionale afstemming.

Voorbeelden:

- `professionals.html`
- professionele artikelen over artrosezorg, leefstijl, voet/enkel, onderwijs en samenwerking

Redactionele belofte: professioneel, persoonlijk waar passend, maar ingebed in vakgroep,
regio en officiële zorgkanalen.

### 3. Niet-patiëntgebonden advies en consultancy

Doel: uitleg over projectadvies, onderwijs, presentaties, implementatiebegeleiding en
sessiebegeleiding buiten individuele patiëntenzorg.

Voorbeelden:

- `advies-consultancy.html`
- onderwijs- en projectartikelen die laten zien waar expertise zit

Redactionele belofte: persoonlijk en deskundig, zonder verwarring met verwijzing, consulten
of patiëntgebonden medische vragen.

## Prioriteit als hoofdredactie

1. Houd de routes op de site helder: patiënt, professional, advies.
2. Bouw patiëntgerichte aandoeningenpagina's eerst offline uit in `behandelingen/`.
3. Publiceer pas wanneer inhoud, beeld, metadata, interne links, sitemap en medische veiligheid
   kloppen.
4. Versterk vindbaarheid door echte zoekvragen te beantwoorden, niet door commerciële SEO-taal.
5. Voeg alleen nieuwe visuele patronen toe wanneer bestaande componenten niet voldoen.

## Vaste opbouw voor aandoeningenpagina's

Gebruik deze structuur als basis. Niet elke pagina hoeft even lang te zijn.

1. **Titel en korte lead**  
   Wat is het probleem, in gewone taal?

2. **Kort samengevat**  
   Drie tot vijf punten die snel oriënteren.

3. **Welke klachten passen erbij?**  
   Beschrijf herkenbare klachten zonder diagnose op afstand te suggereren.

4. **Wat is het?**  
   Anatomie en mechanisme eenvoudig uitleggen.

5. **Onderzoek en diagnose**  
   Wat kan de huisarts, fysiotherapeut, podotherapeut of specialist globaal beoordelen?

6. **Wat kan vaak eerst?**  
   Schoenen, belasting, fysiotherapie, podotherapie, leefstijl of andere niet-operatieve routes,
   zonder behandeladvies op maat.

7. **Wanneer kan orthopedie in beeld komen?**  
   Rustige uitleg over aanhoudende klachten, duidelijke beperkingen, twijfel over diagnose of
   mogelijke operatieve opties.

8. **Welke behandelingen kunnen worden besproken?**  
   Conservatief en operatief, zonder claims en zonder druk richting operatie.

9. **Wat kun je verwachten?**  
   Beloop, herstel en onzekerheden eerlijk beschrijven.

10. **Vragen om met je eigen arts te bespreken**  
    Praktische vragen die helpen bij samen beslissen.

11. **Veiligheidsblok**  
    Geen advies op maat. Bij spoed, alarmsymptomen, afspraken of persoonlijke medische vragen:
    officiële zorgkanalen.

## Vindbaarheid zonder schreeuwerigheid

Elke patiëntgerichte pagina moet ten minste één echte zoekvraag beantwoorden, bijvoorbeeld:

- "pijn grote teen bij afwikkelen"
- "stijve grote teen artrose"
- "enkel blijft zwikken"
- "knieartrose bewegen"
- "pijn onder de bal van de voet"

Controleer per pagina:

- duidelijke `<title>` met diagnose/klacht en gewone term;
- meta description die de zoekvraag samenvat;
- één heldere H1;
- beschrijvende H2's;
- interne links naar verwante behandeling, artikel of route;
- passende structured data wanneer zinvol;
- geen overbelofte in koppen of snippets.

## Eerste redactionele sprint

Werk eerst deze patiëntgerichte cluster offline uit:

1. `behandelingen/hallux-rigidus.html`  
   Status: concept aanwezig. Eerst redactioneel inkorten, beeld/assets controleren en medische review.

2. `behandelingen/mtp-1-artrodese.html`  
   Status: concept aanwezig. Eerst duidelijk scheiden: aandoening versus operatie, en verwachtingen
   rond lopen/schoenen/sport zorgvuldig houden.

3. `behandelingen/hallux-valgus.html`  
   Status: nog maken. Belangrijk voor vindbaarheid en voorvoetroute.

4. `behandelingen/enkelverzwikking-instabiliteit.html`  
   Status: nog maken. Combineer acute verzwikking en chronisch doorzwikken alleen als de structuur
   helder blijft.

5. `behandelingen/knieartrose.html`  
   Status: nog maken. Extra aandacht voor niet-stigmatiserende taal rond gewicht, bewegen en leefstijl.

## Publicatiecheck voor een aandoeningenpagina

Een pagina gaat pas uit de offline conceptmap wanneer:

- de inhoud medisch is nagekeken door Matthijs;
- er geen persoonlijk medisch advies op maat in staat;
- de officiële zorgkanalen duidelijk blijven;
- titel, meta description, canonical, OpenGraph en structured data kloppen;
- beelden bestaan, rustig zijn, anatomisch betrouwbaar zijn en waar nodig watermerk/metadata hebben;
- interne links en anchors werken;
- mobiele weergave op 360, 390, 430, 768 en desktop gecontroleerd is;
- de pagina bewust in navigatie, relevante kaarten en eventueel `sitemap.xml` is opgenomen.

## Toonregels

- Schrijf korter zodra een zin naar beleidstaal neigt.
- Gebruik "kan", "soms", "meestal" en "hangt af van" wanneer medische variatie belangrijk is.
- Vermijd zinnen die sturen naar operatie of afspraak.
- Benoem onzekerheid als die klinisch echt bestaat.
- Schrijf niet over patiënten alsof zij een probleem zijn; beschrijf klachten, context en keuzes.
