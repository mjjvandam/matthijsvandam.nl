# Tijdelijke websitefeedback — lokale uitwerking 24 september 2026

## Doel en bereik

Een rustige, vrijwillige vraag voor bezoekers die vijf verschillende publieke pagina's in hetzelfde browsertabblad hebben bezocht. Een vaste kleine footerlink laat ook andere bezoekers reageren. De campagne loopt tot en met 24 oktober 2026. Daarna verdwijnen de kaart en footerlink vanzelf en stopt `/api/feedback` met het aannemen van berichten. Er komen geen nieuwe accounts, leveranciers, cookies of analyticsgebeurtenissen bij.

De kaart vraagt of iemand vond wat die zocht (ja, gedeeltelijk, nee) en biedt maximaal 500 tekens optionele toelichting. Zij vraagt geen naam of e-mailadres. De tekst sluit medische vragen, afspraken en spoed uit. De bezoeklijst blijft uitsluitend in `sessionStorage`; de keuze om te sluiten of te verzenden staat in `localStorage` voor deze campagne. Geen bezochte URL of browser-ID wordt meegestuurd met de feedback.

Voor lokale vormcontrole kun je op `127.0.0.1` of `localhost` `?feedback-preview=1` aan een pagina-URL toevoegen. Dat toont de kaart ook wanneer de publieke endpoint nog uit staat. De uitzondering werkt niet op publieke domeinen; lokaal versturen vereist nog steeds een werkende test-API.

## Ontvangst en grens

`/api/feedback` gebruikt de bestaande Brevo-API-sleutel en dezelfde geverifieerde afzender als het contactformulier. Eén antwoord wordt als gewone tekstmail naar de bestaande Gmail-mailbox gestuurd. De handler controleert de herkomst, JSON, een honeypot, keuze, lengte, aanvraag-ID en campagne-einde. Een idempotencyKey beperkt dubbele aflevering bij herhaalde verzoeken. Er is geen aparte opslag of automatisch antwoord.

De nieuwe route is standaard uit. Het bestaande Vercel Hobby-project heeft al één actieve limietregel: `Request Path Starts with /api/contact`, maximaal vijf verzoeken per IP per 60 seconden, met 429 als vervolgactie. Hobby staat maar één limietregel per project toe. De regel-editor biedt een OR-groep; voeg daarin `Request Path Starts with /api/feedback` toe en behoud de bestaande contactvoorwaarde, grens en actie. Sla deze live regelwijziging pas op bij goedgekeurde publieke vrijgave. De feedbackwidget onthoudt een positieve beschikbaarheidscheck voor de duur van het browsertabblad, zodat vijf paginaweergaven slechts één GET naar deze route doen en de limiet niet opmaken. Een uitgeschakelde route wordt opnieuw gecontroleerd bij een volgende paginaweergave.

Controleer daarna de regel op beide publieke domeinen en zet pas dan de Production-variabelen `FEEDBACK_EDGE_RATE_LIMIT_VERIFIED=true` en `FEEDBACK_FORM_ENABLED=true`. Controleer ook de bestaande `BREVO_API_KEY`, het resterende mailquotum en ontvangst van één proefantwoord voordat de uitnodiging live wordt gezet. Er is geen extra account of betaald plan nodig. Een 503 van de handler betekent dat de feedbackroute nog niet open is; de kaart blijft dan verborgen. Na 24 oktober sluit de handler vanzelf en verdwijnen kaart en footerlink. Verwijder de tijdelijke assets en paginaverwijzingen in een latere gecontroleerde release.

De privacytekst moet met de kaart en endpoint tegelijk live gaan. Feedback blijft apart van de nieuwsbrief en het professionele contactformulier. Ontvangen toelichtingen kunnen ondanks de waarschuwing ongevraagd persoonlijke gegevens bevatten; behandel en verwijder die volgens de privacytekst, zonder medische beantwoording via deze route.

## Review en vrijgave

Dit is een lokale productwijziging aan bestaande publieke pagina's. ADR-0008 dekt het gebruik van de bestaande maildienst en formuliergrenzen; ADR-0006 dekt de afzonderlijke publieke vrijgave. INVARIANTS §1 en §10 vragen eigenaar-validatie voor de nieuwe contactmogelijkheid en interactieve kaart. Beoordeel tekst, formaat, mobiele weergave en het tijdstip van de uitnodiging voordat een publieke release wordt gedaan. Medische pagina-inhoud, robots, sitemap en publicatiestatus zijn niet aangepast. De lokale bestanden of groene technische checks bewijzen geen livegang.
